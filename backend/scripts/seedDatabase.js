const Product = require("../models/productModel");
const axios = require("axios");
exports.seedDatabase = async () => {
  try {
    console.log("Seeding database...");

    // Clear the database if necessary
    await Product.deleteMany({});

    // Fetch and seed products
    const productResponse = await axios.get(
      "https://dummyjson.com/products?limit=30"
    );
    const products = productResponse.data.products;

    for (const product of products) {
      await Product.findOneAndUpdate({ id: product.id }, product, {
        upsert: true,
      });
    }

    console.log(`Seeded ${products.length} products`);
    console.log("Database seeding completed successfully");
  } catch (error) {
    console.error("Error seeding database:", error);
  }
};
