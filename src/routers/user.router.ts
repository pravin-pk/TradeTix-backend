import express from "express";
import { IUser } from "../models/user.model";
import {
  createUser,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
} from "../controllers/user.controller";
import auth, { CustomRequest } from "../middlewares/auth.middleware";
import { Request, Response } from "express";
import {
  createErrorResponse,
  createResponse,
} from "../utils/responseHandler.util";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: Operations Related To Users.
 */

/**
 * @swagger
 * /api/users:
 *   post:
 *     summary: Create a user
 *     description: Create a user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Error occurred
 */
router.post("/", async (req: Request, res: Response) => {
  try {
    const createdUser = await createUser(req.body);
    return res.status(201).send(createResponse("USER_CREATED", createdUser));
  } catch (error: any) {
    return res
      .status(error.status)
      .send(createErrorResponse(error.message, error.error));
  }
});

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Get all users
 *     description: Get all users
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Returns all users
 */
router.get("/", auth(), async (req: CustomRequest, res: Response) => {
  try {
    const users = await getUsers(
      Number(req.query.limit),
      Number(req.query.page)
    );
    return res.status(200).send(createResponse("USERS_FETCHED", users));
  } catch (error: any) {
    return res
      .status(error.status)
      .send(createErrorResponse(error.message, error.error));
  }
});

/**
 * @swagger
 * /api/users/{id}:
 *   get:
 *     summary: Get user by ID
 *     description: Get user by ID
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         description: User ID
 *     responses:
 *       200:
 *         description: Get user by ID
 */
router.get("/:id", auth(), async (req: CustomRequest, res: Response) => {
  try {
    const user = await getUserById(req.params.id);
    return res.status(200).send(createResponse("USER_FETCHED", user));
  } catch (error: any) {
    return res
      .status(error.status)
      .send(createErrorResponse(error.message, error.error));
  }
});

/**
 * @swagger
 * /api/users/{id}:
 *   put:
 *     summary: Update user by ID
 *     description: Update user by ID
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         description: User ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: User updated successfully
 */
router.put("/:id", auth(), async (req: CustomRequest, res: Response) => {
  try {
    const user = await updateUser(req.params.id, req.body);
    return res.status(200).send(createResponse("USER_UPDATED", user));
  } catch (error: any) {
    return res
      .status(error.status)
      .send(createErrorResponse(error.message, error.error));
  }
});

/**
 * @swagger
 * /api/users/{id}:
 *   delete:
 *     summary: Delete user by ID
 *     description: Delete user by ID
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         description: User ID
 *     responses:
 *       200:
 *         description: User deleted successfully
 */
router.delete("/:id", auth(), async (req: CustomRequest, res: Response) => {
  try {
    const user = await deleteUser(req.params.id);
    return res.status(200).send(createResponse("USER_DELETED", user));
  } catch (error: any) {
    return res
      .status(error.status)
      .send(createErrorResponse(error.message, error.error));
  }
});

export default router;
