import express from "express";
import {
  addBlogUser,
  deleteBlogUser,
  getAllUserBlogs,
  getSingleBlogUser,
  searchBlogUser,
  updateBlogUser,
} from "../controller/BlogUserController.js";
import authMiddleware from "../middleware/AuthMiddleware.js";
import uploadMiddleware from "../middleware/UploadImage.js";

const router = express.Router();

router.post(
  "/addBlogUser",
  authMiddleware,
  uploadMiddleware.fields([
    { name: "profilePicture", maxCount: 1 },
    { name: "coverPicture", maxCount: 1 },
  ]),
  addBlogUser
);

router.get("/getAllBlogUsers", getAllUserBlogs);
router.get("/getSingleBlogUser", getSingleBlogUser);
router.delete("/deleteBlogUser", authMiddleware, deleteBlogUser);
router.put(
  "/updateBlogUser",
  authMiddleware,
  uploadMiddleware.fields([
    { name: "profilePicture", maxCount: 1 },
    { name: "coverPicture", maxCount: 1 },
  ]),
  updateBlogUser
);

router.get("/searchBlogUser", searchBlogUser);

export default router;
