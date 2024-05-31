import User from "../models/user.model";
import { IUser } from "../models/user.model";

export const registerUser = async (user: Partial<IUser>) => {
  const { username, email, password } = user;
  if (!username || !email || !password) {
    return {
      error: "Please provide all required fields",
    };
  }
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return {
      error: "User already exists",
    };
  }
  const newUser = new User({ username, email, password });
  await newUser.save();
  const token = await newUser.generateAuthToken();
  return { user: newUser, token };
};

export const loginUser = async (user: Partial<IUser>) => {
  const { email, password } = user;
  if (!email || !password) {
    throw new Error("Please provide all required fields");
  }
  try {
    const existingUser = await User.findByCredentials(email, password);
    if (!existingUser) {
      throw new Error("Invalid credentials");
    }
    const token = await existingUser.generateAuthToken();
    return { user: existingUser, token };
  } catch (e: any) {
    throw new Error(e.message);
  }
};

export const addBankDetails = async (
  userId: string,
  accountNumber: string,
  IFSCCode: string
) => {
  if (!accountNumber || !IFSCCode) {
    throw new Error("Please provide all required fields");
  }
  const updatedUser = await User.findOneAndUpdate(
    { _id: userId },
    { accountNumber, IFSCCode },
    { new: true }
  );
  if (!updatedUser) {
    throw new Error("User not found");
  }
  return updatedUser;
};

export const getUserById = async (userId: string) => {
  if (!userId) {
    throw new Error("Please provide user ID");
  }
  const user = await User.findById(userId);
  if (!user) {
    throw new Error("User not found");
  }
  return user.toJSON();
};
