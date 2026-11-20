import Header from "./components/Header.jsx";
import { Routes, Route } from "react-router";
import About from "./pages/About.jsx";
import Home from "./pages/Home.jsx";
import Recipes from "./pages/Recipes.jsx";

import "./App.css";

function App() {
  return (
      <>
        <Header />

        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/recipes" element={<Recipes />} />
        </Routes>
      </>
  );
}

export default App;