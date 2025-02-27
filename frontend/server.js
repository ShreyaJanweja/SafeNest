const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(express.json());
app.use(cors());

app.post("/panic-alert", (req, res) => {
    console.log("Panic Alert Received:", req.body);
    res.json({ message: "Alert Sent!" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
