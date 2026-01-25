export type Row = {
    _id: string;
};

export enum PresetTemplateStatusEnum {
    Active = 'Active',
    Inactive = 'Inactive'
}

export enum TemplateTypeEnum {
    Task = 'Task',
    Schedule = 'Schedule'
}

/* GQL types */

export type IdInput = {
    id: string;
};

export type DeletePresetTemplate = {
    id: string;
};

export type GetPresetTemplateDTO = {
    searchText: string;
    orderBy: string;
    order: string;
    limit: number;
    skip: number;
    templateType?: TemplateTypeEnum;
    categoryIds?: string[];
};

export type CreateTemplateInput = {
    taskId?: string;
    taskName: string;
    taskCategory: TaskCategorySchema[];
    taskStep: TaskStep[];
    status: PresetTemplateStatusEnum;
};

// export type TemplateInput = {
//     _id: string;
//     taskId?: string;
//     taskName: string;
//     taskCategory: TaskCategorySchema[];
//     taskStep: TaskStep[];
//     status: PresetTemplateStatusEnum;
// };

export type TaskCategorySchema = {
    id: string;
    categoryName: string;
    imageKey?: string;
};

export type TaskStep = {
    stepName: string;
    timer?: string | null;
    imageKey: string;
    imageUrl?: string;
    timerInTimeStamp?: Date | null;
    id?: string;
};

export type PresetTemplate = {
    _id: string;
    taskName: string;
    taskCategory: TaskCategorySchema[];
    taskStep: TaskStep[];
    taskStepCount: number;
    status?: string;
    templateType: string;
    downloads: number;
    createdAt: string;
};

export type Pagination = {
    total: number;
    hasNextPage: boolean;
};
export type PresetTemplateResponseType = {
    message: string;
    pagination?: Pagination;
    task?: PresetTemplate;
    tasks?: PresetTemplate[];
};

export type FilterTemplateType = {
    _id: string;
    section: string;
    label: string;
    value: string;
};

export type PresetTemplateResponse = {
    getAllTaskTemplate?: PresetTemplateResponseType;
    getTaskDetailById?: PresetTemplateResponseType;
    createTask?: PresetTemplateResponseType;
    updateTaskTemplate?: PresetTemplateResponseType;
    deleteTaskTemplate?: PresetTemplateResponseType;
    deleteTaskStepImage?: PresetTemplateResponseType;
};
