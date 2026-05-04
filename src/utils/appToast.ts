import Toast from 'react-native-toast-message';

const defaultErrorOptions = {
  type: 'error' as const,
  position: 'top' as const,
  visibilityTime: 4500,
  topOffset: 0,
};

const defaultSuccessOptions = {
  type: 'success' as const,
  position: 'top' as const,
  visibilityTime: 3500,
  topOffset: 0,
};

/** Single-line or title + detail error (top toast, no system alert). */
export function showErrorToast(message: string, details?: string) {
  Toast.show({
    ...defaultErrorOptions,
    text1: message,
    text2: details,
  });
}

export function showSuccessToast(message: string, details?: string) {
  Toast.show({
    ...defaultSuccessOptions,
    text1: message,
    text2: details,
  });
}
