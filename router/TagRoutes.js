import express  from "express";
import authMiddleware from "../middleware/AuthMiddleware.js";
import { addTag, deleteTag, getAllTags, getSingleTag, updateTag } from "../controller/TagController.js";

const router = express.Router()

router.post('/addTag', authMiddleware,  addTag)
router.get('/getTag', getAllTags)
router.get('/getSingleTag', getSingleTag)
router.delete('/deleteTag', authMiddleware, deleteTag)
router.put('/updateTag', authMiddleware, updateTag)




export default router