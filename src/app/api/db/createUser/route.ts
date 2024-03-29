import { NextResponse } from 'next/server';
import dbConnect from "@/lib/dbConnect";
import { UserModel } from "@/model/schema";

async function handler(req: Request) {

  await dbConnect();
    const {  email,  username,password } =  await req.json()
      try {
    const user = new UserModel({
    email ,username, password
    });
    await user.save();
    return NextResponse.json(user, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET,PUT,PATCH,POST,DELETE',
        'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept',
      },
      })
  } catch (error) {
    console.error('Error creating user:', error);
   return NextResponse.json({message: error})
  } 
}

export { handler as POST};


