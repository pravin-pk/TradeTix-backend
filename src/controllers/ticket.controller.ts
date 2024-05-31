import Ticket from "../models/ticket.model";
import { ITicket } from "../models/ticket.model";
import User, { IUser } from "../models/user.model";

export const createTicket = async (ticket: Partial<ITicket>) => {
    const { title, price, owner, expiry } = ticket;
    if(!title || !price || !expiry) {
        return {
            error: 'Please provide all required fields',
        }
    }
    const status = 'open';
    const createdAt = new Date();
    const newTicket = new Ticket({title, price, status, owner, createdAt, expiry});
    await newTicket.save();
    return { title: newTicket.title, price: newTicket.price, status: newTicket.status, owner: newTicket.owner._id, createdAt: newTicket.createdAt, updatedAt: newTicket.updatedAt, expiry: newTicket.expiry };
}

export const updateTicket = async (ticket: Partial<ITicket>) => {
    const { title, price, owner, expiry } = ticket;
    if(!title || !price || !owner || !expiry) {
        return {
            error: 'Please provide all required fields',
        }
    }
    const updatedTicket = await Ticket.findOneAndUpdate({ title }, ticket, { new: true });
    if(!updatedTicket) {
        return {
            error: 'Ticket not found',
        }
    }
    return { ticket: updatedTicket };
}

export const deleteTicket = async (id: string) => {
    const ticket = await Ticket.findByIdAndDelete(id);
    if(!ticket) {
        return {
            error: 'Ticket not found',
        }
    }
    return { ticket };
}

export const getOpenTickets = async (limit: number, page: number) => {
    const tickets = await Ticket.find({status: 'open' }).sort({createdAt: -1}).limit(limit).skip(limit * (page - 1));
    if (!tickets.length) {
        throw new Error('No tickets found');
    }   
    return tickets;
};

export const getTicketById = async (id: string) => {
    const ticket = await Ticket.findById(id);
    if(!ticket) {
        return {
            error: 'Ticket not found',
        }
    }
    return { ticket };
}

export const buyTicket = async (ticketId: string, buyerId: string) => {
    const ticket: ITicket | null = await Ticket.findById(ticketId);
    const buyer: IUser | null = await User.findById(buyerId);
    if(!ticket) {
        return {
            error: 'Ticket not found',
        }
    }
    ticket.buyer = buyer;
    ticket.status = 'sold';
    await ticket.save();
    return { ticket };
}