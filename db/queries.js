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

async function getUsers() {
  const result = await pool.query(
    "SELECT id, username FROM Users ORDER BY username;"
  );
  return result.rows;
}

async function insertUser(username, email, password) {
  const checkQuery = `
  SELECT 1 FROM Users WHERE username = $1;`;
  const checkResult = await pool.query(checkQuery, [username]);

  if (checkResult.rowCount > 0) {
    throw new Error("Username already taken");
  }

  const query = `
      INSERT INTO Users (username, email, password, created_at)
      VALUES ($1, $2, $3, NOW())
      RETURNING id;
    `;
  const result = await pool.query(query, [username, email, password]);

  // Return the inserted user ID
  return result.rows[0].id;
}

module.exports = {
  getAllGifts,
  getCategories,
  insertUser,
  getUsers,
};
