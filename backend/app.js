require("dotenv/config");
const express = require("express");
const mongoose = require("mongoose");
const morgan = require("morgan");
const cors = require("cors");
const app = express();
const port = process.env.APP_PORT;
const api = process.env.API_URL;
const productsRouter = require("./routers/Product");
const categoryRouter = require("./routers/Category");
const userRouter = require('./routers/User');
const authJwt = require("./utils/Jwt");


app.use(cors());
app.options("*", cors());
app.use(express.json());

/**Middleware */
app.use(morgan("tiny"));
app.use(authJwt());

app.use(`${api}/products`, productsRouter);
app.use(`${api}/categories`, categoryRouter);
app.use(`${api}/users`, userRouter);

mongoose
  .connect(process.env.CONNECTION_STRING)
  .then(() => {
    console.log("Database connection is ready");
  })
  .catch((err) => {
    console.error(err);
  });

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
