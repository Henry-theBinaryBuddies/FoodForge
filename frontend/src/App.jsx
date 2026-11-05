import Header from './components/Header.jsx';
import { Routes } from 'react-router'
import { Route } from 'react-router'
import About from './pages/About.jsx';
import Home from './pages/Home.jsx';

import './App.css'

function App() {
  return (
      <>
          <Header />
          <Routes>
              <Route
                  path="/"
                  element={<Home />}
              />
              <Route
                path="/about"
                element={<About />}
              />
          </Routes>
      </>
  );
}

export default App
