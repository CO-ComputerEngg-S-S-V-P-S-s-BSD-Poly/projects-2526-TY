import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import { FaPhone } from "react-icons/fa"; // Import icons
import stylesImage from "../assets/styles.png"; // ✅ Import styles.png from assets

const Search = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGender, setSelectedGender] = useState("");
  const [bookingListing, setBookingListing] = useState(null);
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [bookingMessage, setBookingMessage] = useState("");

  // ✅ Extract query parameters (location & lookingFor)
  const queryParams = new URLSearchParams(location.search);
  const searchLocation = queryParams.get("location");
  const searchGender = queryParams.get("lookingFor");

  useEffect(() => {
    if (searchLocation) {
      fetchByLocation();
    } else if (searchGender) {
      fetchByGender();
    }
  }, [searchLocation, searchGender]);

  // 🔍 Fetch Listings by Location
  const fetchByLocation = async () => {
    setLoading(true);
    try {
      const response = await axios.post(
        "http://localhost:5000/api/need-room/match-need-flatmate",
        { location: searchLocation },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
      const adminRooms = JSON.parse(localStorage.getItem("adminRooms") || "[]").map((room) => ({
        _id: `admin-${room.id}`,
        location: room.city,
        area: room.area,
        lookingFor: room.type,
        rent: room.price,
        occupation: room.size || "",
        description: `${room.address || ""}${room.nearby ? " | Nearby: " + room.nearby : ""}`,
        userId: { name: "Admin Listing" }
      }));
      setListings([...(response.data.matches || []), ...adminRooms]);
    } catch (err) {
      setError("❌ Failed to fetch listings by location.");
    }
    setLoading(false);
  };

  // 🎯 Fetch Listings by Gender
  const fetchByGender = async () => {
    setLoading(true);
    try {
      const response = await axios.post(
        "http://localhost:5000/api/need-flatmate/match-need-room",
        searchGender === "All" ? {} : { lookingFor: searchGender },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
      setListings(response.data.matches);
    } catch (err) {
      setError("❌ Failed to fetch listings by gender.");
    }
    setLoading(false);
  };

  // ✅ Handle Search Enter Key
  const handleSearch = (e) => {
    if (e.key === "Enter" && searchQuery) {
      navigate(`/search?location=${searchQuery}`);
    }
  };

  // ✅ Handle Gender Filter Enter Key
  const handleGenderSearch = (e) => {
    if (e.key === "Enter" && selectedGender) {
      navigate(`/search?lookingFor=${selectedGender}`);
    }
  };

  // --- Booking helpers ---
  const getBookings = () => JSON.parse(localStorage.getItem("roomBookings") || "[]");
  const hasActiveBooking = (id) => {
    const today = new Date().setHours(0, 0, 0, 0);
    return getBookings().some(
      (b) => b.listingId === id && new Date(b.endDate).setHours(0, 0, 0, 0) >= today && b.status === "Booked"
    );
  };
  const checkAvailability = (id, start, end) => {
    if (!start || !end) return false;
    const startDate = new Date(start);
    const endDate = new Date(end);
    return !getBookings().some((b) => {
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
    setBookingListing(listing);
    setBookingMessage("");
    const today = new Date().toISOString().split("T")[0];
    setCheckIn(today);
    setCheckOut(today);
  };
  const handleConfirmBooking = () => {
    if (!bookingListing || !checkIn || !checkOut) {
      setBookingMessage("Please select dates.");
      return;
    }
    if (new Date(checkIn) > new Date(checkOut)) {
      setBookingMessage("Check-out must be after check-in.");
      return;
    }
    if (!checkAvailability(bookingListing._id, checkIn, checkOut)) {
      setBookingMessage("Not available for selected dates.");
      return;
    }
    const newBooking = {
      id: `BK-${Date.now()}`,
      listingId: bookingListing._id,
      title: bookingListing.lookingFor || bookingListing.title || "Room",
      location: bookingListing.location,
      area: bookingListing.area || "",
      startDate: checkIn,
      endDate: checkOut,
      status: "Booked",
    };
    const nextBookings = [...getBookings(), newBooking];
    localStorage.setItem("roomBookings", JSON.stringify(nextBookings));
    setBookingMessage("Booking confirmed!");
    setTimeout(() => setBookingListing(null), 800);
  };

  return (
    <motion.div
      className="container d-flex flex-column align-items-center justify-content-start vh-100 pt-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* ✅ Animated Heading & Description */}
      <motion.h2
        className="text-center mb-3"
        style={{ fontWeight: "bold", color: "#20b2aa" }}
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        🔍 Search for Your Perfect Match!
      </motion.h2>
      <motion.p
        className="text-center mb-4"
        style={{ fontSize: "16px", color: "rgb(219,112,147)" }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        Find your ideal **roommate or accommodation** by selecting a **city** or filtering by **gender**.  
        Just **type and press Enter** to get the best matches! 🚀
      </motion.p>

      {/* ✅ Image and Search Bar Row */}
      <div className="d-flex align-items-center justify-content-between w-100 px-5 mb-4">
        {/* ✅ Image on the Left Side */}
        <motion.img
          src={stylesImage} // ✅ Using imported image
          alt="Styles"
          className="me-4"
          style={{ width: "45%", height: "70%", maxWidth: "500px", borderRadius: "10px" }}
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1 }}
        />

        {/* ✅ Search Bars on the Right Side */}
        <div className="d-flex flex-column align-items-center w-50">
          {/* ✅ Search Bar for Location */}
          <div className="input-group mb-3 w-100">
            <input
              type="text"
              className="form-control"
              placeholder="🔍 Enter City (Pune, Mumbai, etc.) and Press Enter"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleSearch}
              style={{
                border: "2px solid #20b2aa",
                borderRadius: "10px",
                fontWeight: "bold",
                padding: "10px",
                color: "#20b2aa"
              }}
            />
          </div>

          {/* ✅ Gender Filter */}
          <div className="input-group mb-3 w-100">
            <select
              className="form-select"
              value={selectedGender}
              onChange={(e) => setSelectedGender(e.target.value)}
              onKeyDown={handleGenderSearch}
              style={{
                border: "2px solid rgb(219,112,147)",
                borderRadius: "10px",
                fontWeight: "bold",
                padding: "10px",
                color: "#20b2aa"
              }}
            >
              <option value="">🎯 Select Gender and Press Enter</option>
              <option value="All">All</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          </div>
        </div>
      </div>

      {/* ✅ Listings Section - 3 Containers Per Row with Same Height & Width */}
      <div className="row w-100 p-3">
        {loading ? (
          <p className="text-center">Loading...</p>
        ) : error ? (
          <p className="text-danger text-center">{error}</p>
        ) : listings.length === 0 ? (
          <p className="text-center">No matching listings found.</p>
        ) : (
          listings.map((listing) => (
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
                  height: "350px", // ✅ Same Height for All Containers
                  borderRadius: "15px",
                  background: "#f9f9f9",
                  boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between"
                }}
              >
                {/* ✅ User Info */}
                {listing.userId && (
                  <div className="d-flex align-items-center mb-3">
                    {listing.userId.profilePic && (
                      <img
                        src={`http://localhost:5000/${listing.userId.profilePic}`}
                        alt="User"
                        className="rounded-circle me-3"
                        width="50"
                        height="50"
                      />
                    )}
                    <div>
                      <h6 className="mb-0">{listing.userId.name}</h6>
                      <p className="mb-0">
                        <a href={`tel:${listing.userId.mobile}`} style={{ textDecoration: "none", color: "#20b2aa" }}>
                          <FaPhone className="me-2" />
                          {listing.userId.mobile}
                        </a>
                      </p>
                    </div>
                  </div>
                )}
                <h5>{listing.location}</h5>
                {listing.area && <p><strong>Area:</strong> {listing.area}</p>}
                <p><strong>Looking For:</strong> {listing.lookingFor}</p>
                <p><strong>Rent:</strong> ₹{listing.rent}</p>
                <p><strong>Occupation:</strong> {listing.occupation}</p>
                <p><strong>Description:</strong> {listing.description}</p>
                <div className="d-flex justify-content-between align-items-center mt-2">
                  <span className="badge text-bg-light">{hasActiveBooking(listing._id) ? "Booked" : "Available"}</span>
                  <button className="btn btn-sm btn-outline-primary" onClick={() => handleOpenBooking(listing)}>
                    Book
                  </button>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {bookingListing && (
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
          onClick={() => setBookingListing(null)}
        >
          <div
            className="bg-white p-4 rounded shadow"
            style={{ width: "95%", maxWidth: "420px" }}
            onClick={(e) => e.stopPropagation()}
          >
            <h5 className="fw-bold mb-2">{bookingListing.lookingFor || bookingListing.title || "Room Booking"}</h5>
            <p className="text-muted mb-1">
              {bookingListing.location}
              {bookingListing.area ? ` • ${bookingListing.area}` : ""}
            </p>
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
              <button className="btn btn-outline-secondary" onClick={() => setBookingListing(null)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default Search;
