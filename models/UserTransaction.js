const { ObjectId } = require("mongodb");
const { db } = require("../config/mongodb");
const collection = db.collection("UserTransaction");

class UserTransaction {
  static async getUserTransactions() {
    const data = await collection.find().toArray();
    return data;
  }
  static async getUserTransactionById(userId) {
    const data = await collection.findOne({ userId: new ObjectId(userId) });
    return data;
  }

  static async createUserTransaction(newUserTransaction) {
    const { userId, items, transactionId, totalPrice } = newUserTransaction;
    const data = {
      userId: new ObjectId(userId),
      items,
      transactionId,
      totalPrice,
    };
    const result = await collection.insertOne(data);

    return {
      ...data,
      _id: result.insertedId,
    };
  }
  static async createManyUserTransaction(newUserTransactions) {
    const data = newUserTransactions.map((transaction) => ({
      name: transaction.name,
      userId: transaction.userId,
      items: transaction.items,
      transactionId: transaction.transactionId,
      totalPrice: transaction.totalPrice,
    }));
   
    
    const result = await collection.insertMany(data);
console.log(result.insertedIds, "result");

    // Return an array of inserted IDs to match expected iterable return
    return result.insertedIds;
  }

  static async updateUserTransaction(_id, name, items, totalPrice, userId) {
    const data = {
      name,
      items,
      totalPrice,
      userId: new ObjectId(userId),
    };
    const result = await collection.updateOne(
      { _id: new ObjectId(_id) },
      { $set: data }
    );
    return result;
  }
  static async deleteUserTransaction(_id) {
    const result = await collection.deleteOne({ _id: new ObjectId(_id) });
    return result;
  }
  static async getUserTransactionsbytransactionId(transactionId) {
    const pipeline = [
      { $match: { transactionId: new ObjectId(transactionId) } },
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "userTransaction",
        },
      },
      {
        $unwind: "$userTransaction",
      },
      {
        $project: {
          "userTransaction.password": 0,
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
}
module.exports = UserTransaction;
