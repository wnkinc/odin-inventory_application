#! /usr/bin/env node

require("dotenv").config(); // Load environment variables from .env file
const { Client } = require("pg");

// Use the appropriate connection string based on the environment
const dbUrl = process.env.DATABASE_URL || process.env.DB_LOCAL_URL;

const client = new Client({
  connectionString: dbUrl,
});

const SQL = `
DROP TABLE IF EXISTS Category_Items;
DROP TABLE IF EXISTS Gifts;
DROP TABLE IF EXISTS Users;
DROP TABLE IF EXISTS Categories;

CREATE TABLE Users (
    id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    username VARCHAR(255) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Categories (
    id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    name VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Gifts (
    id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    category_id INTEGER NOT NULL,
    age_group VARCHAR(100),
    user_id INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES Categories(id),
    FOREIGN KEY (user_id) REFERENCES Users(id)
);

CREATE TABLE Category_Items (
    id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    category_id INT REFERENCES Categories(id) ON DELETE CASCADE,
    item_id INT REFERENCES Gifts(id) ON DELETE CASCADE
);

-- Insert some sample users
INSERT INTO Users (username, email, password) VALUES
('john_doe', 'john@example.com', 'password123'),
('jane_smith', 'jane@example.com', 'securepass456');

-- Insert some sample categories
INSERT INTO Categories (name, description) VALUES
('Toys', 'Gift items for children, from plush toys to action figures'),
('Books', 'Books for children of various age groups'),
('Games', 'Board games, puzzles, and other interactive gifts'),
('Electronics', 'Electronic gifts including gadgets, devices, and toys');

-- Insert some sample gifts
INSERT INTO Gifts (name, description, price, category_id, age_group, user_id) VALUES
('Lego Set', 'A fun Lego building set for children', 49.99, 1, 'Kids (6-11 years)', 1),
('Children''s Book', 'A magical adventure book for young readers', 12.99, 2, 'Toddlers (3-5 years)', 2),
('Jenga Game', 'A classic game for all ages', 19.99, 3, 'Kids (6-11 years)', 1),
('Tablet for Kids', 'A kid-friendly tablet with educational apps', 129.99, 4, 'Teens (12+ years)', 2);

-- Link gifts to categories using Category_Items
INSERT INTO Category_Items (category_id, item_id) VALUES
(1, 1), -- Lego Set in Toys
(2, 2), -- Children\'s Book in Books
(3, 3), -- Jenga Game in Games
(4, 4); -- Tablet for Kids in Electronics
`;

async function main() {
  try {
    console.log("Connecting to:", dbUrl);

    await client.connect(); // Connect to the database

    console.log("Seeding data...");
    await client.query(SQL); // Run the SQL query to create table and insert data

    console.log("Seeding complete.");
  } catch (err) {
    console.error("Error during database operation:", err);
  } finally {
    await client.end(); // Always close the client connection
  }
}

main();
