/**
 * Country code data for the login screen dropdown.
 * Each entry contains the country name, ISO code, dial code, flag emoji,
 * and min/max phone number digit lengths for validation.
 */

export interface Country {
    name: string;
    code: string;
    dial_code: string;
    flag: string;
    minDigits: number;
    maxDigits: number;
}

export const COUNTRIES: Country[] = [
    { name: 'India', code: 'IN', dial_code: '+91', flag: '🇮🇳', minDigits: 10, maxDigits: 10 },
    { name: 'United States', code: 'US', dial_code: '+1', flag: '🇺🇸', minDigits: 10, maxDigits: 10 },
    { name: 'United Kingdom', code: 'GB', dial_code: '+44', flag: '🇬🇧', minDigits: 10, maxDigits: 11 },
    { name: 'Canada', code: 'CA', dial_code: '+1', flag: '🇨🇦', minDigits: 10, maxDigits: 10 },
    { name: 'Australia', code: 'AU', dial_code: '+61', flag: '🇦🇺', minDigits: 9, maxDigits: 10 },
    { name: 'Germany', code: 'DE', dial_code: '+49', flag: '🇩🇪', minDigits: 10, maxDigits: 12 },
    { name: 'France', code: 'FR', dial_code: '+33', flag: '🇫🇷', minDigits: 9, maxDigits: 10 },
    { name: 'Japan', code: 'JP', dial_code: '+81', flag: '🇯🇵', minDigits: 10, maxDigits: 11 },
    { name: 'China', code: 'CN', dial_code: '+86', flag: '🇨🇳', minDigits: 11, maxDigits: 11 },
    { name: 'Brazil', code: 'BR', dial_code: '+55', flag: '🇧🇷', minDigits: 10, maxDigits: 11 },
    { name: 'South Korea', code: 'KR', dial_code: '+82', flag: '🇰🇷', minDigits: 10, maxDigits: 11 },
    { name: 'Singapore', code: 'SG', dial_code: '+65', flag: '🇸🇬', minDigits: 8, maxDigits: 8 },
    { name: 'United Arab Emirates', code: 'AE', dial_code: '+971', flag: '🇦🇪', minDigits: 9, maxDigits: 10 },
    { name: 'Saudi Arabia', code: 'SA', dial_code: '+966', flag: '🇸🇦', minDigits: 9, maxDigits: 10 },
    { name: 'South Africa', code: 'ZA', dial_code: '+27', flag: '🇿🇦', minDigits: 9, maxDigits: 10 },
    { name: 'Mexico', code: 'MX', dial_code: '+52', flag: '🇲🇽', minDigits: 10, maxDigits: 10 },
    { name: 'Indonesia', code: 'ID', dial_code: '+62', flag: '🇮🇩', minDigits: 10, maxDigits: 13 },
    { name: 'Italy', code: 'IT', dial_code: '+39', flag: '🇮🇹', minDigits: 10, maxDigits: 11 },
    { name: 'Spain', code: 'ES', dial_code: '+34', flag: '🇪🇸', minDigits: 9, maxDigits: 9 },
    { name: 'Netherlands', code: 'NL', dial_code: '+31', flag: '🇳🇱', minDigits: 9, maxDigits: 10 },
    { name: 'Russia', code: 'RU', dial_code: '+7', flag: '🇷🇺', minDigits: 10, maxDigits: 10 },
    { name: 'Thailand', code: 'TH', dial_code: '+66', flag: '🇹🇭', minDigits: 9, maxDigits: 10 },
    { name: 'Malaysia', code: 'MY', dial_code: '+60', flag: '🇲🇾', minDigits: 9, maxDigits: 11 },
    { name: 'Philippines', code: 'PH', dial_code: '+63', flag: '🇵🇭', minDigits: 10, maxDigits: 10 },
    { name: 'Nigeria', code: 'NG', dial_code: '+234', flag: '🇳🇬', minDigits: 10, maxDigits: 11 },
    { name: 'Pakistan', code: 'PK', dial_code: '+92', flag: '🇵🇰', minDigits: 10, maxDigits: 11 },
    { name: 'Bangladesh', code: 'BD', dial_code: '+880', flag: '🇧🇩', minDigits: 10, maxDigits: 10 },
    { name: 'Sri Lanka', code: 'LK', dial_code: '+94', flag: '🇱🇰', minDigits: 9, maxDigits: 10 },
    { name: 'Nepal', code: 'NP', dial_code: '+977', flag: '🇳🇵', minDigits: 10, maxDigits: 10 },
    { name: 'New Zealand', code: 'NZ', dial_code: '+64', flag: '🇳🇿', minDigits: 9, maxDigits: 10 },
];

export const DEFAULT_COUNTRY = COUNTRIES[0]; // India
