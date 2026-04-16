import React, { useState } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";

import Home from "./pages/Home";
import Preference from "./pages/Preference";
import Flatmate from "./pages/Flatmate";
import NeedRoom from "./pages/NeedRoom";
import PostFlat from "./pages/PostFlat";
import PostFlatmate from "./pages/PostFlatmate";
import Admin from "./pages/Admin";
import GetOTP from "./pages/GetOTP";
import VerifyOTP from "./pages/VerifyOTP";
import Auth from "./pages/Auth";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import List from "./pages/List";
import NeedRoommate from "./pages/NeedRoommate";
import Search from "./pages/Search";
import UserDashboard from "./pages/UserDashboard";
import { AnimatePresence, motion } from "framer-motion";
import { FaComments } from "react-icons/fa";

const CHATBOT_URL = import.meta.env.VITE_CHATBOT_URL || "http://127.0.0.1:5000";

const pageVariants = {
  initial: { opacity: 0, scale: 0.95 },
  animate: { 
    opacity: 1, 
    scale: 1, 
    transition: { type: "spring", stiffness: 80, damping: 20, duration: 1.2, delay: 0.2 } 
  },
  exit: { opacity: 0, scale: 0.95, transition: { ease: "easeOut", duration: 1 } },
};

const App = () => {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState("profile");
  
  // ✅ State for Chatbot visibility
  const [openChat, setOpenChat] = useState(false);

  return (
    <>
      <Header setActiveTab={setActiveTab} />

      {/* ✅ New Chatbot Floating Button */}
      <button
        onClick={() => setOpenChat(!openChat)}
        style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          backgroundColor: 'rgb(219,112,147)',
          color: 'white',
          border: 'none',
          borderRadius: '50%',
          width: '55px',
          height: '55px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '24px',
          cursor: 'pointer',
          boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)',
          transition: 'transform 0.2s ease-in-out',
          zIndex: 1000,
        }}
      >
        <FaComments />
      </button>

      {/* ✅ iframe Chatbot */}
      {openChat && (
        <iframe
          src={CHATBOT_URL}
          title="Chatbot"
          style={{
            position: 'fixed',
            bottom: '80px',
            right: '20px',
            width: '370px',
            height: '500px',
            border: 'none',
            borderRadius: '15px',
            boxShadow: '0px 4px 8px rgba(0,0,0,0.2)',
            zIndex: 999,
          }}
        />
      )}

      <AnimatePresence mode="wait">
        <motion.div 
          key={location.pathname} 
          initial="initial" 
          animate="animate" 
          exit="exit" 
          variants={pageVariants}
        >
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<Home />} />
            <Route path="/preferences" element={<Preference />} />
            <Route path="/flatmate" element={<Flatmate />} />
            <Route path="/need-room" element={<NeedRoom />} />
            <Route path="/need-roommate" element={<NeedRoommate />} />
            <Route path="/post-flat" element={<PostFlat />} />
            <Route path="/post-flatmate" element={<PostFlatmate />} />
            <Route path="/get-otp" element={<GetOTP />} />
            <Route path="/verify-otp" element={<VerifyOTP />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/login" element={<Login />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/list" element={<List />} />
            <Route path="/search" element={<Search />} />
            <Route path="/user-dashboard" element={<UserDashboard activeTab={activeTab} />} />
          </Routes>
        </motion.div>
      </AnimatePresence>

      {location.pathname === "/" && <Footer />}
    </>
  );
};

export default App;
