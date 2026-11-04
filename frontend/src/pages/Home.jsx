import ingredientData from "../data/ingredient-data.json";
import IngredientSection from "../components/IngredientSection.jsx";
import { useState } from 'react';

import './Home.css';

function Home() {

    const [selectedIngredients, setSelectedIngredients] = useState([]);

    function toggleIngredient(name) {
        setSelectedIngredients((previous) =>
            previous.includes(name)
                ? previous.filter((ingredient) => ingredient !== name)
                : [...previous, name]
        );
    }
    return (
        <main className="home">

            <h1>Select Ingredients</h1>
            <p>Choose what you have on hand</p>
            <p>Selected: {selectedIngredients.join(", ")}</p>
            <button type="button"
                onClick={() => setSelectedIngredients([])}
            >
                Clear Selection
            </button>

            {ingredientData.ingredients.map((category) => (
                <IngredientSection
                    key={category.name}
                    category={category}
                    selectedIngredients={selectedIngredients}
                    onToggle={toggleIngredient}/>
            ))}
        </main>
    );

}


export default Home;