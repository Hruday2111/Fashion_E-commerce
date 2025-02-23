const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();

require("dotenv").config();

const profileRoutes = require('./routes/profileRoutes')
const productRoutes = require('./routes/productRoutes')
const cartRoutes = require('./routes/cartRoutes')

app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PATCH", "DELETE", "PUT"],
  })
);

app.use('/api/profile/',profileRoutes)

app.use('/api/cart/',cartRoutes)

app.use('/api/product/',productRoutes)


app.listen(process.env.PORT, () => {
  console.log("Server running at port " + process.env.PORT);
});

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log("Atlas Database connected");
  })
  .catch((err) => {
    console.log(err);
  });
