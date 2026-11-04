//Header.jsx
import React from 'react';
import { Link } from 'react-router';

function Header() {
    return (

        <header>
            <nav className="text-black bg-white bg-cover border-b">
                <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
                    <a href="/" className="font-bold">🔥Food <span className="text-orange-600">Forge</span></a>

                    <div className="flex gap-4 text-sm font-semibold">
                        <Link to="/"
                           className="">Home</Link>
                        <Link to="/about"
                           className="">About</Link>
                    </div>
                </div>
            </nav>
        </header>);
}

export default Header;

