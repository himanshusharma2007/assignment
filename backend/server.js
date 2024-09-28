const express=require("express")

const app=express();
const { connectMongoDB } = require("./db/connectToMongoDB");
const {seedDatabase}=require("./scripts/seedDatabase")
const productsRouter=require("./routes/productsRouter")
const dotenv = require("dotenv");
dotenv.config();
const PORT = process.env.PORT || 3000;
app.get("/",(req,res)=>{
    console.log("index route render")
    res.send("working...")
})
app.use("/api/products",productsRouter)
app.listen(PORT,async()=>{
    connectMongoDB();
    // await seedDatabase();
    console.log(`server is running on the port ${PORT}`)
})