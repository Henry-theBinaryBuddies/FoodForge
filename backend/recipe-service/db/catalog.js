//starter data for the lookup tables (replaces frontend/src/data/data.json)

//seed.js copies this into the database
//the frontend gets its options from GET /options, and POST /recipe validates against the database
//edit this file, then run 'npm run seed' to apply the changes

//ingredients:
// -"categories" are what users can select in the app. every item needs an image in frontend/public/images
// -"staples" are pantry items most kitchens already have (oil, salt, spices, sauces, etc.). they are saved in
//  the database (isStaple = 1) so recipes can list everything they use, but they are never shown as options
//  and recipe search should assume the user has them

module.exports = {
    categories: [
        {
            name: "Protein",
            description: "Meat, Beans, Nuts",
            items: [
                { name: "Eggs", img: "/images/egg.webp" },
                { name: "Tuna", img: "/images/tuna.webp" },
                { name: "Hamburger", img: "/images/hamburger.webp" },
                { name: "Nuts", img: "/images/nuts.webp" },
                { name: "Chicken", img: "/images/chicken.webp" },
                { name: "Tofu", img: "/images/tofu.webp" },
                { name: "Beef", img: "/images/beef.webp" },
                { name: "Fish", img: "/images/fish.webp" },
                { name: "Pork", img: "/images/pork.webp" },
                { name: "Beans", img: "/images/beans.webp" },
            ],
        },
        {
            name: "Vegetables",
            description: "Leafy Greens, Starchy, Root",
            items: [
                { name: "Broccoli", img: "/images/broccoli.webp" },
                { name: "Asparagus", img: "/images/asparagus.webp" },
                { name: "Bell Pepper", img: "/images/bell-pepper.webp" },
                { name: "Corn", img: "/images/corn.webp" },
                { name: "Carrot", img: "/images/carrot.webp" },
                { name: "Spinach", img: "/images/spinach.webp" },
                { name: "Sweet Potatoes", img: "/images/sweet-potato.webp" },
                { name: "Potatoes", img: "/images/potato.webp" },
                { name: "Onion", img: "/images/onion.webp" },
                { name: "Tomatoes", img: "/images/tomato.webp" },
                { name: "Garlic", img: "/images/garlic.webp" },
            ],
        },
        {
            name: "Grains",
            description: "Bread, Cereal, Pasta, Rice",
            items: [
                { name: "Tortillas", img: "/images/tortilla.webp" },
                { name: "Cereal", img: "/images/cereal.webp" },
                { name: "Pasta", img: "/images/pasta.webp" },
                { name: "Rice", img: "/images/rice.webp" },
                { name: "Bread", img: "/images/bread.webp" },
                { name: "Crackers", img: "/images/cracker.webp" },
                { name: "Popcorn", img: "/images/popcorn.webp" },
                { name: "Oats", img: "/images/oats.webp" },
            ],
        },
        {
            name: "Dairy",
            description: "Milk, Cheese, Yogurt",
            items: [
                { name: "Milk", img: "/images/milk.webp" },
                { name: "Yogurt", img: "/images/yogurt.webp" },
                { name: "Cheese", img: "/images/cheese.webp" },
                { name: "Cottage Cheese", img: "/images/cottage-cheese.webp" },
                { name: "Butter", img: "/images/butter.webp" },
                { name: "Cream", img: "/images/cream.webp" },
                { name: "Coconut Milk", img: "/images/coconut-milk.webp" }
            ],
        },
        {
            name: "Fruits",
            description: "Berries, Citrus, Stone Fruit",
            items: [
                { name: "Apples", img: "/images/apple.webp" },
                { name: "Bananas", img: "/images/banana.webp" },
                { name: "Oranges", img: "/images/orange.webp" },
                { name: "Strawberries", img: "/images/strawberry.webp" },
                { name: "Blueberries", img: "/images/blueberry.webp" },
                { name: "Grapes", img: "/images/grape.webp" },
                { name: "Pineapple", img: "/images/pineapple.webp" },
                { name: "Mango", img: "/images/mango.webp" },
                { name: "Peaches", img: "/images/peach.webp" },
                { name: "Pears", img: "/images/pear.webp" },
                { name: "Watermelon", img: "/images/watermelon.webp" },
                { name: "Lime", img: "/images/lime.webp" },
            ],
        },
        {
            name: "Sauces & Broths",
            description: "Bases, Marinades, Gravies",
            items: [
                { name: "Soy Sauce", img: "/images/soy-sauce.webp" },
                { name: "BBQ Sauce", img: "/images/bbq-sauce.webp" },
                { name: "Broth", img: "/images/broth.webp" }
            ],
        },
    ],

    //not selectable, assumed on hand
    staples: {
        category: { name: "Pantry Staples", description: "Oils, seasonings, and sauces" },
        items: [
            "Oil", "Olive Oil", "Salt", "Black Pepper", "Ginger",
            "Sugar", "Brown Sugar", "Honey", "Cornstarch",
            "Mayonnaise", "Peanut Butter", "Lemon Juice",
            "Chili Powder", "Chili Flakes", "Cumin", "Paprika", "Oregano",
            "Italian Seasoning", "Curry Powder", "Garam Masala",
        ],
    },

    cuisines: [
        { name: "Italian", img: "/images/italian.webp" },
        { name: "Mexican", img: "/images/mexican.webp" },
        { name: "Chinese", img: "/images/chinese.webp" },
        { name: "Indian", img: "/images/indian.webp" },
        { name: "American", img: "/images/american.webp" },
        { name: "Mediterranean", img: "/images/mediterranean.webp" },
        { name: "Thai", img: "/images/thai.webp" },
        { name: "Japanese", img: "/images/japanese.webp" },
        { name: "BBQ", img: "/images/bbq.webp" },
        { name: "African", img: "/images/african.webp" },
        { name: "French", img: "/images/french.webp" },
    ],

    diets: [
        { name: "Vegetarian", img: "/images/vegetarian.webp" },
        { name: "Vegan", img: "/images/vegan.webp" },
        { name: "Gluten-Free", img: "/images/gluten-free.webp" },
    ],

    flavors: [
        { name: "Mild", img: "/images/mild.webp" },
        { name: "Spicy", img: "/images/spicy.webp" },
        { name: "Savory", img: "/images/savory.webp" },
        { name: "Sweet", img: "/images/sweet.webp" },
        { name: "Tangy", img: "/images/tangy.webp" },
        { name: "Umami", img: "/images/umami.webp" },
    ],
};
