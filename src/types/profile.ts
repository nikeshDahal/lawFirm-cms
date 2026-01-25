export type Admin = {
    _id: string;
    name: string;
    email: string;
    phone: string;
    status: string;
    role: string;
    profileImage: string;
};

export type ChangePasswordDTO = {
    userId: string;
    password: string;
    oldPassword: string;
};

export enum SignedUrlMethod {
    PUT = 'PUT',
    GET = 'GET'
}

export type PreSignedUrlInputDTO = {
    path: string;
    contentType: string;
    method: SignedUrlMethod;
};

export type PreSignedUrlResponse = {
    getPreSignedUrl: {
        url: string;
    };
};

export type ChangePasswordResponse = {
    changePassword: {
        message: string;
        status: boolean;
    };
};

export type UserProfileResponse = {
    getUserProfile: {
        _id: string;
        firstName: string;
        lastName: string;
        email: string;
        phone: string;
        status: string;
        role: string;
        profileImage: string;
        profileImageUrl: string;
    };
};

export type AdminResponse = {
    updateAdmin?: {
        message: string;
        admin: Admin;
    };
};

export type OTPAuthUrlResponse = {
    generateOtpAuthUrl: {
        base32: string;
        otpAuthUrl: string;
    };
};

export type VerifyOTPAuthUrlResponse = {
    verifyAuthOTP: {
        message: string;
    };
};

export type Pagination = {
    total: number;
    hasNextPage: boolean;
};
