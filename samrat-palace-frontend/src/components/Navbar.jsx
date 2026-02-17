import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "../styles/navbar.css";
// Apna logo path yahan check karein
import logo from "../assets/samrat.png";

function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [user, setUser] = useState(null);
  const [click, setClick] = useState(false); // Mobile Menu State

  // Toggle Mobile Menu
  const handleClick = () => setClick(!click);
  const closeMobileMenu = () => setClick(false);

  // Check login status safely
  useEffect(() => {
    const checkUser = () => {
      try {
        const storedUser = localStorage.getItem("user");
        if (storedUser && storedUser !== "undefined" && storedUser !== "null") {
          setUser(JSON.parse(storedUser));
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error("JSON parsing error in Navbar:", error);
        setUser(null);
        localStorage.removeItem("user");
      }
    };
    checkUser();
    window.addEventListener("storage", checkUser);
    return () => window.removeEventListener("storage", checkUser);
  }, []);

  // Scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Logout Handler
  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      setUser(null);
      closeMobileMenu();
      navigate("/login");
    }
  };

  // SVGs for Icons
  const Icons = {
    Home: (
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
        <polyline points="9 22 9 12 15 12 15 22"></polyline>
      </svg>
    ),
    Rooms: (
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M2 22h20M2 11h20M7 7h10v4H7zM5 11v11M19 11v11"></path>
      </svg>
    ),
    Food: (
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M18 8h1a4 4 0 0 1 0 8h-1"></path>
        <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"></path>
        <line x1="6" y1="1" x2="6" y2="4"></line>
        <line x1="10" y1="1" x2="10" y2="4"></line>
        <line x1="14" y1="1" x2="14" y2="4"></line>
      </svg>
    ),
    Table: (
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M4 11l2-7h12l2 7v8H4v-8z"></path>
        <path d="M4 18h16"></path>
      </svg>
    ),
    Party: (
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
      </svg>
    ),
    Catering: (
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path>
      </svg>
    ),
    Bookings: (
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
        <polyline points="14 2 14 8 20 8"></polyline>
        <line x1="16" y1="13" x2="8" y2="13"></line>
        <line x1="16" y1="17" x2="8" y2="17"></line>
        <polyline points="10 9 9 9 8 9"></polyline>
      </svg>
    ),
    Login: (
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path>
        <polyline points="10 17 15 12 10 7"></polyline>
        <line x1="15" y1="12" x2="3" y2="12"></line>
      </svg>
    ),
    Logout: (
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
        <polyline points="16 17 21 12 16 7"></polyline>
        <line x1="21" y1="12" x2="9" y2="12"></line>
      </svg>
    ),
    MenuBars: (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <line x1="3" y1="12" x2="21" y2="12"></line>
        <line x1="3" y1="6" x2="21" y2="6"></line>
        <line x1="3" y1="18" x2="21" y2="18"></line>
      </svg>
    ),
    CloseTimes: (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <line x1="18" y1="6" x2="6" y2="18"></line>
        <line x1="6" y1="6" x2="18" y2="18"></line>
      </svg>
    ),
  };

  return (
    <nav className={`main-navbar ${scrolled ? "scrolled" : ""}`}>
      <div className="navbar-container">
        {/* LOGO */}
        <div className="nav-logo" onClick={closeMobileMenu}>
          <Link to="/">
            <img src={logo} alt="Samrat Palace Logo" className="logo-img" />
          </Link>
          <div className="logo-text">
            <h2>
              <span style={{ color: "orangered" }}>THE</span> SAMRAT{" "}
              <span style={{ color: "green" }}>PALACE</span>
            </h2>
          </div>
        </div>

        {/* MOBILE MENU ICON */}
        <div className="menu-icon" onClick={handleClick}>
          {click ? Icons.CloseTimes : Icons.MenuBars}
        </div>

        {/* NAV LINKS */}
        <ul className={click ? "nav-links active" : "nav-links"}>
          <li>
            <Link
              to="/"
              className={location.pathname === "/" ? "active" : ""}
              onClick={closeMobileMenu}
            >
              {Icons.Home} Home
            </Link>
          </li>
          <li>
            <Link
              to="/rooms"
              className={location.pathname === "/rooms" ? "active" : ""}
              onClick={closeMobileMenu}
            >
              {Icons.Rooms} Rooms
            </Link>
          </li>
          <li>
            <Link
              to="/restaurant"
              className={location.pathname === "/restaurant" ? "active" : ""}
              onClick={closeMobileMenu}
            >
              {Icons.Food} Dining
            </Link>
          </li>
          <li>
            <Link
              to="/table-booking"
              className={location.pathname === "/table-booking" ? "active" : ""}
              onClick={closeMobileMenu}
            >
              {Icons.Table} Tables
            </Link>
          </li>
          <li>
            <Link
              to="/celebrations"
              className={location.pathname === "/celebrations" ? "active" : ""}
              onClick={closeMobileMenu}
            >
              {Icons.Party} Events
            </Link>
          </li>
          <li>
            <Link
              to="/catering"
              className={location.pathname === "/catering" ? "active" : ""}
              onClick={closeMobileMenu}
            >
              {Icons.Catering} Catering
            </Link>
          </li>
          <li>
            <Link
              to="/my-bookings"
              className={location.pathname === "/my-bookings" ? "active" : ""}
              onClick={closeMobileMenu}
            >
              {Icons.Bookings} Dashboard
            </Link>
          </li>

          {/* AUTH BUTTONS */}
          <li className="auth-li">
            {user ? (
              <button onClick={handleLogout} className="nav-btn-logout">
                {Icons.Logout} Logout
              </button>
            ) : (
              <Link
                to="/login"
                className="nav-btn-3d"
                onClick={closeMobileMenu}
              >
                {Icons.Login} Login
              </Link>
            )}
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;
