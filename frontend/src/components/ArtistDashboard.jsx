import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // 👈 import navigation
import "./ArtistDashboard.css";

const API_URL = "http://localhost:5000/api/art"; // change if needed

const ArtistDashboard = () => {
  const navigate = useNavigate(); // 👈 initialize navigation
  const [activeSection, setActiveSection] = useState("myArts");
  const [user, setUser] = useState({
    name: "John Doe",
    email: "john@example.com",
  });

  const [arts, setArts] = useState([]);
  const [selectedArt, setSelectedArt] = useState(null); // For enlarged view
  const [newArt, setNewArt] = useState({
    artName: "",
    artDescription: "",
    artCost: "",
    artPicture: null,
  });

  useEffect(() => {
    const savedUser = JSON.parse(localStorage.getItem("user"));
    if (!savedUser) {
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      setUser(savedUser);
    }
    fetchArts();
  }, []);

  // Fetch all arts
  const fetchArts = async () => {
    try {
      const res = await axios.get(`${API_URL}/all`);
      setArts(res.data);
    } catch (err) {
      console.error(err);
    }
  };

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
    formData.append("artCost", newArt.artCost);
    formData.append("artPicture", newArt.artPicture);

    try {
      await axios.post(`${API_URL}/upload`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("Art uploaded!");
      setNewArt({
        artName: "",
        artDescription: "",
        artCost: "",
        artPicture: null,
      });
      fetchArts();
      setActiveSection("myArts");
    } catch (err) {
      console.error(err);
      alert("Failed to upload art");
    }
  };

  // Delete art
  const handleDeleteArt = async (id) => {
    if (!window.confirm("Are you sure to delete this art?")) return;
    try {
      await axios.delete(`${API_URL}/delete/${id}`);
      fetchArts();
    } catch (err) {
      console.error(err);
      alert("Failed to delete art");
    }
  };

  // Edit art
  const handleEditArt = async (art) => {
    const newName = prompt("Enter new art name", art.artName);
    if (!newName) return;
    const newCost = prompt("Enter new cost", art.artCost);
    if (!newCost) return;
    try {
      await axios.put(`${API_URL}/update/${art.id}`, null, {
        params: {
          artName: newName,
          artDescription: art.artDescription,
          artistName: art.artistName,
          artCost: newCost,
        },
      });
      fetchArts();
    } catch (err) {
      console.error(err);
    }
  };

  const renderArts = () => (
    <div className="arts-grid">
      {arts.map((art) => (
        <div
          key={art.id}
          className="art-card"
          onClick={() => setSelectedArt(art)}
        >
          <img
            src={`${API_URL}/${art.id}/image`}
            alt={art.artName}
            className="art-image"
          />
          <h3>{art.artName}</h3>
          <p className="small-text">Artist: {art.artistName}</p>
          <p className="small-text">Cost: ${art.artCost}</p>
          <div className="card-buttons">
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleEditArt(art);
              }}
            >
              Edit
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleDeleteArt(art.id);
              }}
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );

  const renderSelectedArt = () => {
    if (!selectedArt) return null;
    return (
      <div className="modal" onClick={() => setSelectedArt(null)}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
          <img
            src={`${API_URL}/${selectedArt.id}/image`}
            alt={selectedArt.artName}
            className="modal-image"
          />
          <h2>{selectedArt.artName}</h2>
          <p>
            <strong>Description:</strong> {selectedArt.artDescription}
          </p>
          <p>
            <strong>Artist:</strong> {selectedArt.artistName}
          </p>
          <p>
            <strong>Cost:</strong> ${selectedArt.artCost}
          </p>
          <button onClick={() => setSelectedArt(null)}>Close</button>
        </div>
      </div>
    );
  };

  const renderSection = () => {
    switch (activeSection) {
      case "myArts":
        return (
          <div>
            {renderArts()}
            {renderSelectedArt()}
          </div>
        );
      case "createArt":
        return (
          <div className="upload-form">
            <input
              type="text"
              placeholder="Art Name"
              value={newArt.artName}
              onChange={(e) =>
                setNewArt({ ...newArt, artName: e.target.value })
              }
            />
            <textarea
              placeholder="Description"
              value={newArt.artDescription}
              onChange={(e) =>
                setNewArt({ ...newArt, artDescription: e.target.value })
              }
            />
            <input
              type="number"
              placeholder="Cost"
              value={newArt.artCost}
              onChange={(e) =>
                setNewArt({ ...newArt, artCost: e.target.value })
              }
            />
            <input
              type="file"
              accept="image/*"
              onChange={(e) =>
                setNewArt({ ...newArt, artPicture: e.target.files[0] })
              }
            />
            <button onClick={handleAddArt}>Upload Art</button>
          </div>
        );
      case "profile":
        return (
          <div>
            <h2>Profile</h2>
            <p>
              <strong>Name:</strong> {user.name}
            </p>
            <p>
              <strong>Email:</strong> {user.email}
            </p>
          </div>
        );
      default:
        return <p>Select a section</p>;
    }
  };

  return (
    <div className="artist-dashboard">
      <aside className="sidebar">
        <h1>Dashboard</h1>
        <button
          className={activeSection === "myArts" ? "active" : ""}
          onClick={() => setActiveSection("myArts")}
        >
          My Arts
        </button>
        <button
          className={activeSection === "createArt" ? "active" : ""}
          onClick={() => setActiveSection("createArt")}
        >
          Create Post
        </button>
        <button
          className={activeSection === "profile" ? "active" : ""}
          onClick={() => setActiveSection("profile")}
        >
          Profile
        </button>
        <button
          className="logout-btn"
          onClick={() => {
            localStorage.removeItem("user");
            alert("Logged out");
            navigate("/"); // 👈 redirect to Homepage
          }}
        >
          Logout
        </button>
      </aside>
      <main className="dashboard-main">{renderSection()}</main>
    </div>
  );
};

export default ArtistDashboard;
