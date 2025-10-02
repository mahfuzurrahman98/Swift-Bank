// Banking related interfaces

import type { TransactionType } from "@/utils/enums/transaction";

export interface Account {
    _id: string;
    userId: string;
    balance: number;
    active: boolean;
    beneficiaryIds?: string[];
    beneficiaries?: Beneficiary[];
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date;
}

export interface Beneficiary {
    accountId: string;
    name: string;
    email: string;
}

export interface Transaction {
    _id: string;
    type: TransactionType;
    amount: number;
    balance: number;
    particular: string;
    createdAt: Date;
}

export interface SelfTransaction {
    _id: string;
    accountId: string;
    amount: number;
    type: TransactionType;
    balance: number;
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date | null;
}

export interface FundTransferTransaction {
    _id: string;
    fromAccountId: string;
    toAccountId: string;
    amount: number;
    fromAccountBalance: number;
    toAccountBalance: number;
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date | null;
    fromAccountName?: string;
    toAccountName?: string;
}

// API Request interfaces
export interface DepositRequest {
    amount: number;
}

export interface WithdrawRequest {
    amount: number;
}

export interface TransferRequest {
    toAccountId: string;
    amount: number;
}

export interface AddBeneficiaryRequest {
    beneficiaryAccountId: string;
}

// API Response interfaces
export interface AccountResponse {
    account: Account;
}

export interface BeneficiaryResponse {
    beneficiary: Beneficiary;
}

export interface BeneficiariesResponse {
    beneficiaries: Beneficiary[];
}

export interface TransactionResponse {
    transaction: Transaction;
}

export interface TransactionsResponse {
    transactions: Transaction[];
    meta?: {
        total: number;
        pagination: {
            page: number;
            limit: number;
            totalPages: number;
            hasMore: boolean;
        };
    };
}

export interface SelfTransactionResponse {
    selfTransaction: SelfTransaction;
}

export interface SelfTransactionsResponse {
    selfTransactions: SelfTransaction[];
}

export interface FundTransferTransactionResponse {
    fundTransferTransaction: FundTransferTransaction;
}

export interface FundTransferTransactionsResponse {
    fundTransferTransactions: FundTransferTransaction[];
}

// Filter interfaces for frontend
export interface TransactionFilters {
    dateRange?: {
        from: Date;
        to: Date;
    };
    type?: TransactionType | "all";
    searchTerm?: string;
}

export interface TransactionSortConfig {
    field: "createdAt" | "amount" | "type" | "particular";
    direction: "asc" | "desc";
}
