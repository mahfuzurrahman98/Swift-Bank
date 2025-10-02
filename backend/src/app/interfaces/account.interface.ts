export interface Account {
    _id: any;
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
