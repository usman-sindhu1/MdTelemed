import React, { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { useDispatch } from 'react-redux';
import { setUser } from '../store/slices/authSlice';
import { getStoredAuthSnapshot } from '../utils/authSession';

type Props = {
  children: React.ReactNode;
};

/**
 * Loads JWT + cached user from storage before rendering the app shell so
 * returning users stay signed in until they explicitly log out.
 */
const SessionGate: React.FC<Props> = ({ children }) => {
  const dispatch = useDispatch();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const { token, user } = await getStoredAuthSnapshot();
        if (!cancelled && token) {
          const payload =
            user && Object.keys(user).length > 0 ? user : { sessionRestored: true };
          dispatch(setUser(payload));
        }
      } finally {
        if (!cancelled) {
          setReady(true);
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [dispatch]);

  if (!ready) {
    return (
      <View style={styles.boot}>
        <ActivityIndicator size="large" color="#2563EB" />
      </View>
    );
  }

  return <>{children}</>;
};

const styles = StyleSheet.create({
  boot: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
});

export default SessionGate;
