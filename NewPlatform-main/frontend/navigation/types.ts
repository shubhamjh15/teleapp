export type ClinicianAuthStackParamList = {
    ClinicianLogin: undefined;
    ClinicianOTPVerification: undefined;
    ClinicianOnboarding: undefined;
};

export type ClinicianMainStackParamList = {
    ClinicianDashboard: undefined;
    ClinicianSchedule: undefined;
    ClinicianAppointments: undefined;
    ClinicianPatients: undefined;
    ClinicianPayments: undefined;
    ClinicianMessages: undefined;
    ClinicianProducts: undefined;
    ClinicianProductDetails: { productId: string; productName: string };
    ClinicianSettings: undefined;
    ClinicianNotifications: undefined;
    ClinicianSessions: undefined;
    ClinicianConsultation: { patientId: string; patientName: string };
    ClinicianReports: undefined;
    ClinicianReport: undefined;
    ClinicianReportPreview: undefined;
    [key: string]: any;
};
