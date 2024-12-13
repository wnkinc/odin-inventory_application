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
  });
}

module.exports = {
  giftsGET,
  donateGET,
  aboutGET,
  contactGET,
};
