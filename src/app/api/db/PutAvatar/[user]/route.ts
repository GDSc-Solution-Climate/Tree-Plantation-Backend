import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import { UserModel } from "@/model/schema";
import { v2 as cloudinary } from 'cloudinary';


cloudinary.config({ 
  cloud_name: process.env.CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET
});

export const config = {
  api: {
    bodyParser: false,
  },
};

async function handler(req: Request,{ params }: { params: { user: string } }) {
  try {
    await dbConnect();
    const user = params.user;

    if (!user || typeof user !== 'string') {
      return NextResponse.json({ message: 'Invalid user parameter' });
    }

    let formData = await req.formData();
    let body = Object.fromEntries(formData);


    const imageFile = body.filePath as File;

    // Validate file existence
    if (!imageFile) {
      return NextResponse.json({ error: 'Image file not found.' });
    }

   
    const arrayBuffer = await imageFile.arrayBuffer();
    const buffer = new Uint8Array(arrayBuffer);

    
   
    const cloudinaryResponse: Record<string, any> = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream({}, function (error, result) {
        if (error) {
          reject(error);
        } else {
          resolve(result!);
        }
      }).end(buffer);
    });
    


    if (typeof cloudinaryResponse === 'object' && cloudinaryResponse !== null) {
      console.log('cloudinaryResponse is an object:', cloudinaryResponse);
      const u = await UserModel.findOneAndUpdate({ username: user }, { $set: { avatar: cloudinaryResponse.secure_url } },  { new: true } );
      return NextResponse.json(u);
 
    } else {
      console.log('cloudinaryResponse is not an object or is null/undefined:', cloudinaryResponse);
    }
  

  } catch (err) {
    console.error(err);
    return  NextResponse.json({ error: 'Internal Server Error' });
  }
}

export { handler as PUT };
