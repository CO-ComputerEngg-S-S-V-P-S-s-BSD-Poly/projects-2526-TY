import React from "react";
import { useNavigate } from "react-router-dom";
import { FaComments } from "react-icons/fa"; // Chat Icon

const ChatbotButton = () => {
  const navigate = useNavigate();

  return (
    <button
      className="chatbot-button"
      onClick={() => navigate("/chat")} // Navigate to Chat Page
    >
      <FaComments className="chat-icon" />
    </button>
  );
};

// ✅ Styles
const styles = `
  .chatbot-button {
    position: fixed;
    bottom: 20px;
    right: 20px;
    background-color:rgb(219,112,147); /* ✅ Chat Button Color */
    color: white;
    border: none;
    border-radius: 50%;
    width: 55px;
    height: 55px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 24px;
    cursor: pointer;
    box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.2);
    transition: transform 0.2s ease-in-out;
  }

  .chatbot-button:hover {
    transform: scale(1.1); /* Hover Effect */
  }

  .chat-icon {
    color: white;
  }
`;

// ✅ Inject Styles into the Document
const styleElement = document.createElement("style");
styleElement.innerHTML = styles;
document.head.appendChild(styleElement);

export default ChatbotButton;
