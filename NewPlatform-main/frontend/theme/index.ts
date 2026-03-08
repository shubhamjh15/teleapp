const shades = {
    50: '#F0F9FF',
    100: '#E0F2FE',
    200: '#BAE6FD',
    300: '#7DD3FC',
    400: '#38BDF8',
    500: '#0EA5E9',
    600: '#0284C7',
    700: '#0369A1',
    800: '#075985',
    900: '#0C4A6E',
};

export const colors = {
    primary: shades,
    secondary: shades,
    neutral: shades,
    success: shades,
    info: shades,
    warning: shades,
    accent: shades,
    nature: shades,
    background: {
        tertiary: '#F9FAFB',
    },
    border: {
        light: '#E5E7EB',
    },
    text: {
        primary: '#111827',
        secondary: '#4B5563',
        tertiary: '#9CA3AF',
    },
    safety: {
        safe: '#10B981',
        danger: '#EF4444',
        dangerLight: '#FEE2E2',
    },
};

export const textStyles = {
    body: {
        fontSize: 16,
    },
    bodySmall: {
        fontSize: 14,
    },
    bodyMedium: {
        fontSize: 16,
        fontWeight: '500' as const,
    },
    caption: {
        fontSize: 12,
    },
};

export const spacing = {
    '1': 4,
    '2': 8,
    '3': 12,
    '4': 16,
    '5': 20,
    '6': 24,
    '8': 32,
};

export const borderRadius = {
    lg: 8,
    full: 9999,
};

export const semanticSpacing = {
    screenHorizontal: 20,
};
