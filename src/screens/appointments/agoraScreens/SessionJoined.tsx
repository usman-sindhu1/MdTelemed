import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Icons from '../../../assets/svg';
import { AppointmentsStackParamList } from '../../../navigation/HomeStack';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

type SessionJoinedNavigationProp = NativeStackNavigationProp<
  AppointmentsStackParamList,
  'SessionJoined'
>;

const SessionJoined: React.FC = () => {
  const navigation = useNavigation<SessionJoinedNavigationProp>();
  const insets = useSafeAreaInsets();
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOn, setIsVideoOn] = useState(true);

  const handleBackPress = () => {
    navigation.goBack();
  };

  const handleMuteToggle = () => {
    setIsMuted(!isMuted);
  };

  const handleVideoToggle = () => {
    setIsVideoOn(!isVideoOn);
  };

  const handleShareScreen = () => {
    navigation.navigate('InSessionChat');
  };

  const handleEndCall = () => {
    navigation.navigate('ReviewsScreen');
  };

  return (
    <View style={styles.container}>
      {/* Main Video Feed - Doctor - Full Screen */}
      <View style={styles.mainVideoContainer}>
        <Icons.DoctorDeskIcon 
          width={screenWidth} 
          height={screenHeight}
          preserveAspectRatio="xMidYMid slice"
        />
      </View>

      {/* Back Button */}
      <TouchableOpacity
        style={[styles.backButton, { top: insets.top + 10 }]}
        onPress={handleBackPress}
        activeOpacity={0.7}
      >
        <Icons.ArrowLeftIcon width={24} height={24} />
      </TouchableOpacity>

      {/* Picture-in-Picture - Patient */}
      <View style={[styles.pipContainer, { bottom: 100 + insets.bottom }]}>
        <Icons.WomanHeadsetIcon 
          width={120} 
          height={160}
          preserveAspectRatio="xMidYMid meet"
        />
      </View>

      {/* Control Bar */}
      <View style={[styles.controlBar, { bottom: insets.bottom }]}>
        <TouchableOpacity
          style={[styles.controlButton, isMuted && styles.controlButtonActive]}
          onPress={handleMuteToggle}
          activeOpacity={0.7}
        >
          <Icons.Vector3Icon width={24} height={24} />
          {isMuted && (
            <View style={styles.crossOverlay}>
              <View style={styles.crossLine} />
            </View>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.controlButton, isVideoOn && styles.controlButtonActive]}
          onPress={handleVideoToggle}
          activeOpacity={0.7}
        >
          <Icons.Vector4Icon width={24} height={24} />
          {!isVideoOn && (
            <View style={styles.crossOverlay}>
              <View style={styles.crossLine} />
            </View>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.controlButton}
          onPress={handleShareScreen}
          activeOpacity={0.7}
        >
          <Icons.ShareScreenIcon width={24} height={24} />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.endCallButton}
          onPress={handleEndCall}
          activeOpacity={0.7}
        >
          <Icons.EndCallIcon width={24} height={24} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
    width: screenWidth,
    height: screenHeight,
  },
  mainVideoContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: screenWidth,
    height: screenHeight,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1A1A1A',
  },
  backButton: {
    position: 'absolute',
    left: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  pipContainer: {
    position: 'absolute',
    right: 20,
    width: 120,
    height: 160,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#1A1A1A',
    borderWidth: 2,
    borderColor: '#FFFFFF',
    zIndex: 5,
  },
  controlBar: {
    position: 'absolute',
    left: 20,
    right: 20,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#2A2A2A',
    borderRadius: 30,
    paddingVertical: 12,
    paddingHorizontal: 20,
    gap: 16,
    zIndex: 10,
  },
  controlButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#1A1A1A',
    justifyContent: 'center',
    alignItems: 'center',
  },
  controlButtonActive: {
    backgroundColor: '#3A3A3A',
  },
  endCallButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FF3B30',
    justifyContent: 'center',
    alignItems: 'center',
  },
  crossOverlay: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  crossLine: {
    width: 32,
    height: 3,
    backgroundColor: '#FF3B30',
    position: 'absolute',
    borderRadius: 1.5,
    transform: [{ rotate: '-45deg' }],
  },
});

export default SessionJoined;

