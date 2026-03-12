declare module '*.svg' {
  import React from 'react';
  import { SvgProps } from 'react-native-svg';
  const content: React.FC<SvgProps & { width?: string | number; height?: string | number; preserveAspectRatio?: string }>;
  export default content;
}

