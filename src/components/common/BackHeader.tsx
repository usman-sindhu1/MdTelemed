import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Image,
  Animated,
  Dimensions,
} from 'react-native';
import Icons from '../../assets/svg';

interface BackHeaderProps {
  onBackPress?: () => void;
  onSearchPress?: () => void;
  onSearchChange?: (text: string) => void;
  onVector2Press?: () => void;
  onVectorPngPress?: () => void;
  placeholder?: string;
  value?: string;
  showSearchIcon?: boolean;
  showVector2Icon?: boolean;
  showVectorPngIcon?: boolean;
}

const BackHeader: React.FC<BackHeaderProps> = ({
  onBackPress,
  onSearchPress,
  onSearchChange,
  onVector2Press,
  onVectorPngPress,
  placeholder = '',
  value,
  showSearchIcon = false,
  showVector2Icon = false,
  showVectorPngIcon = false,
}) => {
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [searchText, setSearchText] = useState(value || '');
  const searchWidth = useRef(new Animated.Value(0)).current;
  const screenWidth = Dimensions.get('window').width;
  // Account for: back button (40) + padding (16) + gap (8) + close icon (40) + gap (8) + padding (16) + extra margin (40) = 168
  // This ensures the close icon stays within the header and the input is shorter
  const availableWidth = screenWidth - 168;

  useEffect(() => {
    if (isSearchActive) {
      Animated.timing(searchWidth, {
        toValue: 1,
        duration: 300,
        useNativeDriver: false,
      }).start();
    } else {
      Animated.timing(searchWidth, {
        toValue: 0,
        duration: 300,
        useNativeDriver: false,
      }).start();
    }
  }, [isSearchActive]);

  const handleSearchIconPress = () => {
    setIsSearchActive(true);
    if (onSearchPress) {
      onSearchPress();
    }
  };

  const handleSearchChange = (text: string) => {
    setSearchText(text);
    if (onSearchChange) {
      onSearchChange(text);
    }
  };

  const handleBackPress = () => {
    if (isSearchActive) {
      setIsSearchActive(false);
      setSearchText('');
      if (onSearchChange) {
        onSearchChange('');
      }
    } else if (onBackPress) {
      onBackPress();
    }
  };

  const handleCloseSearch = () => {
    setIsSearchActive(false);
    setSearchText('');
    if (onSearchChange) {
      onSearchChange('');
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.iconButton}
        onPress={handleBackPress}
        activeOpacity={0.7}
      >
        <Icons.Vector1Icon width={24} height={24} />
      </TouchableOpacity>

      <View style={styles.rightSection}>
        {!isSearchActive && (
          <>
            {showVector2Icon && (
              <TouchableOpacity
                style={styles.iconButton}
                onPress={onVector2Press}
                activeOpacity={0.7}
              >
                <Icons.Vector2Icon width={24} height={24} />
              </TouchableOpacity>
            )}

            {showVectorPngIcon && (
              <TouchableOpacity
                style={styles.iconButton}
                onPress={onVectorPngPress}
                activeOpacity={0.7}
              >
                <Image source={Icons.VectorPngIcon} style={styles.iconImage} />
              </TouchableOpacity>
            )}

            {showSearchIcon && (
              <TouchableOpacity
                style={styles.iconButton}
                onPress={handleSearchIconPress}
                activeOpacity={0.7}
              >
                <Image source={Icons.SearchPngIcon} style={styles.iconImage} />
              </TouchableOpacity>
            )}
          </>
        )}

        {isSearchActive && (
          <>
            <Animated.View
              style={[
                styles.searchContainer,
                {
                  width: searchWidth.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, availableWidth],
                  }),
                  opacity: searchWidth,
                },
              ]}
            >
              <Image source={Icons.SearchPngIcon} style={styles.searchIcon} />
              <TextInput
                style={styles.searchInput}
                placeholder={placeholder || 'Search'}
                placeholderTextColor="#999999"
                value={searchText}
                onChangeText={handleSearchChange}
                autoFocus={true}
                editable={true}
              />
            </Animated.View>
            <TouchableOpacity
              style={styles.iconButton}
              onPress={handleCloseSearch}
              activeOpacity={0.7}
            >
              <View style={styles.closeIcon}>
                <View style={styles.closeLine1} />
                <View style={styles.closeLine2} />
              </View>
            </TouchableOpacity>
          </>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F0E8FB',
    borderRadius: 80,
    paddingHorizontal: 8,
    paddingVertical: 8,
    gap: 8,
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginLeft: 'auto',
    flexShrink: 1,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#F0E8FB',
  },
  iconImage: {
    width: 24,
    height: 24,
  },
  searchContainer: {
    height: 40,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingHorizontal: 12,
    gap: 8,
    overflow: 'hidden',
    maxWidth: '100%',
  },
  searchIcon: {
    width: 20,
    height: 20,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#000000',
    padding: 0,
  },
  closeIcon: {
    width: 16,
    height: 16,
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeLine1: {
    position: 'absolute',
    width: 16,
    height: 2,
    backgroundColor: '#000000',
    transform: [{ rotate: '45deg' }],
  },
  closeLine2: {
    position: 'absolute',
    width: 16,
    height: 2,
    backgroundColor: '#000000',
    transform: [{ rotate: '-45deg' }],
  },
});

export default BackHeader;

