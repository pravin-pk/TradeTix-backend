import express from 'express';
import { IUser } from '../models/user.model';
import { loginUser, registerUser } from '../controllers/user.controller';
import auth, { CustomRequest } from '../middlewares/auth.middleware';
import { Request, Response } from 'express';

const router = express.Router();

/*
 * @swagger
 * tags:
 *   name: Users
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
    const user: Partial<IUser> = {
        username: req.body.username,
        name: req.body.name,
        email: req.body.email,
        password: req.body.password
    }
    const registeredUser = await registerUser(user);
    if (registeredUser.error) {
        return res.status(400).send({ error: registeredUser.error });
    }

    return res.status(201).send({registeredUser});
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
    const user: Partial<IUser> = {
        email: req.body.email,
        password: req.body.password
    }
    const loggedInUser = await loginUser(user);
    if (loggedInUser?.error) {
        return res.status(400).send({ error: loggedInUser.error });
    }
    return res.send({ loggedInUser });
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
router.post('/logout', auth, async (req: CustomRequest, res: Response) => {
    if(req.user) {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token;
        })
        await req.user.save();
    }

    return res.status(200).json({ message: 'Logged out' });
});

export default router;