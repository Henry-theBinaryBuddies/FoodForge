
function RecipeCard ({recipe}) {

    return (
        <article className="recipe-results" key={recipe.recipeID}>
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
                    Diet:
                    {recipe.diets?.length > 0 ? (
                        recipe.diets.map((diet) => (
                            <span className="recipe-tag" key={diet}> {diet}</span>
                        ))
                    ) : (
                        <span className="recipe-tag"> N/A </span>
                    )}
                    Flavor Profile:
                    {recipe.flavors?.length > 0 ? (
                        recipe.flavors.map((flavor) => (
                            <span className="recipe-tag" key={flavor}> {flavor}</span>
                        ))
                    ) : (
                        <span className="recipe-tag"> N/A </span>
                    )}
                </div>
            </section>
            <h3>Ingredients:</h3>
            <ul>
                {recipe.ingredients.map((ingredient) => <li key={ingredient.name}>{ingredient.quantity} {ingredient.unit} {ingredient.name}</li>)}
            </ul>
            <h3>Instructions:</h3>
            <div className="recipe-instructions">
                {recipe.instructions}
            </div>
        </article>
    );
}

export default RecipeCard;