import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { BottomTabNavigator } from './BottomTabNavigator';
import CustomDrawer from '../components/common/CustomDrawerNavigation';
import { ScrollProvider } from '../contexts/ScrollContext';
import Invoices from '../screens/drawerScreens/Invoices';
import InvoiceDetails from '../screens/drawerScreens/InvoicesDetails';
import RatingsAndReviews from '../screens/drawerScreens/RatingsAndReviews';
import ReviewDetails from '../screens/drawerScreens/ReviewDetails';
import ProfileSettings from '../screens/drawerScreens/ProfileSettings';
import ChangePassword from '../screens/drawerScreens/ChangePassord';
import Doctors from '../screens/drawerScreens/Doctors';
import DoctorDetails from '../screens/drawerScreens/DoctorDetails';
import Services from '../screens/drawerScreens/Services';
import ContactUs from '../screens/drawerScreens/ContactUs';
import MedicalInfo from '../screens/drawerScreens/MedicalInfo';
import NotificationSettings from '../screens/drawerScreens/NotificationSettings';
import HelpAndFaqs from '../screens/drawerScreens/HelpAndFaqs';
import TermsAndConditions from '../screens/drawerScreens/TermsAndConditions';
import PrivacyPolicy from '../screens/drawerScreens/PrivacyPolicy';
import Language from '../screens/drawerScreens/Language';

export type DrawerParamList = {
  MainTabs: undefined;
  Invoices: undefined;
  InvoiceDetails: undefined;
  RatingsAndReviews: undefined;
  ReviewDetails: undefined;
  ProfileSettings: undefined;
  ChangePassword: undefined;
  Doctors: undefined;
  DoctorDetails: undefined;
  Services: undefined;
  ContactUs: undefined;
  MedicalInfo: undefined;
  NotificationSettings: undefined;
  HelpAndFaqs: undefined;
  TermsAndConditions: undefined;
  PrivacyPolicy: undefined;
  Language: undefined;
};

export type RootStackParamList = {
  Main: undefined;
};

const Drawer = createDrawerNavigator<DrawerParamList>();
const RootStack = createNativeStackNavigator<RootStackParamList>();

const HomeStackRoot = () => {
  return (
    <ScrollProvider>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <RootStack.Navigator
        screenOptions={{
          headerShown: false,
        }}
      >
        <RootStack.Screen name="Main">
          {(props) => (
            <Drawer.Navigator
              drawerContent={(drawerProps) => <CustomDrawer {...drawerProps} />}
              screenOptions={{
                headerShown: false,
                drawerType: 'slide',
                drawerStyle: {
                  width: '75%',
                  maxWidth: 320,
                  backgroundColor: '#FFFFFF',
                },
                overlayColor: 'rgba(0, 0, 0, 0.5)',
              }}
            >
              <Drawer.Screen name="MainTabs" component={BottomTabNavigator} />
              <Drawer.Screen name="Invoices" component={Invoices} />
              <Drawer.Screen name="InvoiceDetails" component={InvoiceDetails} />
              <Drawer.Screen name="RatingsAndReviews" component={RatingsAndReviews} />
              <Drawer.Screen name="ReviewDetails" component={ReviewDetails} />
              <Drawer.Screen name="ProfileSettings" component={ProfileSettings} />
              <Drawer.Screen name="ChangePassword" component={ChangePassword} />
              <Drawer.Screen name="Doctors" component={Doctors} />
              <Drawer.Screen name="DoctorDetails" component={DoctorDetails} />
              <Drawer.Screen name="Services" component={Services} />
              <Drawer.Screen name="ContactUs" component={ContactUs} />
              <Drawer.Screen name="MedicalInfo" component={MedicalInfo} />
              <Drawer.Screen name="NotificationSettings" component={NotificationSettings} />
              <Drawer.Screen name="HelpAndFaqs" component={HelpAndFaqs} />
              <Drawer.Screen name="TermsAndConditions" component={TermsAndConditions} />
              <Drawer.Screen name="PrivacyPolicy" component={PrivacyPolicy} />
              <Drawer.Screen name="Language" component={Language} />
            </Drawer.Navigator>
          )}
        </RootStack.Screen>
      </RootStack.Navigator>
    </GestureHandlerRootView>
    </ScrollProvider>
  );
};

export default HomeStackRoot;

