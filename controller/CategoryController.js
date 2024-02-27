import AdminModel from "../models/AdminModel.js";
import BlogModel from "../models/BlogModel.js";
import CategoryModel from "../models/Category.js";
import UserModel from "../models/UserModel.js";
import {IMG_URL} from './../constants.js'

export const addCategory = async (req, res) => {
  const { categoryName } = req.body;
  const {id} = req.auth



  try {
    const user = await AdminModel.findOne(
      { _id: id},
      { isAdmin: 1 }
    );

    // findOne humesha objects lega... 
    // first object m jiske bases pr find krna h, 
    // dusre object m us setail m s apn ko kya kya chyche aur 
    // third function hota h jo aage dekhege

    if (user?.isAdmin) {
      const ifCategoryExists = await CategoryModel.findOne({
        categoryName: categoryName,
      });
      if (ifCategoryExists) {
        const { image } = req?.files;
        fs.unlink(image[0].path, (err) => {
          if (err) console.log("error while removing image");
          console.log("image removed successfully.");
        });
        res.status(500).json({ message: "category already exists" });
      } else {
        const image = req?.files["image"]?.[0]?.filename ? req?.files["image"]?.[0]?.filename : '';
        
        const newCategory = new CategoryModel({
          categoryName: categoryName,
          image: IMG_URL + image ,
        });
        const saveCategory = await newCategory.save();
        const data = {
          success: true,
          message: "category added successfully" 
        }
        res.status(200).json({data});
      }
    } else {
      res.status(500).json({ message: "access denied" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllCategories = async (req, res) => {
    
  try {

    const allBlogs = await BlogModel.find()

    const categories = await CategoryModel.find();

    const categoriesWithCount = categories.map(category=>{
      const categoryBlogs = allBlogs.filter(blog=>blog?.categories?.includes(category?.categoryName));
      return {
        ...category?._doc,
        blogCount: categoryBlogs.length,
      }
    })

    const sortedData = categoriesWithCount?.sort((a,b)=>b.createdAt - a.createdAt)

    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || sortedData?.length;

    // Calculate start and end indexes for the paginated data
    const startIndex = (page - 1) * pageSize;
    const endIndex = page * pageSize;

    const paginatedData = sortedData.slice(startIndex, endIndex);
    const totalPages = Math.ceil(sortedData?.length / pageSize)
    const result = {
      data : paginatedData,
      success: true,
      pagination: {
        page: page,
        pageSize: pageSize,
        totalPages: totalPages,
        totalItems: sortedData?.length,
      }
    }
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteCategory = async (req, res) => {
  const categoryId = req.query.categoryId;
  const {id} = req.auth
  try {
    const user = await AdminModel.findOne(
      { _id: id },
      { isAdmin: 1 }
    );

    if(user?.isAdmin) {
      const category = await CategoryModel.findById(categoryId);
      if (category) {
        await category.deleteOne();
        const data = {
          status: true,
          message: "category deleted successfully"
        }
        res.status(200).json({data });
      } else {
        res.status(500).json({ message: "category not exists" });
      }
    }else {
      res.status(500).json({ message: "access denied" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateCategory = async (req, res) => {
  const categoryId = req.query.categoryId;
  const {id} = req.auth
  try {
    const user = await AdminModel.findOne(
      { _id: id },
      { isAdmin: 1 }
    );

    if(user?.isAdmin) {
      const category = await CategoryModel.findById(categoryId);
      if (category) {
        const { _id, ...updatedData } = req.body;
        const updatedCategory = await CategoryModel.findByIdAndUpdate(categoryId, updatedData, {new : true});
        
        res.status(200).json({ message: "category updated successfully", updatedCategory });
      } else {
        res.status(500).json({ message: "category not exists" });
      }
    }else {
      res.status(500).json({ message: "access denied" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getSingleCategory = async (req, res) => {
  const catId = req.query.id;

  try {
    const category = await CategoryModel.findOne({_id: catId});
    if(category) {
      const result = {
        data : category,
        success: true
      }
      res.status(200).json(result);
    } else {
      res.status(500).json({ message: 'category not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
