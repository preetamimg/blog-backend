import express from 'express'
import { loginAdmin, registerAdmin } from '../controller/AdminController.js'

const router = express.Router()

router.post('/adminRegister', registerAdmin)
router.post('/adminLogin', loginAdmin)


export default router