const redis = require("../config/redis");
const Transaction = require("../models/Transaction");

const transactionTypeDefs = `#graphql
type Transaction {
  _id: ID
  userTransaction: [UserTransaction]
  name: String
  items: [Item]
  category:String
  tax: Int
  totalPrice: Float
  userId: ID
  createdAt: String
  updatedAt: String
}
type Item {
  name: String
  price: Float
  quantity: Int
  totalPrice: Int
}
type Query {
getTransactions(userId:ID, name: String): [Transaction]
getTransactionById(_id: ID): Transaction 
getReceipt(_id: ID): Transaction
getTransactionByName(name: String): [Transaction]

}
type Mutation {
createTransaction(
    _id: ID
    name: String
    userId: ID
    category:String
    items: [ItemInput]
    totalPrice: Float
    tax: Int
): Transaction
updateTransaction(
    _id: ID
    name: String
    category:String
    tax: Int
    userId: ID
    items: [ItemInput]
    totalPrice: Float
   
): Transaction
}

input ItemInput {
name: String!
price: Float
quantity: Int
totalPrice: Float
}

`;
const CACHE_POST = "cache:posts";

const transactionResolvers = {
  Query: {
    getTransactions: async (_, args, contextValue) => {
      await contextValue.authentication();
      await redis.del(CACHE_POST);
      const cache = await redis.get(CACHE_POST);
      if (cache) {
        return JSON.parse(cache);
      }

      const data = await Transaction.getTransactions(args.userId, args.name);

      await redis.set(CACHE_POST, JSON.stringify(data));
      return data;
    },
    getTransactionById: async (_, args, contextValue) => {
      await contextValue.authentication();
      const _id = args._id;
      const data = await Transaction.getTransactionById(_id);
      return data;
    },
    getTransactionByName: async (_, args, contextValue) => {
      const { user } = await contextValue.authentication();
      const name = args.name;
      const data = await Transaction.getTransactionByName(name, user._id);

      return data;
    },
    getReceipt: async (_, args, contextValue) => {
      await contextValue.authentication();
      const _id = args._id;

      const data = await Transaction.getReceipt(_id);

      return data;
    },
  },

  Mutation: {
    createTransaction: async (_, args, contextValue) => {
      const { user } = await contextValue.authentication();

      const { name, category, items, totalPrice, tax } = args;
      if (!name) throw new Error("Transaction name is required.");
      if (!category) throw new Error("Category is required.");
      if (!Array.isArray(items) || items.length === 0) {
        throw new Error("At least one item is required.");
      }
      if (totalPrice === undefined || totalPrice <= 0) {
        throw new Error("Total price must be a positive number.");
      }
      const data = await Transaction.createTransaction({
        name,
        category,
        items,
        totalPrice,
        userId: user._id,
        tax,
      });

      await redis.del(CACHE_POST);
      return data;
    },

    updateTransaction: async (_, args, contextValue) => {
      await contextValue.authentication();

      const { _id, name, items, totalPrice, catagory } = args;
      const data = await Transaction.updateTransaction(
        _id,
        name,
        items,
        totalPrice,
        catagory
      );

      return data;
    },
  },
};
module.exports = {
  transactionTypeDefs,
  transactionResolvers,
};
