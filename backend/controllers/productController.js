const Product = require("../models/productModel");

exports.getCategories = async (req, res) => {
  try {
    console.log("Fetching categories");
    const products = await Product.find();
    let categories = [...new Set(products.map((product) => product.category))];

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

    const products = await Product.find(query)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const count = await Product.countDocuments(query);

    console.log(`Fetched ${products.length} products`);
    res.json({
      products,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
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
    const product = await Product.findOne({ id: req.params.id });
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

// exports.createProduct = async (req, res) => {
//   try {
//     console.log("Creating new product");
//     const newProduct = new Product(req.body);
//     await newProduct.save();
//     console.log("New product created");
//     res.status(201).json(newProduct);
//   } catch (err) {
//     console.error("Error in createProduct:", err);
//     res
//       .status(400)
//       .json({ message: "Error creating product", error: err.message });
//   }
// };

// exports.updateProduct = async (req, res) => {
//   try {
//     console.log(`Updating product with id: ${req.params.id}`);
//     const updatedProduct = await Product.findOneAndUpdate(
//       { id: req.params.id },
//       req.body,
//       { new: true }
//     );
//     if (!updatedProduct) {
//       console.log("Product not found for update");
//       return res.status(404).json({ message: "Product not found" });
//     }
//     console.log("Product updated");
//     res.json(updatedProduct);
//   } catch (err) {
//     console.error("Error in updateProduct:", err);
//     res
//       .status(400)
//       .json({ message: "Error updating product", error: err.message });
//   }
// };

// exports.deleteProduct = async (req, res) => {
//   try {
//     console.log(`Deleting product with id: ${req.params.id}`);
//     const deletedProduct = await Product.findOneAndDelete({
//       id: req.params.id,
//     });
//     if (!deletedProduct) {
//       console.log("Product not found for deletion");
//       return res.status(404).json({ message: "Product not found" });
//     }
//     console.log("Product deleted");
//     res.json({ message: "Product deleted successfully" });
//   } catch (err) {
//     console.error("Error in deleteProduct:", err);
//     res
//       .status(500)
//       .json({ message: "Error deleting product", error: err.message });
//   }
// };
