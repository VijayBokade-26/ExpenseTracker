import React, { useState } from "react";
import { signupUser } from "../services/api";
import { Link } from "react-router-dom";
import "../App.css";

function Signup() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await signupUser(form);
    alert(res.message || "Signup done");
  };

  return (
    <div className="signup-bg">
      <div className="signup-card">
        <h2>Create Account</h2>
        <p className="subtitle">Track expenses effortlessly.</p>

        <form onSubmit={handleSubmit}>
          <input name="name" placeholder="Name" onChange={handleChange} />
          <input name="email" placeholder="Email" onChange={handleChange} />
          <input name="phone" placeholder="Phone" onChange={handleChange} />
          <input
            name="password"
            type="password"
            placeholder="Password"
            onChange={handleChange}
          />

          <button type="submit">Signup</button>
        </form>

        <p className="subtitle" style={{ marginTop: "16px" }}>
          Already registered? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
}

export default Signup;
