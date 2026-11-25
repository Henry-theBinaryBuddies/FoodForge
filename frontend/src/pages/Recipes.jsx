import './Recipes.css';
import { useState } from 'react';
import { useLocation } from 'react-router';
import { Link } from 'react-router';
import RecipeCard from '../components/RecipeCard.jsx'



function Recipes(){

    const location = useLocation();

    const recipes = location.state;
    const [recipeIndex, setRecipeIndex] = useState(0);

    if (!recipes) {
        return;
    }

    return (
        <main className="recipes">
            <h1>Recipe Results</h1>
            {recipes.length === 0 ? (
                <>
                <p>No recipes match your ingredients and preferences.</p>
                <Link to="/" className="recipe-back-link">Back to the Ingredients</Link>
                </>
                )
                :  <RecipeCard recipe={recipes[recipeIndex]} /> }
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
        </main>
    );
}

export default Recipes;