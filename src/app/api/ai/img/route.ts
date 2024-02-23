import { NextResponse } from "next/server";
const  sharp  = require("sharp");
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


async function generateContent(buffer: any,prompt:string) {
  // For text-and-image input (multimodal), use the gemini-pro-vision model
  const model = genAI.getGenerativeModel({ model: modelName });

  const imageParts = [await fileToGenerativePath(buffer, "image/jpeg")];

  const result = await model.generateContent([prompt, ...imageParts]);
  const response = await result.response;
  const text = response.text();
  return text;
}

const handler = async (req: Request ) => {

  let formData = await req.formData();
  let body = Object.fromEntries(formData);
  const prompt = body.prompt as string;
  const path = body.filePath as File;

  // Validate file existence
  if (!path) {
    return NextResponse.json({ error: 'Image file not found.' });
  }
  const arrayBuffer = await path.arrayBuffer();
  let buffer = new Uint8Array(arrayBuffer);
  let imageSizeInMB = buffer.length/(1024*1024);

   console.log("first : " + imageSizeInMB)
   console.log(buffer);

  if ( path.size  > 4*1024*1024) {
     buffer = await sharp(buffer)
      .resize({ width: 1024, height: 1024 })
      .toBuffer();
     imageSizeInMB = buffer.length / (1024 * 1024); // Convert bytes to MB
     console.log(imageSizeInMB + " after resizing");
     console.log(buffer);
    
  }

  try {
    console.log("inside try : "+imageSizeInMB)
    const data = await generateContent(buffer,prompt);
    
    return NextResponse.json({
      message: "Success",
      data: data,
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