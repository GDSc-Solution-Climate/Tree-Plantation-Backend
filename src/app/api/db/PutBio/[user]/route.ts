import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import { UserModel } from "@/model/schema";

async function handler(req:Request,{ params }:{ params : { user: string }}) {
    try{
    await dbConnect();
    const { bio } = await req.json();
    const user  = params.user;
    if (!user || typeof user !== 'string') {
        return NextResponse.json({ message: 'Invalid user parameter' });
      }

   
      const u = await UserModel.findOneAndUpdate({ username: user }, { $set: { bio: bio } },  { new: true } );

     
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

export { handler as PUT }