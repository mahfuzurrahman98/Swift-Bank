import { Document, Model, Mongoose, Schema } from 'mongoose';
import Database from '../../configs/Database';
import { IUser } from '../../interfaces/user';
import CustomError from '../../utils/CustomError';

let db: Mongoose;

try {
    db = Database.getInstance();
} catch (error: any) {
    throw new CustomError(500, error.message);
}

const collectionName = 'users';
let userModel: Model<IUser & Document>;

try {
    const schema = new Schema<IUser>(
        {
            name: {
                type: String,
                required: true,
            },
            email: {
                type: String,
                required: true,
                unique: true,
            },
            password: {
                type: String,
                required: false,
            },
            googleAuth: {
                type: Boolean,
                required: false,
            },
            active: {
                type: Boolean,
                required: true,
            },
            deletedAt: {
                type: Date,
                default: null,
            },
        },
        { timestamps: true }
    );

    userModel = db.models[collectionName] || db.model<IUser & Document>(collectionName, schema);
} catch (error: any) {
    throw new CustomError(500, error.message);
}

export default userModel;
