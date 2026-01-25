export type FileUploadParams = {
    event: any;
    uploadFunction: any;
    contentType?: string;
    filename?: string;
};

export enum SignedUrlMethod {
    PUT = 'PUT',
    GET = 'GET'
}

export type PreSignedUrlInputDTO = {
    path: string;
    contentType?: string;
    method: SignedUrlMethod;
};

export type PreSignedUrlResponse = {
    getPreSignedUrl: {
        url: string;
    };
};
