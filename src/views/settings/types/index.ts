export type Settings = {
    _id: string;
    title: string;
    fieldType: string;
    options: [{label:'', value:''}];
    value: string;
    values: string[];
    updatedAt: Date;
    createdAt: Date;
    slug: string;
    discription: string;
    order: number;
};

export type SettingsResponseType = {
    message: string;
    settings: Settings[];
};
export type UpdateSettingsDto = Partial<Settings[]>;

export type SettingsResponse = {
    updateSettings: Pick<SettingsResponseType, 'message' | 'settings'>;
    listSettings: Pick<SettingsResponseType, 'message' | 'settings'>;
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