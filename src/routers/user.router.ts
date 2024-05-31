import express from 'express';
import { IUser } from '../models/user.models';
import { loginUser, registerUser } from '../controllers/user.controller';
import auth, { CustomRequest } from '../middlewares/auth.middleware';
import { Request, Response } from 'express';

const router = express.Router();

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

    return res.status(201).send({registerUser});
});

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