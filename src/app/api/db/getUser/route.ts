import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import { UserModel } from "@/model/schema";

async function handler(req: Request) {
    try{
    await dbConnect();

    const user = await UserModel.find();
    return  NextResponse.json(user);
    }
    catch(err){
        return NextResponse.json(err);
    }
}
export { handler as GET }