// Logger
import winston from "winston";

const logger = winston.createLogger({
  level: "info",
  // format: winston.format.json(),
  format: winston.format.simple(),
  transports: [new winston.transports.Console()],
});

logger.info("Starting the Server 🎉 🎉 🎉 !");

import "express-async-errors";

// Load ENV Variables
import * as dotenv from "dotenv";
dotenv.config();

// Express
import express from "express";
const app = express();
app.use(express.json());
// app.use(express.urlencoded({ extended: true }))

// GCP Initialize Cloud Storage
logger.info("Attempting to connect to GCP Cloud Storage");
import { initializeApp, cert } from "firebase-admin/app";
const serviceAccount = JSON.parse(process.env.GCP_KEY);
initializeApp({
  credential: cert(serviceAccount),
  storageBucket: "cloudxapi.appspot.com",
});
logger.info("Connected to GCP Cloud Storage");

// Database
import { Sequelize } from "sequelize";
import pg from "pg";
const sequelize = new Sequelize(process.env.DB_URL, {
  logging: false,
  dialectModule: pg,
});

// Models
import fileModel from "./models/FileModel.js";
import userModel from "./models/UserModel.js";
const File = fileModel(sequelize);
const User = userModel(sequelize);
export { File, User };

// Morgan - better logging during Dev
import morgan from "morgan";

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

//cookie parser
import cookieParser from "cookie-parser";
app.use(cookieParser());

// routers
import fileRouter from "./routes/fileRouter.js";
import authRouter from "./routes/authRouter.js";
import userRouter from "./routes/userRouter.js";

// middleware
import errorHandlerMiddleware from "./middlewares/errorHandlerMiddleware.js";
import { authenticateUser } from "./middlewares/authMiddleware.js";

// app.get("/", (req, res) => {
//   res.send("Hello World");
// });

//test endpoint
app.get("/api/v1/test", (req, res) => {
  res.json({ msg: "Success" });
});

app.use("/api/v1/files", authenticateUser, fileRouter);
app.use("/api/v1/user", authenticateUser, userRouter);
app.use("/api/v1/auth", authRouter);

// Serve Frontend
import { dirname } from "path";
import { fileURLToPath } from "url";
import path from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));

app.use(express.static(path.resolve(__dirname, "./client/dist")));

app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "./client/dist", "index.html"));
});

// Route not found
app.use("*", (req, res) => {
  res.status(404).json({ msg: "Not Found" });
});

// Error in server
app.use(errorHandlerMiddleware);

// port
const port = process.env.PORT || 8000;

try {
  logger.info("Attempting to connect to Supabase Postgres");
  await sequelize.authenticate();
  sequelize.sync({ alter: true });
  logger.info("Connected to Supabase Postgres");

  // spin up the server
  app.listen(port, () => {
    logger.info(`Server running on PORT ${port}... 🎉 🎉 🎉 !`);
  });
} catch (error) {
  console.log(error);
  process.exit(1);
}

export default app;
