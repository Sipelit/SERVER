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
const { geminiType, geminiResolvers } = require("./schema/gemini");

const server = new ApolloServer({
  typeDefs: [userTypeDefs, transactionTypeDefs, userTransactionTypeDefs, geminiType],
  resolvers: [userResolvers, transactionResolvers, userTransactionResolvers,geminiResolvers],
  introspection: true,
});

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


module.exports = { server };