import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import {
  FaPlus,
  FaUsers,
  FaHome,
  FaBuilding,
  FaComments,
  FaMapMarkerAlt,
  FaUserFriends,
  FaRupeeSign,
  FaRegListAlt,
  FaInfoCircle,
  FaWhatsapp
} from "react-icons/fa";

const Dashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [listings, setListings] = useState([]);
  const [filteredListings, setFilteredListings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [matchPercentages, setMatchPercentages] = useState({});
  const [bookingRoom, setBookingRoom] = useState(null);
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [bookingMessage, setBookingMessage] = useState("");

  useEffect(() => {
    fetchListings();
  }, [activeTab]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const cityFilter = params.get("location");

    if (cityFilter) {
      const filtered = listings.filter(
        (listing) => listing.location.toLowerCase() === cityFilter.toLowerCase()
      );
      setFilteredListings(filtered);
    } else {
      setFilteredListings(listings);
    }
  }, [listings, location.search]);

  const fetchListings = async () => {
    setLoading(true);
    setError("");
    let urls = [];

    if (activeTab === "all") {
      urls = [
        "http://localhost:5000/api/need-flatmate/need-room-posts",
        "http://localhost:5000/api/need-room/need-flatmate-posts"
      ];
    } else if (activeTab === "rooms") {
      urls = ["http://localhost:5000/api/need-room/need-flatmate-posts"];
    } else if (activeTab === "roommates") {
      urls = ["http://localhost:5000/api/need-flatmate/need-room-posts"];
    }

    try {
      const token = localStorage.getItem("token");
      const responses = await Promise.all(
        urls.map((url) =>
          axios.get(url, {
            headers: { Authorization: `Bearer ${token}` }
          })
        )
      );

      const apiListings = responses.flatMap((res) => res.data);

      // Admin rooms saved via admin panel (localStorage)
      const adminRoomsRaw = JSON.parse(localStorage.getItem("adminRooms") || "[]");
      const adminListings =
        activeTab === "all" || activeTab === "rooms"
          ? adminRoomsRaw.map((room) => ({
              _id: `admin-${room.id}`,
              location: room.city || "NA",
              area: room.area || "",
              lookingFor: room.type || "Room",
              rent: room.price || "NA",
              need: room.title || "Room",
              description: room.address || "" + (room.nearby ? ` | Nearby: ${room.nearby}` : ""),
              userId: { name: "Admin Listing" }
            }))
          : [];

      const combinedListings = [...apiListings, ...adminListings];
      setListings(combinedListings);

      setMatchPercentages((prev) => {
        const newPercentages = { ...prev };
        combinedListings.forEach((listing) => {
          if (!newPercentages[listing._id]) {
            newPercentages[listing._id] = Math.floor(Math.random() * 100) + 1;
          }
        });
        return newPercentages;
      });
    } catch (err) {
      setError("❌ Failed to load data. Please try again.");
    }
    setLoading(false);
  };

  const getBookings = () => JSON.parse(localStorage.getItem("roomBookings") || "[]");
  const hasActiveBooking = (id) => {
    const storedBookings = getBookings();
    const today = new Date().setHours(0, 0, 0, 0);
    return storedBookings.some(
      (b) => b.listingId === id && new Date(b.endDate).setHours(0, 0, 0, 0) >= today && b.status === "Booked"
    );
  };

  const checkAvailability = (id, start, end) => {
    if (!start || !end) return false;
    const storedBookings = getBookings();
    const startDate = new Date(start);
    const endDate = new Date(end);
    return !storedBookings.some((b) => {
      if (b.listingId !== id) return false;
      const bStart = new Date(b.startDate);
      const bEnd = new Date(b.endDate);
      return b.status === "Booked" && startDate <= bEnd && endDate >= bStart;
    });
  };

  const handleOpenBooking = (listing) => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }
    setBookingRoom(listing);
    setBookingMessage("");
    const today = new Date().toISOString().split("T")[0];
    setCheckIn(today);
    setCheckOut(today);
  };

  const handleConfirmBooking = () => {
    if (!bookingRoom || !checkIn || !checkOut) {
      setBookingMessage("Please select dates.");
      return;
    }
    if (new Date(checkIn) > new Date(checkOut)) {
      setBookingMessage("Check-out must be after check-in.");
      return;
    }
    if (!checkAvailability(bookingRoom._id, checkIn, checkOut)) {
      setBookingMessage("Not available for selected dates.");
      return;
    }
    const newBooking = {
      id: `BK-${Date.now()}`,
      listingId: bookingRoom._id,
      title: bookingRoom.need || bookingRoom.title || "Room",
      location: bookingRoom.location,
      area: bookingRoom.area || "",
      startDate: checkIn,
      endDate: checkOut,
      status: "Booked",
    };
    const nextBookings = [...getBookings(), newBooking];
    localStorage.setItem("roomBookings", JSON.stringify(nextBookings));
    setBookingMessage("Booking confirmed!");
    setTimeout(() => {
      setBookingRoom(null);
    }, 800);
  };

  return (
    <motion.div
      className="container d-flex flex-column align-items-center justify-content-start vh-100 pt-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-center mb-4" style={{ fontWeight: "bold", color: "#20b2aa" }}>
        Dashboard
      </h2>

      <div className="w-100 d-flex flex-wrap justify-content-between align-items-center px-4 mb-3">
        <div className="d-flex flex-wrap gap-3">
          {["all", "rooms", "roommates"].map((tab, index) => (
            <button
              key={index}
              className={`btn ${activeTab === tab ? "active" : ""}`}
              style={{
                backgroundColor: activeTab === tab ? "#20b2aa" : "transparent",
                color: activeTab === tab ? "white" : "#20b2aa",
                borderRadius: "10px",
                padding: "10px 20px",
                fontWeight: "bold",
                border: "2px solid #20b2aa"
              }}
              onClick={() => setActiveTab(tab)}
            >
              {tab === "all" ? <FaHome className="me-2" /> : tab === "rooms" ? <FaBuilding className="me-2" /> : <FaUsers className="me-2" />}
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        <button
          className="btn"
          style={{
            backgroundColor: "#20b2aa",
            color: "#fff",
            border: "2px solid black",
            borderRadius: "10px",
            padding: "7px 16px"
          }}
          onClick={() => navigate("/list")}
        >
          <FaPlus className="me-2" />
          Add Listing
        </button>
      </div>

      <div className="w-100 p-3">
        {loading ? (
          <p className="text-center">Loading...</p>
        ) : error ? (
          <p className="text-danger text-center">{error}</p>
        ) : filteredListings.length === 0 ? (
          <p className="text-center">No listings found for this location.</p>
        ) : (
          <div className="row">
            {filteredListings.map((listing) => (
              <motion.div
                key={listing._id}
                className="col-md-4 mb-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.05, transition: { duration: 0.3 } }}
              >
                <div
                  className="card shadow-lg p-3"
                  style={{
                    width: "100%",
                    height: "320px",
                    borderRadius: "15px",
                    background: "#f9f9f9",
                    boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between"
                  }}
                >
                  {listing.userId && (
                    <div className="d-flex align-items-center mb-3">
                      {listing.userId.profilePic && (
                        <img
                          src={`http://localhost:5000/${listing.userId.profilePic}`}
                          alt="User"
                          className="rounded-circle border me-3"
                          width="60"
                          height="60"
                          style={{ objectFit: "cover" }}
                        />
                      )}
                      <div>
                        <h6 className="mb-1" style={{ fontWeight: "bold", fontSize: "16px" }}>
                          {listing.userId.name}
                        </h6>
                        <p className="mb-1">
                          <a
                            href={`https://wa.me/${listing.userId.mobile}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ textDecoration: "none", color: "#25D366" }}
                          >
                            <FaWhatsapp className="me-2" />
                            {listing.userId.mobile}
                          </a>
                        </p>
                      </div>
                    </div>
                  )}

                  <h5 className="mb-1 d-flex align-items-center"><FaMapMarkerAlt className="me-2 text-primary" /> {listing.location}</h5>
                  {listing.area && <p className="mb-1 d-flex align-items-center"><FaMapMarkerAlt className="me-2" />Area: {listing.area}</p>}
                  <p className="mb-1 d-flex align-items-center"><FaUserFriends className="me-2" /><strong>Looking For:</strong> {listing.lookingFor}</p>
                  <p className="mb-1 d-flex align-items-center"><FaRupeeSign className="me-2" /><strong>Rent:</strong> ₹{listing.rent}</p>
                  <p className="mb-1 d-flex align-items-center"><FaRegListAlt className="me-2" /><strong>Need:</strong> {listing.need}</p>
                  <p className="mb-1 d-flex align-items-center"><FaInfoCircle className="me-2" /><strong>Description :</strong> {listing.description}</p>
                  <p className="mb-1 d-flex align-items-center"><FaRegListAlt className="me-2" /><strong>Matched:</strong> {matchPercentages[listing._id]}%</p>
                  <div className="d-flex justify-content-between align-items-center mt-2">
                    <span className="badge text-bg-light">{hasActiveBooking(listing._id) ? "Booked" : "Available"}</span>
                    <button className="btn btn-sm btn-outline-primary" onClick={() => handleOpenBooking(listing)}>
                      Book
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {bookingRoom && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.45)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 2000
          }}
          onClick={() => setBookingRoom(null)}
        >
          <div
            className="bg-white p-4 rounded shadow"
            style={{ width: "95%", maxWidth: "420px" }}
            onClick={(e) => e.stopPropagation()}
          >
            <h5 className="fw-bold mb-2">{bookingRoom.need || bookingRoom.title || "Room Booking"}</h5>
            <p className="text-muted mb-1">{bookingRoom.location}{bookingRoom.area ? ` • ${bookingRoom.area}` : ""}</p>
            <div className="mb-3">
              <label className="form-label fw-semibold">Check-in</label>
              <input type="date" className="form-control" value={checkIn} onChange={(e) => setCheckIn(e.target.value)} />
            </div>
            <div className="mb-3">
              <label className="form-label fw-semibold">Check-out</label>
              <input type="date" className="form-control" value={checkOut} onChange={(e) => setCheckOut(e.target.value)} />
            </div>
            {bookingMessage && (
              <p className={bookingMessage.includes("confirmed") ? "text-success" : "text-danger"}>{bookingMessage}</p>
            )}
            <div className="d-flex gap-2">
              <button className="btn btn-primary flex-grow-1" onClick={handleConfirmBooking}>Confirm</button>
              <button className="btn btn-outline-secondary" onClick={() => setBookingRoom(null)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default Dashboard;
