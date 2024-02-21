import AdminModel from "../models/AdminModel.js";
import TagModel from "../models/TagModel.js";
import UserModel from "../models/UserModel.js";


export const addTag = async (req, res) => {
  const { tagName } = req.body;
  const {id} = req.auth

  const newTag = new TagModel({
    tagName: tagName,
  });

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
      const ifTagExists = await TagModel.findOne({
        tagName: tagName,
      });
      if (ifTagExists) {
        res.status(500).json({ message: "tag already exists" });
      } else {
        const saveTag = await newTag.save();
        const data = {
          success: true,
          message: "tag added successfully" 
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

export const getAllTags = async (req, res) => {
    
  try {
    const tags = await TagModel.find();
    const sortedData = tags?.sort((a,b)=>b.createdAt - a.createdAt)

    
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

export const deleteTag = async (req, res) => {
  const tagId = req.query.tagId;
  const {id} = req.auth
  try {
    const user = await AdminModel.findOne(
      { _id: id },
      { isAdmin: 1 }
    );

    if(user?.isAdmin) {
      const tag = await TagModel.findById(tagId);
      if (tag) {
        await tag.deleteOne();
        const data = {
          status: true,
          message: "tag deleted successfully"
        }
        res.status(200).json({data });
      } else {
        res.status(500).json({ message: "tag not exists" });
      }
    }else {
      res.status(500).json({ message: "access denied" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateTag = async (req, res) => {
  const tagId = req.query.tagId;
  const {id} = req.auth
  try {
    const user = await AdminModel.findOne(
      { _id: id },
      { isAdmin: 1 }
    );

    if(user?.isAdmin) {
      const tag = await TagModel.findById(tagId);
      if (tag) {
        const { _id, ...updatedData } = req.body;
        const updatedTag = await TagModel.findByIdAndUpdate(tagId, updatedData, {new : true});
        
        res.status(200).json({ message: "tag updated successfully", updatedTag });
      } else {
        res.status(500).json({ message: "tag not exists" });
      }
    }else {
      res.status(500).json({ message: "access denied" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getSingleTag = async (req, res) => {
  const tagId = req.query.tagId;

  try {
    const tag = await TagModel.findOne({_id: tagId});
    if(tag) {
      const result = {
        data : tag,
        success: true
      }
      res.status(200).json(result);
    } else {
      res.status(500).json({ message: 'tag not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
