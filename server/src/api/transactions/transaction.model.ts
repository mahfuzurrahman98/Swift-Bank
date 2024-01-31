import { Document, Model, Mongoose, Schema } from 'mongoose';
import Database from '../../configs/Database';
import { ITransaction } from '../../interfaces/transaction';
import CustomError from '../../utils/CustomError';

let db: Mongoose;

try {
    db = Database.getInstance();
} catch (error: any) {
    throw new CustomError(500, error.message);
}

const collectionName = 'transactions';
let transactionModel: Model<ITransaction & Document>;

try {
    const schema = new Schema<ITransaction>(
        {
            fromAccountId: {
                type: String,
                ref: 'accounts',
            },
            amount: {
                type: Number,
                required: true,
            },
            type: {
                type: String,
                required: true,
                enum: ['deposit', 'withdraw', 'transfer'],
            },
            balance: {
                type: Number,
                required: true,
            },
            toAccountId: {
                type: String,
                ref: 'accounts',
            },
            toAccountBalance: {
                type: Number,
            },
            deletedAt: {
                type: Date,
                default: null,
            },
        },
        { timestamps: true }
    );

    transactionModel =
        db.models[collectionName] ||
        db.model<ITransaction & Document>(collectionName, schema);
} catch (error: any) {
    throw new CustomError(500, error.message);
}

export default transactionModel;
