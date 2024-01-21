import { readFileSync } from "fs";
import { NextResponse } from "next/server";

const { GoogleGenerativeAI } = require("@google/generative-ai");
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const modelName = "gemini-pro-vision";
// Converts local file information to a GoogleGenerativeAI.Part object.
function fileToGenerativePart(path: string, mimeType: string) {
  return {
    inlineData: {
      data: Buffer.from(readFileSync(path)).toString("base64"),
      mimeType,
    },
  };
}
const convertStringToJSON = (str: string) => {
  try {
    if (!str) {
      throw new Error("no data to convert to json. in convertStringToJSON");
    }
    const jsonString = str;
    const cleanedString = jsonString.replace(/```json\n|```/gi, "");
    // write to json file
    const obj = JSON.parse(cleanedString);
    return obj;
  } catch (error) {
    console.log("error in convertStringToJSON ", error);
    throw error;
  }
};
async function generateContent(filePath: string) {
  // For text-and-image input (multimodal), use the gemini-pro-vision model
  const model = genAI.getGenerativeModel({ model: modelName });

  const prompt = `tell me name,
    details,
    where_to_find,
    growing_season,
    time_to_become_a_tree of the plant in this image in json format`;

  const imageParts = [fileToGenerativePart(filePath, "image/png")];

  const result = await model.generateContent([prompt, ...imageParts]);
  const response = await result.response;
  const text = response.text();
  console.log(text);
  return text;
}

const handler = async (req: Request, res: Response) => {
  try {
    // get file from request
    // store file in public folder
    // get file path
    const data = await generateContent("./public/plant.jpg");
    // delete file after processing
    let output = data;
    try {
      output = convertStringToJSON(data);
    } catch (error) {
      output = data;
    }
    return NextResponse.json({
      message: "Success",
      data: output,
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json({
      message: "Failed",
      data: JSON.stringify(error),
    });
  }
};
export { handler as GET, handler as POST };
