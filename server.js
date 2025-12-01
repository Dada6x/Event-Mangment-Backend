// server.js
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
// require("dotenv").config();
const authRoute = require("./routes/auth_routes");
const userRoute = require("./routes/user_routes");
const eventRoute = require("./routes/event_routes");
const adminRoute = require("./routes/admin_routes");
const servicesRoutes = require("./routes/services_routes");
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
//! ====== SwaggerUI ======
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.get("/", (req, res) => {
  res.send("API running");
});
//? swagger_URL:  http://localhost:3000/api-docs/

//! ====== Routes ======
app.use("/api", userRoute);
app.use("/api/auth", authRoute);
app.use("/api/events", eventRoute);
app.use("/api/admin", adminRoute);
app.use("/api/services", servicesRoutes);
//! ====== Start server ======
app.listen(3000, () => {
  console.log("Server running on port 3000");
});

/*
$ the body of the request in patch create new event
{
  "eventName": "Party in Lounge",
  "eventDescription": "Lounge in the Royal  LOUNGEEE",
  "occasionType": "private",
  "eventDate": "2025-12-10",
  "eventTime": "20:00",
  "maxAttendance": 50,
  "eventType": "custom",
  "locationType": "lounge",
  "venueId":"692d541c55f354db0bec9f0a",

  "services": {
    "hospitality": {
      "enabled": true,
      "drinks": true,
      "food": true,
      "cake": false,
      "icecream": false
    },
    "camera": {
      "enabled": true
    },
    "decoration": {
      "enabled": true
    },
    "limousine": {
      "enabled": false
    },
    "musicalBand": {
      "enabled": false
    }
  }
}

*/
