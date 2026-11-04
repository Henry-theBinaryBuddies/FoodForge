import IngredientCard from "../components/IngredientCard.jsx";
import { useRef } from 'react';


function IngredientSection({category, selectedIngredients, onToggle}) {
    const carouselRef = useRef(null);
    return (
    <section>
        <h2>{category.name}</h2>
        <button
            onClick={() => carouselRef.current?.scrollBy({
                left: -carouselRef.current.clientWidth * 0.8,
                behavior: "smooth"
            })}
        >
            &larr;
        </button>
        <button
            onClick={() => carouselRef.current?.scrollBy({
                left: carouselRef.current.clientWidth * 0.8,
                behavior: "smooth"
            })}
        >
            &rarr;
        </button>
        <div className="ingredient-carousel" ref={carouselRef}>
            {category.items.map((item) => (
                <IngredientCard
                    key={item.name}
                    name={item.name}
                    img={item.img}
                    selected={selectedIngredients.includes(item.name)}
                    onToggle={onToggle}
                />
            ))}
        </div>
    </section>
    );
}



export default IngredientSection;