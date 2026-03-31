import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Home from '../screens/home';
import HomeDoctorsList from '../screens/home/HomeDoctorsList';
import HomeDoctorDetails from '../screens/home/HomeDoctorDetails';
import Appointments from '../screens/appointments';
import AppointmentDetails from '../screens/appointments/appointmentsDetails';
import PrescriptionDetails from '../screens/prescription/prescriptionDetails';
import JoinSession from '../screens/appointments/agoraScreens/JoinSession';
import SessionJoined from '../screens/appointments/agoraScreens/SessionJoined';
import InSessionChat from '../screens/appointments/ChatScreens.tsx/InSessionChat';
import ReviewsScreen from '../screens/appointments/ReviewsScreen';
import SelectService from '../screens/appointments/bookingScreens/SelectService';
import SelectDoctor from '../screens/appointments/bookingScreens/SelectDoctor';
import DoctorDetails from '../screens/appointments/bookingScreens/DoctorDetails';
import BookingAvailableSlot from '../screens/appointments/bookingScreens/BookingAvailableSlot';
import SetupAnAppointment from '../screens/appointments/bookingScreens/SetupAnAppointment';
import WhoRequire from '../screens/appointments/bookingScreens/WhoRequire';
import DescribeIssue from '../screens/appointments/bookingScreens/DescribeIssue';
import AddMedicalInfo from '../screens/appointments/bookingScreens/AddMedicalInfo';
import UploadReport from '../screens/appointments/bookingScreens/UploadReport';
import FinalBookingData from '../screens/appointments/bookingScreens/FinalBookingData';
import Prescription from '../screens/prescription';
import Notifications from '../screens/notifications';
import Chat from '../screens/chat';
import InboxChat from '../screens/chat/InboxChat';

export type HomeStackParamList = {
  HomeMain: undefined;
  HomeDoctorsList: {
    selectedCategoryId?: string;
  } | undefined;
  HomeDoctorDetails: {
    doctor: {
      id: string;
      name: string;
      specialty: string;
      rating: string;
      years: string;
      patients: string;
      fee: string;
      imageUri: string;
    };
    selectedCategoryId?: string;
  };
};

export type AppointmentsStackParamList = {
  AppointmentsMain: undefined;
  AppointmentDetails: undefined;
  PrescriptionDetails: undefined;
  JoinSession: undefined;
  SessionJoined: undefined;
  InSessionChat: undefined;
  ReviewsScreen: undefined;
  SelectService: undefined;
  SelectDoctor: undefined;
  DoctorDetails: undefined;
  BookingAvailableSlot: undefined;
  SetupAnAppointment: undefined;
  WhoRequire: undefined;
  DescribeIssue: undefined;
  AddMedicalInfo: undefined;
  UploadReport: undefined;
  FinalBookingData: undefined;
};

export type PrescriptionStackParamList = {
  PrescriptionMain: undefined;
  PrescriptionDetails: undefined;
};

export type NotificationsStackParamList = {
  NotificationsMain: undefined;
};

export type ChatStackParamList = {
  ChatMain: undefined;
  InboxChat: { chatName?: string };
};

const HomeStackNavigator = createNativeStackNavigator<HomeStackParamList>();
const AppointmentsStackNavigator = createNativeStackNavigator<AppointmentsStackParamList>();
const PrescriptionStackNavigator = createNativeStackNavigator<PrescriptionStackParamList>();
const NotificationsStackNavigator = createNativeStackNavigator<NotificationsStackParamList>();
const ChatStackNavigator = createNativeStackNavigator<ChatStackParamList>();

export const HomeStack = () => {
  return (
    <HomeStackNavigator.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <HomeStackNavigator.Screen name="HomeMain" component={Home} />
      <HomeStackNavigator.Screen name="HomeDoctorsList" component={HomeDoctorsList} />
      <HomeStackNavigator.Screen name="HomeDoctorDetails" component={HomeDoctorDetails} />
    </HomeStackNavigator.Navigator>
  );
};

export const AppointmentsStack = () => {
  return (
    <AppointmentsStackNavigator.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <AppointmentsStackNavigator.Screen name="AppointmentsMain" component={Appointments} />
      <AppointmentsStackNavigator.Screen name="AppointmentDetails" component={AppointmentDetails} />
      <AppointmentsStackNavigator.Screen name="PrescriptionDetails" component={PrescriptionDetails} />
      <AppointmentsStackNavigator.Screen name="JoinSession" component={JoinSession} />
      <AppointmentsStackNavigator.Screen name="SessionJoined" component={SessionJoined} />
      <AppointmentsStackNavigator.Screen name="InSessionChat" component={InSessionChat} />
      <AppointmentsStackNavigator.Screen name="ReviewsScreen" component={ReviewsScreen} />
      <AppointmentsStackNavigator.Screen name="SelectService" component={SelectService} />
      <AppointmentsStackNavigator.Screen name="SelectDoctor" component={SelectDoctor} />
      <AppointmentsStackNavigator.Screen name="DoctorDetails" component={DoctorDetails} />
      <AppointmentsStackNavigator.Screen name="BookingAvailableSlot" component={BookingAvailableSlot} />
      <AppointmentsStackNavigator.Screen name="SetupAnAppointment" component={SetupAnAppointment} />
      <AppointmentsStackNavigator.Screen name="WhoRequire" component={WhoRequire} />
      <AppointmentsStackNavigator.Screen name="DescribeIssue" component={DescribeIssue} />
      <AppointmentsStackNavigator.Screen name="AddMedicalInfo" component={AddMedicalInfo} />
      <AppointmentsStackNavigator.Screen name="UploadReport" component={UploadReport} />
      <AppointmentsStackNavigator.Screen name="FinalBookingData" component={FinalBookingData} />
    </AppointmentsStackNavigator.Navigator>
  );
};

export const PrescriptionStack = () => {
  return (
    <PrescriptionStackNavigator.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <PrescriptionStackNavigator.Screen name="PrescriptionMain" component={Prescription} />
      <PrescriptionStackNavigator.Screen name="PrescriptionDetails" component={PrescriptionDetails} />
    </PrescriptionStackNavigator.Navigator>
  );
};

export const NotificationsStack = () => {
  return (
    <NotificationsStackNavigator.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <NotificationsStackNavigator.Screen name="NotificationsMain" component={Notifications} />
    </NotificationsStackNavigator.Navigator>
  );
};

export const ChatStack = () => {
  return (
    <ChatStackNavigator.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <ChatStackNavigator.Screen name="ChatMain" component={Chat} />
      <ChatStackNavigator.Screen name="InboxChat" component={InboxChat} />
    </ChatStackNavigator.Navigator>
  );
};

