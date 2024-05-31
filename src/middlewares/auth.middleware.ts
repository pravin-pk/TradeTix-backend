import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import User, { IUser } from "../models/user.model";
import { HttpError } from "../utils/customExceptionHandler.util";

export interface CustomRequest extends Request {
  user?: IUser;
  token?: string;
}

interface DecodedToken {
  _id: string;
}

const auth =
  (role: "user" | "admin" = "user") =>
  async (req: CustomRequest, res: Response, next: NextFunction) => {
    try {
      const token = req.header("Authorization")?.replace("Bearer ", "");
      if (!token) {
        throw HttpError.unauthorized("User", "Please authenticate");
      }

      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET!
      ) as DecodedToken;
      const user = await User.findOne({
        _id: decoded._id,
        "tokens.token": token,
      });

      if (!user) {
        throw HttpError.unauthorized("User", "Please authenticate");
      }

      if (role === "admin" && user.role !== "admin") {
        throw HttpError.forbidden("User", "Access denied");
      }

      req.user = user;
      req.token = token;
      next();
    } catch (e: any) {
      res.status(401).send({ error: e.message });
    }
  };

export default auth;
