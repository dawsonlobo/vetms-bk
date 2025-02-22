import express from "express";
import dotenv from "dotenv";
import passport from "passport";
import mongoose from "mongoose";
import path from "path";
import { config } from "./config/config";
import { initializeModels } from "./models/index";
import { swaggerUi, swaggerSpec } from "./swagger";
import "./config/passport"; // Ensure passport is configured before routes
import auth from "./routes/auth"; // Use the correct route file
import patients from './routes/patients'
import users from './routes/users'
import inventories from './routes/inventories'
import appointments from './routes/appointments'
import followUps from './routes/followUps'
import billings from './routes/billings'
import payments from './routes/payments'

 //import ngrok from "ngrok";

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
app.use('/v1',auth)
app.use('/v1/admin/patients',patients)
app.use('/v1/admin/users',users)
app.use('/v1/admin/inventory',inventories)

// Serve static files
app.use('/v1/admin/appointments',appointments)
app.use('/v1/admin/followUps',followUps)
app.use('/v1/admin/billings',billings)
app.use('/v1/admin/payments',payments)
app.use(express.urlencoded({ extended: true }));
// app.use((req, res, next) => {
//   res.setHeader("ngrok-skip-browser-warning", "true");
//   next();
// });

app.use(
  "/v1/swagger/",
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec, { explorer: true })
);
app.use(express.static(path.join(__dirname, "../public")));

// Swagger API Documentation
app.use("/v1/swagger", swaggerUi.serve, swaggerUi.setup(swaggerSpec, { explorer: true }));

// Use authentication routes// Ensure route prefix is added


const port = config.PORT || 8000;
app.listen(port, () => console.log(`🚀 Server running on http://localhost:${port}`));
