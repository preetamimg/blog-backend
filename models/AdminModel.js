import mongoose from "mongoose";

const adminSchema = new mongoose.Schema({
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
  isAdmin: {
    type: String,
    default: false
  },
  profilePicture: String,
  coverPicture: String,
  about: String,
  livesIn: String,
  worksAt: String,
},
{timestamps: true}
)

const AdminModel = mongoose.model('admin', adminSchema);
export default AdminModel