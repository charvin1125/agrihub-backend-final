// const express = require("express");
// const mongoose = require("mongoose");
// const cors = require("cors");
// const session = require("express-session");
// const bodyParser = require("body-parser");
// const userRoutes = require("./routes/userRoutes");
// const vendorRoutes = require("./routes/vendor");
// const productRoutes = require("./routes/productRoutes");
// const categoryRoutes = require("./routes/category");
// const orderRoutes = require("./routes/orderRoutes");
// const dashboardRoutes = require("./routes/dashboardRoutes");
// const serviceRoutes = require("./routes/serviceRoutes");
// const bookingRoutes = require("./routes/bookingRoutes");
// const reviewRoutes = require('./routes/reviewRoutes');
// const laborRoutes = require('./routes/laborRoutes')
// // const chatRoutes = require('./routes/chatRoutes');
// // const cropPlanRoutes = require("./routes/cropPlanRoutes");
// // ✅ Add this

// // Routes


// const path = require("path");

// const app = express();
// const PORT = process.env.PORT || 5000;
// const MONGO_URI = "mongodb://localhost:27017/ai";

// // Middleware
// app.use(cors({ origin: "http://localhost:3000", credentials: true }));
// app.use(bodyParser.json());
// app.use(express.json());
// app.use(session({
//   secret: "charvin1121",
//   resave: false,
//   saveUninitialized: false,
//   cookie: { secure: false, httpOnly: true, sameSite: "lax",maxAge: 24 * 60 * 60 * 1000, },
// }));
// app.use(cors({
//   origin: "http://localhost:3000", // ✅ Must match frontend
//   credentials: true, // ✅ Allows session cookies
// }));
// app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// // Routes
// // app.use(cors({ origin: "http://localhost:5000", credentials: true }));
// app.use("/api/users", userRoutes);
// app.use("/api/vendor", vendorRoutes);
// app.use("/api/product", productRoutes);
// app.use("/api/category", categoryRoutes);
// app.use("/api/orders", orderRoutes);
// app.use("/api/bills", require("./routes/billRoutes"));
// app.use("/api/dashboard", dashboardRoutes);
// app.use("/api/labors", require("./routes/laborRoutes"));
// app.use("/api", require("./routes/bookingRoutes"));
// app.use("/api/services",serviceRoutes);// ✅ New route for d
// app.use("/api/bookings",bookingRoutes);
// app.use('/api/review', reviewRoutes);
// app.use('/api/labor', laborRoutes);
// // app.use('/api', chatRoutes);
// // app.use("/api", cropPlanRoutes);

// // ashboard analytics
// app.get("/api/check-session", (req, res) => {
//   console.log("🔍 Session data:", req.session);
//   res.json({ sessionData: req.session });
// });
// // Connect to MongoDB and start server
// mongoose
//   .connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
//   .then(() => {
//     app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
//   })
//   .catch((error) => console.log(error.message));

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const session = require("express-session");
const MongoStore = require("connect-mongo"); // Add for session persistence
const bodyParser = require("body-parser");
const path = require("path");
require("dotenv").config(); // Load .env variables

// Import routes
const userRoutes = require("./routes/userRoutes");
const vendorRoutes = require("./routes/vendor");
const productRoutes = require("./routes/productRoutes");
const categoryRoutes = require("./routes/category");
const orderRoutes = require("./routes/orderRoutes");
const billRoutes = require("./routes/billRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const serviceRoutes = require("./routes/serviceRoutes");
const bookingRoutes = require("./routes/bookingRoutes");
const reviewRoutes = require("./routes/reviewRoutes");
const laborRoutes = require("./routes/laborRoutes");

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/ai";
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:3000";
const SESSION_SECRET = process.env.SESSION_SECRET || "charvin1121";

// Middleware
app.use(express.json());
app.use(bodyParser.json());

// Configure CORS
app.use(
  cors({
    origin: FRONTEND_URL,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Configure session with MongoStore
app.use(
  session({
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: MONGO_URI,
      collectionName: "sessions",
    }),
    cookie: {
      secure: process.env.NODE_ENV === "production", // Secure in production
      httpOnly: true,
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    },
  })
);

// Serve static files
app.use("/uploads", express.static(path.join(__dirname, "Uploads")));

// Routes
app.use("/api/users", userRoutes);
app.use("/api/vendor", vendorRoutes);
app.use("/api/product", productRoutes);
app.use("/api/category", categoryRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/bills", billRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/services", serviceRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/review", reviewRoutes);
app.use("/api/labor", laborRoutes);

// Debug session
app.get("/api/check-session", (req, res) => {
  console.log("🔍 Session data:", req.session);
  res.json({ sessionData: req.session });
});

// Connect to MongoDB and start server
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));
