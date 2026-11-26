//macro goal options (per serving)

//these are filter rules, not records, so they live in config instead of the database.
//min is inclusive, max is exclusive, null = no limit.
//Fat is measured as a percent of the recipe's calories (fat g * 9 / calories * 100), the rest in kcal or grams.

module.exports = [
    {
        name: "Calories",
        unit: "kcal",
        toggles: [
            { name: "Low", description: "<400", img: "/images/calories_low.webp", min: null, max: 400 },
            { name: "Medium", description: "400-599", img: "/images/calories_med.webp", min: 400, max: 600 },
            { name: "High", description: "600-799", img: "/images/calories_high.webp", min: 600, max: 800 },
            { name: "Very High", description: "800+", img: "/images/calories_very.webp", min: 800, max: null },
        ],
    },
    {
        name: "Protein",
        unit: "g",
        toggles: [
            { name: "Low", description: "<20g", img: "/images/protein_low.webp", min: null, max: 20 },
            { name: "Standard", description: "20-34g", img: "/images/protein_med.webp", min: 20, max: 35 },
            { name: "High", description: "35-49g", img: "/images/protein_high.webp", min: 35, max: 50 },
            { name: "Ultra", description: "50g+", img: "/images/protein_very.webp", min: 50, max: null },
        ],
    },
    {
        name: "Fat",
        unit: "% of calories",
        toggles: [
            { name: "Low", description: "<25% of cal", img: "/images/fat_low.webp", min: null, max: 25 },
            { name: "Balanced", description: "25-40% of cal", img: "/images/fat_med.webp", min: 25, max: 40 },
            { name: "High", description: ">40% of cal", img: "/images/fat_high.webp", min: 40, max: null },
        ],
    },
    {
        name: "Carbohydrates",
        unit: "g",
        toggles: [
            { name: "No Carb", description: "<5g", img: "/images/carb_no.webp", min: null, max: 5 },
            { name: "Low Carb", description: "5-30g", img: "/images/carb_low.webp", min: 5, max: 30 },
            { name: "Moderate", description: "30-75g", img: "/images/carb_med.webp", min: 30, max: 75 },
            { name: "High", description: "75g+", img: "/images/carb_high.webp", min: 75, max: null },
        ],
    },
];
