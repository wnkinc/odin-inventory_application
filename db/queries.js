const pool = require("./pool");

async function getAllGifts() {
  const result = await pool.query("SELECT * FROM Gifts");
  return result.rows;
}

async function searchGifts(filters) {
  const { username, age_group, category } = filters;

  // Base query
  let query = `
    SELECT 
      Gifts.id, 
      Gifts.name, 
      Gifts.description, 
      Gifts.price, 
      Gifts.age_group, 
      Gifts.created_at,
      Users.username AS user_name,
      Categories.name AS category_name
    FROM Gifts
    INNER JOIN Users ON Gifts.user_id = Users.id
    INNER JOIN Categories ON Gifts.category_id = Categories.id
    WHERE 1=1
  `;

  const values = [];

  // Add filters dynamically
  if (username) {
    query += " AND Users.id = $1";
    values.push(username);
  }
  if (age_group) {
    query += ` AND Gifts.age_group = $${values.length + 1}`;
    values.push(age_group);
  }
  if (category) {
    query += ` AND Categories.id = $${values.length + 1}`;
    values.push(category);
  }

  // Execute query
  try {
    const result = await pool.query(query, values);
    return result.rows; // Return the matching rows
  } catch (error) {
    console.error("Error searching gifts:", error);
    throw new Error("Failed to retrieve gifts.");
  }
}

async function insertGift(
  name,
  description,
  price,
  category_id,
  age_group,
  user_id
) {
  const query = `
      INSERT INTO Gifts (name, description, price, category_id, age_group, user_id, created_at)
      VALUES ($1, $2, $3, $4, $5, $6, NOW())
      RETURNING id;
    `;
  const result = await pool.query(query, [
    name,
    description,
    price,
    category_id,
    age_group,
    user_id,
  ]);

  // Return the inserted user ID
  return result.rows[0].id;
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
  insertGift,
  searchGifts,
};
