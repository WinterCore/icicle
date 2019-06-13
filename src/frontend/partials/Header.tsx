import * as React from "react";

import { Link } from "react-router-dom";

function Header() {
    return (
        <header>
            <div className="logo">KHAROUF</div>
            <nav>
                <Link to="/">Home</Link>
                <Link to="/search">Shirts</Link>
                <Link to="/search">Pants</Link>
            </nav>
            <div className="cart">
                <Link to="/cart">
                    <img src="/assets/cart.png" />
                </Link>
            </div>
        </header>
    );
}

export interface Props {};

export default Header;