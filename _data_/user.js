const { MongoClient, ObjectId } = require("mongodb");
require("dotenv").config();

const uri = process.env.MONGO_URI;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const userOneId = new ObjectId();
const userOne = {
  _id: userOneId,
  name: "John Doe",
  email: "john@example.com",
  password: "MyPass777!",
};

const setupDatabase = async () => {
  await client.connect();
  const db = client.db("testdb");
  await db.collection("users").deleteMany();
  await db.collection("users").insertOne(userOne);
};

module.exports = {
  userOne,
  userOneId,
  setupDatabase,
};
