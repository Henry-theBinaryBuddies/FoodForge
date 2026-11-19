const { openDatabase } = require("./database");
const { findRecipes } = require("./search");

let queryResult = findRecipes(openDatabase(), {
    ingredients: ["Chicken", "Rice"],
    macros: { Calories: "Medium", Protein: null, Fat: null, Carbohydrates: null },
    foodPref: { Cuisine: ["Thai"], Diet: [], "Flavor Profile": [] },
});

//console.log(queryResult);

queryResult = findRecipes(openDatabase(), {
    ingredients: ["Chicken", "Rice"],
    macros: { Calories: null, Protein: null, Fat: null, Carbohydrates: null },
    foodPref: { Cuisine: [], Diet: [], "Flavor Profile": [] },
});

console.log(JSON.stringify(queryResult, null, 2));

