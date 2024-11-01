const UserTransaction = require("../models/UserTransaction");

const userTransactionTypeDefs = `#graphql
type UserTransaction {
  _id: ID
  name: String
  items: [Item]
  totalPrice: Int
  userId: ID
  createdAt: String
  updatedAt: String
}
type Item {
  name: String
  price: Int
  quantity: Int
}
type Query {
getUserTransactions: [UserTransaction]
getUserTransactionById(_id: ID): UserTransaction
}
type Mutation {
createUserTransaction(
    _id: ID
    name: String
    items: [ItemInput]
    userId: ID
): UserTransaction
updateUserTransaction(
    _id: ID
    name: String
    items: [ItemInput]
    totalPrice: Int
    userId: ID

): UserTransaction

deleteUserTransaction(_id: ID): UserTransaction
}

input ItemInput {
name: String
price: Int
quantity: Int
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
      const { items, userId, totalPrice } = args;

      const data = await UserTransaction.createUserTransaction({
        items,
        userId,
        totalPrice,
      });

      return data;
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
