const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const router = require("./routes/userRoute")
const cookiesParser = require("cookie-parser")

dotenv.config();

const app = express();
app.use(express.json())
app.use(cookiesParser())

//db connection
mongoose
  .connect("mongodb://localhost:27017/authentication")
  .then(() => {
    console.log("database connected 🚀 successfully");
  })
  .catch((error) => {
    console.log(error);
  });

const port = process.env.PORT || 3000;

//middleware
app.use("/api/auth/v1",router)



//routing
app.get("/", (req, res) => {
  res.send("Hello World");
});

//server;
app.listen(port, () => {
  console.log(`server runing on port 🚀 ${port}`);
});
