import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  userName : {
    type: String
  },
  email : {
    type: String,
    required: true
  },
  password : {
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

const UserModel = mongoose.model('User', userSchema);
export default UserModel