require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require('cookie-parser');
const app = express();


const profileRoutes = require('./routes/profileRoutes')
const productRoutes = require('./routes/productRoutes')
const cartRoutes = require('./routes/cartRoutes');
const { jwtAuthMiddleware } = require("./middleware/jwtmiddleware");

app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:5174", "http://127.0.0.1:5173", "http://127.0.0.1:5174"],
    credentials: true,
    methods: ["GET", "POST", "PATCH", "DELETE", "PUT", "OPTIONS"], // Added OPTIONS for preflight requests
    allowedHeaders: ["Content-Type", "Authorization"]
  })
);

app.use(cookieParser());

app.use(express.json());

app.use('/api/profile/',profileRoutes)

app.use('/api/cart/', jwtAuthMiddleware,cartRoutes)

app.use('/api/product/', productRoutes)


app.listen(process.env.PORT, () => {
  mongoose
    .connect(process.env.MONGO_URL)
    .then(() => {
      console.log("Atlas Database connected");
    })
    .catch((err) => {
      console.log(err);
    });
  console.log("Server running at port " + process.env.PORT);
});
console.log("MongoDB URI:", process.env.MONGO_URL);

