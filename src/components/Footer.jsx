import "./Footer.css";
import ModeContext from "../Context/ModelContext";
import { useContext } from "react";

const Footer = () => {
  const { mode } = useContext(ModeContext);

  return (
    <div className={`footer ${mode === "dark" ? "dark" : ""}`}>
      <div className="content">
        <p>
          ©{new Date().getFullYear()}. All Rights Reserved <b>BlogPost</b>.
        </p>
      </div>
    </div>
  );
};

export default Footer;
