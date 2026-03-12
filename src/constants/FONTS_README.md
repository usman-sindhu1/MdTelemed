# Fonts Setup Guide

## Font Files
The following fonts are available in the app:
- **OpenSans** (Regular & Italic) - Variable font
- **Raleway** (Regular & Italic) - Variable font

## Usage

### Using Typography Constants (Recommended)

```typescript
import Typography from '../../constants/typography';

const styles = StyleSheet.create({
  title: {
    ...Typography.h1,
    color: Colors.textPrimary,
  },
  body: {
    ...Typography.body,
    color: Colors.textSecondary,
  },
});
```

### Using Font Constants Directly

```typescript
import Fonts, { FontWeights, FontSizes } from '../../constants/fonts';

const styles = StyleSheet.create({
  customText: {
    fontFamily: Fonts.raleway,
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.bold,
  },
});
```

## Available Typography Styles

- `Typography.h1` - Large heading (40px, Raleway Bold)
- `Typography.h2` - Medium heading (32px, Raleway Bold)
- `Typography.h3` - Small heading (28px, Raleway Bold)
- `Typography.h4` - Extra small heading (24px, Raleway SemiBold)
- `Typography.bodyLarge` - Large body text (16px, OpenSans Regular)
- `Typography.body` - Regular body text (14px, OpenSans Regular)
- `Typography.bodySmall` - Small body text (12px, OpenSans Regular)
- `Typography.button` - Button text (14px, OpenSans Bold)
- `Typography.buttonLarge` - Large button text (16px, OpenSans Bold)
- `Typography.input` - Input text (14px, OpenSans Regular)
- `Typography.caption` - Caption text (12px, OpenSans Regular)
- `Typography.label` - Label text (12px, OpenSans SemiBold)
- `Typography.link` - Link text (14px, OpenSans Bold)

## Font Weights

- `FontWeights.regular` - 400
- `FontWeights.medium` - 500
- `FontWeights.semiBold` - 600
- `FontWeights.bold` - 700
- `FontWeights.extraBold` - 800

## Font Sizes

- `FontSizes.xs` - 10px
- `FontSizes.sm` - 12px
- `FontSizes.base` - 14px
- `FontSizes.md` - 16px
- `FontSizes.lg` - 18px
- `FontSizes.xl` - 20px
- `FontSizes['2xl']` - 24px
- `FontSizes['3xl']` - 28px
- `FontSizes['4xl']` - 32px
- `FontSizes['5xl']` - 40px

## Notes

- Fonts have been automatically linked to iOS and Android projects
- Variable fonts support multiple weights - use `fontWeight` as a string (e.g., '400', '700')
- If a font doesn't load, the system font will be used as fallback

