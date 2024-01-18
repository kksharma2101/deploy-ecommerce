import Category from "../models/categoryModels.js";
import slugify from "slugify";

// create category
export const createCategory = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(401).send({ message: "Name is required" });
    }
    const existingCategory = await Category.findOne({ name });
    if (existingCategory) {
      return res.status(200).send({
        success: false,
        message: "Name Already Exisits",
      });
    }
    const category = await new Category({
      name,
      slug: slugify(name),
    }).save();
    res.status(201).send({
      success: true,
      message: "new category created",
      category,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Errro in Category",
    });
  }
};

// update category
export const updateCategory = async (req, res) => {
  try {
    const { name } = req.body;
    const { id } = req.params;

    const category = await Category.findByIdAndUpdate(
      id,
      { name, slug: slugify(name) },
      { new: true }
    );
    if (!category) {
      res.status(400).send({
        message: "update category is not found",
      });
    }
    res.status(200).json({
      success: true,
      message: "Category updated successfully",
      category,
    });
  } catch (error) {
    console.log(error);
    res.status(404).json({
      success: false,
      message: "Error in update category",
    });
  }
};

// get all category
export const getAllCategory = async (req, res) => {
  try {
    const category = await Category.find({});

    res.status(200).json({
      success: true,
      message: "All category list get successfully",
      category,
    });
  } catch (error) {
    console.log(error);
    res.status(404).json({
      success: false,
      error,
      message: "Error while getting all category",
    });
  }
};

//get single category
export const getSingleCategory = async (req, res) => {
  try {
    const category = await Category.findOne({ slug: req.params.slug });

    res.status(200).json({
      success: true,
      message: "Get single category successfully",
      category,
    });
  } catch (error) {
    console.log(error);
    res.status(404).json({
      success: false,
      message: "Error in getting single category",
      error,
    });
  }
};

// delete category
export const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    await Category.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Category delete successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(404).json({
      success: false,
      error,
      message: "Category is not deleted please, try again",
    });
  }
};
