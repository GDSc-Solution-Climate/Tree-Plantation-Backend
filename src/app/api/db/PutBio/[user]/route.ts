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

     
      return  NextResponse.json(u);
}
catch(err){
    return NextResponse.json(err);
}
}

export { handler as PUT }