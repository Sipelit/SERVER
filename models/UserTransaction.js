class UserTransaction {
   static async getUserTransaction(userId) {
    const data = await collection.findOne({ userId: new ObjectId(userId) });
    return data;
  }

  static  async createUserTransaction(newUserTransaction) {
    const { userId, items, totalPrice } = newUserTransaction;
    const data = {
      userId: new ObjectId(userId),
      items,
      totalPrice,
    };
    const result = await collection.insertOne(data);
    return result;
  }
}