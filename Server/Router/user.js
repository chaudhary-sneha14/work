import express from 'express'
import { login, register } from '../Controller/User.js'
import upload from '../Middleware/multer.js';
import { extractText } from '../Controller/Resume.js';
import { auth } from '../Middleware/auth.js';

const userRoute=express.Router()

userRoute.post('/register',register);
userRoute.post('/login',login)
userRoute.post('/upload',upload.single("resume"),extractText)

export default userRoute;