import express from "express";
import { Request, Response } from "express";
import { getOpenTickets, getTicketsByUser, getTicketById } from "../../../../controllers/ticket.controller";
import auth, { CustomRequest } from "../../../../middlewares/auth.middleware";
import { IUser } from "../../../../models/user.model";
import { createResponse, createErrorResponse } from "../../../../utils/responseHandler.util";


const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Tickets - READ
 *   description: Operations Related To Tickets to Read operations from DB.
 */

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
router.get("/open", auth(), async (req: Request, res: Response) => {
  try {
    const { limit, page } = req.query;
    const tickets = await getOpenTickets(Number(limit), Number(page));
    return res
      .status(200)
      .send(createResponse(200, "TICKETS_FETCHED", tickets));
  } catch (error: any) {
    return res
      .status(error.status)
      .send(createErrorResponse(error.status, error.message, error.error));
  }
});

/**
 * @swagger
 * /api/tickets/me:
 *   get:
 *     summary: Get my tickets
 *     description: Get my tickets
 *     tags: [Tickets]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: userType
 *         schema:
 *           type: string
 *           description: The type of user
 *           example: owner
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
router.get("/me", auth(), async (req: CustomRequest, res: Response) => {
  try {
    const { userType, limit, page } = req.query;
    const tickets = await getTicketsByUser(
      req.user as IUser,
      userType as "owner" | "buyer",
      Number(limit),
      Number(page)
    );
    return res
      .status(200)
      .send(createResponse(200, "TICKETS_FETCHED", tickets));
  } catch (error: any) {
    return res
      .status(error.status)
      .send(createErrorResponse(error.status, error.message, error.error));
  }
});

/**
 * @swagger
 * /api/tickets/{id}:
 *   get:
 *     summary: Get ticket by ID
 *     description: Get ticket by ID
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
router.get("/:id", auth(), async (req: CustomRequest, res: Response) => {
  try {
    const ticketId = req.params.id;
    const ticket = await getTicketById(ticketId);
    return res.status(200).send(createResponse(200, "TICKET_FETCHED", ticket));
  } catch (error: any) {
    return res
      .status(error.status)
      .send(createErrorResponse(error.status, error.message, error.error));
  }
});

export default router;
