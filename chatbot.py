import os
import pandas as pd
import spacy
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from openai import OpenAI
from dotenv import load_dotenv
from collections import deque
from spacy.matcher import PhraseMatcher
from knowledge import menu_items, locations

load_dotenv()
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], allow_credentials=True,
    allow_methods=["*"], allow_headers=["*"],
)

nlp = spacy.load("en_core_web_sm")
intent_nlp = spacy.load("models/intent_textcat")  # trained textcat model

matcher = PhraseMatcher(nlp.vocab, attr="LOWER")
all_menu_items = [item for sub in menu_items.values() for item in sub]
matcher.add("MENU_ITEMS", [nlp.make_doc(item) for item in all_menu_items])

conversations: dict[str, deque] = {}     
session_actions: dict[str, dict] = {}  
HISTORY_LIMIT = 6

orders_df = pd.read_csv("data/piccadilly_orders.csv")

system_prompt = (
    "You are the official chatbot for Piccadilly Restaurants. "
    "Assist users with menu, ordering, catering, locations, hours, and promotions."
)

def spacy_detect_intent(text: str) -> str:
    doc = intent_nlp(text)
    intent, score = max(doc.cats.items(), key=lambda kv: kv[1])
    return intent if score >= 0.7 else "OUT_OF_SCOPE"

def extract_entities_and_intent(text: str) -> dict:
    doc = nlp(text.lower())
    # menu hits
    menu_hits = {doc[start:end].text for _, start, end in matcher(doc)}
    # location hits via substring or first-token
    txt = text.lower()
    loc_hits = set()
    for city in locations:
        low = city.lower()
        if low in txt or low.split()[0] in txt:
            loc_hits.add(city)
    # spaCy GPE fallback
    for ent in doc.ents:
        if ent.label_ == "GPE":
            for city in locations:
                if ent.text.lower() in city.lower():
                    loc_hits.add(city)
    # quick keyword intent
    detected = None
    for intent, kws in {
        "MENU": ["menu", "dishes", "specials"],
        "ORDER_HISTORY": ["history", "last order", "previous order"],
        "LOCATION": ["store", "location", "nearby", "address"],
        "CATERING": ["catering", "event"],
        "HOURS": ["hours", "open", "close"],
        "GREETING": ["hello", "hi", "hey"],
        "GOODBYE": ["bye", "see you"],
        "THANKS": ["thanks", "thank you"],
    }.items():
        if any(kw in txt for kw in kws):
            detected = intent
            break
    return {"intent": detected, "menu_items": list(menu_hits), "locations": list(loc_hits)}

def get_last_order(user_id: str) -> str:
    df = orders_df[orders_df["user_id"] == user_id]
    if df.empty:
        return "I couldn't find any previous orders for you."
    last = df.sort_values("date", ascending=False).iloc[0]
    return (
        f"Your last order was on {last['date']} at {last['location']}. "
        f"It included: {last['items']}. Would you like to reorder?"
    )

@app.post("/chat")
async def chat(request: Request):
    data = await request.json()
    user_msg = data.get("message", "")
    session = data.get("session_id", "default_user")

    pending = session_actions.get(session)
    if pending and pending["type"] == "LIST_LOCATIONS":
        if user_msg.strip().lower() in {"yes", "y", "sure", "please", "yeah"}:
            lines = [f"- {loc}" for loc in pending["data"]]
            reply = "Here are all our locations:\n" + "\n".join(lines)
        else:
            reply = "No problem—let me know if there’s anything else I can help with!"
        session_actions.pop(session, None)
        hist = conversations.setdefault(session, deque(maxlen=HISTORY_LIMIT))
        hist.append({"role": "user", "content": user_msg})
        hist.append({"role": "assistant", "content": reply})
        return {"reply": reply}

    parsed = extract_entities_and_intent(user_msg)
    locs = parsed["locations"]

    if locs:
        city = locs[0]
        state = city.split(",")[-1].strip()   # e.g. "VA" or "LA"
        all_in_state = [c for c in locations if c.endswith(state)]
        if not all_in_state:
            reply = f"Sorry, Piccadilly does not currently have any locations in {state}."
            hist = conversations.setdefault(session, deque(maxlen=HISTORY_LIMIT))
            hist.append({"role": "user", "content": user_msg})
            hist.append({"role": "assistant", "content": reply})
            return {"reply": reply}
        # otherwise queue a follow-up
        session_actions[session] = {"type": "LIST_LOCATIONS", "data": all_in_state}
        reply = (
            f"Yes—we have {len(all_in_state)} locations in {state}. "
            "Would you like me to list them all?"
        )
        hist = conversations.setdefault(session, deque(maxlen=HISTORY_LIMIT))
        hist.append({"role": "user", "content": user_msg})
        hist.append({"role": "assistant", "content": reply})
        return {"reply": reply}

    cat = spacy_detect_intent(user_msg)
    if cat == "GREETING":
        return {"reply": "Hello! 👋 How can I assist you with Piccadilly today?"}
    if cat in ("ORDER_HISTORY", "REORDER"):
        reply = get_last_order(session)
        hist = conversations.setdefault(session, deque(maxlen=HISTORY_LIMIT))
        hist.append({"role": "user", "content": user_msg})
        hist.append({"role": "assistant", "content": reply})
        return {"reply": reply}
    if cat == "MENU":
        menu_list = ", ".join(all_menu_items)
        return {"reply": f"Our menu includes: {menu_list}. What would you like to order?"}
    if cat == "CATERING":
        return {"reply": "We offer catering for events of 60–600 guests. Interested?"}
    if cat == "HOURS":
        return {"reply": "Most locations are open daily 11 AM–8 PM. Need specific store hours?"}
    if cat == "THANKS":
        return {"reply": "You’re welcome! Anything else I can help with?"}
    if cat == "GOODBYE":
        return {"reply": "Goodbye! Have a great day!"}
    if cat == "OUT_OF_SCOPE":
        return {"reply": "I can help with menu, orders, locations, hours, and catering 😊"}

    hist = conversations.setdefault(session, deque(maxlen=HISTORY_LIMIT))
    messages = [{"role": "system", "content": system_prompt}, *hist, {"role": "user", "content": user_msg}]
    res = client.chat.completions.create(model="gpt-3.5-turbo", messages=messages)
    reply = res.choices[0].message.content.strip()
    hist.append({"role": "user", "content": user_msg})
    hist.append({"role": "assistant", "content": reply})
    return {"reply": reply}

def start():
    import uvicorn
    print("🔵 Chatbot server running on http://0.0.0.0:8000")
    uvicorn.run("chatbot:app", host="0.0.0.0", port=8000, reload=True)

if __name__ == "__main__":
    start()