import { IUser } from "./user.interface";

export interface ITicket {
    title: string;
    description: string;
    price: number;
    status: 'open' | 'sold';
    ownedBy: IUser;
    soldTo: IUser | null;
    expiry: Date;
    createdAt: Date;
    updatedAt: Date;
}