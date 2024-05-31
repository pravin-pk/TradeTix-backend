import User from '../models/user.model';
import { IUser } from '../models/user.model';

export const registerUser = async (user: Partial<IUser>) => {
    const { username, email, password } = user;
    if(!username || !email || !password) {
        return {
            error: 'Please provide all required fields',
        }
    }
    const existingUser = await User.findOne({ email });
    if(existingUser) {
        return {
            error: 'User already exists',
        }
    }
    const newUser = new User({username, email, password});
    await newUser.save();
    const token = await newUser.generateAuthToken();
    return { user: newUser, token };
}

export const loginUser = async (user: Partial<IUser>) => {
    const {email, password} = user;
    if(!email || !password) {
        return {
            error: 'Please provide all required fields',
        }
    }
    const existingUser = await User.findByCredentials(email, password);
    if(!existingUser) {
        return null;
    }
    const token = await existingUser.generateAuthToken();
    return { user: existingUser, token };
}