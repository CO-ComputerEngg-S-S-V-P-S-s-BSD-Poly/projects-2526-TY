// import React, { useState } from "react";
// import axios from "axios";
// import "./AddShop.css";

// // ── Validation helpers ───────────────────────────────────────────────────────
// const VALIDATORS = {
//   shopName:    v => v.trim().length >= 2            ? null : "Shop Name must be at least 2 characters.",
//   ownerName:   v => /^[a-zA-Z\s]{2,50}$/.test(v.trim()) ? null : "Owner Name must be 2–50 alphabetic characters.",
//   email:       v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()) ? null : "Please enter a valid email address.",
//   phone:       v => /^[6-9]\d{9}$/.test(v.trim())  ? null : "Phone must be a valid 10-digit Indian number (starts with 6-9).",
//   address:     v => v.trim().length >= 10           ? null : "Address must be at least 10 characters.",
//   workingDays: v => v.length > 0                   ? null : "Please select at least one working day.",
//   openingTime: v => v                              ? null : "Opening time is required.",
//   closingTime: (v, form) => {
//     if (!v) return "Closing time is required.";
//     if (form.openingTime && v <= form.openingTime) return "Closing time must be after opening time.";
//     return null;
//   },
//   profileImage: v => v ? null : "Shop photo is required.",
// };

// const IMAGE_MAX_MB   = 5;
// const ALLOWED_TYPES  = ["image/jpeg", "image/png", "image/webp", "image/jpg"];

// function validateAll(formData, profileFile) {
//   const errors = {};

//   ["shopName", "ownerName", "email", "phone", "address"].forEach(k => {
//     const msg = VALIDATORS[k]?.(formData[k]);
//     if (msg) errors[k] = msg;
//   });

//   const wdMsg = VALIDATORS.workingDays(formData.workingDays);
//   if (wdMsg) errors.workingDays = wdMsg;

//   const otMsg = VALIDATORS.openingTime(formData.openingTime);
//   if (otMsg) errors.openingTime = otMsg;

//   const ctMsg = VALIDATORS.closingTime(formData.closingTime, formData);
//   if (ctMsg) errors.closingTime = ctMsg;

//   const imgMsg = VALIDATORS.profileImage(profileFile);
//   if (imgMsg) errors.profileImage = imgMsg;

//   return errors;
// }
// // ────────────────────────────────────────────────────────────────────────────

// const AddShop = ({ onShopAdded }) => {
//   const [formData, setFormData] = useState({
//     shopName: "",
//     ownerName: "",
//     email: "",
//     phone: "",
//     address: "",
//     workingDays: [],
//     openingTime: "",
//     closingTime: ""
//   });

//   const [profileImagePreview, setProfileImagePreview] = useState(null);
//   const [profileFile, setProfileFile]                 = useState(null);
//   const [loading, setLoading]                         = useState(false);

//   const [fieldErrors, setFieldErrors] = useState({});
//   const [touched, setTouched]         = useState({});
//   const [submitError, setSubmitError] = useState(null);

//   // ── Handlers ─────────────────────────────────────────────────────────────
//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     const updated = { ...formData, [name]: value };
//     setFormData(updated);

//     if (touched[name]) {
//       const msg = name === "closingTime"
//         ? VALIDATORS.closingTime(value, updated)
//         : VALIDATORS[name]?.(value);
//       setFieldErrors(prev => ({ ...prev, [name]: msg || undefined }));
//     }
//   };

//   const handleBlur = (e) => {
//     const { name, value } = e.target;
//     setTouched(prev => ({ ...prev, [name]: true }));
//     const msg = name === "closingTime"
//       ? VALIDATORS.closingTime(value, formData)
//       : VALIDATORS[name]?.(value);
//     setFieldErrors(prev => ({ ...prev, [name]: msg || undefined }));
//   };

//   const handleDaysChange = (day) => {
//     const updated = formData.workingDays.includes(day)
//       ? formData.workingDays.filter(d => d !== day)
//       : [...formData.workingDays, day];

//     setFormData(prev => ({ ...prev, workingDays: updated }));
//     setTouched(prev => ({ ...prev, workingDays: true }));
//     const msg = VALIDATORS.workingDays(updated);
//     setFieldErrors(prev => ({ ...prev, workingDays: msg || undefined }));
//   };

//   const handleImageChange = (e) => {
//     const file = e.target.files[0];
//     if (!file) return;

//     setTouched(prev => ({ ...prev, profileImage: true }));

//     // Type check
//     if (!ALLOWED_TYPES.includes(file.type)) {
//       setFieldErrors(prev => ({ ...prev, profileImage: "Only JPG, PNG, or WEBP images are allowed." }));
//       setProfileFile(null);
//       setProfileImagePreview(null);
//       e.target.value = "";
//       return;
//     }

//     // Size check (max 5 MB)
//     if (file.size > IMAGE_MAX_MB * 1024 * 1024) {
//       setFieldErrors(prev => ({ ...prev, profileImage: `Image must be smaller than ${IMAGE_MAX_MB} MB.` }));
//       setProfileFile(null);
//       setProfileImagePreview(null);
//       e.target.value = "";
//       return;
//     }

//     setProfileFile(file);
//     setProfileImagePreview(URL.createObjectURL(file));
//     setFieldErrors(prev => ({ ...prev, profileImage: undefined }));
//   };

//   // ── Submit ────────────────────────────────────────────────────────────────
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setSubmitError(null);

//     // Mark everything touched
//     const allTouched = Object.fromEntries(
//       ["shopName","ownerName","email","phone","address","workingDays","openingTime","closingTime","profileImage"]
//         .map(k => [k, true])
//     );
//     setTouched(allTouched);

//     const errors = validateAll(formData, profileFile);
//     if (Object.keys(errors).length > 0) {
//       setFieldErrors(errors);
//       setSubmitError("Please fix the highlighted errors before submitting.");
//       return;
//     }

//     const submitData = new FormData();
//     submitData.append("profileImage", profileFile);
//     Object.keys(formData).forEach(key => {
//       if (key !== "workingDays") submitData.append(key, formData[key]);
//     });
//     formData.workingDays.forEach(day => submitData.append("workingDays", day));

//     try {
//       setLoading(true);
//       const response = await axios.post("http://localhost:5000/api/shops", submitData, {
//         headers: { "Content-Type": "multipart/form-data" },
//       });
//       alert("Shop registration submitted for admin approval!");

//       setFormData({ shopName:"", ownerName:"", email:"", phone:"", address:"", workingDays:[], openingTime:"", closingTime:"" });
//       setProfileFile(null);
//       setProfileImagePreview(null);
//       setFieldErrors({});
//       setTouched({});
//       setSubmitError(null);

//       if (onShopAdded) onShopAdded(response.data);

//     } catch (error) {
//       console.error("Submission error:", error.response || error);
//       if (error.code === "ERR_NETWORK") {
//         setSubmitError("Backend se connect nahi ho pa raha. Port 5000 check karo.");
//       } else {
//         setSubmitError(error.response?.data?.message || "Submission failed. Try again.");
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   // ── Helper ────────────────────────────────────────────────────────────────
//   const inp = (name) =>
//     `addshop-input${fieldErrors[name] && touched[name] ? " as-invalid" : ""}`;

//   const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

//   return (
//     <div className="addshop-page">
//       <div className="addshop-card">

//         <div className="top-stripe" />
//         <h1 className="addshop-title">Register Your Shop</h1>
//         <p className="addshop-subtitle">Submit your details — we'll review and approve shortly</p>

//         {submitError && (
//           <div className="as-submit-error">⚠️ {submitError}</div>
//         )}

//         <form onSubmit={handleSubmit} noValidate>

//           {/* ── Profile Picture ── */}
//           <div className="profile-section">
//             <label htmlFor="shopImg" className="avatar-wrap">
//               <div className="avatar-ring">
//                 <div className={`avatar-inner${fieldErrors.profileImage && touched.profileImage ? " avatar-invalid" : ""}`}>
//                   {profileImagePreview ? (
//                     <img src={profileImagePreview} alt="Shop Preview" />
//                   ) : (
//                     <svg className="avatar-default-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
//                       <circle cx="12" cy="8" r="4" fill="#B87333" />
//                       <path d="M4 20c0-4 3.582-7 8-7s8 3 8 7" fill="#B87333" strokeLinecap="round" />
//                     </svg>
//                   )}
//                 </div>
//               </div>
//               <div className="avatar-overlay">
//                 <svg className="camera-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
//                   <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" stroke="#fff" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
//                   <circle cx="12" cy="13" r="4" stroke="#fff" strokeWidth="2" fill="none"/>
//                 </svg>
//               </div>
//             </label>

//             <span className="upload-hint">
//               {profileImagePreview ? "Click to change photo" : "Click to upload shop photo * (JPG/PNG/WEBP, max 5 MB)"}
//             </span>
//             {fieldErrors.profileImage && touched.profileImage && (
//               <span className="as-field-err">⚠ {fieldErrors.profileImage}</span>
//             )}
//             <input id="shopImg" type="file" accept="image/*" onChange={handleImageChange} />
//           </div>

//           {/* ── Text Fields ── */}
//           {[
//             { name: "shopName",  label: "Shop Name",     placeholder: "e.g. Songir Brass House",  type: "text"  },
//             { name: "ownerName", label: "Owner Name",    placeholder: "e.g. Ramesh Patil",        type: "text"  },
//             { name: "email",     label: "Email Address", placeholder: "example@email.com",        type: "email" },
//             { name: "phone",     label: "Phone Number",  placeholder: "10-digit mobile number",   type: "tel"   },
//             { name: "address",   label: "Shop Address",  placeholder: "Street, City, State (min 10 chars)", type: "text" },
//           ].map(({ name, label, placeholder, type }) => (
//             <div key={name} className="input-group">
//               <label className="field-label">{label}</label>
//               <input
//                 className={inp(name)}
//                 type={type}
//                 name={name}
//                 placeholder={placeholder}
//                 value={formData[name]}
//                 onChange={handleChange}
//                 onBlur={handleBlur}
//                 maxLength={name === "phone" ? 10 : undefined}
//                 inputMode={name === "phone" ? "numeric" : undefined}
//               />
//               {fieldErrors[name] && touched[name] && (
//                 <span className="as-field-err">⚠ {fieldErrors[name]}</span>
//               )}
//             </div>
//           ))}

//           <div className="divider" />

//           {/* ── Working Days ── */}
//           <span className="section-label">Working Days *</span>
//           <div className="days-row">
//             {days.map(day => (
//               <button
//                 key={day}
//                 type="button"
//                 onClick={() => handleDaysChange(day)}
//                 className={`day-btn ${formData.workingDays.includes(day) ? "active" : "inactive"}`}
//               >
//                 {day}
//               </button>
//             ))}
//           </div>
//           {fieldErrors.workingDays && touched.workingDays && (
//             <span className="as-field-err" style={{ display:"block", marginTop:6 }}>⚠ {fieldErrors.workingDays}</span>
//           )}

//           <div className="divider" />

//           {/* ── Working Hours ── */}
//           <span className="section-label">Working Hours *</span>
//           <div className="time-row">
//             <div className="input-group" style={{ marginBottom: 0 }}>
//               <label className="field-label">Opening Time</label>
//               <input
//                 className={inp("openingTime")}
//                 type="time"
//                 name="openingTime"
//                 value={formData.openingTime}
//                 onChange={handleChange}
//                 onBlur={handleBlur}
//               />
//               {fieldErrors.openingTime && touched.openingTime && (
//                 <span className="as-field-err">⚠ {fieldErrors.openingTime}</span>
//               )}
//             </div>
//             <div className="input-group" style={{ marginBottom: 0 }}>
//               <label className="field-label">Closing Time</label>
//               <input
//                 className={inp("closingTime")}
//                 type="time"
//                 name="closingTime"
//                 value={formData.closingTime}
//                 onChange={handleChange}
//                 onBlur={handleBlur}
//               />
//               {fieldErrors.closingTime && touched.closingTime && (
//                 <span className="as-field-err">⚠ {fieldErrors.closingTime}</span>
//               )}
//             </div>
//           </div>

//           <button type="submit" disabled={loading} className="submit-btn">
//             {loading ? "Submitting..." : "Submit for Approval"}
//           </button>

//         </form>
//       </div>

//       {/* ── Extra styles injected (no separate CSS file changes needed) ── */}
//       <style>{`
//         .as-field-err   { font-size: 11.5px; color: #c0392b; margin-top: 3px; display: block; }
//         .as-submit-error { background: #fee2e2; color: #991b1b; padding: 10px 14px; border-radius: 9px; font-size: 13px; margin-bottom: 16px; border: 1px solid #fca5a5; }
//         .as-invalid     { border-color: #e74c3c !important; box-shadow: 0 0 0 3px rgba(231,76,60,0.08) !important; }
//         .avatar-invalid { border: 2px solid #e74c3c !important; }
//       `}</style>
//     </div>
//   );
// };

// export default AddShop;



// <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>


import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./AddShop.css";

// ── Validation helpers ───────────────────────────────────────────────────────
const VALIDATORS = {
  // User credentials
  username:    v => v.trim().length >= 3            ? null : "Username must be at least 3 characters.",
  password:    v => v.length >= 6                   ? null : "Password must be at least 6 characters.",
  confirmPassword: (v, form) => v === form.password ? null : "Passwords do not match.",
  
  // Shop details
  shopName:    v => v.trim().length >= 2            ? null : "Shop Name must be at least 2 characters.",
  ownerName:   v => /^[a-zA-Z\s]{2,50}$/.test(v.trim()) ? null : "Owner Name must be 2–50 alphabetic characters.",
  email:       v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()) ? null : "Please enter a valid email address.",
  phone:       v => /^[6-9]\d{9}$/.test(v.trim())  ? null : "Phone must be a valid 10-digit Indian number (starts with 6-9).",
  address:     v => v.trim().length >= 10           ? null : "Address must be at least 10 characters.",
  workingDays: v => v.length > 0                   ? null : "Please select at least one working day.",
  openingTime: v => v                              ? null : "Opening time is required.",
  closingTime: (v, form) => {
    if (!v) return "Closing time is required.";
    if (form.openingTime && v <= form.openingTime) return "Closing time must be after opening time.";
    return null;
  },
  profileImage: v => v ? null : "Shop photo is required.",
};

const IMAGE_MAX_MB   = 5;
const ALLOWED_TYPES  = ["image/jpeg", "image/png", "image/webp", "image/jpg"];

function validateAll(formData, profileFile) {
  const errors = {};

  // Validate user credentials
  ["username", "password", "confirmPassword"].forEach(k => {
    const msg = k === "confirmPassword" 
      ? VALIDATORS[k]?.(formData[k], formData)
      : VALIDATORS[k]?.(formData[k]);
    if (msg) errors[k] = msg;
  });

  // Validate shop details
  ["shopName", "ownerName", "email", "phone", "address"].forEach(k => {
    const msg = VALIDATORS[k]?.(formData[k]);
    if (msg) errors[k] = msg;
  });

  const wdMsg = VALIDATORS.workingDays(formData.workingDays);
  if (wdMsg) errors.workingDays = wdMsg;

  const otMsg = VALIDATORS.openingTime(formData.openingTime);
  if (otMsg) errors.openingTime = otMsg;

  const ctMsg = VALIDATORS.closingTime(formData.closingTime, formData);
  if (ctMsg) errors.closingTime = ctMsg;

  const imgMsg = VALIDATORS.profileImage(profileFile);
  if (imgMsg) errors.profileImage = imgMsg;

  return errors;
}
// ────────────────────────────────────────────────────────────────────────────

const AddShop = ({ onShopAdded }) => {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    // User credentials
    username: "",
    password: "",
    confirmPassword: "",
    
    // Shop details
    shopName: "",
    ownerName: "",
    email: "",
    phone: "",
    address: "",
    workingDays: [],
    openingTime: "",
    closingTime: ""
  });

  const [profileImagePreview, setProfileImagePreview] = useState(null);
  const [profileFile, setProfileFile]                 = useState(null);
  const [loading, setLoading]                         = useState(false);

  const [fieldErrors, setFieldErrors] = useState({});
  const [touched, setTouched]         = useState({});
  const [submitError, setSubmitError] = useState(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // ── Handlers ─────────────────────────────────────────────────────────────
  const handleChange = (e) => {
    const { name, value } = e.target;
    const updated = { ...formData, [name]: value };
    setFormData(updated);

    if (touched[name]) {
      let msg;
      if (name === "closingTime") {
        msg = VALIDATORS.closingTime(value, updated);
      } else if (name === "confirmPassword") {
        msg = VALIDATORS.confirmPassword(value, updated);
      } else {
        msg = VALIDATORS[name]?.(value);
      }
      setFieldErrors(prev => ({ ...prev, [name]: msg || undefined }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    let msg;
    if (name === "closingTime") {
      msg = VALIDATORS.closingTime(value, formData);
    } else if (name === "confirmPassword") {
      msg = VALIDATORS.confirmPassword(value, formData);
    } else {
      msg = VALIDATORS[name]?.(value);
    }
    setFieldErrors(prev => ({ ...prev, [name]: msg || undefined }));
  };

  const handleDaysChange = (day) => {
    const updated = formData.workingDays.includes(day)
      ? formData.workingDays.filter(d => d !== day)
      : [...formData.workingDays, day];

    setFormData(prev => ({ ...prev, workingDays: updated }));
    setTouched(prev => ({ ...prev, workingDays: true }));
    const msg = VALIDATORS.workingDays(updated);
    setFieldErrors(prev => ({ ...prev, workingDays: msg || undefined }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setTouched(prev => ({ ...prev, profileImage: true }));

    // Type check
    if (!ALLOWED_TYPES.includes(file.type)) {
      setFieldErrors(prev => ({ ...prev, profileImage: "Only JPG, PNG, or WEBP images are allowed." }));
      setProfileFile(null);
      setProfileImagePreview(null);
      e.target.value = "";
      return;
    }

    // Size check (max 5 MB)
    if (file.size > IMAGE_MAX_MB * 1024 * 1024) {
      setFieldErrors(prev => ({ ...prev, profileImage: `Image must be smaller than ${IMAGE_MAX_MB} MB.` }));
      setProfileFile(null);
      setProfileImagePreview(null);
      e.target.value = "";
      return;
    }

    setProfileFile(file);
    setProfileImagePreview(URL.createObjectURL(file));
    setFieldErrors(prev => ({ ...prev, profileImage: undefined }));
  };

  // ── Submit ────────────────────────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError(null);
    setSubmitSuccess(false);

    // Mark everything touched
    const allTouched = Object.fromEntries(
      ["username","password","confirmPassword","shopName","ownerName","email","phone","address","workingDays","openingTime","closingTime","profileImage"]
        .map(k => [k, true])
    );
    setTouched(allTouched);

    const errors = validateAll(formData, profileFile);
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      setSubmitError("Please fix the highlighted errors before submitting.");
      return;
    }

    const submitData = new FormData();
    
    // Add user credentials
    submitData.append("username", formData.username.trim());
    submitData.append("password", formData.password);
    submitData.append("role", "shopkeeper"); // Set role as shopkeeper
    
    // Add shop details
    submitData.append("profileImage", profileFile);
    submitData.append("shopName", formData.shopName.trim());
    submitData.append("ownerName", formData.ownerName.trim());
    submitData.append("email", formData.email.trim());
    submitData.append("phone", formData.phone.trim());
    submitData.append("address", formData.address.trim());
    submitData.append("openingTime", formData.openingTime);
    submitData.append("closingTime", formData.closingTime);
    
    // Add working days
    formData.workingDays.forEach(day => submitData.append("workingDays", day));

    try {
      setLoading(true);
      
      // Register shopkeeper + shop in one call
      const response = await axios.post("http://localhost:5000/api/shopkeeper/register", submitData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setSubmitSuccess(true);
      
      // Show success message
      setTimeout(() => {
        alert(`✅ Registration Successful!\n\nYour shop "${formData.shopName}" has been submitted for admin approval.\n\nYou'll receive an email at ${formData.email} once approved.\n\nAfter approval, login with:\nUsername: ${formData.username}\n\nRedirecting to login page...`);
        navigate("/LoginPage");
      }, 500);

      if (onShopAdded) onShopAdded(response.data);

    } catch (error) {
      console.error("Submission error:", error.response || error);
      
      if (error.code === "ERR_NETWORK") {
        setSubmitError("❌ Backend server not running! Please start the backend on port 5000.");
      } else if (error.response?.status === 409) {
        setSubmitError("❌ Username or email already exists. Please use different credentials.");
      } else {
        setSubmitError(error.response?.data?.message || "Submission failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  // ── Helper ────────────────────────────────────────────────────────────────
  const inp = (name) =>
    `addshop-input${fieldErrors[name] && touched[name] ? " as-invalid" : ""}`;

  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  return (
    <div className="addshop-page">
      <div className="addshop-card">

        <div className="top-stripe" />
        <h1 className="addshop-title">🏪 Shopkeeper Registration</h1>
        <p className="addshop-subtitle">Create your account & register your shop for approval</p>

        {submitError && (
          <div className="as-submit-error">⚠️ {submitError}</div>
        )}

        {submitSuccess && (
          <div className="as-submit-success">✅ Registration successful! Redirecting to login...</div>
        )}

        <form onSubmit={handleSubmit} noValidate>

          {/* ── STEP 1: Account Credentials ── */}
          <div className="section-header">
            <span className="step-badge">STEP 1</span>
            <span className="section-label">Create Your Account</span>
          </div>

          {[
            { name: "username", label: "Username", placeholder: "Choose a unique username", type: "text" },
            { name: "password", label: "Password", placeholder: "Minimum 6 characters", type: "password" },
            { name: "confirmPassword", label: "Confirm Password", placeholder: "Re-enter your password", type: "password" },
          ].map(({ name, label, placeholder, type }) => (
            <div key={name} className="input-group">
              <label className="field-label">{label} *</label>
              <input
                className={inp(name)}
                type={type}
                name={name}
                placeholder={placeholder}
                value={formData[name]}
                onChange={handleChange}
                onBlur={handleBlur}
                autoComplete={type === "password" ? "new-password" : "off"}
              />
              {fieldErrors[name] && touched[name] && (
                <span className="as-field-err">⚠ {fieldErrors[name]}</span>
              )}
            </div>
          ))}

          <div className="divider" />

          {/* ── STEP 2: Shop Details ── */}
          <div className="section-header">
            <span className="step-badge">STEP 2</span>
            <span className="section-label">Shop Information</span>
          </div>

          {/* ── Profile Picture ── */}
          <div className="profile-section">
            <label htmlFor="shopImg" className="avatar-wrap">
              <div className="avatar-ring">
                <div className={`avatar-inner${fieldErrors.profileImage && touched.profileImage ? " avatar-invalid" : ""}`}>
                  {profileImagePreview ? (
                    <img src={profileImagePreview} alt="Shop Preview" />
                  ) : (
                    <svg className="avatar-default-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <circle cx="12" cy="8" r="4" fill="#B87333" />
                      <path d="M4 20c0-4 3.582-7 8-7s8 3 8 7" fill="#B87333" strokeLinecap="round" />
                    </svg>
                  )}
                </div>
              </div>
              <div className="avatar-overlay">
                <svg className="camera-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" stroke="#fff" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
                  <circle cx="12" cy="13" r="4" stroke="#fff" strokeWidth="2" fill="none"/>
                </svg>
              </div>
            </label>

            <span className="upload-hint">
              {profileImagePreview ? "Click to change photo" : "Click to upload shop photo * (JPG/PNG/WEBP, max 5 MB)"}
            </span>
            {fieldErrors.profileImage && touched.profileImage && (
              <span className="as-field-err">⚠ {fieldErrors.profileImage}</span>
            )}
            <input id="shopImg" type="file" accept="image/*" onChange={handleImageChange} />
          </div>

          {/* ── Text Fields ── */}
          {[
            { name: "shopName",  label: "Shop Name",     placeholder: "e.g. Songir Brass House",  type: "text"  },
            { name: "ownerName", label: "Owner Name",    placeholder: "e.g. Ramesh Patil",        type: "text"  },
            { name: "email",     label: "Email Address", placeholder: "example@email.com",        type: "email" },
            { name: "phone",     label: "Phone Number",  placeholder: "10-digit mobile number",   type: "tel"   },
            { name: "address",   label: "Shop Address",  placeholder: "Street, City, State (min 10 chars)", type: "text" },
          ].map(({ name, label, placeholder, type }) => (
            <div key={name} className="input-group">
              <label className="field-label">{label} *</label>
              <input
                className={inp(name)}
                type={type}
                name={name}
                placeholder={placeholder}
                value={formData[name]}
                onChange={handleChange}
                onBlur={handleBlur}
                maxLength={name === "phone" ? 10 : undefined}
                inputMode={name === "phone" ? "numeric" : undefined}
              />
              {fieldErrors[name] && touched[name] && (
                <span className="as-field-err">⚠ {fieldErrors[name]}</span>
              )}
            </div>
          ))}

          <div className="divider" />

          {/* ── Working Days ── */}
          <span className="section-label">Working Days *</span>
          <div className="days-row">
            {days.map(day => (
              <button
                key={day}
                type="button"
                onClick={() => handleDaysChange(day)}
                className={`day-btn ${formData.workingDays.includes(day) ? "active" : "inactive"}`}
              >
                {day}
              </button>
            ))}
          </div>
          {fieldErrors.workingDays && touched.workingDays && (
            <span className="as-field-err" style={{ display:"block", marginTop:6 }}>⚠ {fieldErrors.workingDays}</span>
          )}

          <div className="divider" />

          {/* ── Working Hours ── */}
          <span className="section-label">Working Hours *</span>
          <div className="time-row">
            <div className="input-group" style={{ marginBottom: 0 }}>
              <label className="field-label">Opening Time</label>
              <input
                className={inp("openingTime")}
                type="time"
                name="openingTime"
                value={formData.openingTime}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              {fieldErrors.openingTime && touched.openingTime && (
                <span className="as-field-err">⚠ {fieldErrors.openingTime}</span>
              )}
            </div>
            <div className="input-group" style={{ marginBottom: 0 }}>
              <label className="field-label">Closing Time</label>
              <input
                className={inp("closingTime")}
                type="time"
                name="closingTime"
                value={formData.closingTime}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              {fieldErrors.closingTime && touched.closingTime && (
                <span className="as-field-err">⚠ {fieldErrors.closingTime}</span>
              )}
            </div>
          </div>

          <button type="submit" disabled={loading} className="submit-btn">
            {loading ? "Creating Account..." : "🚀 Register Shopkeeper + Shop"}
          </button>

          <p className="login-link">
            Already have an account? <a href="/LoginPage">Login here</a>
          </p>

        </form>
      </div>

      {/* ── Extra styles injected ── */}
      <style>{`
        .as-field-err   { font-size: 11.5px; color: #c0392b; margin-top: 3px; display: block; }
        .as-submit-error { background: #fee2e2; color: #991b1b; padding: 10px 14px; border-radius: 9px; font-size: 13px; margin-bottom: 16px; border: 1px solid #fca5a5; }
        .as-submit-success { background: #d1fae5; color: #065f46; padding: 10px 14px; border-radius: 9px; font-size: 13px; margin-bottom: 16px; border: 1px solid #6ee7b7; }
        .as-invalid     { border-color: #e74c3c !important; box-shadow: 0 0 0 3px rgba(231,76,60,0.08) !important; }
        .avatar-invalid { border: 2px solid #e74c3c !important; }
        
        .section-header {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 16px;
          margin-top: 8px;
        }
        
        .step-badge {
          background: linear-gradient(135deg, #B87333, #C9A44C);
          color: white;
          padding: 4px 10px;
          border-radius: 12px;
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.5px;
        }
        
        .login-link {
          text-align: center;
          margin-top: 20px;
          font-size: 13px;
          color: #8D6E63;
        }
        
        .login-link a {
          color: #B87333;
          font-weight: 700;
          text-decoration: none;
          border-bottom: 1px solid transparent;
          transition: border-color 0.2s;
        }
        
        .login-link a:hover {
          border-bottom-color: #B87333;
        }
      `}</style>
    </div>
  );
};

export default AddShop;