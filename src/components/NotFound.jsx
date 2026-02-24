import Navbar from "./Navbar";
import errorGiF from "../assets/images/404 blue.gif";

export default function NotFound() {
  return (
    <>
      <Navbar />
      <div
        style={{
          textAlign: "center",
          padding: "100px",
        }}
      >
        <h1>404 - Page Not Found</h1>
        <p>The page you are looking for does not exist.</p>
        <img
          src={errorGiF}
          alt="404 Not Found"
          style={{
            width: "300px",
            maxWidth: "100%",
            marginBottom: "10px",
          }}
        />

        
      </div>
    </>
  );
}
