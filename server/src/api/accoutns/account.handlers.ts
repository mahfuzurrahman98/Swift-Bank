import { NextFunction, Response } from 'express';
import { IRequestUser, IRequestWithUser } from '../../interfaces/user';
import CustomError from '../../utils/CustomError';
import transactionModel from '../transactions/transaction.model';
import accountModel from './account.model';

const accountsHandlers = {
    deposit: async (
        req: IRequestWithUser,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {
        try {
            if (!req?.user) {
                return next(new CustomError(401, 'Unauthorized'));
            }

            const user: IRequestUser = req?.user;
            const userId = user.id;

            const { amount } = req.body;

            if (!amount || typeof amount !== 'number' || amount <= 0) {
                return next(new CustomError(422, 'Invalid amount'));
            }

            const account = await accountModel.findOne({ userId });
            if (!account) {
                return next(new CustomError(404, 'Account not found'));
            }

            account.balance += amount;

            // if account is not active, then active it
            // this will happen when the first deposit
            if (!account.active) {
                account.active = true;
            }
            await account.save();

            const transaction = await transactionModel.create({
                userId,
                amount,
                type: 'deposit',
            });

            return res.status(200).json({
                success: true,
                message: 'Deposit successful',
                data: { account, transaction },
            });
        } catch (error: any) {
            return next(
                new CustomError(500, error.message || 'Something went wrong')
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
                return next(new CustomError(401, 'Unauthorized'));
            }

            const user: IRequestUser = req?.user;
            const userId = user.id;

            const { amount } = req.body;

            if (!amount || typeof amount !== 'number' || amount <= 0) {
                return next(new CustomError(422, 'Invalid amount'));
            }

            const account = await accountModel.findOne({ userId });
            if (!account) {
                return next(new CustomError(404, 'Account not found'));
            }

            if (account.balance < amount) {
                return next(new CustomError(400, 'Insufficient funds'));
            }

            account.balance -= amount;
            await account.save();

            const transaction = await transactionModel.create({
                userId,
                amount,
                type: 'withdraw',
            });

            return res.status(200).json({
                success: true,
                message: 'Withdrawal successful',
                data: { account, transaction },
            });
        } catch (error: any) {
            return next(
                new CustomError(500, error.message || 'Something went wrong')
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
                return next(new CustomError(401, 'Unauthorized'));
            }

            const user: IRequestUser = req?.user;
            const userId = user.id;
            const fromAccount = await accountModel.findOne({ userId });

            if (!fromAccount) {
                return next(new CustomError(404, 'Source account not found'));
            }

            const { toAccountId, amount } = req.body;

            if (
                !toAccountId ||
                typeof toAccountId !== 'string' ||
                toAccountId.trim().length === 0
            ) {
                return next(
                    new CustomError(422, 'Invalid destination account id')
                );
            }

            const toAccount = await accountModel.findOne({ _id: toAccountId });
            if (!toAccount) {
                return next(
                    new CustomError(404, 'Destination account not found')
                );
            }

            if (!amount || typeof amount !== 'number' || amount <= 0) {
                return next(new CustomError(422, 'Invalid amount'));
            }

            if (!toAccount) {
                return next(
                    new CustomError(404, 'Destination account not found')
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
                        'Destination account is not a beneficiary'
                    )
                );
            }

            if (fromAccount.balance < amount) {
                return next(new CustomError(400, 'Insufficient funds'));
            }

            fromAccount.balance -= amount;
            toAccount.balance += amount;

            await fromAccount.save();
            await toAccount.save();

            const transaction = await transactionModel.create({
                fromAccountId: fromAccount._id,
                toAccountId,
                amount,
                type: 'transfer',
            });

            return res.status(200).json({
                success: true,
                message: 'Transfer successful',
                data: { fromAccount, toAccount, transaction },
            });
        } catch (error: any) {
            return next(
                new CustomError(500, error.message || 'Something went wrong')
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
                return next(new CustomError(401, 'Unauthorized'));
            }

            const user: IRequestUser = req?.user;
            const userId = user.id;

            const { beneficiaryId } = req.body;

            if (
                !beneficiaryId ||
                typeof beneficiaryId !== 'string' ||
                beneficiaryId.trim().length === 0
            ) {
                return next(new CustomError(422, 'Invalid beneficiary id'));
            }

            const beneficiary = await accountModel.findOne({
                _id: beneficiaryId,
            });
            if (!beneficiary) {
                return next(new CustomError(404, 'No such account found'));
            }

            const account = await accountModel.findOne({ userId });
            if (!account) {
                return next(new CustomError(404, 'Account not found'));
            }

            if (!account.beneficiaries) {
                account.beneficiaries = [];
            }

            if (account.beneficiaries.includes(beneficiaryId)) {
                return next(new CustomError(400, 'Beneficiary already added'));
            }

            account.beneficiaries.push(beneficiaryId);
            await account.save();

            return res.status(200).json({
                success: true,
                message: 'Beneficiary added successfully',
                data: { account },
            });
        } catch (error: any) {
            return next(
                new CustomError(500, error.message || 'Something went wrong')
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
                return next(new CustomError(401, 'Unauthorized'));
            }

            const user: IRequestUser = req?.user;
            const userId = user.id;

            const account = await accountModel.findOne({ userId });
            if (!account) {
                return next(new CustomError(404, 'Account not found'));
            }

            const beneficiaries = await accountModel.find({
                _id: { $in: account.beneficiaries },
            });

            return res.status(200).json({
                success: true,
                message: 'Beneficiaries fetched successfully',
                data: { beneficiaries },
            });
        } catch (error: any) {
            return next(
                new CustomError(500, error.message || 'Something went wrong')
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
                return next(new CustomError(401, 'Unauthorized'));
            }

            const user: IRequestUser = req?.user;
            const userId = user.id;

            // find beneficiary id from request params /:id
            const beneficiaryId = req.params.id;

            if (
                !beneficiaryId ||
                typeof beneficiaryId !== 'string' ||
                beneficiaryId.trim().length === 0
            ) {
                return next(new CustomError(422, 'Invalid beneficiary id'));
            }

            const account = await accountModel.findOne({ userId });
            if (!account) {
                return next(new CustomError(404, 'Source account not found'));
            }
            if (
                !account.beneficiaries ||
                !account.beneficiaries.includes(beneficiaryId)
            ) {
                return next(new CustomError(404, 'No such beneficiary found'));
            }

            account.beneficiaries = account.beneficiaries.filter(
                (id) => id.toString() !== beneficiaryId
            );
            await account.save();

            return res.status(200).json({
                success: true,
                message: 'Beneficiary deleted successfully',
                data: { account },
            });
        } catch (error: any) {
            return next(
                new CustomError(500, error.message || 'Something went wrong')
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
                return next(new CustomError(401, 'Unauthorized'));
            }

            const user: IRequestUser = req?.user;
            const userId = user.id;

            const account = await accountModel.findOne({ userId });
            if (!account) {
                return next(new CustomError(404, 'Account not found'));
            }

            const transactions = await transactionModel.find({
                fromAccountId: account._id,
            });

            return res.status(200).json({
                success: true,
                message: 'Transactions fetched successfully',
                data: { transactions },
            });
        } catch (error: any) {
            return next(
                new CustomError(500, error.message || 'Something went wrong')
            );
        }
    },
};

export default accountsHandlers;
