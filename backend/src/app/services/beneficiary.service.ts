import { autoInjectable } from "tsyringe";
import { AccountModel } from "@/app/models/account.model";
import { FundTransferModel } from "@/app/models/fund-transfer.model";
import { CustomError } from "@/utils/custom-error";
import { Account, Beneficiary } from "@/app/interfaces/account.interface";
import { MetaData } from "@/app/interfaces/common";

/**
 * Service class handling account operations including deposits, withdrawals, transfers, and beneficiaries.
 */
@autoInjectable()
export class BeneficiaryService {
    /**
     * Adds a beneficiary to user's account.
     *
     * @param userId - User ID
     * @param beneficiaryId - Beneficiary account ID
     * @returns Promise<Account> - Updated account
     * @throws CustomError when account or beneficiary is not found
     */
    async addBeneficiary(
        userId: string,
        beneficiaryId: string
    ): Promise<Account> {
        try {
            const beneficiaryAccount = await AccountModel.findOne({
                _id: beneficiaryId,
                deletedAt: null,
            })
                .populate({
                    path: "userId",
                    select: "name email",
                    model: "users",
                })
                .exec();
            if (!beneficiaryAccount) {
                throw new CustomError(404, "No such account found");
            }

            const account = await AccountModel.findOne({
                userId,
                deletedAt: null,
            }).exec();
            if (!account) {
                throw new CustomError(404, "Account not found");
            }

            if (!account.beneficiaries) {
                account.beneficiaries = [];
            }

            if (account.beneficiaryIds?.includes(beneficiaryId)) {
                throw new CustomError(400, "Beneficiary already added");
            }

            // Add to beneficiaryIds array
            account.beneficiaryIds?.push(beneficiaryId);

            // Add to beneficiaries array with proper structure
            account.beneficiaries.push({
                accountId: beneficiaryAccount._id.toString(),
                name: (beneficiaryAccount.userId as any)?.name || "Unknown",
                email: (beneficiaryAccount.userId as any)?.email || "Unknown",
            });

            await account.save();

            return account;
        } catch (error: any) {
            // Handle Mongoose CastError for invalid ObjectId
            if (error.name === "CastError") {
                throw new CustomError(422, "Invalid beneficiary ID");
            }

            throw error instanceof CustomError
                ? error
                : new CustomError(
                      500,
                      `[beneficiaryService_createBeneficiary]: ${error.message}`
                  );
        }
    }

    /**
     * Gets all beneficiaries for user's account.
     *
     * @param userId - User ID
     * @param filters - Optional filters (page, limit, search query)
     * @returns Promise with beneficiaries list and pagination metadata
     * @throws CustomError when account is not found
     */
    async getBeneficiaries(
        userId: string,
        filters?: {
            page?: number;
            limit?: number;
            q?: string;
        }
    ): Promise<{
        beneficiaries: Beneficiary[];
        meta: MetaData;
    }> {
        try {
            const account = await AccountModel.findOne({
                userId,
                deletedAt: null,
            }).exec();
            if (!account) {
                throw new CustomError(404, "Account not found");
            }

            // Get all beneficiary accounts
            const allBeneficiaries = await AccountModel.find({
                _id: { $in: account.beneficiaryIds || [] },
                deletedAt: null,
            })
                .populate({
                    path: "userId",
                    select: "name email",
                    model: "users",
                })
                .exec();

            // Transform beneficiaries to include user details
            let transformedBeneficiaries = allBeneficiaries.map(
                (beneficiary: any) => ({
                    accountId: beneficiary._id.toString(),
                    name: beneficiary.userId?.name as string,
                    email: beneficiary.userId?.email as string,
                })
            );

            // Apply search filter if provided
            if (filters?.q) {
                const searchQuery = filters.q.toLowerCase();
                transformedBeneficiaries = transformedBeneficiaries.filter(
                    (b) =>
                        b.name?.toLowerCase().includes(searchQuery) ||
                        b.email?.toLowerCase().includes(searchQuery) ||
                        b.accountId?.toLowerCase().includes(searchQuery)
                );
            }

            // Get total count after filtering
            const total = transformedBeneficiaries.length;

            // Apply pagination
            const page = filters?.page || 1;
            const limit = filters?.limit || 10;
            const startIndex = (page - 1) * limit;
            const endIndex = startIndex + limit;

            const paginatedBeneficiaries = transformedBeneficiaries.slice(
                startIndex,
                endIndex
            );

            const totalPages = Math.ceil(total / limit);
            const hasMore = page < totalPages;

            return {
                beneficiaries: paginatedBeneficiaries,
                meta: {
                    total,
                    pagination: {
                        page,
                        limit,
                        totalPages,
                        hasMore,
                    },
                },
            };
        } catch (error: any) {
            throw error instanceof CustomError
                ? error
                : new CustomError(
                      500,
                      `[beneficiaryService_getBeneficiaries]: ${error.message}`
                  );
        }
    }

    /**
     * Removes a beneficiary from user's account.
     *
     * @param userId - User ID
     * @param beneficiaryId - Beneficiary ID to remove
     * @returns Promise<Account> - Updated account
     * @throws CustomError when account or beneficiary is not found
     */
    async deleteBeneficiary(
        userId: string,
        beneficiaryId: string
    ): Promise<void> {
        try {
            const account = await AccountModel.findOne({
                userId,
                deletedAt: null,
            }).exec();
            if (!account) {
                throw new CustomError(404, "Source account not found");
            }

            const beneficiaryAccount = await AccountModel.findOne({
                _id: beneficiaryId,
                deletedAt: null,
            }).exec();
            if (!beneficiaryAccount) {
                throw new CustomError(404, "Beneficiary account not found");
            }

            // Check if there are any transactions between current user and beneficiary
            const existingTransactions = await FundTransferModel.findOne({
                fromAccountId: account._id,
                toAccountId: beneficiaryAccount._id,
                deletedAt: null,
            }).exec();

            if (existingTransactions) {
                throw new CustomError(
                    400,
                    "Cannot delete beneficiary: Transaction history exists with this beneficiary"
                );
            }

            account.beneficiaryIds = account.beneficiaryIds?.filter(
                (id) => id.toString() !== beneficiaryId
            );
            await account.save();
        } catch (error: any) {
            throw error instanceof CustomError
                ? error
                : new CustomError(
                      500,
                      `[beneficiaryService_deleteBeneficiary]: ${error.message}`
                  );
        }
    }
}
