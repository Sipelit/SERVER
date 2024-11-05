const { MongoClient, ObjectId } = require("mongodb");
const { db } = require("../config/mongodb");
const UserTransaction = require("../models/UserTransaction");

describe("UserTransaction Model", () => {
    let connection;
    let testDb;

    beforeAll(async () => {
        // Connect to the MongoDB server
        connection = await MongoClient.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        // Set the test database
        testDb = connection.db("SiPelit");
        UserTransaction.collection = testDb.collection("userTransaction");
    });

    afterAll(async () => {
        // Clean up the test database and close the connection
        await testDb.collection("userTransaction").deleteMany({});
        await connection.close();
    });

    describe("getUserTransactions", () => {
        it("should fetch all user transactions", async () => {
            const transactions = await UserTransaction.getUserTransactions();
            expect(Array.isArray(transactions)).toBe(true);
        });
    });

    describe("getUserTransactionById", () => {
        it("should fetch a user transaction by ID", async () => {
            const mockTransaction = {
                userId: new ObjectId(), // Make sure this is valid
                items: [{ name: "item1", price: 10, quantity: 1 }],
                transactionId: new ObjectId(),
                totalPrice: 10,
            };
            const { insertedId } = await UserTransaction.collection.insertOne(mockTransaction);
            const transaction = await UserTransaction.getUserTransactionById(insertedId.toString());
            expect(transaction).toMatchObject({
                _id: insertedId,
                userId: mockTransaction.userId,
                items: mockTransaction.items,
                transactionId: mockTransaction.transactionId,
                totalPrice: mockTransaction.totalPrice,
            });
        });
    });

    describe("createUserTransaction", () => {
        it("should create a new user transaction", async () => {
            const newTransaction = {
                userId: new ObjectId(),
                items: [{ name: "item1", price: 10, quantity: 1 }],
                transactionId: new ObjectId(),
                totalPrice: 10,
            };
            const createdTransaction = await UserTransaction.createUserTransaction(newTransaction);
            expect(createdTransaction).toMatchObject(newTransaction);
            expect(createdTransaction._id).toBeDefined(); // Ensure an ID was generated
        });
    });

    describe("createManyUserTransaction", () => {
        it("should create multiple user transactions", async () => {
            const newTransactions = [
                {
                    userId: new ObjectId(),
                    items: [{ name: "item1", price: 10, quantity: 1 }],
                    transactionId: new ObjectId(),
                    totalPrice: 10,
                },
                {
                    userId: new ObjectId(),
                    items: [{ name: "item2", price: 20, quantity: 2 }],
                    transactionId: new ObjectId(),
                    totalPrice: 40,
                },
            ];
            const result = await UserTransaction.createManyUserTransaction(newTransactions);
            expect(Array.isArray(result)).toBe(true); // Ensure it is an array
            expect(result).toHaveLength(newTransactions.length); // Ensure correct number

            // Verify that the created transactions exist in the database
            const transactionsInDb = await UserTransaction.getUserTransactions();
            expect(transactionsInDb.length).toBeGreaterThanOrEqual(newTransactions.length);
        });
    });

    describe("updateUserTransaction", () => {
        it("should update an existing user transaction", async () => {
            const mockTransaction = {
                userId: new ObjectId(),
                items: [{ name: "item1", price: 10, quantity: 1 }],
                transactionId: new ObjectId(),
                totalPrice: 10,
            };
            const { insertedId } = await UserTransaction.collection.insertOne(mockTransaction);
    
            const updatedTransaction = {
                _id: insertedId.toString(), // Ensure ID is string for the ObjectId constructor
                items: [{ name: "item1", price: 15, quantity: 1 }],
                totalPrice: 15,
                userId: mockTransaction.userId,
            };
    
            await UserTransaction.updateUserTransaction(insertedId.toString(), updatedTransaction.items, updatedTransaction.totalPrice, updatedTransaction.userId);
            const transaction = await UserTransaction.getUserTransactionById(insertedId.toString());
            expect(transaction).toMatchObject(updatedTransaction);
        });
    });
    
    describe("deleteUserTransaction", () => {
        it("should delete a user transaction", async () => {
            const mockTransaction = {
                userId: new ObjectId(),
                items: [{ name: "item1", price: 10, quantity: 1 }],
                transactionId: new ObjectId(),
                totalPrice: 10,
            };
            const { insertedId } = await UserTransaction.collection.insertOne(mockTransaction);
            await UserTransaction.deleteUserTransaction(insertedId.toString());
            const transaction = await UserTransaction.getUserTransactionById(insertedId.toString());
            expect(transaction).toBeNull(); // Expecting transaction to be deleted
        });
    });
});
