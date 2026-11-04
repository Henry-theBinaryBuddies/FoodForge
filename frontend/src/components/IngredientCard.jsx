

function IngredientCard({ name, img, selected, onToggle }) {
    return (
            <button className={selected ? "ingredient-card selected" : "ingredient-card"}
                onClick={() => onToggle(name)}
                aria-pressed={selected}
            >

                <img
                    src={img}
                    alt={name}
                />
                <span>{name}</span>
            </button>
    );
}

export default IngredientCard;