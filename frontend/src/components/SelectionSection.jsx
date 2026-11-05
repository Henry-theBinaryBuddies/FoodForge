import SelectionCard from "./SelectionCard.jsx";
import { useRef } from 'react';


function SelectionSection({category, items, selectedNames, onToggle}) {
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
        <div className="carousel" ref={carouselRef}>
            {items.map((item) => (
                <SelectionCard
                    key={item.name}
                    name={item.name}
                    img={item.img}
                    description={item.description}
                    selected={selectedNames.includes(item.name)}
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



export default SelectionSection;