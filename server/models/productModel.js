const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    productId: { type: Number, required: true, unique: true },
    gender: { type: String, required: true },
    masterCategory: { type: String, required: true },
    subCategory: { type: String, required: true },
    articleType: { type: String, required: true },
    baseColour: { type: String, required: true },
    season: { type: String, required: true },
    usage: { type: String, required: true },
    productDisplayName: { type: String, required: true },
    imageUrl: { type: String, required: true },
    price: { type: Number, required: true },
    stock: { type: Number, required: true, default: 0 },
  }
);

const product = mongoose.model("product", productSchema);

module.exports = product;

