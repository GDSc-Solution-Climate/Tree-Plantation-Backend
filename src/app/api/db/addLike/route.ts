import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import { UserModel,ImageModel,LikeModel } from "@/model/schema";

async function handler(req: Request) {
  await dbConnect();

  const { userId, imageId } = await req.json();


  try {
 
    console.log("started");
    // Find the user
    const image = await ImageModel.findOne({ _id: imageId });
    const user = await UserModel.findOne({ username: userId});

    if (!image || !user) {
      return NextResponse.json({ message: 'Image or user not found' });
    }

   
    const like = new LikeModel({
        user: user._id,
        image: image._id
    })
    await like.save();
    const updatedProject = await ImageModel.findOneAndUpdate(
        { _id: image._id },
        {
          $inc: { likeCount: 1 }, // Increment likesCount
         
        },
        { new: true } // Return the updated document
      );
   
console.log("done");
    return NextResponse.json({
      message: 'Project Liked successfully',
       user: updatedProject,
    }, {
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