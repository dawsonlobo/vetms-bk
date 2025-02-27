import express from "express";
import dotenv from "dotenv";
import passport from "passport";
import mongoose from "mongoose";
import path from "path";
import { config } from "./config/config";
import { initializeModels } from "./models/index";
import { swaggerUi, swaggerSpec } from "./swagger";
import "./passport/passport"; // Ensure passport is configured before routes
import adminAuth from "./routes/v1/admin/auth"; // Use the correct route file
//import adminAuth from "./routes/v1/admin/auth"; // Use the correct route file
import patients from './routes/v1/admin/patients'
import users from './routes/v1/admin/users'
import inventories from './routes/v1/admin/inventories'
import appointments from './routes/v1/admin/appointments'
import doctorappointments from './routes/v1/doctor/appoitments'
import doctorpatients from './routes/v1/doctor/patient'
import followUps from './routes/v1/admin/followUps'
import doctorFollowUps from './routes/v1/doctor/followUps'
import billings from './routes/v1/admin/billings'
import payments from './routes/v1/admin/payments'
import doctors from './routes/v1/doctor/auth'
import rPatients from './routes/v1/receptionist/rPatients'
import rAppointments from './routes/v1/receptionist/rAppointments'
import nurseAuth from "./routes/v1/nurse/auth"; 
import ngrok from "ngrok";
dotenv.config();

const app = express();
app.use(express.json()); // Enable JSON parsing
app.use(passport.initialize()); // Initialize Passport.js//

// Connect to MongoDB using Mongoose
mongoose
  .connect(config.MONGODB_URI)
  .then(async () => {
    console.log("Connected to MongoDB");
    await initializeModels();
  })
  .catch((err) => console.error("Error connecting to MongoDB:", err));

app.use('/v1',adminAuth)
  app.use('/v1',doctors)
  app.use('/v1/doctor/followups',doctorFollowUps)
  app.use('/v1/doctor/appointments',doctorappointments)
  app.use('/v1/doctor/patients',doctorpatients)
  
app.use('/v1/admin/patients',patients)
app.use('/v1/admin/users',users)
app.use('/v1/admin/inventory',inventories)
app.use('/v1/admin/appointments',appointments)
app.use('/v1/admin/followUps',followUps)
app.use('/v1/admin/billings',billings)
app.use('/v1/admin/payments',payments)
app.use('/v1/receptionist/patients',rPatients);
app.use('/v1/receptionist/appointments',rAppointments);
app.use(express.urlencoded({ extended: true }));
app.use('/v1',nurseAuth)
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

//add
const port = config.PORT || 8000;
//app.listen(port, () => console.log(`🚀 Server running on http://localhost:${port}`));
app.listen(port, async () => {
  console.log(`Server is running on http://localhost:${port}`);
  try {
    // const url = await ngrok.connect({
    //   addr: port,
    //   authtoken: `${process.env.NGROK_AUTH_TOKEN}`,
    // });
    // console.log(`Ngrok tunnel available at: ${url}`);
  } catch (error) {
    console.error("Error starting ngrok:", error);
  }
});