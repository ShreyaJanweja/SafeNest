// const express = require("express");
// const cors = require("cors");
// require("dotenv").config();

// const app = express();
// app.use(express.json());
// app.use(cors());

// app.post("/panic-alert", (req, res) => {
//     console.log("Panic Alert Received:", req.body);
//     res.json({ message: "Alert Sent!" });
// });

// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

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
