
import express from 'express';
import { Request, Response } from 'express';
import { registerUser, loginUser, addBankDetails } from '../../../../controllers/user.controller';
import auth, { CustomRequest } from '../../../../middlewares/auth.middleware';
import { IUser } from '../../../../models/user.model';
import { createResponse, createErrorResponse } from '../../../../utils/responseHandler.util';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Users - CUD
 *   description: Operations Related To Tickets.
*/

/**
 * @swagger
 * /api/users/register:
 *   post:
 *     summary: Register a user
 *     description: Register a user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             properties:
 *               username:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Error occurred
 */
router.post('/register', async (req: Request, res: Response) => {
    try{
        const user: Partial<IUser> = {
            username: req.body.username,
            email: req.body.email,
            password: req.body.password
        }
        const registeredUser = await registerUser(user);
        return res.status(201).send(createResponse(201, "USER_REGISTERED", registeredUser));
    } catch (error: any) {
        return res.status(error.status).send(createErrorResponse(error.status, error.message, error.error));
    }
});

/**
 * @swagger
 * /api/users/login:
 *   post:
 *     summary: Login a user
 *     description: Login a user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: User logged in successfully
 *       400:
 *         description: Error occurred
 */
router.post('/login', async (req: Request, res: Response) => {
    try {
        const user: Partial<IUser> = {
            email: req.body.email,
            password: req.body.password
        }
        const loggedInUser = await loginUser(user);
        return res.send(createResponse(200, "USER_LOGGED_IN", loggedInUser));
    } catch(error: any) {
        return res.status(error.status).send(createErrorResponse(error.status, error.message, error.error));
    }
})

/**
 * @swagger
 * /api/users/logout:
 *   post:
 *     summary: Logout a user
 *     description: Logout a user
 *     tags: [Users]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: User logged out successfully
 */
router.post('/logout', auth(), async (req: CustomRequest, res: Response) => {
    try {
        if(req.user) {
            req.user.tokens = req.user.tokens.filter((token) => {
                return token.token !== req.token;
            })
            await req.user.save();
        }
        return res.status(200).json(createResponse(200, "USER_LOGGED_OUT", "Logged out"));
    } catch(error: any) {
        return res.status(error.status).send(createErrorResponse(error.status, error.message, error.error));
    }
});

/**
 * @swagger
 * /api/users/{userId}/bank-details:
 *   post:
 *     summary: Add bank details
 *     description: Add bank details
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *           description: User ID
 *           example: 60f3b3b3b3b3b3b3b3b3b3b3
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             properties:
 *               accountNumber:
 *                 type: string
 *                 description: Account number
 *                 example: 1234567890
 *               IFSCCode:
 *                 type: string
 *                 description: IFSC Code
 *                 example: HDFC0001234
 *     responses:
 *       200:
 *         description: Bank details added successfully
 *       400:
 *         description: Error occurred
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
router.post('/:userId/bank-details', auth(), async (req: CustomRequest, res: Response) => {
    try {
        const userId = req.params.userId;
        const accountNumber = req.body.accountNumber;
        const IFSCCode = req.body.IFSCCode;
        const updatedUser = await addBankDetails(userId, accountNumber, IFSCCode);
        return res.status(200).send(createResponse(200, "BANK_DETAILS_ADDED", updatedUser));
    } catch(error: any) {
        return res.status(error.status).send(createErrorResponse(error.status, error.message, error.error));
    }
})

export default router;