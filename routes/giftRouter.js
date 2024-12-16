const { Router } = require("express");
const giftController = require("../controllers/giftController");
const giftRouter = Router();

giftRouter.get("/", giftController.giftsGET);

giftRouter.get("/donate", giftController.donateGET);
giftRouter.post(
  "/donate",
  giftController.validateGift,
  giftController.donatePOST
);

giftRouter.get("/about", giftController.aboutGET);

giftRouter.get("/contact", giftController.contactGET);
giftRouter.post(
  "/contact",
  giftController.validateUser,
  giftController.contactPOST
);

// Password Verifying *********************
let isPasswordValid = false; // Simple flag to track password validation

giftRouter.use("/:id/update", (req, res, next) => {
  if (!isPasswordValid) {
    return res.render("password.ejs", {
      message: "Please enter your password to proceed.",
    });
  }
  next(); // Password is valid, proceed to the next middleware
});

giftRouter.use("/:id/delete", (req, res, next) => {
  if (!isPasswordValid) {
    return res.render("password.ejs", {
      message: "Please enter your password to proceed.",
    });
  }
  next(); // Password is valid, proceed to the next middleware
});

// Password validation route
giftRouter.post("/validate-password", (req, res) => {
  const inputPassword = req.body.password;
  const correctPassword = "your-secure-password"; // Replace with your actual password

  if (inputPassword === correctPassword) {
    isPasswordValid = true; // Set the flag to allow access to protected routes
    return res.redirect("back"); // Redirect back to the original request
  }

  res.render("password.ejs", { message: "Invalid password. Try again." });
});

giftRouter.get("/:id/update", giftController.updateGET);
giftRouter.post(
  "/:id/update",
  giftController.validateGift,
  (req, res, next) => {
    req.isPasswordValid = false; // Reset password validation for each request
    next();
  },
  giftController.updatePOST
);

giftRouter.post(
  "/:id/delete",
  (req, res, next) => {
    req.isPasswordValid = false; // Reset password validation for each request
    next();
  },
  giftController.deletePOST
);

module.exports = giftRouter;
