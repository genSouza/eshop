const { Product } = require("../models/Product");
const { Category } = require("../models/Category");
const express = require("express");
const router = express.Router();

router.get(`/`, async (req, res) => {
  try {
    const productList = await Product.find();

    if (productList.length != 0) {
      res.status(200).json({ success: true, result: productList });
    } else {
      res.status(200).json({ success: true, result: [] });
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error });
  }
});

router.get(`/:id`, async (req, res) => {
  try {
    const result = await Product.findById(req.params.id.toString().trim());

    if (result) {
      res.status(200).json({ success: true, result: result });
    } else {
      res.status(404).json({ success: false, message: "Id not found" });
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error });
  }
});

router.post(`/`, async (req, res) => {
  try {
    const category = await Category.findById(req.body.category);

    if (!category)
      return res
        .status(404)
        .json({ success: false, message: "Invalid Category" });

    const product = new Product({
      name: req.body.name,
      description: req.body.description,
      richDescription: req.body.richDescription,
      image: req.body.image,
      images: req.body.images,
      price: req.body.price,
      category: req.body.category,
      countInStock: req.body.countInStock,
      rating: req.body.rating,
      numberOfReviews: req.body.numberOfReviews,
      isFeatured: req.body.isFeatured,
      dateCreated: req.body.dateCreated,
    });

    const result = await product.save();
    if (result) {
      res.status(201).json({ success: true, result: result });
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error });
  }
});

module.exports = router;
