import { Request } from "express";
import { Document } from "mongoose";

export interface IUser extends Document {
    name: string;
    email: string;
    password?: string;
    googleAuth: boolean;
    active: boolean;
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date | null;
}

export interface IRequestUser {
    id: string;
    name: string;
    email: string;
}

export interface IRequestWithUser extends Request {
    user?: IRequestUser;
}

export interface CreateUserRequestBody {
    name: string;
    email: string;
    password: string;
}

export interface LoginRequestBody {
    email: string;
    password: string;
}

export interface GoogleLoginRequestBody {
    code: string;
}
