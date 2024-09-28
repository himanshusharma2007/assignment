const express=require("express")
const app=express();
const { connectMongoDB } = require("./db/connectToMongoDB");
const {seedDatabase}=require("./scripts/seedDatabase")
const cors = require("cors");
const dotenv = require("dotenv");
const productsRouter=require("./routes/productsRouter")

dotenv.config();
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

const PORT = process.env.PORT || 5000;
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