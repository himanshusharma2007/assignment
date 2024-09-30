const express = require("express");
const next = require("next");
const { connectMongoDB } = require("./db/connectToMongoDB");
const { seedDatabase } = require("./scripts/seedDatabase");
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
      // Add any other origins you need to support
    ],
    credentials: true,
  })
);


const PORT = process.env.PORT || 5000;

nextApp.prepare().then(() => {
  // Serve static files from the Next.js .next directory
  app.use("/_next", express.static(path.join(__dirname, "../frontend/.next")));

  // Serve static files from the public directory
  app.use(express.static(path.join(__dirname, "../frontend/public")));

  // API route for products
  app.use("/api/products", productsRouter);

  // Catch-all handler to let Next.js handle all other routes
  app.all("*", (req, res) => {
    return handle(req, res);
  });

  // Start the server
  app.listen(PORT, async () => {
    await connectMongoDB();
    // await seedDatabase();
    console.log(`Server is running on port ${PORT}`);
  });
});
