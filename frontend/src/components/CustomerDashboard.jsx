import React, { useState, useEffect } from "react";
import { FaUserCircle, FaSignOutAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./CustomerDashboard.css";

const CustomerDashboard = () => {
  const [activeSection, setActiveSection] = useState("posts");
  const [arts, setArts] = useState([]);
  const [selectedArt, setSelectedArt] = useState(null);
  const [profile, setProfile] = useState(null);
  const [showProfile, setShowProfile] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editUsername, setEditUsername] = useState("");
  const [cartItems, setCartItems] = useState([]);

  const navigate = useNavigate();

  // Load profile from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setProfile(JSON.parse(storedUser));
  }, []);

  // Fetch arts and cart items
  useEffect(() => {
    if (activeSection === "posts") {
      axios
        .get("http://localhost:30025/api/art/all")
        .then((res) => setArts(res.data))
        .catch((err) => console.error("Error fetching arts:", err));
    }
    if (activeSection === "cart") {
      fetchCartItems();
    }
  }, [activeSection]);

  const fetchCartItems = () => {
    axios
      .get("http://localhost:30025/api/cart/all")
      .then((res) => setCartItems(res.data))
      .catch((err) => console.error("Error fetching cart items:", err));
  };

  // Logout
  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  // Save edited username
  const handleSaveUsername = () => {
    const updatedProfile = { ...profile, username: editUsername };
    setProfile(updatedProfile);
    localStorage.setItem("user", JSON.stringify(updatedProfile));
    setIsEditing(false);
    setShowProfile(false);
  };

  // Add art to cart
  const handleAddToCart = async (art) => {
    try {
      const formData = new FormData();
      formData.append("artName", art.artName);
      formData.append("artDescription", art.artDescription);
      formData.append("artistName", art.artistName);
      formData.append("artCost", art.artCost);
      const imageResponse = await axios.get(
        `http://localhost:30025/api/art/${art.id}/image`,
        { responseType: "blob" }
      );
      formData.append(
        "artPicture",
        new File([imageResponse.data], "image.jpg")
      );

      await axios.post("http://localhost:30025/api/cart/add", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("Added to cart!");
    } catch (error) {
      console.error("Error adding to cart:", error);
      alert("Failed to add to cart.");
    }
  };

  // Delete cart item
  const handleDeleteCartItem = async (id) => {
    try {
      await axios.delete(`http://localhost:30025/api/cart/delete/${id}`);
      fetchCartItems(); // refresh cart
      alert("Item removed from cart.");
    } catch (error) {
      console.error("Error deleting cart item:", error);
      alert("Failed to remove item.");
    }
  };

  // Render posts
  const renderPosts = () => {
    if (selectedArt) {
      return (
        <div className="artwork-detail">
          <img
            src={`http://localhost:30025/api/art/${selectedArt.id}/image`}
            alt={selectedArt.artName}
            className="detail-img"
          />
          <h2>{selectedArt.artName}</h2>
          <p>{selectedArt.artDescription}</p>
          <p>
            <strong>Artist:</strong> {selectedArt.artistName}
          </p>
          <p>
            <strong>Price:</strong> ${selectedArt.artCost}
          </p>
          <button
            className="cart-btn"
            onClick={() => handleAddToCart(selectedArt)}
          >
            Add to Cart
          </button>
          <button className="back-btn" onClick={() => setSelectedArt(null)}>
            Back
          </button>
        </div>
      );
    }

    return (
      <div className="posts-page">
        <h2 className="section-title">All Posts</h2>
        <div className="artworks-grid">
          {arts.length > 0 ? (
            arts.map((art) => (
              <div
                key={art.id}
                className="art-card"
                onClick={() => setSelectedArt(art)}
              >
                <img
                  src={`http://localhost:30025/api/art/${art.id}/image`}
                  alt={art.artName}
                />
                <h3>{art.artName}</h3>
                <p>{art.artistName}</p>
                <p>${art.artCost}</p>
              </div>
            ))
          ) : (
            <p>No artworks available.</p>
          )}
        </div>
      </div>
    );
  };

  // Render cart
  const renderCart = () => {
    return (
      <div className="cart-page">
        <h2 className="section-title">My Cart</h2>
        <div className="artworks-grid">
          {cartItems.length > 0 ? (
            cartItems.map((item) => (
              <div key={item.id} className="art-card">
                <img
                  src={`http://localhost:30025/api/cart/${item.id}/image`}
                  alt={item.artName}
                />
                <h3>{item.artName}</h3>
                <p>{item.artistName}</p>
                <p>${item.artCost}</p>
                <p>{item.artDescription}</p>
                <button
                  className="delete-btn"
                  onClick={() => handleDeleteCartItem(item.id)}
                >
                  Delete
                </button>
              </div>
            ))
          ) : (
            <p>No items in cart.</p>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="customer-dashboard">
      {/* Sidebar */}
      <aside className="sidebar">
        <h1>Customer Dashboard</h1>
        <nav className="nav-links">
          <button
            className={`nav-link ${activeSection === "posts" ? "active" : ""}`}
            onClick={() => {
              setActiveSection("posts");
              setSelectedArt(null);
            }}
          >
            Posts
          </button>
          <button
            className={`nav-link ${activeSection === "cart" ? "active" : ""}`}
            onClick={() => setActiveSection("cart")}
          >
            My Cart
          </button>
        </nav>

        {/* Sidebar Profile */}
        <div className="sidebar-bottom">
          <div
            className="profile-card"
            onClick={() => setShowProfile(true)}
            style={{ cursor: "pointer" }}
          >
            {profile?.image ? (
              <img
                src={profile.image}
                alt="Profile"
                className="profile-avatar"
              />
            ) : (
              <FaUserCircle size={40} />
            )}
            <div className="profile-info">
              <p className="name">{profile?.username || "Guest"}</p>
              <p className="role">{profile?.role || "Unknown Role"}</p>
              <p className="email">{profile?.email}</p>
            </div>
          </div>
          <button className="logout-btn" onClick={handleLogout}>
            <FaSignOutAlt style={{ marginRight: "8px" }} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="dashboard-main">
        {activeSection === "posts" && renderPosts()}
        {activeSection === "cart" && renderCart()}
      </main>

      {/* Profile Popup */}
      {showProfile && profile && (
        <div className="popup-overlay">
          <div className="popup-card">
            <h2>Profile</h2>
            <p>
              <strong>Email:</strong> {profile.email}
            </p>
            <p>
              <strong>Role:</strong> {profile.role}
            </p>
            <p>
              <strong>Username:</strong>{" "}
              {isEditing ? (
                <>
                  <input
                    type="text"
                    value={editUsername}
                    onChange={(e) => setEditUsername(e.target.value)}
                  />
                  <button onClick={handleSaveUsername}>Save</button>
                  <button onClick={() => setIsEditing(false)}>Cancel</button>
                </>
              ) : (
                <>
                  {profile.username}{" "}
                  <button
                    onClick={() => {
                      setEditUsername(profile.username);
                      setIsEditing(true);
                    }}
                  >
                    Edit
                  </button>
                </>
              )}
            </p>
            <div className="btn-row">
              <button onClick={() => setShowProfile(false)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerDashboard;
