import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import { ImageModel } from "@/model/schema";
const { GoogleGenerativeAI } = require("@google/generative-ai");
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const modelName = "gemini-pro-vision";
// Converts local file information to a GoogleGenerativeAI.Part object.


async function imageToGenerativePath(url: string, mimeType: string) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch image from ${url}: ${response.statusText}`);
  }
  
  const imageData = await response.arrayBuffer(); 
  const buffer = Buffer.from(imageData); 
  const base64ImageData = buffer.toString('base64'); 

  return {
    inlineData: {
      data: base64ImageData,
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
async function generateContent(url: string) {
  // For text-and-image input (multimodal), use the gemini-pro-vision model
  const model = genAI.getGenerativeModel({ model: modelName });

  const prompt = `tell me name,
    details,
    where_to_find,
    growing_season,
    time_to_become_a_tree of the plant in this image in json format`;

  const imageParts = [await imageToGenerativePath(url, "image/jpeg")];
  console.log(imageParts);

  const result = await model.generateContent([prompt, ...imageParts]);
  const response = await result.response;
  const text = response.text();
  console.log(text);
  return text;
}

const handler = async (req: Request, { params }:{ params: { image: string }}) => {
  const image = params.image;
  if (!image || typeof image !== 'string') {
    return NextResponse.json({ message: 'Invalid image parameter' });
  }


  try {
    // get file from request
    // store file in public folder
    // get file path

    await dbConnect();
    const images = await ImageModel.findById(image);
    const cloudinaryUrl = images.image;
    const data = await generateContent(cloudinaryUrl);
    console.log(data)
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
    }, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET,PUT,PATCH,POST,DELETE',
        'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept',
      },
  });
  } catch (error) {
    console.log(error);
    return NextResponse.json({
      message: "Failed",
      data: JSON.stringify(error),
    }, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET,PUT,PATCH,POST,DELETE',
        'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept',
      },
  });
  }
};
export { handler as GET, handler as POST };