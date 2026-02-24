import "./Login.css";
import img from "../assets/images/login.png";
import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import ConfirmationModel from "../components/ConfirmationModel";
import Snowfall from 'react-snowfall';

const Login = () => {
  const [mobilenumber, setMobileNumber] = useState("");
  const [role, setRole] = useState("");
  const [otp, setOtp] = useState("");
  const [generatedOtp, setGeneratedOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const navigate = useNavigate();

  const handleMobileChange = (e) => {
    const value = e.target.value.replace(/\D/g, "");
    if (value.length <= 10) setMobileNumber(value);
  };

  const handleGenerateOtp = () => {
    if (!mobilenumber) {
      toast.error("Mobile number is required");
      return;
    }
    if (mobilenumber.length !== 10) {
      toast.error("Mobile number must be 10 digits");
      return;
    }
    if (!role) {
      toast.error("Role is required");
      return;
    }

    const randomOtp = Math.floor(1000 + Math.random() * 9000);
    setGeneratedOtp(randomOtp.toString());

    alert("One Time Password: " + randomOtp);
    setOtp(randomOtp.toString());
  };

  const handleLogin = async () => {
    if (!mobilenumber) {
      toast.error("Mobile number is required");
      return;
    }
    if (mobilenumber.length !== 10) {
      toast.error("Mobile number must be exactly 10 digits");
      return;
    }
    if (!role) {
      toast.error("Role is required");
      return;
    }
    if (!otp) {
      toast.error("OTP is required");
      return;
    }
    if (otp !== generatedOtp) {
      toast.error("Invalid OTP");
      return;
    }

    const formData = {
      mobilenumber,
      role,
      otp,
    };

    try {
      setLoading(true); 
      const url = "https://69833dc79c3efeb892a4fb78.mockapi.io/Registration";
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json", 
        },
        body: JSON.stringify(formData), 
      });

      console.log(response, "res");

      if (!response.ok) {
        toast.error("Invalid request");
        setLoading(false);
        return;
      }

      const data = await response.json();
      console.log("Form submitted:", data);

      localStorage.setItem("loginData", JSON.stringify(data));

    } catch (error) {
      toast.error("Error");
      console.error(error);
    } 

    toast.success("Login Successfully");

    setMobileNumber("");
    setRole("");
    setOtp("");
    setGeneratedOtp("");

    setTimeout(() => {
      navigate("/");
    }, 1500);
  };

  const openLoginConfirm = (e) => {
    e.preventDefault();
    setShowConfirm(true);
  };

  const confirmLogin = () => {
    setShowConfirm(false);
    handleLogin();
  };

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />
      <Snowfall color="pink" />
      <div className="login-wrapper">
        <div className="login-image">
          <img src={img} alt="Login" />
        </div>

        <div className="login-container">
          <h2>Hello Again,🖐</h2>
          <h3>Welcome Back, Let's get started</h3>

          <form className="login-form">
            <input
              type="text"
              placeholder="Mobile Number"
              value={mobilenumber}
              onChange={handleMobileChange}
              maxLength={10}
            />

            <select value={role} onChange={(e) => setRole(e.target.value)}>
              <option value="">Select a Role</option>
              <option value="Admin">Admin</option>
              <option value="User">User</option> 
            </select>

            <button type="button" onClick={handleGenerateOtp}>
              Generate OTP
            </button>

            <input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />

            <button type="button" onClick={openLoginConfirm}>
              Login
            </button>
          </form>
        </div>
      </div>

      {showConfirm && (
        <ConfirmationModel
          title="Confirm Login"
          desc="Are you sure you want to login?"
          confirmBtnText="Login"
          onclose={() => setShowConfirm(false)}
          onconfirm={confirmLogin}
        />
      )}
    </>
  );
};

export default Login;
