import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

const defaultAccount = {
  email: "admin@example.com",
  password: "admin123",
  name: "Site Admin",
};

const roomTypes = ["Fully Furnished", "Semi-Furnished", "Budget Rooms", "Shop Rooms"];

const Admin = () => {
  const [account, setAccount] = useState(defaultAccount);
  const [isAuthed, setIsAuthed] = useState(false);
  const [authError, setAuthError] = useState("");
  const loginEmailRef = useRef(null);
  const loginPasswordRef = useRef(null);
  const signupNameRef = useRef(null);
  const signupEmailRef = useRef(null);
  const signupPasswordRef = useRef(null);

  const [rooms, setRooms] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const roomTitleRef = useRef(null);
  const roomCityRef = useRef(null);
  const roomAreaRef = useRef(null);
  const roomTypeRef = useRef(null);
  const roomPriceRef = useRef(null);
  const roomSizeRef = useRef(null);
  const roomAddressRef = useRef(null);
  const roomNearbyRef = useRef(null);

  const [bookings, setBookings] = useState([
    { id: "B-101", guest: "Riya Patil", city: "Pune", room: "Blue Ridge Studio", status: "Pending" },
    { id: "B-102", guest: "Amit Shah", city: "Mumbai", room: "Versova 2BHK", status: "Confirmed" },
    { id: "B-103", guest: "Neha Kulkarni", city: "Nashik", room: "College Road 2BHK", status: "Cancelled" },
  ]);

  // Load persisted admin + rooms
  useEffect(() => {
    const savedAuth = localStorage.getItem("adminAuthed") === "true";
    setIsAuthed(savedAuth);
    const savedRooms = JSON.parse(localStorage.getItem("adminRooms") || "[]");
    setRooms(savedRooms);
    // seed default admin account in storage if absent
    if (!localStorage.getItem("adminAccount")) {
      localStorage.setItem("adminAccount", JSON.stringify(defaultAccount));
    }
    // prefill login fields for convenience
    if (loginEmailRef.current) loginEmailRef.current.value = defaultAccount.email;
    if (loginPasswordRef.current) loginPasswordRef.current.value = defaultAccount.password;
    resetRoomForm();
  }, []);

  useEffect(() => {
    const savedAccount = JSON.parse(localStorage.getItem("adminAccount") || "null");
    if (savedAccount) setAccount(savedAccount);
  }, []);

  const persistRooms = (nextRooms) => {
    setRooms(nextRooms);
    localStorage.setItem("adminRooms", JSON.stringify(nextRooms));
  };

  // ---------- Auth ----------
  const handleLogin = (e) => {
    e.preventDefault();
    const email = loginEmailRef.current?.value.trim() || "";
    const password = loginPasswordRef.current?.value || "";
    setAuthError("");
    if (email === account.email && password === account.password) {
      localStorage.setItem("adminAuthed", "true");
      setIsAuthed(true);
    } else {
      setAuthError("Invalid credentials. Try admin@example.com / admin123 or your saved admin account.");
    }
  };

  const handleSignup = (e) => {
    e.preventDefault();
    // Disable signup: enforce single admin account
    setAuthError(`Signup disabled. Use ${defaultAccount.email} / ${defaultAccount.password}`);
  };

  const handleLogout = () => {
    localStorage.removeItem("adminAuthed");
    setIsAuthed(false);
  };

  // ---------- Rooms CRUD ----------
  const resetRoomForm = () => {
    [roomTitleRef, roomCityRef, roomAreaRef, roomTypeRef, roomPriceRef, roomSizeRef, roomAddressRef, roomNearbyRef].forEach(
      (ref) => {
        if (ref.current) ref.current.value = "";
      }
    );
    if (roomTypeRef.current) roomTypeRef.current.value = "Fully Furnished";
    setEditingId(null);
  };

  const handleAddOrUpdateRoom = (e) => {
    e.preventDefault();
    const title = roomTitleRef.current?.value.trim() || "";
    const city = roomCityRef.current?.value.trim() || "";
    const area = roomAreaRef.current?.value.trim() || "";
    const type = roomTypeRef.current?.value || "Fully Furnished";
    const price = roomPriceRef.current?.value.trim() || "";
    const size = roomSizeRef.current?.value.trim() || "";
    const address = roomAddressRef.current?.value.trim() || "";
    const nearby = roomNearbyRef.current?.value.trim() || "";

    if (!title || !city || !area || !type || !price || !address) {
      setAuthError("Please fill all required room fields.");
      return;
    }

    if (editingId) {
      const updated = rooms.map((r) =>
        r.id === editingId ? { ...r, title, city, area, type, price, size, address, nearby } : r
      );
      persistRooms(updated);
    } else {
      const newRoom = { id: `R-${Date.now()}`, title, city, area, type, price, size, address, nearby };
      persistRooms([...rooms, newRoom]);
    }
    resetRoomForm();
    setAuthError("");
  };

  const handleEditRoom = (room) => {
    setEditingId(room.id);
    if (roomTitleRef.current) roomTitleRef.current.value = room.title || "";
    if (roomCityRef.current) roomCityRef.current.value = room.city || "";
    if (roomAreaRef.current) roomAreaRef.current.value = room.area || "";
    if (roomTypeRef.current) roomTypeRef.current.value = room.type || "Fully Furnished";
    if (roomPriceRef.current) roomPriceRef.current.value = room.price || "";
    if (roomSizeRef.current) roomSizeRef.current.value = room.size || "";
    if (roomAddressRef.current) roomAddressRef.current.value = room.address || "";
    if (roomNearbyRef.current) roomNearbyRef.current.value = room.nearby || "";
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDeleteRoom = (id) => {
    const updated = rooms.filter((r) => r.id !== id);
    persistRooms(updated);
    if (editingId === id) resetRoomForm();
  };

  // ---------- Booking actions ----------
  const updateBookingStatus = (id, status) => {
    setBookings((prev) => prev.map((b) => (b.id === id ? { ...b, status } : b)));
  };

  const removeBooking = (id) => {
    setBookings((prev) => prev.filter((b) => b.id !== id));
  };

  const AuthCard = () => (
    <div className="row g-4">
      <div className="col-lg-6">
        <div className="p-4 h-100" style={panelStyle}>
          <p className="badge text-bg-info mb-2" style={{ width: "fit-content" }}>
            Admin Login
          </p>
          <h3 className="fw-bold mb-3">Access Admin Dashboard</h3>
          <p className="text-muted mb-4">
            Use the default admin (admin@example.com / admin123) or sign up a new admin account. Auth is local-only for now.
          </p>
          <form onSubmit={handleLogin}>
            <label className="form-label fw-semibold">Email</label>
            <input
              className="form-control form-control-lg mb-3"
              name="email"
              type="email"
              autoComplete="username"
              ref={loginEmailRef}
              onFocus={() => setAuthError("")}
              required
            />
            <label className="form-label fw-semibold">Password</label>
            <input
              className="form-control form-control-lg mb-3"
              name="password"
              type="password"
              autoComplete="current-password"
              ref={loginPasswordRef}
              onFocus={() => setAuthError("")}
              required
            />
            {authError && <p className="text-danger">{authError}</p>}
            <button className="btn btn-primary w-100" style={ctaStyle} type="submit">
              Login
            </button>
          </form>
        </div>
      </div>

      <div className="col-lg-6">
        <div className="p-4 h-100" style={panelStyle}>
          <p className="badge text-bg-warning mb-2" style={{ width: "fit-content" }}>
            New Admin
          </p>
          <h3 className="fw-bold mb-3">Sign up</h3>
          <form onSubmit={handleSignup}>
            <label className="form-label fw-semibold">Full Name</label>
            <input
              className="form-control form-control-lg mb-3"
              name="name"
              autoComplete="name"
              ref={signupNameRef}
              onFocus={() => setAuthError("")}
              required
            />
            <label className="form-label fw-semibold">Email</label>
            <input
              className="form-control form-control-lg mb-3"
              name="email"
              type="email"
              autoComplete="username"
              ref={signupEmailRef}
              onFocus={() => setAuthError("")}
              required
            />
            <label className="form-label fw-semibold">Password</label>
            <input
              className="form-control form-control-lg mb-3"
              name="password"
              type="password"
              autoComplete="new-password"
              ref={signupPasswordRef}
              onFocus={() => setAuthError("")}
              required
            />
            {authError && <p className="text-danger">{authError}</p>}
            <button className="btn btn-success w-100" style={ctaStyle} type="submit">
              Create Admin
            </button>
          </form>
        </div>
      </div>
    </div>
  );

  const Dashboard = () => (
    <>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <p className="text-muted mb-1">Admin Panel</p>
          <h2 className="fw-bold mb-0">Rooms & Bookings</h2>
        </div>
        <div className="d-flex gap-2">
          <button className="btn btn-outline-danger" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>

      {/* Room form */}
      <div className="row g-4">
        <div className="col-lg-5">
          <div className="p-4" style={panelStyle}>
            <p className="badge text-bg-primary mb-2" style={{ width: "fit-content" }}>
              {editingId ? "Edit Room" : "Add Room"}
            </p>
            <form onSubmit={handleAddOrUpdateRoom}>
              <input className="form-control form-control-lg mb-3" name="title" placeholder="Room Title" ref={roomTitleRef} required />
              <div className="row g-3">
                <div className="col-6">
                  <input className="form-control form-control-lg mb-3" name="city" placeholder="City" ref={roomCityRef} required />
                </div>
                <div className="col-6">
                  <input className="form-control form-control-lg mb-3" name="area" placeholder="Area" ref={roomAreaRef} required />
                </div>
              </div>
              <div className="row g-3">
                <div className="col-6">
                  <select className="form-control form-control-lg mb-3" name="type" defaultValue="Fully Furnished" ref={roomTypeRef}>
                    {roomTypes.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="col-6">
                  <input className="form-control form-control-lg mb-3" name="price" placeholder="Price / month" ref={roomPriceRef} required />
                </div>
              </div>
              <input className="form-control form-control-lg mb-3" name="size" placeholder="Size e.g. 2 BHK | 900 sq.ft" ref={roomSizeRef} />
              <input className="form-control form-control-lg mb-3" name="address" placeholder="Full Address" ref={roomAddressRef} required />
              <input className="form-control form-control-lg mb-3" name="nearby" placeholder="Nearby (optional)" ref={roomNearbyRef} />

              <div className="d-flex gap-2">
                <button className="btn btn-primary flex-grow-1" style={ctaStyle} type="submit">
                  {editingId ? "Update Room" : "Add Room"}
                </button>
                <button className="btn btn-outline-secondary" type="button" onClick={resetRoomForm}>
                  Clear
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Room list */}
        <div className="col-lg-7">
          <div className="p-4" style={panelStyle}>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 className="mb-0 fw-bold">Rooms</h5>
              <span className="badge text-bg-light">Total {rooms.length}</span>
            </div>
            {rooms.length === 0 ? (
              <p className="text-muted">No rooms yet. Add the first one.</p>
            ) : (
              <div className="table-responsive">
                <table className="table align-middle">
                  <thead>
                    <tr>
                      <th>Title</th>
                      <th>City/Area</th>
                      <th>Type</th>
                      <th>Price</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {rooms.map((r) => (
                      <tr key={r.id}>
                        <td>
                          <div className="fw-semibold">{r.title}</div>
                          <small className="text-muted">{r.address}</small>
                        </td>
                        <td>
                          {r.city} - {r.area}
                          <div className="text-muted small">{r.nearby}</div>
                        </td>
                        <td>{r.type}</td>
                        <td>Rs {r.price}</td>
                        <td className="text-end">
                          <button className="btn btn-sm btn-outline-primary me-2" onClick={() => handleEditRoom(r)}>
                            Edit
                          </button>
                          <button className="btn btn-sm btn-outline-danger" onClick={() => handleDeleteRoom(r.id)}>
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bookings */}
      <div className="p-4 mt-4" style={panelStyle}>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5 className="mb-0 fw-bold">Manage Bookings</h5>
          <span className="badge text-bg-light">Total {bookings.length}</span>
        </div>
        <div className="table-responsive">
          <table className="table align-middle">
            <thead>
              <tr>
                <th>ID</th>
                <th>Guest</th>
                <th>City</th>
                <th>Room</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((b) => (
                <tr key={b.id}>
                  <td className="fw-semibold">{b.id}</td>
                  <td>{b.guest}</td>
                  <td>{b.city}</td>
                  <td>{b.room}</td>
                  <td>
                    <select
                      className="form-select form-select-sm"
                      value={b.status}
                      onChange={(e) => updateBookingStatus(b.id, e.target.value)}
                    >
                      <option>Pending</option>
                      <option>Confirmed</option>
                      <option>Cancelled</option>
                    </select>
                  </td>
                  <td className="text-end">
                    <button className="btn btn-sm btn-outline-danger" onClick={() => removeBooking(b.id)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );

  return (
    <motion.div
      className="container py-5"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      style={{ minHeight: "100vh" }}
    >
      {!isAuthed ? <AuthCard /> : <Dashboard />}
    </motion.div>
  );
};

const panelStyle = {
  background: "#ffffff",
  borderRadius: "16px",
  border: "1px solid #e2e8f0",
  boxShadow: "0 18px 40px rgba(15,23,42,0.08)",
};

const ctaStyle = {
  backgroundColor: "#20b2aa",
  borderColor: "#20b2aa",
  fontWeight: 700,
  height: "52px",
};

export default Admin;
