const { db } = require("../config/mongoDB");
const { hashPass, comparePass } = require("../helpers/bcrypt");
const { signToken } = require("../helpers/jwt");
const { isEmail } = require("validator");
const jwt = require("jsonwebtoken");
const Follow = require("../models/Follow");
const User = require("../models/user");

const userTypeDefs = `#graphql
  type User {
    _id:ID
    name: String
    username: String!
    email: String!
    password: String!
    profilePicture: String
    total: Int
  }
  type Query {
    getUsers: [User]
    getUserById(_id: ID): User
    getUserByName(name: String): User
    getUserByUsername(username: String!): User
  }

  type responseLogin{
  token:String
  username:String
}
  type Mutation {

  register(
    name: String,
    username: String,
    email: String,
    password: String,
    ): String

  login(
    username: String,
    password: String,
    ): responseLogin

}
  `;

const userResolvers = {
  Query: {
    getUsers: async (_, args, contextValue) => {
      await contextValue.authentication();

      const users = User.getUsers();
      return users;
    },
    getUserById: async (_, args, contextValue) => {
      await contextValue.authentication();
      const userId = args._id;
      console.log("🚀 ~ getUserById: ~ userId:", userId);

      const data = await User.getUserById(userId);
      data.followers = await Follow.getFollowers(userId);
      data.followings = await Follow.getFollowing(userId);

      if (!userId) {
        throw new Error("USER NOT FOUND");
      }

      return data;
    },
    getUserByName: async (_, args, contextValue) => {
      await contextValue.authentication();
      const { name } = args;
      const userName = await User.getUserByName(name);

      if (!userName) {
        throw new Error("USER NOT FOUND");
      }
      return userName;
    },
    getUserByUsername: async (_, args) => {
      await contextValue.authentication();
      const { username } = args;
      const data = await User.getUserByUsername(username);

      if (!data) {
        throw new Error("USER NOT FOUND");
      }
      return data;
    },
  },
  Mutation: {
    register: async (parent, args, contextValue, info) => {
      let { name, username, email, password } = args;

      if (!name) {
        throw new Error("Name is required");
      }

      if (!username) {
        throw new Error("Username is required");
      }

      if (!email) {
        throw new Error("Email is required");
      }

      if (!isEmail(email)) {
        throw new Error("Email is invalid");
      }

      if (!password) {
        throw new Error("Password is required");
      }

      if (password.length < 5) {
        throw new Error("Password must be at least 5 characters");
      }

      password = hashPass(password);
      const newUser = { name, username, email, password };
      await User.register(newUser);

      return "You're all set! Registration is complete";
    },

    login: async (_, args) => {
      const { username, password } = args;

      if (!username) {
        throw new Error("Username is required");
      }

      if (!password) {
        throw new Error("Password is required");
      }

      const getUsername = await User.getUserByUsername(username);

      if (!getUsername) {
        throw new Error("Invalid username or password");
      }

      const validPass = await comparePass(password, getUsername.password);
      if (!validPass) {
        throw new Error("Invalid username or password");
      }

      const token = signToken({ _id: getUsername._id });

      const form = {
        token,
        username: getUsername.username,
      };
      await User.login(getUsername);
      return form;
    },
  },
};
module.exports = { userTypeDefs, userResolvers };
