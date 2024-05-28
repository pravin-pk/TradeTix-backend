import {Request, Response, NextFunction} from 'express';
import jwt from 'jsonwebtoken';
import User, {IUser} from '../models/user.models';

export interface CustomRequest extends Request {
    user?: IUser;
    token?: string;
}

interface DecodedToken {
    _id : string;
}

const auth = async (req: CustomRequest, res: Response, next: NextFunction) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');
        if(!token) {
            throw new Error('Please authenticate');
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as DecodedToken;
        const user = await User.findOne({ _id: decoded._id, 'tokens.token': token });
        if(!user) {
            throw new Error('Please authenticate');
        }
        req.user = user;
        req.token = token;
        next();
    } catch(e) {
        res.status(401).send({ error: e.message });
    }
}