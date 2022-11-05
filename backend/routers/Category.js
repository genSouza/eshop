const { Category } = require("../models/Category");
const express = require("express");
const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const categoryList = await Category.find();

    if (categoryList.length != 0) {
      res.status(200).json({ success: true, result: categoryList });
    } else {
      res.status(200).json({ success: true, result: [] });
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error });
  }
});

router.post("/", async (req, res) => {
  try {
    const category = new Category({
      name: req.body.name,
      icon: req.body.icon,
      color: req.body.color,
    });
    result = await category.save();

    if (result) {
      res.status(201).json({ success: true, result: result });
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const result = await Category.findByIdAndRemove(
      req.params.id.toString().trim()
    );
    if (result) {
      res.status(200).json({ success: true, message: "category deleted" });
    } else {
      res.status(404).json({ success: false, message: "id not found" });
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error });
  }
});

module.exports = router;
