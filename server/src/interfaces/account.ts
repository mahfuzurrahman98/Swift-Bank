import { Document } from 'mongoose';

export interface IAccount extends Document {
    userId: string;
    balance: number;
    active: boolean;
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date | null;
}
