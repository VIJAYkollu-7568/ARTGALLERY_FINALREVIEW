import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./AdminDashboard.css";

const AdminDashboard = () => {
  const [activeSection, setActiveSection] = useState("customers");
  const navigate = useNavigate();

  // Admin info
  const [admin, setAdmin] = useState({
    username: "Admin",
    email: "",
    role: "Admin",
  });

  useEffect(() => {
    const savedAdmin = JSON.parse(localStorage.getItem("admin"));
    if (savedAdmin) {
      setAdmin(savedAdmin);
    }
  }, []);

  // Fetch customers
  const [customers, setCustomers] = useState([]);

  useEffect(() => {
    if (activeSection === "customers" || activeSection === "artists") {
      fetch("http://localhost:30025/admin/customers")
        .then((res) => res.json())
        .then((data) => setCustomers(data))
        .catch((err) => console.error("Error fetching customers:", err));
    }
  }, [activeSection]);

  // Delete customer
  const handleDeleteCustomer = (id) => {
    if (window.confirm("Are you sure?")) {
      fetch(`http://localhost:30025/admin/customers/${id}`, {
        method: "DELETE",
      })
        .then((res) => {
          if (res.ok) {
            setCustomers(customers.filter((c) => c.id !== id));
            alert("Deleted successfully!");
          }
        })
        .catch((err) => console.error("Error deleting:", err));
    }
  };

  // Add customer
  const [newCustomer, setNewCustomer] = useState({
    username: "",
    email: "",
    password: "",
  });

  const handleAddCustomer = () => {
    if (!newCustomer.username || !newCustomer.email || !newCustomer.password) {
      alert("Fill all fields");
      return;
    }
    fetch("http://localhost:30025/customer/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newCustomer),
    })
      .then((res) => res.json())
      .then((data) => {
        alert("Customer added!");
        setCustomers([...customers, data]);
        setNewCustomer({ username: "", email: "", password: "" });
        setActiveSection("customers");
      });
  };

  // Add artist
  const [newArtist, setNewArtist] = useState({
    username: "",
    email: "",
    password: "",
  });

  const handleAddArtist = () => {
    if (!newArtist.username || !newArtist.email || !newArtist.password) {
      alert("Fill all fields");
      return;
    }
    fetch("http://localhost:30025/artist/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newArtist),
    })
      .then((res) => res.json())
      .then(() => {
        alert("Artist added!");
        setNewArtist({ username: "", email: "", password: "" });
        setActiveSection("artists");
      });
  };

  // Posts
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState({ title: "", content: "" });

  const handleUpload = () => {
    if (newPost.title && newPost.content) {
      setPosts([
        ...posts,
        { id: Date.now(), title: newPost.title, content: newPost.content },
      ]);
      setNewPost({ title: "", content: "" });
      setActiveSection("allPosts");
    } else {
      alert("Fill fields!");
    }
  };

  // Logout
  const handleLogout = () => {
    localStorage.removeItem("admin");
    navigate("/");
  };

  // Render sections
  const renderSection = () => {
    switch (activeSection) {
      case "customers":
      case "artists":
        return (
          <div className="page-container">
            <h2>{activeSection === "customers" ? "Customers" : "Artists"}</h2>

            <table className="customers-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Username</th>
                  <th>Email</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {customers.map((c) => (
                  <tr key={c.id}>
                    <td>{c.id}</td>
                    <td>{c.username}</td>
                    <td>{c.email}</td>
                    <td>
                      <button
                        className="delete-btn"
                        onClick={() => handleDeleteCustomer(c.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
                {customers.length === 0 && (
                  <tr>
                    <td colSpan="4" style={{ textAlign: "center" }}>
                      No records found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        );

      case "addCustomer":
        return (
          <div className="page-container">
            <h2>Add Customer</h2>
            <input
              type="text"
              placeholder="Username"
              value={newCustomer.username}
              onChange={(e) =>
                setNewCustomer({ ...newCustomer, username: e.target.value })
              }
            />
            <input
              type="email"
              placeholder="Email"
              value={newCustomer.email}
              onChange={(e) =>
                setNewCustomer({ ...newCustomer, email: e.target.value })
              }
            />
            <input
              type="password"
              placeholder="Password"
              value={newCustomer.password}
              onChange={(e) =>
                setNewCustomer({ ...newCustomer, password: e.target.value })
              }
            />
            <button onClick={handleAddCustomer}>Add Customer</button>
          </div>
        );

      case "addArtist":
        return (
          <div className="page-container">
            <h2>Add Artist</h2>
            <input
              type="text"
              placeholder="Username"
              value={newArtist.username}
              onChange={(e) =>
                setNewArtist({ ...newArtist, username: e.target.value })
              }
            />
            <input
              type="email"
              placeholder="Email"
              value={newArtist.email}
              onChange={(e) =>
                setNewArtist({ ...newArtist, email: e.target.value })
              }
            />
            <input
              type="password"
              placeholder="Password"
              value={newArtist.password}
              onChange={(e) =>
                setNewArtist({ ...newArtist, password: e.target.value })
              }
            />
            <button onClick={handleAddArtist}>Add Artist</button>
          </div>
        );

      case "allPosts":
        return (
          <div className="page-container">
            <h2>All Posts</h2>
            {posts.length === 0 ? <p>No posts yet</p> : null}
            {posts.map((p) => (
              <div key={p.id}>
                <h3>{p.title}</h3>
                <p>{p.content}</p>
              </div>
            ))}
          </div>
        );

      case "upload":
        return (
          <div className="page-container">
            <h2>Upload Post</h2>
            <input
              type="text"
              placeholder="Title"
              value={newPost.title}
              onChange={(e) =>
                setNewPost({ ...newPost, title: e.target.value })
              }
            />
            <textarea
              placeholder="Content"
              value={newPost.content}
              onChange={(e) =>
                setNewPost({ ...newPost, content: e.target.value })
              }
            ></textarea>
            <button onClick={handleUpload}>Upload</button>
          </div>
        );

      default:
        return <p>Select a section</p>;
    }
  };

  return (
    <div className="admin-dashboard">
      {/* Sidebar */}
      <aside className="sidebar">
        <h1>Admin Dashboard</h1>

        <nav className="nav-links">
          <button
            className={`nav-link ${
              activeSection === "customers" ? "active" : ""
            }`}
            onClick={() => setActiveSection("customers")}
          >
            Customers
          </button>

          <button
            className={`nav-link ${
              activeSection === "artists" ? "active" : ""
            }`}
            onClick={() => setActiveSection("artists")}
          >
            Artists
          </button>

          <button
            className={`nav-link ${
              activeSection === "addCustomer" ? "active" : ""
            }`}
            onClick={() => setActiveSection("addCustomer")}
          >
            ➕ Add Customer
          </button>

          <button
            className={`nav-link ${
              activeSection === "addArtist" ? "active" : ""
            }`}
            onClick={() => setActiveSection("addArtist")}
          >
            ➕ Add Artist
          </button>

          <button
            className={`nav-link ${
              activeSection === "allPosts" ? "active" : ""
            }`}
            onClick={() => setActiveSection("allPosts")}
          >
            All Posts
          </button>

          <button
            className={`nav-link ${
              activeSection === "upload" ? "active" : ""
            }`}
            onClick={() => setActiveSection("upload")}
          >
            Upload Post
          </button>
        </nav>

        {/* FIXED BOTTOM SECTION */}
        <div className="sidebar-bottom">
          <div className="profile-card">
            <div className="admin-name">{admin.username}</div>
            <div className="email">{admin.email}</div>
            <div className="role">{admin.role}</div>
          </div>

          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="dashboard-main">{renderSection()}</main>
    </div>
  );
};

export default AdminDashboard;
