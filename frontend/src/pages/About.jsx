import './Home.css';

function About() {
    return (
        <>
        <main className="home">
            <h1>About FoodForge:</h1>
            <h2>What FoodForge does?</h2>
            <p>
                Finds recipes using ingredients you have on hand.
            </p>
            <h2>How to Use it</h2>

            <ol>
                <li>Select at least 2 ingredients you have on hand using the buttons on screen.</li>
                <li>Once submitted, FoodForge will ask you for your macro goals.</li>
                <li>On the final selection page, FoodForge will ask you to select your food preferences,
                    such as dietary restrictions or cooking styles.</li>
                <li>After submitting the above criteria, FoodForge will find recipes based on the criteria you provided.</li>
                <li>If no matching recipes are found, a planned AI fallback will generate a recipe based on your selections.</li>
            </ol>
            <h2>Development team:</h2>
            <p>FoodForge was developed by the team, Hungry Hungry Hippos from the University of Washington Tacoma:
                <ul>
                    <li>Nic Ferencko, nferenck@uw.edu</li>
                    <li>Abby Hinds, ahinds0@uw.edu</li>
                    <li>Henry Rudolph, henryr22@uw.edu</li>
                </ul>
            </p>
            <h2>Current Features:</h2>
            <ul>
                <li>Find recipes using ingredients you have on hand</li>
                <li>Ask for macro goals</li>
                <li>Ask for food preferences</li>
                <li>Retrieve recipes from backend SQLite database. (In development)</li>
                <li>Generate recipes using external AI API. (In development)</li>
            </ul>
        </main>
        </>
    )
}

export default About;