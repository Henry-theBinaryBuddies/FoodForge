const express = require("express");
const path = require("path");

const recipeData = require("../frontend/src/data/ingredient-data.json");

const app = express();
const PORT = 4000;

app.set("view engine", "ejs");
app.set("views", path.join(__dirname,"..", "views"));
app.use(express.static(path.join(__dirname, "..", "public")));

// Home page
app.get("/", function (req, res) {
    res.render("index", {
        title: "Home",
        activePage: "index",
        data: recipeData
    });
});

// About / information page
app.get("/about", function (req, res) {
    res.render("about", {
        title: "About",
        activePage: "about",
        data: recipeData
    });
});

app.post("/recipe", function (req, res) {
//TODO: backend logic
});

app.use(function (req, res) {
    res.status(404).render("404", {
        title: "Page Not Found",
        activePage: ""
    });
});

app.listen(PORT, function () {
    console.log("FoodForge app running at http://localhost:" + PORT);
});