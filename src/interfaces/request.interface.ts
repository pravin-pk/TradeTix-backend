import { Request as ExpressRequest } from 'express';
import { IUser } from '../models/user.model';

interface Request extends ExpressRequest {
  user: IUser;
  token: string
}

export default Request;