const Product = require("../models/productModel");

exports.getCategories = async (req, res) => {
  try {
    console.log("Fetching categories");
    const categories = await Product.distinct("category");
    console.log(`Fetched ${categories.length} categories`);
    res.json(categories);
  } catch (err) {
    console.error("Error in getCategories:", err);
    res
      .status(500)
      .json({ message: "Error fetching categories", error: err.message });
  }
};

exports.getProducts = async (req, res) => {
  try {
    console.log("Fetching products");
    const { page = 1, limit = 10, category, search } = req.query;
    console.log("Incoming query:", req.query);

    const query = {};

    if (category) {
      query.category = category;
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    const options = {
      limit: parseInt(limit),
      skip: (parseInt(page) - 1) * parseInt(limit),
      lean: true, // This will return plain JavaScript objects instead of Mongoose documents
    };

    const [products, count] = await Promise.all([
      Product.find(query, null, options),
      Product.countDocuments(query),
    ]);

    console.log(`Fetched ${products.length} products`);
    res.json({
      products,
      totalPages: Math.ceil(count / limit),
      currentPage: parseInt(page),
      totalProducts: count,
    });
  } catch (err) {
    console.error("Error in getProducts:", err);
    res
      .status(500)
      .json({ message: "Error fetching products", error: err.message });
  }
};

exports.getProductById = async (req, res) => {
  try {
    console.log(`Fetching product with id: ${req.params.id}`);
    const product = await Product.findOne({ id: req.params.id }).lean();
    if (!product) {
      console.log("Product not found");
      return res.status(404).json({ message: "Product not found" });
    }
    console.log("Product found");
    res.json(product);
  } catch (err) {
    console.error("Error in getProductById:", err);
    res
      .status(500)
      .json({ message: "Error fetching product", error: err.message });
  }
};