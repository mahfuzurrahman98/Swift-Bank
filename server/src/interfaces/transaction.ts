import { Document } from 'mongoose';

// type[deposit|withdraw|transfer]
// toUserId: only for transfer
export interface ITransaction extends Document {
    userId: string;
    amount: number;
    type: 'deposit' | 'withdraw' | 'transfer';
    toUserId?: string;
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date | null;
}
