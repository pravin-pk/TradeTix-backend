import Ticket from "../models/ticket.model";
import { ITicket } from "../models/ticket.model";
import User, { IUser } from "../models/user.model";
import { HttpError } from "../utils/customExceptionHandler.util";

export const createTicket = async (ticket: Partial<ITicket>) => {
    const { title, price, owner, expiry } = ticket;
    if(!title || !price || !expiry) {
        throw HttpError.badRequest("Ticket", "Please provide all required fields");
    }
    const status = 'open';
    const createdAt = new Date();
    const newTicket = new Ticket({title, price, status, owner, createdAt, expiry});
    await newTicket.save();
    return newTicket.toJSON();
}

export const deleteTicket = async (id: string) => {
    const ticket = await Ticket.findByIdAndDelete(id);
    if(!ticket) {
        throw HttpError.notFound("Ticket", "Ticket not found");
    }
    return { ticket };
}

export const getOpenTickets = async (limit: number, page: number) => {
    const tickets = await Ticket.find({status: 'open' }).sort({createdAt: -1}).limit(limit).skip(limit * (page - 1));
    if (!tickets.length) {
        throw HttpError.notFound("Ticket", "No open tickets found");
    }   
    return tickets;
};

export const getTicketById = async (id: string) => {
    const ticket = await Ticket.findById(id);
    if(!ticket) {
        throw HttpError.notFound("Ticket", "Ticket not found");
    }
    return { ticket };
}

export const buyTicket = async (ticketId: string, buyerId: string) => {
    const ticket: ITicket | null = await Ticket.findById(ticketId);
    const buyer: IUser | null = await User.findById(buyerId);
    if(!ticket) {
        throw HttpError.notFound("Ticket", "Ticket not found");
    }
    ticket.buyer = buyer;
    ticket.status = 'sold';
    await ticket.save();
    return ticket.toJSON();
}
