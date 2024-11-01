require("dotenv").config();
const { ApolloServer } = require("@apollo/server");
const { verifyToken } = require("./helpers/jwt");
const {
  transactionTypeDefs,
  transactionResolvers,
} = require("./schema/transactionSchema");
const { userTypeDefs, userResolvers } = require("./schema/userSchema");
const {
  userTransactionTypeDefs,
  userTransactionResolvers,
} = require("./schema/userTransactionSchema");
const { startStandaloneServer } = require("@apollo/server/standalone");
const User = require("./models/User");

// definition and your set of resolvers.
const server = new ApolloServer({
  typeDefs: [userTypeDefs, transactionTypeDefs, userTransactionTypeDefs],
  resolvers: [userResolvers, transactionResolvers, userTransactionResolvers],
  introspection: true,
});

// Passing an ApolloServer instance to the `startStandaloneServer` function:
//  1. creates an Express app
//  2. installs your ApolloServer instance as middleware
//  3. prepares your app to handle incoming requests
startStandaloneServer(server, {
  listen: { port: process.env.PORT || 3000 },
  context: ({ req }) => {
    return {
      authentication: async () => {
        const { authorization } = req.headers;

        if (!authorization) {
          throw new Error("Unauthorized");
        }
        const [type, token] = authorization.split(" ");
        if (type !== "Bearer" || !type || !token) {
          throw new Error("Unauthorized");
        }
        const payload = verifyToken(token);

        const user = await User.getUserById(payload._id);

        if (!user) {
          throw new Error("Unauthorized");
        }
        return { user };
      },
    };
  },
}).then(({ url }) => {
  console.log(`🚀  Server ready at: ${url}`);
});
