import { NextResponse } from 'next/server';
import dbConnect from "@/lib/dbConnect";
import { UserModel,ImageModel } from "@/model/schema";
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
        const userDetail = await UserModel.findOne({username:user});
        const userId = userDetail._id;
        console.log(userId);
        const point = userDetail.images.length;
    
        let formData = await req.formData();
        let body = Object.fromEntries(formData);
        console.log(body)
    
    
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
        const image = new ImageModel({
            desc:body.desc,
            image:cloudinaryResponse.secure_url,
            owner:userId
        })
        await image.save();
        const u = await UserModel.findOneAndUpdate({ username: user }, { $push: { images: image._id }, $set:{ points:point/10} },{ new: true } );
        return NextResponse.json(u);
   
      } else {
        console.log('cloudinaryResponse is not an object or is null/undefined:', cloudinaryResponse);
      }
    
   
  } catch (error) {
    console.error('Error creating user:', error);
   return NextResponse.json({message: error})
  } 
}

export { handler as POST};


