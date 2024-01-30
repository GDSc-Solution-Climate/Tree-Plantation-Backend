import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import { ImageModel } from "@/model/schema";

async function handler(req:Request,{ params }:{ params : { image: string }}) {
    try{
    await dbConnect();
    
    const image  = params.image;
    if (!image || typeof image !== 'string') {
        return NextResponse.json({ message: 'Invalid user parameter' });
      }

   
    const u = await ImageModel.findOne({
      _id : image
    });
      
     
      return  NextResponse.json(u, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET,PUT,PATCH,POST,DELETE',
          'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept',
        },
    });
}
catch(err){
    return NextResponse.json(err);
}
}

export { handler as GET }