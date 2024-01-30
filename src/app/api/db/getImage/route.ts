import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import { ImageModel } from "@/model/schema";

async function handler(req: Request) {
    try{
    await dbConnect();

    const user = await ImageModel.find();
    return  NextResponse.json(user, {
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