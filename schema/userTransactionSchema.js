const UserTransaction = require("../models/UserTransaction");

const userTransactionTypeDefs = `#graphql
type UserTransaction {
  _id: ID
  name: String
  items: [Item]
  totalPrice: Float
  userId: ID
  transactionId:ID
  createdAt: String
  updatedAt: String
}
type Item {
  name: String
  price: Float
  quantity: Int
}

type Query {
getUserTransactions: [UserTransaction]
getUserTransactionById(_id: ID): UserTransaction
}
type Mutation {
createUserTransaction(
    
    name: String
    items: [ItemInput]
    transactionId:ID
    userId: ID
): UserTransaction
createUserTransactionMany(
    userTransactions: [UserTransactionInput]
): String
updateUserTransaction(
    _id: ID
    name: String
    items: [ItemInput]
    totalPrice: Int
    transactionId:ID
    userId: ID

): UserTransaction

deleteUserTransaction(_id: ID): UserTransaction
}
input UserTransactionInput {
name: String
items: [ItemInput]
totalPrice: Float
transactionId:ID
userId: String
}

input ItemInput {
name: String!
price: Float!
quantity: Int!
}
`;

const userTransactionResolvers = {
  Query: {
    getUserTransactions: async (_, args, contextValue) => {
      await contextValue.authentication();
      const data = await UserTransaction.getUserTransactions();
      return data;
    },
    getUserTransactionById: async (_, args, contextValue) => {
      await contextValue.authentication();
      const data = await UserTransaction.getUserTransactionById(args._id);
      return data;
    },
  },
  Mutation: {
    createUserTransaction: async (_, args, contextValue) => {
      await contextValue.authentication();
      const { items, userId, transactionId, totalPrice } = args;

      try {
        const data = await UserTransaction.createUserTransaction({
          items,
          userId,
          transactionId,
          totalPrice,
        });

        return data;
      } catch (error) {
        console.error("Error creating user transaction:", error);
        throw new Error("Failed to create user transaction");
      }
    },
    createUserTransactionMany: async (_, args, contextValue) => {
      await contextValue.authentication();
      const { userTransactions } = args;

      if (!Array.isArray(userTransactions)) {
        throw new Error("userTransactions must be an array");
      }
      // console.log(userTransactions, "userTransactions");

      await UserTransaction.createManyUserTransaction(userTransactions);

      // Ensure that the return value is iterable
      return "Succesfully Created"; // Wrap in array if not already
    },

    updateUserTransaction: async (_, args, contextValue) => {
      await contextValue.authentication();
      const { _id, name, items, totalPrice, userId } = args;

      const data = await UserTransaction.getUserTransactionById(_id);
      if (!data) {
        throw new Error("UserTransaction not found");
      }
      const updateUserTransaction = {
        _id,
        name,
        items,
        totalPrice,
        userId,
      };
      await UserTransaction.updateUserTransaction(updateUserTransaction);
      return data;
    },

    deleteUserTransaction: async (_, args, contextValue) => {
      await contextValue.authentication();
      const { _id } = args;
      const data = await UserTransaction.getUserTransactionById(_id);
      if (!data) {
        throw new Error("UserTransaction not found");
      }
      await UserTransaction.deleteUserTransaction(_id);
      return data;
    },
  },
};
module.exports = {
  userTransactionTypeDefs,
  userTransactionResolvers,
};
