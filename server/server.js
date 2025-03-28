require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();


const profileRoutes = require('./routes/profileRoutes')
const productRoutes = require('./routes/productRoutes')
const cartRoutes = require('./routes/cartRoutes');
const { jwtAuthMiddleware } = require("./middleware/jwtmiddleware");

app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PATCH", "DELETE", "PUT"],
  })
);

app.use(express.json());

app.use('/api/profile/',profileRoutes)

app.use('/api/cart/', jwtAuthMiddleware,cartRoutes)

app.use('/api/product/', jwtAuthMiddleware, productRoutes)


app.listen(process.env.PORT, () => {
  console.log("Server running at port " + process.env.PORT);
});
// console.log("MongoDB URI:", process.env.MONGO_URL);

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log("Atlas Database connected");
  })
  .catch((err) => {
    console.log(err);
  });
