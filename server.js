// server.js
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
const authRoute = require("./routes/auth_routes");
const userRoute = require("./routes/user_routes");


const app = express();

//! ====== keep only this, with the limit ======
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// allow mobile device too while testing
app.use(cors({ origin: "*" }));

//! ====== MongoDB Connect ======
mongoose
  .connect("mongodb://127.0.0.1:27017/Event_mangment")
  .then(() => console.log("Mongo connected"))
  .catch((err) => console.error(err));

app.get("/", (req, res) => {
  res.send("API running");
});

//! ====== Routes ======
app.use("/api/auth", authRoute);
app.use("/api", userRoute);

//! ====== Start server ======
app.listen(3000, () => {
  console.log("Server + Socket.io running on port 3000");
});
