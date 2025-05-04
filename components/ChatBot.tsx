import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Keyboard,
  Image,
  ActivityIndicator,
} from 'react-native';
import { MessageSquare, Send, X } from 'lucide-react-native';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text:
        'Welcome to Piccadilly! I can help you with our menu, locations, catering, and more. What would you like to know?',
      isUser: false,
      timestamp: new Date(),
    },
  ]);
  const [isThinking, setIsThinking] = useState(false);

  const chatAnimation = useRef(new Animated.Value(0)).current;
  const scrollViewRef = useRef<ScrollView>(null);
  const isMounted = useRef(true);

  useEffect(() => () => { isMounted.current = false }, []);

  useEffect(() => {
    Animated.spring(chatAnimation, {
      toValue: isOpen ? 1 : 0,
      useNativeDriver: false,
    }).start();
  }, [isOpen]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  const toggleChat = () => setIsOpen(!isOpen);

  const handleSendMessage = async () => {
    if (!message.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      text: message,
      isUser: true,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, newMessage]);
    setMessage('');
    setIsThinking(true);

    try {
      const res = await fetch('http://127.0.0.1:8000/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message, session_id: 'default_user' }),
      });
      const data = await res.json();

      if (isMounted.current) {
        const botMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: data.reply,
          isUser: false,
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, botMessage]);
      }
    } catch (err) {
      console.error('❌ Error talking to chatbot API:', err);
      if (isMounted.current) {
        setMessages((prev) => [
          ...prev,
          {
            id: (Date.now() + 2).toString(),
            text:
              "Oops! Something went wrong while contacting our assistant. Please try again later.",
            isUser: false,
            timestamp: new Date(),
          },
        ]);
      }
    } finally {
      setIsThinking(false);
    }
  };

  const formatTime = (date: Date) =>
    date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  const chatContainerStyle = {
    ...styles.chatContainer,
    width: chatAnimation.interpolate({ inputRange: [0, 1], outputRange: [60, 320] }),
    height: chatAnimation.interpolate({ inputRange: [0, 1], outputRange: [60, 480] }),
    borderRadius: chatAnimation.interpolate({ inputRange: [0, 1], outputRange: [30, 16] }),
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.keyboardAvoidingView}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 80 : 0}
    >
      <Animated.View style={chatContainerStyle}>
        {isOpen ? (
          <View style={styles.chatContent}>
            <View style={styles.chatHeader}>
              <Image
                source={{
                  uri:
                    'https://www.piccadilly.com/wp-content/themes/piccadilly2020/images/piccadilly-logo.png',
                }}
                style={styles.logo}
              />
              <TouchableOpacity onPress={toggleChat} style={styles.closeButton}>
                <X size={20} color="#fff" />
              </TouchableOpacity>
            </View>

            <ScrollView
              ref={scrollViewRef}
              style={styles.messagesContainer}
              contentContainerStyle={styles.messagesContent}
            >
              {messages.map((msg) => {
                // detect the special "menu list" response
                if (!msg.isUser && msg.text.startsWith('Our menu includes:')) {
                  // strip the prefix, split on commas, trim
                  const items = msg.text
                    .replace('Our menu includes:', '')
                    .split(',')
                    .map((i) => i.trim().replace(/\.$/, ''));
                  return (
                    <View key={msg.id} style={styles.menuCard}>
                      <Text style={styles.menuTitle}>Our Menu</Text>
                      {items.map((item, idx) => (
                        <Text key={idx} style={styles.menuItem}>
                          • {item}
                        </Text>
                      ))}
                      <Text style={styles.menuFooter}>What would you like to order?</Text>
                    </View>
                  );
                }

                return (
                  <View
                    key={msg.id}
                    style={[
                      styles.messageBubble,
                      msg.isUser ? styles.userMessage : styles.botMessage,
                    ]}
                  >
                    <Text style={styles.messageText}>{msg.text}</Text>
                    <Text style={styles.messageTime}>{formatTime(msg.timestamp)}</Text>
                  </View>
                );
              })}

              {isThinking && (
                <View style={[styles.messageBubble, styles.botMessage]}>
                  <ActivityIndicator color="#006B3F" size="small" />
                </View>
              )}
            </ScrollView>

            <View style={styles.inputContainer}>
              <TextInput
                value={message}
                onChangeText={setMessage}
                style={styles.input}
                placeholder="Ask anything..."
                returnKeyType="send"
                onSubmitEditing={handleSendMessage}
              />
              <TouchableOpacity onPress={handleSendMessage} disabled={!message.trim()}>
                <Send size={20} color={message.trim() ? '#006B3F' : '#ccc'} />
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <TouchableOpacity style={styles.chatButton} onPress={toggleChat}>
            <MessageSquare size={24} color="#fff" />
          </TouchableOpacity>
        )}
      </Animated.View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  keyboardAvoidingView: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    zIndex: 100,
  },
  chatContainer: {
    backgroundColor: '#006B3F',
    position: 'absolute',
    bottom: 0,
    right: 0,
    overflow: 'hidden',
  },
  chatButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  chatContent: {
    flex: 1,
    flexDirection: 'column',
  },
  chatHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#006B3F',
    padding: 16,
  },
  logo: {
    width: 120,
    height: 24,
  },
  closeButton: {
    backgroundColor: '#ffffff33',
    padding: 6,
    borderRadius: 20,
  },
  messagesContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  messagesContent: {
    padding: 16,
    paddingBottom: 12,
  },
  messageBubble: {
    maxWidth: '80%',
    padding: 12,
    borderRadius: 16,
    marginBottom: 8,
  },
  userMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#DCFCE7',
    borderBottomRightRadius: 4,
  },
  botMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#F1F5F9',
    borderBottomLeftRadius: 4,
  },
  messageText: {
    fontSize: 14,
    color: '#1E293B',
  },
  messageTime: {
    fontSize: 10,
    color: '#64748B',
    marginTop: 4,
    alignSelf: 'flex-end',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    backgroundColor: '#fff',
  },
  input: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    borderRadius: 20,
    paddingHorizontal: 16,
    fontSize: 14,
    color: '#1E293B',
  },

  // ─── new styles for the menu card ─────────────────────────────────────────
  menuCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  menuTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#006B3F',
  },
  menuItem: {
    fontSize: 14,
    marginVertical: 2,
    color: '#1E293B',
  },
  menuFooter: {
    marginTop: 8,
    fontSize: 13,
    fontStyle: 'italic',
    color: '#64748B',
  },
});