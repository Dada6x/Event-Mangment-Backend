// server.js
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
// require("dotenv").config();
const authRoute = require("./routes/auth_routes");
const userRoute = require("./routes/user_routes");
const eventRoute = require("./routes/event_routes");
const adminRoute = require("./routes/admin_routes");
const app = express();
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./swagger.json");

//! ====== keep only this, with the limit ======
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

//! allow mobile device too while testing
app.use(cors({ origin: "*" }));

//! ====== MongoDB Connect ======
mongoose
  .connect("mongodb://127.0.0.1:27017/Event_mangment")
  .then(() => console.log("Mongo connected"))
  .catch((err) => console.error(err));

app.get("/", (req, res) => {
  res.send("API running");
});
//! ====== Swagger ======
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.get("/", (req, res) => {
  res.send("API running");
});
//$ http://localhost:3000/api-docs/

//! ====== Routes ======
app.use("/api/auth", authRoute); // signup- login
app.use("/api", userRoute); // me - myEvents
app.use("/api/events", eventRoute); // addEventRequest,EditEventRequest,cancelEventRequest,getEventRequestDetails,getMyEventRequests,
app.use("/api/admin", adminRoute); // getAllUsers,getAllEvents,getAllEventRequests,approveEventRequest,rejectEventRequest,

//! ====== Start server ======
app.listen(3000, () => {
  console.log("Server running on port 3000");
});
