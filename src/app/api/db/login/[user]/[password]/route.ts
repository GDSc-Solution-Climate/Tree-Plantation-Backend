import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import { UserModel } from "@/model/schema";
import { createHash } from 'crypto';

const generateToken = () => {
    // Use a more secure method for generating tokens, for example, crypto.randomBytes
    return createHash('sha256').update(Math.random().toString(36).substr(2)).digest('hex');
  };
  

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
      if(u){
       let token = generateToken();
       return  NextResponse.json({token: token});
      }
      else{
        return NextResponse.json({message:"Wrong username or password"})
      }
     
  
}
catch(err){
    return NextResponse.json(err);
}
}

export { handler as GET }