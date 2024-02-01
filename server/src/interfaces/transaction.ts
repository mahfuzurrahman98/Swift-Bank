import { Document } from 'mongoose';

// type[deposit|withdraw|transfer]
// toUserId: only for transfer
export interface IFundTransferTransaction extends Document {
    fromAccountId: string;
    toAccountId: string;
    amount: number;
    fromAccountBlance: number;
    toAccountBalance: number;
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date | null;
}


export interface ISelfTransaction extends Document {
    accountId: string;
    amount: number;
    type: 'deposit' | 'withdraw';
    balance: number;
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date | null;
}
