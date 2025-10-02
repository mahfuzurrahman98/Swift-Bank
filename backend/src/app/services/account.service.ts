import { autoInjectable } from "tsyringe";
import { AccountModel } from "@/app/models/account.model";
import { SelfTransactionModel } from "@/app/models/self-transaction.model";
import { FundTransferModel } from "@/app/models/fund-transfer.model";
import { CustomError } from "@/utils/custom-error";
import { Account } from "@/app/interfaces/account.interface";
import {
    SelfTransaction,
    FundTransferTransaction,
    Transaction,
} from "@/app/interfaces/transaction.interface";
import {
    TransactionQueryParams,
    TransferRequestDTO,
} from "@/app/dtos/account.dto";
import { TransactionType } from "@/app/enums/transaction.enum";
import { MetaData, OffsetPagination } from "@/app/interfaces/common";

/**
 * Service class handling account operations including deposits, withdrawals, transfers, and beneficiaries.
 */
@autoInjectable()
export class AccountService {
    /**
     * Gets user account with populated beneficiaries.
     *
     * @param userId - User ID
     * @returns Promise<Account> - Account with beneficiaries
     * @throws CustomError when account is not found
     */
    async getAccount(userId: string): Promise<Account> {
        try {
            const accounts = await AccountModel.aggregate([
                {
                    $match: {
                        userId,
                        deletedAt: null,
                    },
                },
                {
                    $lookup: {
                        from: "accounts",
                        localField: "beneficiaryIds",
                        foreignField: "_id",
                        as: "beneficiaries",
                        pipeline: [
                            {
                                $lookup: {
                                    from: "users",
                                    localField: "userId",
                                    foreignField: "_id",
                                    as: "user",
                                    pipeline: [
                                        { $project: { name: 1, email: 1 } },
                                    ],
                                },
                            },
                            {
                                $project: {
                                    _id: 1,
                                    user: { $arrayElemAt: ["$user", 0] },
                                },
                            },
                        ],
                    },
                },
                {
                    $addFields: {
                        beneficiaries: {
                            $map: {
                                input: "$beneficiaries",
                                as: "beneficiary",
                                in: {
                                    id: { $toString: "$$beneficiary._id" },
                                    name: "$$beneficiary.user.name",
                                    email: "$$beneficiary.user.email",
                                },
                            },
                        },
                    },
                },
                {
                    $project: {
                        beneficiaryIds: 0, // Remove beneficiaryIds from output
                    },
                },
            ]);

            if (!accounts || accounts.length === 0) {
                throw new CustomError(404, "Account not found");
            }

            return accounts[0];
        } catch (error: any) {
            throw error instanceof CustomError
                ? error
                : new CustomError(
                      500,
                      `[accountsService_getAccount]: ${error.message}`
                  );
        }
    }

    /**
     * Handles money deposit into user account.
     *
     * @param userId - User ID
     * @param data - Deposit data
     * @returns Promise<{ account: Account; transaction: ISelfTransaction }> - Updated account and transaction
     * @throws CustomError when account is not found or deposit fails
     */
    async deposit(
        userId: string,
        amount: number
    ): Promise<{ account: Account; transaction: SelfTransaction }> {
        try {
            const account = await AccountModel.findOne({
                userId,
                deletedAt: null,
            }).exec();
            if (!account) {
                throw new CustomError(404, "Account not found");
            }

            account.balance += amount;

            // If account is not active, activate it (first deposit)
            if (!account.active) {
                account.active = true;
            }

            await account.save();

            const transaction: SelfTransaction =
                await SelfTransactionModel.create({
                    accountId: account._id,
                    amount,
                    type: "deposit",
                    balance: account.balance,
                });

            return { account, transaction };
        } catch (error: any) {
            throw error instanceof CustomError
                ? error
                : new CustomError(
                      500,
                      `[accountsService_deposit]: ${error.message}`
                  );
        }
    }

    /**
     * Handles money withdrawal from user account.
     *
     * @param userId - User ID
     * @param data - Withdrawal data
     * @returns Promise<{ account: Account; transaction: ISelfTransaction }> - Updated account and transaction
     * @throws CustomError when account is not found or insufficient funds
     */
    async withdraw(
        userId: string,
        amount: number
    ): Promise<{ account: Account; transaction: SelfTransaction }> {
        try {
            const account = await AccountModel.findOne({
                userId,
                deletedAt: null,
            }).exec();
            if (!account) {
                throw new CustomError(404, "Account not found");
            }

            if (account.balance < amount) {
                throw new CustomError(400, "Insufficient funds");
            }

            account.balance -= amount;
            await account.save();

            const transaction: SelfTransaction =
                await SelfTransactionModel.create({
                    accountId: account._id,
                    amount,
                    type: "withdraw",
                    balance: account.balance,
                });

            return { account, transaction };
        } catch (error: any) {
            throw error instanceof CustomError
                ? error
                : new CustomError(
                      500,
                      `[accountsService_withdraw]: ${error.message}`
                  );
        }
    }

    /**
     * Handles money transfer between accounts.
     *
     * @param userId - User ID (sender)
     * @param data - Transfer data
     * @returns Promise<{ fromAccount: Account; toAccount: Account; transaction: FundTransferTransaction }> - Transfer result
     * @throws CustomError when accounts are not found or transfer fails
     */
    async transfer(
        userId: string,
        data: TransferRequestDTO
    ): Promise<{
        fromAccount: Account;
        toAccount: Account;
        transaction: FundTransferTransaction;
    }> {
        try {
            const { toAccountId, amount } = data;

            const fromAccount = await AccountModel.findOne({
                userId,
                deletedAt: null,
            }).exec();
            if (!fromAccount) {
                throw new CustomError(404, "Source account not found");
            }

            const toAccount = await AccountModel.findOne({
                _id: toAccountId,
                deletedAt: null,
            }).exec();
            if (!toAccount) {
                throw new CustomError(404, "Destination account not found");
            }

            // Check if destination account is a beneficiary
            if (
                !fromAccount.beneficiaryIds ||
                !fromAccount.beneficiaryIds.includes(toAccountId)
            ) {
                throw new CustomError(
                    403,
                    "Destination account is not a beneficiary"
                );
            }

            if (fromAccount.balance < amount) {
                throw new CustomError(400, "Insufficient funds");
            }

            fromAccount.balance -= amount;
            toAccount.balance += amount;

            // If destination account is not active, activate it
            if (!toAccount.active) {
                toAccount.active = true;
            }

            await fromAccount.save();
            await toAccount.save();

            const transaction: FundTransferTransaction =
                await FundTransferModel.create({
                    fromAccountId: fromAccount._id,
                    toAccountId,
                    amount,
                    fromAccountBalance: fromAccount.balance,
                    toAccountBalance: toAccount.balance,
                });

            return { fromAccount, toAccount, transaction };
        } catch (error: any) {
            throw error instanceof CustomError
                ? error
                : new CustomError(
                      500,
                      `[accountsService_transfer]: ${error.message}`
                  );
        }
    }

    /**
     * Gets all transactions for user's account.
     *
     * @param userId - User ID
     * @returns Promise<any[]> - Combined list of transactions
     * @throws CustomError when account is not found
     */
    async getTransactions(
        userId: string,
        filters: TransactionQueryParams
    ): Promise<{
        transactions: Transaction[];
        meta?: MetaData;
    }> {
        try {
            const account = await AccountModel.findOne({
                userId,
                deletedAt: null,
            }).exec();
            if (!account) {
                throw new CustomError(404, "Account not found");
            }

            const pagination: OffsetPagination = {
                page: filters.page || 1,
                limit: filters.limit || 10,
            };

            // Build date filter for MongoDB queries
            const dateFilter: any = {};
            if (filters.startDate) {
                dateFilter.$gte = new Date(filters.startDate);
            }
            if (filters.endDate) {
                dateFilter.$lte = new Date(filters.endDate);
            }

            let combinedTransactions: Transaction[] = [];

            // Optimize queries based on transaction type filter
            if (
                filters.type === TransactionType.DEPOSIT ||
                filters.type === TransactionType.WITHDRAWAL
            ) {
                // Only query self transactions for deposit/withdrawal
                const selfTransactionQuery: any = {
                    accountId: account._id,
                    deletedAt: null,
                    type: filters.type,
                };

                if (Object.keys(dateFilter).length > 0) {
                    selfTransactionQuery.createdAt = dateFilter;
                }

                const selfTransactions = await SelfTransactionModel.find(
                    selfTransactionQuery
                ).exec();

                combinedTransactions = selfTransactions.map((transaction) => ({
                    _id: transaction._id,
                    type: transaction.type,
                    amount: transaction.amount,
                    balance: transaction.balance,
                    particular:
                        transaction.type === TransactionType.DEPOSIT
                            ? `$${transaction.amount} deposited`
                            : `$${transaction.amount} is withdrawn`,
                    createdAt: transaction.createdAt,
                }));
            } else if (
                filters.type === TransactionType.TRANSFER_IN ||
                filters.type === TransactionType.TRANSFER_OUT
            ) {
                // Only query fund transfers for transfer types
                const fundTransferMatchQuery: any = {
                    deletedAt: null,
                };

                // Filter by transfer direction
                if (filters.type === TransactionType.TRANSFER_OUT) {
                    fundTransferMatchQuery.fromAccountId =
                        account._id.toString();
                } else if (filters.type === TransactionType.TRANSFER_IN) {
                    fundTransferMatchQuery.toAccountId = account._id.toString();
                }

                if (Object.keys(dateFilter).length > 0) {
                    fundTransferMatchQuery.createdAt = dateFilter;
                }

                const fundTransfers = await FundTransferModel.aggregate([
                    { $match: fundTransferMatchQuery },
                    {
                        $addFields: {
                            fromAccountIdObj: { $toObjectId: "$fromAccountId" },
                            toAccountIdObj: { $toObjectId: "$toAccountId" },
                        },
                    },
                    {
                        $lookup: {
                            from: "accounts",
                            localField: "fromAccountIdObj",
                            foreignField: "_id",
                            as: "fromAccount",
                            pipeline: [
                                {
                                    $lookup: {
                                        from: "users",
                                        localField: "userId",
                                        foreignField: "_id",
                                        as: "user",
                                        pipeline: [{ $project: { name: 1 } }],
                                    },
                                },
                                {
                                    $project: {
                                        _id: 1,
                                        user: { $arrayElemAt: ["$user", 0] },
                                    },
                                },
                            ],
                        },
                    },
                    {
                        $lookup: {
                            from: "accounts",
                            localField: "toAccountIdObj",
                            foreignField: "_id",
                            as: "toAccount",
                            pipeline: [
                                {
                                    $lookup: {
                                        from: "users",
                                        localField: "userId",
                                        foreignField: "_id",
                                        as: "user",
                                        pipeline: [{ $project: { name: 1 } }],
                                    },
                                },
                                {
                                    $project: {
                                        _id: 1,
                                        user: { $arrayElemAt: ["$user", 0] },
                                    },
                                },
                            ],
                        },
                    },
                    {
                        $addFields: {
                            fromAccount: { $arrayElemAt: ["$fromAccount", 0] },
                            toAccount: { $arrayElemAt: ["$toAccount", 0] },
                        },
                    },
                ]);

                combinedTransactions = fundTransfers.map((transaction) => ({
                    _id: transaction._id,
                    type:
                        filters.type === TransactionType.TRANSFER_OUT
                            ? TransactionType.TRANSFER_OUT
                            : TransactionType.TRANSFER_IN,
                    amount: transaction.amount,
                    balance:
                        filters.type === TransactionType.TRANSFER_OUT
                            ? transaction.fromAccountBalance
                            : transaction.toAccountBalance,
                    particular:
                        filters.type === TransactionType.TRANSFER_OUT
                            ? `Sent to ${
                                  transaction.toAccount?.user?.name ||
                                  "Unknown Account"
                              }`
                            : `Received from ${
                                  transaction.fromAccount?.user?.name ||
                                  "Unknown Account"
                              }`,
                    createdAt: transaction.createdAt,
                }));
            } else {
                // No type filter: Query both self transactions and fund transfers
                const [selfTransactions, fundTransfers] = await Promise.all([
                    SelfTransactionModel.find({
                        accountId: account._id,
                        deletedAt: null,
                        ...(Object.keys(dateFilter).length > 0 && {
                            createdAt: dateFilter,
                        }),
                    }).exec(),

                    FundTransferModel.aggregate([
                        {
                            $match: {
                                $or: [
                                    { fromAccountId: account._id.toString() },
                                    { toAccountId: account._id.toString() },
                                ],
                                deletedAt: null,
                                ...(Object.keys(dateFilter).length > 0 && {
                                    createdAt: dateFilter,
                                }),
                            },
                        },
                        {
                            $addFields: {
                                fromAccountIdObj: {
                                    $toObjectId: "$fromAccountId",
                                },
                                toAccountIdObj: { $toObjectId: "$toAccountId" },
                            },
                        },
                        {
                            $lookup: {
                                from: "accounts",
                                localField: "fromAccountIdObj",
                                foreignField: "_id",
                                as: "fromAccount",
                                pipeline: [
                                    {
                                        $lookup: {
                                            from: "users",
                                            localField: "userId",
                                            foreignField: "_id",
                                            as: "user",
                                            pipeline: [
                                                { $project: { name: 1 } },
                                            ],
                                        },
                                    },
                                    {
                                        $project: {
                                            _id: 1,
                                            user: {
                                                $arrayElemAt: ["$user", 0],
                                            },
                                        },
                                    },
                                ],
                            },
                        },
                        {
                            $lookup: {
                                from: "accounts",
                                localField: "toAccountIdObj",
                                foreignField: "_id",
                                as: "toAccount",
                                pipeline: [
                                    {
                                        $lookup: {
                                            from: "users",
                                            localField: "userId",
                                            foreignField: "_id",
                                            as: "user",
                                            pipeline: [
                                                { $project: { name: 1 } },
                                            ],
                                        },
                                    },
                                    {
                                        $project: {
                                            _id: 1,
                                            user: {
                                                $arrayElemAt: ["$user", 0],
                                            },
                                        },
                                    },
                                ],
                            },
                        },
                        {
                            $addFields: {
                                fromAccount: {
                                    $arrayElemAt: ["$fromAccount", 0],
                                },
                                toAccount: { $arrayElemAt: ["$toAccount", 0] },
                            },
                        },
                    ]),
                ]);

                // Combine all transactions
                combinedTransactions = [
                    ...selfTransactions.map((transaction) => ({
                        _id: transaction._id,
                        type: transaction.type,
                        amount: transaction.amount,
                        balance: transaction.balance,
                        particular:
                            transaction.type === TransactionType.DEPOSIT
                                ? `$${transaction.amount} deposited`
                                : `$${transaction.amount} is withdrawn`,
                        createdAt: transaction.createdAt,
                    })),
                    ...fundTransfers.map((transaction) => ({
                        _id: transaction._id,
                        type:
                            transaction.fromAccountId.toString() ===
                            account._id.toString()
                                ? TransactionType.TRANSFER_OUT
                                : TransactionType.TRANSFER_IN,
                        amount: transaction.amount,
                        balance:
                            transaction.fromAccountId.toString() ===
                            account._id.toString()
                                ? transaction.fromAccountBalance
                                : transaction.toAccountBalance,
                        particular:
                            transaction.fromAccountId.toString() ===
                            account._id.toString()
                                ? `Sent to ${
                                      transaction.toAccount?.user?.name ||
                                      "Unknown Account"
                                  }`
                                : `Received from ${
                                      transaction.fromAccount?.user?.name ||
                                      "Unknown Account"
                                  }`,
                        createdAt: transaction.createdAt,
                    })),
                ];

                console.log("selfTransactions_length", selfTransactions.length);
                console.log("fundTransfers_length", fundTransfers.length);
                console.log("combined_length", combinedTransactions.length);
            }

            // Sort by creation date
            combinedTransactions.sort(
                (a, b) =>
                    new Date(b.createdAt).getTime() -
                    new Date(a.createdAt).getTime()
            );

            // Apply text search filter (if no specific type filter was applied)
            let filteredTransactions = combinedTransactions;
            if (filters.q) {
                const searchTerm = filters.q.toLowerCase();
                filteredTransactions = filteredTransactions.filter(
                    (transaction) => {
                        return (
                            transaction.particular
                                .toLowerCase()
                                .includes(searchTerm) ||
                            transaction.amount
                                .toString()
                                .includes(searchTerm) ||
                            transaction.type.toLowerCase().includes(searchTerm)
                        );
                    }
                );
            }

            // Apply pagination
            const total = filteredTransactions.length;
            const totalPages = Math.ceil(total / pagination.limit);
            const skip = (pagination.page - 1) * pagination.limit;
            const paginatedTransactions = filteredTransactions.slice(
                skip,
                skip + pagination.limit
            );
            const hasMore = pagination.page < totalPages;

            return {
                transactions: paginatedTransactions,
                meta: {
                    total,
                    pagination: {
                        page: pagination.page,
                        limit: pagination.limit,
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
                      `[accountsService_getTransactions]: ${error.message}`
                  );
        }
    }
}
