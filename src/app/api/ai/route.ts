const { GoogleGenerativeAI } = require("@google/generative-ai");
import { NextResponse } from "next/server";
// Access your API key as an environment variable (see "Set up your API key" above)
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);


async function handler(req:Request) {
  // For text-only input, use the gemini-pro model
  const model = genAI.getGenerativeModel({ model: "gemini-pro"});
  const { prompt } = await req.json();
  const result = await model.generateContent(prompt);
  const response = await result.response;
  const text = response.text();
  // Remove unnecessary parts and split by "\n\n"
const lines = text.split("\n\n");

// Extract plant names and descriptions
const plants = lines.map((line:string) => {
  const [name, description] = line.split("\n");
  return { name, description };
});


  return NextResponse.json( plants );
}

export { handler as GET , handler as POST }
