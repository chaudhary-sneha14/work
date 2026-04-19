
import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import { connect } from './Config/db.js'
import userRoute from './Router/user.js'
import router from './Router/resume.js'


const app=express()
app.use(express.json())
app.use(cors())

await connect()

const port=process.env.PORT||3000;



app.use('/api/user',userRoute)
app.use('/api/interview',router) // job router

app.use('/',(req,res)=>{
    res.send("Hello World !!");
})



app.listen(port,()=>console.log("Server is Running"));          