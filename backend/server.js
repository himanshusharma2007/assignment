const express = require("express");
const next = require("next");
const { connectMongoDB } = require("./db/connectToMongoDB");
const cors = require("cors");
const dotenv = require("dotenv");
const productsRouter = require("./routes/productsRouter");
const path = require("path");

dotenv.config();

const dev = process.env.NODE_ENV !== "production";
const nextApp = next({ dev, dir: path.join(__dirname, "../frontend") });
const handle = nextApp.getRequestHandler();

const app = express();

app.use(
  cors({
    origin: [
      "http://localhost:5000",
      "https://products-page-bnkv.onrender.com",
    ],
    credentials: true,
  })
);

const PORT = process.env.PORT || 5000;

nextApp.prepare().then(() => {
  app.use("/_next", express.static(path.join(__dirname, "../frontend/.next")));
  app.use(express.static(path.join(__dirname, "../frontend/public")));
  app.use("/api/products", productsRouter);
  app.all("*", (req, res) => handle(req, res));

  app.listen(PORT, async () => {
    await connectMongoDB();
    console.log(`Server is running on port ${PORT}`);
  });
});
