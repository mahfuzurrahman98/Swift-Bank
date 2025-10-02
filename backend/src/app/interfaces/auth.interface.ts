import { UserStatus, UserRole } from "@/app/enums/user";

export interface RequestUser {
    _id: string;
    email: string;
    name: string;
    role: UserRole;
    status: UserStatus;
}

export interface TokenPayload {
    user?: RequestUser;
    iat: number;
    exp: number;
}
