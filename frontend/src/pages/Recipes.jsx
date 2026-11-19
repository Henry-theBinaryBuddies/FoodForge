import './Recipes.css';

function Recipes(){
    const sampleRecipe = {name: "Chicken Fried Rice",
        description: "Quick weeknight fried rice with chicken, egg, and vegetables.",
        instructions: [
            "1. Cook rice ahead of time and let it cool (day-old rice works best).",
            "2. Dice chicken and stir-fry in oil until cooked through; set aside.",
            "3. Scramble the eggs in the same pan; set aside.",
            "4. Stir-fry diced carrot and corn for 2-3 minutes.",
            "5. Add rice, chicken, egg, and soy sauce; toss over high heat for 3 minutes.",
        ].join("\n"),
        calories: 520, protein: 38, fat: 14, carbs: 60,
        cuisine: "Chinese",
        ingredients: [
            ["Chicken", 150, "g"],
            ["Rice", 1, "cup cooked"],
            ["Eggs", 2, "whole"],
            ["Carrot", 1, "medium"],
            ["Corn", 0.5, "cup"],
        ],
        diets: ["gluten-free"],
        flavors: ["Savory", "Umami"],
    }

    return (
        <main className="recipes">
            <h1>Recipe Results</h1>
            <article className="recipe-results">
                <header>
                    <h2>{sampleRecipe.name}</h2>
                    <p>{sampleRecipe.description}</p>
                </header>
                <section className="recipe-nutrition">
                    <h3>Nutrition per serving: </h3>
                    <div className="nutrition-grid">
                        <strong>Calories:</strong>
                        <span>{sampleRecipe.calories} kcal</span>
                        <strong>Protein:</strong>
                        <span>{sampleRecipe.protein} g</span>
                        <strong>Fat:</strong>
                        <span>{sampleRecipe.fat} g</span>
                        <strong>Carbs:</strong>
                        <span>{sampleRecipe.carbs} g</span>
                    </div>
                    <div className="recipe-tags">
                        Cuisine: <span className="recipe-tag">{sampleRecipe.cuisine}</span>
                        Diet: {sampleRecipe.diets.map((diet) => <span className="recipe-tag"> {diet}</span>)}
                        Flavor Profile: {sampleRecipe.flavors.map((flavor) => <span className="recipe-tag"> {flavor}</span>)}
                    </div>
                </section>
                <h3>Ingredients:</h3>
                <ul>
                    {sampleRecipe.ingredients.map((ingredient) => <li> {ingredient[0]} {ingredient[1]} {ingredient[2]}</li>)}
                </ul>
                <h3>Instructions:</h3>
                <div className="recipe-instructions">
                    {sampleRecipe.instructions}
                </div>
            </article>
        </main>
    );
}

export default Recipes;