import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Homepage.css";

const Homepage = () => {
  const navigate = useNavigate();

  // Login states
  const [loginUsername, setLoginUsername] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginType, setLoginType] = useState("");
  const [showLogin, setShowLogin] = useState(false);

  // Signup states
  const [showSignup, setShowSignup] = useState(false);
  const [signupFullName, setSignupFullName] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [signupType, setSignupType] = useState("");
  const [signupPasswordVisible, setSignupPasswordVisible] = useState(false);

  // ------------------ LOGIN ------------------
  const handleLogin = async () => {
    if (!loginUsername || !loginPassword || !loginType) {
      alert("Please fill all login fields");
      return;
    }

    try {
      const res = await fetch(`http://localhost:30025/${loginType}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: loginUsername,
          password: loginPassword,
        }),
      });

      const data = await res.text();

      if (data.includes("success")) {
        const loggedUser = {
          email: loginUsername,
          role: loginType,
          name: loginUsername.split("@")[0],
        };
        localStorage.setItem("user", JSON.stringify(loggedUser));

        if (loginType === "customer") navigate("/customer-dashboard");
        else if (loginType === "artist") navigate("/artist-dashboard");
        else if (loginType === "admin") navigate("/admin-dashboard");
      } else {
        alert(data);
      }
    } catch (err) {
      console.error(err);
      alert("Login failed");
    }
  };

  // ------------------ SIGNUP ------------------
  const handleSignup = async () => {
    if (!signupFullName || !signupEmail || !signupPassword || !signupType) {
      alert("Please fill all signup fields");
      return;
    }

    try {
      const res = await fetch(`http://localhost:30025/${signupType}/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: signupFullName,
          email: signupEmail,
          password: signupPassword,
        }),
      });

      const data = await res.text();
      alert(data);
      setShowSignup(false);
      setShowLogin(true);
    } catch (err) {
      console.error(err);
      alert("Signup failed");
    }
  };

  return (
    <div className="homepage">
      
      {/* Floating Stickers */}
      <div className="floating-icons">
        <span>🎨</span>
        <span>🖌️</span>
        <span>✨</span>
        <span>🖼️</span>
        <span>🌈</span>
      </div>

      {/* Main Heading */}
      <h1 className="hero-title">Art Gallery Management System</h1>
      <p className="hero-subtitle">
        Explore, Create and Showcase your Art — A Digital Home for Artists, Customers and Admins.
      </p>

      {/* Buttons */}
      <div className="btn-row homepage-buttons">
        <button onClick={() => setShowLogin(true)}>Login</button>
        <button onClick={() => setShowSignup(true)}>Signup</button>
      </div>

      {/* Scrolling Names */}
      <div className="scrolling-names">
        <span>
          🎨 Vincent van Gogh • Pablo Picasso • Michelangelo • Frida Kahlo • Leonardo da Vinci • M.F. Hussain • Ravi Varma • 
        </span>
        <span>
          🎨 Vincent van Gogh • Pablo Picasso • Michelangelo • Frida Kahlo • Leonardo da Vinci • M.F. Hussain • Ravi Varma • 
        </span>
      </div>

      {/* Login Popup */}
      {showLogin && (
        <div className="popup-overlay">
          <div className="popup-card">
            <h2>Login</h2>
            <input
              type="email"
              placeholder="Email"
              value={loginUsername}
              onChange={(e) => setLoginUsername(e.target.value)}
            />
            <input
              type="password"
              placeholder="Password"
              value={loginPassword}
              onChange={(e) => setLoginPassword(e.target.value)}
            />
            <select value={loginType} onChange={(e) => setLoginType(e.target.value)}>
              <option value="" disabled>Select Role</option>
              <option value="customer">Customer</option>
              <option value="artist">Artist</option>
              <option value="admin">Admin</option>
            </select>
            <div className="btn-row">
              <button onClick={handleLogin}>Login</button>
              <button onClick={() => setShowLogin(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Signup Popup */}
      {showSignup && (
        <div className="popup-overlay">
          <div className="popup-card">
            <h2>Signup</h2>
            <input
              type="text"
              placeholder="Full Name"
              value={signupFullName}
              onChange={(e) => setSignupFullName(e.target.value)}
            />
            <input
              type="email"
              placeholder="Email"
              value={signupEmail}
              onChange={(e) => setSignupEmail(e.target.value)}
            />
            <div className="password-wrapper">
              <input
                type={signupPasswordVisible ? "text" : "password"}
                placeholder="Password"
                value={signupPassword}
                onChange={(e) => setSignupPassword(e.target.value)}
              />
              <span
                className="eye-icon"
                onClick={() => setSignupPasswordVisible((vis) => !vis)}
              >
                {signupPasswordVisible ? "🙈" : "👁️"}
              </span>
            </div>
            <select value={signupType} onChange={(e) => setSignupType(e.target.value)}>
              <option value="" disabled>Select Role</option>
              <option value="customer">Customer</option>
              <option value="artist">Artist</option>
              <option value="admin">Admin</option>
            </select>
            <div className="btn-row">
              <button onClick={handleSignup}>Signup</button>
              <button onClick={() => setShowSignup(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default Homepage;
