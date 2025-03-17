require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const PORT = process.env.PORT || 5000;
const app = express();

app.use(express.json());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));

mongoose.connect(process.env.MONGODB_URI);

// Monitor MongoDB connection
mongoose.connection.on('connected', () => {
  console.log('🔄 Mongoose connected to DB');
});

mongoose.connection.on('error', (err) => {
  console.error('🚫 Mongoose connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('❌ Mongoose disconnected');
});
//Routes
app.use("/api/music", require("./routes/musicRoutes"));

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
