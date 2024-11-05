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
    gemini(input:String):gemini
}
`;

const geminiResolvers = {
  Query: {
    gemini: async (_, args, contextValue) => {
      const input = args.input;
      const genAI = new GoogleGenerativeAI(process.env.GOOGLE_KEY_GEMINIAI);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

      const prompt = `please make a transaction with the following data: ${input}
      Format the response as JSON like this:
{
  "name": "Transaction Name",
  "tax": tax (numeric),
  "totalPrice": Overall Total (numeric),
  "userId": "User ID",
  "createdAt": "Date and Time in ISO 8601 format",
  "updatedAt": "Date and Time in ISO 8601 format",
  "category": "Transaction Category",
  "items": [
    {
      "name": "Item Name",
      "price": Price per 1 item (numeric),
      "quantity": Quantity (numeric)
      "totalPrice": Total Price per item
       (numeric)
    },
    ...
  ],
}

Ensure all monetary values are formatted as numbers without currency symbols. Return only the JSON object with no extra text or code block markers.

`;
      try {
        const result = await model.generateContent(prompt);
        console.log(JSON.parse(result.response.text().trim()));

        return JSON.parse(result.response.text().trim());
      } catch (error) {
        console.log(error);
      }
    },
  },
};
module.exports = {
  geminiResolvers,
  geminiType,
};
