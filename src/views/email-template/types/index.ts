export type Row = {
    _id: string;
};

/* field properyt types */

export type mainFields = {
    id: string;
    header: {
        title: string;
        slug: string;
        subject: string;
    }[];
};

/* GQL types */

export type GetEmailTemplateDTO = {
    searchText: string;
    orderBy: string;
    order: string;
    limit: number;
    skip: number;
};

export type CreateEmailTemplateDTO = {
    title: string;
    slug: string;
    subject: string;
    body: string;
    status?: string;
};
export type InputEmailTemplate = {
    title: string;
    slug: string;
    subject: string;
    body: string;
};
export type EmailTemplate = {
    _id: string;
    title: string;
    slug: string;
    subject: string;
    body: string;
    createdAt: string;
    updatedAt: string;
    status?: string;
    __typename: string;
};

export type Pagination = {
    total: number;
    hasNextPage: boolean;
};
export type EmailTemplateResponseType = {
    message: string;
    pagination?: Pagination;
    emailTemplates: EmailTemplate[];
    emailTemplate?: EmailTemplate;
};

export type EmailTemplateResponse = {
    getAllEmailTemplates?: EmailTemplateResponseType;
    getEmailTemplate?: EmailTemplateResponseType;
    createEmailTemplate?: EmailTemplateResponseType;
    updateEmailTemplate?: EmailTemplateResponseType;
    removeEmailTemplate?: EmailTemplateResponseType;
};

export type TemplateResponse = {
    readEmailTemplate: {
        template;
    };
};
