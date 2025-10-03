import { infer as zInfer } from "zod";
import {
    depositSchema,
    transactionsQueryParamsSchema,
    transferSchema,
    withdrawSchema,
    addBeneficiarySchema,
    beneficiaryIdParamSchema,
} from "@/app/schemas/account.schema";
import { Account, Beneficiary } from "@/app/interfaces/account.interface";
import {
    FundTransferTransaction,
    SelfTransaction,
} from "@/app/interfaces/transaction.interface";
import { ApiResponseDTO } from "@/app/dtos/common.dto";
import { MetaData } from "@/app/interfaces/common";

// Request DTOs
export interface DepositRequestDTO extends zInfer<typeof depositSchema> {}
export interface WithdrawRequestDTO extends zInfer<typeof withdrawSchema> {}
export interface TransferRequestDTO extends zInfer<typeof transferSchema> {}
export interface AddBeneficiaryRequestDTO
    extends zInfer<typeof addBeneficiarySchema> {}
export interface BeneficiaryIdParamDTO
    extends zInfer<typeof beneficiaryIdParamSchema> {}
export interface TransactionQueryParams
    extends zInfer<typeof transactionsQueryParamsSchema> {}

// Beneficiary query params interface
export interface BeneficiaryQueryParams {
    page?: number;
    limit?: number;
    q?: string;
}

// Response DTOs
export interface DepositResponseDTO
    extends ApiResponseDTO<{
        account: Account;
        transaction: SelfTransaction;
    }> {}

export interface WithdrawResponseDTO extends DepositResponseDTO {}

export interface TransferResponseDTO
    extends ApiResponseDTO<{
        fromAccount: Account;
        toAccount: Account;
        transaction: FundTransferTransaction;
    }> {}

export interface AccountResponseDTO
    extends ApiResponseDTO<{
        account: Account;
    }> {}

export interface BeneficiariesResponseDTO
    extends ApiResponseDTO<{
        beneficiaries: Beneficiary[];
        meta: MetaData;
    }> {}

export interface DeleteBeneficiaryResponseDTO extends ApiResponseDTO<{}> {}
