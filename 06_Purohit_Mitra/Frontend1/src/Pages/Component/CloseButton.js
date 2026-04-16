import React from "react";
import { useNavigate } from "react-router-dom";
import "./CloseButton.css";

const CloseButton = () => {
  const navigate = useNavigate();

  return (
    <button className="close-btn" onClick={() => navigate(-1)}>
      ✖
    </button>
  );
};

export default CloseButton;