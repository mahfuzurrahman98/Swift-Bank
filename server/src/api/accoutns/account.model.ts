import { Document, Model, Mongoose, Schema } from 'mongoose';
import Database from '../../configs/Database';
import { IAccount } from '../../interfaces/account';
import CustomError from '../../utils/CustomError';

let db: Mongoose;

try {
    db = Database.getInstance();
} catch (error: any) {
    throw new CustomError(500, error.message);
}

const collectionName = 'accounts';
let accountModel: Model<IAccount & Document>;

try {
    const schema = new Schema<IAccount>(
        {
            userId: {
                type: String,
                required: true,
            },
            balance: {
                type: Number,
                required: true,
                default: 0,
            },
            active: {
                type: Boolean,
                required: true,
                default: true,
            },
            beneficiaries: [
                {
                    type: Schema.Types.ObjectId,
                    ref: 'accounts',
                },
            ],
            deletedAt: {
                type: Date,
                default: null,
            },
        },
        { timestamps: true }
    );

    accountModel =
        db.models[collectionName] ||
        db.model<IAccount & Document>(collectionName, schema);
} catch (error: any) {
    throw new CustomError(500, error.message);
}

export default accountModel;
