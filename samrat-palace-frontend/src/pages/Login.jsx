import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/forms.css";

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
  });

  const navigate = useNavigate();

  const handleAction = (e) => {
    e.preventDefault();

    const users = JSON.parse(localStorage.getItem("hotelUsers")) || [];

    if (isLogin) {
      const user = users.find(
        (u) => u.email === formData.email && u.password === formData.password
      );

      if (!user) return alert("Invalid credentials");

      localStorage.setItem("currentUser", JSON.stringify(user));
      navigate("/");
    } else {
      if (users.find((u) => u.email === formData.email)) {
        return alert("Email already exists");
      }
      users.push(formData);
      localStorage.setItem("hotelUsers", JSON.stringify(users));
      alert("Registered successfully");
      setIsLogin(true);
    }
  };

  return (
    <section className="auth-section">
      <div className="auth-card-3d">
        <h2>{isLogin ? "User Login" : "Register"}</h2>

        <form onSubmit={handleAction}>
          {!isLogin && (
            <input
              placeholder="Full Name"
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
            />
          )}

          <input
            placeholder="Email"
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
          />

          <input
            type="password"
            placeholder="Password"
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
          />

          <button type="submit">{isLogin ? "Login" : "Register"}</button>
        </form>

        <p onClick={() => setIsLogin(!isLogin)}>
          {isLogin ? "Create Account" : "Back to Login"}
        </p>
      </div>
    </section>
  );
};

export default Login;
