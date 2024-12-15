const db = require("../db/queries");

const links = [
  { href: "/", text: "Home" },
  { href: "/donate", text: "Donate" },
  { href: "/about", text: "About" },
  { href: "/contact", text: "Contact" },
];

const { body, validationResult } = require("express-validator");

const alphaErr = "must only contain letters.";
const lengthErr = "must be between 1 and 15 characters.";

const validateUser = [
  body("username")
    .trim()
    .notEmpty()
    .isAlpha()
    .withMessage(`Username ${alphaErr}`)
    .isLength({ min: 1, max: 15 })
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
    .isLength({ min: 1, max: 15 })
    .withMessage(`Gift name ${lengthErr}`),
  body("description")
    .trim()
    .notEmpty()
    .isLength({ min: 1, max: 100 })
    .withMessage(`Description must be between 1 and 100 characters.`),
  body("price")
    .trim()
    .notEmpty()
    .isFloat({ min: 1.0, max: 255.0 })
    .withMessage("Price must be between 1.00 and 255.00."),
];

async function giftsGET(req, res) {
  const { username, age_group, category } = req.query; // Extract query parameters

  try {
    let gifts;

    // Check if any filter parameters are provided
    if (username || age_group || category) {
      // Pass the query parameters to db.searchGifts for filtering
      gifts = await db.searchGifts({ username, age_group, category });
    } else {
      // Fetch all gifts if no filters are applied
      gifts = await db.getAllGifts();
    }

    const categories = await db.getCategories();
    const usernames = await db.getUsers();

    res.render("index", {
      title: "Gifts",
      links: links,
      gifts: gifts,
      categories: categories,
      usernames: usernames,
    });
  } catch (error) {
    console.error("Error fetching gifts:", error);
    res.status(500).send("An error occurred while retrieving the gifts.");
  }
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

async function updateGET(req, res) {
  const gift = await db.getGift(req.params.id);
  const categories = await db.getCategories();
  const allUsernames = await db.getUsers();

  res.render("update", {
    id: req.params.id,
    title: "Update",
    links: links,
    gift: gift,
    categories: categories,
    usernames: allUsernames,
  });
}

async function updatePOST(req, res) {
  const errors = validationResult(req);

  const { usernames, name, description, price, age_group, category } = req.body;

  if (!errors.isEmpty()) {
    const categories = await db.getCategories(); // Re-fetch categories
    const allUsernames = await db.getUsers(); // Re-fetch usernames
    const gift = await db.getGift(req.params.id);

    return res.render("update", {
      title: "update",
      links: links,
      errors: errors.array(),
      gift: gift,
      categories: categories,
      usernames: allUsernames,
    });
  }

  try {
    await db.updateGift(
      req.params.id,
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

async function deletePOST(req, res) {
  await db.deleteGift(req.params.id);
  res.redirect("/");
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
  updateGET,
  updatePOST,
  deletePOST,
};
