// Make sure to include these imports:
// import { GoogleGenerativeAI } from "@google/generative-ai";
const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config();

const geminiType = `#graphql
type Query{
    gemini(location:String):String
}
`;

const geminiResolvers = {
  Query: {
    gemini: async (_, args, contextValue) => {
      const location = args.location;
      const genAI = new GoogleGenerativeAI(process.env.GOOGLE_KEY_GEMINIAI);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

      const prompt = `Please provide a recommendation of three different types of plants suitable for growing in ${location}. Each recommendation should include:
- "name": The plant's name.
- "imageUrl": A URL linking to an image of the plant.
- "type": The type of plant (e.g., herb, flowering plant, tree).
- "description": A brief description of the plant.

The response should be structured in plain text JSON format without code block markers or escape characters, like this:
[
  { "name": "Plant Name 1", "imageUrl": "https://example.com/image1.jpg", "type": "Type 1", "description": "Description 1" },
  { "name": "Plant Name 2", "imageUrl": "https://example.com/image2.jpg", "type": "Type 2", "description": "Description 2" },
  { "name": "Plant Name 3", "imageUrl": "https://example.com/image3.jpg", "type": "Type 3", "description": "Description 3" }
]

Return the response as a single JSON string.`;
      console.log({ prompt });
      try {
        const result = await model.generateContent(prompt);
        console.log(result.response.text(), "ini respone");

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
