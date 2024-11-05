//require
const { ObjectId } = require("mongodb");
const { db } = require("../config/mongodb");
const UserTransaction = require("./UserTransaction");

//variable
const collection = db.collection("transactions");

class Transaction {
  static async getTransactions(userId, name) {
    let data;
    if (!name) {
      const pipeline = [
        { $match: { userId: new ObjectId(userId) } },
        {
          $sort: {
            createdAt: -1,
          },
        },
      ];
      data = await collection.aggregate(pipeline).toArray();
    } else {
      data = await collection
        .find({
          userId: new ObjectId(userId),
          name: { $regex: name, $options: "i" },
        },{
          $sort: {
            createdAt: -1,
          },
        },)
        .toArray();
    }

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
    ];
    const data = await collection.aggregate(pipeline).toArray();

    return data;
  }
  static async getTransactionByName(name, userId) {
    const data = await collection
      .find({
        userId: new ObjectId(userId),
        name: { $regex: name, $options: "i" },
      })
      .toArray();

    return data;
  }
}
module.exports = Transaction;
