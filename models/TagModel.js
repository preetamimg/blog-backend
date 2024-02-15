import mongoose from "mongoose";

const TagSchema = mongoose.Schema({
  tagName: {
    type: String,
    required: true
  }
}, {timestamps: true})

const TagModel = mongoose.model('tag', TagSchema)
export default TagModel