const express=require("express")

const app=express();
const { connectMongoDB } = require("./db/connectToMongoDB");
const dotenv = require("dotenv");
dotenv.config();
app.get("/",(req,res)=>{
    console.log("index route render")
    res.send("working...")
})

app.listen(3000,()=>{
    connectMongoDB();
    console.log("server is running on the port 3000")
})