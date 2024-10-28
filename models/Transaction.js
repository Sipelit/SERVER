//require
const { ObjectId } = require("mongodb");
const { db } = require("../config/mongoDB");

//variable
const collection = db.collection("Transactions");

class Transaction {
  static async getTransactions() {
    const pipeline = [
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "transactionOfUser",
        },
      },
      {
        $unwind: {
          path: "$transactionOfUser",
        },
      },
      {
        $project: {
          "transactionOfUser.password": 0,
        },
      },
      {
        $sort: {
          createdAt: 1,
        },
      },
    ];
    const data = await collection.aggregate(pipeline).toArray();
    return data;
  }

  static async getTransactionById(_id) {
    const data = await collection.findOne({ _id: new ObjectId(String(_id)) });
    return data;
  }

  static async createTransaction(newTransaction) {
    const { name, items, totalPrice, userId } = newTransaction;
    const data = {
      name,
      items,
      totalPrice,
      userId: new ObjectId(userId),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    const result = await collection.insertOne(data);
    return result;
  }

  static async updateTransaction(_id, name, items, totalPrice) {
    const data = await collection.updateMany(
      { _id },
      {
        $set: {
          name: name,
          items: items,
          totalPrice: totalPrice,
        },
      }
    );
    return data;
  }

  static async deleteTransaction(_id) {
    const data = await collection.deleteOne({ _id: new ObjectId(String(_id)) });
    // console.log("🚀 ~ Transaction ~ deleteTransaction ~ data:", data);

    if (data.deletedCount === 0) {
      throw new Error("Transaction NOT FOUND");
    }
    return data;
  }
}
module.exports = Transaction;
