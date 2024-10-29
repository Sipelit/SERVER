const { transactionTypeDefs, transactionResolvers } = require("./schema/transactionSchema");
const { userTypeDefs, userResolvers } = require("./schema/userSchema");
const { userTransactionTypeDefs, userTransactionResolvers } = require("./schema/userTransactionSchema");

// definition and your set of resolvers.
const server = new ApolloServer({
  typeDefs: [userTypeDefs, transactionTypeDefs,userTransactionTypeDefs],
  resolvers: [userResolvers, transactionResolvers, userTransactionResolvers],
});

// Passing an ApolloServer instance to the `startStandaloneServer` function:
//  1. creates an Express app
//  2. installs your ApolloServer instance as middleware
//  3. prepares your app to handle incoming requests
const { url } = startStandaloneServer(server, {
  listen: { port: 3000 },
});

console.log(`🚀  Server ready at: ${url}`);
