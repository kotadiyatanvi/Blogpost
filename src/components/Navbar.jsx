import React, { useState, useEffect, useContext } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { MdOutlineDarkMode } from "react-icons/md";
import "./Navbar.css";
import EditProfile from "./EditProfile";
import ModeContext from "../Context/ModelContext";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { mode, toggleMode } = useContext(ModeContext);

  const loggedInUserData = JSON.parse(localStorage.getItem("loginData"));
  const user = loggedInUserData?.role?.charAt(0);

  const [showModel, setShowModel] = useState(false);
  const [activeNav, setActiveNav] = useState("");
  const [showEditProfile, setShowEditProfile] = useState(false);

  useEffect(() => {
    if (location.pathname === "/") setActiveNav("home");
    else if (location.pathname === "/newpost") setActiveNav("newpost");
    else if (location.pathname === "/Manageuser") setActiveNav("manageuser");
    else setActiveNav("");
  }, [location.pathname]);

  const handleLogout = () => {
    localStorage.removeItem("loginData");
    setShowModel(false);
    navigate("/login");
  };

  return (
    <>
      <nav className={`navbar ${mode === "dark" ? "nav-dark" : ""}`}>
        <h1>BlogPost</h1>
        <ul className="nav-links">
          <li><Link className={`color ${activeNav === "home" ? "active-nav" : ""}`} to="/">Home</Link></li>
          {loggedInUserData?.role === "Admin" && (
            <>
              <li><Link className={`color ${activeNav === "newpost" ? "active-nav" : ""}`} to="/newpost">New Post</Link></li>
              <li><Link className={`color ${activeNav === "manageuser" ? "active-nav" : ""}`} to="/Manageuser">Manage User</Link></li>
            </>
          )}
          <li><Link className="color" to="/Explorepost">ExplorePost</Link></li>
          <li><p className="color" onClick={() => setShowModel(true)} style={{ cursor: "pointer" }}>Logout</p></li>
        </ul>

        <div className="nav-icon">
          {loggedInUserData?.role && (
            <span className="user-role" onClick={() => setShowEditProfile(true)}>{user}</span>
          )}
          <span style={{ marginLeft: "8px", cursor: "pointer" }} onClick={toggleMode}>
            <MdOutlineDarkMode />
          </span>
          <span style={{ marginLeft: "4px" }}>{mode === "dark" ? "Dark" : "Light"}</span>
        </div>
      </nav>

      {showModel && (
        <div className="confirm-overlay">
          <div className="confirm-box">
            <h3>Confirm Logout</h3>
            <p>Are you sure you want to logout?</p>
            <div className="confirm-actions">
              <button className="btn-cancel" onClick={() => setShowModel(false)}>Cancel</button>
              <button className="btn-logout" onClick={handleLogout}>Logout</button>
            </div>
          </div>
        </div>
      )}

      {showEditProfile && (
        <EditProfile
          userId={loggedInUserData?.id}
          onClose={() => setShowEditProfile(false)}
          onSave={(updatedData) => {
            localStorage.setItem("loginData", JSON.stringify({ ...loggedInUserData, ...updatedData }));
            setShowEditProfile(false);
          }}
        />
      )}
    </>
  );
};

export default Navbar;