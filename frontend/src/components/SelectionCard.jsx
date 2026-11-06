

function SelectionCard({ name, img, description, selected, onToggle }) {
    return (
            <button
                className={selected
                    ? "selection-card selected"
                    : "selection-card"}
                onClick={() => onToggle(name)}
                aria-pressed={selected}
            >
                <img
                    src={img}
                    alt={name}
                />
                <span>
                    {name}
                    {description && (
                        <>
                            <br/>
                            <small>{description}</small>
                        </>
                    )}
                </span>
            </button>
    );
}

export default SelectionCard;