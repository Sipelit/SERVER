const { updateTransaction } = require("../models/Transaction");

const transactionTypeDefs = `#graphql
type Transaction {
  _id: ID
  userTransaction: [User]
  name: String
  items: [Item]
  totalPrice: Int
  userId: ID
  createdAt: String
  updatedAt: String
}
type Query {
getTransactions: [Transaction]
getTransactionById(_id: ID): Transaction
}
type Mutation {
createTransaction(
    name: String
    userId: ID
): Transaction
updateTransaction(
    _id: ID
    items: [ItemInput]
    totalPrice: Int
   
): Transaction
}

input ItemInput {
name: String
price: Int
quantity: Int
}
input ItemInput {
name: String
price: Int
quantity: Int
}
`;

const transactionResolvers = {
  Query: {
    getTransactions: async (_, args, contextValue) => {
      await contextValue.authentication();
      const data = await Transaction.getTransactions();
      return data;
    },
    getTransactionById: async (_, args, contextValue) => {
      await contextValue.authentication();
      const _id = args._id;
      const data = await Transaction.getTransactionById(_id);
      return;
    },
  },

  Mutation: {
    createTransaction: async (_, args, contextValue) => {
      await contextValue.authentication();
      const { name, items, totalPrice, userId } = args;
      const data = await Transaction.createTransaction(
        name,
        items,
        totalPrice,
        userId
      );
      return data;
    },
  },

  updateTransaction: async (_, args, contextValue) => {
    await contextValue.authentication();
    const { _id, items, totalPrice } = args;
    const data = await Transaction.updateTransaction(
      _id,
      items,
      totalPrice
    );
    return data;
  }
};
