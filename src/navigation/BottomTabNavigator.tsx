import React, { useRef, useEffect } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Platform, View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { HomeStack, AppointmentsStack, PrescriptionStack, NotificationsStack, ChatStack } from './HomeStack';
import Icons from '../assets/svg';
import Colors from '../constants/colors';
import Fonts from '../constants/fonts';
import { useScrollContext } from '../contexts/ScrollContext';

export type BottomTabParamList = {
  Home: undefined;
  Calendar: undefined;
  Prescription: undefined;
  Notifications: undefined;
  Chat: undefined;
};

const BottomTab = createBottomTabNavigator<BottomTabParamList>();

// Custom Tab Bar Component
const CustomTabBar = ({ state, descriptors, navigation }: BottomTabBarProps) => {
  const insets = useSafeAreaInsets();
  // Hooks must be called unconditionally before any early returns
  const { isScrollingDown } = useScrollContext();
  const translateY = useRef(new Animated.Value(0)).current;

  // Check if current screen is SessionJoined, AppointmentDetails, SelectService, or SelectDoctor - hide tab bar if true
  const currentRoute = state.routes[state.index];
  const currentRouteName = currentRoute?.name;
  
  // Check nested routes for SessionJoined, AppointmentDetails, SelectService, SelectDoctor, or DoctorDetails
  const shouldHideTabBar = currentRoute?.state?.routes?.some(
    (route: any) => route.name === 'SessionJoined' || route.name === 'AppointmentDetails' || route.name === 'SelectService' || route.name === 'SelectDoctor' || route.name === 'DoctorDetails'
  ) || false;

  // Animate tab bar based on scroll direction - must be called unconditionally
  useEffect(() => {
    if (!shouldHideTabBar) {
      const tabBarHeight = 64 + (Platform.OS === 'ios' ? insets.bottom : 0) + 30; // Tab bar height + safe area + margin
      Animated.timing(translateY, {
        toValue: isScrollingDown ? tabBarHeight : 0, // Move down (hide) when scrolling down, up (show) when scrolling up
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [isScrollingDown, insets.bottom, shouldHideTabBar]);

  // Hide tab bar on SessionJoined or AppointmentDetails screens
  if (shouldHideTabBar) {
    return null;
  }

  return (
    <Animated.View 
      style={[
        styles.tabBarWrapper,
        {
          transform: [{ translateY }],
        },
      ]}
    >
      <View style={[styles.tabBarContainer, { 
        marginBottom: Platform.OS === 'ios' ? insets.bottom : 0,
      }]}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const label = options.tabBarLabel !== undefined
          ? options.tabBarLabel
          : options.title !== undefined
          ? options.title
          : route.name;

        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name, route.params);
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: 'tabLongPress',
            target: route.key,
          });
        };

        // Icon configuration for each tab
        const getIcon = (isActive: boolean) => {
          const iconProps = isActive 
            ? { width: 24, height: 24 }  // Icon size for active tab
            : { width: 24, height: 24 };  // Icon size for inactive tabs
          
          switch (route.name) {
            case 'Home':
              return (
                <Icons.Home 
                  {...iconProps}
                  fill="#FFFFFF"
                />
              );
            case 'Calendar':
              return (
                <Icons.Calendar 
                  {...iconProps}
                  fill="#FFFFFF"
                />
              );
            case 'Prescription':
              return (
                <Icons.Report 
                  {...iconProps}
                  fill="#FFFFFF"
                />
              );
            case 'Notifications':
              return (
                <Icons.Notifications 
                  {...iconProps}
                  fill="#FFFFFF"
                />
              );
            case 'Chat':
              return (
                <Icons.Chat 
                  {...iconProps}
                  stroke="#FFFFFF"
                  fill="none"
                />
              );
            default:
              return null;
          }
        };

        // Handle label - can be string or function
        const labelText = typeof label === 'string' ? label : route.name;

        return (
          <TouchableOpacity
            key={route.key}
            accessibilityRole="button"
            accessibilityState={isFocused ? { selected: true } : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            onPress={onPress}
            onLongPress={onLongPress}
            style={styles.tabItem}
            activeOpacity={0.7}
          >
            <View style={styles.tabContent}>
              {isFocused ? (
                <>
                  <View style={styles.activeTabCircle}>
                    {getIcon(true)}
                  </View>
                  <Text
                    style={[
                      styles.tabLabel,
                      styles.activeTabLabel,
                    ]}
                    numberOfLines={1}
                    adjustsFontSizeToFit={true}
                    minimumFontScale={0.8}
                  >
                    {labelText}
                  </Text>
                </>
              ) : (
                <View style={styles.inactiveTabIcon}>
                  {getIcon(false)}
                </View>
              )}
            </View>
          </TouchableOpacity>
        );
      })}
      </View>
    </Animated.View>
  );
};

export const BottomTabNavigator = () => {
  return (
    <BottomTab.Navigator
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: 'transparent',
          borderTopWidth: 0,
          elevation: 0,
          shadowOpacity: 0,
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
        },
      }}
    >
      <BottomTab.Screen
        name="Home"
        component={HomeStack}
        options={{
          tabBarLabel: 'Home',
        }}
      />
      <BottomTab.Screen
        name="Calendar"
        component={AppointmentsStack}
        options={{
          tabBarLabel: 'Appointments',
        }}
      />
      <BottomTab.Screen
        name="Prescription"
        component={PrescriptionStack}
        options={{
          tabBarLabel: 'Prescription',
        }}
      />
      <BottomTab.Screen
        name="Notifications"
        component={NotificationsStack}
        options={{
          tabBarLabel: 'Notifications',
        }}
      />
      <BottomTab.Screen
        name="Chat"
        component={ChatStack}
        options={{
          tabBarLabel: 'Chat',
        }}
      />
    </BottomTab.Navigator>
  );
};

const styles = StyleSheet.create({
  tabBarWrapper: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'transparent',
    paddingBottom: 0,
    marginBottom: -15,
  },
  tabBarContainer: {
    flexDirection: 'row',
    backgroundColor: '#1F1F1F',
    borderRadius: 16,
    marginHorizontal: 15,
    height: 64,
    paddingHorizontal: 8,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'visible', // Allow circle to extend above
    marginBottom: 0,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabContent: {
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    position: 'relative',
  },
  activeTabCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.primary,
    borderWidth: 4,
    borderColor: Colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    top: -24, // Extends above the container
    ...Platform.select({
      ios: {
        shadowColor: Colors.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.4,
        shadowRadius: 6,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  inactiveTabIcon: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabLabel: {
    fontFamily: Fonts.raleway,
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
    textAlign: 'center',
    includeFontPadding: false,
    textAlignVertical: 'center',
  },
  activeTabLabel: {
    color: '#FFFFFF',
    position: 'absolute',
    top: 40, // Position below the circle
    textAlign: 'center',
    width: '100%',
    flexWrap: 'nowrap',
  },
});

