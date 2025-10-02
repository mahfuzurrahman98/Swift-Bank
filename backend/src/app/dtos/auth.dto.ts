import { RequestUser } from "@/app/interfaces/auth.interface";
import { ApiResponseDTO } from "@/app/dtos/common.dto";

// Response DTOs
export interface SigninResponseDTO
    extends ApiResponseDTO<{
        accessToken: string;
        user: RequestUser;
    }> {}
