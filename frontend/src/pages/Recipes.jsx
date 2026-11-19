import './Recipes.css';
import { useLocation } from 'react-router';

function Recipes(){

    const location = useLocation();

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

    const recipe = location.state?.[0] ?? sampleRecipe;


    return (
        <main className="recipes">
            <h1>Recipe Results</h1>
            <article className="recipe-results">
                <header>
                    <h2>{recipe.name}</h2>
                    <p>{recipe.description}</p>
                </header>
                <section className="recipe-nutrition">
                    <h3>Nutrition per serving: </h3>
                    <div className="nutrition-grid">
                        <strong>Calories:</strong>
                        <span>{recipe.calories} kcal</span>
                        <strong>Protein:</strong>
                        <span>{recipe.protein} g</span>
                        <strong>Fat:</strong>
                        <span>{recipe.fat} g</span>
                        <strong>Carbs:</strong>
                        <span>{recipe.carbs} g</span>
                    </div>
                    <div className="recipe-tags">
                        Cuisine: <span className="recipe-tag">{recipe.cuisine}</span>
                        Diet: {recipe.diets.map((diet) => <span className="recipe-tag" key={diet}> {diet}</span>)}
                        Flavor Profile: {recipe.flavors.map((flavor) => <span className="recipe-tag" key={flavor}> {flavor}</span>)}
                    </div>
                </section>
                <h3>Ingredients:</h3>
                <ul>
                    {recipe.ingredients.map((ingredient) => <li>{ingredient[1]} {ingredient[2]} {ingredient[0]}</li>)}
                </ul>
                <h3>Instructions:</h3>
                <div className="recipe-instructions">
                    {recipe.instructions}
                </div>
            </article>
        </main>
    );
}

export default Recipes;