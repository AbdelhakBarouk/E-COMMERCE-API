require("dotenv").config();
require("express-async-errors");
//express
const express = require("express");
const app = express();

//middlewares
const notFoundMiddleware = require("./middlewares/notFound");
const errorHandlerMiddleware = require("./middlewares/error-handller");

//db
const connectDB = require("./db/connectDB");

app.use(express.json());

//routes

//middlewares
app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const PORT = process.env.PORT || 5000;
const start = async () => {
  try {
    await connectDB(process.env.DB_URI);
    app.listen(PORT, () => {
      console.log(`server running on port ${PORT}`);
    });
  } catch (error) {
    console.log(error);
  }
};

start();
