# Font Family Implementation Guide

This guide explains how to implement and use custom font families in your React Native app.

## Table of Contents

1. [Overview](#overview)
2. [Adding New Fonts](#adding-new-fonts)
3. [Platform Configuration](#platform-configuration)
4. [Using Fonts in Your App](#using-fonts-in-your-app)
5. [Best Practices](#best-practices)
6. [Troubleshooting](#troubleshooting)

---

## Overview

Your app uses a centralized font system located in `src/constants/fonts.ts`. Currently configured fonts:
- **OpenSans** (Regular & Italic) - Variable font
- **Raleway** (Regular & Italic) - Variable font

Font files are stored in:
- `src/constants/fonts/` - Source font files
- `ios/SHC/Resources/` - iOS font files
- `android/app/src/main/assets/fonts/` - Android font files

---

## Adding New Fonts

### Step 1: Add Font Files

1. **Place font files** in `src/constants/fonts/` directory
   - Supported formats: `.ttf`, `.otf`
   - Example: `MyCustomFont-Regular.ttf`, `MyCustomFont-Bold.ttf`

2. **Verify font files** are valid and not corrupted

### Step 2: Update react-native.config.js

The `react-native.config.js` file automatically links fonts from `src/constants/fonts/`:

```javascript
module.exports = {
  project: {
    ios: {},
    android: {},
  },
  assets: ['./src/constants/fonts/'],
};
```

**Note:** If you add fonts to a different directory, update the `assets` path.

### Step 3: Link Fonts to Native Projects

Run the asset linking command:

```bash
npx react-native-asset
```

This command will:
- Copy fonts to `ios/SHC/Resources/`
- Copy fonts to `android/app/src/main/assets/fonts/`
- Update iOS `Info.plist` with font names
- Configure Android to recognize the fonts

### Step 4: Update Font Constants

Edit `src/constants/fonts.ts` to add your new font:

```typescript
export const Fonts = {
  // Existing fonts
  openSans: 'OpenSans',
  openSansItalic: 'OpenSans-Italic',
  raleway: 'Raleway',
  ralewayItalic: 'Raleway-Italic',
  
  // Add your new font here
  myCustomFont: 'MyCustomFont',  // Use the exact font family name
  myCustomFontBold: 'MyCustomFont-Bold',
  
  // Default System Font (fallback)
  system: 'System',
} as const;
```

**Important:** Use the exact font family name, not the filename. To find the font name:
- **macOS**: Double-click the font file → Check "Font Name" in Font Book
- **Windows**: Right-click font file → Properties → Check "Font name"
- **Online**: Use a font inspector tool

### Step 5: Rebuild the App

After adding fonts, rebuild both platforms:

```bash
# iOS
cd ios
pod install
cd ..
npm run ios

# Android
npm run android
```

---

## Platform Configuration

### iOS Configuration

#### Automatic (Recommended)

The `react-native-asset` command automatically:
- Adds fonts to `ios/SHC/Resources/`
- Updates `ios/SHC/Info.plist` with `UIAppFonts` array

#### Manual iOS Setup

If automatic linking doesn't work:

1. **Add fonts to Xcode project:**
   - Open `ios/SHC.xcworkspace` in Xcode
   - Right-click `SHC` folder → "Add Files to SHC..."
   - Navigate to `ios/SHC/Resources/`
   - Select font files
   - Ensure "Copy items if needed" is **unchecked** (files already exist)
   - Select "Create groups"
   - Click "Add"

2. **Verify Info.plist:**
   ```xml
   <key>UIAppFonts</key>
   <array>
     <string>MyCustomFont-Regular.ttf</string>
     <string>MyCustomFont-Bold.ttf</string>
   </array>
   ```

3. **Clean and rebuild:**
   - Product → Clean Build Folder (Shift+Cmd+K)
   - Product → Build (Cmd+B)

### Android Configuration

#### Automatic (Recommended)

The `react-native-asset` command automatically:
- Copies fonts to `android/app/src/main/assets/fonts/`
- Android automatically recognizes fonts in this directory

#### Manual Android Setup

If automatic linking doesn't work:

1. **Copy font files manually:**
   ```bash
   cp src/constants/fonts/MyCustomFont*.ttf android/app/src/main/assets/fonts/
   ```

2. **Verify directory structure:**
   ```
   android/app/src/main/assets/fonts/
   ├── MyCustomFont-Regular.ttf
   ├── MyCustomFont-Bold.ttf
   └── ...
   ```

3. **Rebuild:**
   ```bash
   npm run android
   ```

---

## Using Fonts in Your App

### Method 1: Using Typography Constants (Recommended)

Use predefined typography styles for consistency:

```typescript
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Typography from '../constants/typography';
import Colors from '../constants/colors';

const MyComponent = () => {
  return (
    <View>
      <Text style={[styles.title, { color: Colors.textPrimary }]}>
        Heading Text
      </Text>
      <Text style={[styles.body, { color: Colors.textSecondary }]}>
        Body text content
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  title: {
    ...Typography.h1,  // Uses Raleway Bold, 40px
  },
  body: {
    ...Typography.body,  // Uses OpenSans Regular, 14px
  },
});

export default MyComponent;
```

### Method 2: Using Font Constants Directly

For custom font usage:

```typescript
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Fonts, { FontWeights, FontSizes } from '../constants/fonts';

const MyComponent = () => {
  return (
    <View>
      <Text style={styles.customText}>
        Custom styled text
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  customText: {
    fontFamily: Fonts.raleway,
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.bold,
  },
});
```

### Method 3: Inline Styles

For quick one-off usage:

```typescript
import Fonts from '../constants/fonts';

<Text style={{ fontFamily: Fonts.openSans, fontSize: 16 }}>
  Inline styled text
</Text>
```

### Available Typography Styles

| Style | Font | Size | Weight | Usage |
|-------|------|------|--------|-------|
| `Typography.h1` | Raleway | 40px | Bold | Main headings |
| `Typography.h2` | Raleway | 32px | Bold | Section headings |
| `Typography.h3` | Raleway | 28px | Bold | Subsection headings |
| `Typography.h4` | Raleway | 24px | SemiBold | Small headings |
| `Typography.bodyLarge` | OpenSans | 16px | Regular | Large body text |
| `Typography.body` | OpenSans | 14px | Regular | Regular body text |
| `Typography.bodySmall` | OpenSans | 12px | Regular | Small body text |
| `Typography.button` | OpenSans | 14px | Bold | Button text |
| `Typography.buttonLarge` | OpenSans | 16px | Bold | Large button text |
| `Typography.input` | OpenSans | 14px | Regular | Input fields |
| `Typography.caption` | OpenSans | 12px | Regular | Captions, helper text |
| `Typography.label` | OpenSans | 12px | SemiBold | Form labels |
| `Typography.link` | OpenSans | 14px | Bold | Links |

### Available Font Weights

```typescript
FontWeights.regular    // 400
FontWeights.medium     // 500
FontWeights.semiBold   // 600
FontWeights.bold       // 700
FontWeights.extraBold  // 800
```

### Available Font Sizes

```typescript
FontSizes.xs      // 10px
FontSizes.sm       // 12px
FontSizes.base     // 14px
FontSizes.md       // 16px
FontSizes.lg       // 18px
FontSizes.xl       // 20px
FontSizes['2xl']   // 24px
FontSizes['3xl']   // 28px
FontSizes['4xl']   // 32px
FontSizes['5xl']   // 40px
```

---

## Best Practices

### 1. Use Typography Constants

Always prefer `Typography` constants over direct font usage for consistency:

```typescript
// ✅ Good
<Text style={Typography.h1}>Heading</Text>

// ❌ Avoid
<Text style={{ fontFamily: 'Raleway', fontSize: 40, fontWeight: '700' }}>
  Heading
</Text>
```

### 2. Centralize Font Management

All font definitions should be in `src/constants/fonts.ts`. Don't hardcode font names in components.

### 3. Use Variable Fonts When Possible

Variable fonts (like OpenSans and Raleway) allow smooth weight transitions and reduce file size.

### 4. Provide Fallbacks

Always have a system font fallback:

```typescript
fontFamily: Fonts.myCustomFont || Fonts.system
```

### 5. Test on Both Platforms

Fonts may render differently on iOS and Android. Always test on both platforms.

### 6. Optimize Font Files

- Use variable fonts when possible
- Remove unused font weights/styles
- Consider using font subsets for specific languages

---

## Troubleshooting

### Font Not Appearing

**Problem:** Custom font not showing, system font used instead.

**Solutions:**

1. **Verify font name:**
   ```typescript
   // Check the exact font family name
   // It might be "MyCustomFont" not "MyCustomFont-Regular"
   ```

2. **Check font files are linked:**
   ```bash
   # iOS - Check Info.plist
   cat ios/SHC/Info.plist | grep UIAppFonts
   
   # Android - Check assets directory
   ls android/app/src/main/assets/fonts/
   ```

3. **Rebuild the app:**
   ```bash
   # iOS
   cd ios
   pod install
   cd ..
   npm run ios
   
   # Android
   npm run android
   ```

4. **Clear caches:**
   ```bash
   # Clear Metro cache
   npm start -- --reset-cache
   
   # Clear iOS build
   cd ios
   rm -rf build
   cd ..
   
   # Clear Android build
   cd android
   ./gradlew clean
   cd ..
   ```

### Font Name Mismatch

**Problem:** Font name in code doesn't match actual font family name.

**Solution:**

1. Find the actual font name:
   - macOS: Open font in Font Book → Check "Font Name"
   - Use online font inspector tools
   - Check font file metadata

2. Update `src/constants/fonts.ts` with the correct name

### iOS: Fonts Not in Xcode Project

**Problem:** Fonts exist in Resources folder but not linked in Xcode.

**Solution:**

1. Open `ios/SHC.xcworkspace` in Xcode
2. Check if fonts appear in Project Navigator
3. If not, manually add them (see [iOS Configuration](#ios-configuration))
4. Verify fonts are in "Copy Bundle Resources" build phase

### Android: Fonts Not Loading

**Problem:** Fonts not working on Android.

**Solutions:**

1. **Verify directory structure:**
   ```
   android/app/src/main/assets/fonts/
   └── MyFont.ttf
   ```
   Note: `assets` (not `res`), `fonts` (lowercase)

2. **Check file permissions:**
   ```bash
   chmod 644 android/app/src/main/assets/fonts/*.ttf
   ```

3. **Verify font file format:**
   - Android supports `.ttf` and `.otf`
   - Ensure files are not corrupted

### Variable Fonts Not Working

**Problem:** Variable font weights not applying correctly.

**Solution:**

Variable fonts use the base name without weight suffix:

```typescript
// ✅ Correct for variable fonts
fontFamily: 'OpenSans',  // Base name
fontWeight: '700',       // Weight as string

// ❌ Incorrect
fontFamily: 'OpenSans-Bold',  // Don't use weight in name
```

### Font Loading Performance

**Problem:** App slow to load or fonts flash.

**Solutions:**

1. **Preload fonts:**
   ```typescript
   import { Font } from 'expo-font'; // If using Expo
   // Or use react-native-font-loader for React Native
   ```

2. **Reduce font file sizes:**
   - Use font subsets
   - Remove unused weights/styles
   - Optimize font files

3. **Use system fonts for non-critical text:**
   ```typescript
   fontFamily: Fonts.system  // Faster, no loading needed
   ```

---

## Quick Reference

### Adding a New Font - Checklist

- [ ] Add font files to `src/constants/fonts/`
- [ ] Run `npx react-native-asset`
- [ ] Update `src/constants/fonts.ts` with font names
- [ ] Verify iOS `Info.plist` has font entries
- [ ] Verify Android `assets/fonts/` has font files
- [ ] Rebuild iOS: `cd ios && pod install && cd .. && npm run ios`
- [ ] Rebuild Android: `npm run android`
- [ ] Test font rendering on both platforms

### Common Commands

```bash
# Link assets (fonts, images, etc.)
npx react-native-asset

# Rebuild iOS
cd ios && pod install && cd .. && npm run ios

# Rebuild Android
npm run android

# Clear Metro cache
npm start -- --reset-cache

# Clean iOS build
cd ios && rm -rf build && cd ..

# Clean Android build
cd android && ./gradlew clean && cd ..
```

---

## Additional Resources

- [React Native Fonts Documentation](https://reactnative.dev/docs/text#limited-style-inheritance)
- [iOS Font Configuration](https://developer.apple.com/documentation/uikit/text_display/adding_a_custom_font_to_your_app)
- [Android Font Configuration](https://developer.android.com/guide/topics/ui/look-and-feel/fonts-in-xml)
- [Variable Fonts Guide](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Fonts/Variable_Fonts_Guide)

---

## Support

If you encounter issues not covered in this guide:

1. Check the [Troubleshooting](#troubleshooting) section
2. Verify all steps in the [Quick Reference](#quick-reference) checklist
3. Check React Native and platform-specific documentation
4. Review font file formats and compatibility

---

**Last Updated:** December 2024  
**App Version:** 0.0.1

