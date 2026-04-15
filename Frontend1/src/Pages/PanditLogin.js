import React, { useState } from "react";
import "./PanditLogin.css";
import logo from "../Assets/logo-removebg-preview.png";
import { toast } from "react-toastify";
import mandala from "../Assets/mandalaright-removebg-preview.png";
import bg from "../Assets/bg.jpg";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const PanditLogin = () => {

const navigate = useNavigate();
const [mode, setMode] = useState("signup");

const [form, setForm] = useState({
name: "",
MobileNo: "",
email: "",
experience: "",
specialization: [],
address: "",
about: "",
password: "",
confirmPassword: "",
image: null
});

const [loginForm, setLoginForm] = useState({
email: "",
password: "",
});

const [errors, setErrors] = useState({});

const handleChange = (e) => {
setForm({ ...form, [e.target.name]: e.target.value });
};

const handleImageChange = (e) => {
setForm({
...form,
image: e.target.files[0],
});
};

const handleLoginChange = (e) => {
setLoginForm({ ...loginForm, [e.target.name]: e.target.value });
};

const validate = () => {
let newErrors = {};

if (!form.name) newErrors.name = "Name is required";

if (!form.MobileNo)
newErrors.MobileNo = "Mobile number is required";
else if (!/^\d+$/.test(form.MobileNo))
newErrors.MobileNo = "Only numbers allowed";
else if (form.MobileNo.length !== 10)
newErrors.MobileNo = "Mobile number must be 10 digits";

if (!form.email.endsWith("@gmail.com"))
newErrors.email = "Email must end with @gmail.com";

if (!form.experience) newErrors.experience = "Experience required";

if (form.specialization.length === 0)
newErrors.specialization = "Select at least one specialization";

if (!form.address) newErrors.address = "Address required";

if (!form.about) newErrors.about = "About required";

const passRegex =
/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;

if (!passRegex.test(form.password))
newErrors.password =
"Password must be 8+ chars with letter, number & special char";

if (form.password !== form.confirmPassword)
newErrors.confirmPassword = "Passwords do not match";

setErrors(newErrors);
return Object.keys(newErrors).length === 0;
};

const handleSpecializationChange = (e) => {

const { value, checked } = e.target;

if (checked) {
setForm({
...form,
specialization: [
...form.specialization,
{ name: value, price: "" }
]
});
} else {
setForm({
...form,
specialization: form.specialization.filter(
(item) => item.name !== value
)
});
}
};

const handleSubmit = async () => {

if (!validate()) return;

try {

const role = localStorage.getItem("selectedRole");

const formData = new FormData();

formData.append("name", form.name);
formData.append("MobileNo", form.MobileNo);
formData.append("email", form.email);
formData.append("experience", form.experience);
formData.append("address", form.address);
formData.append("about", form.about);
formData.append("password", form.password);
formData.append("role", role);

formData.append(
"specialization",
JSON.stringify(form.specialization)
);

if (form.image) {
formData.append("image", form.image);
}

const response = await axios.post(
"http://localhost:8000/api/pandit/registerlogin",
formData,
{
headers: {
"Content-Type": "multipart/form-data",
},
}
);

toast.success("Signup Successful ✅");

localStorage.setItem("token", response.data.token);
localStorage.setItem("user", JSON.stringify(response.data.user));

navigate("/home");

} catch (error) {
toast.error(error.response?.data?.msg || "Signup failed");
}

};

const handleLoginSubmit = async () => {

if (!loginForm.email) return toast.error("Enter Email");
if (!loginForm.password) return toast.error("Enter Password");

try {

const response = await axios.post(
"http://localhost:8000/api/pandit/login",
loginForm
);

toast.success("Login Successful ✅");

localStorage.setItem("token", response.data.token);
localStorage.setItem("user", JSON.stringify(response.data.user));

navigate("/home");

} catch (error) {
toast.error(error.response?.data?.msg || "Login failed");
}

};

const specializationOptions = [
"सप्तशती चे पाठ",
"नक्षत्र शांती",
"ग्रह शांती",
"नवनाथ पारायण",
"गुरुचरित्र पारायण",
"कालसर्प शांती",
"उदक शांती",
"ब्राह्म विवाह",
"उपनयन",
"सत्यनारायण",
"संगीतमय भागवत कथा",
"शिवमहापुराण कथा",
"अंत्येष्टी",
"हरतालिका",
"वटसावित्री",
"घटस्थापना",
"लक्ष्मीपूजन",
"पितृपूजा",
"भूमिपूजन",
"विवाह",
"रुद्राभिषेक",
"सोळा सोमवार व्रत उद्यापन",
"चतुर्थी उद्यापन",
"गुरुजप",
"तुळशी विवाह",
"गणेश स्थापना",
"साखरपुडा",
"गणेश यज्ञ",
"दत्त यज्ञ",
"विष्णु यज्ञ",
"चातुर्मास्य यज्ञ",
"महायज्ञ",
"नवचंडी यज्ञ",
"गायत्री हवन",
"नवग्रह हवन",
"महा मृत्युंजय हवन",
"लघु रुद्र हवन",
"महा रुद्र हवन",
"शतचंडी हवन",
"वास्तु शांती हवन",
"मंदिर प्रतिष्ठा हवन"
];

return (

<div className="pandit-container">

<div className="pandit-left" style={{ backgroundImage: `url(${bg})` }}>

<div className="pandit-overlay">

<div className="pandit-card big-form">

{mode === "signup" ? (

<>

<img
    src={logo}
    alt="logo"
    className="profile-logo"
/>

<h2 className="pandit-title">Sign Up</h2>

<input name="name" placeholder="Name"
className="pandit-input"
value={form.name}
onChange={handleChange} />

{errors.name && <p className="error-text">{errors.name}</p>}

<input name="MobileNo" placeholder="Mobile Number"
className="pandit-input"
value={form.MobileNo}
onChange={handleChange} />

{errors.MobileNo && <p className="error-text">{errors.MobileNo}</p>}

<input name="email" placeholder="Email"
className="pandit-input"
value={form.email}
onChange={handleChange} />

{errors.email && <p className="error-text">{errors.email}</p>}

<input name="experience" placeholder="Experience (years)"
className="pandit-input"
value={form.experience}
onChange={handleChange} />

{errors.experience && <p className="error-text">{errors.experience}</p>}

<div className="pandit-input">

<label><b>Select Specialization:</b></label>

{specializationOptions.map((item, index) => {

const selected = form.specialization.find(
(sp) => sp.name === item
);

return (

<div key={index} style={{ marginBottom: "10px" }}>

<input
type="checkbox"
value={item}
checked={!!selected}
onChange={handleSpecializationChange}
/>

<label> {item}</label>

{selected && (

<input
type="number"
placeholder="Enter Price"
style={{ marginLeft: "10px" }}
value={selected.price}
onChange={(e) => {

const updated = form.specialization.map((sp) =>
sp.name === item
? { ...sp, price: e.target.value }
: sp
);

setForm({
...form,
specialization: updated
});

}}
/>

)}

</div>

);

})}

</div>

<input name="address" placeholder="Address"
className="pandit-input"
value={form.address}
onChange={handleChange} />

<textarea name="about" placeholder="About"
className="pandit-textarea"
value={form.about}
onChange={handleChange} />

<input type="password" name="password"
placeholder="Password"
className="pandit-input"
value={form.password}
onChange={handleChange} />

<input type="password" name="confirmPassword"
placeholder="Confirm Password"
className="pandit-input"
value={form.confirmPassword}
onChange={handleChange} />

<input
type="file"
name="image"
className="pandit-input"
accept="image/*"
onChange={handleImageChange}
/>

<button className="pandit-btn" onClick={handleSubmit}>
Sign Up
</button>

<p className="switch-text" onClick={() => setMode("login")}>
Already have account? Login
</p>

</>

) : (

<>
 <img
    src={logo}
    alt="logo"
    className="profile-logo"
/>

<h2 className="pandit-title">Login</h2>

<input name="email"
placeholder="Email"
className="pandit-input"
value={loginForm.email}
onChange={handleLoginChange}
/>

<input type="password"
name="password"
placeholder="Password"
className="pandit-input"
value={loginForm.password}
onChange={handleLoginChange}
/>

<button className="pandit-btn" onClick={handleLoginSubmit}>
Login
</button>

<p className="switch-text" onClick={() => setMode("signup")}>
New user? Sign Up
</p>

</>

)}

</div>
</div>
</div>

<div className="pandit-right">

<img src={mandala} alt="mandala" className="mandala-bg" />

<div className="mantra-card">

<span className="line"></span>

<h2 className="mantra-text">

वक्रतुंड महाकाय
<br />
सूर्यकोटि समप्रभः
<br />
निर्विघ्नं कुरु मे देव
<br />
सर्वकार्येषु सर्वदा ॥

</h2>

</div>
</div>

</div>

);

};

export default PanditLogin;