import { NextFunction, Response } from "express";
import { Error as MongooseError } from "mongoose";
import {
    IFundTransferTransaction,
    ISelfTransaction,
} from "../../interfaces/transaction";
import { IRequestUser, IRequestWithUser } from "../../interfaces/user";
import CustomError from "../../utils/CustomError";
import fundTransferTransactionModel from "../transactions/fund-transfer.model";
import selfTransactionModel from "../transactions/self-transaction.model";
import accountModel from "./account.model";

// interface ITransactionModified extends ITransaction {
//     toAccount?: object;
// }

const accountsHandlers = {
    getAccount: async (
        req: IRequestWithUser,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {
        try {
            if (!req?.user) {
                return next(new CustomError(401, "Unauthorized"));
            }

            const user: IRequestUser = req.user;
            const userId = user.id;

            // account has beneficiaries array with their account ids
            // we need to find the name of each beneficiary with its account id
            // name is in the users model
            const account = await accountModel.findOne({ userId }).populate({
                path: "beneficiaries",
                populate: {
                    path: "userId", // Assuming 'userId' is the field in the beneficiary account that references the User model
                    select: "name", // Select only the name field from the User model
                    model: "users", // Replace with your actual User model name if it's different
                },
                model: "accounts",
            });

            if (!account) {
                return next(new CustomError(404, "Account not found"));
            }

            let modifiedBeneficiaries: any = [];

            if (account.beneficiaries) {
                modifiedBeneficiaries = account.beneficiaries.map(
                    (beneficiary: any) => ({
                        _id: beneficiary?._id, // Assuming _id is part of the User model
                        name: beneficiary?.userId?.name,
                    })
                );
            }

            // get rid of the original beneficiaries array
            account.beneficiaries = undefined;

            // add the modified beneficiaries array
            const modifiedAccount: any = {
                ...account.toJSON(),
                beneficiaries: modifiedBeneficiaries,
            };

            return res.status(200).json({
                success: true,
                message: "Account fetched successfully",
                data: { account: modifiedAccount },
            });
        } catch (error) {
            return next(new CustomError(500, "Something went wrong"));
        }
    },

    deposit: async (
        req: IRequestWithUser,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {
        try {
            if (!req?.user) {
                return next(new CustomError(401, "Unauthorized"));
            }

            const user: IRequestUser = req?.user;
            const userId = user.id;

            const { amount } = req.body;

            if (!amount || typeof amount !== "number" || amount <= 0) {
                return next(new CustomError(422, "Invalid amount"));
            }

            const account = await accountModel.findOne({ userId });
            if (!account) {
                return next(new CustomError(404, "Account not found"));
            }

            account.balance += amount;

            // if account is not active, then active it
            // this will happen when the first deposit
            if (!account.active) {
                account.active = true;
            }
            await account.save();

            const transaction: ISelfTransaction =
                await selfTransactionModel.create({
                    accountId: account._id,
                    amount,
                    type: "deposit",
                    balance: account.balance,
                });

            return res.status(200).json({
                success: true,
                message: "Deposit successful",
                data: { account, transaction },
            });
        } catch (error: any) {
            return next(
                new CustomError(500, error.message || "Something went wrong")
            );
        }
    },

    withdraw: async (
        req: IRequestWithUser,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {
        try {
            if (!req?.user) {
                return next(new CustomError(401, "Unauthorized"));
            }

            const user: IRequestUser = req?.user;
            const userId = user.id;

            const { amount } = req.body;

            if (!amount || typeof amount !== "number" || amount <= 0) {
                return next(new CustomError(422, "Invalid amount"));
            }

            const account = await accountModel.findOne({ userId });
            if (!account) {
                return next(new CustomError(404, "Account not found"));
            }

            if (account.balance < amount) {
                return next(new CustomError(400, "Insufficient funds"));
            }

            account.balance -= amount;
            await account.save();

            const transaction: ISelfTransaction =
                await selfTransactionModel.create({
                    accountId: account._id,
                    amount,
                    type: "withdraw",
                    balance: account.balance,
                });

            return res.status(200).json({
                success: true,
                message: "Withdrawal successful",
                data: { account, transaction },
            });
        } catch (error: any) {
            return next(
                new CustomError(500, error.message || "Something went wrong")
            );
        }
    },

    transfer: async (
        req: IRequestWithUser,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {
        try {
            if (!req?.user) {
                return next(new CustomError(401, "Unauthorized"));
            }

            const user: IRequestUser = req?.user;
            const userId = user.id;
            const fromAccount = await accountModel.findOne({ userId });

            if (!fromAccount) {
                return next(new CustomError(404, "Source account not found"));
            }

            console.log(req.body);
            const { toAccountId, amount } = req.body;

            if (
                !toAccountId ||
                typeof toAccountId !== "string" ||
                toAccountId.trim().length === 0
            ) {
                return next(
                    new CustomError(422, "Invalid destination account id")
                );
            }

            const toAccount = await accountModel.findOne({ _id: toAccountId });
            if (!toAccount) {
                return next(
                    new CustomError(404, "Destination account not found")
                );
            }

            if (!amount || typeof amount !== "number" || amount <= 0) {
                return next(new CustomError(422, "Invalid amount"));
            }

            if (!toAccount) {
                return next(
                    new CustomError(404, "Destination account not found")
                );
            }

            // now check if toAccount is a beneficiary of fromAccount
            if (
                !fromAccount.beneficiaries ||
                !fromAccount.beneficiaries.includes(toAccount._id)
            ) {
                return next(
                    new CustomError(
                        403,
                        "Destination account is not a beneficiary"
                    )
                );
            }

            if (fromAccount.balance < amount) {
                return next(new CustomError(400, "Insufficient funds"));
            }

            fromAccount.balance -= amount;
            toAccount.balance += amount;

            // if account is not active, then active it
            // this will happen when the first deposit
            if (!toAccount.active) {
                toAccount.active = true;
            }

            await fromAccount.save();
            await toAccount.save();

            const transaction: IFundTransferTransaction =
                await fundTransferTransactionModel.create({
                    fromAccountId: fromAccount._id,
                    toAccountId,
                    amount,
                    fromAccountBalance: fromAccount.balance,
                    toAccountBalance: toAccount.balance,
                });

            return res.status(200).json({
                success: true,
                message: "Transfer successful",
                data: { fromAccount, toAccount, transaction },
            });
        } catch (error: any) {
            return next(
                new CustomError(500, error.message || "Something went wrong")
            );
        }
    },

    createBeneficiary: async (
        req: IRequestWithUser,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {
        try {
            if (!req?.user) {
                return next(new CustomError(401, "Unauthorized"));
            }

            const user: IRequestUser = req?.user;
            const userId = user.id;

            const { beneficiaryId } = req.body;

            if (
                !beneficiaryId ||
                typeof beneficiaryId !== "string" ||
                beneficiaryId.trim().length === 0
            ) {
                return next(new CustomError(422, "Invalid beneficiary id"));
            }

            // if beneficiaryId is a Cast to ObjectId failed for value "2345234324" (type string) at path "_id" for model "accounts"
            // we need to check if beneficiaryId is a valid account id

            const beneficiary = await accountModel.findOne({
                _id: beneficiaryId,
            });
            if (!beneficiary) {
                return next(new CustomError(404, "No such account found"));
            }

            const account = await accountModel.findOne({ userId });
            if (!account) {
                return next(new CustomError(404, "Account not found"));
            }

            if (!account.beneficiaries) {
                account.beneficiaries = [];
            }

            if (account.beneficiaries.includes(beneficiaryId)) {
                return next(new CustomError(400, "Beneficiary already added"));
            }

            account.beneficiaries.push(beneficiaryId);
            await account.save();

            return res.status(200).json({
                success: true,
                message: "Beneficiary added successfully",
                data: { account },
            });
        } catch (error: any) {
            if (error instanceof MongooseError.CastError) {
                return next(
                    new CustomError(
                        422,
                        "Invalid beneficiary ids",
                        "Mongoose Cast Error"
                    )
                );
            }
            return next(
                new CustomError(500, error.message || "Something went wrong")
            );
        }
    },

    getBeneficiaries: async (
        req: IRequestWithUser,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {
        try {
            if (!req?.user) {
                return next(new CustomError(401, "Unauthorized"));
            }

            const user: IRequestUser = req?.user;
            const userId = user.id;

            const account = await accountModel.findOne({ userId });
            if (!account) {
                return next(new CustomError(404, "Account not found"));
            }

            const beneficiaries = await accountModel.find({
                _id: { $in: account.beneficiaries },
            });

            return res.status(200).json({
                success: true,
                message: "Beneficiaries fetched successfully",
                data: { beneficiaries },
            });
        } catch (error: any) {
            return next(
                new CustomError(500, error.message || "Something went wrong")
            );
        }
    },

    deleteBeneficiary: async (
        req: IRequestWithUser,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {
        try {
            if (!req?.user) {
                return next(new CustomError(401, "Unauthorized"));
            }

            const user: IRequestUser = req?.user;
            const userId = user.id;

            // find beneficiary id from request params /:id
            const beneficiaryId = req.params.id;

            if (
                !beneficiaryId ||
                typeof beneficiaryId !== "string" ||
                beneficiaryId.trim().length === 0
            ) {
                return next(new CustomError(422, "Invalid beneficiary id"));
            }

            const account = await accountModel.findOne({ userId });
            if (!account) {
                return next(new CustomError(404, "Source account not found"));
            }
            if (
                !account.beneficiaries ||
                !account.beneficiaries.includes(beneficiaryId)
            ) {
                return next(new CustomError(404, "No such beneficiary found"));
            }

            account.beneficiaries = account.beneficiaries.filter(
                (id) => id.toString() !== beneficiaryId
            );
            await account.save();

            return res.status(200).json({
                success: true,
                message: "Beneficiary deleted successfully",
                data: { account },
            });
        } catch (error: any) {
            return next(
                new CustomError(500, error.message || "Something went wrong")
            );
        }
    },

    getTransactions: async (
        req: IRequestWithUser,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {
        try {
            if (!req?.user) {
                return next(new CustomError(401, "Unauthorized"));
            }

            const user: IRequestUser = req?.user;
            const userId = user.id;

            const account = await accountModel.findOne({ userId });
            if (!account) {
                return next(new CustomError(404, "Account not found"));
            }

            // Find self transactions, means the transaction made by the current user
            // either incoming or outgoing
            // incoming = deposit
            // outgoing = withdrawal

            const selfTransactions: ISelfTransaction[] =
                await selfTransactionModel.find({ accountId: account._id });

            // Now find beneficiary transactions
            // either incoming or outgoing
            // incoming = fund transfered to current user account
            // outgoing = fund transfered from current user account

            // const beneficiaryTransactions: IFundTransferTransaction[] =
            //     await fundTransferTransactionModel.find({
            //         $or: [
            //             { fromAccountId: account._id },
            //             { toAccountId: account._id },
            //         ],
            //     });

            const beneficiaryTransactions: IFundTransferTransaction[] =
                await fundTransferTransactionModel
                    .find({
                        $or: [
                            { fromAccountId: account._id },
                            { toAccountId: account._id },
                        ],
                    })
                    .populate({
                        path: "fromAccountId",
                        model: "accounts",
                        populate: {
                            path: "userId",
                            model: "users",
                            select: "name",
                        },
                    })
                    .populate({
                        path: "toAccountId",
                        model: "accounts",
                        populate: {
                            path: "userId",
                            model: "users",
                            select: "name",
                        },
                    });

            // Transform the result to include separate fromAccount and toAccount objects
            const transformedBeneficiaryTransactions =
                beneficiaryTransactions.map((transaction) => {
                    const transformedTransaction: any = {
                        ...transaction.toObject(),
                    };

                    // after populating through accounts
                    // model we are getting fromAccountId and toAccountId as objects
                    // but they are basically string/objectIds
                    // so we need to assign them to fromAccount and toAccount

                    // assign fromAccount and toAccount objects
                    transformedTransaction.fromAccount =
                        transformedTransaction.fromAccountId;
                    transformedTransaction.toAccount =
                        transformedTransaction.toAccountId;

                    // get back fromAccountId and toAccountId as string again
                    transformedTransaction.fromAccountId =
                        transformedTransaction.fromAccount?._id;
                    transformedTransaction.toAccountId =
                        transformedTransaction.toAccount?._id;

                    // Again we only need fromAccountName and toAccountName
                    transformedTransaction.fromAccountName =
                        transformedTransaction.fromAccount?.userId?.name;
                    transformedTransaction.toAccountName =
                        transformedTransaction.toAccount?.userId?.name;

                    transformedTransaction.curAccId = account._id;

                    // transfer type
                    // if fromAccount is same as current user
                    // then it means current user is sending money, its outgoing
                    // if toAccount is same as current user
                    // then it means current user is receiving money, its incoming
                    transformedTransaction.type =
                        transformedTransaction.fromAccountId ==
                        account._id.toString()
                            ? "transfered out"
                            : "transfered in";

                    // Set balance and particular based on the transfer type
                    if (transformedTransaction.type === "transfered out") {
                        transformedTransaction.balance =
                            transformedTransaction.fromAccountBalance;
                        transformedTransaction.particular = `Sent to ${transformedTransaction.toAccountName}`;
                    } else {
                        transformedTransaction.balance =
                            transformedTransaction.toAccountBalance;
                        transformedTransaction.particular = `Received from ${transformedTransaction.fromAccountName}`;
                    }

                    // now get rid of fromAccount and toAccount objects
                    delete transformedTransaction.fromAccount;
                    delete transformedTransaction.toAccount;

                    return transformedTransaction;
                });

            const combinedTransactions = [
                ...selfTransactions.map((transaction) => ({
                    _id: transaction._id,
                    type: transaction.type,
                    amount: transaction.amount,
                    balance: transaction.balance,
                    particular:
                        transaction.type === "deposit"
                            ? `$${transaction.amount} deposited`
                            : `$${transaction.amount} is withdrawn`,
                    createdAt: transaction.createdAt,
                })),
                ...transformedBeneficiaryTransactions.map((transaction) => ({
                    _id: transaction._id,
                    type: transaction.type,
                    amount: transaction.amount,
                    balance: transaction.balance,
                    particular: transaction.particular,
                    createdAt: transaction.createdAt,
                })),
            ].sort((a, b) => a.createdAt - b.createdAt);

            return res.status(200).json({
                success: true,
                message: "Transactions fetched successfully",
                data: {
                    transactions: combinedTransactions,
                },
            });
        } catch (error: any) {
            return next(
                new CustomError(500, error.message || "Something went wrong")
            );
        }
    },
};

export default accountsHandlers;
