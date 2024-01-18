import express from "express";
import {
  createCategory,
  deleteCategory,
  getAllCategory,
  getSingleCategory,
  updateCategory,
} from "../controllers/categoryController.js";
import { isAdmin, userVerify } from "../middleware/auth.middleware.js";

const router = express.Router();

// create category
router.post("/create-category", userVerify, isAdmin, createCategory);

// update category
router.put("/update-category/:id", updateCategory);

// get all category
router.get("/get-category", getAllCategory);

// get single category
router.get("/single-category/:slug", getSingleCategory);

// delete category
router.delete("/delete-category/:id", userVerify, isAdmin, deleteCategory);

export default router;
