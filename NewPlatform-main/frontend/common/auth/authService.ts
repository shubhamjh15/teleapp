/**
 * Authentication service for HealthScan360 mobile app.
 * Handles OTP request/verification and token management.
 */

import AsyncStorage from '@react-native-async-storage/async-storage';

// ─── Configuration ────────────────────────────────────────────────────────────
const BASE_URL = process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:8000/api/v1';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface OTPRequestPayload {
    mobile_number: string;
}

export interface OTPVerifyPayload {
    mobile_number: string;
    otp: string;
}

export interface LoginResponse {
    access_token: string;
    refresh_token: string;
    token_type: string;
    user_id: number;
    role: string;
    is_clinician_onboarded?: boolean;
}

export interface APIError {
    detail: string;
    error_code?: string;
    timestamp?: string;
}

// ─── Token Storage ────────────────────────────────────────────────────────────

const TOKEN_KEYS = {
    ACCESS_TOKEN: '@healthscan360_access_token',
    REFRESH_TOKEN: '@healthscan360_refresh_token',
    USER_ID: '@healthscan360_user_id',
    USER_ROLE: '@healthscan360_user_role',
};

export const storeTokens = async (data: LoginResponse): Promise<void> => {
    try {
        await AsyncStorage.multiSet([
            [TOKEN_KEYS.ACCESS_TOKEN, data.access_token],
            [TOKEN_KEYS.REFRESH_TOKEN, data.refresh_token],
            [TOKEN_KEYS.USER_ID, String(data.user_id)],
            [TOKEN_KEYS.USER_ROLE, data.role],
        ]);
    } catch (error) {
        console.error('Failed to store tokens:', error);
        throw error;
    }
};

export const getAccessToken = async (): Promise<string | null> => {
    return AsyncStorage.getItem(TOKEN_KEYS.ACCESS_TOKEN);
};

export const clearTokens = async (): Promise<void> => {
    try {
        await AsyncStorage.multiRemove(Object.values(TOKEN_KEYS));
    } catch (error) {
        console.error('Failed to clear tokens:', error);
    }
};

// ─── Dummy Auth (no backend needed) ───────────────────────────────────────────

const DUMMY_OTP = process.env.EXPO_PUBLIC_DUMMY_OTP ?? '123456';

/**
 * Request OTP — dummy implementation.
 * Simulates a short delay, always succeeds. The valid OTP is "123456".
 */
export const requestOTP = async (
    mobileNumber: string
): Promise<{ message: string }> => {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 500));
    console.log(`[DUMMY AUTH] OTP for ${mobileNumber}: ${DUMMY_OTP}`);
    return { message: 'OTP sent successfully (dummy)' };
};

/**
 * Verify OTP — dummy implementation.
 * Accepts "123456" as the valid OTP and returns hardcoded tokens/user data.
 */
export const verifyOTP = async (
    mobileNumber: string,
    otp: string
): Promise<LoginResponse> => {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    if (otp !== DUMMY_OTP) {
        throw new Error('Invalid OTP. Please try again. (Hint: use 123456)');
    }

    const normalizedMobile = mobileNumber.replace(/\D/g, '');
    const isDashboardClinician = normalizedMobile.endsWith('2222222222');
    const isOnboardingClinician = normalizedMobile.endsWith('3333333333');
    const isClinician = isDashboardClinician || isOnboardingClinician || normalizedMobile.endsWith('99');

    const data: LoginResponse = {
        access_token: 'dummy_access_token_abc123',
        refresh_token: 'dummy_refresh_token_xyz789',
        token_type: 'bearer',
        user_id: isClinician ? 2 : 1,
        role: isClinician ? 'clinician' : 'patient',
        is_clinician_onboarded: isDashboardClinician ? true : (isOnboardingClinician ? false : true), // Default 99 to onboarded for ease, or whatever
    };

    // Store tokens locally
    await storeTokens(data);

    return data;
};
