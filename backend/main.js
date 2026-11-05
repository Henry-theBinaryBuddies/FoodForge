const express = require("express");
const path = require("path");

const recipeData = require("../frontend/src/data/data.json");

const app = express();
const PORT = 4000;
app.use(express.json());

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
    const ingredients = req.body.ingredients;

    //Throw error if data received isn't an array
    if (!Array.isArray(ingredients)) {
        return res.status(400).json({
            error: "Ingredients must be an array."
        });
    }

    //Throw error if an entry is an empty string
    if (!ingredients.every((ingredient) =>
        typeof ingredient === "string" && ingredient.trim().length > 0
    )) {
        return res.status(400).json({
            error: "Each ingredient must be a nonempty string."
        })
    }

    //Throw error if array is empty
    if (ingredients.length === 0) {
        return res.status(400).json({
            error: "Select at least one ingredient."
        })
    }

    res.json({ ingredients: ingredients });


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