import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom"; 
import "../styles/Login.css";

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
  });

  const navigate = useNavigate();
  const location = useLocation(); 
  const from = location.state?.from?.pathname || "/";

  const handleAction = (e) => {
    e.preventDefault();

    const users = JSON.parse(localStorage.getItem("hotelUsers")) || [];

    if (isLogin) {
      // --- LOGIN LOGIC ---
      const user = users.find(
        (u) => u.email === formData.email && u.password === formData.password,
      );

      if (!user) return alert("Invalid credentials! Please try again.");

      // Store User in LocalStorage
      localStorage.setItem("user", JSON.stringify(user));

      // Dispatch storage event to update Navbar immediately
      window.dispatchEvent(new Event("storage"));

      alert(`Welcome back, ${user.name || "User"}!`);

      // ✅ Redirect user back to where they came from (Room/Dining page)
      navigate(from, { replace: true });
    } else {
      // --- REGISTER LOGIC ---
      if (users.find((u) => u.email === formData.email)) {
        return alert("Email already exists! Please Login.");
      }

      const newUser = { ...formData, id: Date.now() }; 
      users.push(newUser);

      localStorage.setItem("hotelUsers", JSON.stringify(users));
      alert("Registration Successful! Please Login.");
      setIsLogin(true); // Switch to Login view
    }
  };

  return (
    <section className="auth-section">
      <div className="auth-card-3d">
        <h2 className="auth-title">{isLogin ? "Welcome Back" : "Join Us"}</h2>
        <p className="auth-subtitle">
          {isLogin
            ? "Login to access your bookings"
            : "Create an account to book your stay"}
        </p>

        <form onSubmit={handleAction}>
          {!isLogin && (
            <div className="input-group">
              <input
                type="text"
                placeholder="Full Name"
                required
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
            </div>
          )}

          <div className="input-group">
            <input
              type="email"
              placeholder="Email Address"
              required
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
            />
          </div>

          <div className="input-group">
            <input
              type="password"
              placeholder="Password"
              required
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
            />
          </div>

          <button type="submit" className="auth-btn">
            {isLogin ? "Login" : "Register"}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
            <span onClick={() => setIsLogin(!isLogin)}>
              {isLogin ? "Sign Up" : "Login"}
            </span>
          </p>
        </div>
      </div>
    </section>
  );
};

export default Login;
