const { ObjectId } = require("mongodb");
const { db } = require("../config/mongoDB");

const collection = db.collection("users");

class User {
  static async register(newUser) {
    const data = await collection.insertOne(newUser);
    return data;
  }

  static async login(username, password) {
    const data = await collection.findOne({ username, password });
    return data;
  }

  static async getUsers() {
    const data = await collection.find().toArray();
    return data;
  }
}

module.exports = User;
