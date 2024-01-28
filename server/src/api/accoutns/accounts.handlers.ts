import { NextFunction, Response } from 'express';
import { IRequestUser, IRequestWithUser } from '../../interfaces/user';
import CustomError from '../../utils/CustomError';
import transactionModel from '../transactions/transactions.model';
import userModel from '../users/users.model';
import accountModel from './accounts.model';

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

            const { toUserId, amount } = req.body;

            if (
                !toUserId ||
                typeof toUserId !== 'string' ||
                userId.trim().length === 0
            ) {
                return next(new CustomError(422, 'Invalid user id'));
            }

            const toUser = await userModel.findOne({ _id: toUserId });
            if (!toUser) {
                return next(new CustomError(404, 'Invalid user id'));
            }

            if (!amount || typeof amount !== 'number' || amount <= 0) {
                return next(new CustomError(422, 'Invalid amount'));
            }

            const fromAccount = await accountModel.findOne({ userId });
            const toAccount = await accountModel.findOne({ userId: toUserId });

            if (!fromAccount) {
                return next(new CustomError(404, 'Source account not found'));
            }

            if (!toAccount) {
                return next(
                    new CustomError(404, 'Destination account not found')
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
                userId,
                toUserId,
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
};

export default accountsHandlers;
