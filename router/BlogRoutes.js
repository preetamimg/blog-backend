import express  from "express";
import authMiddleware from "../middleware/AuthMiddleware.js";
import { addBlog, deleteBlog, getAllBlogs, getSingleBlog, updateBlogStatus } from "../controller/BlogController.js";
import uploadMiddleware from "../middleware/UploadImage.js";

const router = express.Router()

router.post('/addBlog', authMiddleware, 
uploadMiddleware.fields([
  { name: "image", maxCount: 1 },
]), addBlog)
router.get('/getAllBlogs', getAllBlogs)
router.get('/getSingleBlog', getSingleBlog)
router.put('/updateBlogStatus', authMiddleware, updateBlogStatus)
router.delete('/deleteBlog', authMiddleware, deleteBlog)
// router.put('/updateTag', authMiddleware, updateTag)




export default router