import Ticket, { ITicket } from "../models/ticket.model";
import Listing, { IListing } from "../models/listing.model";
import User, { IUser } from "../models/user.model";

export const createListing = async (
  listing: Partial<IListing>,
  ticketID: string,
  user: Partial<IUser>
) => {
  const newListing = new Listing({
    ticketID,
    price: listing.price,
    createdBy: user,
    updatedBy: user,
  });
  await newListing.save();
  return newListing;
};

export const getListingForTicket = async (ticketID: string) => {
  const listing = await Listing.findOne({ ticketID });
  if (!listing) {
    throw new Error("Listing not found");
  }
  return listing;
};

export const updateListing = async (
  id: string,
  listing: Partial<IListing>,
  user: Partial<IUser>
) => {
  const updatedListing = await Listing.findOneAndUpdate(
    { _id: id, createdBy: user.id },
    listing,
    { new: true }
  );
  if (!updatedListing) {
    throw new Error("Listing not found");
  }
  return updatedListing;
};

export const deleteListing = async (id: string) => {
  const deletedListing = await Listing.findOneAndDelete({ _id: id });
  if (!deletedListing) {
    throw new Error("Listing not found");
  }
  return deletedListing;
};
