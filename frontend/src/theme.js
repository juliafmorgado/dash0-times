// Dash0 Brand Theme System
// Based on https://www.dash0.com/ brand identity

export const dash0Theme = {
  // Brand Colors
  colors: {
    // Primary brand colors
    primary: {
      orange: '#FF6B47', // Dash0 signature orange/coral
      red: '#FF4444',    // Accent red for highlights
      dark: '#1a1a1a',   // Primary dark background
      darker: '#0f0f0f', // Deeper dark for contrast
    },
    
    // Neutral colors
    neutral: {
      white: '#ffffff',
      gray100: '#f5f5f5',
      gray200: '#e5e5e5',
      gray300: '#d4d4d4',
      gray400: '#a3a3a3',
      gray500: '#737373',
      gray600: '#525252',
      gray700: '#404040',
      gray800: '#262626',
      gray900: '#171717',
    },
    
    // Semantic colors
    semantic: {
      success: '#22c55e',
      warning: '#f59e0b',
      error: '#ef4444',
      info: '#3b82f6',
    },
    
    // Text colors
    text: {
      primary: '#ffffff',
      secondary: '#a3a3a3',
      muted: '#737373',
      inverse: '#1a1a1a',
    },
    
    // Background colors
    background: {
      primary: '#1a1a1a',
      secondary: '#262626',
      tertiary: '#404040',
      overlay: 'rgba(26, 26, 26, 0.8)',
    },
    
    // Border colors
    border: {
      primary: '#404040',
      secondary: '#525252',
      accent: '#FF6B47',
    }
  },
  
  // Typography
  typography: {
    fontFamily: {
      primary: 'Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      mono: 'JetBrains Mono, Consolas, "Liberation Mono", Menlo, Courier, monospace',
    },
    
    fontSize: {
      xs: '0.75rem',    // 12px
      sm: '0.875rem',   // 14px
      base: '1rem',     // 16px
      lg: '1.125rem',   // 18px
      xl: '1.25rem',    // 20px
      '2xl': '1.5rem',  // 24px
      '3xl': '1.875rem', // 30px
      '4xl': '2.25rem', // 36px
      '5xl': '3rem',    // 48px
      '6xl': '3.75rem', // 60px
    },
    
    fontWeight: {
      light: '300',
      normal: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
      extrabold: '800',
    },
    
    lineHeight: {
      tight: '1.25',
      normal: '1.5',
      relaxed: '1.75',
    }
  },
  
  // Spacing
  spacing: {
    xs: '0.25rem',   // 4px
    sm: '0.5rem',    // 8px
    md: '1rem',      // 16px
    lg: '1.5rem',    // 24px
    xl: '2rem',      // 32px
    '2xl': '3rem',   // 48px
    '3xl': '4rem',   // 64px
    '4xl': '6rem',   // 96px
  },
  
  // Border radius
  borderRadius: {
    none: '0',
    sm: '0.25rem',   // 4px
    md: '0.375rem',  // 6px
    lg: '0.5rem',    // 8px
    xl: '0.75rem',   // 12px
    '2xl': '1rem',   // 16px
    full: '9999px',
  },
  
  // Shadows
  shadows: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
  },
  
  // Transitions
  transitions: {
    fast: '150ms ease-in-out',
    normal: '250ms ease-in-out',
    slow: '350ms ease-in-out',
  },
  
  // Breakpoints
  breakpoints: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
  }
};

// CSS Custom Properties Generator
export const generateCSSVariables = (theme) => {
  const cssVars = {};
  
  // Generate color variables
  Object.entries(theme.colors).forEach(([category, colors]) => {
    if (typeof colors === 'object') {
      Object.entries(colors).forEach(([name, value]) => {
        cssVars[`--dash0-color-${category}-${name}`] = value;
      });
    } else {
      cssVars[`--dash0-color-${category}`] = colors;
    }
  });
  
  // Generate spacing variables
  Object.entries(theme.spacing).forEach(([name, value]) => {
    cssVars[`--dash0-spacing-${name}`] = value;
  });
  
  // Generate typography variables
  Object.entries(theme.typography.fontSize).forEach(([name, value]) => {
    cssVars[`--dash0-font-size-${name}`] = value;
  });
  
  return cssVars;
};

// Utility functions for consistent styling
export const themeUtils = {
  // Get color with fallback
  getColor: (path, fallback = '#ffffff') => {
    const keys = path.split('.');
    let value = dash0Theme.colors;
    
    for (const key of keys) {
      value = value?.[key];
      if (!value) return fallback;
    }
    
    return value;
  },
  
  // Generate button styles
  buttonStyles: {
    primary: {
      backgroundColor: dash0Theme.colors.primary.orange,
      color: dash0Theme.colors.text.primary,
      border: `1px solid ${dash0Theme.colors.primary.orange}`,
      borderRadius: dash0Theme.borderRadius.md,
      padding: `${dash0Theme.spacing.sm} ${dash0Theme.spacing.lg}`,
      fontSize: dash0Theme.typography.fontSize.base,
      fontWeight: dash0Theme.typography.fontWeight.medium,
      transition: dash0Theme.transitions.normal,
      cursor: 'pointer',
    },
    
    secondary: {
      backgroundColor: 'transparent',
      color: dash0Theme.colors.text.primary,
      border: `1px solid ${dash0Theme.colors.border.primary}`,
      borderRadius: dash0Theme.borderRadius.md,
      padding: `${dash0Theme.spacing.sm} ${dash0Theme.spacing.lg}`,
      fontSize: dash0Theme.typography.fontSize.base,
      fontWeight: dash0Theme.typography.fontWeight.medium,
      transition: dash0Theme.transitions.normal,
      cursor: 'pointer',
    },
    
    ghost: {
      backgroundColor: 'transparent',
      color: dash0Theme.colors.text.secondary,
      border: 'none',
      borderRadius: dash0Theme.borderRadius.md,
      padding: `${dash0Theme.spacing.sm} ${dash0Theme.spacing.lg}`,
      fontSize: dash0Theme.typography.fontSize.base,
      fontWeight: dash0Theme.typography.fontWeight.medium,
      transition: dash0Theme.transitions.normal,
      cursor: 'pointer',
    }
  },
  
  // Generate card styles
  cardStyles: {
    backgroundColor: dash0Theme.colors.background.secondary,
    border: `1px solid ${dash0Theme.colors.border.primary}`,
    borderRadius: dash0Theme.borderRadius.lg,
    padding: dash0Theme.spacing.lg,
    boxShadow: dash0Theme.shadows.md,
  }
};

export default dash0Theme;