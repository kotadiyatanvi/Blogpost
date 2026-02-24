import "./Card.css";
// import Snowfall from 'react-snowfall';

const Card = (Props) => {
 
  const loggedInUserData = JSON.parse(localStorage.getItem("loginData"));
  const isAdmin = loggedInUserData?.role === "Admin";

  return (
    <div className="card">
      <div className="img-center" onClick={Props.onRedirect}>
        {Props.img && <img src={Props.img} alt="" />}
      </div>
                                   
      <div className="card-content">
        <h1>{Props.title}</h1>
        <p>
          {Props.desc.length > 90 ? Props.desc.substring(0, 90) + "..." : Props.desc}
        </p>
      </div>

  
      {isAdmin && (
        <div className="btn-group">
          <button className="btn1" onClick={Props.onEdit}>
            Edit
          </button>

          <button className="btn2" onClick={Props.onDelete}>
            Delete
          </button>
        </div>
      )}
    </div>
  );
};

export default Card;
