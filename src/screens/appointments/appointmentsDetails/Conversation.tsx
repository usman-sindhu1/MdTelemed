import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import Colors from '../../../constants/colors';
import Fonts from '../../../constants/fonts';
import Icons from '../../../assets/svg';

interface Message {
  id: string;
  text: string;
  time: string;
  isSent: boolean;
  date?: string;
}

const Conversation: React.FC = () => {
  const [message, setMessage] = useState('');

  const messages: Message[] = [
    {
      id: '1',
      text: 'Hello, how are you today?',
      time: '08:39 pm',
      date: 'Sep 12',
      isSent: false,
    },
    {
      id: '2',
      text: 'Hello, how are you today?',
      time: '08:39 pm',
      isSent: true,
    },
    {
      id: '3',
      text: 'Hello, how are you today?',
      time: '08:39 pm',
      date: 'Sep 10',
      isSent: false,
    },
    {
      id: '4',
      text: 'Hello, how are you today?',
      time: '08:39 pm',
      isSent: false,
    },
    {
      id: '5',
      text: 'Hello, how are you today?',
      time: '08:39 pm',
      isSent: true,
    },
  ];

  const handleSend = () => {
    if (message.trim()) {
      console.log('Send message:', message);
      setMessage('');
    }
  };

  let currentDate = '';

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.messagesContainer}
        contentContainerStyle={styles.messagesContent}
        showsVerticalScrollIndicator={false}
      >
        {messages.map((msg) => {
          const showDate = msg.date && msg.date !== currentDate;
          if (showDate) {
            currentDate = msg.date || '';
          }
          return (
            <View key={msg.id}>
              {showDate && (
                <View style={styles.dateSeparator}>
                  <Text style={styles.dateText}>{msg.date}</Text>
                </View>
              )}
              <View
                style={[
                  styles.messageContainer,
                  msg.isSent ? styles.sentMessage : styles.receivedMessage,
                ]}
              >
                <View
                  style={[
                    styles.messageBubble,
                    msg.isSent ? styles.sentBubble : styles.receivedBubble,
                  ]}
                >
                  <Text
                    style={[
                      styles.messageText,
                      msg.isSent ? styles.sentText : styles.receivedText,
                    ]}
                  >
                    {msg.text}
                  </Text>
                  <Text
                    style={[
                      styles.messageTime,
                      msg.isSent ? styles.sentTime : styles.receivedTime,
                    ]}
                  >
                    {msg.time}
                  </Text>
                </View>
              </View>
            </View>
          );
        })}
      </ScrollView>

      {/* Input Bar */}
      <View style={styles.inputContainer}>
        <TouchableOpacity style={styles.attachButton} activeOpacity={0.7}>
          <Icons.Vector5Icon width={20} height={20} />
        </TouchableOpacity>
        <TextInput
          style={styles.input}
          placeholder="Write your message"
          placeholderTextColor={Colors.textLight}
          value={message}
          onChangeText={setMessage}
          multiline
        />
        <TouchableOpacity
          style={styles.sendButton}
          onPress={handleSend}
          activeOpacity={0.7}
        >
          <Icons.SentMessageIcon width={20} height={20} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    paddingVertical: 16,
    gap: 12,
  },
  dateSeparator: {
    alignItems: 'center',
    marginVertical: 16,
  },
  dateText: {
    fontFamily: Fonts.openSans,
    fontSize: 12,
    fontWeight: '400',
    color: Colors.textLight,
  },
  messageContainer: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  sentMessage: {
    justifyContent: 'flex-end',
  },
  receivedMessage: {
    justifyContent: 'flex-start',
  },
  messageBubble: {
    maxWidth: '75%',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 16,
    gap: 4,
  },
  sentBubble: {
    backgroundColor: Colors.primary,
    borderBottomRightRadius: 4,
  },
  receivedBubble: {
    backgroundColor: Colors.backgroundLight,
    borderBottomLeftRadius: 4,
  },
  messageText: {
    fontFamily: Fonts.openSans,
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 20,
  },
  sentText: {
    color: '#FFFFFF',
  },
  receivedText: {
    color: Colors.textPrimary,
  },
  messageTime: {
    fontFamily: Fonts.openSans,
    fontSize: 10,
    fontWeight: '400',
    marginTop: 4,
  },
  sentTime: {
    color: '#FFFFFF',
    opacity: 0.8,
  },
  receivedTime: {
    color: Colors.textLight,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
  },
  attachButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.backgroundLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    minHeight: 40,
    maxHeight: 100,
    backgroundColor: Colors.backgroundLight,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontFamily: Fonts.openSans,
    fontSize: 14,
    color: Colors.textPrimary,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Conversation;

