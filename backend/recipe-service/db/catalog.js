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
                { name: "Eggs", img: "/images/egg.png" },
                { name: "Tuna", img: "/images/tuna.png" },
                { name: "Hamburger", img: "/images/hamburger.png" },
                { name: "Nuts", img: "/images/nuts.png" },
                { name: "Chicken", img: "/images/chicken.png" },
                { name: "Tofu", img: "/images/tofu.png" },
                { name: "Beef", img: "/images/beef.png" },
                { name: "Fish", img: "/images/fish.png" },
                { name: "Pork", img: "/images/pork.png" },
                { name: "Beans", img: "/images/beans.png" },
            ],
        },
        {
            name: "Vegetables",
            description: "Leafy Greens, Starchy, Root",
            items: [
                { name: "Broccoli", img: "/images/broccoli.png" },
                { name: "Asparagus", img: "/images/asparagus.png" },
                { name: "Bell Pepper", img: "/images/bell-pepper.png" },
                { name: "Corn", img: "/images/corn.png" },
                { name: "Carrot", img: "/images/carrot.png" },
                { name: "Spinach", img: "/images/spinach.png" },
                { name: "Sweet Potatoes", img: "/images/sweet-potato.png" },
                { name: "Potatoes", img: "/images/potato.png" },
                { name: "Onion", img: "/images/onion.svg" },
                { name: "Tomatoes", img: "/images/tomato.svg" },
                { name: "Garlic", img: "/images/garlic.svg" },
            ],
        },
        {
            name: "Grains",
            description: "Bread, Cereal, Pasta, Rice",
            items: [
                { name: "Tortillas", img: "/images/tortilla.png" },
                { name: "Cereal", img: "/images/cereal.png" },
                { name: "Pasta", img: "/images/pasta.png" },
                { name: "Rice", img: "/images/rice.png" },
                { name: "Bread", img: "/images/bread.png" },
                { name: "Crackers", img: "/images/cracker.png" },
                { name: "Popcorn", img: "/images/popcorn.png" },
                { name: "Oats", img: "/images/oats.png" },
            ],
        },
        {
            name: "Dairy",
            description: "Milk, Cheese, Yogurt",
            items: [
                { name: "Milk", img: "/images/milk.png" },
                { name: "Yogurt", img: "/images/yogurt.png" },
                { name: "Cheese", img: "/images/cheese.png" },
                { name: "Cottage Cheese", img: "/images/cottage-cheese.png" },
                { name: "Butter", img: "/images/butter.png" },
                { name: "Cream", img: "/images/cream.png" },
            ],
        },
        {
            name: "Fruits",
            description: "Berries, Citrus, Stone Fruit",
            items: [
                { name: "Apples", img: "/images/apple.png" },
                { name: "Bananas", img: "/images/banana.png" },
                { name: "Oranges", img: "/images/orange.png" },
                { name: "Strawberries", img: "/images/strawberry.png" },
                { name: "Blueberries", img: "/images/blueberry.png" },
                { name: "Grapes", img: "/images/grape.png" },
                { name: "Pineapple", img: "/images/pineapple.png" },
                { name: "Mango", img: "/images/mango.png" },
                { name: "Peaches", img: "/images/peach.png" },
                { name: "Pears", img: "/images/pear.png" },
                { name: "Watermelon", img: "/images/watermelon.png" },
                { name: "Lime", img: "/images/lime.svg" },
            ],
        },
        {
            name: "Sauces & Broths",
            description: "Sauces, Broth, Coconut Milk",
            items: [
                { name: "Soy Sauce", img: "/images/soy-sauce.svg" },
                { name: "BBQ Sauce", img: "/images/bbq-sauce.svg" },
                { name: "Broth", img: "/images/broth.svg" },
                { name: "Coconut Milk", img: "/images/coconut-milk.svg" },
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
        { name: "Italian", img: "/images/italian.png" },
        { name: "Mexican", img: "/images/mexican.png" },
        { name: "Chinese", img: "/images/chinese.png" },
        { name: "Indian", img: "/images/indian.png" },
        { name: "American", img: "/images/american.png" },
        { name: "Mediterranean", img: "/images/mediterranean.png" },
        { name: "Thai", img: "/images/thai.png" },
        { name: "Japanese", img: "/images/japanese.png" },
        { name: "BBQ", img: "/images/bbq.png" },
        { name: "African", img: "/images/african.png" },
        { name: "French", img: "/images/french.png" },
    ],

    diets: [
        { name: "Vegetarian", img: "/images/vegetarian.png" },
        { name: "Vegan", img: "/images/vegan.png" },
        { name: "Gluten-Free", img: "/images/gluten-free.png" },
    ],

    flavors: [
        { name: "Mild", img: "/images/mild.png" },
        { name: "Spicy", img: "/images/spicy.png" },
        { name: "Savory", img: "/images/savory.png" },
        { name: "Sweet", img: "/images/sweet.png" },
        { name: "Tangy", img: "/images/tangy.png" },
        { name: "Umami", img: "/images/umami.png" },
    ],
};
