const db = require("../db/queries");

const links = [
  { href: "/", text: "Home" },
  { href: "/donate", text: "Donate" },
  { href: "/about", text: "About" },
  { href: "/contact", text: "Contact" },
];

async function giftsGET(req, res) {
  const gifts = await db.getAllGifts();
  res.render("index", {
    title: "Gifts",
    links: links,
    gifts: gifts,
  });
}

async function donateGET(req, res) {
  const categories = await db.getCategories();
  res.render("donate", {
    title: "Donate",
    links: links,
    categories: categories,
  });
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
  const { username, email, password } = req.body;

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
};
