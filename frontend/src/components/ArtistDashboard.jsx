import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./ArtistDashboard.css";

// Backend API
const BACKEND_URL = "http://localhost:30025";
const API_URL = `${BACKEND_URL}/api/art`;

const ArtistDashboard = () => {
  const navigate = useNavigate();

  const [user, setUser] = useState({
    name: "John Doe",
    email: "john@example.com",
  });

  const [newArt, setNewArt] = useState({
    artName: "",
    artDescription: "",
    artCost: "",
    artPicture: null,
  });

  // Load user from localStorage
  useEffect(() => {
    const savedUser = JSON.parse(localStorage.getItem("user"));
    if (!savedUser) {
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      setUser(savedUser);
    }
  }, []);

  // Upload new art
  const handleAddArt = async () => {
    if (
      !newArt.artName ||
      !newArt.artDescription ||
      !newArt.artCost ||
      !newArt.artPicture
    ) {
      alert("Please fill all fields and select an image!");
      return;
    }

    const formData = new FormData();
    formData.append("artName", newArt.artName);
    formData.append("artDescription", newArt.artDescription);
    formData.append("artistName", user.name);
    formData.append("artCost", parseFloat(newArt.artCost));
    formData.append("artPicture", newArt.artPicture);

    try {
      await axios.post(`${API_URL}/upload`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("Art uploaded successfully!");
      setNewArt({ artName: "", artDescription: "", artCost: "", artPicture: null });
    } catch (err) {
      console.error("Failed to upload art:", err);
      alert("Failed to upload art");
    }
  };

  return (
    <div className="artist-dashboard">
      <aside className="sidebar">
        <h1>Dashboard</h1>
        <button
          className="logout-btn"
          onClick={() => {
            localStorage.removeItem("user");
            alert("Logged out");
            navigate("/");
          }}
        >
          Logout
        </button>
      </aside>
      <main className="dashboard-main">
        <div className="upload-form">
          <h2>Create New Art Post</h2>
          <input
            type="text"
            placeholder="Art Name"
            value={newArt.artName}
            onChange={(e) => setNewArt({ ...newArt, artName: e.target.value })}
          />
          <textarea
            placeholder="Description"
            value={newArt.artDescription}
            onChange={(e) => setNewArt({ ...newArt, artDescription: e.target.value })}
          />
          <input
            type="number"
            placeholder="Cost"
            value={newArt.artCost}
            onChange={(e) => setNewArt({ ...newArt, artCost: e.target.value })}
          />
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setNewArt({ ...newArt, artPicture: e.target.files[0] })}
          />
          <button onClick={handleAddArt}>Upload Art</button>
        </div>
      </main>
    </div>
  );
};

export default ArtistDashboard;
