import AdminModel from "../models/AdminModel.js";
import BlogUserModel from "../models/BlogUserModel.js";
import CategoryModel from "../models/Category.js";
import fs from "fs";
import UserModel from "../models/UserModel.js";
import path from 'path';
import { IMG_URL } from "../constants.js";
import BlogModel from "../models/BlogModel.js";

export const addBlog = async (req, res) => {
  const { 
    title, 
    shortDesc, 
    description, 
    imgAltTag,
    categories,
    tags,
    slugUrl,
    author,
    date,
    metaTitle,
    metaDesc,
    show ,
    showComments ,
    bannerBlog
  } = req?.body;
  const { id } = req.auth;
  try {
    const user = await AdminModel.findOne({ _id: id }, { isAdmin: 1 });
    if (user?.isAdmin) {
      const ifBlogExists = await BlogModel.findOne({
        title: title,
      });
      if (ifBlogExists) {
        // console.log(">>>>>>>>", req.files);
        const { image } = req?.files;
        fs.unlink(image[0].path, (err) => {
          if (err) console.log("error while removing image");
          console.log("image removed successfully.");
        });
        res.status(500).json({ message: "blog title already exists please change blog title" });
      } else {
        const image = req?.files["image"]?.[0]?.filename ? req?.files["image"]?.[0]?.filename : '';

        const newBlog = new BlogModel({
          image: IMG_URL + image ,
          title: title, 
          shortDesc: shortDesc, 
          description: description, 
          imgAltTag: imgAltTag,
          categories: categories,
          tags: tags,
          slugUrl: slugUrl,
          author: author,
          date: date,
          metaTitle: metaTitle,
          metaDesc: metaDesc,
          show: show,
          showComments: showComments,
          bannerBlog : bannerBlog
        });

        const saveBlog = await newBlog.save();
        const data = {
          success: true,
          message: "blog added successfully",
        };
        res.status(200).json({ data });
      }
    } else {
      res.status(500).json({ message: "access denied" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllBlogs = async (req, res) => {


  try {
    const blogs = await BlogModel.find();
    const sortedData = blogs?.sort((a, b) => b.createdAt - a.createdAt);

    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || sortedData?.length;
  
    // Calculate start and end indexes for the paginated data
    const startIndex = (page - 1) * pageSize;
    const endIndex = page * pageSize;

    const paginatedData = sortedData.slice(startIndex, endIndex);
    const totalPages = Math.ceil(sortedData?.length / pageSize);
    
    // const dataWithUrl = paginatedData?.map(item=>{
    //   return {
    //     ...item?._doc,
    //     coverPicture : item?.coverPicture ? IMG_URL + item?.coverPicture : '',
    //     profilePicture : item?.profilePicture ? IMG_URL + item?.profilePicture : ''
    //   }
    // })
    // console.log(dataWithUrl)
    const result = {
      data: paginatedData,
      success: true,
      pagination: {
        page: page,
        pageSize: pageSize,
        totalPages: totalPages,
        totalItems: sortedData?.length,
      },
    };
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteBlog = async (req, res) => {
  const blogId = req.query.blogId;
  const { id } = req.auth;
  try {
    const user = await AdminModel.findOne(
      {_id: id},
      { isAdmin: 1 }
    );

    if (user?.isAdmin) {
      const blog = await BlogModel.findById(blogId);
      if (blog) {
        if(blog?.image) {
          const imageUrl = blog?.image?.split(IMG_URL)
          const blogPic = path.join(process.cwd(), `public/${imageUrl[1]}`);
          fs.unlink(blogPic, (err)=> {
            if (err) console.log('error', err)
              console.log('image removed sucessfully')
          })
        }

        await blog.deleteOne();
        const data = {
          status: true,
          message: "blog deleted successfully",
        };
        res.status(200).json({ data });
      } else {
        res.status(500).json({ message: "blog not exists" });
      }
    } else {
      res.status(500).json({ message: "access denied" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateBlogStatus = async (req, res) => {
  const blogId = req.query.blogId;
  const {id} = req.auth
  try {
    const user = await AdminModel.findOne(
      { _id: id},
      { isAdmin: 1 }
    );

    if (user?.isAdmin) {
      const blog = await BlogModel.findById(blogId);
      if (blog) {
        
        let show =blog.show ? false : true;
        const updatedBlog = await BlogModel.findByIdAndUpdate(blogId,{show});
        
        // const updatedBlogUser = await blogUser.updateOne({
        //   $set: req.body,
        //   new: true
        // })

        const data = {
          success: true,
          message: "blog status updated successfully", 
          updatedBlog 
        }

        res
          .status(200)
          .json({data });
      } else {
        res.status(500).json({ message: "blog not exists" });
      }
    } else {
      res.status(500).json({ message: "access denied" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const updateBlogBannerStatus = async (req, res) => {
  const blogId = req.query.blogId;
  const {id} = req.auth
  try {
    const user = await AdminModel.findOne(
      { _id: id},
      { isAdmin: 1 }
    );

    if (user?.isAdmin) {
      const blog = await BlogModel.findById(blogId);
      if (blog) {
        
        let bannerBlog = blog.bannerBlog ? false : true;
        const updatedBlog = await BlogModel.findByIdAndUpdate(blogId,{bannerBlog});
        
        // const updatedBlogUser = await blogUser.updateOne({
        //   $set: req.body,
        //   new: true
        // })

        const data = {
          success: true,
          message: "blog banner status updated successfully", 
          updatedBlog 
        }

        res
          .status(200)
          .json({data });
      } else {
        res.status(500).json({ message: "blog not exists" });
      }
    } else {
      res.status(500).json({ message: "access denied" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateBlogCommentStatus = async (req, res) => {
  const blogId = req.query.blogId;
  const {id} = req.auth
  try {
    const user = await AdminModel.findOne(
      { _id: id},
      { isAdmin: 1 }
    );

    if (user?.isAdmin) {
      const blog = await BlogModel.findById(blogId);
      if (blog) {
        
        let showComments = blog.showComments ? false : true;
        const updatedBlog = await BlogModel.findByIdAndUpdate(blogId,{showComments});
        
        // const updatedBlogUser = await blogUser.updateOne({
        //   $set: req.body,
        //   new: true
        // })

        const data = {
          success: true,
          message: "blog comment status updated successfully", 
          updatedBlog 
        }

        res
          .status(200)
          .json({data });
      } else {
        res.status(500).json({ message: "blog not exists" });
      }
    } else {
      res.status(500).json({ message: "access denied" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateBlog = async (req, res) => {
  const blogId = req.query.blogId;
  const {id} = req.auth
  console.log('updatedData', req?.body)
  try {
    const user = await AdminModel.findOne(
      { _id: id},
      { isAdmin: 1 }
    );

    if (user?.isAdmin) {
      const blog = await BlogModel.findById(blogId);
      if (blog) {
        
        const { _id, ...updatedData } = req?.body;
        const blogImage = req?.files["image"]?.[0]?.filename ? req?.files["image"]?.[0]?.filename : '';

        if(blogImage) {
          const imageUrl = blog?.image?.split(IMG_URL)
          const blogPic = path.join(process.cwd(), `public/${imageUrl[1]}`);
          fs.unlink(blogPic, (err)=> {
            if (err) console.log('error', err)
              console.log('image removed sucessfully')
          })
        }

        const updatedBlogDetails = {
          image: blogImage ? IMG_URL + blogImage : updatedData?.image ,
          title: updatedData?.title, 
          shortDesc: updatedData?.shortDesc, 
          description: updatedData?.description, 
          imgAltTag: updatedData?.imgAltTag,
          categories: updatedData?.categories,
          tags: updatedData?.tags,
          slugUrl: updatedData?.slugUrl,
          author: updatedData?.author,
          date: updatedData?.date,
          metaTitle: updatedData?.metaTitle,
          metaDesc: updatedData?.metaDesc,
          show: updatedData?.show 
        }
        
        const updatedBlog = await BlogModel.findByIdAndUpdate(
          blogId,
          updatedBlogDetails,
          { new: true }
        );
        // const updatedBlogUser = await blogUser.updateOne({
        //   $set: req.body,
        //   new: true
        // })

        const data = {
          success: true,
          message: "blog updated successfully", 
          updatedBlog 
        }

        res
          .status(200)
          .json({data });
      } else {
        res.status(500).json({ message: "blog not exists" });
      }
    } else {
      res.status(500).json({ message: "access denied" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getSingleBlog = async (req, res) => {
  const blogId = req.query.blogId;

  try {
    const blog = await BlogModel.findOne({ _id: blogId });
    if (blog) {
      // console.log(blogUser)
      // const data = {
      //   ...blogUser?._doc,
      //   coverPicture : blogUser?.coverPicture ? IMG_URL + blogUser?.coverPicture : '',
      //   profilePicture : blogUser?.profilePicture ? IMG_URL + blogUser?.profilePicture : ''
      // }

      const result = {
        data: blog,
        success: true,
      };
      res.status(200).json(result);
    } else {
      res.status(500).json({ message: "blog not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const searchBlog = async (req, res) => {
  const searchValue = req.query.search;
  const regex = new RegExp(searchValue, 'i');
  try {
    const blogs = await BlogModel.find({
      $or : [
        {title: regex},
        {categories: {$in: [regex]}},
        {tags: {$in: [regex]}}
      ]
    });

    if (blogs?.length > 0) {
      const sortedData = blogs?.sort((a, b) => b.createdAt - a.createdAt);

      const page = parseInt(req.query.page) || 1;
      const pageSize = parseInt(req.query.pageSize) || sortedData?.length;
    
      // Calculate start and end indexes for the paginated data
      const startIndex = (page - 1) * pageSize;
      const endIndex = page * pageSize;
  
      const paginatedData = sortedData.slice(startIndex, endIndex);
      const totalPages = Math.ceil(sortedData?.length / pageSize);

        const result = {
          data: paginatedData,
          success: true,
          mesage: 'Blog found successfully',
          pagination: {
            page: page,
            pageSize: pageSize,
            totalPages: totalPages,
            totalItems: sortedData?.length,
          },
        };
        res.status(200).json(result);
    }

else {
      res.status(500).json({ message: "blog not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// front end apis

// get banner

export const getBannerBlogs = async( req, res)=> {
  try {
    const blogs = await BlogModel.find({bannerBlog : true})
    if(blogs) {
      const pageSize = parseInt(req.query.pageSize) || sortedData?.length;
      const shuffledBlogs = blogs.sort(() => Math.random() - 0.5);
      const limitedData = shuffledBlogs.slice(0, pageSize)
      const result = {
        data : limitedData,
        message: 'banner blogs found successfully',
        status: true
      }
      res.status(200).json(result)
    } else {
      res.status(500).json({
        message: 'no blogs found'
      })
    }
  } catch (error) {
    
  }
}

