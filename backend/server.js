const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Fake AI recommendations engine
app.post('/api/recommendations', (req, res) => {
  const { time, weather, mood } = req.body;
  
  // Logic mimicking the frontend MVP
  let suggestions = [];
  if (mood === 'stressed') {
    suggestions.push({ name: "Dark Chocolate", reason: "Antioxidants reduce cortisol" });
  } else if (mood === 'tired') {
    suggestions.push({ name: "Green Tea", reason: "Mild caffeine with L-theanine for jitter-free focus" });
  }

  res.json({ success: true, recommendations: suggestions });
});

// Mock Smart Swap
app.post('/api/swap', (req, res) => {
  const { food } = req.body;
  const db = {
    "burger": "Turkey Burger",
    "pizza": "Cauliflower Crust Pizza"
  };
  
  res.json({ 
    success: true, 
    swap: db[food.toLowerCase()] || "Grilled Chicken & Veggies",
    reason: "A safe, universal healthy swap."
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
