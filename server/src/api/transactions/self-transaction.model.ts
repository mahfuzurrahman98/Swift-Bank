import { Document, Model, Mongoose, Schema } from 'mongoose';
import Database from '../../configs/Database';
import { ISelfTransaction } from '../../interfaces/transaction';
import CustomError from '../../utils/CustomError';

let db: Mongoose;

try {
    db = Database.getInstance();
} catch (error: any) {
    throw new CustomError(500, error.message);
}

const collectionName = 'self_transactions';
let selfTransactionModel: Model<ISelfTransaction & Document>;

try {
    const schema = new Schema<ISelfTransaction>(
        {
            accountId: {
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
                enum: ['deposit', 'withdraw'],
            },
            balance: {
                type: Number,
                required: true,
            },
            deletedAt: {
                type: Date,
                default: null,
            },
        },
        { timestamps: true }
    );

    selfTransactionModel =
        db.models[collectionName] ||
        db.model<ISelfTransaction & Document>(collectionName, schema);
} catch (error: any) {
    throw new CustomError(500, error.message);
}

export default selfTransactionModel;
