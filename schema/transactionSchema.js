const Transaction = require("../models/Transaction");
const { updateTransaction } = require("../models/Transaction");

const transactionTypeDefs = `#graphql
type Transaction {
  _id: ID
  userTransaction: [User]
  name: String
  items: [Item]
  catogory:String
  tax: Int
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
getTransactions: [Transaction]
getTransactionById(_id: ID): Transaction
}
type Mutation {
createTransaction(
    _id: ID
    name: String
    userId: ID
    catogory:String
    items: [ItemInput]
    totalPrice: Int
    tax: Int
): Transaction
updateTransaction(
    _id: ID
    name: String
    catogory:String
    tax: Int
    userId: ID
    items: [ItemInput]
    totalPrice: Int
   
): Transaction
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
      // await contextValue.authentication();
      const data = await Transaction.getTransactions();

      return data;
    },
    getTransactionById: async (_, args, contextValue) => {
      // await contextValue.authentication();
      const _id = args._id;
      const data = await Transaction.getTransactionById(_id);
      return;
    },
  },

  Mutation: {
    createTransaction: async (_, args, contextValue) => {
      // await contextValue.authentication();
      
      
      const { name, catogory, items, totalPrice, userId, tax } = args;
    ;
     
      const data = await Transaction.createTransaction(
        {name,
        catogory,
        items,
        totalPrice,
        userId,
        tax}
      );
      
      
      return data;
    },

    updateTransaction: async (_, args, contextValue) => {
      await contextValue.authentication();
      const { _id, items, totalPrice } = args;
      const data = await Transaction.updateTransaction(_id, items, totalPrice);
      return data;
    },
  },
};
module.exports = {
  transactionTypeDefs,
  transactionResolvers,
};
