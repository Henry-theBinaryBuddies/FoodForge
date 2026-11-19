import SelectionCard from "./SelectionCard.jsx";
import { useRef } from 'react';


function SelectionSection({category, items, selectedNames, onToggle}) {
    const carouselRef = useRef(null);

    //Infinity Carousel
    function scrollCarousel(direction) {
        const carousel = carouselRef.current;
        //defensive check
        if (!carousel) return;

        const maxScroll = carousel.scrollWidth - carousel.clientWidth;
        if (maxScroll <= 0) return;

        //boundary check
        const atStart = carousel.scrollLeft <= 2;
        const atEnd = carousel.scrollLeft >= maxScroll - 2;

        let target;
        if (direction === "right" && atEnd) {
            target = 0;
        } else if (direction === "left" && atStart) {
            target = maxScroll;
        } else {
            const distance = carousel.clientWidth * 0.8;

            if (direction === "right") {
                target = carousel.scrollLeft + distance;
            } else {
                target = carousel.scrollLeft - distance;
            }
        }

        carousel.scrollTo({left: target, behavior: "smooth"});

    }
    return (
    <section className="carousel-wrapper">
        <h2>{category.name}</h2>
        <h3>{category.description}</h3>
        <button
            className="carousel-arrow carousel-arrow-left"
            onClick={() => scrollCarousel("left")}
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
            onClick={() => scrollCarousel("right")}
        >
            &gt;
        </button>
    </section>
    );
}



export default SelectionSection;