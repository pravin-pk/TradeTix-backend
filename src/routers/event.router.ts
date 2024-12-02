import express from "express";
import { Request, Response } from "express";
import {
  createEvent,
  deleteEvent,
  getEvents,
  getEventById,
  updateEvent,
} from "../controllers/event.controller";
import { createTicket, getTicketsForEvent } from "../controllers/ticket.controller";
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
 *   name: Events
 *   description: Operations Related To Events.
 */

/**
 * @swagger
 * /api/events:
 *   post:
 *     summary: Create new Event
 *     description: Create new Event
 *     tags: [Events]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              name:
 *                type: string
 *                description: Name of the event
 *                example: "Arijit Singh Concert"
 *              date:
 *                type: date
 *                description: Date of the event
 *                example: "2022-12-31T00:00:00.000Z"
 *              venue:
 *                type: string
 *                description: Venue of the event
 *                example: "Mumbai"
 *              performers:
 *                type: array
 *                description: Performers of the event
 *                example: ["Arijit Singh", "Shreya Ghoshal"]
 *              categories:
 *                type: array
 *                description: Categories of the event
 *                example: ["Music", "Concert"]
 *              isAvailable:
 *                type: boolean
 *                description: Availability of the event
 *                example: false
 *              validFrom:
 *                type: date
 *                description: Valid from date of the event
 *                example: "2022-12-31T00:00:00.000Z"
 *              validTo:
 *                type: date
 *                description: Valid to date of the event
 *                example: "2022-12-31T00:00:00.000Z"
 *     responses:
 *       200:
 *         description: Creates new ticket
 */
router.post("/", auth(), async (req: CustomRequest, res: Response) => {
  try {
    const event = await createEvent(req.body, req.user!);
    return res.status(201).send(createResponse("EVENT_CREATED", event));
  } catch (error: any) {
    return res
      .status(500)
      .send(createErrorResponse("INTERNAL_SERVER_ERROR", error.message));
  }
});

/**
 * @swagger
 * /api/events/{id}/tickets:
 *   post:
 *     summary: Create new Ticket
 *     description: Create new Ticket for an event
 *     tags: [Events]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           description: Event ID
 *           example: 60f3b3b3b3b3b3b3b3b3b3b
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               seatNumber:
 *                 type: string
 *                 description: Seat number of the ticket
 *                 example: "A1"
 *     responses:
 *       200:
 *         description: Creates new ticket
 */
router.post(
  "/:id/tickets",
  auth(),
  async (req: CustomRequest, res: Response) => {
    try {
      const ticket = await createTicket(
        req.body as Partial<ITicket>,
        req.params.id as Partial<IEvent>,
        req.user!
      );
      return res.status(201).send(createResponse("TICKET_CREATED", ticket));
    } catch (error: any) {
      return res
        .status(500)
        .send(createErrorResponse("INTERNAL_SERVER_ERROR", error.message));
    }
  }
);

/**
 * @swagger
 * /api/events/{id}/tickets:
 *   get:
 *     summary: Get all tickets
 *     description: Get all tickets for an event
 *     tags: [Events]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           description: Event ID
 *           example: 60f3b3b3b3b3b3b3b3b3b3b
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
router.get("/:id/tickets", auth(), async (req: CustomRequest, res: Response) => {
    try {
      const limit = parseInt(req.query.limit as string) || 10;
      const page = parseInt(req.query.page as string) || 1;
      const filter = req.query.filter
        ? JSON.parse(req.query.filter as string)
        : {};
      const sort = (req.query.sort as string) || "-createdAt";
      const tickets = await getTicketsForEvent(
        req.params.id as Partial<IEvent>,
        limit,
        page,
        filter,
        sort
      );
      return res.status(200).send(createResponse("TICKETS_FETCHED", tickets));
    } catch (error: any) {
      return res
        .status(error.status)
        .send(createErrorResponse(error.message, error.error));
    }
  });

/**
 * @swagger
 * /api/events:
 *   get:
 *     summary: Get all Events
 *     description: Get all Events
 *     tags: [Events]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: number
 *         description: Number of events to get
 *       - in: query
 *         name: page
 *         schema:
 *           type: number
 *         description: Page number
 *       - in: query
 *         name: filter
 *         schema:
 *           type: string
 *         description: JSON string to filter events
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *         description: Field to sort events by
 *     responses:
 *       200:
 *         description: Get all events
 */
router.get("/", auth(), async (req: Request, res: Response) => {
  try {
    const limit = parseInt(req.query.limit as string) || 10;
    const page = parseInt(req.query.page as string) || 1;
    const filter = req.query.filter
      ? JSON.parse(req.query.filter as string)
      : {};
    const sort = (req.query.sort as string) || "-createdAt";
    const events = await getEvents(limit, page, filter, sort);
    return res.status(200).send(createResponse("EVENTS_FETCHED", events));
  } catch (error: any) {
    return res
      .status(500)
      .send(createErrorResponse("INTERNAL_SERVER_ERROR", error.message));
  }
});

/**
 * @swagger
 * /api/events/{id}:
 *   get:
 *     summary: Get Event by ID
 *     description: Get Event by ID
 *     tags: [Events]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         description: Event ID
 *     responses:
 *       200:
 *         description: Get event by ID
 */
router.get("/:id", auth(), async (req: Request, res: Response) => {
  try {
    const event = await getEventById(req.params.id);
    return res.status(200).send(createResponse("EVENT_FETCHED", event));
  } catch (error: any) {
    return res
      .status(500)
      .send(createErrorResponse("INTERNAL_SERVER_ERROR", error.message));
  }
});

/**
 * @swagger
 * /api/events/{id}:
 *   put:
 *     summary: Update Event by ID
 *     description: Update Event by ID
 *     tags: [Events]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         description: Event ID
 *     requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              name:
 *                type: string
 *                description: Name of the event
 *                example: "Arijit Singh Concert"
 *              date:
 *                type: date
 *                description: Date of the event
 *                example: "2022-12-31T00:00:00.000Z"
 *              venue:
 *                type: string
 *                description: Venue of the event
 *                example: "Mumbai"
 *              performers:
 *                type: array
 *                description: Performers of the event
 *                example: ["Arijit Singh", "Shreya Ghoshal"]
 *              categories:
 *                type: array
 *                description: Categories of the event
 *                example: ["Music", "Concert"]
 *     responses:
 *       200:
 *         description: Update event by ID
 */
router.put("/:id", auth(), async (req: CustomRequest, res: Response) => {
  try {
    const event = await updateEvent(req.params.id, req.body, req.user!);
    return res.status(200).send(createResponse("EVENT_UPDATED", event));
  } catch (error: any) {
    return res
      .status(500)
      .send(createErrorResponse("INTERNAL_SERVER_ERROR", error.message));
  }
});

/**
 * @swagger
 * /api/events/{id}:
 *   delete:
 *     summary: Delete Event by ID
 *     description: Delete Event by ID
 *     tags: [Events]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         description: Event ID
 *     responses:
 *       200:
 *         description: Delete event by ID
 */
router.delete("/:id", auth(), async (req: CustomRequest, res: Response) => {
  try {
    const event = await deleteEvent(req.params.id);
    return res.status(200).send(createResponse("EVENT_DELETED", event));
  } catch (error: any) {
    return res
      .status(500)
      .send(createErrorResponse("INTERNAL_SERVER_ERROR", error.message));
  }
});

export default router;
