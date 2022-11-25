function errorHandler(err, req, res, next) {
  if (err.status == 401) {
    console.log(
      "🚀 ~ file: Error-handler.js ~ line 3 ~ errorHandler ~ err",
      err
    );
    return res
      .status(401)
      .json({ message: "invalid authentication credentials" });
  } else if (err.status == 500) {
    return res
      .status(500)
      .json({ message: "internal server error", error: err });
  }
  next;
}

module.exports = errorHandler;
