import express from "express";
import dotenv from "dotenv";
import passport from "passport";
import mongoose from "mongoose";
import path from "path";
import { config } from "./config/config";
import { initializeModels } from "./models/index";
import { swaggerUi, swaggerSpec } from "./swagger";
import "./config/passport"; // Ensure passport is configured before routes
import authRoutes from "./routes/auth"; // Use the correct route file

dotenv.config();

const app = express();
app.use(express.json()); // Enable JSON parsing
app.use(passport.initialize()); // Initialize Passport.js

// Connect to MongoDB
mongoose
  .connect(config.MONGODB_URI)
  .then(async () => {
    console.log("Connected to MongoDB");
    await initializeModels();
  })
  .catch((err) => console.error("Error connecting to MongoDB:", err));

// Serve static files
app.use(express.static(path.join(__dirname, "../public")));

// Swagger API Documentation
app.use("/v1/swagger", swaggerUi.serve, swaggerUi.setup(swaggerSpec, { explorer: true }));

// Use authentication routes
app.use("", authRoutes); // Ensure route prefix is added


const port = config.PORT || 8000;
app.listen(port, () => console.log(`🚀 Server running on http://localhost:${port}`));
