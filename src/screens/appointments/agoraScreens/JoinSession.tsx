import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import BackHeader from '../../../components/common/BackHeader';
import Button from '../../../components/Button';
import Colors from '../../../constants/colors';
import Fonts from '../../../constants/fonts';
import { AppointmentsStackParamList } from '../../../navigation/HomeStack';

type JoinSessionNavigationProp = NativeStackNavigationProp<
  AppointmentsStackParamList,
  'JoinSession'
>;

const JoinSession: React.FC = () => {
  const navigation = useNavigation<JoinSessionNavigationProp>();

  const handleBackPress = () => {
    navigation.goBack();
  };

  const handleJoinSession = () => {
    navigation.navigate('SessionJoined');
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.headerContent}>
        <BackHeader
          onBackPress={handleBackPress}
          showSearchIcon={false}
        />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>
          <Text style={styles.title}>Join Session</Text>

          {/* Video Placeholder */}
          <View style={styles.videoPlaceholder}>
            {/* This will be replaced with actual video component */}
          </View>

          {/* Session Details */}
          <View style={styles.sessionDetails}>
            <Text style={styles.sessionTitle}>Join Session</Text>
            <Text style={styles.sessionDescription}>
              Attend your medical session with your doctor.
            </Text>
          </View>

          {/* Join Session Button */}
          <View style={styles.buttonContainer}>
            <Button
              title="Join Session"
              onPress={handleJoinSession}
              style={styles.joinButton}
              textStyle={styles.joinButtonText}
            />
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
  headerContent: {
    paddingHorizontal: 15,
    paddingTop: 8,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  content: {
    paddingHorizontal: 15,
    paddingTop: 24,
    gap: 24,
  },
  title: {
    fontFamily: Fonts.raleway,
    fontSize: 24,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 8,
  },
  videoPlaceholder: {
    width: '100%',
    aspectRatio: 16 / 9,
    backgroundColor: '#1A1A1A',
    borderRadius: 12,
    marginTop: 8,
  },
  sessionDetails: {
    alignItems: 'center',
    gap: 8,
    marginTop: 8,
  },
  sessionTitle: {
    fontFamily: Fonts.raleway,
    fontSize: 20,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  sessionDescription: {
    fontFamily: Fonts.openSans,
    fontSize: 16,
    fontWeight: '400',
    color: Colors.textSecondary,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  buttonContainer: {
    paddingTop: 20,
    paddingBottom: 20,
  },
  joinButton: {
    backgroundColor: Colors.primary,
    borderRadius: 80,
    height: 56,
    width: '100%',
  },
  joinButtonText: {
    fontFamily: Fonts.raleway,
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});

export default JoinSession;

