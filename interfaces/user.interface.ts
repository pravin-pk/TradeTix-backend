import { Document } from 'mongoose';

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