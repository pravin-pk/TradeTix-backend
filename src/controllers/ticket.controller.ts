import Ticket from "../models/ticket.model";
import { ITicket } from "../models/ticket.model";
import User, { IUser } from "../models/user.model";
import { HttpError } from "../utils/customExceptionHandler.util";

export const createTicket = async (ticket: Partial<ITicket>) => {
  const { title, description, price, owner, expiry } = ticket;
  if (!title || !price || !expiry) {
    throw HttpError.badRequest("Ticket", "Please provide all required fields");
  }
  const status = "open";
  const createdAt = new Date();
  const newTicket = new Ticket({
    title,
    description,
    price,
    status,
    owner,
    createdAt,
    expiry,
  });
  await newTicket.save();
  return newTicket.toJSON('owner');
};

export const deleteTicket = async (id: string) => {
  const ticket = await Ticket.findByIdAndDelete(id);
  if (!ticket) {
    throw HttpError.notFound("Ticket", "Ticket not found");
  }
  return { ticket };
};

export const getOpenTickets = async (limit: number, page: number) => {
  const currentDate = new Date();
  const tickets = await Ticket.find({
    status: "open",
    expiry: { $gte: currentDate },
  })
    .sort({ createdAt: -1 })
    .limit(limit)
    .skip(limit * (page - 1));
  return tickets;
};

export const getTicketById = async (id: string) => {
  const ticket = await Ticket.findById(id);
  if (!ticket) {
    throw HttpError.notFound("Ticket", "Ticket not found");
  }
  return { ticket };
};

export const buyTicket = async (ticketId: string, buyerId: string) => {
  const ticket: ITicket | null = await Ticket.findById(ticketId);
  const buyer: IUser | null = await User.findById(buyerId);
  if (!ticket) {
    throw HttpError.notFound("Ticket", "Ticket not found");
  }
  if (ticket.status === "sold") {
    throw HttpError.badRequest("Ticket", "Ticket already sold");
  }
  const updatedTicket = await Ticket.findOneAndUpdate({ _id: ticketId }, { status: 'sold', buyer: buyer }, { new: true });
  return updatedTicket!.toJSON('buyer');
};
