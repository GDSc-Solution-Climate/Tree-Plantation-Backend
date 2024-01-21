import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import { ImageModel , UserModel } from "@/model/schema";

async function handler(req:Request,{ params }:{ params : { user: string }}) {
    try{
    await dbConnect();
    
    const user  = params.user;
    if (!user || typeof user !== 'string') {
        return NextResponse.json({ message: 'Invalid user parameter' });
      }

   
    const u = await UserModel.findOne({
      username: user
    });

    const images = u;
      
     
      return  NextResponse.json(images);
}
catch(err){
    return NextResponse.json(err);
}
}

export { handler as GET }