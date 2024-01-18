import express from "express";
import {
  login,
  register,
  test,
  forgotPasswordController,
  userProfileUpdate,
  getOrderController,
  getAllOrderController,
  updateOrderStatus,
} from "../controllers/auth.controller.js";
import { isAdmin, userVerify } from "../middleware/auth.middleware.js";

const router = express.Router();

// register router
router.post("/register", register);
// login router
router.post("/login", login);
// Forgot password || post
router.post("/forgot-password", forgotPasswordController);

router.get("/test", test);

// protected user route auth
router.get("/user-auth", userVerify, (req, res) => {
  res.status(200).send({ ok: true });
});
// protected admin route auth
router.get("/admin-auth", userVerify, isAdmin, (req, res) => {
  res.status(200).send({ ok: true });
});

// user profile updated
router.put("/profile", userVerify, userProfileUpdate);

// order router
router.get("/orders", userVerify, getOrderController);

// get all orders
router.get("/all-orders", userVerify, isAdmin, getAllOrderController);

// update orider status
router.put("/update-status/:orderId", userVerify, isAdmin, updateOrderStatus);

export default router;
