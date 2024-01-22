import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import { UserModel } from "@/model/schema";
import jwt from 'jsonwebtoken';


  

async function handler(req:Request,{ params }:{ params : { user: string, password: string }}) {
    try{
    await dbConnect();
    
    const { user, password }  = params;
    if (!user || typeof user !== 'string') {
        return NextResponse.json({ message: 'Invalid user parameter' });
      }

   
    const u = await UserModel.findOne({
      username : user,
      password:password
    });
    console.log(u)
    if (u) {
      // Create a JWT token
      const token = jwt.sign({ userId: u._id, username: u.username }, process.env.JWT_SECRET!, {
        expiresIn: '1h', // Token expiration time
      });

      return NextResponse.json({ token: token });
    } else {
      return NextResponse.json({ message: 'Wrong username or password' });
    }
     
  
}
catch(err){
    return NextResponse.json(err);
}
}

export { handler as GET }