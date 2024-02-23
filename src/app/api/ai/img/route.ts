import { NextResponse } from "next/server";
const  sharp  = require("sharp");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const modelName = "gemini-pro-vision";
// Converts local file information to a GoogleGenerativeAI.Part object.

function base64ArrayBuffer(arrayBuffer:Buffer) {
  var base64    = ''
  var encodings = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'

  var bytes         = new Uint8Array(arrayBuffer)
  var byteLength    = bytes.byteLength
  var byteRemainder = byteLength % 3
  var mainLength    = byteLength - byteRemainder

  var a, b, c, d
  var chunk

  // Main loop deals with bytes in chunks of 3
  for (var i = 0; i < mainLength; i = i + 3) {
    // Combine the three bytes into a single integer
    chunk = (bytes[i] << 16) | (bytes[i + 1] << 8) | bytes[i + 2]

    // Use bitmasks to extract 6-bit segments from the triplet
    a = (chunk & 16515072) >> 18 // 16515072 = (2^6 - 1) << 18
    b = (chunk & 258048)   >> 12 // 258048   = (2^6 - 1) << 12
    c = (chunk & 4032)     >>  6 // 4032     = (2^6 - 1) << 6
    d = chunk & 63               // 63       = 2^6 - 1

    // Convert the raw binary segments to the appropriate ASCII encoding
    base64 += encodings[a] + encodings[b] + encodings[c] + encodings[d]
  }

  // Deal with the remaining bytes and padding
  if (byteRemainder == 1) {
    chunk = bytes[mainLength]

    a = (chunk & 252) >> 2 // 252 = (2^6 - 1) << 2

    // Set the 4 least significant bits to zero
    b = (chunk & 3)   << 4 // 3   = 2^2 - 1

    base64 += encodings[a] + encodings[b] + '=='
  } else if (byteRemainder == 2) {
    chunk = (bytes[mainLength] << 8) | bytes[mainLength + 1]

    a = (chunk & 64512) >> 10 // 64512 = (2^6 - 1) << 10
    b = (chunk & 1008)  >>  4 // 1008  = (2^6 - 1) << 4

    // Set the 2 least significant bits to zero
    c = (chunk & 15)    <<  2 // 15    = 2^4 - 1

    base64 += encodings[a] + encodings[b] + encodings[c] + '='
  }
  
  return base64
}
function fileToGenerativePath(buffer:any, mimeType:string) {
    const base64String = base64ArrayBuffer(buffer);
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