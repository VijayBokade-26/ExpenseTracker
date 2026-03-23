import React, { useState } from "react";
import { loginUser } from "../services/api";
import { Link } from "react-router-dom";
import "../App.css";
import { useNavigate } from "react-router-dom";

function Login() {
      const navigate = useNavigate();        
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();


    const res = await loginUser(form);

    console.log(res);

    if (res.access_token) {
      localStorage.setItem("token", res.access_token);
      alert("Login successful");
    } else {
      alert(res.detail || "Login failed");
    }

    if (res.access_token) {
        localStorage.setItem("token", res.access_token);
        navigate("/dashboard");
    } else {
        alert(res.detail || "Login failed");
    }
  };


  return (
    <div className="signup-bg">
      <div className="signup-card">
        <h2>Welcome back</h2>
        <p className="subtitle">Log in to continue tracking.</p>

        <form onSubmit={handleSubmit}>
          <input
            type="email"
            name="email"
            placeholder="Email"
            onChange={handleChange}
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            onChange={handleChange}
          />

          <button type="submit">Login</button>
        </form>

        <p className="subtitle" style={{ marginTop: "16px" }}>
          Don&apos;t have an account? <Link to="/signup">Signup</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
