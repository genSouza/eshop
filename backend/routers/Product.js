const { Product } = require("../models/Product");
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

router.post(`/`, (req, res) => {
  let product = new Product({
    name: req.body.name,
    image: req.body.image,
    countInStock: req.body.countInStock,
  });

  product
    .save(product)
    .then((result) => {
      res.status(201).json({ success: true, result: result });
    })
    .catch((error) => {
      res.status(500).json({ success: false, error: error });
    });
});

module.exports = router;
