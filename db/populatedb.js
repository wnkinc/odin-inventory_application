#! /usr/bin/env node

require("dotenv").config(); // Load environment variables from .env file
const { Client } = require("pg");

// Use the appropriate connection string based on the environment
const dbUrl = process.env.DATABASE_URL || process.env.DB_LOCAL_URL;

const client = new Client({
  connectionString: dbUrl,
});

const SQL = `
DROP TABLE IF EXISTS messages;

CREATE TABLE messages (
   id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
   name VARCHAR(255) NOT NULL,  
   message TEXT,                
   created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP 
);


INSERT INTO messages (message, name, created_at)
VALUES
  ('Hi there!', 'Amando', NOW()),
  ('Hello World!', 'Charles', NOW());

`;

async function main() {
  try {
    console.log("Connecting to:", dbUrl);

    await client.connect(); // Connect to the database

    console.log("Seeding data...");
    await client.query(SQL); // Run the SQL query to create table and insert data

    console.log("Fetching data from messages table...");
    const result = await client.query("SELECT * FROM messages;"); // Fetch all rows from the messages table
    console.log("Inserted messages:", result.rows); // Log the fetched rows to ensure the data is there

    console.log("Seeding complete.");
  } catch (err) {
    console.error("Error during database operation:", err);
  } finally {
    await client.end(); // Always close the client connection
  }
}

main();
