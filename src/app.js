import express from "express";
import "dotenv/config";
import morgan from "morgan";
import cors from "cors";
import connectDb from "../config/db.config.js";
import authRouter from "../routers/auth.router.js";
import categoryRouter from "../routers/categoryRoutes.js";
import productRouter from "../routers/productRoutes.js";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// middleware call

app.use(express.json());
app.use(morgan("dev"));
app.use(cors());
app.use(express.static(path.join(__dirname, "/client/build")));

// router call
app.use("/api", authRouter);
app.use("/api/category", categoryRouter);
app.use("/api/product", productRouter);

app.use("*", function (req, res) {
  res.sendFile(path.join(__dirname + "/client/build/index.html"));
});

// call database
connectDb();

export default app;
