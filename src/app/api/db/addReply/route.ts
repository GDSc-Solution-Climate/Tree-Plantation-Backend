import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import { UserModel, ImageModel, CommentModel } from "@/model/schema";

async function handler(req: Request) {
  await dbConnect();

  const { userId , text, imageId } = await req.json();


  try {
 
    console.log("started");
    // Find the user
    const user = await UserModel.findOne({ username: userId});
    if ( !user) {
        return NextResponse.json({ message: 'User not found' });
      }
    const comment = new CommentModel({
        creator:user._id,
        text:text
    })
    await comment.save();
  

   

   
        const update = await ImageModel.findOneAndUpdate({_id: imageId}, { $push:{reply:comment._id }},{ new: true })
        return NextResponse.json(update, {
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET,PUT,PATCH,POST,DELETE',
            'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept',
          },
  });

    
   
  


  } catch (error) {
    console.error('Error liking project for user:', error);
    return NextResponse.json({ message: 'Internal Server Error' });
  }
}

export { handler as POST };