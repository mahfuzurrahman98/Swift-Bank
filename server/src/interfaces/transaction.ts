import { Document } from 'mongoose';

// type[deposit|withdraw|transfer]
// toUserId: only for transfer
export interface ITransaction extends Document {
    fromAccountId: string;
    amount: number;
    type: 'deposit' | 'withdraw' | 'transfer';
    toAccountId?: string;
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date | null;
}
