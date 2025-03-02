const express = require("express");
const cors = require("cors");
require("dotenv").config();
const db = require("./database");

const app = express();
app.use(express.json());
app.use(cors());

// Test route to fetch contacts
app.get("/contacts", (req, res) => {
    db.query("SELECT * FROM emergency_contacts", (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(results);
    });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));


//add contacts
app.post("/add-contact", async (req, res) => {
    const { name, phone } = req.body;
    if (!name || !phone) {
        return res.status(400).json({ error: "Name and phone are required" });
    }

    try {
        const result = await db.execute(
            "INSERT INTO contacts (name, phone) VALUES (?, ?)",
            [name, phone]
        );
        res.json({ message: "Contact added successfully!" });
    } catch (error) {
        console.error("Error adding contact:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// User Signup Route
app.post("/signup", async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ error: "All fields are required" });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        await db.execute(
            "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
            [name, email, hashedPassword]
        );
        res.json({ message: "User registered successfully!" });
    } catch (error) {
        console.error("Signup Error:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// User Login Route
app.post("/login", async (req, res) => {
    const { email, password } = req.body;

    try {
        const [users] = await db.execute("SELECT * FROM users WHERE email = ?", [email]);
        if (users.length === 0) {
            return res.status(400).json({ error: "User not found" });
        }

        const user = users[0];
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(401).json({ error: "Invalid credentials" });
        }

        const token = jwt.sign({ id: user.id }, "your_secret_key", { expiresIn: "1h" });
        res.json({ message: "Login successful!", token });
    } catch (error) {
        console.error("Login Error:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

//for authentication 
const jwt = require("jsonwebtoken");

// Middleware to verify token
const authenticateUser = (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
        return res.status(403).json({ error: "Unauthorized Access" });
    }

    try {
        const decoded = jwt.verify(token, "your_secret_key");
        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).json({ error: "Invalid Token" });
    }
};

// Protect the panic alert route
app.post("/panic-alert", authenticateUser, (req, res) => {
    console.log("Panic Alert Received from User ID:", req.user.id);
    res.json({ message: "Alert Sent!" });
});

// Protect the emergency contacts route
app.get("/emergency-contacts", authenticateUser, async (req, res) => {
    try {
        const [contacts] = await db.execute("SELECT * FROM contacts WHERE user_id = ?", [req.user.id]);
        res.json(contacts);
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
});




