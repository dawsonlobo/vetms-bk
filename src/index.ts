import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
// import helloRoute from "./routes/providers";
import { config } from "./config/config";
// import { initializeModels } from "./models/index";
import { swaggerUi, swaggerSpec } from "./swagger";
import { models } from "mongoose";
import path from "path";
import ngrok from "ngrok";

dotenv.config();

const app = express();

mongoose
  .connect(config.MONGODB_URI)
  .then(async () => {
    console.log("Connected to MongoDB");
    //await initializeModels();
  })
  .catch((err) => console.error("Error connecting to MongoDB:", err));

app.use((req, res, next) => {
  res.setHeader("ngrok-skip-browser-warning", "true");
  next();
});

app.use(
  "/v1/swagger/",
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec, { explorer: true })
);
app.use(express.static(path.join(__dirname, "../public")));
//app.use("/v1/api/", helloRoute);

const port = config.PORT || 8000;

app.listen(port, async () => {
  console.log(`Server is running on http://localhost:${port}`);
  try {
    const url = await ngrok.connect({
      addr: port,
      authtoken: `${process.env.NGROK_AUTH_TOKEN}`,
    });
    console.log(`Ngrok tunnel available at: ${url}`);
  } catch (error) {
    console.error("Error starting ngrok:", error);
  }
});
