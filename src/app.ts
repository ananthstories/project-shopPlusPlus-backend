import express from "express";
import { connectDB, connectRedis } from "./utils/features.js";
import { errorMiddleware } from "./middlewares/error.js";
import { config } from "dotenv";
import morgan from "morgan";
import Razorpay from "razorpay";
import cors from "cors";
import { v2 as cloudinary } from "cloudinary";

// importing routes
import userRoute from "./routes/user.js";
import productRoute from "./routes/products.js";
import orderRoute from "./routes/order.js";
import paymentRoute from "./routes/payment.js";
import dashboardRoute from "./routes/stats.js";

// Load environment variables
config({ 
  path: "./.env",
});

// Environment variables with defaults
const PORT = process.env.PORT || 3000;
const mongoURI = process.env.MONGO_URI || "";
const redisURI = process.env.REDIS_URI || "";
const clientURL = process.env.CLIENT_URL || "";
export const redisTTL = process.env.REDIS_TTL || 60 * 60 * 4;

// Connect to MongoDB
connectDB(mongoURI);

// Connect to Redis
export const redis = connectRedis(redisURI);

// Cloudinary configuration
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET,
});

// Razorpay instance
const instance = new Razorpay({
    key_id: "rzp_test_tX1JxH0cwCZE24",
    key_secret: "NbnJMST3NXAAokxWXo9WCgxW",
});

// Middleware
const app = express();
app.use(express.json());
app.use(morgan("dev"));
app.use(cors({
        origin:  ["http://localhost:5173"], // Or set to the allowed origin 
        methods: ["GET", "POST", "PUT", "DELETE"],
        credentials: true, // Set to 'true' if you need credentials like cookies
    })
);

// Health Check Route
app.get("/", (req, res) => {
    res.send("API Working with /api/v1");
});

// Routes
app.use("/api/v1/user", userRoute);
app.use("/api/v1/product", productRoute);
app.use("/api/v1/order", orderRoute);
app.use("/api/v1/payment", paymentRoute);
app.use("/api/v1/dashboard", dashboardRoute);

// Static file serving
app.use("/uploads", express.static("uploads"));

// Error Handling Middleware
app.use(errorMiddleware);

// Start the server
app.listen(PORT, () => {
  console.log(`Server is working on http://localhost:${PORT}`);
});