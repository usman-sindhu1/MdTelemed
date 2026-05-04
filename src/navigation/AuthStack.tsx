import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SplashScreen from '../screens/splash';
import OnboardingScreens from '../screens/onboarding';
import SignIn from '../screens/auth/SignIn';
import SignUp from '../screens/auth/SignUp';
import VerifyYourEmail from '../screens/auth/VerifyYourEmail';
import ResetYourPassword from '../screens/auth/ResetYourPassword';
import VerifyYourCode from '../screens/auth/VerifyYourCode';
import ChangePassword from '../screens/auth/ChangePassword';

export type AuthStackParamList = {
  Splash: undefined;
  Onboarding: undefined;
  SignIn: undefined;
  SignUp: undefined;
  VerifyEmail: { email: string };
  ResetPassword: undefined;
  VerifyCode: { email: string };
  ChangePassword: { resetToken: string };
};

const Stack = createNativeStackNavigator<AuthStackParamList>();

const AuthStack = () => {
  return (
    <Stack.Navigator
      initialRouteName="Splash"
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="Splash" component={SplashScreen} />
      <Stack.Screen name="Onboarding" component={OnboardingScreens} />
      <Stack.Screen name="SignIn" component={SignIn} />
      <Stack.Screen name="SignUp" component={SignUp} />
      <Stack.Screen name="VerifyEmail" component={VerifyYourEmail} />
      <Stack.Screen name="ResetPassword" component={ResetYourPassword} />
      <Stack.Screen name="VerifyCode" component={VerifyYourCode} />
      <Stack.Screen name="ChangePassword" component={ChangePassword} />
    </Stack.Navigator>
  );
};

export default AuthStack;

