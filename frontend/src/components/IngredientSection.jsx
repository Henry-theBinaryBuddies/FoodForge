import IngredientCard from "../components/IngredientCard.jsx";
import { useRef, useLayoutEffect } from 'react';


function IngredientSection({category, selectedIngredients, onToggle}) {
    const carouselRef = useRef(null);

    return (
    <section className="carousel-wrapper">
        <h2>{category.name}</h2>
        <h3>{category.description}</h3>
        <button
            className="carousel-arrow carousel-arrow-left"
            onClick={() => carouselRef.current?.scrollBy({
                left: -carouselRef.current.clientWidth * 0.8,
                behavior: "smooth"
            })}
        >
            &lt;
        </button>
        <div className="ingredient-carousel" ref={carouselRef}>
            {category.items.map((item, index) => (
                <IngredientCard
                    key={'${item.name}-${index}'}
                    name={item.name}
                    img={item.img}
                    selected={selectedIngredients.includes(item.name)}
                    onToggle={onToggle}
                />
            ))}
        </div>
        <button
            className="carousel-arrow carousel-arrow-right"
            onClick={() => carouselRef.current?.scrollBy({
                left: carouselRef.current.clientWidth * 0.8,
                behavior: "smooth",
            })}
        >
            &gt;
        </button>
    </section>
    );
}



export default IngredientSection;