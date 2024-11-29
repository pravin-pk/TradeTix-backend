import Event, { IEvent } from "../models/event.model";
import User, { IUser } from "../models/user.model";
import { FilterQuery } from "mongoose";

export const createEvent = async (
  event: Partial<IEvent>,
  user: Partial<IUser>
) => {
  const {
    name,
    date,
    venue,
    performers,
    categories,
    isAvailable = false,
    validFrom,
    validTo,
  } = event;
  if (
    !name ||
    !date ||
    !venue ||
    !performers ||
    !categories ||
    !validFrom ||
    !validTo
  ) {
    throw new Error("Please provide all required fields");
  }
  const newEvent = new Event({
    name,
    date,
    venue,
    performers,
    categories,
    isAvailable,
    validFrom,
    validTo,
    createdBy: user,
    updatedBy: user,
  });
  await newEvent.save();
  return newEvent;
};

export const getEvents = async (
  limit: number,
  page: number,
  filter: FilterQuery<IEvent>,
  sort: string,
  populateFields: string[] = []
) => {
  let query = Event.find(filter)
    .limit(limit)
    .skip(limit * (page - 1))
    .sort(sort);
  populateFields.forEach((field) => {
    query = query.populate(field);
  });
  const events = await query.exec();
  return events;
};

export const getEventById = async (
  id: string,
  populateFields: string[] = []
) => {
  let query = Event.findById(id);

  populateFields.forEach((field) => {
    query = query.populate(field);
  });

  const event = await query.exec();
  if (!event) {
    throw new Error("Event not found");
  }
  return event;
};

export const updateEvent = async (
  id: string,
  event: Partial<IEvent>,
  user: Partial<IUser>
) => {
  const updatedEvent = await Event.findOneAndUpdate(
    { _id: id, createdBy: user.id },
    event,
    { new: true }
  );
  if (!updatedEvent) {
    throw new Error("Event not found");
  }
  return updatedEvent;
};

export const deleteEvent = async (id: string) => {
  const deletedEvent = await Event.findOneAndDelete({ _id: id });
  if (!deletedEvent) {
    throw new Error("Event not found");
  }
  return deletedEvent;
};
