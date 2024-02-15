
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import AdminModel from '../models/AdminModel.js';

  // register user

export const registerAdmin = async (req, res)=> {

  const {email, password} = req.body;

  // hash the password
  const salt = await bcrypt.genSalt(10)
  const hashedPassword = await bcrypt.hash(password, salt)

  const newUser = new AdminModel({
    email, 
    password : hashedPassword
  })

  try {
    const oldUser = await AdminModel.findOne({email : email})
    // check if email is already exists
    if(oldUser) {
      res.status(404).json({
        message: 'email already exists'
      })
    } else {
      const user = await newUser.save();
      const token = jwt.sign({
        id: user._id
      }, 'BLOG', {expiresIn: '10h'})

      res.status(200).json({user, token, success: true})
    }
  } catch (error) {
    res.status(500).json({message: error.message})
  }
}

// login user

export const loginAdmin = async (req, res)=> {
  const {email, password} = req.body;

  try {
    const user = await AdminModel.findOne({email : email})
    if(user) {
      const validity = await bcrypt.compare(password, user.password)
      if(validity) {
          const token = jwt.sign({
            id: user._id
          }, 'BLOG', {expiresIn: '10h'})
        res.status(200).json({user, token, success: true})
      } else {
        res.status(400).json({
          message: 'Wrong Password'
        })
      }
    } else {
      res.status(404).json({
        message: 'User not found'
      })
    }
  } catch (error) {
    res.status(500).json({message: error.message})
  }
}