const { Product } = require("../models/Product");
const { Category } = require("../models/Category");
const { isValidID } = require("../utils/Utility");
const express = require("express");
const router = express.Router();

router.get(`/`, async (req, res) => {
  try {
    let filter = {};
    if (req.query.categories) {
      filter = { category: req.query.categories.split(",") };
    }
    const productList = await Product.find(filter).populate("category");

    if (productList.length != 0) {
      res.status(200).json({ success: true, result: productList });
    } else {
      res.status(200).json({ success: true, result: [] });
    }
  } catch (err) {
    res.status(500).json({ success: false, error: err });
  }
});

router.get(`/:id`, async (req, res) => {
  try {
    const check = isValidID(req.params.id.toString().trim());
    if (!check) {
      res.status(404).json({ success: false, message: "Id not valid" });
      return;
    }
    const result = await Product.findById(
      req.params.id.toString().trim()
    ).populate("category");

    if (result) {
      res.status(200).json({ success: true, result: result });
    } else {
      res.status(404).json({ success: false, message: "Id not found" });
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error });
  }
});

router.get("/get/count", async (req, res) => {
  try {
    const productCount = await Product.countDocuments();
    res.status(200).json({ success: true, result: productCount });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: err });
  }
});

router.get("/get/featured/:count", async (req, res) => {
  try {
    const count = req.params.count ? req.params.count : 0;
    const productList = await Product.find({ isFeatured: true }).limit(+count);
    res.status(200).json({ success: true, result: productList });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: err });
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

router.put("/:id", async (req, res) => {
  try {
    const category = await Category.findById(req.body.category);

    if (!category) {
      return res
        .status(404)
        .json({ success: false, message: "Invalid category" });
    }

    const result = await Product.findByIdAndUpdate(
      req.params.id.toString().trim(),
      {
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
      },
      { new: true }
    );

    res.status(200).json({ success: true, result: result });
  } catch (error) {
    res.status(500).json({ success: false, error: error });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const check = isValidID(req.params.id.toString().trim());
    if (!check) {
      res.status(404).json({ success: false, message: "Id not valid" });
    }
    const result = await Product.findByIdAndRemove(
      req.params.id.toString().trim()
    );
    if (result) {
      res.status(200).json({ success: true, message: "product was deleted" });
    } else {
      res.status(404).json({ success: false, message: "id not found" });
    }
  } catch (err) {
    res.status(500).json({ success: false, message: err });
  }
});

module.exports = router;
