import User from "../models/user.model";
import { IUser } from "../models/user.model";
import { HttpError } from "../utils/customExceptionHandler.util";

export const registerUser = async (user: Partial<IUser>) => {
  const { username, email, password } = user;
  if (!username || !email || !password) {
    throw HttpError.badRequest("User", "Please provide all required fields");
  }
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw HttpError.conflict("User", "User already exists");
  }
  const newUser = new User({ username, email, password });
  await newUser.save();
  const token = await newUser.generateAuthToken();
  return { user: newUser, token };
};

export const loginUser = async (user: Partial<IUser>) => {
  const { email, password } = user;
  if (!email || !password) {
    throw HttpError.badRequest("User", "Please provide all required fields");
  }
  try {
    const existingUser = await User.findByCredentials(email, password);
    if (!existingUser) {
      throw HttpError.badRequest("User", "Invalid credentials");
    }
    const token = await existingUser.generateAuthToken();
    return { user: existingUser, token };
  } catch (e: any) {
    throw HttpError.internalServerError("User", e.message);
  }
};

export const addBankDetails = async (
  userId: string,
  accountNumber: string,
  IFSCCode: string
) => {
  if (!accountNumber || !IFSCCode) {
    throw HttpError.badRequest("User", "Please provide all required fields");
  }
  const updatedUser = await User.findOneAndUpdate(
    { _id: userId },
    { accountNumber, IFSCCode },
    { new: true }
  );
  if (!updatedUser) {
    throw HttpError.notFound("User", "User not found");
  }
  return updatedUser;
};

export const getUserById = async (userId: string) => {
  if (!userId) {
    throw HttpError.badRequest("User", "Please provide all required fields");
  }
  const user = await User.findById(userId);
  if (!user) {
    throw HttpError.notFound("User", "User not found");
  }
  return user.toJSON();
};
