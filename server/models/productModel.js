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

   // Add below existing fields
    ratings: {
      type: Map, // Holds star counts
      of: Number,
      default: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
    },
    reviews: {
      type: [
        {
          user: { type: String, default: "Anonymous" },
          comment: { type: String },
          rating: { type: Number, min: 1, max: 5 },
          date: { type: Date, default: Date.now },
        },
      ],
      default: [],
    },

  }
);

const product = mongoose.model("product", productSchema);

module.exports = product;
