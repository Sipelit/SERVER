//require
const { ObjectId } = require("mongodb");
const { db } = require("../config/mongodb");
const UserTransaction = require("./UserTransaction");

//variable
const collection = db.collection("transactions");

class Transaction {
  static async getTransactions(userId) {
    const pipeline = [
      { $match: { userId: new ObjectId(userId) } },
      // {
      //   $lookup: {
      //     from: "users",
      //     localField: "userId",
      //     foreignField: "_id",
      //     as: "transactionOfUser",
      //   },
      // },
      // {
      //   $unwind: {
      //     path: "$transactionOfUser",
      //   },
      // },
      // {
      //   $project: {
      //     "transactionOfUser.password": 0,
      //   },
      // },
      {
        $sort: {
          createdAt: -1,
        },
      },
    ];
    const data = await collection.aggregate(pipeline).toArray();

    return data;
  }

  static async getTransactionById(_id) {
    const transaction = await collection.findOne({
      _id: new ObjectId(_id),
    });

    transaction.userTransaction =
      await UserTransaction.getUserTransactionsbytransactionId(transaction._id);

    return transaction;
  }

  static async createTransaction(newTransaction) {
    const { name, category, items, totalPrice, userId, tax } = newTransaction;

    const data = {
      name,
      category,
      items,
      totalPrice,
      userId: new ObjectId(userId),
      tax,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    const result = await collection.insertOne(data);

    return {
      ...data,
      _id: result.insertedId,
    };
  }

  static async updateTransaction(_id, name, items, totalPrice, category) {
    const data = await collection.updateOne(
      { _id: new ObjectId(String(_id)) },
      {
        $set: {
          name,
          items,
          category,
          totalPrice,
        },
      }
    );

    const update = await collection.findOne({ _id: new ObjectId(String(_id)) });

    return update;
  }

  static async deleteTransaction(_id) {
    const data = await collection.deleteOne({ _id: new ObjectId(String(_id)) });

    if (data.deletedCount === 0) {
      throw new Error("Transaction NOT FOUND");
    }
    return data;
  }

  static async getReceipt(transactionId) {
    const pipeline = [
      { $match: { _id: new ObjectId(transactionId) } },
      {
        $lookup: {
          from: "UserTransaction",
          localField: "userTransaction",
          foreignField: "transactionId",
          as: "usersTransactions",
        },
      },

      // {
      //   $unwind: {
      //     path: "$usersTransactions",
      //   },
      // },
    ];
    const data = await collection.aggregate(pipeline).toArray();

    return data;
  }
}
module.exports = Transaction;
