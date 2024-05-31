import express from "express";
import { Request , Response } from "express";
import { createTicket, deleteTicket, getOpenTickets } from "../controllers/ticket.controller";
import auth, { CustomRequest } from "../middlewares/auth.middleware";
import { createErrorResponse, createResponse } from "../utils/responseHandler.util";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Tickets
 *   description: Operations Related To Tickets.
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
 *         description: Returns all tickets
 */
router.post("/", auth, async (req: CustomRequest, res: Response) => {
  try {
    const ticket = {
      title: req.body.title,
      description: req.body.description,
      price: req.body.price,
      owner: req.user,
      expiry: req.body.expiry,
    };
    const newTicket = await createTicket(ticket);
    return res.status(201).send({ ticket: newTicket });
  } catch(error: any) {
    return res.status(400).send({ error: error.message });
  }
});

/**
 * @swagger
 * /api/tickets/open:
 *   get:
 *     summary: Get open tickets
 *     description: Get open tickets
 *     tags: [Tickets]
 *     security:
 *       - bearerAuth: []
 *     parameters:  
 *       - in: query
 *         name: limit
 *         schema:
 *           type: number
 *           description: The number of tickets to return 
 *           example: 10
 *       - in: query 
 *         name: page
 *         schema:
 *           type: number
 *           description: The page number
 *           example: 1  
 *     responses:
 *       200:
 *         description: Returns all tickets
 */
router.get("/open", auth, async (req: Request, res: Response) => {
  try {
    const { limit, page } = req.query;
    const tickets = await getOpenTickets(Number(limit), Number(page));
    return res.status(200).send(createResponse(200, "TICKETS_FETCHED", tickets));
  } catch (error: any) {
    return res.status(400).send(createErrorResponse(400, "BAD_REQUEST", error.message));
  }
})

export default router;
