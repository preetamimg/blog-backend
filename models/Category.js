import mongoose from "mongoose";

const categorySchema = mongoose.Schema({
  categoryName: {
    type: String,
    required: true
  },
  image: {
    type: String,
    required: true
  }
}, {timestamps: true})

const CategoryModel = mongoose.model('category', categorySchema)
export default CategoryModel