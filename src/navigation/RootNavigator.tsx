import React, { useState, useEffect, useRef } from 'react';
import { NavigationContainer, NavigationContainerRef } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import AuthStack from './AuthStack';
import HomeStackRoot from './HomeStackRoot';

const RootNavigator = () => {
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  const navigationRef = useRef<NavigationContainerRef<any>>(null);
  const [authStackKey, setAuthStackKey] = useState(0);
  const prevAuthenticated = useRef(isAuthenticated);

  // Reset auth stack on logout
  useEffect(() => {
    if (prevAuthenticated.current && !isAuthenticated) {
      setAuthStackKey((prev) => prev + 1);
    }
    prevAuthenticated.current = isAuthenticated;
  }, [isAuthenticated]);

  return (
    <NavigationContainer ref={navigationRef}>
      {isAuthenticated ? <HomeStackRoot /> : <AuthStack key={authStackKey} />}
    </NavigationContainer>
  );
};

export default RootNavigator;

