import { gql } from '@apollo/client';

export const CREATE_TASK_TEMPLATE = gql`
    mutation CreateTask($input: CreateTaskInput!) {
        createTask(input: $input) {
            task {
                _id
                createdAt
                updatedAt
                taskName
                taskCategory {
                    id
                    categoryName
                }
                taskStep {
                    imageKey
                    stepName
                    timer
                    timerInTimeStamp
                }
                taskStepCount
                status
                templateType
            }
            message
        }
    }
`;

export const UPDATE_TASK_TEMPLATE = gql`
    mutation UpdateTaskTemplate($input: UpdatedTaskInput!) {
        updateTaskTemplate(input: $input) {
            message
        }
    }
`;

export const REMOVE_TASK_TEMPLATE = gql`
    mutation DeleteTaskTemplate($input: IdInput!) {
        deleteTaskTemplate(input: $input) {
            message
        }
    }
`;

export const REMOVE_IMAGE = gql`
    mutation DeleteTaskStepImage($templateId: String!, $index: Float!) {
        deleteTaskStepImage(templateId: $templateId, index: $index) {
            message
        }
    }
`;
