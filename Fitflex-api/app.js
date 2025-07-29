const path = require("path");
const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const colors = require("colors");
const connectDB = require("./config/db");
const cookieParser = require("cookie-parser");
const mongoSanitize = require("express-mongo-sanitize");
const helmet = require("helmet");
const xss = require("xss-clean");
const bodyParser = require("body-parser");
const cors = require("cors");
const fs = require("fs");
const https = require("https");

const app = express();

// CORS setup
app.use(cors());
app.use(
  cors({
    origin: "https://localhost:5173",
    credentials: true,
  })
);
app.options("*", cors());


// Load env file
dotenv.config({
  path: "./config/config.env",
});

// Connect to database
connectDB();

// Route files
const auth = require("./routes/user");
const progress = require("./routes/progressRoutues");
const subscription = require("./routes/subscriptionRoutes");
const khaltiRoutes = require("./routes/khaltiRoutes");

// Body parser
app.use(express.json());
app.use(cookieParser());

app.use(bodyParser.json({}));
app.use(bodyParser.urlencoded({ extended: true }));

// Dev logging middleware
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Sanitize data
app.use(mongoSanitize());

// Set security headers
app.use(
  helmet({
    crossOriginEmbedderPolicy: false,
    crossOriginResourcePolicy: {
      policy: "cross-origin",
    },
  })
);

// Prevent XSS attacks
app.use(xss());

// Static file uploads
app.use("/uploads", (req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "https://localhost:5173");
  res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  next();
});
app.use("/uploads", express.static(path.join(__dirname, "public/uploads")));

// Mount routers
app.use("/api/v1/auth", auth);
app.use("/api/v1/progress", progress);
app.use("/api/v1/subscription", subscription);
app.use("/api/khalti", khaltiRoutes);

const PORT = process.env.PORT || 3001;

const httpsOptions = {
  key: fs.readFileSync(path.join(__dirname, "../certs/server.key")),
  cert: fs.readFileSync(path.join(__dirname, "../certs/server.crt")),
};

const server = https.createServer(httpsOptions, app).listen(PORT, () => {
  console.log(
    `✅ HTTPS Server running in ${process.env.NODE_ENV} mode on https://localhost:${PORT}`.yellow.bold
  );
});

// Handle unhandled promise rejections
process.on("unhandledRejection", (err, promise) => {
  console.log(`Error: ${err.message}`.red);
  server.close(() => process.exit(1));
});
