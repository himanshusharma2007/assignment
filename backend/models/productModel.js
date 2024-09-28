const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema({
  id: {
    type: Number,
    required: true,
    unique: true,
  },
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  discountPercentage: {
    type: Number,
    min: 0,
    max: 100,
  },
  rating: {
    type: Number,
    min: 0,
    max: 5,
  },
  stock: {
    type: Number,
    required: true,
    min: 0,
  },
  brand: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  thumbnail: String,
  images: [String],
});

module.exports = mongoose.model("Product", ProductSchema);
