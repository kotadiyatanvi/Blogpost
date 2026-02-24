import "./ExplorePost.css";
import Card from "./Card";
import Pagination from "./Pagination";
import { useEffect, useState, useContext } from "react";
import ConfirmationModel from "../components/ConfirmationModel";
import ModeContext from "../Context/ModelContext";

const ExplorePost = () => {
  const { mode } = useContext(ModeContext);

  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [postsPerPage, setPostsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [errors, setErrors] = useState({});
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);

  const [showConfirm, setShowConfirm] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const fetchData = async () => {
    try {
      const response = await fetch(
        "https://696b4a61624d7ddccaa0b5b0.mockapi.io/createpost/createpostdata"
      );
      const data = await response.json();
      const reversedData = [...data].reverse();
      setPosts(reversedData);
      setFilteredPosts(reversedData);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearch(value);

    const result = posts.filter(
      (item) =>
        item.title.toLowerCase().includes(value) ||
        item.body.toLowerCase().includes(value)
    );
    setFilteredPosts(result);
    setCurrentPage(1);
  };

  const openDeleteConfirm = (id) => {
    setDeleteId(id);
    setShowConfirm(true);
  };

  const confirmDelete = async () => {
    if (deleteId) {
      await fetch(
        `https://696b4a61624d7ddccaa0b5b0.mockapi.io/createpost/createpostdata/${deleteId}`,
        { method: "DELETE" }
      );

      setPosts(posts.filter((item) => item.id !== deleteId));
      setFilteredPosts(filteredPosts.filter((item) => item.id !== deleteId));
      alert("Post deleted successfully");
    }
    setShowConfirm(false);
    setDeleteId(null);
  };

  const PostDataGetById = (id) => {
    const post = posts.find((item) => item.id === id);
    if (!post) return;
    setTitle(post.title);
    setBody(post.body);
    setEditId(id);
    setShowForm(true);
  };

  const validateForm = () => {
    let newErrors = {};
    if (!title.trim()) newErrors.title = "Title is required";
    if (!body.trim()) newErrors.body = "Body is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    if (editId) {
      const updatedPosts = posts.map((item) =>
        item.id === editId ? { ...item, title, body } : item
      );
      setPosts(updatedPosts);
      setFilteredPosts(updatedPosts);
      setEditId(null);
    } else {
      const res = await fetch(
        "https://696b4a61624d7ddccaa0b5b0.mockapi.io/createpost/createpostdata",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ title, body }),
        }
      );
      const newPost = await res.json();
      setPosts([newPost, ...posts]);
      setFilteredPosts([newPost, ...filteredPosts]);
    }

    setTitle("");
    setBody("");
    setErrors({});
    setShowForm(false);
  };

  const startIndex = (currentPage - 1) * postsPerPage;
  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);

  return (
    <div className={`explore-wrapper ${mode === "dark" ? "dark" : ""}`}>
      <div className="explore-header">
        <h1>Explore Post</h1>
        <input
          type="search"
          placeholder="🔎 search"
          value={search}
          onChange={handleSearch}
        />
      </div>

      <button className="btn3" onClick={() => setShowForm(true)}>
        Create Form
      </button>

      {showForm && (
        <div className="create-form">
          <input
            type="text"
            placeholder="Enter Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          {errors.title && <p className="error">{errors.title}</p>}

          <input
            type="text"
            placeholder="Enter Body"
            value={body}
            onChange={(e) => setBody(e.target.value)}
          />
          {errors.body && <p className="error">{errors.body}</p>}

          <button className="btn3" onClick={handleSubmit}>
            {editId ? "Update" : "Submit"}
          </button>

          <button className="btn3" onClick={() => setShowForm(false)}>
            Cancel
          </button>
        </div>
      )}

      {loading ? (
        <h1>Loading...</h1>
      ) : (
        <div className="card-container">
          {filteredPosts
            .slice(startIndex, startIndex + postsPerPage)
            .map((item) => (
              <Card
                key={item.id}
                title={item.title}
                img={`https://picsum.photos/500/300?random=${item.id}`}
                desc={item.body}
                onDelete={() => openDeleteConfirm(item.id)}
                onEdit={() => PostDataGetById(item.id)}
              />
            ))}
        </div>
      )}

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPrev={() => setCurrentPage((p) => p - 1)}
        onNext={() => setCurrentPage((p) => p + 1)}
        pageSize={postsPerPage}
        onPageSizeChange={setPostsPerPage}
      />

      {showConfirm && (
        <ConfirmationModel
          title="Delete Post"
          desc="Are you sure you want to delete this post?"
          confirmBtnText="Delete"
          onclose={() => setShowConfirm(false)}
          onconfirm={confirmDelete}
        />
      )}
    </div>
  );
};

export default ExplorePost;
