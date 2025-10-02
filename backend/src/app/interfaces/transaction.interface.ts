import { TransactionType } from "@/app/enums/transaction.enum";

export interface SelfTransaction {
    _id: any;
    accountId: string;
    amount: number;
    type: TransactionType;
    balance: number;
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date | null;
}

export interface FundTransferTransaction {
    _id: any;
    fromAccountId: string;
    toAccountId: string;
    amount: number;
    fromAccountBalance: number;
    toAccountBalance: number;
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date | null;
}

export interface Transaction {
    _id: any;
    type: TransactionType;
    amount: number;
    balance: number;
    particular: string;
    createdAt: Date;
}
