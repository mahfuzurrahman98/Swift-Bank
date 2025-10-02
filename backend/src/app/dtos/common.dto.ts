export interface ApiResponseDTO<T = any> {
    message: string;
    data: T;
}
