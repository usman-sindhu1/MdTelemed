import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import BackHeader from '../../../components/common/BackHeader';
import Icons from '../../../assets/svg';
import Colors from '../../../constants/colors';
import Fonts from '../../../constants/fonts';
import { AppointmentsStackParamList } from '../../../navigation/HomeStack';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

type InSessionChatNavigationProp = NativeStackNavigationProp<
  AppointmentsStackParamList,
  'InSessionChat'
>;

interface Message {
  id: string;
  text: string;
  time: string;
  isSent: boolean;
}

const InSessionChat: React.FC = () => {
  const navigation = useNavigation<InSessionChatNavigationProp>();
  const insets = useSafeAreaInsets();
  const [message, setMessage] = useState('');

  const messages: Message[] = [
    {
      id: '1',
      text: 'Hello, how are you today?',
      time: '08:39 pm',
      isSent: false,
    },
    {
      id: '2',
      text: 'Hello, how are you today?',
      time: '08:39 pm',
      isSent: true,
    },
  ];

  const handleBackPress = () => {
    navigation.goBack();
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

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.headerContent}>
        <BackHeader
          onBackPress={handleBackPress}
          showSearchIcon={false}
        />
      </View>

      {/* Chat Messages */}
      <ScrollView
        style={styles.messagesContainer}
        contentContainerStyle={styles.messagesContent}
        showsVerticalScrollIndicator={false}
      >
        {messages.map((msg) => (
          <View
            key={msg.id}
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
        ))}
      </ScrollView>

      {/* Video Call Window - Bottom Right */}
      <View style={[styles.videoWindow, { bottom: 80 + insets.bottom }]}>
        <Icons.DoctorDeskIcon 
          width={120} 
          height={160}
          preserveAspectRatio="xMidYMid meet"
        />
      </View>

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
  headerContent: {
    paddingHorizontal: 15,
    paddingTop: 8,
  },
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    paddingVertical: 16,
    paddingHorizontal: 15,
    gap: 12,
    paddingBottom: 200, // Space for video window and input
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
  videoWindow: {
    position: 'absolute',
    right: 20,
    width: 120,
    height: 160,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#1A1A1A',
    borderWidth: 2,
    borderColor: '#FFFFFF',
    zIndex: 5,
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

export default InSessionChat;

