import ingredientData from "../data/ingredient-data.json";
import IngredientCard from "../components/IngredientCard.jsx";
import './Home.css';

function Home() {
    return (
        <>
            <h1>Select Ingredients</h1>
            <p>Choose what you have on hand</p>

            {ingredientData.ingredients.map((category) => (
                <section key={category.name}>
                    <h2>{category.name}</h2>
                    <div className="ingredient-carousel">
                    {category.items.map((item) => (
                        <IngredientCard key={item.name} name={item.name} img={item.img}/>
                    ))}
                    </div>
                </section>
            ))}
        </>
    );
}


export default Home;