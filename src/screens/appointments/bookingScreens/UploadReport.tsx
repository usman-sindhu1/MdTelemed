import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Platform,
  Animated,
  Modal,
  Alert,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import DocumentPicker, { DocumentPickerResponse } from 'react-native-document-picker';
import BackHeader from '../../../components/common/BackHeader';
import Colors from '../../../constants/colors';
import Fonts from '../../../constants/fonts';
import Icons from '../../../assets/svg';
import { AppointmentsStackParamList } from '../../../navigation/HomeStack';

type UploadReportNavigationProp = NativeStackNavigationProp<
  AppointmentsStackParamList,
  'UploadReport'
>;

interface UploadedFile {
  id: string;
  name: string;
  uri: string;
  type: string;
  size?: number;
}

const UploadReport: React.FC = () => {
  const navigation = useNavigation<UploadReportNavigationProp>();
  const insets = useSafeAreaInsets();
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [selectedFileIndex, setSelectedFileIndex] = useState<number | null>(null);
  const [showMoreOptionsMenu, setShowMoreOptionsMenu] = useState(false);
  const [isScrolling, setIsScrolling] = useState(false);
  const [isAtBottom, setIsAtBottom] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const handleBackPress = () => {
    navigation.goBack();
  };

  const handleUpload = async () => {
    try {
      const results = await DocumentPicker.pick({
        type: [DocumentPicker.types.allFiles],
        allowMultiSelection: false,
      });

      if (results && results.length > 0) {
        const file = results[0];
        const newFile: UploadedFile = {
          id: Date.now().toString(),
          name: file.name || 'Unknown file',
          uri: file.uri,
          type: file.type || 'application/octet-stream',
          size: file.size ?? undefined,
        };
        setUploadedFiles([...uploadedFiles, newFile]);
      }
    } catch (err: any) {
      if (DocumentPicker.isCancel(err)) {
        // User cancelled the picker
        console.log('User cancelled file picker');
      } else {
        // Check if it's a native module error
        const errorMessage = err?.message || String(err);
        if (errorMessage.includes('RNDocumentPicker') || errorMessage.includes('could not be found')) {
          Alert.alert(
            'Native Module Error',
            'The file picker module is not properly linked. Please rebuild the app:\n\nFor iOS: Run "npx react-native run-ios"\nFor Android: Run "npx react-native run-android"',
            [{ text: 'OK' }]
          );
        } else {
          Alert.alert('Error', 'Failed to pick file. Please try again.');
        }
        console.error('DocumentPicker error:', err);
      }
    }
  };

  const handleMoreOptions = (index: number) => {
    setSelectedFileIndex(index);
    setShowMoreOptionsMenu(true);
  };

  const handleAddMore = async () => {
    setShowMoreOptionsMenu(false);
    try {
      const results = await DocumentPicker.pick({
        type: [DocumentPicker.types.allFiles],
        allowMultiSelection: true,
      });

      if (results && results.length > 0) {
        const newFiles: UploadedFile[] = results.map((file) => ({
          id: Date.now().toString() + Math.random().toString(),
          name: file.name || 'Unknown file',
          uri: file.uri,
          type: file.type || 'application/octet-stream',
          size: file.size ?? undefined,
        }));
        setUploadedFiles([...uploadedFiles, ...newFiles]);
      }
    } catch (err: any) {
      if (DocumentPicker.isCancel(err)) {
        console.log('User cancelled file picker');
      } else {
        // Check if it's a native module error
        const errorMessage = err?.message || String(err);
        if (errorMessage.includes('RNDocumentPicker') || errorMessage.includes('could not be found')) {
          Alert.alert(
            'Native Module Error',
            'The file picker module is not properly linked. Please rebuild the app:\n\nFor iOS: Run "npx react-native run-ios"\nFor Android: Run "npx react-native run-android"',
            [{ text: 'OK' }]
          );
        } else {
          Alert.alert('Error', 'Failed to pick files. Please try again.');
        }
        console.error('DocumentPicker error:', err);
      }
    }
  };

  const handleDelete = () => {
    if (selectedFileIndex !== null) {
      const newFiles = uploadedFiles.filter((_, index) => index !== selectedFileIndex);
      setUploadedFiles(newFiles);
      setShowMoreOptionsMenu(false);
      setSelectedFileIndex(null);
    }
  };

  const handleCloseMenu = () => {
    setShowMoreOptionsMenu(false);
    setSelectedFileIndex(null);
  };

  const handleContinue = () => {
    navigation.navigate('FinalBookingData');
  };

  const handleCancel = () => {
    navigation.goBack();
  };

  const buttonContainerHeight = 140;
  const isFormValid = uploadedFiles.length > 0;

  useEffect(() => {
    if (isScrolling || isAtBottom || isFormValid) {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [isScrolling, isAtBottom, isFormValid]);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Fixed Header */}
      <View style={styles.headerContainer}>
        <BackHeader onBackPress={handleBackPress} />
      </View>

      <ScrollView
        ref={scrollViewRef}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: buttonContainerHeight + (Platform.OS === 'ios' ? insets.bottom : 0) }
        ]}
        showsVerticalScrollIndicator={false}
        onScrollBeginDrag={() => setIsScrolling(true)}
        onScrollEndDrag={() => setIsScrolling(false)}
        onMomentumScrollBegin={() => setIsScrolling(true)}
        onMomentumScrollEnd={() => setIsScrolling(false)}
        onScroll={(event) => {
          const { contentOffset, contentSize, layoutMeasurement } = event.nativeEvent;
          const scrollY = contentOffset.y;
          const contentHeight = contentSize.height;
          const scrollViewHeight = layoutMeasurement.height;
          const isNearBottom = scrollY + scrollViewHeight >= contentHeight - 50;
          
          if (isNearBottom) {
            setIsAtBottom(true);
          } else if (scrollY < 100) {
            setIsAtBottom(false);
          }
        }}
        scrollEventThrottle={16}
      >
        <View style={styles.content}>
          {/* Title Section */}
          <View style={styles.titleSection}>
            <Text style={styles.heading}>Book Your Appointment</Text>
            <Text style={styles.subtitle}>
              Complete the following steps to schedule appointment.
            </Text>
          </View>

          {/* Upload Report Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Upload Your Report</Text>
            
            {/* Upload Input Row */}
            <View style={styles.uploadContainer}>
              <View style={styles.inputWrapper}>
                <TextInput
                  style={styles.input}
                  placeholder="File name"
                  placeholderTextColor={Colors.textPlaceholder}
                  value={uploadedFiles.length > 0 ? uploadedFiles[0].name : ''}
                  editable={false}
                />
              </View>
              
              <TouchableOpacity
                style={styles.uploadButton}
                onPress={handleUpload}
                activeOpacity={0.7}
              >
                <Icons.Vector8Icon width={20} height={20} />
                <Text style={styles.uploadButtonText}>Upload</Text>
              </TouchableOpacity>
              
              {uploadedFiles.length > 0 && (
                <TouchableOpacity
                  style={styles.moreOptionsButton}
                  onPress={() => handleMoreOptions(0)}
                  activeOpacity={0.7}
                >
                  <View style={styles.dotsContainer}>
                    <View style={styles.dot} />
                    <View style={styles.dot} />
                    <View style={styles.dot} />
                  </View>
                </TouchableOpacity>
              )}
            </View>

            {/* Uploaded Files List */}
            {uploadedFiles.length > 0 && (
              <View style={styles.filesList}>
                {uploadedFiles.map((file, index) => (
                  <View key={file.id} style={styles.fileItem}>
                    <View style={styles.fileInfo}>
                      <Text style={styles.fileName} numberOfLines={1}>
                        {file.name}
                      </Text>
                      {file.size && (
                        <Text style={styles.fileSize}>
                          {(file.size / 1024).toFixed(2)} KB
                        </Text>
                      )}
                    </View>
                    {index > 0 && (
                      <TouchableOpacity
                        style={styles.fileMoreButton}
                        onPress={() => handleMoreOptions(index)}
                        activeOpacity={0.7}
                      >
                        <View style={styles.dotsContainer}>
                          <View style={styles.dot} />
                          <View style={styles.dot} />
                          <View style={styles.dot} />
                        </View>
                      </TouchableOpacity>
                    )}
                  </View>
                ))}
              </View>
            )}
          </View>
        </View>
      </ScrollView>

      {/* Action Buttons */}
      <Animated.View
        style={[
          styles.buttonContainer,
          {
            paddingBottom: Platform.OS === 'ios' ? Math.max(insets.bottom, 20) : 20,
            opacity: fadeAnim,
            transform: [
              {
                translateY: fadeAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [50, 0],
                }),
              },
            ],
            pointerEvents: (isScrolling || isAtBottom || isFormValid) ? 'auto' : 'none',
          },
        ]}
      >
        <TouchableOpacity
          style={[
            styles.continueButton,
            !isFormValid && styles.continueButtonDisabled
          ]}
          onPress={handleContinue}
          activeOpacity={0.7}
          disabled={!isFormValid}
        >
          <Text style={[
            styles.continueButtonText,
            !isFormValid && styles.continueButtonTextDisabled
          ]}>
            Continue
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.cancelButton}
          onPress={handleCancel}
          activeOpacity={0.7}
        >
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>
      </Animated.View>

      {/* More Options Menu Modal */}
      <Modal
        visible={showMoreOptionsMenu}
        transparent={true}
        animationType="fade"
        onRequestClose={handleCloseMenu}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={handleCloseMenu}
        >
          <View style={styles.menuContainer}>
            <TouchableOpacity
              style={styles.menuItem}
              onPress={handleAddMore}
              activeOpacity={0.7}
            >
              <Text style={styles.menuItemText}>Add more</Text>
            </TouchableOpacity>
            <View style={styles.menuDivider} />
            <TouchableOpacity
              style={styles.menuItem}
              onPress={handleDelete}
              activeOpacity={0.7}
            >
              <Text style={[styles.menuItemText, styles.menuItemTextDelete]}>
                Delete
              </Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  headerContainer: {
    paddingHorizontal: 15,
    backgroundColor: Colors.background,
    zIndex: 10,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 150,
  },
  content: {
    paddingHorizontal: 15,
  },
  titleSection: {
    marginTop: 24,
    marginBottom: 24,
    gap: 8,
  },
  heading: {
    fontFamily: Fonts.raleway,
    fontSize: 24,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  subtitle: {
    fontFamily: Fonts.openSans,
    fontSize: 14,
    fontWeight: '400',
    color: Colors.textSecondary,
    lineHeight: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontFamily: Fonts.raleway,
    fontSize: 18,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 16,
  },
  uploadContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  inputWrapper: {
    flex: 1,
  },
  input: {
    width: '100%',
    height: 52,
    backgroundColor: Colors.inputBackgroundDefault,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.inputBorder,
    paddingHorizontal: 16,
    fontSize: 14,
    fontWeight: '400',
    color: Colors.inputText,
    fontFamily: Fonts.openSans,
  },
  uploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingHorizontal: 16,
    height: 52,
    borderRadius: 12,
    backgroundColor: Colors.background,
  },
  uploadButtonText: {
    fontFamily: Fonts.raleway,
    fontSize: 14,
    fontWeight: '600',
    color: Colors.primary,
  },
  moreOptionsButton: {
    width: 52,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dotsContainer: {
    flexDirection: 'column',
    gap: 4,
    alignItems: 'center',
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.textPrimary,
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 15,
    paddingBottom: 20,
    paddingTop: 12,
    backgroundColor: 'transparent',
    gap: 12,
  },
  continueButton: {
    width: '100%',
    height: 52,
    borderRadius: 80,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  continueButtonDisabled: {
    backgroundColor: '#CBCACE',
  },
  continueButtonText: {
    fontFamily: Fonts.raleway,
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  continueButtonTextDisabled: {
    color: '#9E9E9E',
  },
  cancelButton: {
    width: '100%',
    height: 52,
    borderRadius: 80,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E5E5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancelButtonText: {
    fontFamily: Fonts.raleway,
    fontSize: 14,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  filesList: {
    marginTop: 16,
    gap: 12,
  },
  fileItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.inputBackgroundDefault,
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: Colors.inputBorder,
  },
  fileInfo: {
    flex: 1,
    marginRight: 12,
  },
  fileName: {
    fontFamily: Fonts.openSans,
    fontSize: 14,
    fontWeight: '400',
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  fileSize: {
    fontFamily: Fonts.openSans,
    fontSize: 12,
    fontWeight: '400',
    color: Colors.textSecondary,
  },
  fileMoreButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    minWidth: 200,
    paddingVertical: 8,
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 5,
  },
  menuItem: {
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  menuItemText: {
    fontFamily: Fonts.openSans,
    fontSize: 16,
    fontWeight: '400',
    color: Colors.textPrimary,
  },
  menuItemTextDelete: {
    color: Colors.error,
  },
  menuDivider: {
    height: 1,
    backgroundColor: Colors.inputBorder,
    marginVertical: 4,
  },
});

export default UploadReport;

