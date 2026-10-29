document.querySelectorAll(".ingredient-section").forEach((section) => {
    const carousel = section.querySelector(".ingredient-carousel");
    const previous = section.querySelector(".carousel-prev");
    const next = section.querySelector(".carousel-next");

    previous.addEventListener("click", () => {
        carousel.scrollBy({
            left: -carousel.clientWidth * 0.8,
            behavior: "smooth"
        });
    });

    next.addEventListener("click", () => {
        carousel.scrollBy({
            left: carousel.clientWidth * 0.8,
            behavior: "smooth"
        });
    });
});
