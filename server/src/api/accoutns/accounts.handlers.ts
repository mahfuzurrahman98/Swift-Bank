import { NextFunction, Request, Response } from 'express';
import CustomError from '../../utils/CustomError';
import transactionModel from '../transactions/transactions.model';
import accountModel from './accounts.model';

const accountsHandlers = {
    deposit: async (
        req: Request<{ userId: string }>,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {
        try {
            const { userId } = req.params;
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
                createdAt: new Date(),
                updatedAt: new Date(),
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
        req: Request<{ userId: string }>,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {
        try {
            const { userId } = req.params;
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
                createdAt: new Date(),
                updatedAt: new Date(),
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
        req: Request<{ userId: string }>,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {
        try {
            const { userId } = req.params;
            const { toUserId, amount } = req.body;

            if (
                !toUserId ||
                typeof toUserId !== 'string' ||
                !amount ||
                typeof amount !== 'number' ||
                amount <= 0
            ) {
                return next(new CustomError(422, 'Invalid data'));
            }

            const fromAccount = await accountModel.findOne({ userId });
            const toAccount = await accountModel.findOne({ userId: toUserId });

            if (!fromAccount || !toAccount) {
                return next(
                    new CustomError(404, 'One or more accounts not found')
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
                createdAt: new Date(),
                updatedAt: new Date(),
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
