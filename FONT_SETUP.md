# Font Setup Instructions

## ✅ What's Already Done

1. Font files are in `src/constants/fonts/`
2. Fonts are registered in `ios/SHC/Info.plist`
3. Fonts are linked to Android
4. Font constants are created in `src/constants/fonts.ts`
5. Typography system is set up in `src/constants/typography.ts`

## ⚠️ iOS Build Fix Required

The fonts need to be manually added to the Xcode project. Follow these steps:

### Option 1: Add Fonts in Xcode (Recommended)

1. Open `ios/SHC.xcworkspace` in Xcode
2. In the Project Navigator, right-click on the `SHC` folder
3. Select "Add Files to SHC..."
4. Navigate to `ios/SHC/Resources/` folder
5. Select all 4 `.ttf` font files
6. Make sure "Copy items if needed" is **unchecked** (files are already there)
7. Make sure "Create groups" is selected
8. Click "Add"
9. Clean build folder: Product → Clean Build Folder (Shift+Cmd+K)
10. Rebuild: Product → Build (Cmd+B)

### Option 2: Use Terminal (Alternative)

If the fonts are already in `ios/SHC/Resources/`, try:

```bash
cd ios
pod install
cd ..
npm run ios
```

### Option 3: Re-link Assets

```bash
npx react-native-asset --force
cd ios
pod install
cd ..
npm run ios
```

## 🔍 Verify Font Names

After adding fonts, verify the font family names are correct. Variable fonts might need the exact name from the file.

To check the actual font name:
1. Open the font file on Mac (double-click)
2. Check the "Font Name" shown in Font Book
3. Update `src/constants/fonts.ts` if the name is different

## 📱 Testing Fonts

After rebuilding, test if fonts are working:

```typescript
import Fonts from '../constants/fonts';

// In your component
<Text style={{ fontFamily: Fonts.raleway, fontSize: 20 }}>
  Test Raleway Font
</Text>
```

If fonts don't appear, the system font will be used as fallback.

