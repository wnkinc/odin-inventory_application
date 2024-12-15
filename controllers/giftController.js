const db = require("../db/queries");

const links = [
  { href: "/", text: "Home" },
  { href: "/donate", text: "Donate" },
  { href: "/about", text: "About" },
  { href: "/contact", text: "Contact" },
];

const { body, validationResult } = require("express-validator");

const alphaErr = "must only contain letters.";
const lengthErr = "must be between 1 and 10 characters.";

const validateUser = [
  body("username")
    .trim()
    .notEmpty()
    .isAlpha()
    .withMessage(`Username ${alphaErr}`)
    .isLength({ min: 1, max: 10 })
    .withMessage(`Username ${lengthErr}`),
  body("email")
    .trim()
    .notEmpty()
    .isEmail()
    .withMessage("Email must be a valid email address.")
    .normalizeEmail(),
  body("password")
    .trim()
    .notEmpty()
    .isStrongPassword({
      minLength: 8,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1,
      returnScore: false,
    })
    .withMessage(
      "Password must be at least 8 characters long and include at least one lowercase letter, one uppercase letter, one number, and one symbol."
    ),
];

const validateGift = [
  body("name")
    .trim()
    .notEmpty()
    .isLength({ min: 1, max: 10 })
    .withMessage(`Gift name ${lengthErr}`),
  body("description")
    .trim()
    .notEmpty()
    .isLength({ min: 1, max: 100 })
    .withMessage(`Description must be between 1 and 100 characters.`),
  body("price")
    .trim()
    .notEmpty()
    .isFloat({ min: 1.0, max: 100.0 })
    .withMessage("Price must be between 1.00 and 100.00."),
];

async function giftsGET(req, res) {
  const gifts = await db.getAllGifts();
  const categories = await db.getCategories();
  const usernames = await db.getUsers();
  res.render("index", {
    title: "Gifts",
    links: links,
    gifts: gifts,
    categories: categories,
    usernames: usernames,
  });
}

async function donateGET(req, res) {
  const categories = await db.getCategories();
  const usernames = await db.getUsers();
  res.render("donate", {
    title: "Donate",
    links: links,
    categories: categories,
    usernames: usernames,
    data: { name: "", description: "", price: "" },
  });
}

async function donatePOST(req, res) {
  const errors = validationResult(req);

  const { usernames, name, description, price, age_group, category } = req.body;

  if (!errors.isEmpty()) {
    const categories = await db.getCategories(); // Re-fetch categories
    const allUsernames = await db.getUsers(); // Re-fetch usernames
    return res.render("donate", {
      title: "Donate",
      links: links,
      errors: errors.array(),
      categories: categories,
      usernames: allUsernames,
      data: { name, description, price },
    });
  }

  try {
    await db.insertGift(
      name,
      description,
      price,
      category,
      age_group,
      usernames
    );
    res.redirect("/");
  } catch (err) {
    console.error(err);
  }
}

async function aboutGET(req, res) {
  res.render("about", {
    title: "About Our Inventory Application",
    links: links,
  });
}

async function contactGET(req, res) {
  res.render("contact", {
    title: "Contact",
    links: links,
    data: { username: "", email: "", password: "" }, // Empty fields for initial load
  });
}

async function contactPOST(req, res) {
  const errors = validationResult(req);

  const { username, email, password } = req.body;

  if (!errors.isEmpty()) {
    return res.render("contact", {
      title: "Contact",
      links: links,
      errors: errors.array(),
      data: { username, email, password },
    });
  }

  try {
    // Try inserting the user
    await db.insertUser(username, email, password);
    res.redirect("/donate");
  } catch (error) {
    // Handle the error, e.g., send a response indicating the username is taken
    if (error.message === "Username already taken") {
      return res.render("contact", {
        title: "Contact",
        links: links,
        errors: [
          { msg: "Username is already taken, please choose another one." },
        ],
        data: { username, email, password },
      });
    }

    // Handle other errors
    return res.status(500).json({ error: "An unexpected error occurred." });
  }
}

module.exports = {
  giftsGET,
  donateGET,
  aboutGET,
  contactGET,
  contactPOST,
  validateUser,
  donatePOST,
  validateGift,
};
