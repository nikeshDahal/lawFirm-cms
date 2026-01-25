export type Settings = {
    _id: string;
    title: string;
    fieldType: string;
    options: string[];
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
export type SettingsResponse = {
    updateSettings: Pick<SettingsResponseType, 'message' | 'settings'>;
    listSettings: Pick<SettingsResponseType, 'message' | 'settings'>;
};
