import { useContext, useEffect, useState } from "react";
import Card from "../components/Card";
import ConfirmationModel from "../components/ConfirmationModel";
import { useNavigate } from "react-router-dom";
import Snowfall from "react-snowfall";
import top_icon from "../assets/images/icon.png";
import ModeContext from "../Context/ModelContext";

export function Homepage() {
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [allPostData, setAllPostData] = useState([]);
  const [showModel, setShowModel] = useState(false);
  const navigate = useNavigate();

  
  const { mode } = useContext(ModeContext);

  const loggedInUserData = JSON.parse(localStorage.getItem("loginData"));

  useEffect(() => {
    const rawData = localStorage.getItem("postData");
    const data = rawData ? JSON.parse(rawData) : [];
    setAllPostData(data);
  }, []);

  const ScroolToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const openDeleteModel = (index) => {
    setSelectedIndex(index);
    setShowModel(true);
  };

  const ClickHandler = (id) => {
    navigate(`/posts/${id}`);
  };

  const confirmDelete = () => {
    const updatedPostData = allPostData.filter((_, i) => i !== selectedIndex);
    setAllPostData(updatedPostData);
    localStorage.setItem("postData", JSON.stringify(updatedPostData));
    setSelectedIndex(null);
    setShowModel(false);
  };

  const hideModelHandler = () => {
    setSelectedIndex(null);
    setShowModel(false);
  };

  const handleEdit = (id) => {
    navigate("/newpost", { state: { id } });
  };

  return (
    <>
     
      <div className={`home-page ${mode === "dark" ? "home-dark" : ""}`}>
        <h2 id="top" className="title">
          Created Posts
        </h2>

        <div className="card-container">
          {allPostData.length === 0 ? (
            <p className="no-data">No data found</p>
          ) : (
            allPostData.map((item, index) => (
              <Card
                key={index}
                title={item.title}
                desc={item.body}
                img={item.image}
                onRedirect={() => ClickHandler(item.id)}
                onEdit={
                  loggedInUserData?.role === "Admin"
                    ? () => handleEdit(item.id)
                    : undefined
                }
                onDelete={
                  loggedInUserData?.role === "Admin"
                    ? () => openDeleteModel(index)
                    : undefined
                }
              />
            ))
          )}

         
          <Snowfall color={mode === "dark" ? "#ffffff" : "pink"} />
        </div>

        {showModel && (
          <ConfirmationModel
            title="Delete Post"
            desc="Are you sure you want to delete this post?"
            onclose={hideModelHandler}
            onconfirm={confirmDelete}
            confirmBtnText="Delete"
          />
        )}

        <img
          src={top_icon}
          alt="Top Icon"
          className="top-scroll-btn"
          onClick={() => ScroolToSection("top")}
        />
      </div>
    </>
  );
}
