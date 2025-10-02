import { UserStatus, UserRole } from "@/app/enums/user";

export interface User {
    _id: any;
    name: string;
    email: string;
    password?: string;
    googleAuth: boolean;
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date;
    role: UserRole;
    status: UserStatus;
}
