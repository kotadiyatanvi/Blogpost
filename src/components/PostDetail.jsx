import React, { useEffect, useState, useContext } from "react";
import "./PostDetail.css";
import ConfirmationModel from "../components/ConfirmationModel";
import { useNavigate, useParams } from "react-router-dom";
import Snowfall from "react-snowfall";
import ModeContext from "../Context/ModelContext";

const PostDetail = () => {
  const postData = JSON.parse(localStorage.getItem("postData")) || [];
  const { PostId } = useParams();
  const [currentpost, setcurrentpost] = useState({});
  const navigate = useNavigate();
  const { mode } = useContext(ModeContext);

  useEffect(() => {
    const filtered = postData.find(
      (item) => String(item.id) === String(PostId)
    );
    if (filtered) setcurrentpost(filtered);
  }, [PostId]);

  const handleEditpost = () => {
    navigate("/newpost", {
      state: { id: PostId },
    });
  };

  const [showModel, setShowModel] = useState(false);
  const [isDeleted, setIsDeleted] = useState(false);

  const hideModelHandler = () => {
    setShowModel(false);
  };

  const confirmDelete = () => {
    const updatedPosts = postData.filter(
      (item) => String(item.id) !== String(PostId)
    );
    localStorage.setItem("postData", JSON.stringify(updatedPosts));
    setIsDeleted(true);
    setShowModel(false);
    navigate("/");
  };

  if (isDeleted) {
    return <h2 style={{ textAlign: "center" }}>Post Deleted</h2>;
  }

  return (
    <div
      className={`post-detail-wrapper ${mode === "dark" ? "dark" : ""}`}
    >
      {showModel && (
        <ConfirmationModel
          title="Delete Post"
          desc="Are you sure you want to delete this post?"
          onclose={hideModelHandler}
          onconfirm={confirmDelete}
          confirmBtnText="Delete"
        />
      )}

      <Snowfall color="pink" />

      <div className="post-card">
        <img
          src={currentpost.image || "/rect-logo.png"}
          alt="Post"
          className="post-image"
        />

        <div className="post-content">
          <h2>{currentpost.title}</h2>
          <p>{currentpost.body}</p>

          <div className="post-actions">
            <button className="btn edit" onClick={handleEditpost}>
              Edit
            </button>
            <button
              className="btn delete"
              onClick={() => setShowModel(true)}
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostDetail;
