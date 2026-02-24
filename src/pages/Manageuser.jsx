import React, { useEffect, useState, useContext } from "react";
import ModeContext from "../Context/ModelContext";

function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { mode } = useContext(ModeContext);

  const API_URL = "http://localhost:3001/users";

  // 🔹 Fetch users from JSON server
  const getUsers = async () => {
    try {
      setIsLoading(true);
      const res = await fetch(API_URL);
      
      if (!res.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await res.json();
      
      // Console માં ચેક કરો કે ડેટા આવે છે કે નહીં
      console.log("API માંથી આવેલો ડેટા:", data);

      // JSON Server ક્યારેક ડાયરેક્ટ એરે આપે છે, તો ક્યારેક ઓબ્જેક્ટમાં 'users' કી આપે છે.
      const userData = Array.isArray(data) ? data : (data.users || []);
      
      console.log("પ્રોસેસ થયેલો ડેટા:", userData);
      
      setUsers([...userData].reverse()); // લેટેસ્ટ યુઝર પહેલા બતાવવા માટે
    } catch (error) {
      console.error("Fetch Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // 🔹 Delete user function
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this user?");
    if (!confirmDelete) return;

    try {
      const res = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setUsers((prev) => prev.filter((user) => user.id !== id));
      } else {
        alert("Delete failed!");
      }
    } catch (error) {
      console.error("Delete Error:", error);
    }
  };

  useEffect(() => {
    getUsers();
  }, []);

  return (
    <div className={`manageuser-container ${mode === "dark" ? "dark-mode" : ""}`}>
      <div className="manageuser-header">
        <h1>Manage Users</h1>
        <button className="btn-refresh" onClick={getUsers}>
          Refresh Data
        </button>
      </div>

      {isLoading ? (
        <div className="loader">
          <p>Loading Users...</p>
        </div>
      ) : (
        <div className="table-wrapper">
          <table className="user-table">
            <thead>
              <tr>
                <th>User ID</th>
                <th>Mobile Number</th>
                <th>Role</th>
                <th>Created At</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {users.length > 0 ? (
                users.map((user) => (
                  <tr key={user.id}>
                    <td>
                      <span className="id-text">{user.id}</span>
                    </td>
                    <td>{user.phone || "N/A"}</td>
                    <td>
                      <span className={`role-tag ${user.role?.toLowerCase()}`}>
                        {user.role}
                      </span>
                    </td>
                    <td>
                      {user.createdAt 
                        ? new Date(user.createdAt).toLocaleDateString() 
                        : "N/A"}
                    </td>
                    <td>
                      <button
                        className="btn-delete"
                        onClick={() => handleDelete(user.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" style={{ textAlign: "center", padding: "30px" }}>
                    No users found in database.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default ManageUsers;