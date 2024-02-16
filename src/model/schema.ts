import mongoose from "mongoose";
const { Schema } = mongoose;
mongoose.Promise = global.Promise;



const likeSchema = new Schema(
  {
    user: { type: mongoose.Types.ObjectId, ref: "User", required: true },
    image: { type: mongoose.Types.ObjectId, ref: "Image", required: true },
    // timestamp: { type: Date, default: Date.now },
  },
  { timestamps: true }
);
const commentSchema = new Schema({
    text: { type: String , required:true },
    creator:{ type: mongoose.Types.ObjectId, ref: "User", required: true }
},
{ timestamps: true }
)
const imageSchema = new Schema({
    desc: { type: String, required: true },
    owner: { type: mongoose.Types.ObjectId, ref: "User", required: true },
    image:{ type: String, required: true, default:""},
    reply:[ { type: mongoose.Types.ObjectId, ref: "Comment", required:false, default:[]}],
    likeCount:{ type:Number,default:0},
    parentImage: { type: mongoose.Types.ObjectId, ref: "Image", default: null }, // Reference to parent image
    childImages: [{ type: mongoose.Types.ObjectId, ref: "Image", default: [] }] // References to child images forming a thread

},
{ timestamps: true })

const userSchema = new Schema(
    {
     
      username: { type: String , required:true,unique:true},
      avatar: { type: String },
      bio: { type: String, maxlength: 180 }, 
      email: {
        type: String,
        validate: {
          validator: function (value: string) {
            return /\S+@\S+\.\S+/.test(value);
          },
          message: (props: any) => `${props.value} is not a valid email address!`,
        },
        required: function () {
          return (this as any).contactMethod === "email";
        },
      },
      password:{type:String, required:true},
      images: [ { type: mongoose.Types.ObjectId, ref: "Image", default: [] }],
      points:{type:Number, default:0}
  
    },
    { timestamps: true }
  );


 const UserModel = mongoose.models.User || mongoose.model("User", userSchema);

const LikeModel = mongoose.models.Like || mongoose.model("Like", likeSchema);

const ImageModel = mongoose.models.Image || mongoose.model("Image", imageSchema);

const CommentModel = mongoose.models.Comment || mongoose.model("Comment", commentSchema);

export { UserModel, LikeModel, ImageModel, CommentModel };