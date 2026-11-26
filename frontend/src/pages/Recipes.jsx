import './Recipes.css';
import { useState } from 'react';
import { useLocation } from 'react-router';
import { Link } from 'react-router';
import RecipeCard from '../components/RecipeCard.jsx'



function Recipes(){

    const location = useLocation();

    const hasSearchResults = Array.isArray(location.state);
    const recipes = hasSearchResults ? location.state : [];
    const [recipeIndex, setRecipeIndex] = useState(0);

    return (
        <main className="recipes">
            <h1>Recipe Results</h1>
            {recipes.length === 0 ? (
                <>
                <p>
                    {hasSearchResults
                        ? "No recipes match your ingredients and preferences."
                        : "Choose your ingredients to find recipes."}
                </p>
                <Link to="/" className="recipe-back-link">
                    {hasSearchResults
                    ? "Back to the Ingredients"
                    : "Choose your Ingredients"
                    }

                </Link>
                </>)
                :  <RecipeCard recipe={recipes[recipeIndex]} />
            }
            {recipes.length > 0 && (
                <div className="recipe-navigation">
                    <button
                        aria-label="Previous recipe"
                        type="button"
                        className="recipe-arrow"
                        onClick={() => setRecipeIndex((previous) => previous - 1)}
                        disabled={recipeIndex <= 0 }
                    >←</button>
                    {recipeIndex < recipes.length - 1 ? (
                        <button
                            aria-label="Next recipe"
                            type="button"
                            className="recipe-arrow"
                            onClick={() => setRecipeIndex((previous) => previous + 1)}
                        >→</button>
                    )
                        :

                        <button
                            aria-label="Generate AI Recipe"
                            className="recipe-back-link"
                            type="button"
                        >Generate AI Recipe</button>
                    }
                </div>
            )}
        </main>
    );
}

export default Recipes;