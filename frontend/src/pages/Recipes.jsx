import './Recipes.css';
import { useLocation } from 'react-router';
import RecipeCard from '../components/RecipeCard.jsx'


function Recipes(){

    const location = useLocation();

    const recipes = location.state;

    if (!recipes) {
        return;
    }

    return (
        <main className="recipes">
            <h1>Recipe Results</h1>
            {recipes.map((recipe) =>
                RecipeCard({recipe})
            )}
        </main>
    );
}

export default Recipes;