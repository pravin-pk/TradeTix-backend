import { Document, Model, model, HydratedDocument, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export interface IUser extends Document{
    username: string;
    email: string;
    password: string;
    tokens: { token: string}[];
    createdAt: Date;
    updatedAt: Date;
}

export interface IUserMethods {
    generateAuthToken(): Promise<string>;
    toJSON(): IUser;
}

interface UserModel extends Model<IUser, {}, IUserMethods> {
    findByCredentials(email: string, password: string): Promise<HydratedDocument<IUser, IUserMethods>>
}

const userSchema = new Schema<IUser, UserModel, IUserMethods>({
    username: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
        trim: true
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }]
}, {
    timestamps: true
});

userSchema.pre('save', async function(next) {
    if(this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 8);
    }
});

userSchema.methods.generateAuthToken = async function() {
    const user = this;
    const token = jwt.sign({ _id: (user._id as string).toString() }, process.env.JWT_SECRET!);
    user.tokens = user.tokens.concat({ token });
    await user.save();
    return token;
}

userSchema.methods.toJSON = function() {
    const user = this as IUser;
    const userObject = user.toObject();
    delete userObject.password;
    delete userObject.tokens;
    return userObject;
}

userSchema.statics.findByCredentials = async function(email: string, password: string) {
    const user = await User.findOne({ email });
    if(!user) {
        return null;
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if(!isMatch) {
        return null;
    }
    return user;
}

const User = model<IUser, UserModel>('User', userSchema);

export default User;