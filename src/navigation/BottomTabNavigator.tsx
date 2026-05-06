import React, { useRef, useEffect } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Platform, View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';
import { HomeStack, AppointmentsStack, PrescriptionStack, NotificationsStack, SettingsStack } from './HomeStack';
import Icons from '../assets/svg';
import Colors from '../constants/colors';
import Fonts from '../constants/fonts';
import { useScrollContext } from '../contexts/ScrollContext';
import { usePatientNotifications } from '../hooks/usePatientNotifications';
import { useSelector } from 'react-redux';
import type { RootState } from '../store';

export type BottomTabParamList = {
  Home: undefined;
  Calendar: undefined;
  Prescription: undefined;
  Notifications: undefined;
  Settings: undefined;
};

const BottomTab = createBottomTabNavigator<BottomTabParamList>();

// Custom Tab Bar Component
const CustomTabBar = ({ state, descriptors, navigation }: BottomTabBarProps) => {
  const insets = useSafeAreaInsets();
  // Hooks must be called unconditionally before any early returns
  const { isScrollingDown } = useScrollContext();
  const translateY = useRef(new Animated.Value(0)).current;
  const isAuthenticated = useSelector((s: RootState) => s.auth.isAuthenticated);
  const notificationsQuery = usePatientNotifications();
  const unreadCount = isAuthenticated
    ? (notificationsQuery.data ?? []).filter((n) => !n.isRead).length
    : 0;

  // Hide tab bar only when the CURRENT focused nested route matches.
  const currentRoute = state.routes[state.index];
  const focusedNested =
    getFocusedRouteNameFromRoute(currentRoute as any) ??
    // Fallback for older state shapes
    (currentRoute as any)?.state?.routes?.[(currentRoute as any)?.state?.index ?? 0]?.name;

  const shouldHideTabBar = Boolean(
    focusedNested &&
      [
        'JoinSession',
        'SessionJoined',
        'AppointmentDetails',
        'SelectService',
        'SelectDoctor',
        'DoctorDetails',
        'InboxChat',
      ].includes(String(focusedNested)),
  );

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
    <SafeAreaView style={styles.safeAreaTabBar} edges={['bottom']}>
      <Animated.View
        style={[
          styles.tabBarWrapper,
          {
            transform: [{ translateY }],
          },
        ]}
      >
        <View style={styles.tabBarContainer}>
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
            const initialNestedScreenMap: Record<string, string> = {
              Home: 'HomeMain',
              Calendar: 'AppointmentsMain',
              Prescription: 'PrescriptionMain',
              Notifications: 'NotificationsMain',
              Settings: 'SettingsMain',
            };

            const initialScreen = initialNestedScreenMap[route.name];
            if (initialScreen) {
              (navigation as any).navigate(route.name, { screen: initialScreen });
              return;
            }

            navigation.navigate(route.name as never);
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
            case 'Settings':
              return <Icons.UserSettingsWhiteIcon {...iconProps} />;
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
                    <View style={styles.iconWithBadge}>
                      {getIcon(true)}
                      {route.name === 'Notifications' && unreadCount > 0 ? (
                        <View style={styles.tabBadge}>
                          <Text style={styles.tabBadgeText} numberOfLines={1}>
                            {unreadCount > 99 ? '99+' : String(unreadCount)}
                          </Text>
                        </View>
                      ) : null}
                    </View>
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
                  <View style={styles.iconWithBadge}>
                    {getIcon(false)}
                    {route.name === 'Notifications' && unreadCount > 0 ? (
                      <View style={styles.tabBadge}>
                        <Text style={styles.tabBadgeText} numberOfLines={1}>
                          {unreadCount > 99 ? '99+' : String(unreadCount)}
                        </Text>
                      </View>
                    ) : null}
                  </View>
                </View>
              )}
            </View>
          </TouchableOpacity>
        );
      })}
        </View>
      </Animated.View>
    </SafeAreaView>
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
        name="Settings"
        component={SettingsStack}
        options={{
          tabBarLabel: 'Settings',
        }}
      />
    </BottomTab.Navigator>
  );
};

const styles = StyleSheet.create({
  safeAreaTabBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'transparent',
  },
  tabBarWrapper: {
    backgroundColor: 'transparent',
    paddingBottom: 0,
  },
  tabBarContainer: {
    flexDirection: 'row',
    backgroundColor: Colors.primary,
    borderRadius: 16,
    marginHorizontal: 15,
    height: 64,
    paddingHorizontal: 8,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'visible', // Allow circle to extend above
    marginBottom: Platform.select({
      ios: 0,
      android: 0, // lift tab bar a bit above system nav on Android
      default: 0,
    }),
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
  iconWithBadge: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabBadge: {
    position: 'absolute',
    top: -6,
    right: -10,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    paddingHorizontal: 5,
    backgroundColor: '#EF4444',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: Colors.primary,
  },
  tabBadgeText: {
    fontFamily: Fonts.raleway,
    fontSize: 10,
    fontWeight: '800',
    color: '#FFFFFF',
    lineHeight: 12,
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

