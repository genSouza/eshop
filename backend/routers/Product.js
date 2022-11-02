const express = require("express");
const router = express.Router();

router.get(`/`, async (req, res) => {
  try {
    const productList = await Product.find();

    if (productList.length != 0) {
      res.send(productList);
    }
    res.status(204).json(productList);
  } catch (error) {
    res.status(500).json(error);
  }
});

router.post(`/`, (req, res) => {
  const product = new Product({
    name: req.body.name,
    image: req.body.image,
    countInStock: req.body.countInStock,
  });

  product
    .save(product)
    .then((result) => {
      res.status(201).json(result);
    })
    .catch((error) => {
      res.status(500).json(error);
    });
});

module.exports = router;
