import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faChevronDown } from '@fortawesome/free-solid-svg-icons';
import './Navbar.css';

function Navbar({ isAuthenticated }) {
    const [dropdownOpen, setDropdownOpen] = useState(false);

    const handleLogout = async (e) => {
        e.preventDefault();
        localStorage.removeItem("jwtToken"); // Rimuove il token dal localStorage ed eseguo il vero logout
        window.location.href = "/login"; // Reindirizza alla login
      };

    const toggleDropdown = () => {
        setDropdownOpen(!dropdownOpen);
    };

    return (
        <nav className="navbar">
            <div className="logo-container">
                <h1 className="logo"><span className="social">Social</span><span className="bridge">Bridge</span></h1>
            </div>
            <div className="nav-links">
                <Link to="/">Home</Link>
                {isAuthenticated && <Link to="/events">Eventi</Link>}
                {isAuthenticated && <a href="/events-participate">Eventi Prenotati</a>}
                {isAuthenticated && <Link to="/search-user">Cerca Utente</Link>}
                {isAuthenticated && <Link to="/my-events">Eventi Creati</Link>}
            </div>
            <div className="account-link">
                <div className="dropdown">
                    <button onClick={toggleDropdown} className="dropdown-toggle">
                        <FontAwesomeIcon icon={faChevronDown} className={`chevron ${dropdownOpen ? 'open' : ''}`} />
                        <FontAwesomeIcon icon={faUser} />
                    </button>
                    {dropdownOpen && (
                        <div className="dropdown-menu">
                            {!isAuthenticated ? <Link to="/login">Login</Link> : <Link to="/user/:id">Account</Link>}
                            {!isAuthenticated ? <Link to="/register">Sign-up</Link> : ""}
                            {!isAuthenticated ? "" : <Link to="/createEvent">Crea Evento</Link>}
                            {isAuthenticated && <button onClick={handleLogout}>Logout</button>}
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
}

export default Navbar;