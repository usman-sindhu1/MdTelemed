import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import Colors from '../../../constants/colors';
import Fonts from '../../../constants/fonts';
import Icons from '../../../assets/svg';
import type { ChatBubbleUi } from '../../../utils/chatMessageUi';

export interface ConversationProps {
  doctorDisplayName: string;
  isOnline?: boolean;
  messages: ChatBubbleUi[];
  messagesLoading?: boolean;
  onSend: (text: string) => void;
  sendPending?: boolean;
  composerDisabled?: boolean;
  composerHint?: string;
  bottomInset?: number;
}

const Conversation: React.FC<ConversationProps> = ({
  doctorDisplayName,
  isOnline = false,
  messages,
  messagesLoading,
  onSend,
  sendPending,
  composerDisabled,
  composerHint,
  bottomInset = 0,
}) => {
  const [message, setMessage] = useState('');
  const scrollRef = useRef<ScrollView>(null);

  useEffect(() => {
    if (messages.length > 0) {
      scrollRef.current?.scrollToEnd({ animated: true });
    }
  }, [messages.length]);

  const handleSend = () => {
    const t = message.trim();
    if (!t || composerDisabled || sendPending) return;
    onSend(t);
    setMessage('');
  };

  const inputBlocked = composerDisabled || Boolean(composerHint);

  const rootStyle = [styles.root, { marginBottom: bottomInset }];

  const chatCard = (
    <View style={styles.chatCard}>
        <View style={styles.chatHeader}>
          <View
            style={[
              styles.statusDot,
              isOnline ? styles.statusDotOn : styles.statusDotOff,
            ]}
          />
          <Text style={styles.headerName}>{doctorDisplayName}</Text>
          <Text style={styles.headerStatus}>
            {isOnline ? 'Online' : 'Offline'}
          </Text>
        </View>

        <ScrollView
          ref={scrollRef}
          style={styles.messagesScroll}
          contentContainerStyle={styles.messagesContent}
          showsVerticalScrollIndicator={false}
        >
          {messagesLoading ? (
            <View style={styles.loadingWrap}>
              <ActivityIndicator color={Colors.primary} />
            </View>
          ) : messages.length === 0 ? (
            <View style={styles.emptyWrap}>
              <View style={styles.iconCircle}>
                <Icons.Chat1Icon width={40} height={40} />
              </View>
              <Text style={styles.emptyTitle}>No messages yet</Text>
              <Text style={styles.emptySubtitle}>
                Start the conversation by sending your first message.
              </Text>
            </View>
          ) : (
            messages.map((msg) => (
              <View
                key={msg.id}
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
            ))
          )}
        </ScrollView>

        {composerHint ? (
          <Text style={styles.hint}>{composerHint}</Text>
        ) : null}

        <View style={[styles.inputContainer, inputBlocked && styles.inputDisabled]}>
          <TouchableOpacity
            style={styles.attachButton}
            activeOpacity={0.7}
            disabled={inputBlocked}
            onPress={() => {}}
          >
            <Icons.Vector5Icon width={20} height={20} />
          </TouchableOpacity>
          <TextInput
            style={styles.input}
            placeholder="Type your message..."
            placeholderTextColor={Colors.textLight}
            value={message}
            onChangeText={setMessage}
            multiline
            editable={!inputBlocked}
          />
          <TouchableOpacity
            style={[
              styles.sendButton,
              (sendPending || inputBlocked) && styles.sendButtonDisabled,
            ]}
            onPress={handleSend}
            activeOpacity={0.7}
            disabled={inputBlocked || sendPending}
          >
            {sendPending ? (
              <ActivityIndicator color="#FFFFFF" size="small" />
            ) : (
              <Icons.SentMessageIcon width={20} height={20} />
            )}
          </TouchableOpacity>
        </View>
      </View>
  );

  /* Android: rely on android:windowSoftInputMode="adjustResize" — avoid KAV (conflicts with resize). */
  if (Platform.OS === 'android') {
    return <View style={rootStyle}>{chatCard}</View>;
  }

  return (
    <KeyboardAvoidingView
      style={rootStyle}
      behavior="padding"
      keyboardVerticalOffset={64}
    >
      {chatCard}
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    minHeight: 240,
  },
  chatCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    overflow: 'hidden',
    minHeight: 280,
  },
  chatHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
    gap: 8,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  statusDotOff: {
    backgroundColor: '#9CA3AF',
  },
  statusDotOn: {
    backgroundColor: '#22C55E',
  },
  headerName: {
    fontFamily: Fonts.raleway,
    fontSize: 16,
    fontWeight: '700',
    color: Colors.primary,
    flex: 1,
  },
  headerStatus: {
    fontFamily: Fonts.openSans,
    fontSize: 13,
    color: Colors.textLight,
  },
  messagesScroll: {
    flex: 1,
  },
  messagesContent: {
    flexGrow: 1,
    paddingVertical: 16,
    paddingHorizontal: 12,
  },
  loadingWrap: {
    paddingVertical: 32,
    alignItems: 'center',
  },
  emptyWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
    minHeight: 160,
  },
  iconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  emptyTitle: {
    fontFamily: Fonts.raleway,
    fontSize: 18,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontFamily: Fonts.openSans,
    fontSize: 14,
    color: Colors.textLight,
    textAlign: 'center',
    lineHeight: 20,
    paddingHorizontal: 16,
  },
  messageContainer: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  sentMessage: {
    justifyContent: 'flex-end',
  },
  receivedMessage: {
    justifyContent: 'flex-start',
  },
  messageBubble: {
    maxWidth: '78%',
    paddingHorizontal: 14,
    paddingVertical: 10,
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
    opacity: 0.85,
  },
  receivedTime: {
    color: Colors.textLight,
  },
  hint: {
    fontFamily: Fonts.openSans,
    fontSize: 12,
    color: Colors.textLight,
    textAlign: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#FEF3C7',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 12,
    gap: 10,
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
    backgroundColor: '#FAFAFA',
  },
  inputDisabled: {
    opacity: 0.65,
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
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontFamily: Fonts.openSans,
    fontSize: 14,
    color: Colors.textPrimary,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonDisabled: {
    opacity: 0.55,
  },
});

export default Conversation;
