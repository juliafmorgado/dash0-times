// Dash0 Styling Utilities
// Consistent styling patterns for the Dash0 Times application

import { dash0Theme } from '../theme.js'

// Common CSS class generators
export const dash0Classes = {
  // Button variants
  button: {
    primary: 'dash0-button-primary',
    secondary: 'dash0-button-secondary',
  },
  
  // Text variants
  text: {
    primary: 'dash0-text-primary',
    secondary: 'dash0-text-secondary',
    muted: 'dash0-text-muted',
    accent: 'dash0-accent',
  },
  
  // Background variants
  background: {
    primary: 'dash0-bg-primary',
    secondary: 'dash0-bg-secondary',
  },
  
  // Card styling
  card: 'dash0-card',
}

// Inline style generators for dynamic styling
export const dash0Styles = {
  // Hero section styling
  hero: {
    title: {
      fontSize: dash0Theme.typography.fontSize['5xl'],
      fontWeight: dash0Theme.typography.fontWeight.bold,
      color: dash0Theme.colors.text.primary,
      textAlign: 'center',
      marginBottom: dash0Theme.spacing.lg,
      lineHeight: dash0Theme.typography.lineHeight.tight,
    },
    
    subtitle: {
      fontSize: dash0Theme.typography.fontSize.xl,
      color: dash0Theme.colors.primary.orange,
      textAlign: 'center',
      marginBottom: dash0Theme.spacing['2xl'],
      fontWeight: dash0Theme.typography.fontWeight.medium,
    }
  },
  
  // Loading states
  loading: {
    skeleton: {
      backgroundColor: dash0Theme.colors.background.secondary,
      borderRadius: dash0Theme.borderRadius.md,
      animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
    },
    
    spinner: {
      borderColor: dash0Theme.colors.border.primary,
      borderTopColor: dash0Theme.colors.primary.orange,
      animation: 'spin 1s linear infinite',
    }
  },
  
  // Form elements
  form: {
    input: {
      backgroundColor: dash0Theme.colors.background.secondary,
      border: `1px solid ${dash0Theme.colors.border.primary}`,
      borderRadius: dash0Theme.borderRadius.md,
      padding: dash0Theme.spacing.sm,
      color: dash0Theme.colors.text.primary,
      fontSize: dash0Theme.typography.fontSize.base,
      transition: dash0Theme.transitions.normal,
    },
    
    inputFocus: {
      borderColor: dash0Theme.colors.primary.orange,
      outline: `2px solid ${dash0Theme.colors.primary.orange}`,
      outlineOffset: '2px',
    }
  },
  
  // Error states
  error: {
    message: {
      backgroundColor: dash0Theme.colors.semantic.error,
      color: dash0Theme.colors.text.primary,
      padding: dash0Theme.spacing.md,
      borderRadius: dash0Theme.borderRadius.md,
      border: `1px solid ${dash0Theme.colors.semantic.error}`,
    },
    
    text: {
      color: dash0Theme.colors.semantic.error,
      fontSize: dash0Theme.typography.fontSize.sm,
    }
  },
  
  // Success states
  success: {
    message: {
      backgroundColor: dash0Theme.colors.semantic.success,
      color: dash0Theme.colors.text.primary,
      padding: dash0Theme.spacing.md,
      borderRadius: dash0Theme.borderRadius.md,
      border: `1px solid ${dash0Theme.colors.semantic.success}`,
    }
  }
}

// Animation keyframes (to be added to CSS)
export const dash0Animations = `
@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slideIn {
  from {
    transform: translateX(-100%);
  }
  to {
    transform: translateX(0);
  }
}
`

// Responsive breakpoint helpers
export const dash0Breakpoints = {
  isMobile: (width) => width < 640,
  isTablet: (width) => width >= 640 && width < 1024,
  isDesktop: (width) => width >= 1024,
}

// Color manipulation utilities
export const dash0ColorUtils = {
  // Add opacity to hex color
  withOpacity: (hexColor, opacity) => {
    const r = parseInt(hexColor.slice(1, 3), 16)
    const g = parseInt(hexColor.slice(3, 5), 16)
    const b = parseInt(hexColor.slice(5, 7), 16)
    return `rgba(${r}, ${g}, ${b}, ${opacity})`
  },
  
  // Get contrasting text color
  getContrastText: (backgroundColor) => {
    // Simple contrast calculation - in production, use a proper contrast library
    return backgroundColor === dash0Theme.colors.background.primary 
      ? dash0Theme.colors.text.primary 
      : dash0Theme.colors.text.inverse
  }
}

export default {
  classes: dash0Classes,
  styles: dash0Styles,
  animations: dash0Animations,
  breakpoints: dash0Breakpoints,
  colorUtils: dash0ColorUtils,
}