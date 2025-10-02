import { infer as zInfer } from "zod";
import {
    depositSchema,
    transactionsQueryParamsSchema,
    transferSchema,
    withdrawSchema,
} from "@/app/schemas/account.schema";
import { Account } from "@/app/interfaces/account.interface";
import {
    FundTransferTransaction,
    SelfTransaction,
} from "@/app/interfaces/transaction.interface";
import { ApiResponseDTO } from "@/app/dtos/common.dto";

// Request DTOs
export interface DepositRequestDTO extends zInfer<typeof depositSchema> {}
export interface WithdrawRequestDTO extends zInfer<typeof withdrawSchema> {}
export interface TransferRequestDTO extends zInfer<typeof transferSchema> {}
export interface TransactionQueryParams
    extends zInfer<typeof transactionsQueryParamsSchema> {}

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
