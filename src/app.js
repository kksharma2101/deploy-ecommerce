import express from "express";
import "dotenv/config";
import morgan from "morgan";
import cors from "cors";
import connectDb from "../config/db.config.js";
import authRouter from "../routers/auth.router.js";
import categoryRouter from "../routers/categoryRoutes.js";
import productRouter from "../routers/productRoutes.js";

const app = express();

// middleware call

app.use(express.json());
app.use(morgan("dev"));
app.use(
  cors({
    origin: "https://e-commerce-gset6bwru-kamal-sharmas-projects.vercel.app",
  })
);

// router call
app.use("/api", authRouter);
app.use("/api/category", categoryRouter);
app.use("/api/product", productRouter);

// call database
connectDb();

export default app;
