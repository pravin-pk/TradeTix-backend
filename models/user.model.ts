import { Document, Model, model, HydratedDocument, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export interface IUser extends Document{
    username: string;
    email: string;
    password: string;
    role: 'user' | 'admin';
    tokens: { token: string}[];
    accountNumber: string
    IFSCCode: string
    createdAt: Date;
    updatedAt: Date;
}

export interface IUserMethods {
    generateAuthToken(role: 'user'|'admin'): Promise<string>;
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
    role: {
        type: String,
        required: true,
        enum: ['user', 'admin'],
        default: 'user'
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }],
    accountNumber: {
        type: String,
        trim: true
    },
    IFSCCode: {
        type: String,
        trim: true
    }
}, {
    timestamps: true
});

userSchema.pre('save', async function(next) {
    if(this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 8);
    }
});

userSchema.methods.generateAuthToken = async function(role: 'user' | 'admin' = 'user') {
    const user = this;
    const token = jwt.sign({ _id: (user._id as string).toString(), role}, process.env.JWT_SECRET!);
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
        throw new Error('User not found');
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if(!isMatch) {
        throw new Error('Invalid credentials');
    }
    return user;
}

const User = model<IUser, UserModel>('User', userSchema);

export default User;