import { gql } from '@apollo/client';

export const GET_ALL_PRESET_TEMPLATES = gql`
    query GetAllTaskTemplate($input: TaskListInput!) {
        getAllTaskTemplate(input: $input) {
            message
            pagination {
                total
                hasNextPage
            }
            tasks {
                _id
                createdAt
                updatedAt
                taskName
                taskStepCount
                status
                taskCategory {
                    id
                    categoryName
                    imageKey
                }
                templateType
                downloads
            }
        }
    }
`;

export const GET_PRESET_TEMPLATE = gql`
    query GetTaskDetailById($input: IdInput!) {
        getTaskDetailById(input: $input) {
            task {
                _id
                createdAt
                updatedAt
                taskName
                taskCategory {
                    id
                    categoryName
                    imageKey
                }
                taskStep {
                    imageKey
                    stepName
                    timer
                    imageUrl
                    timerInTimeStamp
                }
                taskStepCount
                status
                templateType
                downloads
            }
        }
    }
`;

export const GET_ALL_CATEGORIES = gql`
    query GetAllCategories {
        getAllCategories {
            category {
                _id
                createdAt
                updatedAt
                categoryName
                categorySlug
                color
                textColor
                icon
            }
        }
    }
`;
