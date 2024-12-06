import express from "express";
import { Request, Response } from "express";

import { createErrorResponse, createResponse } from "../../../../utils/responseHandler.util";
import { createTicket, deleteTicket, buyTicket } from "../../../../controllers/ticket.controller";
import auth, { CustomRequest } from "../../../../middlewares/auth.middleware";


const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Tickets - CUD
 *   description: Operations Related To Tickets Create, Update & Delete operations from DB.
 */

/**
 * @swagger
 * /api/tickets:
 *   post:
 *     summary: Create new Ticket
 *     description: Create new Ticket
 *     tags: [Tickets]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              title:
 *                type: string
 *                description: The title of the ticket
 *                example: "Arijit Singh Concert"
 *              description:
 *                type: string
 *                description: The description of the ticket
 *                example: "Arijit Singh Concert in Mumbai"
 *              price:
 *                type: number
 *                description: The price of the ticket
 *                example: 1000
 *              expiry:
 *                type: string
 *                description: The expiry date of the ticket
 *                example: "2022-12-31T00:00:00.000Z"
 *     responses:
 *       200:
 *         description: Creates new ticket
 */
router.post("/", auth(), async (req: CustomRequest, res: Response) => {
  try {
    const ticket = {
      title: req.body.title,
      description: req.body.description,
      price: req.body.price,
      owner: req.user,
      expiry: req.body.expiry,
    };
    const newTicket = await createTicket(ticket);
    return res
      .status(201)
      .send(createResponse(201, "TICKET_CREATED", newTicket));
  } catch (error: any) {
    return res
      .status(error.status)
      .send(createErrorResponse(error.status, error.message, error.error));
  }
});

/**
 * @swagger
 * /api/tickets/{id}:
 *   delete:
 *     summary: Delete ticket
 *     description: Delete ticket
 *     tags: [Tickets]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           description: Ticket ID
 *           example: 60f3b3b3b3b3b3b3b3b3b3b
 *     responses:
 *       200:
 *         description: Returns message
 */
router.delete("/:id", auth(), async (req: CustomRequest, res: Response) => {
  try {
    const ticketId = req.params.id;
    const ticket = await deleteTicket(ticketId);
    return res.status(200).send(createResponse(200, "TICKET_DELETED", ticket));
  } catch (error: any) {
    return res
      .status(error.status)
      .send(createErrorResponse(error.status, error.message, error.error));
  }
});

/**
 * @swagger
 * /api/tickets/{id}/buy:
 *   patch:
 *     summary: Buy ticket
 *     description: Buy ticket
 *     tags: [Tickets]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           description: Ticket ID
 *           example: 60f3b3b3b3b3b3b3b3b3b3b
 *     responses:
 *       200:
 *         description: Returns ticket
 */
router.patch("/:id/buy", auth(), async (req: CustomRequest, res: Response) => {
  try {
    const ticketId = req.params.id;
    const ticket = await buyTicket(ticketId, req.user!._id as string);
    return res.status(200).send(createResponse(200, "TICKET_BOUGHT", ticket));
  } catch (error: any) {
    return res
      .status(error.status)
      .send(createErrorResponse(error.status, error.message, error.error));
  }
});

export default router;
