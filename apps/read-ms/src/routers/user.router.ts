
import express from 'express';
import { Request, Response } from 'express';
import { getUserById } from '../../../../controllers/user.controller';
import auth, { CustomRequest } from '../../../../middlewares/auth.middleware';
import { createResponse, createErrorResponse } from '../../../../utils/responseHandler.util';


const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: Operations Related To Tickets.
*/

/**
 * @swagger
 * /api/users/me:
 *   get:
 *     summary: Get user profile
 *     description: Get user profile
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Returns user profile
 */
router.get('/me', auth(), async (req: CustomRequest, res: Response) => {
    try {
        const userId = req.user!._id;
        const user = await getUserById(userId as string);
        return res.status(200).send(createResponse(200, "USER_FETCHED", user));
    } catch(error: any) {
        return res.status(error.status).send(createErrorResponse(error.status, error.message, error.error));
    }
});

export default router;