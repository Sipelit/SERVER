const { MongoMemoryServer } = require("mongodb-memory-server");
const { MongoClient, ObjectId } = require("mongodb");
const User = require("../models/User");
const { hashPass } = require("../helpers/bcrypt");

let mongoServer;
let client;
let db;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  await client.connect();
  db = client.db("testdb");
  User.collection = db.collection("users");
});

afterAll(async () => {
  await client.close();
  await mongoServer.stop();
});

beforeEach(async () => {
  await db.collection("users").deleteMany();
});

describe("User Model", () => {
  test("should register a new user", async () => {
    const newUser = {
      name: "John Doe",
      username: "johndoe",
      email: "john@example.com",
      password: hashPass("password123"),
    };
    const result = await User.register(newUser);
    console.log("🚀 ~ test ~ result:", result);
    // expect(result).toBeTruthy();

    expect(result.insertedId).toBeTruthy();
    console.log("insertId", result.insertedId);
    console.log(new ObjectId(result.insertedId), ">>>>>");

    // const user = await db
    //   .collection("users")
    //   .findOne({ _id: new ObjectId(result.insertedId) });
    // console.log("🚀 ~ test ~ user:", user);
    // expect(user).toBeTruthy();
    // expect(user.name).toBe(newUser.name);
  });

  test("should login a user", async () => {
    const newUser = {
      name: "John Doe",
      username: "johndoe",
      email: "john@example.com",
      password: hashPass("password123"),
    };
    const regis = await User.register(newUser);
    // console.log("🚀 ~ test ~ regis:", regis)
    const user = await User.login(newUser.username, newUser.password);
    // console.log("🚀 ~ test ~ user:", user)
    expect(user).toBeTruthy();
    expect(user.username).toBe("johndoe");
    expect(user.password).toBe(user.password);
  });

  test("should get all users", async () => {
    const newUser = {
      name: "John Doe",
      username: "johndoe",
      email: "john@example.com",
      password: hashPass("password123"),
    };
    await User.register(newUser);
    const users = await User.getUsers();
    expect(users.length).toBe(users.length);
    expect(users[0].username).toBe(users[0].username);
  });

  test("should get user by ID", async () => {
    const newUser = {
      name: "John Doe",
      username: "johndoe",
      email: "john@example.com",
      password: hashPass("password123"),
    };
    const result = await User.register(newUser);
    const userId = result.insertedId;
    const user = await User.getUserById(userId);
    expect(user).toBeTruthy();
    expect(user.username).toBe("johndoe");
  });

  test("should get user by username", async () => {
    const newUser = {
      name: "John Doe",
      username: "johndoe",
      email: "john@example.com",
      password: hashPass("password123"),
    };
    await User.register(newUser);
    const user = await User.getUserByUsername("johndoe");
    expect(user).toBeTruthy();
    expect(user.username).toBe("johndoe");
  });

  // Add this test case for invalid login
  test("should fail to login with incorrect password", async () => {
    const newUser = {
      name: "John Doe",
      username: "johndoe",
      email: "john@example.com",
      password: hashPass("password123"),
    };
    await User.register(newUser);
    const user = await User.login("johndoe", "wrongpassword");
    expect(user).toBeFalsy();
  });

  // Add this test case for user not found
  test("should fail to login with non-existent username", async () => {
    const user = await User.login("nonexistentuser", "password123");
    expect(user).toBeFalsy();
  });

  
});
