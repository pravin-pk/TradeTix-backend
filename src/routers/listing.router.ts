import express from "express";
import { Request, Response } from "express";
import {} from "../controllers/ticket.controller";
import { updateTicket, deleteTicket } from "../controllers/ticket.controller";
import auth, { CustomRequest } from "../middlewares/auth.middleware";
import {
  createErrorResponse,
  createResponse,
} from "../utils/responseHandler.util";
import { IUser } from "../models/user.model";
import { IEvent } from "../models/event.model";
import { ITicket } from "../models/ticket.model";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Listings
 *   description: Operations Related To Tickets.
 */

router.put("/:id", auth(), async (req: CustomRequest, res: Response) => {
  try {
    const id: string = req.params.id;
    const ticket: Partial<ITicket> = {
      seatNumber: req.body.seatNumber,
    };
    const user: Partial<IUser> = req.user!;
    const updatedTicket = await updateTicket(id, ticket, user);
    return res
      .status(200)
      .send(createResponse("TICKET_UPDATED", updatedTicket));
  } catch (error: any) {
    return res
      .status(error.status)
      .send(createErrorResponse(error.message, error.error));
  }
});

router.delete("/:id", auth(), async (req: CustomRequest, res: Response) => {
  try {
    const id: string = req.params.id;
    const user: Partial<IUser> = req.user!;
    await deleteTicket(id);
    return res.status(200).send(createResponse("TICKET_DELETED", {}));
  } catch (error: any) {
    return res
      .status(error.status)
      .send(createErrorResponse(error.message, error.error));
  }
});
