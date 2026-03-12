import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
} from 'react-native';
import Icons from '../../assets/svg';

interface HomeHeaderProps {
  onMenuPress?: () => void;
  onSearchPress?: () => void;
  onSearchChange?: (text: string) => void;
  placeholder?: string;
  value?: string;
}

const HomeHeader: React.FC<HomeHeaderProps> = ({
  onMenuPress,
  onSearchPress,
  onSearchChange,
  placeholder = '',
  value,
}) => {
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [searchText, setSearchText] = useState(value || '');
  const searchWidth = useRef(new Animated.Value(0)).current;
  const screenWidth = Dimensions.get('window').width;
  // Account for: menu button (40) + padding (16) + gap (8) + close icon (40) + gap (8) + padding (16) + extra margin (40) = 168
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
        onPress={onMenuPress}
        activeOpacity={0.7}
      >
        <Icons.Menu width={24} height={24} />
      </TouchableOpacity>

      <View style={styles.rightSection}>
        {!isSearchActive && (
          <TouchableOpacity
            style={styles.iconButton}
            onPress={handleSearchIconPress}
            activeOpacity={0.7}
          >
            <Icons.Search width={24} height={24} />
          </TouchableOpacity>
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
              <Icons.Search width={20} height={20} />
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

export default HomeHeader;

