require("dotenv").config();
require("express-async-errors");
//express
const express = require("express");
const app = express();

//rest of packages
const cookieParser = require("cookie-parser");

//db
const connectDB = require("./db/connectDB");

//routers
const authRouter = require("./routes/authRoute");
const userRouter = require("./routes/userRoute");
const categoryRouter = require("./routes/categoryRoute");
const subCategoryRouter = require("./routes/subCategoryRoute");
const brandRouter = require("./routes/brandRoute");

//middlewares
const notFoundMiddleware = require("./middlewares/notFound");
const errorHandlerMiddleware = require("./middlewares/error-handller");

app.use(express.static("uploads"));
app.use(express.json());
app.use(cookieParser(process.env.JWT_SECRET));

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/categories", categoryRouter);
app.use("/api/v1/subCategories", subCategoryRouter);
app.use("/api/v1/brands", brandRouter);

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
