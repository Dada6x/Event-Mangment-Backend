const mongoose = require("mongoose");
const Venue = require("./model/venue_model");
const User = require("./model/user_model");

// Choose whichever connection you prefer:
const MONGO_URI = "mongodb://127.0.0.1:27017/Event_mangment";

async function seed() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("Connected to DB");

    // ----- Clear existing data -----
    await Venue.deleteMany({});
    await User.deleteMany({});
    console.log("Cleared Venues & Users collections");

    // ----- Seed Venues -----
    await Venue.insertMany([
      {
        name: "Royal Lounge",
        type: "lounge",
        address: "Main Street 123",
        image: "https://example.com/lounge.jpg",
        baseCost: 1500,
        maxCapacity: 100,
      },
      {
        name: "Grand Theatre",
        type: "theatre",
        address: "Broadway 7",
        image: "https://example.com/theatre.jpg",
        baseCost: 2500,
        maxCapacity: 300,
      },
    ]);

    console.log("Venues seeded");

    // ----- Seed Users -----
    await User.insertMany([
      {
        name: "yahieaDada",
        email: "yahieadada@gmail.com",
        password:
          "$2b$10$m7Z/Sa1jDjOcoKW8/92Z5Ob6pXFIXmJHHevvAuuuT70nNap46DS2C",
        role: "user",
        avatar: null,
        createdAt: new Date("2025-11-30T08:59:58.712Z"),
        updatedAt: new Date("2025-11-30T08:59:58.712Z"),
      },
      {
        name: "Admin",
        email: "yahieaadmin@gmail.com",
        password:
          "$2b$10$II0tH9tq0IY6gwBY03XwDe5EsTq26PWOMvh5YsJQT.dIpcLllFe.C",
        role: "admin",
        avatar: null,
        createdAt: new Date("2025-11-30T11:13:18.972Z"),
        updatedAt: new Date("2025-11-30T11:13:18.972Z"),
      },
    ]);

    console.log("Users seeded");

    console.log("🌱 Seeding completed successfully!");
    process.exit(0);
  } catch (err) {
    console.error("Seeding error:", err);
    process.exit(1);
  }
}

seed();
