import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icons from '../../assets/svg';
import Colors from '../../constants/colors';
import Fonts from '../../constants/fonts';

type TabType = 'home' | 'calendar' | 'report' | 'notifications' | 'chat';

interface BottomNavigationProps {
  activeTab: TabType;
  onTabPress: (tab: TabType) => void;
}

const BottomNavigation: React.FC<BottomNavigationProps> = ({
  activeTab,
  onTabPress,
}) => {
  const getTabName = (tab: TabType): string => {
    switch (tab) {
      case 'home': return 'Home';
      case 'calendar': return 'Calendar';
      case 'report': return 'Report';
      case 'notifications': return 'Notifications';
      case 'chat': return 'Chat';
      default: return '';
    }
  };

  return (
    <SafeAreaView edges={['bottom']} style={styles.safeArea}>
      <View style={styles.wrapper}>
        <View style={styles.navBar}>
          {/* Home Tab */}
          <TouchableOpacity
            style={styles.tab}
            onPress={() => onTabPress('home')}
            activeOpacity={0.8}
          >
            <View style={styles.iconWrapper}>
              <Icons.Home 
                width={24} 
                height={24} 
                fill={activeTab === 'home' ? Colors.primary : '#FFFFFF'}
              />
            </View>
            {activeTab === 'home' && (
              <Text style={styles.tabLabel}>{getTabName('home')}</Text>
            )}
          </TouchableOpacity>

          {/* Calendar Tab */}
          <TouchableOpacity
            style={styles.tab}
            onPress={() => onTabPress('calendar')}
            activeOpacity={0.8}
          >
            <View style={styles.iconWrapper}>
              <Icons.Calendar 
                width={24} 
                height={24} 
                fill={activeTab === 'calendar' ? Colors.primary : '#FFFFFF'}
              />
            </View>
            {activeTab === 'calendar' && (
              <Text style={styles.tabLabel}>{getTabName('calendar')}</Text>
            )}
          </TouchableOpacity>

          {/* Report Tab */}
          <TouchableOpacity
            style={styles.tab}
            onPress={() => onTabPress('report')}
            activeOpacity={0.8}
          >
            <View style={styles.iconWrapper}>
              <Icons.Report 
                width={24} 
                height={24} 
                fill={activeTab === 'report' ? Colors.primary : '#FFFFFF'}
              />
            </View>
            {activeTab === 'report' && (
              <Text style={styles.tabLabel}>{getTabName('report')}</Text>
            )}
          </TouchableOpacity>

          {/* Notifications Tab */}
          <TouchableOpacity
            style={styles.tab}
            onPress={() => onTabPress('notifications')}
            activeOpacity={0.8}
          >
            <View style={styles.iconWrapper}>
              <Icons.Notifications 
                width={24} 
                height={24} 
                fill={activeTab === 'notifications' ? Colors.primary : '#FFFFFF'}
              />
            </View>
            {activeTab === 'notifications' && (
              <Text style={styles.tabLabel}>{getTabName('notifications')}</Text>
            )}
          </TouchableOpacity>

          {/* Chat Tab */}
          <TouchableOpacity
            style={styles.tab}
            onPress={() => onTabPress('chat')}
            activeOpacity={0.8}
          >
            <View style={styles.iconWrapper}>
              <Icons.Chat 
                width={24} 
                height={24} 
                stroke={activeTab === 'chat' ? Colors.primary : '#FFFFFF'}
                fill={activeTab === 'chat' ? Colors.primary : 'none'}
              />
            </View>
            {activeTab === 'chat' && (
              <Text style={styles.tabLabel}>{getTabName('chat')}</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: 'transparent',
  },
  wrapper: {
    paddingHorizontal: 15,
  },
  navBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: '#1F1F1F',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 8,
    minHeight: 70,
    borderWidth: 3,
    borderColor: '#FFFFFF',
    // iOS shadow
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    // Android shadow
    elevation: 4,
  },
  tab: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  iconWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabLabel: {
    fontFamily: Fonts.raleway,
    fontSize: 12,
    fontWeight: '500',
    color: '#FFFFFF',
    marginTop: 4,
  },
});

export default BottomNavigation;

