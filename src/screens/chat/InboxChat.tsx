import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import BackHeader from '../../components/common/BackHeader';
import Colors from '../../constants/colors';
import Fonts from '../../constants/fonts';
import Icons from '../../assets/svg';
import { ChatStackParamList } from '../../navigation/HomeStack';

type InboxChatNavigationProp = NativeStackNavigationProp<
  ChatStackParamList,
  'InboxChat'
>;

interface Message {
  id: string;
  text: string;
  time: string;
  isSent: boolean;
  date?: string;
}

interface RouteParams {
  chatName?: string;
}

const InboxChat: React.FC = () => {
  const navigation = useNavigation<InboxChatNavigationProp>();
  const route = useRoute();
  const insets = useSafeAreaInsets();
  const params = (route.params as RouteParams) || {};
  const chatName = params.chatName || 'Eleanor Pena';
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
      date: 'Sep 12',
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
      date: 'Sep 10',
      isSent: false,
    },
    {
      id: '5',
      text: 'Hello, how are you today?',
      time: '08:39 pm',
      date: 'Sep 10',
      isSent: true,
    },
  ];

  const handleBackPress = () => {
    navigation.goBack();
  };

  const handleSearchPress = () => {
    console.log('Search pressed');
  };

  const handleSearchChange = (text: string) => {
    console.log('Search text:', text);
  };

  const handleSend = () => {
    if (message.trim()) {
      console.log('Send message:', message);
      setMessage('');
    }
  };

  const handleAttach = () => {
    console.log('Attach pressed');
  };

  let currentDate = '';

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Fixed Header */}
      <View style={styles.headerContainer}>
        <BackHeader
          onBackPress={handleBackPress}
          onSearchPress={handleSearchPress}
          onSearchChange={handleSearchChange}
          showSearchIcon={true}
        />
        <Text style={styles.chatTitle}>{chatName}</Text>
      </View>

      {/* Chat Messages */}
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
                {!msg.isSent && (
                  <View style={styles.avatarContainer}>
                    <Icons.Ellipse107Icon width={40} height={40} />
                  </View>
                )}
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
                {msg.isSent && (
                  <View style={styles.avatarContainer}>
                    <Icons.Ellipse106Icon width={40} height={40} />
                  </View>
                )}
              </View>
            </View>
          );
        })}
      </ScrollView>

      {/* Input Bar */}
      <View style={[styles.inputContainer, { paddingBottom: insets.bottom }]}>
        <TouchableOpacity
          style={styles.attachButton}
          onPress={handleAttach}
          activeOpacity={0.7}
        >
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
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  headerContainer: {
    paddingHorizontal: 15,
    backgroundColor: Colors.background,
    zIndex: 10,
    paddingBottom: 8,
  },
  chatTitle: {
    fontFamily: Fonts.raleway,
    fontSize: 24,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginTop: 16,
    marginBottom: 8,
  },
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    paddingVertical: 16,
    paddingHorizontal: 15,
    gap: 12,
    paddingBottom: 100,
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
    alignItems: 'flex-end',
    gap: 8,
  },
  sentMessage: {
    justifyContent: 'flex-end',
  },
  receivedMessage: {
    justifyContent: 'flex-start',
  },
  avatarContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    overflow: 'hidden',
  },
  messageBubble: {
    maxWidth: '70%',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 16,
    gap: 4,
  },
  sentBubble: {
    backgroundColor: '#A473E5',
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
    backgroundColor: Colors.background,
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

export default InboxChat;

