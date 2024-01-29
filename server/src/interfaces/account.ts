import { Document } from 'mongoose';

export interface IAccount extends Document {
    userId: string;
    balance: number;
    active: boolean;
    beneficiaries?: string[];
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date | null;
}
