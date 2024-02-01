import { Document, Model, Mongoose, Schema } from 'mongoose';
import Database from '../../configs/Database';
import { IFundTransferTransaction } from '../../interfaces/transaction';
import CustomError from '../../utils/CustomError';

let db: Mongoose;

try {
    db = Database.getInstance();
} catch (error: any) {
    throw new CustomError(500, error.message);
}

const collectionName = 'fund_transfers';
let fundTransferTransactionModel: Model<IFundTransferTransaction & Document>;

try {
    const schema = new Schema<IFundTransferTransaction>(
        {
            fromAccountId: {
                type: String,
                ref: 'accounts',
            },
            toAccountId: {
                type: String,
                ref: 'accounts',
            },
            amount: {
                type: Number,
                required: true,
            },
            fromAccountBalance: {
                type: Number,
                required: true,
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

    fundTransferTransactionModel =
        db.models[collectionName] ||
        db.model<IFundTransferTransaction & Document>(collectionName, schema);
} catch (error: any) {
    throw new CustomError(500, error.message);
}

export default fundTransferTransactionModel;
