const pool = require("./pool");

async function getAllGifts() {
  const result = await pool.query("SELECT * FROM Gifts");
  return result.rows;
}

async function getCategories() {
  const result = await pool.query(
    "SELECT id, name FROM Categories ORDER BY name;"
  );
  return result.rows;
}

module.exports = {
  getAllGifts,
  getCategories,
};
