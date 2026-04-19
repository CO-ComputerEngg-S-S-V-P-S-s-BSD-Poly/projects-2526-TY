import React, { useState, useEffect } from "react";
import "./ProfileSidebar.css";
import logo from "../Assets/logo-removebg-preview.png";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const ProfileSidebar = ({ onClose }) => {
  const navigate = useNavigate();

  const [form, setForm] = useState({});
  const [mode, setMode] = useState("menu");
  const [bookings, setBookings] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showSpecialization, setShowSpecialization] = useState(false);

  // useEffect(() => {
  //   const storedUser = JSON.parse(localStorage.getItem("user"));
  //   if (storedUser) {
  //     setForm(storedUser);
  //     fetchBookings(storedUser);
  //   }
  // }, []);

  useEffect(() => {
  const storedUser = JSON.parse(localStorage.getItem("user"));

  if (storedUser) {
    setForm(storedUser);
    fetchBookings(storedUser);
    fetchNotifications(storedUser);

    const interval = setInterval(() => {
      fetchBookings(storedUser);
      fetchNotifications(storedUser);
    }, 5000); // every 5 sec

    return () => clearInterval(interval);
  }
}, []);

  const fetchBookings = async (userData) => {
    try {
      if (userData.role === "user") {
        const res = await axios.get(
          `http://localhost:8000/api/booking/user/${userData._id}`
        );
        setBookings(res.data);
      }

      if (userData.role === "pandit") {
        const res = await axios.get(
          `http://localhost:8000/api/booking/pandit/${userData._id}`
        );
        setBookings(res.data);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const fetchNotifications = async (userData) => {
  try {
    let res;

    if (userData.role === "user") {
      res = await axios.get(
        `http://localhost:8000/api/booking/user/${userData._id}`
      );
    }

    if (userData.role === "pandit") {
      res = await axios.get(
        `http://localhost:8000/api/booking/pandit/${userData._id}`
      );
    }

    const pendingBookings = res.data.filter(
      (b) => b.status === "Pending"
    );

    setUnreadCount(pendingBookings.length);

  } catch (err) {
    console.log(err);
  }
};

  const updateStatus = async (id, status) => {
    try {
      if (status === "Confirmed") {
        await axios.put(
          `http://localhost:8000/api/booking/confirm/${id}`
        );
      }

      if (status === "Rejected") {
        await axios.put(
          `http://localhost:8000/api/booking/reject/${id}`
        );
      }

      fetchBookings(form);
    } catch (err) {
      console.log(err);
    }
  };

  const deleteBooking = async (id) => {
    try {
      await axios.delete(
        `http://localhost:8000/api/booking/delete/${id}`
      );
      fetchBookings(form);
    } catch (err) {
      console.log(err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    onClose();
    navigate("/");
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const getStatusStyle = (status) => {
    if (status === "Confirmed") return { color: "green", fontWeight: "bold" };
    if (status === "Rejected") return { color: "red", fontWeight: "bold" };
    return { color: "orange", fontWeight: "bold" };
  };

  return (
    <div className="profile-sidebar" style={{ overflowY: "auto", maxHeight: "100vh" }}>
      <span className="close-btn" onClick={onClose}>✖</span>

      <div className="profile-header">
        {form.role === "pandit" && form.image ? (
          <img
            src={`http://localhost:8000/Images/${form.image}`}
            alt="profile"
            className="profile-logo"
          />
        ) : (
          <img
            src={logo}
            alt="logo"
            className="profile-logo"
          />
        )}

        <h3>{form.name || "No Name"}</h3>
        <p style={{ fontSize: "12px", color: "gray" }}>
          {form.role?.toUpperCase()}
        </p>
      </div>

      {mode === "menu" && (
        <div className="profile-menu">

{form.role === "user" && (
  <>
    <div className="role-section">
      <p><strong>Email:</strong> {form.email}</p>
      <p><strong>Mobile:</strong> {form.MobileNo}</p>
      <p><strong>Address:</strong> {form.address}</p>
    </div>

    <div style={{ textAlign: "center", marginTop: "20px" }}>
      <h2 style={{ color: "orange", marginBottom: "15px" }}>
        My Bookings
      </h2>

      {bookings.length === 0 && (
        <p style={{ color: "#888" }}>No Bookings</p>
      )}

      {bookings.map((b) => (
        <div
          key={b._id}
          style={{
            background: "#f9f9f9",
            padding: "15px",
            marginBottom: "15px",
            borderRadius: "12px",
            boxShadow: "0 4px 10px rgba(0,0,0,0.08)",
            textAlign: "left",
            display: "flex",
            gap: "15px",
            alignItems: "center"
          }}
        >
          {b.pandit?.image && (
            <img
              src={`http://localhost:8000/Images/${b.pandit.image}`}
              alt="pandit"
              style={{
                width: "70px",
                height: "70px",
                borderRadius: "50%",
                objectFit: "cover"
              }}
            />
          )}
          {/* changes kiye hai */}

          {/* <div style={{ flex: 1 }}>
            <p><strong>Pandit:</strong> {b.pandit?.name}</p>
            <p><strong>Booked For:</strong> {b.name || form.name}</p>
            <p><strong>Address:</strong> {b.address || form.address}</p>
            <p><strong>Mobile:</strong> {b.phone || form.MobileNo}</p>
            <p><strong>Puja:</strong> {b.pujaSlug}</p>
            <p><strong>Price:</strong> ₹{b.price}</p>
            <p>
              📅 {new Date(b.date).toLocaleDateString("en-IN", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            </p>
           <p>
            <strong>Time:</strong>{" "}
            {new Date(`1970-01-01T${b.time}`).toLocaleTimeString("en-IN", {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>

            <p>
              <strong>Status:</strong>{" "}
              <span
                style={{
                  padding: "4px 10px",
                  borderRadius: "20px",
                  fontSize: "13px",
                  background:
                    b.status === "Confirmed"
                      ? "#d4edda"
                      : b.status === "Rejected"
                      ? "#f8d7da"
                      : "#fff3cd",
                  color:
                    b.status === "Confirmed"
                      ? "green"
                      : b.status === "Rejected"
                      ? "red"
                      : "#b8860b",
                  fontWeight: "bold"
                }}
              >
                {b.status}
              </span>
            </p>

            {b.status !== "Pending" && (
              <button
                onClick={() => deleteBooking(b._id)}
                style={{
                  marginTop: "8px",
                  background: "#444",
                  color: "white",
                  border: "none",
                  padding: "6px 12px",
                  borderRadius: "6px",
                  cursor: "pointer"
                }}
              >
                Delete
              </button>
            )}
          </div> */}
          <div style={{ flex: 1 }}>

  {/* TOP LINE */}
  <div style={{
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "6px"
  }}>
    <h4 style={{ margin: 0, fontSize: "15px" }}>
      {b.pandit?.name}
    </h4>

    <span style={{
      fontSize: "11px",
      padding: "3px 8px",
      borderRadius: "10px",
      background:
        b.status === "Confirmed"
          ? "#d4edda"
          : b.status === "Rejected"
          ? "#f8d7da"
          : "#fff3cd",
      color:
        b.status === "Confirmed"
          ? "green"
          : b.status === "Rejected"
          ? "red"
          : "#b8860b",
      fontWeight: "600"
    }}>
      {b.status}
    </span>
  </div>

{/* PUJA */}
<p style={{
  margin: "2px 0",
  fontSize: "13px",
  fontWeight: "600",
  color: "#333"
}}>
  {b.pujaSlug}
</p>

  {/* DETAILS COMPACT */}
  <div style={{
    fontSize: "12px",
    color: "#444",
    marginTop: "5px",
    lineHeight: "1.4"
  }}>
    <p style={{ margin: 0 }}>
      👤 {b.name || form.name}
    </p>
    <p style={{ margin: 0 }}>
      📍 {b.address || form.address}
    </p>
    <p style={{ margin: 0 }}>
      📞 {b.phone || form.MobileNo}
    </p>
  </div>

  {/* DATE + PRICE */}
  <div style={{
    display: "flex",
    justifyContent: "space-between",
    marginTop: "6px",
    fontSize: "12px"
  }}>
    <span>
      📅 {new Date(b.date).toLocaleDateString("en-IN")}
    </span>

    <span style={{ fontWeight: "bold" }}>
      ₹{b.price}
    </span>
  </div>

  {/* TIME */}
  <p style={{
    margin: "4px 0 0",
    fontSize: "12px",
    color: "#666"
  }}>
    ⏰ {new Date(`1970-01-01T${b.time}`).toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
    })}
  </p>

  {/* DELETE BUTTON */}
  {b.status !== "Pending" && (
    <button
      onClick={() => deleteBooking(b._id)}
      style={{
        marginTop: "8px",
        background: "#222",
        color: "#fff",
        border: "none",
        padding: "5px 10px",
        borderRadius: "6px",
        fontSize: "12px",
        cursor: "pointer"
      }}
    >
      Delete
    </button>
  )}

</div>


        </div>
      ))}
    </div>
  </>
)}
{form.role === "pandit" && (
  <>
    <div className="role-section">
      <p><strong>Email:</strong> {form.email}</p>
      <p><strong>Mobile:</strong> {form.MobileNo}</p>
      <p><strong>Experience:</strong> {form.experience}</p>
      <p><strong>Address:</strong> {form.address}</p>
      <p><strong>Specialization:</strong></p>

        <button
          style={{
            background: "orange",
            color: "white",
            border: "none",
            padding: "5px 10px",
            borderRadius: "6px",
            cursor: "pointer",
            marginBottom: "5px"
          }}
          onClick={() => setShowSpecialization(!showSpecialization)}
        >
          {showSpecialization ? "Hide Specialization ▲" : "Show Specialization ▼"}
        </button>

        {showSpecialization && (
          <ul style={{ paddingLeft: "18px" }}>
            {form.specialization?.map((item, index) => (
              <li key={index}>
                {item.name} — ₹{item.price}
              </li>
            ))}
          </ul>
        )}
    </div>

    <div style={{ textAlign: "center", marginTop: "20px" }}>
      <h2 style={{ color: "orange", marginBottom: "15px" }}>
        Booking Requests
      </h2>

      {bookings.length === 0 && (
        <p style={{ color: "#a84919" }}>No Requests</p>
      )}

      {bookings.map((b) => (
        <div
          key={b._id}
          style={{
            background: "#f9f9f9",
            padding: "15px",
            marginBottom: "15px",
            borderRadius: "12px",
            boxShadow: "0 4px 10px rgba(0,0,0,0.08)",
            textAlign: "left"
          }}
        >
          {/* <p><strong>User Name:</strong> {b.user?.name}</p>
          <p><strong>Mobile:</strong> {b.user?.MobileNo}</p>
          <p><strong>Address:</strong> {b.user?.address}</p> */}
        
          <p><strong>User Name:</strong> {b.name || b.user?.name}</p>
          <p><strong>Mobile:</strong> {b.phone || b.user?.MobileNo}</p>
          <p><strong>Address:</strong> {b.address || b.user?.address}</p>
          <p><strong>Puja:</strong> {b.pujaSlug}</p>
          <p><strong>Price:</strong> ₹{b.price}</p>
          <p>
            📅 {new Date(b.date).toLocaleDateString("en-IN", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
          </p>
          <p>
            <strong>Time:</strong>{" "}
            {new Date(`1970-01-01T${b.time}`).toLocaleTimeString("en-IN", {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>

          <p>
            <strong>Status:</strong>{" "}
            <span style={getStatusStyle(b.status)}>
              {b.status}
            </span>
          </p>

          {b.status === "Pending" && (
            <div style={{ marginTop: "10px", display: "flex", gap: "10px" }}>
              <button
                onClick={() => updateStatus(b._id, "Confirmed")}
                style={{
                  background: "green",
                  color: "white",
                  border: "none",
                  padding: "6px 12px",
                  borderRadius: "6px",
                  cursor: "pointer"
                }}
              >
                Confirm
              </button>

              <button
                onClick={() => updateStatus(b._id, "Rejected")}
                style={{
                  background: "red",
                  color: "white",
                  border: "none",
                  padding: "6px 12px",
                  borderRadius: "6px",
                  cursor: "pointer"
                }}
              >
                Reject
              </button>
            </div>
          )}

          {b.status !== "Pending" && (
            <button
              onClick={() => deleteBooking(b._id)}
              style={{
                marginTop: "10px",
                background: "#444",
                color: "white",
                border: "none",
                padding: "6px 12px",
                borderRadius: "6px",
                cursor: "pointer"
              }}
            >
              Delete
            </button>
          )}
        </div>
      ))}
    </div>
  </>
)}


          <button onClick={() => setMode("edit")}>Edit Profile</button>
          <button onClick={handleLogout}>Logout</button>
        </div>
      )}

      {mode === "edit" && (
        <div className="profile-edit">

          <input name="name" value={form.name || ""} onChange={handleChange} placeholder="Name" />
          <input name="MobileNo" value={form.MobileNo || ""} onChange={handleChange} placeholder="Mobile" />
          <input name="email" value={form.email || ""} onChange={handleChange} placeholder="Email" />
          <input name="address" value={form.address || ""} onChange={handleChange} placeholder="Address" />

          {form.role === "pandit" && (
            <>
              <input name="experience" value={form.experience || ""} onChange={handleChange} placeholder="Experience" />
              <input name="specialization" value={form.specialization || ""} onChange={handleChange} placeholder="Specialization" />
            </>
          )}

          <button onClick={() => setMode("menu")}>Save</button>
          <button onClick={() => setMode("menu")}>Back</button>

        </div>
      )}

    </div>
  );
};

export default ProfileSidebar;




