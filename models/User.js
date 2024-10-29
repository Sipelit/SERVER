const { ObjectId } = require("mongodb");
const { db } = require("../config/mongodb");

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
  
  static async getUserById(_id) {
    const data = await collection.findOne({ _id: new ObjectId(_id) });
    return data;
  }

  static async getUserByName(name) {
    const data = await collection.findOne({ name });
    return data;
  }

  static async getUserByUsername(username) {
    const data = await collection.findOne({ username });
    return data;
  }
}

module.exports = User;
