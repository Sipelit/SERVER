let db;
const Transaction = require("../models/Transaction");
const { MongoClient, ObjectId } = require("mongodb");

describe("Transaction Model", () => {
  let client;
  let transactionCollection;

  beforeAll(async () => {
    client = new MongoClient(process.env.MONGO_URI);
    await client.connect();
    db = client.db("SiPelit");
    transactionCollection = db.collection("transactions");
  });

  afterAll(async () => {
    await client.close();
  });

  it("should create a new transaction", async () => {
    const transactionData = {
      name: "Sample Transaction",
      category: "Sample Category",
      items: [
        { name: "Item 1", price: 100, quantity: 2, totalPrice: 200 },
        { name: "Item 2", price: 50, quantity: 1, totalPrice: 50 },
      ],
      totalPrice: 250,
      userId: new ObjectId(),
      tax: 10,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const result = await Transaction.createTransaction(transactionData);
    expect(result).toHaveProperty("_id");
    expect(result.name).toBe("Sample Transaction");
    expect(result.items.length).toBe(2);
  });

  it("should retrieve a transaction by ID", async () => {
    const newTransaction = await transactionCollection.insertOne({
      name: "Retrieve Test Transaction",
      category: "Sample Category",
      items: [],
      totalPrice: 0,
      userId: new ObjectId(),
      tax: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    const foundTransaction = await Transaction.getTransactionById(newTransaction.insertedId);
    expect(foundTransaction.name).toBe("Retrieve Test Transaction");
  });
});
