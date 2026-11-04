

function IngredientCard({ name, img}) {
    return (
            <button className="ingredient-card" type="button">
                <img
                    src={img}
                    alt={name}
                />
                <span>{name}</span>
            </button>
    );
}

export default IngredientCard;