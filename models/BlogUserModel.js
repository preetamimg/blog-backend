import mongoose from "mongoose";

const blogUserSchema = new mongoose.Schema({
  userName : {
    type: String,
    required: true
  },
  profilePicture: String,
  coverPicture: String,
  about: String,
  livesIn: String,
  worksAt: String,
},
{timestamps: true}
)

const BlogUserModel = mongoose.model('BlogUser', blogUserSchema);
export default BlogUserModel