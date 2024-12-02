import { Document, Schema, Model, model, HydratedDocument } from "mongoose";
import { IUser } from "./user.model";

export interface IEvent extends Document {
  name: string;
  date: Date;
  venue: string;
  performers: string[];
  categories: string[];
  isAvailable: boolean;
  validFrom: Date;
  validTo: Date;
  createdBy: IUser;
  createdAt: Date;
  updatedBy: IUser;
  updatedAt: Date;
}

export interface IEventMethods {
  //
}

interface EventModel extends Model<IEvent, {}, IEventMethods> {}

const eventSchema = new Schema<IEvent, EventModel, IEventMethods>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    date: {
      type: Date,
      required: true,
    },
    venue: {
      type: String,
      required: true,
      trim: true,
    },
    performers: {
      type: [String],
      required: true,
    },
    categories: {
      type: [String],
      required: true,
    },
    isAvailable: {
      type: Boolean,
      default: false,
    },
    validFrom: {
      type: Date,
      required: true,
    },
    validTo: {
      type: Date,
      required: true,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    updatedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

eventSchema.pre<IEvent>("save", function (next) {
  const currentDate = new Date();
  this.createdAt = currentDate;
  this.updatedAt = currentDate;
  next();
});

eventSchema.pre<IEvent>("findOneAndUpdate", function (next) {
  this.updatedAt = new Date();
  next();
});

const Event = model<IEvent, EventModel>("Event", eventSchema);

export default Event;
