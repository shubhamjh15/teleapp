export interface OnboardingData {
    full_name: string;
    email: string;
    registration_number: string;
    license_expiry_date: string;
    years_of_experience: number;
    education: string;
    experience_details: string;
    hospital_affiliation: string;
    medical_license: any;
    degree_certificate: any;
    additional_certifications: any[];
    specialties: string[];
    sub_specialty: string;
    offers_video: boolean;
    offers_audio: boolean;
    offers_in_clinic: boolean;
    clinic_address: string;
    video_fee: number;
    audio_fee: number;
    in_clinic_fee: number;
    currency: string;
}
