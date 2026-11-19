import displayData from "../data/data.json";
import SelectionSection from "../components/SelectionSection.jsx";
import { useNavigate } from "react-router";

import { useState } from 'react';

import './Home.css';

function Home() {

    //Array because multiple ingredients can be selected.
    const [selectedIngredients, setSelectedIngredients] = useState([]);
    //Object because each macro is a single selection.
    const [selectedMacros, setSelectedMacros] = useState({
        Calories: null,
        Protein: null,
        Fat: null,
        Carbohydrates: null,
    });
    //Array because multiple food preferences can be selected.
    const [selectedFoodPref, setSelectedFoodPref] = useState({
        Cuisine: [],
        Diet: [],
        "Flavor Profile": [],
    });

    const [step, setStep] = useState("ingredients");

    const [isSending, setIsSending] = useState(false);
    const [message, setMessage] = useState("");
    const navigate = useNavigate();

    function toggleIngredient(name) {
        setSelectedIngredients((previous) =>
            previous.includes(name)
                ? previous.filter((ingredient) => ingredient !== name)
                : [...previous, name]
        );
    }

    function toggleFoodPreference(category, option) {
        setSelectedFoodPref(previous => {
            const selected = previous[category] ?? [];

            return {
                ...previous,
                [category]: selected.includes(option)
                    ? selected.filter(name => name !== option)
                    : [...selected, option],
            };
        });
    }

    async function sendData() {
        setMessage("");
        setIsSending(true);

        try {
            const response = await fetch("/api/recipe", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    ingredients: selectedIngredients,
                    macros: selectedMacros,
                    foodPref: selectedFoodPref,
                })
            });

            const data = await response.json();
            if (!response.ok) {
                console.error(data.error);
                setMessage(data.error);
                return;
            }
            setMessage(`Server accepted these ingredients: ${data.ingredients.join(", ")}`);
            console.log(data);

            navigate("/recipes", { state: data.recipes});


        //Error message for backend server outage.
        } catch (error) {
            console.error(error);
            setMessage("Unable to complete the request. Please try again later.");
        } finally {
            setIsSending(false);
        }
    }

    function selectMacro(category, option) {
        setSelectedMacros(previous => ({
            ...previous,
            [category]: previous[category] === option ? null : option,
        }));
    }

    function goToMacros() {
        if (selectedIngredients.length < 2) {
            setMessage("Select at least two ingredients.");
            return;
        }

        setMessage("");
        setStep("macros");
    }


    return (
        <main className="home">
            {step === "ingredients" && (
            <>

                <h1>Select Ingredients</h1>
                <p>Choose what you have on hand</p>

                {displayData.ingredients.map((category) => (
                    <SelectionSection
                        key={category.name}
                        category={category}
                        items={category.items}
                        selectedNames={selectedIngredients}
                        onToggle={toggleIngredient}
                    />
                ))}

                <div className="selectedParams">
                    <p>Selected ingredients ({selectedIngredients.length})</p>
                    {selectedIngredients.length === 0 && (
                        <p>No ingredient selected yet.</p>)}
                    <div className="selected-chips">
                        {selectedIngredients.map((name) => (
                            <button
                                key={name}
                                type="button"
                                className="selected-chip"
                                onClick={() => toggleIngredient(name)}
                                aria-label={`Remove ${name}`}
                            >
                                {name} ×
                            </button>
                        ))}
                    </div>
                </div>

                <div className="form-actions">

                    <button
                        className="selectedParams-button-left"
                        type="button"
                        onClick={() => setSelectedIngredients([])}
                    >
                        Clear Selection
                    </button>
                    <button
                        className="selectedParams-button-right"
                        type="button"
                        onClick={goToMacros}
                        disabled={isSending}
                    >
                        {isSending ? "Sending..." : "Next: Macros"}
                    </button>
                </div>
            </>
            )}
            {step === "macros" && (
                <>
                    <h1>Macro Goals</h1>
                    <p>Choose your nutritional preferences per serving</p>

                    {displayData.macros.map((category) => (
                        <SelectionSection
                            key={category.name}
                            category={category}
                            items={category.toggles}
                            selectedNames={
                                selectedMacros[category.name]
                                    ? [selectedMacros[category.name]]
                                    : []
                            }
                            onToggle={(option) => selectMacro(category.name, option)}
                        />
                    ))}

                    <div className="form-actions">
                        <button
                            className="selectedParams-button-left"
                            type="button"
                            onClick={() => setStep("ingredients")}
                        >
                            Back: Ingredients
                        </button>

                        <button
                            className="selectedParams-button-right"
                            type="button"
                            onClick={() => setStep("foodPref")}
                            disabled={isSending}
                        >
                            {isSending ? "Sending..." : "Next: Food Preferences"}
                        </button>
                    </div>
                </>
            )}

            {step === "foodPref" && (
                <>
                    <h1>Food Preferences</h1>
                    <p>Tell us your food preferences</p>

                    {displayData.foodPref.map((category) => (
                        <SelectionSection
                            key={category.name}
                            category={category}
                            items={category.toggles}
                            selectedNames={selectedFoodPref[category.name] ?? []}
                            onToggle={(option) => toggleFoodPreference(category.name, option)}
                        />
                    ))}
                    <div className="form-actions">
                        <button
                            className="selectedParams-button-left"
                            type="button"
                            onClick={() => setStep("macros")}
                        >
                            Back: Macros
                        </button>

                        <button
                            className="selectedParams-button-right"
                            type="button"
                            onClick={sendData}
                            disabled={isSending}
                        >
                            {isSending ? "Finding Recipes..." : "Next: Find Recipes"}
                        </button>
                    </div>
                    <p className="status-message"
                        role="status">{message}</p>
                </>
            )}

        </main>
    );

}


export default Home;