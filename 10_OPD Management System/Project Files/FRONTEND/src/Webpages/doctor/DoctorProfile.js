// import React, { useState, useRef, useEffect } from "react";

// function DoctorProfile() {
//     // Default doctor info
//     const defaultDoctorInfo = {
//         name: "Dr. Pranjal Patil",
//         specialization: "Cardiology",
//         department: "Cardiology",
//         doctorPhone: "9876543210",
//         doctorEmail: "pranjal.patil@hospital.com",
//         doctorAddress: "123 Medical Center, Nashik, Maharashtra",
//         experience: "8 years",
//         licenseNumber: "MH123456789",
//         qualifications: "MBBS, MD Cardiology",
//         joinDate: "2016-03-15",
//         profilePhoto: null,
//     };

//     // Load doctor info from shared localStorage key 'clinicProfile'
//     const [doctorInfo, setDoctorInfo] = useState(defaultDoctorInfo);
//     const [isEditing, setIsEditing] = useState(false);
//     const [formData, setFormData] = useState(defaultDoctorInfo);
//     const [photoPreview, setPhotoPreview] = useState(null);
//     const [loading, setLoading] = useState(true);
//     const fileInputRef = useRef(null);

//     // Load data on mount
//     useEffect(() => {
//         loadDoctorData();
        
//         // Listen for storage changes from other components
//         const handleStorageChange = () => {
//             loadDoctorData();
//         };

//         window.addEventListener('storage', handleStorageChange);
        
//         return () => {
//             window.removeEventListener('storage', handleStorageChange);
//         };
//     }, []);

//     // Load doctor data from localStorage
//     const loadDoctorData = () => {
//         try {
//             const savedData = localStorage.getItem('clinicProfile');
//             if (savedData) {
//                 const parsed = JSON.parse(savedData);
//                 if (parsed && parsed.doctorInfo) {
//                     setDoctorInfo(parsed.doctorInfo);
//                     setFormData(parsed.doctorInfo);
//                     setPhotoPreview(parsed.doctorInfo.profilePhoto);
//                 } else {
//                     // If no doctorInfo, create default structure
//                     const defaultProfile = {
//                         ...parsed,
//                         doctorInfo: defaultDoctorInfo
//                     };
//                     localStorage.setItem('clinicProfile', JSON.stringify(defaultProfile));
//                     setDoctorInfo(defaultDoctorInfo);
//                     setFormData(defaultDoctorInfo);
//                 }
//             } else {
//                 // No data at all, create default
//                 const defaultProfile = {
//                     clinicName: 'MedCare Clinic',
//                     address: '123 Healthcare Street, Medical District',
//                     city: 'Mumbai',
//                     state: 'Maharashtra',
//                     pincode: '400001',
//                     phone: '+91 22 1234 5678',
//                     email: 'info@medcare.com',
//                     website: 'www.medcare.com',
//                     registrationNo: 'MHC/1234/2020',
//                     established: '2010',
//                     licenseNo: 'MH/CLINIC/2020/1234',
//                     doctorInfo: defaultDoctorInfo
//                 };
//                 localStorage.setItem('clinicProfile', JSON.stringify(defaultProfile));
//                 setDoctorInfo(defaultDoctorInfo);
//                 setFormData(defaultDoctorInfo);
//             }
//         } catch (error) {
//             console.error('Error loading doctor data:', error);
//             setDoctorInfo(defaultDoctorInfo);
//             setFormData(defaultDoctorInfo);
//         } finally {
//             setLoading(false);
//         }
//     };

//     // Update main profile in localStorage
//     const updateMainProfile = (newDoctorInfo) => {
//         try {
//             const savedData = localStorage.getItem('clinicProfile');
//             let mainProfile = savedData ? JSON.parse(savedData) : {};
            
//             // Update doctorInfo in main profile
//             mainProfile.doctorInfo = newDoctorInfo;
            
//             // Save back to localStorage
//             localStorage.setItem('clinicProfile', JSON.stringify(mainProfile));
            
//             // Trigger storage event for other components
//             window.dispatchEvent(new Event('storage'));
            
//             console.log('✅ Doctor profile updated in shared storage');
//         } catch (error) {
//             console.error('Error updating main profile:', error);
//             alert('Failed to save profile. Please try again.');
//         }
//     };

//     // Handle form field changes
//     const handleChange = (e) => {
//         setFormData({
//             ...formData,
//             [e.target.name]: e.target.value,
//         });
//     };

//     // Handle photo upload
//     const handlePhotoChange = (e) => {
//         const file = e.target.files[0];
//         if (file) {
//             if (!file.type.startsWith("image/")) {
//                 alert("❌ Please select an image file (JPG, PNG, etc.)");
//                 return;
//             }
//             if (file.size > 5 * 1024 * 1024) {
//                 alert("❌ Image size must be less than 5MB");
//                 return;
//             }
//             const reader = new FileReader();
//             reader.onloadend = () => {
//                 setPhotoPreview(reader.result);
//                 setFormData(prev => ({ ...prev, profilePhoto: reader.result }));
//             };
//             reader.readAsDataURL(file);
//         }
//     };

//     // Remove photo
//     const handleRemovePhoto = () => {
//         setPhotoPreview(null);
//         setFormData(prev => ({ ...prev, profilePhoto: null }));
//         if (fileInputRef.current) {
//             fileInputRef.current.value = "";
//         }
//     };

//     // Submit form
//     const handleSubmit = (e) => {
//         e.preventDefault();
//         setDoctorInfo(formData);
//         updateMainProfile(formData);
//         setIsEditing(false);
//         alert("✅ Profile updated successfully!");
//     };

//     // Cancel editing
//     const handleCancel = () => {
//         setFormData({ ...doctorInfo });
//         setPhotoPreview(doctorInfo.profilePhoto);
//         setIsEditing(false);
//     };

//     // Start editing
//     const handleEditClick = () => {
//         setFormData({ ...doctorInfo });
//         setPhotoPreview(doctorInfo.profilePhoto);
//         setIsEditing(true);
//     };

//     // Show loading state
//     if (loading) {
//         return <div className="loading">Loading doctor profile...</div>;
//     }

//     const currentPhoto = doctorInfo.profilePhoto;

//     return (
//         <div className="appointments-page">
//             {/* Header */}
//             <div className="page-header">
//                 <div>
//                     <h1>👨‍⚕️ My Profile</h1>
//                 </div>
//                 {!isEditing && (
//                     <button className="add-btn" onClick={handleEditClick}>
//                         ✏️ Edit Profile
//                     </button>
//                 )}
//             </div>

//             {/* Profile View Mode */}
//             {!isEditing ? (
//                 <>
//                     {/* Profile Header Banner */}
//                     <div className="dashboard-header" style={{ marginBottom: "30px" }}>
//                         <div style={{ display: "flex", alignItems: "center", gap: "24px" }}>
//                             {/* Profile Photo or Initials */}
//                             {currentPhoto ? (
//                                 <img
//                                     src={currentPhoto}
//                                     alt="Profile"
//                                     style={{
//                                         width: "80px", height: "80px", borderRadius: "50%",
//                                         objectFit: "cover",
//                                         border: "3px solid rgba(255,255,255,0.4)",
//                                         boxShadow: "0 4px 12px rgba(0,0,0,0.2)"
//                                     }}
//                                 />
//                             ) : (
//                                 <div style={{
//                                     width: "80px", height: "80px", borderRadius: "50%",
//                                     background: "rgba(255,255,255,0.2)", display: "flex",
//                                     alignItems: "center", justifyContent: "center",
//                                     fontSize: "32px", fontWeight: "700", color: "white",
//                                     border: "3px solid rgba(255,255,255,0.3)"
//                                 }}>
//                                     {doctorInfo.name ? doctorInfo.name.charAt(0) : 'D'}
//                                 </div>
//                             )}
//                             <div>
//                                 <h1 style={{ color: "white", fontSize: "24px", margin: "0 0 4px" }}>{doctorInfo.name || 'Doctor Name'}</h1>
//                                 <p style={{ color: "rgba(255,255,255,0.9)", margin: "0 0 4px", fontSize: "16px", fontWeight: "600" }}>
//                                     {doctorInfo.specialization || 'Specialization'}
//                                 </p>
//                                 <p style={{ color: "rgba(255,255,255,0.7)", margin: "0", fontSize: "14px" }}>
//                                     {doctorInfo.department || 'Department'}
//                                 </p>
//                             </div>
//                         </div>
//                     </div>

//                     {/* Personal Information */}
//                     <div className="table-container" style={{ marginBottom: "24px" }}>
//                         <div className="table-header">
//                             <h3>📋 Personal Information</h3>
//                         </div>
//                         <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "20px", padding: "10px 0" }}>
//                             <div style={{ padding: "12px 16px", background: "#f8fafc", borderRadius: "4px" }}>
//                                 <p style={{ fontSize: "12px", fontWeight: "700", color: "#64748b", textTransform: "uppercase", margin: "0 0 4px" }}>Full Name</p>
//                                 <p style={{ fontSize: "16px", color: "#1e293b", fontWeight: "500", margin: "0" }}>{doctorInfo.name || 'N/A'}</p>
//                             </div>
//                             <div style={{ padding: "12px 16px", background: "#f8fafc", borderRadius: "4px" }}>
//                                 <p style={{ fontSize: "12px", fontWeight: "700", color: "#64748b", textTransform: "uppercase", margin: "0 0 4px" }}>Phone</p>
//                                 <p style={{ fontSize: "16px", color: "#1e293b", fontWeight: "500", margin: "0" }}>{doctorInfo.doctorPhone || 'N/A'}</p>
//                             </div>
//                             <div style={{ padding: "12px 16px", background: "#f8fafc", borderRadius: "4px" }}>
//                                 <p style={{ fontSize: "12px", fontWeight: "700", color: "#64748b", textTransform: "uppercase", margin: "0 0 4px" }}>Email</p>
//                                 <p style={{ fontSize: "16px", color: "#1e293b", fontWeight: "500", margin: "0" }}>{doctorInfo.doctorEmail || 'N/A'}</p>
//                             </div>
//                             <div style={{ padding: "12px 16px", background: "#f8fafc", borderRadius: "4px" }}>
//                                 <p style={{ fontSize: "12px", fontWeight: "700", color: "#64748b", textTransform: "uppercase", margin: "0 0 4px" }}>Address</p>
//                                 <p style={{ fontSize: "16px", color: "#1e293b", fontWeight: "500", margin: "0" }}>{doctorInfo.doctorAddress || 'N/A'}</p>
//                             </div>
//                         </div>
//                     </div>

//                     {/* Professional Information */}
//                     <div className="table-container">
//                         <div className="table-header">
//                             <h3>🏥 Professional Information</h3>
//                         </div>
//                         <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "20px", padding: "10px 0" }}>
//                             <div style={{ padding: "12px 16px", background: "#f8fafc", borderRadius: "4px" }}>
//                                 <p style={{ fontSize: "12px", fontWeight: "700", color: "#64748b", textTransform: "uppercase", margin: "0 0 4px" }}>Specialization</p>
//                                 <p style={{ fontSize: "16px", color: "#1e293b", fontWeight: "500", margin: "0" }}>{doctorInfo.specialization || 'N/A'}</p>
//                             </div>
//                             <div style={{ padding: "12px 16px", background: "#f8fafc", borderRadius: "4px" }}>
//                                 <p style={{ fontSize: "12px", fontWeight: "700", color: "#64748b", textTransform: "uppercase", margin: "0 0 4px" }}>Department</p>
//                                 <p style={{ fontSize: "16px", color: "#1e293b", fontWeight: "500", margin: "0" }}>{doctorInfo.department || 'N/A'}</p>
//                             </div>
//                             <div style={{ padding: "12px 16px", background: "#f8fafc", borderRadius: "4px" }}>
//                                 <p style={{ fontSize: "12px", fontWeight: "700", color: "#64748b", textTransform: "uppercase", margin: "0 0 4px" }}>Experience</p>
//                                 <p style={{ fontSize: "16px", color: "#1e293b", fontWeight: "500", margin: "0" }}>{doctorInfo.experience || 'N/A'}</p>
//                             </div>
//                             <div style={{ padding: "12px 16px", background: "#f8fafc", borderRadius: "4px" }}>
//                                 <p style={{ fontSize: "12px", fontWeight: "700", color: "#64748b", textTransform: "uppercase", margin: "0 0 4px" }}>Join Date</p>
//                                 <p style={{ fontSize: "16px", color: "#1e293b", fontWeight: "500", margin: "0" }}>{doctorInfo.joinDate ? new Date(doctorInfo.joinDate).toLocaleDateString() : 'N/A'}</p>
//                             </div>
//                             <div style={{ padding: "12px 16px", background: "#f8fafc", borderRadius: "4px" }}>
//                                 <p style={{ fontSize: "12px", fontWeight: "700", color: "#64748b", textTransform: "uppercase", margin: "0 0 4px" }}>License Number</p>
//                                 <p style={{ fontSize: "16px", color: "#1e293b", fontWeight: "500", margin: "0" }}>{doctorInfo.licenseNumber || 'N/A'}</p>
//                             </div>
//                             <div style={{ padding: "12px 16px", background: "#f8fafc", borderRadius: "4px" }}>
//                                 <p style={{ fontSize: "12px", fontWeight: "700", color: "#64748b", textTransform: "uppercase", margin: "0 0 4px" }}>Qualifications</p>
//                                 <p style={{ fontSize: "16px", color: "#1e293b", fontWeight: "500", margin: "0" }}>{doctorInfo.qualifications || 'N/A'}</p>
//                             </div>
//                         </div>
//                     </div>
//                 </>
//             ) : (
//                 /* Edit Mode */
//                 <div className="popup-card wide-popup" style={{ maxWidth: "100%", boxShadow: "0 4px 12px rgba(0,0,0,0.05)", border: "1px solid #e2e8f0" }}>
//                     <h2>✏️ Edit Profile</h2>
//                     <form onSubmit={handleSubmit}>

//                         {/* Profile Photo Section */}
//                         <h3 style={{ margin: "0 0 16px", fontSize: "16px", color: "#475569", borderBottom: "2px solid #e2e8f0", paddingBottom: "8px" }}>📷 Profile Photo</h3>
//                         <div style={{
//                             display: "flex", alignItems: "center", gap: "24px",
//                             marginBottom: "24px", padding: "20px",
//                             background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "4px"
//                         }}>
//                             {/* Photo Preview */}
//                             <div style={{ position: "relative" }}>
//                                 {photoPreview ? (
//                                     <img
//                                         src={photoPreview}
//                                         alt="Profile Preview"
//                                         style={{
//                                             width: "100px", height: "100px", borderRadius: "50%",
//                                             objectFit: "cover",
//                                             border: "3px solid #1976d2",
//                                             boxShadow: "0 4px 12px rgba(25,118,210,0.2)"
//                                         }}
//                                     />
//                                 ) : (
//                                     <div style={{
//                                         width: "100px", height: "100px", borderRadius: "50%",
//                                         background: "linear-gradient(135deg, #1976d2, #42a5f5)",
//                                         display: "flex", alignItems: "center", justifyContent: "center",
//                                         fontSize: "36px", fontWeight: "700", color: "white",
//                                         border: "3px solid #e2e8f0",
//                                         boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
//                                     }}>
//                                         {formData.name ? formData.name.charAt(0) : 'D'}
//                                     </div>
//                                 )}
//                             </div>

//                             {/* Upload Controls */}
//                             <div style={{ flex: 1 }}>
//                                 <p style={{ margin: "0 0 8px", fontSize: "14px", fontWeight: "600", color: "#1e293b" }}>
//                                     Upload Profile Photo
//                                 </p>
//                                 <p style={{ margin: "0 0 12px", fontSize: "12px", color: "#64748b" }}>
//                                     JPG, PNG or GIF. Max 5MB. Recommended: 200×200px
//                                 </p>
//                                 <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
//                                     <input
//                                         type="file"
//                                         ref={fileInputRef}
//                                         onChange={handlePhotoChange}
//                                         accept="image/*"
//                                         style={{ display: "none" }}
//                                     />
//                                     <button
//                                         type="button"
//                                         onClick={() => fileInputRef.current.click()}
//                                         style={{
//                                             padding: "8px 20px",
//                                             background: "linear-gradient(135deg, #1976d2, #42a5f5)",
//                                             color: "white", border: "none", borderRadius: "4px",
//                                             fontSize: "13px", fontWeight: "600", cursor: "pointer"
//                                         }}
//                                     >
//                                         📁 Choose Photo
//                                     </button>
//                                     {photoPreview && (
//                                         <button
//                                             type="button"
//                                             onClick={handleRemovePhoto}
//                                             style={{
//                                                 padding: "8px 20px",
//                                                 background: "#fee2e2", color: "#c62828",
//                                                 border: "1px solid #fecaca", borderRadius: "4px",
//                                                 fontSize: "13px", fontWeight: "600", cursor: "pointer"
//                                             }}
//                                         >
//                                             🗑️ Remove
//                                         </button>
//                                     )}
//                                 </div>
//                             </div>
//                         </div>

//                         {/* Personal Information */}
//                         <h3 style={{ margin: "0 0 16px", fontSize: "16px", color: "#475569", borderBottom: "2px solid #e2e8f0", paddingBottom: "8px" }}>Personal Information</h3>
//                         <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "24px" }}>
//                             <div className="popup-form-group">
//                                 <label>Full Name</label>
//                                 <input type="text" name="name" value={formData.name || ''} onChange={handleChange} required />
//                             </div>
//                             <div className="popup-form-group">
//                                 <label>Phone</label>
//                                 <input type="text" name="doctorPhone" value={formData.doctorPhone || ''} onChange={handleChange} required />
//                             </div>
//                             <div className="popup-form-group">
//                                 <label>Email</label>
//                                 <input type="email" name="doctorEmail" value={formData.doctorEmail || ''} onChange={handleChange} required />
//                             </div>
//                             <div className="popup-form-group">
//                                 <label>Address</label>
//                                 <input type="text" name="doctorAddress" value={formData.doctorAddress || ''} onChange={handleChange} required />
//                             </div>
//                         </div>

//                         {/* Professional Information */}
//                         <h3 style={{ margin: "0 0 16px", fontSize: "16px", color: "#475569", borderBottom: "2px solid #e2e8f0", paddingBottom: "8px" }}>Professional Information</h3>
//                         <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "24px" }}>
//                             <div className="popup-form-group">
//                                 <label>Specialization</label>
//                                 <input type="text" name="specialization" value={formData.specialization || ''} onChange={handleChange} required />
//                             </div>
//                             <div className="popup-form-group">
//                                 <label>Department</label>
//                                 <input type="text" name="department" value={formData.department || ''} onChange={handleChange} required />
//                             </div>
//                             <div className="popup-form-group">
//                                 <label>Experience</label>
//                                 <input type="text" name="experience" value={formData.experience || ''} onChange={handleChange} required />
//                             </div>
//                             <div className="popup-form-group">
//                                 <label>License Number</label>
//                                 <input type="text" name="licenseNumber" value={formData.licenseNumber || ''} onChange={handleChange} required />
//                             </div>
//                             <div className="popup-form-group">
//                                 <label>Qualifications</label>
//                                 <input type="text" name="qualifications" value={formData.qualifications || ''} onChange={handleChange} required />
//                             </div>
//                             <div className="popup-form-group">
//                                 <label>Join Date</label>
//                                 <input type="date" name="joinDate" value={formData.joinDate || ''} onChange={handleChange} required />
//                             </div>
//                         </div>

//                         <div className="popup-actions">
//                             <button type="button" className="cancel" onClick={handleCancel}>Cancel</button>
//                             <button type="submit" className="confirm">✅ Save Changes</button>
//                         </div>
//                     </form>
//                 </div>
//             )}
//         </div>
//     );
// }

// export default DoctorProfile;

import React, { useState, useRef, useEffect } from "react";

// ✅ FIX: Same custom event name as Settings.js
const PROFILE_UPDATED_EVENT = 'clinicProfileUpdated';

function DoctorProfile() {
    // Default doctor info
    const defaultDoctorInfo = {
        name: "Dr. Pranjal Patil",
        specialization: "Cardiology",
        department: "Cardiology",
        doctorPhone: "9876543210",
        doctorEmail: "pranjal.patil@hospital.com",
        doctorAddress: "123 Medical Center, Nashik, Maharashtra",
        experience: "13 years",
        licenseNumber: "MH123456789",
        qualifications: "MBBS, MD Cardiology",
        joinDate: "2013-03-15",
        profilePhoto: null,
    };

    // Load doctor info from shared localStorage key 'clinicProfile'
    const [doctorInfo, setDoctorInfo] = useState(defaultDoctorInfo);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState(defaultDoctorInfo);
    const [photoPreview, setPhotoPreview] = useState(null);
    const [loading, setLoading] = useState(true);
    const fileInputRef = useRef(null);

    // Load data on mount
    useEffect(() => {
        loadDoctorData();
        
        // ✅ FIX: Listen for CustomEvent instead of 'storage' event (works in same window)
        const handleProfileUpdate = () => {
            loadDoctorData();
        };

        window.addEventListener(PROFILE_UPDATED_EVENT, handleProfileUpdate);
        
        return () => {
            window.removeEventListener(PROFILE_UPDATED_EVENT, handleProfileUpdate);
        };
    }, []);

    // Load doctor data from localStorage
    const loadDoctorData = () => {
        try {
            const savedData = localStorage.getItem('clinicProfile');
            if (savedData) {
                const parsed = JSON.parse(savedData);
                if (parsed && parsed.doctorInfo) {
                    setDoctorInfo(parsed.doctorInfo);
                    setFormData(parsed.doctorInfo);
                    setPhotoPreview(parsed.doctorInfo.profilePhoto);
                } else {
                    // If no doctorInfo, create default structure
                    const defaultProfile = {
                        ...parsed,
                        doctorInfo: defaultDoctorInfo
                    };
                    localStorage.setItem('clinicProfile', JSON.stringify(defaultProfile));
                    setDoctorInfo(defaultDoctorInfo);
                    setFormData(defaultDoctorInfo);
                }
            } else {
                // No data at all, create default
                const defaultProfile = {
                    clinicName: 'Omkar Clinic',
                    address: 'Omkar Clinic, Wadibhokar Road, Deopur, Dhule',
                    city: 'Dhule',
                    state: 'Maharashtra',
                    pincode: '424001',
                    phone: '+91 22 1234 5678',
                    email: 'info@Omkarclinic.com',
                    website: 'www.Omkarclinic.com',
                    registrationNo: 'MHC/1234/2020',
                    established: '2013',
                    licenseNo: 'MH/CLINIC/2020/1234',
                    doctorInfo: defaultDoctorInfo
                };
                localStorage.setItem('clinicProfile', JSON.stringify(defaultProfile));
                setDoctorInfo(defaultDoctorInfo);
                setFormData(defaultDoctorInfo);
            }
        } catch (error) {
            console.error('Error loading doctor data:', error);
            setDoctorInfo(defaultDoctorInfo);
            setFormData(defaultDoctorInfo);
        } finally {
            setLoading(false);
        }
    };

    // Update main profile in localStorage
    const updateMainProfile = (newDoctorInfo) => {
        try {
            const savedData = localStorage.getItem('clinicProfile');
            let mainProfile = savedData ? JSON.parse(savedData) : {};
            
            // Update doctorInfo in main profile
            mainProfile.doctorInfo = newDoctorInfo;
            
            // Save back to localStorage
            localStorage.setItem('clinicProfile', JSON.stringify(mainProfile));
            
            // ✅ FIX: Dispatch CustomEvent so Settings component also re-renders
            window.dispatchEvent(new CustomEvent(PROFILE_UPDATED_EVENT));
            
            console.log('✅ Doctor profile updated in shared storage');
        } catch (error) {
            console.error('Error updating main profile:', error);
            alert('Failed to save profile. Please try again.');
        }
    };

    // Handle form field changes
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    // Handle photo upload
    const handlePhotoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (!file.type.startsWith("image/")) {
                alert("❌ Please select an image file (JPG, PNG, etc.)");
                return;
            }
            if (file.size > 5 * 1024 * 1024) {
                alert("❌ Image size must be less than 5MB");
                return;
            }
            const reader = new FileReader();
            reader.onloadend = () => {
                setPhotoPreview(reader.result);
                setFormData(prev => ({ ...prev, profilePhoto: reader.result }));
            };
            reader.readAsDataURL(file);
        }
    };

    // Remove photo
    const handleRemovePhoto = () => {
        setPhotoPreview(null);
        setFormData(prev => ({ ...prev, profilePhoto: null }));
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    // Submit form
    const handleSubmit = (e) => {
        e.preventDefault();
        setDoctorInfo(formData);
        updateMainProfile(formData);
        setIsEditing(false);
        alert("✅ Profile updated successfully!");
    };

    // Cancel editing
    const handleCancel = () => {
        setFormData({ ...doctorInfo });
        setPhotoPreview(doctorInfo.profilePhoto);
        setIsEditing(false);
    };

    // Start editing
    const handleEditClick = () => {
        setFormData({ ...doctorInfo });
        setPhotoPreview(doctorInfo.profilePhoto);
        setIsEditing(true);
    };

    // Show loading state
    if (loading) {
        return <div className="loading">Loading doctor profile...</div>;
    }

    const currentPhoto = doctorInfo.profilePhoto;

    return (
        <div className="appointments-page">
            {/* Header */}
            <div className="page-header">
                <div>
                    <h1>👨‍⚕️ My Profile</h1>
                </div>
                {!isEditing && (
                    <button className="add-btn" onClick={handleEditClick}>
                        ✏️ Edit Profile
                    </button>
                )}
            </div>

            {/* Profile View Mode */}
            {!isEditing ? (
                <>
                    {/* Profile Header Banner */}
                    <div className="dashboard-header" style={{ marginBottom: "30px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "24px" }}>
                            {/* Profile Photo or Initials */}
                            {currentPhoto ? (
                                <img
                                    src={currentPhoto}
                                    alt="Profile"
                                    style={{
                                        width: "80px", height: "80px", borderRadius: "50%",
                                        objectFit: "cover",
                                        border: "3px solid rgba(255,255,255,0.4)",
                                        boxShadow: "0 4px 12px rgba(0,0,0,0.2)"
                                    }}
                                />
                            ) : (
                                <div style={{
                                    width: "80px", height: "80px", borderRadius: "50%",
                                    background: "rgba(255,255,255,0.2)", display: "flex",
                                    alignItems: "center", justifyContent: "center",
                                    fontSize: "32px", fontWeight: "700", color: "white",
                                    border: "3px solid rgba(255,255,255,0.3)"
                                }}>
                                    {doctorInfo.name ? doctorInfo.name.charAt(0) : 'D'}
                                </div>
                            )}
                            <div>
                                <h1 style={{ color: "white", fontSize: "24px", margin: "0 0 4px" }}>{doctorInfo.name || 'Doctor Name'}</h1>
                                <p style={{ color: "rgba(255,255,255,0.9)", margin: "0 0 4px", fontSize: "16px", fontWeight: "600" }}>
                                    {doctorInfo.specialization || 'Specialization'}
                                </p>
                                <p style={{ color: "rgba(255,255,255,0.7)", margin: "0", fontSize: "14px" }}>
                                    {doctorInfo.department || 'Department'}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Personal Information */}
                    <div className="table-container" style={{ marginBottom: "24px" }}>
                        <div className="table-header">
                            <h3>📋 Personal Information</h3>
                        </div>
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "20px", padding: "10px 0" }}>
                            <div style={{ padding: "12px 16px", background: "#f8fafc", borderRadius: "4px" }}>
                                <p style={{ fontSize: "12px", fontWeight: "700", color: "#64748b", textTransform: "uppercase", margin: "0 0 4px" }}>Full Name</p>
                                <p style={{ fontSize: "16px", color: "#1e293b", fontWeight: "500", margin: "0" }}>{doctorInfo.name || 'N/A'}</p>
                            </div>
                            <div style={{ padding: "12px 16px", background: "#f8fafc", borderRadius: "4px" }}>
                                <p style={{ fontSize: "12px", fontWeight: "700", color: "#64748b", textTransform: "uppercase", margin: "0 0 4px" }}>Phone</p>
                                <p style={{ fontSize: "16px", color: "#1e293b", fontWeight: "500", margin: "0" }}>{doctorInfo.doctorPhone || 'N/A'}</p>
                            </div>
                            <div style={{ padding: "12px 16px", background: "#f8fafc", borderRadius: "4px" }}>
                                <p style={{ fontSize: "12px", fontWeight: "700", color: "#64748b", textTransform: "uppercase", margin: "0 0 4px" }}>Email</p>
                                <p style={{ fontSize: "16px", color: "#1e293b", fontWeight: "500", margin: "0" }}>{doctorInfo.doctorEmail || 'N/A'}</p>
                            </div>
                            <div style={{ padding: "12px 16px", background: "#f8fafc", borderRadius: "4px" }}>
                                <p style={{ fontSize: "12px", fontWeight: "700", color: "#64748b", textTransform: "uppercase", margin: "0 0 4px" }}>Address</p>
                                <p style={{ fontSize: "16px", color: "#1e293b", fontWeight: "500", margin: "0" }}>{doctorInfo.doctorAddress || 'N/A'}</p>
                            </div>
                        </div>
                    </div>

                    {/* Professional Information */}
                    <div className="table-container">
                        <div className="table-header">
                            <h3>🏥 Professional Information</h3>
                        </div>
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "20px", padding: "10px 0" }}>
                            <div style={{ padding: "12px 16px", background: "#f8fafc", borderRadius: "4px" }}>
                                <p style={{ fontSize: "12px", fontWeight: "700", color: "#64748b", textTransform: "uppercase", margin: "0 0 4px" }}>Specialization</p>
                                <p style={{ fontSize: "16px", color: "#1e293b", fontWeight: "500", margin: "0" }}>{doctorInfo.specialization || 'N/A'}</p>
                            </div>
                            <div style={{ padding: "12px 16px", background: "#f8fafc", borderRadius: "4px" }}>
                                <p style={{ fontSize: "12px", fontWeight: "700", color: "#64748b", textTransform: "uppercase", margin: "0 0 4px" }}>Department</p>
                                <p style={{ fontSize: "16px", color: "#1e293b", fontWeight: "500", margin: "0" }}>{doctorInfo.department || 'N/A'}</p>
                            </div>
                            <div style={{ padding: "12px 16px", background: "#f8fafc", borderRadius: "4px" }}>
                                <p style={{ fontSize: "12px", fontWeight: "700", color: "#64748b", textTransform: "uppercase", margin: "0 0 4px" }}>Experience</p>
                                <p style={{ fontSize: "16px", color: "#1e293b", fontWeight: "500", margin: "0" }}>{doctorInfo.experience || 'N/A'}</p>
                            </div>
                            <div style={{ padding: "12px 16px", background: "#f8fafc", borderRadius: "4px" }}>
                                <p style={{ fontSize: "12px", fontWeight: "700", color: "#64748b", textTransform: "uppercase", margin: "0 0 4px" }}>Join Date</p>
                                <p style={{ fontSize: "16px", color: "#1e293b", fontWeight: "500", margin: "0" }}>{doctorInfo.joinDate ? new Date(doctorInfo.joinDate).toLocaleDateString() : 'N/A'}</p>
                            </div>
                            <div style={{ padding: "12px 16px", background: "#f8fafc", borderRadius: "4px" }}>
                                <p style={{ fontSize: "12px", fontWeight: "700", color: "#64748b", textTransform: "uppercase", margin: "0 0 4px" }}>License Number</p>
                                <p style={{ fontSize: "16px", color: "#1e293b", fontWeight: "500", margin: "0" }}>{doctorInfo.licenseNumber || 'N/A'}</p>
                            </div>
                            <div style={{ padding: "12px 16px", background: "#f8fafc", borderRadius: "4px" }}>
                                <p style={{ fontSize: "12px", fontWeight: "700", color: "#64748b", textTransform: "uppercase", margin: "0 0 4px" }}>Qualifications</p>
                                <p style={{ fontSize: "16px", color: "#1e293b", fontWeight: "500", margin: "0" }}>{doctorInfo.qualifications || 'N/A'}</p>
                            </div>
                        </div>
                    </div>
                </>
            ) : (
                /* Edit Mode */
                <div className="popup-card wide-popup" style={{ maxWidth: "100%", boxShadow: "0 4px 12px rgba(0,0,0,0.05)", border: "1px solid #e2e8f0" }}>
                    <h2>✏️ Edit Profile</h2>
                    <form onSubmit={handleSubmit}>

                        {/* Profile Photo Section */}
                        <h3 style={{ margin: "0 0 16px", fontSize: "16px", color: "#475569", borderBottom: "2px solid #e2e8f0", paddingBottom: "8px" }}>📷 Profile Photo</h3>
                        <div style={{
                            display: "flex", alignItems: "center", gap: "24px",
                            marginBottom: "24px", padding: "20px",
                            background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "4px"
                        }}>
                            {/* Photo Preview */}
                            <div style={{ position: "relative" }}>
                                {photoPreview ? (
                                    <img
                                        src={photoPreview}
                                        alt="Profile Preview"
                                        style={{
                                            width: "100px", height: "100px", borderRadius: "50%",
                                            objectFit: "cover",
                                            border: "3px solid #1976d2",
                                            boxShadow: "0 4px 12px rgba(25,118,210,0.2)"
                                        }}
                                    />
                                ) : (
                                    <div style={{
                                        width: "100px", height: "100px", borderRadius: "50%",
                                        background: "linear-gradient(135deg, #1976d2, #42a5f5)",
                                        display: "flex", alignItems: "center", justifyContent: "center",
                                        fontSize: "36px", fontWeight: "700", color: "white",
                                        border: "3px solid #e2e8f0",
                                        boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
                                    }}>
                                        {formData.name ? formData.name.charAt(0) : 'D'}
                                    </div>
                                )}
                            </div>

                            {/* Upload Controls */}
                            <div style={{ flex: 1 }}>
                                <p style={{ margin: "0 0 8px", fontSize: "14px", fontWeight: "600", color: "#1e293b" }}>
                                    Upload Profile Photo
                                </p>
                                <p style={{ margin: "0 0 12px", fontSize: "12px", color: "#64748b" }}>
                                    JPG, PNG or GIF. Max 5MB. Recommended: 200×200px
                                </p>
                                <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        onChange={handlePhotoChange}
                                        accept="image/*"
                                        style={{ display: "none" }}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => fileInputRef.current.click()}
                                        style={{
                                            padding: "8px 20px",
                                            background: "linear-gradient(135deg, #1976d2, #42a5f5)",
                                            color: "white", border: "none", borderRadius: "4px",
                                            fontSize: "13px", fontWeight: "600", cursor: "pointer"
                                        }}
                                    >
                                        📁 Choose Photo
                                    </button>
                                    {photoPreview && (
                                        <button
                                            type="button"
                                            onClick={handleRemovePhoto}
                                            style={{
                                                padding: "8px 20px",
                                                background: "#fee2e2", color: "#c62828",
                                                border: "1px solid #fecaca", borderRadius: "4px",
                                                fontSize: "13px", fontWeight: "600", cursor: "pointer"
                                            }}
                                        >
                                            🗑️ Remove
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Personal Information */}
                        <h3 style={{ margin: "0 0 16px", fontSize: "16px", color: "#475569", borderBottom: "2px solid #e2e8f0", paddingBottom: "8px" }}>Personal Information</h3>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "24px" }}>
                            <div className="popup-form-group">
                                <label>Full Name</label>
                                <input type="text" name="name" value={formData.name || ''} onChange={handleChange} required />
                            </div>
                            <div className="popup-form-group">
                                <label>Phone</label>
                                <input type="text" name="doctorPhone" value={formData.doctorPhone || ''} onChange={handleChange} required />
                            </div>
                            <div className="popup-form-group">
                                <label>Email</label>
                                <input type="email" name="doctorEmail" value={formData.doctorEmail || ''} onChange={handleChange} required />
                            </div>
                            <div className="popup-form-group">
                                <label>Address</label>
                                <input type="text" name="doctorAddress" value={formData.doctorAddress || ''} onChange={handleChange} required />
                            </div>
                        </div>

                        {/* Professional Information */}
                        <h3 style={{ margin: "0 0 16px", fontSize: "16px", color: "#475569", borderBottom: "2px solid #e2e8f0", paddingBottom: "8px" }}>Professional Information</h3>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "24px" }}>
                            <div className="popup-form-group">
                                <label>Specialization</label>
                                <input type="text" name="specialization" value={formData.specialization || ''} onChange={handleChange} required />
                            </div>
                            <div className="popup-form-group">
                                <label>Department</label>
                                <input type="text" name="department" value={formData.department || ''} onChange={handleChange} required />
                            </div>
                            <div className="popup-form-group">
                                <label>Experience</label>
                                <input type="text" name="experience" value={formData.experience || ''} onChange={handleChange} required />
                            </div>
                            <div className="popup-form-group">
                                <label>License Number</label>
                                <input type="text" name="licenseNumber" value={formData.licenseNumber || ''} onChange={handleChange} required />
                            </div>
                            <div className="popup-form-group">
                                <label>Qualifications</label>
                                <input type="text" name="qualifications" value={formData.qualifications || ''} onChange={handleChange} required />
                            </div>
                            <div className="popup-form-group">
                                <label>Join Date</label>
                                <input type="date" name="joinDate" value={formData.joinDate || ''} onChange={handleChange} required />
                            </div>
                        </div>

                        <div className="popup-actions">
                            <button type="button" className="cancel" onClick={handleCancel}>Cancel</button>
                            <button type="submit" className="confirm">✅ Save Changes</button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
}

export default DoctorProfile;