const pool = require("./pool");

async function getAllGifts() {
  const result = await pool.query("SELECT * FROM Gifts");
  return result.rows;
}

module.exports = {
  getAllGifts,
};
