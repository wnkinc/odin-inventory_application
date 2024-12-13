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

module.exports = {
  giftsGET,
};
