# Dash0 Theme System Guide

This guide explains how to use the Dash0 branding and theme system in the Dash0 Times application.

## Overview

The Dash0 theme system provides consistent branding, colors, typography, and styling patterns based on the official Dash0 brand identity from https://www.dash0.com/.

## Key Files

- `src/theme.js` - Core theme configuration with colors, typography, and design tokens
- `src/components/BrandHeader.jsx` - Dash0 logo and brand header component
- `src/utils/dash0Styles.js` - Utility functions and common styling patterns
- `src/index.css` - Global CSS variables and base styles
- `src/App.css` - App-specific styles and utility classes

## Brand Colors

### Primary Colors
- **Orange**: `#FF6B47` - Dash0's signature color for accents and CTAs
- **Red**: `#FF4444` - Secondary accent for highlights
- **Dark**: `#1a1a1a` - Primary background color
- **Darker**: `#0f0f0f` - Deeper dark for contrast

### Usage in CSS
```css
/* Using CSS variables */
color: var(--dash0-color-primary-orange);
background-color: var(--dash0-color-background-primary);

/* Using utility classes */
.dash0-accent { color: var(--dash0-color-primary-orange); }
.dash0-bg-primary { background-color: var(--dash0-color-background-primary); }
```

### Usage in JavaScript
```javascript
import { dash0Theme } from './theme.js'

const buttonStyle = {
  backgroundColor: dash0Theme.colors.primary.orange,
  color: dash0Theme.colors.text.primary,
}
```

## Components

### BrandHeader
The `BrandHeader` component displays the Dash0 logo with proper branding:

```jsx
import BrandHeader from './components/BrandHeader'

function MyComponent() {
  return <BrandHeader />
}
```

## Utility Classes

### Buttons
- `.dash0-button-primary` - Primary orange button
- `.dash0-button-secondary` - Secondary outlined button

### Text
- `.dash0-text-primary` - Primary white text
- `.dash0-text-secondary` - Secondary gray text
- `.dash0-text-muted` - Muted gray text
- `.dash0-accent` - Orange accent text

### Backgrounds
- `.dash0-bg-primary` - Primary dark background
- `.dash0-bg-secondary` - Secondary dark background

### Cards
- `.dash0-card` - Standard card styling with border and shadow

### Animations
- `.dash0-fade-in` - Fade in animation
- `.dash0-slide-in` - Slide in from left animation
- `.dash0-pulse` - Pulsing animation for loading states
- `.dash0-spin` - Spinning animation for spinners

## Styling Utilities

### Using dash0Styles.js
```javascript
import { dash0Styles, dash0Classes } from './utils/dash0Styles.js'

// Inline styles
const heroTitle = {
  ...dash0Styles.hero.title,
  marginBottom: '2rem'
}

// CSS classes
const buttonClass = dash0Classes.button.primary
```

## Responsive Design

The theme includes responsive breakpoints:
- **sm**: 640px
- **md**: 768px  
- **lg**: 1024px
- **xl**: 1280px
- **2xl**: 1536px

## Typography

### Font Family
- **Primary**: Inter, system-ui, sans-serif
- **Mono**: JetBrains Mono, Consolas, monospace

### Font Sizes
Available as CSS variables: `--dash0-font-size-sm` through `--dash0-font-size-5xl`

### Font Weights
- Light: 300
- Normal: 400
- Medium: 500
- Semibold: 600
- Bold: 700
- Extrabold: 800

## Best Practices

1. **Consistency**: Always use the theme variables and utility classes instead of hardcoded values
2. **Accessibility**: Ensure proper contrast ratios using the provided color combinations
3. **Performance**: Use CSS variables for dynamic theming without JavaScript overhead
4. **Maintainability**: Update colors in `theme.js` to propagate changes throughout the app

## Examples

### Creating a Dash0-styled Card
```jsx
function ArticleCard({ title, content }) {
  return (
    <div className="dash0-card">
      <h3 className="dash0-text-primary">{title}</h3>
      <p className="dash0-text-secondary">{content}</p>
      <button className="dash0-button-primary">Read More</button>
    </div>
  )
}
```

### Custom Styling with Theme
```jsx
import { dash0Theme } from '../theme.js'

const customStyles = {
  container: {
    backgroundColor: dash0Theme.colors.background.secondary,
    padding: dash0Theme.spacing.lg,
    borderRadius: dash0Theme.borderRadius.lg,
    border: `1px solid ${dash0Theme.colors.border.primary}`,
  }
}
```

This theme system ensures consistent Dash0 branding across all components while providing flexibility for custom styling needs.