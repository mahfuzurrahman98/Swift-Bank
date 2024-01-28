import { Request } from 'express';
import { Document } from 'mongoose';

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

export interface IRequestWithUser extends Request {
    user?: object;
}
