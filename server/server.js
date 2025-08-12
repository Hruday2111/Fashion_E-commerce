require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require('cookie-parser');
const app = express();


const profileRoutes = require('./routes/profileRoutes')
const productRoutes = require('./routes/productRoutes')
const cartRoutes = require('./routes/cartRoutes')
const ordersRoutes = require('./routes/ordersRoutes')
const adminRoutes = require('./routes/adminRoutes')
const shippingRoutes = require('./routes/shippingRoutes')
const { jwtAuthMiddleware } = require("./middleware/jwtmiddleware");

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);
      
      const allowedOrigins = [
        "http://localhost:5173",
        "http://localhost:5174", 
        "http://127.0.0.1:5173",
        "http://127.0.0.1:5174",
        "https://shopease-red.vercel.app",
        "https://shopease-du5gjkunx-priyanshus-projects-4565e17d.vercel.app"
      ];
      
      // Allow any Vercel subdomain
      const isVercelDomain = origin.match(/^https:\/\/.*\.vercel\.app$/);
      
      if (allowedOrigins.includes(origin) || isVercelDomain) {
        callback(null, true);
      } else {
        console.log('CORS blocked origin:', origin);
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PATCH", "DELETE", "PUT", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
  })
);

app.use(cookieParser());

app.use(express.json());

app.use('/api/profile/',profileRoutes)

app.use('/api/cart/', jwtAuthMiddleware,cartRoutes)

app.use('/api/orders/',jwtAuthMiddleware,ordersRoutes)

app.use('/api/product/', productRoutes)

app.use('/api/admin/', adminRoutes)

app.use('/api/shipping/', shippingRoutes)

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  if (!process.env.MONGO_URL) {
    console.error('MONGO_URL is not defined in your .env file.');
    process.exit(1);
  }
  mongoose
    .connect(process.env.MONGO_URL)
    .then(() => {
      console.log("Atlas Database connected");
    })
    .catch((err) => {
      console.log('MongoDB connection error:', err);
      process.exit(1);
    });
  console.log("Server running at port " + PORT);
});
console.log("MongoDB URI:", process.env.MONGO_URL);

