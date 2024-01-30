import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import { UserModel, ImageModel, LikeModel } from "@/model/schema";

async function handler(req: Request) {
  await dbConnect();

  const { userId, imageId} = await req.json();

  try {
    console.log("started");
    // Find the user
    const project = await ImageModel.findOne({ _id: imageId });
    const user = await UserModel.findOne({ username: userId });

    if (!project || !user) {
      return NextResponse.json({ message: 'Project or user not found' });
    }

    // Check if the user has already liked the project
    const existingLike = await LikeModel.findOne({ user: user._id, image: project._id });

    if (existingLike) {
      // If remove is true and the like exists, remove the like
      await LikeModel.findByIdAndDelete(existingLike._id);

      // Update the project's likesCount and likesArray
      const updatedProject = await ImageModel.findOneAndUpdate(
        { _id: project._id },
        {
          $inc: { likeCount: -1 }, // Decrement likesCount
        
        },
        { new: true } // Return the updated document
      );

      console.log("done");

      return NextResponse.json({
        message: 'Like removed successfully',
        project: updatedProject,
      }, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET,PUT,PATCH,POST,DELETE',
          'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept',
        },
    });
    } else if ( !existingLike) {
      // If remove is false and the like doesn't exist, add the like
    

  
      return NextResponse.json({
        message: 'Like not found',
       
      });
    } else {
      return NextResponse.json({ message: 'Invalid operation' });
    }
  } catch (error) {
    console.error('Error handling like:', error);
    return NextResponse.json({ message: 'Internal Server Error' });
  }
}

export { handler as POST };