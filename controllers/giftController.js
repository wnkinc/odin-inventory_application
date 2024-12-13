const db = require("../db/queries");

const links = [
  { href: "/", text: "Home" },
  { href: "/new", text: "New" },
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
