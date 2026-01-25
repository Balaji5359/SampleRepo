// Theme Configuration for Practice Module
export const themes = {
  dark: {
    name: 'Dark',
    icon: '🌙',
    colors: {
      bg: 'linear-gradient(180deg, #0f172a 0%, #071129 100%)',
      cardBg: 'rgba(255,255,255,0.04)',
      accent: '#3B9797',
      accentDark: '#2c7a7a',
      text: '#e6eef8',
      muted: 'rgba(255,255,255,0.75)',
      border: 'rgba(255,255,255,0.1)',
      success: '#10b981',
      warning: '#fbbf24',
      danger: '#ff6b6b',
      info: '#3b82f6',
      purple: '#a855f7',
    },
    shadows: {
      sm: '0 4px 12px rgba(59, 151, 151, 0.2)',
      md: '0 8px 25px rgba(59, 151, 151, 0.3)',
      lg: '0 15px 40px rgba(59, 151, 151, 0.4)',
    }
  },
  light: {
    name: 'Light',
    icon: '☀️',
    colors: {
      bg: 'linear-gradient(180deg, #f8fafc 0%, #eef2ff 100%)',
      cardBg: '#ffffff',
      accent: '#0ea5a4',
      accentDark: '#0d9488',
      text: '#0b1220',
      muted: '#6b7280',
      border: '#e5e7eb',
      success: '#059669',
      warning: '#d97706',
      danger: '#dc2626',
      info: '#0284c7',
      purple: '#7c3aed',
    },
    shadows: {
      sm: '0 4px 12px rgba(14, 165, 164, 0.15)',
      md: '0 8px 25px rgba(14, 165, 164, 0.25)',
      lg: '0 15px 40px rgba(14, 165, 164, 0.35)',
    }
  },
  premium: {
    name: 'Premium',
    icon: '✨',
    colors: {
      bg: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
      cardBg: 'linear-gradient(135deg, rgba(59,151,151,0.15) 0%, rgba(16,185,129,0.1) 100%)',
      accent: '#7dd3d3',
      accentDark: '#5bbbb8',
      text: '#e6f7f7',
      muted: 'rgba(255,255,255,0.85)',
      border: 'rgba(59,151,151,0.3)',
      success: '#34d399',
      warning: '#fbbf24',
      danger: '#f87171',
      info: '#60a5fa',
      purple: '#d8b4fe',
    },
    shadows: {
      sm: '0 4px 12px rgba(125, 211, 211, 0.25)',
      md: '0 8px 25px rgba(125, 211, 211, 0.35)',
      lg: '0 15px 40px rgba(125, 211, 211, 0.45)',
    }
  }
};

export const applyTheme = (theme) => {
  const root = document.documentElement;
  const themeConfig = themes[theme] || themes.dark;
  
  Object.entries(themeConfig.colors).forEach(([key, value]) => {
    root.style.setProperty(`--theme-${key}`, value);
  });
  
  Object.entries(themeConfig.shadows).forEach(([key, value]) => {
    root.style.setProperty(`--theme-shadow-${key}`, value);
  });
};

export const getThemeCSS = () => `
  :root {
    --theme-bg: ${themes.dark.colors.bg};
    --theme-cardBg: ${themes.dark.colors.cardBg};
    --theme-accent: ${themes.dark.colors.accent};
    --theme-accentDark: ${themes.dark.colors.accentDark};
    --theme-text: ${themes.dark.colors.text};
    --theme-muted: ${themes.dark.colors.muted};
    --theme-border: ${themes.dark.colors.border};
    --theme-success: ${themes.dark.colors.success};
    --theme-warning: ${themes.dark.colors.warning};
    --theme-danger: ${themes.dark.colors.danger};
    --theme-info: ${themes.dark.colors.info};
    --theme-purple: ${themes.dark.colors.purple};
    --theme-shadow-sm: ${themes.dark.shadows.sm};
    --theme-shadow-md: ${themes.dark.shadows.md};
    --theme-shadow-lg: ${themes.dark.shadows.lg};
  }
`;
