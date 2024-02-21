import express  from "express";
import authMiddleware from "../middleware/AuthMiddleware.js";
import { addBlog, deleteBlog, getAllBlogs, getSingleBlog, searchBlog, updateBlog, updateBlogCommentStatus, updateBlogStatus } from "../controller/BlogController.js";
import uploadMiddleware from "../middleware/UploadImage.js";

const router = express.Router()

router.post('/addBlog', authMiddleware, 
uploadMiddleware.fields([
  { name: "image", maxCount: 1 },
]), addBlog)
router.get('/getAllBlogs', getAllBlogs)
router.get('/getSingleBlog', getSingleBlog)
router.put('/updateBlogStatus', authMiddleware, updateBlogStatus)
router.put('/updateBlogCommentStatus', authMiddleware, updateBlogCommentStatus)
router.delete('/deleteBlog', authMiddleware, deleteBlog)
router.put('/updateBlog', authMiddleware, uploadMiddleware.fields([
  { name: "image", maxCount: 1 },
]), updateBlog)
router.get('/searchBlog', searchBlog)




export default router