const express = require("express");
const path = require("path");

const app = express();
const PORT = 3000;

app.use(express.static(__dirname));

app.get("/login", (req, res) => {
    res.sendFile(path.join(__dirname, "login.html"));
});

app.listen(PORT, "0.0.0.0", () => {
    console.log(`JobNestHub website running on port ${PORT}`);
});
