import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../routes/css/Login.css";
//import { GLOBAL_BACKEND_URL } from "../App";

interface LoginProps {
  setAccess: React.Dispatch<React.SetStateAction<string>>;
}

const Login: React.FC<LoginProps> = ({ setAccess }) => {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch("/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user: username,
          password: password,
        }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        console.log("Login success:", data);

        // Store access permissions in App state
        setAccess(data.access);

        navigate("/home");
      } else {
        setError("Invalid username or password");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("Server error. Please try again.");
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-image" />

      <div className="login-panel">
        <div className="login-card">
          <h2>Login</h2>

          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />

            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <button type="submit">Sign In</button>
          </form>

          {error && (
            <p
              style={{
                color: "red",
                marginTop: "15px",
                textAlign: "center",
              }}
            >
              {error}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;
