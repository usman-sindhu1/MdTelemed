import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { DrawerActions } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import HomeHeader from '../../components/common/HomeHeader';
import { ChatStackParamList } from '../../navigation/HomeStack';
import Colors from '../../constants/colors';
import Fonts from '../../constants/fonts';
import Icons from '../../assets/svg';

interface ChatData {
  id: string;
  name: string;
  message: string;
  time: string;
  avatar?: any;
}

type ChatNavigationProp = NativeStackNavigationProp<
  ChatStackParamList,
  'ChatMain'
>;

const Chat: React.FC = () => {
  const navigation = useNavigation<ChatNavigationProp>();

  const chats: ChatData[] = [
    {
      id: '1',
      name: 'Eleanor Pena',
      message: 'Are your there?',
      time: '5 min',
      avatar: Icons.Ellipse107Icon,
    },
    {
      id: '2',
      name: 'Eleanor Pena',
      message: 'Are your there?',
      time: '8 hrs',
      avatar: Icons.Ellipse106Icon,
    },
    {
      id: '3',
      name: 'Eleanor Pena',
      message: 'Are your there?',
      time: '3 mo',
      avatar: Icons.Ellipse107Icon,
    },
    {
      id: '4',
      name: 'Eleanor Pena',
      message: 'Are your there?',
      time: '5 mo',
      avatar: Icons.Ellipse106Icon,
    },
  ];

  const handleMenuPress = () => {
    navigation.dispatch(DrawerActions.openDrawer());
  };

  const handleSearchPress = () => {
    console.log('Search pressed');
  };

  const handleSearchChange = (text: string) => {
    console.log('Search text:', text);
  };

  const handleChatPress = (chat: ChatData) => {
    navigation.navigate('InboxChat', { chatName: chat.name });
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Fixed Header */}
      <View style={styles.headerContainer}>
        <HomeHeader
          onMenuPress={handleMenuPress}
          onSearchPress={handleSearchPress}
          onSearchChange={handleSearchChange}
        />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>
          <Text style={styles.heading}>Chat</Text>

          {/* Chat List */}
          <View style={styles.chatList}>
            {chats.map((chat) => {
              const AvatarIcon = chat.avatar;
              return (
                <TouchableOpacity
                  key={chat.id}
                  style={styles.chatCard}
                  onPress={() => handleChatPress(chat)}
                  activeOpacity={0.7}
                >
                  <View style={styles.avatarContainer}>
                    {AvatarIcon && <AvatarIcon width={50} height={50} />}
                  </View>
                  <View style={styles.chatInfo}>
                    <Text style={styles.chatName}>{chat.name}</Text>
                    <Text style={styles.chatMessage} numberOfLines={1}>
                      {chat.message}
                    </Text>
                  </View>
                  <Text style={styles.chatTime}>{chat.time}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      </ScrollView>
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
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 100,
  },
  content: {
    paddingHorizontal: 15,
  },
  heading: {
    fontFamily: Fonts.raleway,
    fontSize: 24,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginTop: 24,
    marginBottom: 24,
  },
  chatList: {
    gap: 12,
  },
  chatCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    padding: 16,
    gap: 12,
  },
  avatarContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    overflow: 'hidden',
  },
  chatInfo: {
    flex: 1,
    gap: 4,
  },
  chatName: {
    fontFamily: Fonts.raleway,
    fontSize: 16,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  chatMessage: {
    fontFamily: Fonts.openSans,
    fontSize: 14,
    fontWeight: '400',
    color: Colors.textSecondary,
  },
  chatTime: {
    fontFamily: Fonts.openSans,
    fontSize: 12,
    fontWeight: '400',
    color: Colors.textLight,
  },
});

export default Chat;

