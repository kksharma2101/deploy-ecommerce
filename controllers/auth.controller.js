import {
  passwordCompare,
  passwordHash,
} from "../middleware/password.middleware.js";
import User from "../models/userModel.js";
import AppError from "../utils/error.utils.js";
import JWT from "jsonwebtoken";
import orderModel from "../models/orderModel.js";
import { json } from "express";

// cookieOpetions
// const cookieOptions = {
//   maxAge: 2 * 24 * 60 * 60 * 1000,
//   httpOnly: true,
// };

// register controllers
const register = async (req, res, next) => {
  try {
    const { name, email, password, phone, address, role, answer } = req.body;
    // check conditions
    if (!(name, email, password, phone, address, answer)) {
      return next(new AppError("All field is required", 405));
    }

    // email exists
    const existsEmail = await User.findOne({ email });
    if (existsEmail) {
      return next(new AppError("Email is already exists", 405));
    }

    // password bcrypt
    const passwordHashed = await passwordHash(password);

    // create user
    const user = await User.create({
      name,
      email,
      password: passwordHashed,
      phone,
      address,
      role,
      answer,
    });
    if (!user) {
      return next(new AppError("User is not register, try again", 405));
    }

    await user.save();
    user.password = undefined;

    // generate cookie
    const token = await JWT.sign(
      {
        id: user._id,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "2d",
      }
    );

    // res.cookie("token", token, cookieOptions);

    res.status(200).json({
      success: true,
      message: "User register successfully",
      user,
      token,
    });
  } catch (e) {
    return next(new AppError(e.message, 404));
  }
};

// login controllers
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!(email, password)) {
      return next(new AppError("All data require", 404));
    }

    const user = await User.findOne({ email });
    if (!user) {
      res.status(404).json({
        success: false,
        message: "Email is not match",
      });
    }

    // compare password
    const match = await passwordCompare(password, user.password);
    if (!match) {
      return next(new AppError("Password does not match", 404));
    }

    user.password = undefined;

    // generate jwt token
    const token = await JWT.sign(
      {
        _id: user._id,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "2d",
      }
    );

    // res.cookie("token", token, cookieOptions);

    res.status(200).json({
      success: true,
      message: "User logged successfully",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
        role: user.role,
      },
      token,
    });
  } catch (e) {
    return next(new AppError(e.message, 404));
  }
};

// forgotPasswordController
const forgotPasswordController = async (req, res) => {
  try {
    const { email, answer, newPassword } = req.body;
    if (!(email, answer, newPassword)) {
      res.status(404).send({
        message: "Something is wrong",
      });
    }
    const user = await User.findOne({ email, answer });
    if (!user) {
      res.status(404).send({
        message: "Wrong email or answer",
      });
    }
    const hashed = await passwordHash(newPassword);
    await User.findByIdAndUpdate(user._id, { password: hashed });
    res.status(200).json({
      success: true,
      message: "Password reset successfully",
      user,
    });
  } catch (e) {
    res.status(400).json({
      success: false,
      message: e.message,
    });
  }
};

// user profile updated
const userProfileUpdate = async (req, res) => {
  try {
    const { name, phone, address, password } = req.body;

    const user = await User.findById(req.user._id);

    // check password
    if (password && password.length < 6) {
      return res.json({
        error: "Password required is grater then six character",
      });
    }

    // password hashed
    const passwordHashed = await (password
      ? passwordHash(password)
      : undefined);

    const updateUser = await User.findByIdAndUpdate(
      req.user._id,
      {
        name: name || user.name,
        phone: phone || user.phone,
        address: address || user.address,
        password: passwordHashed || user.password,
      },
      { new: "true" }
    );
    // updateUser.save()

    res.status(200).json({
      success: true,
      message: "User profile updated successfully",
      updateUser,
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: "Error in user updated profile ",
      error,
    });
  }
};

// order controller
const getOrderController = async (req, res) => {
  try {
    const orders = await orderModel
      .find({ buyer: req.user._id })
      .populate("products", "-photo")
      .populate("buyer", "name");
    res.json(orders);
  } catch (error) {
    res.status(404).json({
      success: false,
      message: "Error in order controller",
      error,
    });
  }
};

// get all orders
const getAllOrderController = async (req, res) => {
  try {
    const orders = await orderModel
      .find({})
      .populate("products", "-photo")
      .populate("buyer", "name");
    // .sort({ createdAt: "-1" });
    res.json(orders);
  } catch (error) {
    res.status(404).json({
      success: false,
      message: "Error in getAllorder controller",
      error,
    });
  }
};

// update order status
const updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;
    const order = await orderModel.findByIdAndUpdate(
      orderId,
      { status },
      { new: true }
    );
    res.status(200).json({
      success: true,
      message: "Order updated successfully",
      order,
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: "Error in updateOrderStatus",
      error,
    });
  }
};

// test controllers
const test = (req, res) => {
  res.send("check user verify");
};

export {
  register,
  login,
  test,
  forgotPasswordController,
  userProfileUpdate,
  getOrderController,
  getAllOrderController,
  updateOrderStatus,
};
