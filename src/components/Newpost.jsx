import React, { useEffect, useState, useContext } from "react";
import "./Newpost.css";
import { v4 as uuidv4 } from "uuid";
import { toast, ToastContainer } from "react-toastify";
import { useLocation, useNavigate } from "react-router-dom";
import Snowfall from "react-snowfall";
import errorGiF from "../assets/images/Loading circles.gif";
import ModeContext from "../Context/ModelContext";

export default function Addpost() {
  const { mode } = useContext(ModeContext);

  const [createPostFormData, setCreatePostFormData] = useState({
    title: "",
    body: "",
    image: "", // base64
  });

  const [imagePreview, setImagePreview] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const editPostId = location.state?.id || null;

  const loggedInUserData = JSON.parse(localStorage.getItem("loginData"));
  const isAdmin = loggedInUserData?.role === "Admin";

  // 🔹 Edit mode data load
  useEffect(() => {
    if (!editPostId) return;
    const posts = JSON.parse(localStorage.getItem("postData")) || [];
    const postToEdit = posts.find((p) => p.id === editPostId);
    if (postToEdit) {
      setCreatePostFormData(postToEdit);
      setImagePreview(postToEdit.image);
    }
  }, [editPostId]);

  const handleOnChange = (field, value) => {
    setCreatePostFormData((p) => ({ ...p, [field]: value }));
    setErrors((e) => ({ ...e, [field]: "" }));
  };

  // 🔹 Image handle + preview + base64
  const handleImageChange = (file) => {
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setCreatePostFormData((p) => ({ ...p, image: reader.result }));
      setImagePreview(reader.result);
      setErrors((e) => ({ ...e, image: "" }));
    };
    reader.readAsDataURL(file);
  };

  const handlesubmit = (e) => {
    e.preventDefault();

    const newErrors = {};
    if (!createPostFormData.title.trim()) newErrors.title = "Title is required";
    if (!createPostFormData.body.trim()) newErrors.body = "Body is required";
    if (!createPostFormData.image) newErrors.image = "Image is required";

    setErrors(newErrors);
    if (Object.keys(newErrors).length) return;

    // 🔹 2 સેકન્ડ માટે લોડર શરૂ કરો
    setLoading(true);

    const posts = JSON.parse(localStorage.getItem("postData")) || [];

    const updatedPosts = editPostId
      ? posts.map((p) =>
          p.id === editPostId ? { ...p, ...createPostFormData } : p
        )
      : [...posts, { id: uuidv4(), ...createPostFormData }];

    // ડેટા લોકલ સ્ટોરેજમાં સેવ કરો
    localStorage.setItem("postData", JSON.stringify(updatedPosts));

    // 🔹 2000ms એટલે કે 2 સેકન્ડ પછી નેવિગેટ કરો
    setTimeout(() => {
      setLoading(false);
      toast.success(editPostId ? "Post updated successfully!" : "Post added successfully!");
      navigate("/");
    }, 2000); 
  };

  return (
    <div className={`addpost-wrapper ${mode === "dark" ? "dark" : ""}`}>
      <ToastContainer />
      <Snowfall color="pink" />

      {/* 🔹 CENTER LOADER (2 સેકન્ડ સુધી દેખાશે) */}
      {loading && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            background: "rgba(0,0,0,0.6)", // થોડું ડાર્ક બેકગ્રાઉન્ડ
            zIndex: 9999,
          }}
        >
          <div style={{ textAlign: "center", color: "white" }}>
            <img src={errorGiF} alt="loading" style={{ width: "100px" }} />
            <p style={{ marginTop: "10px", fontSize: "18px" }}>Processing, please wait...</p>
          </div>
        </div>
      )}

      <h1>{editPostId ? "Edit Post" : "Let's Create New Post"}</h1>

      <form className="add-post-form" onSubmit={handlesubmit}>
        <input
          type="text"
          placeholder="Enter Title"
          value={createPostFormData.title}
          onChange={(e) => handleOnChange("title", e.target.value)}
        />
        {errors.title && <span className="error">{errors.title}</span>}
        <br />

        <textarea
          className="input2"
          placeholder="Enter Body"
          value={createPostFormData.body}
          onChange={(e) => handleOnChange("body", e.target.value)}
        />
        {errors.body && <span className="error">{errors.body}</span>}
        <br />

        <input
          type="file"
          id="file-input"
          accept="image/*"
          onChange={(e) => handleImageChange(e.target.files[0])}
        />
        {errors.image && <span className="error">{errors.image}</span>}

        {/* 🔹 IMAGE PREVIEW */}
        {imagePreview && (
          <div className="preview-container">
            <img
              src={imagePreview}
              alt="preview"
              style={{
                width: "100%",
                maxWidth: "300px",
                marginTop: "20px",
                borderRadius: "8px",
                border: "2px solid #ddd"
              }}
            />
          </div>
        )}

        <div className="btn-wrapper">
          <button type="submit" disabled={loading}>
            {loading ? "Saving..." : (editPostId ? "Update Post" : "Add Post")}
          </button>

          {editPostId && (
            <button
              type="button"
              className="cancel-btn"
              onClick={() => navigate("/")}
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
}