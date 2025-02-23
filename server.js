const express = require("express");
require("dotenv").config();
const DATABASE_URL = process.env.DATABASE_URL;
// console.log(DATABASE_URL);
const mongoose = require("mongoose");
const studentRouter = require("./route/studentRouter");
// const adminRouter = require("./route/adminRouter");
// const multer = require ('multer')

const app = express();
const PORT = 9090;
app.use(express.json());
// app.use(adminRouter);
app.use(studentRouter)

app.use((err, req, res, next) => {
  if (err)
    return res.status(400).json({
      message: err.message,
    });

  next();
});

mongoose
  .connect(DATABASE_URL)
  .then(() => {
    console.log("Database connected succesfully");

    app.listen(PORT, () => {
      console.log(`Server is listening to PORT:${PORT}`);
    });
  })
  .catch((err) => {
    console.log("Unable to connect to db because" + err);
  });
// const PORT = 9090;
