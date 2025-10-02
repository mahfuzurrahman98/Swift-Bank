export interface OffsetPagination {
    page: number;
    limit: number;
}

export interface OffsetPaginationMeta {
    page: number;
    limit: number;
    totalPages: number;
    hasMore: boolean;
}

export interface MetaData {
    total: number;
    pagination: OffsetPaginationMeta;
}
