require("dotenv/config");
const { isValidID } = require("../utils/Utility");
const { User } = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const express = require("express");
const router = express.Router();
const secret = process.env.SECRET;
router.get("/", async (req, res) => {
  try {
    const userList = await User.find().select([
      "-password",
      "-passwordHash",
      "-salt",
    ]);

    if (userList.length != 0) {
      res.status(200).json({ success: true, result: userList });
    } else {
      res.status(200).json({ success: true, result: [] });
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const check = isValidID(req.params.id.toString().trim());
    if (!check) {
      res.status(404).json({ success: false, message: "Id not valid" });
      return;
    }

    const result = await User.findById(req.params.id.toString().trim()).select([
      "-password",
      "-passwordHash",
      "-salt",
    ]);
    if (result) {
      res.status(200).json({ success: true, result: result });
    } else {
      res.status(404).json({ success: false, message: "id not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: error });
  }
});

router.post("/", async (req, res) => {
  const saltRounds = 10;
  const salt = bcrypt.genSaltSync(saltRounds);
  try {
    let user = new User({
      name: req.body.name,
      email: req.body.email,
      password: bcrypt.hashSync(req.body.password, salt),
      salt: salt,
      street: req.body.street,
      apartment: req.body.apartment,
      city: req.body.city,
      zip: req.body.zip,
      country: req.body.country,
      phone: req.body.phone,
      isAdmin: req.body.isAdmin,
    });
    const result = await user.save();

    if (result) return res.status(201).json({ success: true, result: result });
  } catch (err) {
    return res
      .status(500)
      .json({ success: false, error: "Error on create user" });
  }
});

router.put("/:id", async (req, res) => {
  const check = isValidID(req.params.id.toString().trim());
  if (!check) {
    res.status(404).json({ success: false, message: "Id not valid" });
    return;
  }
  try {
    const userExist = await User.findById(req.params.id);
    if (!userExist) {
      res.status(404).json({ success: false, message: "user not found" });
      return;
    }

    const saltRounds = 10;
    const salt = req.body.password
      ? bcrypt.genSaltSync(saltRounds)
      : userExist.salt;
    const result = await User.findByIdAndUpdate(
      req.params.id.toString().trim(),
      {
        name: req.body.name,
        email: req.body.email,
        password: req.body.password
          ? bcrypt.hashSync(req.body.password, salt)
          : userExist.password,
        salt: salt,
        street: req.body.street,
        apartment: req.body.apartment,
        city: req.body.city,
        zip: req.body.zip,
        country: req.body.country,
        phone: req.body.phone,
        isAdmin: req.body.isAdmin,
      },
      { new: true }
    );
    if (result) {
      res.status(200).json({ success: true, result: result });
    } else {
      res.status(404).json({ success: false, message: "Id not found" });
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error });
  }
});

router.post("/login", async (req, res) => {
  if (!req.body.email || !req.body.password) {
    return res.status(400).send("password and email are required");
  }

  const user = await User.findOne({ email: req.body.email });

  if (user && bcrypt.compareSync(req.body.password, user.password)) {
    const token = jwt.sign(
      {
        userId: user.id,
        isAdmin: user.isAdmin
      },
      secret,
      { expiresIn: "1d" }
    );
    return res.status(200).send({ user: user.email, token: token });
  } else {
    return res.status(400).send("Invalid user or password");
  }
});

module.exports = router;
