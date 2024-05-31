import { Document, Schema, Model, model, HydratedDocument } from "mongoose";
import { IUser } from "./user.model";

export interface ITicket extends Document {
    title: string;
    description: string;
    price: number;
    status: 'open' | 'sold';
    owner: IUser;
    buyer: IUser | null;
    expiry: Date;
    createdAt: Date;
    updatedAt: Date;
}

export interface ITicketMethods {
    toJSON(): ITicket;
}

const ticketSchema = new Schema<ITicket, ITicketMethods>({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    price: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        required: true,
        enum: ['open', 'sold'],
        default: 'open'
    },
    owner: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    buyer: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    expiry: {
        type: Date,
        required: true
    }
}, {
    timestamps: true
});

ticketSchema.pre<ITicket>('save', function(next) {
    this.createdAt = new Date();
    this.updatedAt = new Date();
    next();
});

ticketSchema.pre<ITicket>('findOneAndUpdate', function(next) {
    this.updatedAt = new Date();
    next();
});

ticketSchema.methods.toJSON = function() {
    const ticket = this as ITicket;
    const ticketObject = ticket.toObject();
    return ticketObject;
}

const Ticket = model<ITicket>('Ticket', ticketSchema);

export default Ticket;