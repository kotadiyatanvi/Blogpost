import React, { useEffect, useState } from 'react';
import './EditProfile.css';

const EditProfileModal = ({ onClose, userId }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    mobilenumber: "",
    role: "",
    otp: "",
    birthdate: ""
  });
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // Fetch user data when modal opens
  useEffect(() => {
    if (userId) fetchUserById();
  }, [userId]);

  const fetchUserById = async () => {
    try {
      setIsLoading(true);
      setError("");
      setSuccessMsg("");

      const response = await fetch(
        `https://696b4a61624d7ddccaa0b5b0.mockapi.io/createpost/users/${userId}`
      );

      if (!response.ok) throw new Error("Failed to fetch user");

      const data = await response.json();

      setFormData({
        name: data.name || "",
        mobilenumber: data.mobilenumber || "",
        role: data.role || "",
        otp: data.otp || "",
        birthdate: data.birthdate || ""
      });
    } catch (err) {
      setError("Failed to load user data");
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      setError("");
      setSuccessMsg("");

      // DOB validation
      if (!formData.birthdate) {
        setError("Please select your birth date");
        return;
      }

      if (new Date(formData.birthdate) > new Date()) {
        setError("Birth date cannot be in the future");
        return;
      }

      const response = await fetch(
        `https://696b4a61624d7ddccaa0b5b0.mockapi.io/createpost/users/${userId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(formData)
        }
      );

      if (!response.ok) {
        setError("Failed to save profile");
        return;
      }

      const updatedData = await response.json();

      const loginData = JSON.parse(localStorage.getItem("loginData")) || {};
      localStorage.setItem(
        "loginData",
        JSON.stringify({ ...loginData, ...updatedData })
      );

      setSuccessMsg("Profile saved successfully");
    } catch (err) {
      setError("Something went wrong");
    }
  };

  return (
    <div className='modal-backdrop'>
      <div className='modal'>
        <h2>Edit Profile</h2>

        {error && <p style={{ color: "red", textAlign: "center" }}>{error}</p>}
        {successMsg && <p style={{ color: "green", textAlign: "center" }}>{successMsg}</p>}

        <form className="modal-form" onSubmit={(e) => e.preventDefault()}>
          <div className="input-group">
            <input
              type="text"
              name="name"
              className="textbox-login"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleChange}
            />
          </div>

          <div className="input-group">
            <input
              type="tel"
              name="mobilenumber"
              className="textbox-login"
              placeholder="Mobile Number"
              value={formData.mobilenumber}
              onChange={handleChange}
            />
          </div>

          <div className="input-group">
            <input
              type="date"
              name="birthdate"
              className="textbox-login"
              value={formData.birthdate}
              onChange={handleChange}
              max={new Date().toISOString().split("T")[0]}
            />
          </div>

          <div className="input-group">
            <select
              name="role"
              className="textbox-login"
              value={formData.role}
              disabled
            >
              <option value="Admin">Admin</option>
              <option value="User">User</option>
            </select>
          </div>

          <div className="input-group">
            <input
              type="text"
              className="textbox-login"
              placeholder="OTP"
              value={formData.otp}
              disabled
            />
          </div>

          <div className='modal-actions'>
            <button type="button" className='btn-cancell' onClick={onClose}>
              Cancel
            </button>

            <button type="button" className='btn-save' onClick={handleSave}>
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfileModal;
