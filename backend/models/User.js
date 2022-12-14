const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: { type: String, required: true },

  salt: { type: String, required: true },

  street: {
    type: String,
    required: true,
  },

  apartment: {
    type: String,
    required: true,
  },

  city: {
    type: String,
    required: true,
  },

  zip: {
    type: String,
    required: true,
  },

  country: {
    type: String,
    required: true,
  },

  phone: {
    type: String,
    required: true,
  },

  isAdmin: {
    type: Boolean,
    required: true,
  },
});

userSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

userSchema.set("toJSON", {
  virtuals: true,
});

exports.User = mongoose.model("User", userSchema);
