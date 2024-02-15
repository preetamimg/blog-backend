import express  from "express";
import { addCategory, deleteCategory, getAllCategories, getSingleCategory, updateCategory } from "../controller/CategoryController.js";
import authMiddleware from "../middleware/AuthMiddleware.js";

const router = express.Router()

router.post('/addCategory', authMiddleware,  addCategory)
router.get('/getCategory', getAllCategories)
router.get('/getSingleCategory', getSingleCategory)
router.delete('/deleteCategory', authMiddleware, deleteCategory)
router.put('/updateCategory', authMiddleware, updateCategory)




export default router