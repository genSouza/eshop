const mongoose = require("mongoose");

const isValidID = (id) => {
    console.log(id);
  if (mongoose.isValidObjectId(id)) {
    return true;
  }
  return false;
};


exports.isValidID = isValidID;