import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import { UserModel } from "@/model/schema";
import formidable from 'formidable';
import { v2 as cloudinary } from 'cloudinary';
import { NextApiRequest } from 'next';

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

async function handler(req: NextApiRequest, { params }: { params: { user: string } }) {
  try {
    await dbConnect();
    const user = params.user;

    if (!user || typeof user !== 'string') {
      return NextResponse.json({ message: 'Invalid user parameter' });
    }

    const form = new formidable.IncomingForm();

    form.parse(req, (err, fields, files) => {
      if (err) {
        return NextResponse.json({ error: 'Internal Server Error' });
      }
      console.log(err, fields, files);

      // const filePath = files.file.path;

      // cloudinary.uploader.upload(filePath, { public_id: "olympic_flag" }, function(error, result) {
      //   if (error) {
      //     console.error(error);
      //     return NextResponse.json({ error: 'Cloudinary Upload Error' });
      //   }

      //   console.log(result);
      //   // Handle the Cloudinary upload result here
      //   return NextResponse.json({ success: true, result });
      // });
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Internal Server Error' });
  }
}

export { handler as PUT };
