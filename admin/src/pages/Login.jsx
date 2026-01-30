import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { adminLogin } from "../services/api";
import "./styles/login.css";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const data = await adminLogin({ username, password });

      if (data.token) {
        // ✅ FIX: "adminToken" ki jagah "token" use karein taaki api.js padh sake
        localStorage.setItem("token", data.token);

        // Debugging ke liye check
        console.log("Token Saved:", localStorage.getItem("token"));

        alert("Login Successful!");
        navigate("/dashboard"); // Ya jo bhi aapka home page route ho (e.g., "/admin")
      } else {
        setError("Login successful but no token received.");
      }
    } catch (err) {
      console.error(err);
      setError("Invalid Username or Password");
    }
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleLogin}>
        <h2>Admin Login</h2>

        {error && (
          <p className="error-msg" style={{ color: "red" }}>
            {error}
          </p>
        )}

        <div className="input-group">
          <label>Username</label>
          <input
            type="text"
            placeholder="Enter Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>

        <div className="input-group">
          <label>Password</label>
          <input
            type="password"
            placeholder="Enter Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button type="submit" className="login-btn">
          Login
        </button>
      </form>
    </div>
  );
}

export default Login;

 