import { NextResponse } from "next/server";
const { GoogleGenerativeAI } = require("@google/generative-ai");
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const modelName = "gemini-pro-vision";
// Converts local file information to a GoogleGenerativeAI.Part object.


function fileToGenerativePath(buffer:any, mimeType:string) {
    const base64String = btoa(String.fromCharCode(...buffer));
    return {
      inlineData: {
        data: base64String,
        mimeType
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
async function generateContent(buffer: any,prompt:string) {
  // For text-and-image input (multimodal), use the gemini-pro-vision model
  const model = genAI.getGenerativeModel({ model: modelName });

  const imageParts = [await fileToGenerativePath(buffer, "image/jpeg")];
  console.log(imageParts);

  const result = await model.generateContent([prompt, ...imageParts]);
  const response = await result.response;
  const text = response.text();
  console.log(text);
  return text;
}

const handler = async (req: Request ) => {

  let formData = await req.formData();
  let body = Object.fromEntries(formData);
  console.log(body)
  const prompt = body.prompt as string;

  const path = body.filePath as File;

  // Validate file existence
  if (!path) {
    return NextResponse.json({ error: 'Image file not found.' });
  }
  const arrayBuffer = await path.arrayBuffer();
  const buffer = new Uint8Array(arrayBuffer);
console.log(buffer);

   

  try {

    const data = await generateContent(buffer,prompt);
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