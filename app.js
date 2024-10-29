require("dotenv").config();
const { ApolloServer } = require("@apollo/server");
const { startStandaloneServer } = require("@apollo/server/standalone");

const { verify } = require("jsonwebtoken");
const User = require("./models/user");

const server = new ApolloServer({
  typeDefs: [transactionTypeDefs, userTypeDefs, userTransactionTypeDefs],
  resolvers: [transactionRe],
  introspection: true,
});

startStandaloneServer(server, {
  listen: { port: process.env.PORT || 3000 },
//   context: ({ req }) => {
//     return {
//       auth: async () => {
//         const { authorization } = req.headers;

//         if (!authorization) throw new Error("Invalid Token");

//         const [type, token] = authorization.split(" ");
//         if (!type || !token || type !== "Bearer")
//           throw new Error("Invalid Token");
//         const secret = process.env.JWT_TOKEN;
//         const payload = verify(token, secret);
//         console.log(payload, "???");
//         const user = await User.findById(payload._id);

//         if (!user) throw new Error("Invalid Token");

//         return { user };
//       },

//       adminOnly(id) {},
//     };
//   },
}).then(({ url }) => {
  console.log(`🚀  Server ready at: ${url}`);
});
