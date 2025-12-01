// config/services_config.js
module.exports = {
  hospitality: {
    key: "hospitality",
    displayName: "Hospitality",
    pricingType: "perEvent", // or "perGuest"
    baseCost: 200,
    options: {
      drinks: { label: "Drinks", extraCost: 50 },
      food: { label: "Food", extraCost: 100 },
      cake: { label: "Cake", extraCost: 80 },
      icecream: { label: "Ice Cream", extraCost: 40 },
    },
  },
  camera: {
    key: "camera",
    displayName: "Photography / Videography",
    pricingType: "perEvent",
    baseCost: 100,
  },
  decoration: {
    key: "decoration",
    displayName: "Decoration",
    pricingType: "perEvent",
    baseCost: 150,
  },
  limousine: {
    key: "limousine",
    displayName: "Limousine",
    pricingType: "perEvent",
    baseCost: 300,
  },
  musicalBand: {
    key: "musicalBand",
    displayName: "Musical Band",
    pricingType: "perEvent",
    baseCost: 400,
  },
};
