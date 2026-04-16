import React, { useState } from "react";

const ProfileMenu = () => {
  const [open, setOpen] = useState(false);

  return (
    <div style={{ position: "relative" }}>
      {/* Profile Avatar */}
      <img
        src="/profile.jpg"   // yaha tu apni photo dalegi (public folder me)
        alt="profile"
        onClick={() => setOpen(!open)}
        style={{
          width: 38,
          height: 38,
          borderRadius: "50%",
          cursor: "pointer",
          border: "2px solid #7c3aed",
        }}
      />

      {/* Dropdown */}
      {open && (
        <div
          style={{
            position: "absolute",
            right: 0,
            top: 50,
            width: 220,
            background: "#0f172a",
            borderRadius: 12,
            padding: 12,
            boxShadow: "0 10px 30px rgba(0,0,0,0.6)",
            color: "#fff",
          }}
        >
          <div style={{ borderBottom: "1px solid #1e293b", paddingBottom: 8 }}>
            <p style={{ margin: 0, fontWeight: 600 }}>gun@gmail.com</p>
            <span style={{ fontSize: 12, color: "#94a3b8" }}>student</span>
          </div>

          <div style={{ marginTop: 10 }}>
            <p className="menuItem">My Downloads</p>
            <p className="menuItem">Disable Speech</p>
            <p
              className="menuItem"
              style={{ color: "#ef4444" }}
            >
              Logout
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileMenu;
