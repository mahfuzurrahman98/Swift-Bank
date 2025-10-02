import {
    FetchClient,
    createRequest,
    type ApiResponse,
} from "@/api/fetchClient";
import { useAuthStore } from "@/stores/auth-store";
import { logger } from "@/utils/helpers/logger";
import type {
    DepositRequest,
    WithdrawRequest,
    TransferRequest,
    AddBeneficiaryRequest,
    AccountResponse,
    FundTransferTransactionResponse,
    TransactionsResponse,
    BeneficiariesResponse,
} from "@/utils/interfaces/banking";

class BankingService {
    private getAccessToken(): string {
        const accessToken = useAuthStore.getState().accessToken;
        if (!accessToken) {
            throw new Error("Authentication required");
        }
        return accessToken;
    }

    // Account operations
    async getAccount(): Promise<ApiResponse<AccountResponse>> {
        try {
            const accessToken = this.getAccessToken();
            const request: FetchClient = createRequest(
                "accounts",
                "GET",
                accessToken
            );
            return await request.call<AccountResponse>();
        } catch (error: any) {
            logger.error("Error fetching account:", error);
            throw error;
        }
    }

    async deposit(data: DepositRequest): Promise<ApiResponse<AccountResponse>> {
        try {
            const accessToken = this.getAccessToken();
            const request: FetchClient = createRequest(
                "accounts/deposit",
                "POST",
                accessToken
            );
            return await request.call<AccountResponse>(data);
        } catch (error: any) {
            logger.error("Error depositing:", error);
            throw error;
        }
    }

    async withdraw(
        data: WithdrawRequest
    ): Promise<ApiResponse<AccountResponse>> {
        try {
            const accessToken = this.getAccessToken();
            const request: FetchClient = createRequest(
                "accounts/withdraw",
                "POST",
                accessToken
            );
            return await request.call<AccountResponse>(data);
        } catch (error: any) {
            logger.error("Error withdrawing:", error);
            throw error;
        }
    }

    async transfer(
        data: TransferRequest
    ): Promise<ApiResponse<FundTransferTransactionResponse>> {
        try {
            const accessToken = this.getAccessToken();
            const request: FetchClient = createRequest(
                "accounts/transfer",
                "POST",
                accessToken
            );
            return await request.call<FundTransferTransactionResponse>(data);
        } catch (error: any) {
            logger.error("Error transferring:", error);
            throw error;
        }
    }

    // Transaction operations
    async getTransactions(
        params?: {
            page?: number;
            limit?: number;
            q?: string;
            type?: string;
            startDate?: string;
            endDate?: string;
        }
    ): Promise<ApiResponse<TransactionsResponse>> {
        try {
            const accessToken = this.getAccessToken();
            
            // Build query string
            const queryParams = new URLSearchParams();
            if (params?.page) queryParams.append("page", params.page.toString());
            if (params?.limit) queryParams.append("limit", params.limit.toString());
            if (params?.q) queryParams.append("q", params.q);
            if (params?.type) queryParams.append("type", params.type);
            if (params?.startDate) queryParams.append("startDate", params.startDate);
            if (params?.endDate) queryParams.append("endDate", params.endDate);
            
            const queryString = queryParams.toString();
            const url = queryString 
                ? `accounts/transactions?${queryString}` 
                : "accounts/transactions";
            
            const request: FetchClient = createRequest(
                url,
                "GET",
                accessToken
            );
            return await request.call<TransactionsResponse>();
        } catch (error: any) {
            logger.error("Error fetching transactions:", error);
            throw error;
        }
    }

    // Beneficiary operations
    async getBeneficiaries(): Promise<ApiResponse<BeneficiariesResponse>> {
        try {
            const accessToken = this.getAccessToken();
            const request: FetchClient = createRequest(
                "accounts/beneficiaries",
                "GET",
                accessToken
            );
            return await request.call<BeneficiariesResponse>();
        } catch (error: any) {
            logger.error("Error fetching beneficiaries:", error);
            throw error;
        }
    }

    async addBeneficiary(
        data: AddBeneficiaryRequest
    ): Promise<ApiResponse<BeneficiariesResponse>> {
        try {
            const accessToken = this.getAccessToken();
            const request: FetchClient = createRequest(
                "accounts/beneficiaries",
                "POST",
                accessToken
            );
            return await request.call<BeneficiariesResponse>(data);
        } catch (error: any) {
            logger.error("Error adding beneficiary:", error);
            throw error;
        }
    }

    async removeBeneficiary(
        beneficiaryAccountId: string
    ): Promise<ApiResponse<BeneficiariesResponse>> {
        try {
            const accessToken = this.getAccessToken();
            const request: FetchClient = createRequest(
                `accounts/beneficiaries/${beneficiaryAccountId}`,
                "DELETE",
                accessToken
            );
            return await request.call<BeneficiariesResponse>();
        } catch (error: any) {
            logger.error("Error removing beneficiary:", error);
            throw error;
        }
    }
}

export const bankingService = new BankingService();
export default bankingService;
