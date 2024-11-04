// Make sure to include these imports:
// import { GoogleGenerativeAI } from "@google/generative-ai";
const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config();

const geminiType = `#graphql
type gemini {
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
type Query{
    gemini(location:String):gemini
}
`;

const geminiResolvers = {
  Query: {
    gemini: async (_, args, contextValue) => {
      const location = args.location;
      const genAI = new GoogleGenerativeAI(process.env.GOOGLE_KEY_GEMINIAI);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

      const prompt = `please make a transaction with the following data: ${location}
      Respond only in JSON format, structured as follows:
  {
        "_id": "67287f31cca8170991cbf655",
        "name": "Nasi Uduk Emak",
        "tax": 10,
        "totalPrice": 28600.000000000004,
        "userId": "6720cac36378aea6ee1b401f",
        "createdAt": "2024-11-04T08:00:49.472Z",
        "updatedAt": "2024-11-04T08:00:49.472Z",
        "category": "Food",
        "items": [
          {
            "name": "Nasi Uduk",
            "price": 13000,
            "quantity": 2
          }
        ],
        "userTransaction": {}
      },
`
      console.log({ prompt });
      try {
        const result = await model.generateContent(prompt);
        console.log(result.response.text().trim(), "ini respone");

        return JSON.parse(result.response.text().trim());
      } catch (error) {
        console.log(error, "erorrdi");
      }
    },
  },
};
module.exports = {
  geminiResolvers,
  geminiType,
};
