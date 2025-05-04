import random
import json
import spacy
from spacy.training.example import Example
from spacy.util import minibatch, compounding

# Path to your training data
TRAIN_DATA_PATH = "data/intent_training.jsonl"
# Output path for the trained spaCy model
MODEL_OUTPUT_DIR = "models/intent_textcat"

# 1. Load training data, skipping invalid lines
TRAIN_DATA = []
with open(TRAIN_DATA_PATH, "r") as f:
    for lineno, line in enumerate(f, start=1):
        raw = line.strip()
        if not raw or raw.startswith("#"):
            continue
        try:
            obj = json.loads(raw)
            TRAIN_DATA.append((obj["text"], {"cats": obj["cats"]}))
        except json.JSONDecodeError as e:
            print(f"⚠️ Skipping invalid JSON on line {lineno}: {e}")

# 2. Create a blank English model
nlp = spacy.blank("en")

# 3. Add the TextCategorizer to the pipeline
# Use default architecture; adjust threshold if desired
textcat = nlp.add_pipe(
    "textcat",
    config={"threshold": 0.5}
)

# 4. Define all intent labels
LABELS = [
    "GREETING",
    "MENU",
    "ORDER_HISTORY",
    "LOCATION",
    "ORDER",
    "REORDER",
    "CATERING",
    "HOURS",
    "PROMOTIONS",
    "REWARDS",
    "THANKS",
    "GOODBYE",
    "OUT_OF_SCOPE",
]
for label in LABELS:
    textcat.add_label(label)

# 5. Initialize the pipeline
optimizer = nlp.initialize()

# 6. Training loop
n_epochs = 100
for epoch in range(n_epochs):
    random.shuffle(TRAIN_DATA)
    losses = {}
    batches = minibatch(TRAIN_DATA, size=compounding(4.0, 32.0, 1.001))
    for batch in batches:
        texts, annotations = zip(*batch)
        examples = []
        for text, annot in zip(texts, annotations):
            doc = nlp.make_doc(text)
            examples.append(Example.from_dict(doc, annot))
        nlp.update(
            examples,
            sgd=optimizer,
            drop=0.2,
            losses=losses
        )
    print(f"Epoch {epoch+1}/{n_epochs} - Loss: {losses.get('textcat', 0.0):.3f}")

# 7. Save the trained model
nlp.to_disk(MODEL_OUTPUT_DIR)
print(f"Saved intent model to {MODEL_OUTPUT_DIR}")
