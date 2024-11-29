import { FilterQuery } from "mongoose";
import Transaction, { ITransaction } from "../models/transaction.model";
import { IUser } from "../models/user.model";
import { HttpError } from "../utils/customExceptionHandler.util";

export const createTransaction = async (
  listingID: string,
  transaction: Partial<ITransaction>,
  user: Partial<IUser>
) => {
  const newTransaction = new Transaction({
    listingID,
    salePrice: transaction.salePrice,
    createdBy: user,
    updatedBy: user,
  });
  await newTransaction.save();
  return newTransaction;
};

export const getTransactions = async (limit: number, page: number, filter: FilterQuery<ITransaction>, sort: string) => {
  const query = Transaction.find()
    .limit(limit)
    .skip(limit * (page - 1))
    .sort(sort);
  const transactions = await query.exec();
  return transactions;
};

export const getTransactionById = async (id: string) => {
  const transaction = await Transaction.findById(id);
  if (!transaction) {
    throw HttpError.notFound("Transaction", "Transaction not found");
  }
  return transaction;
}
