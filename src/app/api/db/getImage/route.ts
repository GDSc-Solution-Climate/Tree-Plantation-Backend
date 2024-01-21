import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import { ImageModel } from "@/model/schema";

async function handler(req: Request) {
    try{
    await dbConnect();

    const user = await ImageModel.find();
    return  NextResponse.json(user);
    }
    catch(err){
        return NextResponse.json(err);
    }
}
export { handler as GET }