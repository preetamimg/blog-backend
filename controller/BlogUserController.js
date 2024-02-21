import AdminModel from "../models/AdminModel.js";
import BlogUserModel from "../models/BlogUserModel.js";
import CategoryModel from "../models/Category.js";
import fs from "fs";
import UserModel from "../models/UserModel.js";
import path from 'path';
import { IMG_URL } from "../constants.js";

export const addBlogUser = async (req, res) => {
  const { userName, about, livesIn, worksAt } = req?.body;
  const { id } = req.auth;
  try {
    const user = await AdminModel.findOne({ _id: id }, { isAdmin: 1 });
    if (user?.isAdmin) {
      const ifBlogUserExists = await BlogUserModel.findOne({
        userName: userName,
      });
      if (ifBlogUserExists) {
        // console.log(">>>>>>>>", req.files);
        const { profilePicture, coverPicture } = req?.files;
        fs.unlink(profilePicture[0].path, (err) => {
          if (err) console.log("error while removing profile picture");
          console.log("profile picture removed successfully.");
        });
        fs.unlink(coverPicture[0].path, (err) => {
          if (err) console.log("error while removing cover picture");
          console.log("cover picture removed successfully.");
        });
        res.status(500).json({ message: "blog user already exists" });
      } else {
        const profilePicture = req?.files["profilePicture"]?.[0]?.filename ? req?.files["profilePicture"]?.[0]?.filename : '';
        const coverPicture = req?.files["coverPicture"]?.[0]?.filename ? req?.files["coverPicture"]?.[0]?.filename : '';

        const newBlogUser = new BlogUserModel({
          userName: userName,
          profilePicture: profilePicture ? IMG_URL + profilePicture : '',
          coverPicture: coverPicture ? IMG_URL + coverPicture : '',
          about: about,
          livesIn: livesIn,
          worksAt: worksAt,
        });

        const saveBlogUser = await newBlogUser.save();
        const data = {
          success: true,
          message: "blog user added successfully",
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

export const getAllUserBlogs = async (req, res) => {


  try {
    const blogUsers = await BlogUserModel.find();
    const sortedData = blogUsers?.sort((a, b) => b.createdAt - a.createdAt);

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

export const deleteBlogUser = async (req, res) => {
  const blogUserId = req.query.blogUserId;
  const { id } = req.auth;
  try {
    const user = await AdminModel.findOne(
      {_id: id},
      { isAdmin: 1 }
    );

    if (user?.isAdmin) {
      const blogUser = await BlogUserModel.findById(blogUserId);
      if (blogUser) {
        if(blogUser?.profilePicture) {
          const profilePicUrl = blogUser?.profilePicture?.split(IMG_URL)
          const profilePic = path.join(process.cwd(), `public/${profilePicUrl[1]}`);
          fs.unlink(profilePic, (err)=> {
            if (err) console.log('error', err)
              console.log('profile picture removed sucessfully')
          })
        }

        
        if(blogUser?.coverPicture) {
          const coverPicUrl = blogUser?.coverPicture?.split(IMG_URL)
          const coverPic = path.join(process.cwd(), `public/${coverPicUrl[1]}`);
          fs.unlink(coverPic, (err)=> {
            if (err) console.log('error', err)
              console.log('cover picture removed sucessfully')
          })
        }
        await blogUser.deleteOne();
        const data = {
          status: true,
          message: "blog user deleted successfully",
        };
        res.status(200).json({ data });
      } else {
        res.status(500).json({ message: "blog user not exists" });
      }
    } else {
      res.status(500).json({ message: "access denied" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateBlogUser = async (req, res) => {
  const blogUserId = req.query.blogUserId;
  const {id} = req.auth
  console.log('updatedData', req?.body)
  try {
    const user = await AdminModel.findOne(
      { _id: id},
      { isAdmin: 1 }
    );

    if (user?.isAdmin) {
      const blogUser = await BlogUserModel.findById(blogUserId);
      if (blogUser) {
        
        const { _id, ...updatedData } = req?.body;
        const profilePicture = req?.files["profilePicture"]?.[0]?.filename ? req?.files["profilePicture"]?.[0]?.filename : '';
        const coverPicture = req?.files["coverPicture"]?.[0]?.filename ? req?.files["coverPicture"]?.[0]?.filename : '';

        if(profilePicture) {
          const profilePicUrl = blogUser?.profilePicture?.split(IMG_URL)
          const profilePic = path.join(process.cwd(), `public/${profilePicUrl[1]}`);
          fs.unlink(profilePic, (err)=> {
            if (err) console.log('error', err)
              console.log('profile picture removed sucessfully')
          })
        }

        if(coverPicture) {
          const coverPicUrl = blogUser?.coverPicture?.split(IMG_URL)
          const coverPic = path.join(process.cwd(), `public/${coverPicUrl[1]}`);
          fs.unlink(coverPic, (err)=> {
            if (err) console.log('error', err)
              console.log('cover picture removed sucessfully')
          })
        }

        const updatedUserDetails = {
          userName: updatedData?.userName,
          profilePicture: profilePicture ? IMG_URL + profilePicture : updatedData?.profilePicture,
          coverPicture: coverPicture ? IMG_URL + coverPicture : updatedData?.coverPicture,
          about: updatedData?.about,
          livesIn: updatedData?.livesIn,
          worksAt: updatedData?.worksAt,
        }
        
        const updatedBlogUser = await BlogUserModel.findByIdAndUpdate(
          blogUserId,
          updatedUserDetails,
          { new: true }
        );
        // const updatedBlogUser = await blogUser.updateOne({
        //   $set: req.body,
        //   new: true
        // })

        const data = {
          success: true,
          message: "blog user updated successfully", 
          updatedBlogUser 
        }

        res
          .status(200)
          .json({data });
      } else {
        res.status(500).json({ message: "blog user not exists" });
      }
    } else {
      res.status(500).json({ message: "access denied" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getSingleBlogUser = async (req, res) => {
  const blogUserId = req.query.id;

  try {
    const blogUser = await BlogUserModel.findOne({ _id: blogUserId });
    if (blogUser) {
      // console.log(blogUser)
      // const data = {
      //   ...blogUser?._doc,
      //   coverPicture : blogUser?.coverPicture ? IMG_URL + blogUser?.coverPicture : '',
      //   profilePicture : blogUser?.profilePicture ? IMG_URL + blogUser?.profilePicture : ''
      // }

      const result = {
        data: blogUser,
        success: true,
      };
      res.status(200).json(result);
    } else {
      res.status(500).json({ message: "blog user not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const searchBlogUser = async (req, res) => {
  const searchValue = req.query.search;

  try {
    const blogUser = await BlogUserModel.find();

    const filteredUsers = blogUser?.filter(user=> user?.userName?.toLowerCase()?.includes(searchValue)?.toLowerCase())
    if (filteredUsers) {
      // console.log(blogUser)
      // const data = {
      //   ...blogUser?._doc,
      //   coverPicture : blogUser?.coverPicture ? IMG_URL + blogUser?.coverPicture : '',
      //   profilePicture : blogUser?.profilePicture ? IMG_URL + blogUser?.profilePicture : ''
      // }

      const result = {
        data: filteredUsers,
        success: true,
      };
      res.status(200).json(result);
    } else {
      res.status(500).json({ message: "blog user not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
