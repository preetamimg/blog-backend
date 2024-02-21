import mongoose from "mongoose";

const blogSchema = new mongoose.Schema({
  title : {
    type: String,
    required: true
  },
  shortDesc : {
    type: String,
    required: true
  },
  description : {
    type: String,
    required: true
  },
  image : {
    type: String,
    required: true
  },
  imgAltTag : {
    type: String,
    required: true
  },
  categories : {
    type: Array,
    required: true
  },
  tags : {
    type: Array,
    required: true
  },
  slugUrl : {
    type: String,
    required: true
  },
  author : {
    type: Array,
    required: true
  },
  date : {
    type: Date,
    default: Date.now,
  },
  metaTitle : {
    type: String,
    required: true
  },
  metaDesc : {
    type: String,
    required: true
  },
  show : {
    type: Boolean,
    default: true
  },
  showComments : {
    type: Boolean,
    default: true
  }

},
{timestamps: true}
)

const BlogModel = mongoose.model('Blog', blogSchema);
export default BlogModel