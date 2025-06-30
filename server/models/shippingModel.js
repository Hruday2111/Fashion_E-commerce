const mongoose = require("mongoose");

// Shipping Method Schema
const shippingMethodSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  description: { type: String },
  isActive: { type: Boolean, default: true },
  estimatedDays: { type: Number, required: true }, // Estimated delivery days
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Shipping Rate Schema
const shippingRateSchema = new mongoose.Schema({
  methodId: { type: mongoose.Schema.Types.ObjectId, ref: 'ShippingMethod', required: true },
  region: { type: String, required: true }, // e.g., "Local", "National", "International"
  minWeight: { type: Number, default: 0 }, // in kg
  maxWeight: { type: Number }, // in kg
  baseRate: { type: Number, required: true }, // Base shipping cost
  perKgRate: { type: Number, default: 0 }, // Additional cost per kg
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Order Shipping Schema
const orderShippingSchema = new mongoose.Schema({
  orderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true },
  methodId: { type: mongoose.Schema.Types.ObjectId, ref: 'ShippingMethod', required: true },
  trackingNumber: { type: String },
  status: { 
    type: String, 
    enum: ['pending', 'processing', 'shipped', 'delivered', 'failed'],
    default: 'pending'
  },
  shippedAt: { type: Date },
  deliveredAt: { type: Date },
  shippingAddress: {
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    zipCode: { type: String, required: true },
    country: { type: String, required: true }
  },
  shippingCost: { type: Number, required: true },
  notes: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Pre-save middleware to update timestamps
shippingMethodSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

shippingRateSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

orderShippingSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

const ShippingMethod = mongoose.model("ShippingMethod", shippingMethodSchema);
const ShippingRate = mongoose.model("ShippingRate", shippingRateSchema);
const OrderShipping = mongoose.model("OrderShipping", orderShippingSchema);

module.exports = { ShippingMethod, ShippingRate, OrderShipping }; 