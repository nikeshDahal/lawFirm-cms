export type BasePaginationDto = {
    searchText: string;
    orderBy: string;
    order: string | undefined;
    limit: number;
    skip: number;
};

export type BasePaginationResponse = {
    total: number;
    hasNextPage: boolean;
};

export type RemoveSubscriptionProduct = {
    message: string;
};

export type MessageResponse = {
    removeSubscriptionProduct: RemoveSubscriptionProduct;
};
