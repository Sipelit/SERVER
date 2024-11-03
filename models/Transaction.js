//require
const { ObjectId } = require("mongodb");
const { db } = require("../config/mongodb");
const UserTransaction = require("./UserTransaction");

//variable
const collection = db.collection("transactions");

class Transaction {
  static async getTransactions() {
    const pipeline = [
      { $match: { _id: new ObjectId(String(_id)) } },
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
          createdAt: 0,
        },
      },
    ];
    const data = await collection.aggregate(pipeline).toArray();

    return data;
  }

  static async getTransactionById(_id) {
    const transaction = await collection.findOne({
      _id: new ObjectId(String(_id)),
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

  static async updateTransaction(_id, name, items, totalPrice, catagory) {
    const data = await collection.updateOne(
      { _id: new ObjectId(String(_id)) },
      {
        $set: {
          name,
          items,
          catagory,
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

  static async getrecipe(transactionId) {
    const pipeline = [
      { $match: { transactionId: new ObjectId(transactionId) } },
      {
        $lookup: {
          from: "UserTransaction",
          localField: "transactionId",
          foreignField: "_id",
          as: "usersTransactions",
        },
      },
      {
        $unwind: {
          path: "$usersTransactions",
        },
      },
    ];
    const data = await collection.aggregate(pipeline).toArray();
    console.log(data,"da ");
    
    return data;
  }
}
module.exports = Transaction;
