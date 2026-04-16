// import React, { useState } from "react";
// import axios from "axios";
// import "./PujaPages.css";
// import { toast } from "react-toastify";
// import mandala from "../../Assets/mandalaright-removebg-preview.png";

// import { FaBoxOpen, FaInfoCircle } from "react-icons/fa";
// import { MdKeyboardArrowDown } from "react-icons/md";
// import { GiHerbsBundle } from "react-icons/gi";

// const PujaPage = ({
//   title,
//   description,
//   youtubeUrl,
//   information,
//   panditSamagri,
//   yajmanSamagri,
//   faqs
// }) => {

//   const [openContentModal, setOpenContentModal] = useState(null);
//   const [openFaq, setOpenFaq] = useState(null);

//   const [selectedDate, setSelectedDate] = useState("");
//   const [selectedTime, setSelectedTime] = useState("");

//   const [showPanditModal, setShowPanditModal] = useState(false);
//   const [pandits, setPandits] = useState([]);
//   const [loading, setLoading] = useState(false);

//   // 🔥 Fetch Pandits
//   const fetchPandits = async () => {
//     try {
//       setLoading(true);

//       const res = await axios.get(
//         `http://localhost:8000/api/pandit/by-specialization/${encodeURIComponent(title)}`
//       );

//       setPandits(res.data);

//     } catch (error) {
//       console.log(error);
//       setPandits([]);
//     }

//     setLoading(false);
//     setShowPanditModal(true);
//   };

//   // 🔥 Handle Booking
// // 🔥 Handle Booking
// const handleBooking = async (pandit) => {
//   try {

//     const storedUser = JSON.parse(localStorage.getItem("user"));

//     if (!storedUser) {
//       toast.error("Please login first");
//       return;
//     }

//     if (!selectedDate || !selectedTime) {
//       toast.error("Please select date and time");
//       return;
//     }

//     const selectedDateTime = new Date(`${selectedDate}T${selectedTime}`);
//     const now = new Date();

//     if (selectedDateTime <= now) {
//       toast.error("Please select future date and time");
//       return;
//     }

//     // ⭐ FIND PRICE FROM SPECIALIZATION
//     const pujaPrice = pandit.specialization?.find(
//       (sp) => sp.name === title
//     )?.price;

//     await axios.post("http://localhost:8000/api/booking/create", {
//       userId: storedUser._id,
//       panditId: pandit._id,
//       pujaSlug: title,
//       price: pujaPrice,   // now this works
//       date: selectedDate,
//       time: selectedTime
//     });

//     toast.success("Booking Sent  please wait for response 🙏");

//     setShowPanditModal(false);
//     setSelectedDate("");
//     setSelectedTime("");

//   } catch (error) {
//     console.log(error);
//     toast.error("Booking Failed ❌");
//   }
// };

//   return (
//     <div className="puja-desktop-container">

//       <img src={mandala} alt="mandala" className="puja-mandala-left" />
//       <img src={mandala} alt="mandala" className="puja-mandala-right" />

//       <div className="puja-desktop-content">

//         <h1>{title}</h1>

//         <p className="puja-desc">{description}</p>

//         {/* Info Cards */}
//         <div className="puja-info-grid">

//           <div className="puja-info-card">
//             <FaInfoCircle size={28} />
//             <span>Information</span>
//             <p style={{ marginTop: "10px", fontSize: "14px" }}>
//               {information}
//             </p>
//           </div>

//           <div className="puja-info-card">
//             <FaBoxOpen size={28} />
//             <span>Pandit Samagri</span>
//             <p style={{ marginTop: "10px", fontSize: "14px", whiteSpace: "pre-line" }}>
//               {panditSamagri}
//             </p>
//           </div>

//           <div className="puja-info-card">
//             <GiHerbsBundle size={28} />
//             <span>Yajman Samagri</span>
//             <p style={{ marginTop: "10px", fontSize: "14px", whiteSpace: "pre-line" }}>
//               {yajmanSamagri}
//             </p>
//           </div>

//         </div>

//         {/* FAQ */}
//         <h2 className="faq-title">FAQ's</h2>

//         {faqs.map((faq, index) => (
//           <div key={index} className="faq-item">

//             <div
//               className="faq-question"
//               onClick={() => setOpenFaq(openFaq === index ? null : index)}
//             >
//               {faq.q}
//               <MdKeyboardArrowDown />
//             </div>

//             {openFaq === index && (
//               <div className="faq-answer">{faq.a}</div>
//             )}

//           </div>
//         ))}

//         <button
//           className="book-btn-desktop"
//           onClick={fetchPandits}
//           disabled={loading}
//         >
//           {loading ? "Loading..." : "Book Pandit Ji"}
//         </button>

//       </div>

//       {/* 🔥 Pandit Modal */}
//       {showPanditModal && (
//         <div
//           className="modal-overlay"
//           onClick={() => setShowPanditModal(false)}
//         >

//           <div
//             className="modal-box"
//             onClick={(e) => e.stopPropagation()}
//             style={{
//               maxHeight: "80vh",
//               overflowY: "auto"
//             }}
//           >

//             <button
//               className="close-btn"
//               onClick={() => setShowPanditModal(false)}
//             >
//               ✖
//             </button>

//             <h3>Select Pandit</h3>

//             {/* Date Time */}
//             <div
//               style={{
//                 background: "#fff5e6",
//                 padding: "20px",
//                 borderRadius: "15px",
//                 marginBottom: "20px"
//               }}
//             >

//               <input
//                 type="date"
//                 value={selectedDate}
//                 min={new Date().toISOString().split("T")[0]}
//                 onChange={(e) => setSelectedDate(e.target.value)}
//                 style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
//               />

//               <input
//                 type="time"
//                 value={selectedTime}
//                 onChange={(e) => setSelectedTime(e.target.value)}
//                 style={{ width: "100%", padding: "10px" }}
//               />

//             </div>

//             {pandits.length === 0 ? (
//               <p>No pandits available for this puja.</p>
//             ) : (

//               pandits.map((p) => {

//                 const pujaPrice = p.specialization?.find(
//                   (sp) => sp.name === title
//                 )?.price;

//                 return (

//                   <div
//                     key={p._id}
//                     style={{
//                       padding: "15px",
//                       border: "1px solid #ccc",
//                       borderRadius: "10px",
//                       marginBottom: "10px",
//                       display: "flex",
//                       gap: "15px"
//                     }}
//                   >

//                     {p.image && (
//                       <img
//                         src={`http://localhost:8000/Images/${p.image}`}
//                         alt="pandit"
//                         style={{
//                           width: "80px",
//                           height: "80px",
//                           borderRadius: "50%",
//                           objectFit: "cover"
//                         }}
//                       />
//                     )}

//                     <div>
//                       <h4>{p.name}</h4>
//                       <p>📍 {p.address}</p>
//                       <p>📞 {p.MobileNo}</p>
//                       <p>🧘 Experience: {p.experience}</p>

//                       <p style={{ color: "#cc7a00", fontWeight: "bold" }}>
//                         💰 Price: ₹{pujaPrice || "Not Set"}
//                       </p>

//                       <button
//                         style={{
//                           marginTop: "10px",
//                           padding: "8px 15px",
//                           backgroundColor: "orange",
//                           border: "none",
//                           borderRadius: "5px",
//                           color: "white",
//                           cursor: "pointer"
//                         }}
//                         onClick={() => handleBooking(p)}
//                       >
//                         Book This Pandit
//                       </button>

//                     </div>

//                   </div>

//                 );

//               })

//             )}

//           </div>

//         </div>
//       )}

//     </div>
//   );
// };

// export default PujaPage;




import React, { useState } from "react";
import axios from "axios";
import "./PujaPages.css";
import { toast } from "react-toastify";
import mandala from "../../Assets/mandalaright-removebg-preview.png";

import { FaBoxOpen, FaInfoCircle } from "react-icons/fa";
import { MdKeyboardArrowDown } from "react-icons/md";
import { GiHerbsBundle } from "react-icons/gi";

const PujaPage = ({
  title,
  description,
  youtubeUrl,
  information,
  panditSamagri,
  yajmanSamagri,
  faqs
}) => {

  const [openContentModal, setOpenContentModal] = useState(null);
  const [openFaq, setOpenFaq] = useState(null);

  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");

  const [showPanditModal, setShowPanditModal] = useState(false);
  const [pandits, setPandits] = useState([]);
  const [loading, setLoading] = useState(false);

  // 🔥 NEW STATES
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedPandit, setSelectedPandit] = useState(null);
  const [bookingType, setBookingType] = useState("");

  const [newDetails, setNewDetails] = useState({
    name: "",
    address: "",
    phone: ""
  });

  // 🔥 Fetch Pandits
  const fetchPandits = async () => {
    try {
      setLoading(true);

      const res = await axios.get(
        `http://localhost:8000/api/pandit/by-specialization/${encodeURIComponent(title)}`
      );

      setPandits(res.data);

    } catch (error) {
      console.log(error);
      setPandits([]);
    }

    setLoading(false);
    setShowPanditModal(true);
  };

  // 🔥 BOOKING LOGIC (UNCHANGED + WORKING)
  const handleBooking = async (pandit, type) => {
    try {

      const storedUser = JSON.parse(localStorage.getItem("user"));

      if (!storedUser) {
        toast.error("Please login first");
        return;
      }

      if (!selectedDate || !selectedTime) {
        toast.error("Please select date and time");
        return;
      }

      const selectedDateTime = new Date(`${selectedDate}T${selectedTime}`);
      const now = new Date();

      if (selectedDateTime <= now) {
        toast.error("Please select future date and time");
        return;
      }

      const pujaPrice = pandit.specialization?.find(
        (sp) => sp.name === title
      )?.price;

      let bookingData = {
        userId: storedUser._id,
        panditId: pandit._id,
        pujaSlug: title,
        price: pujaPrice,
        date: selectedDate,
        time: selectedTime
      };

    


      if (type === "new") {
        if (!newDetails.name || !newDetails.address || !newDetails.phone) {
          toast.error("Please fill all details");
          return;
        }

        bookingData = {
          ...bookingData,
          name: newDetails.name,
          address: newDetails.address,
          phone: newDetails.phone
        };
      } else {
        bookingData = {
          ...bookingData,
          name: storedUser.name,
          address: storedUser.address,
          phone: storedUser.phone
        };
      }

      console.log("TYPE:", type);
      console.log("NEW DETAILS:", newDetails);
      console.log("BOOKING DATA:", bookingData);

      await axios.post("http://localhost:8000/api/booking/create", bookingData);

      toast.success("Booking Sent 🙏");

      setShowBookingModal(false);
      setShowPanditModal(false);
      setBookingType("");
      setSelectedDate("");
      setSelectedTime("");

    } catch (error) {
      console.log(error);
      toast.error("Booking Failed ❌");
    }
    
  };

  return (
    <div className="puja-desktop-container">

      <img src={mandala} alt="mandala" className="puja-mandala-left" />
      <img src={mandala} alt="mandala" className="puja-mandala-right" />

      <div className="puja-desktop-content">

        <h1>{title}</h1>
        <p className="puja-desc">{description}</p>

        <div className="puja-info-grid">

          <div className="puja-info-card">
            <FaInfoCircle size={28} />
            <span>Information</span>
            <p style={{ marginTop: "10px", fontSize: "14px" }}>
              {information}
            </p>
          </div>

          <div className="puja-info-card">
            <FaBoxOpen size={28} />
            <span>Pandit Samagri</span>
            <p style={{ marginTop: "10px", fontSize: "14px", whiteSpace: "pre-line" }}>
              {panditSamagri}
            </p>
          </div>

          <div className="puja-info-card">
            <GiHerbsBundle size={28} />
            <span>Yajman Samagri</span>
            <p style={{ marginTop: "10px", fontSize: "14px", whiteSpace: "pre-line" }}>
              {yajmanSamagri}
            </p>
          </div>

        </div>

        <h2 className="faq-title">FAQ's</h2>

        {faqs.map((faq, index) => (
          <div key={index} className="faq-item">
            <div
              className="faq-question"
              onClick={() => setOpenFaq(openFaq === index ? null : index)}
            >
              {faq.q}
              <MdKeyboardArrowDown />
            </div>

            {openFaq === index && (
              <div className="faq-answer">{faq.a}</div>
            )}
          </div>
        ))}

        <button
          className="book-btn-desktop"
          onClick={fetchPandits}
          disabled={loading}
        >
          {loading ? "Loading..." : "Book Pandit Ji"}
        </button>

      </div>

      {/* 🔥 Pandit Modal */}
      {showPanditModal && (
        <div className="modal-overlay" onClick={() => setShowPanditModal(false)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()} style={{ maxHeight: "80vh", overflowY: "auto" }}>

            <button className="close-btn" onClick={() => setShowPanditModal(false)}>
              ✖
            </button>

            <h3>Select Pandit</h3>

            <div style={{
              background: "#fff5e6",
              padding: "20px",
              borderRadius: "15px",
              marginBottom: "20px"
            }}>

              <input type="date" value={selectedDate} min={new Date().toISOString().split("T")[0]}
                onChange={(e) => setSelectedDate(e.target.value)}
                style={{ width: "100%", padding: "10px", marginBottom: "10px" }} />

              <input type="time" value={selectedTime}
                onChange={(e) => setSelectedTime(e.target.value)}
                style={{ width: "100%", padding: "10px" }} />

            </div>

            {pandits.map((p) => {
              const pujaPrice = p.specialization?.find(
                (sp) => sp.name === title
              )?.price;

              return (
                <div key={p._id} style={{
                  padding: "15px",
                  border: "1px solid #ccc",
                  borderRadius: "10px",
                  marginBottom: "10px",
                  display: "flex",
                  gap: "15px"
                }}>

                  {p.image && (
                    <img src={`http://localhost:8000/Images/${p.image}`} alt=""
                      style={{ width: "80px", height: "80px", borderRadius: "50%" }} />
                  )}

                  <div>
                    <h4>{p.name}</h4>
                    <p>📍 {p.address}</p>
                    <p>📞 {p.MobileNo}</p>
                    <p>🧘 Experience: {p.experience}</p>
                    <p style={{ color: "#cc7a00", fontWeight: "bold" }}>💰 ₹{pujaPrice}</p>

                    <button
                      className="book-btn"
                      onClick={() => {
                        setSelectedPandit(p);
                        setBookingType(""); // reset
                        setShowBookingModal(true);
                      }}
                    >
                      Book This Pandit
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 🔥 BOOKING OPTION MODAL */}
      {showBookingModal && (
        <div className="modal-overlay" onClick={() => setShowBookingModal(false)}>
          <div
            className="modal-box"
            onClick={(e) => e.stopPropagation()}
            style={{ maxHeight: "80vh", overflowY: "auto" }}
          >

            <button
              className="close-btn"
              onClick={() => {
                setShowBookingModal(false);
                setBookingType("");
              }}
            >
              ✖
            </button>

            {bookingType === "" ? (
              <div style={{ textAlign: "center" }}>
                <h3>Select Option</h3>

                <button className="book-btn" style={{ width: "100%", marginBottom: "10px" }}
                  onClick={() => setBookingType("profile")}>
                  Use My Profile Details
                </button>

                <button className="book-btn" style={{ width: "100%" }}
                  onClick={() => setBookingType("new")}>
                  Book For Someone Else
                </button>
              </div>

            ) : bookingType === "new" ? (
              <div>
                <h3>Enter Details</h3>

                <div className="form-group">

                  <input
                    type="text"
                    placeholder="Full Name"
                    value={newDetails.name}
                    onChange={(e) =>
                      setNewDetails((prev) => ({
                        ...prev,
                        name: e.target.value
                      }))
                    }
                  />

                  <input
                    type="text"
                    placeholder="Address"
                    value={newDetails.address}
                    onChange={(e) =>
                      setNewDetails((prev) => ({
                        ...prev,
                        address: e.target.value
                      }))
                    }
                  />

                  <input
                    type="tel"
                    placeholder="Phone Number"
                    maxLength={10}
                    value={newDetails.phone}
                    onChange={(e) => {
                      const value = e.target.value;

                      // ✅ allow only numbers
                      if (/^\d*$/.test(value)) {
                        setNewDetails((prev) => ({
                          ...prev,
                          phone: value
                        }));
                      }
                    }}
                  />

                </div>

                <button className="book-btn" style={{ width: "100%", marginTop: "10px" }}
                  onClick={() => handleBooking(selectedPandit, "new")}>
                  Confirm Booking
                </button>
              </div>

            ) : (
              <div style={{ textAlign: "center" }}>
                <h3>Confirm Booking</h3>

                <button className="book-btn" style={{ width: "100%" }}
                  onClick={() => handleBooking(selectedPandit, "profile")}>
                  Confirm
                </button>
              </div>
            )}

          </div>
        </div>
      )}

    </div>
  );
};

export default PujaPage;