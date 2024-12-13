require("dotenv").config();

const express = require("express");
const app = express();
const path = require("path");
const giftRouter = require("./routes/giftRouter");

app.use(express.static(path.join(__dirname, "public")));

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));

app.use("/", giftRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Express app - listening on port ${PORT}!`);
});
