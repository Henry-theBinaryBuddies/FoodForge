import ingredientData from "../data/data.json";
import IngredientSection from "../components/IngredientSection.jsx";
import { useState } from 'react';

import './Home.css';

function Home() {

    const [selectedIngredients, setSelectedIngredients] = useState([]);
    const [isSending, setIsSending] = useState(false);
    const [message, setMessage] = useState("");

    function toggleIngredient(name) {
        setSelectedIngredients((previous) =>
            previous.includes(name)
                ? previous.filter((ingredient) => ingredient !== name)
                : [...previous, name]
        );
    }

    async function sendIngredients() {
        setMessage("");
        setIsSending(true);

        try {
            const response = await fetch("/api/recipe", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ingredients: selectedIngredients})
            });

            const data = await response.json();
            if (!response.ok) {
                console.error(data.error);
                setMessage(data.error);
                return;
            }
            setMessage("Ingredients received successfully");
            console.log(data);


        //Error message for backend server outage.
        } catch (error) {
            console.error(error);
            setMessage("Unable to complete the request. Please try again later.");
        } finally {
            setIsSending(false);
        }
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
            <br />
            <button type="button"
                    onClick={sendIngredients}
                    disabled={isSending}
            >
                {isSending ? "Sending..." : "Find Recipes"}
            </button>
            <p role="status">{message}</p>

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