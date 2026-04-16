// const Pandit = require("../models/Pandit");

// const addPanditProfile = async (req, res) => {
//   try {
//     const pandit = new Pandit({
//       ...req.body,
//       userId: req.user
//     });

//     await pandit.save();
//     res.status(201).json({ message: "Pandit profile created", pandit });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

// const getPanditProfile = async (req, res) => {
//   try {
//     const pandit = await Pandit.findOne({ userId: req.user });
//     res.json(pandit);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

// module.exports = { addPanditProfile, getPanditProfile };



// const panditmodal = require("../models/Pandit")
// const jwt = require("jsonwebtoken");
// const bcrypt = require("bcryptjs");
// const pandit = require("../models/Pandit");
// require("dotenv").config();


// const adduser = async (req, res) => {
//     const { Firstname, Lastname, email, password, MobileNo, experience, specialization, address } = req.body;
//     try {
//         let user = await panditmodal.findOne({ email });
//         if (user) {
//             return res.status(400).json({ msg: "User already exists" });
//         }

//         const salt = await bcrypt.genSalt(10);
//         const hashedPassword = await bcrypt.hash(password, salt);

//         user = new panditmodal({
//             Firstname,
//             Lastname,
//             email,
//             password: hashedPassword,
//             MobileNo,
//             experience,
//             specialization,
//             address
//         });

//         await user.save();
//         res.json({ msg: "User Registered Successfully", user });
//     } catch (error) {
//         console.error(error.message);
//         res.status(500).send("Server Error");
//     }
// };


// // const adduser = async (req, res) => {
// // const { name, email, password, c_password}= req.body
// //     try {
// //             const data = new usermodal({ 
// //                 name, email, password, c_password
// //             })
// //             await data.save()
// //             res.send({ message: 'User added successfully' })
// //     }
// //     catch (error) {
// //         res.status(400).send({ error: error.message })
// //     }
// // }

// const login = async (req, res) => {
//     const { email, password } = req.body;
//     try {
//         const user = await panditmodal.findOne({ email });
//         if (!user) {
//             return res.status(400).json({ msg: "Invalid email credentials" });
//         }

//         const isMatch = await bcrypt.compare(password, user.password);
//         if (!isMatch) {
//             return res.status(400).json({ msg: "Invalid password credentials" });
//         }

//         const token = jwt.sign(
//             { userId: user._id },
//             process.env.JWT_SECRET,
//             { expiresIn: "1h" }
//         );

//         res.json({ token, message: "Login successful" });
//     } catch (error) {
//         console.error(error.message);
//         res.status(500).send("Server Error");
//     }
// };

// const getuser = async (req, res) => {
//     try{
//         const data = await panditmodal.find()
//         res.status(200).send({data})
//     }
//     catch (error) {
//         res.status(400).send({error:error.message})
//     }
// }

// const deleteuser = async (req, res) => {
//     try{
//         const data = await panditmodal.deleteOne({_id:req.params._id})
//         if(data.deletedCount > 0)
//         {
//             res.status(200).send({message:"User Deleted Successfully"})
//         }
//         else
//         {
//             res.status(404).send({message:"User Not Found or Not Deleted Successfully"})
//         }
//     }
//     catch (error) 
//     {
//         console.error(error);
//         res.status(400).send({error:error.message})
//     }
// }
// const updateuser = async (req, res) => {
//     const { name, email, password } = req.body
//     try{
//         const data = await panditmodal.updateOne(
//             {_id:req.params._id},
//             {$set:{ name, email, password }}
//         );
//         if(data.modifiedCount > 0)
//         {
//             res.status(200).send({message:"User Update Sucessfully"})
//         }
//         else
//         {
//             res.status(400).send({message:"User Not Found"})
//         }
//     }
//     catch(error) 
//     {
//         console.log(error);
//         res.status(400).send({error:error.message})
//     }
// }

// module.exports = {adduser , getuser, deleteuser, updateuser, login}

// const User = require("../models/User");
// const jwt = require("jsonwebtoken");


// // Generate Token
// const generateToken = (id) => {
//   return jwt.sign({ id }, process.env.JWT_SECRET, {
//     expiresIn: "7d",
//   });
// };


// // REGISTER
// exports.registerUser = async (req, res) => {
//   const { name, email, password } = req.body;

//   const userExists = await User.findOne({ email });

//   if (userExists) {
//     return res.status(400).json({ message: "User already exists" });
//   }

//   const user = await User.create({
//     name,
//     // email,
//      email: email.toLowerCase(),
//     password,
//   });

//   res.status(201).json({
//     _id: user._id,
//     name: user.name,
//     email: user.email,
//     token: generateToken(user._id),
//   });
// };


// LOGIN
// exports.loginUser = async (req, res) => {
//   const { email, password } = req.body;

//   const user = await User.findOne({ email });

//   if (user && (await user.matchPassword(password))) {
//     res.json({
//       _id: user._id,
//       name: user.name,
//       email: user.email,
//       token: generateToken(user._id),
//     });
//   } else {
//     res.status(401).json({ message: "Invalid email or password" });
//   }
// };

// exports.loginUser = async (req, res) => {
//   const { email, password } = req.body;

//   console.log("Entered Email:", email);

//   // const user = await User.findOne({ email });
//   const user = await User.findOne({ email: email.toLowerCase() });


//   console.log("User From DB:", user);

//   if (!user) {
//     return res.status(401).json({ message: "User not found" });
//   }

//   const isMatch = await user.matchPassword(password);
//   console.log("Password Match:", isMatch);

//   if (isMatch) {
//     res.json({
//       _id: user._id,
//       name: user.name,
//       email: user.email,
//       token: generateToken(user._id),
//     });
//   } else {
//     res.status(401).json({ message: "Invalid password" });
//   }
// };


// const bcrypt = require("bcryptjs");
// exports.loginUser = async (req, res) => {
//   const { email, password } = req.body;

//   console.log("Entered Email:", email);

//   const user = await User.findOne({ email });

//   console.log("User From DB:", user);

//   if (!user) {
//     return res.status(401).json({ message: "User not found" });
//   }

//   const isMatch = await bcrypt.compare(password, user.password);

//   console.log("Entered Password:", password);
//   console.log("Hashed Password:", user.password);
//   console.log("Password Match Result:", isMatch);

//   if (isMatch) {
//     res.json({
//       _id: user._id,
//       name: user.name,
//       email: user.email,
//       token: "Login success",
//     });
//   } else {
//     res.status(401).json({ message: "Password not matching" });
//   }
// };

// import User from "../models/User.js";
// import bcrypt from "bcryptjs";
// import jwt from "jsonwebtoken";

// // 🔹 Register
// export const registerUser = async (req, res) => {
//   try {
//     const { name, email, password } = req.body;

//     const userExists = await User.findOne({ email });
//     if (userExists) {
//       return res.status(400).json({ message: "User already exists" });
//     }

//     const hashedPassword = await bcrypt.hash(password, 10);

//     const user = await User.create({
//       name,
//       email,
//       password: hashedPassword
//     });

//     res.status(201).json({
//       message: "User registered successfully"
//     });

//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };


// // 🔹 Login
// export const loginUser = async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     const user = await User.findOne({ email });

//     if (!user) {
//       return res.status(400).json({ message: "Invalid email or password" });
//     }

//     const isMatch = await bcrypt.compare(password, user.password);

//     if (!isMatch) {
//       return res.status(400).json({ message: "Invalid email or password" });
//     }

//     const token = jwt.sign(
//       { id: user._id },
//       "secretkey",
//       { expiresIn: "7d" }
//     );

//     res.json({
//       message: "Login successful",
//       token
//     });

//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// #########################################################################

// const User = require("../models/User");
// const jwt = require("jsonwebtoken");

// // Generate Token
// const generateToken = (id) => {
//   return jwt.sign({ id }, process.env.JWT_SECRET, {
//     expiresIn: "7d",
//   });
// };

// // REGISTER
// exports.registerUser = async (req, res) => {
//   const { name, email, password } = req.body;

//   const userExists = await User.findOne({ email: email.toLowerCase() });

//   if (userExists) {
//     return res.status(400).json({ message: "User already exists" });
//   }

//   const user = await User.create({
//     name,
//     email: email.toLowerCase(),
//     password,
//   });

//   res.status(201).json({
//     _id: user._id,
//     name: user.name,
//     email: user.email,
//     token: generateToken(user._id),
//   });
// };

// // LOGIN
// exports.loginUser = async (req, res) => {
//   const { email, password } = req.body;

//   const user = await User.findOne({ email: email.toLowerCase() });

//   if (!user) {
//     return res.status(401).json({ message: "User not found" });
//   }

//   // Assuming User model has matchPassword method
//   const isMatch = await user.matchPassword(password);

//   if (isMatch) {
//     res.json({
//       _id: user._id,
//       name: user.name,
//       email: user.email,
//       token: generateToken(user._id),
//     });
//   } else {
//     res.status(401).json({ message: "Invalid email or password" });
//   }
// };
// ####################################################################################







const User = require("../models/User");
const jwt = require("jsonwebtoken");

// Generate Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

// ========== REGISTER ==========
exports.registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  const userExists = await User.findOne({ email: email.toLowerCase() });

  if (userExists) {
    return res.status(400).json({ message: "User already exists" });
  }

  const user = await User.create({
    name,
    email: email.toLowerCase(),
    password,
    isActive: false, // Default inactive
  });

  res.status(201).json({
    _id: user._id,
    name: user.name,
    email: user.email,
    token: generateToken(user._id),
  });
};

// ========== LOGIN ==========
exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email: email.toLowerCase() });

  if (!user) {
    return res.status(401).json({ message: "User not found" });
  }

  // Check password
  const isMatch = await user.matchPassword(password);

  if (isMatch) {
    // ✅ SET USER AS ACTIVE
    user.isActive = true;
    user.lastLogin = new Date();
    await user.save();

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isActive: user.isActive, // Send status to frontend
      token: generateToken(user._id),
    });
  } else {
    res.status(401).json({ message: "Invalid email or password" });
  }
};

// ========== LOGOUT (NEW!) ==========
exports.logoutUser = async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ message: "User ID required" });
    }

    // ✅ SET USER AS INACTIVE
    const user = await User.findByIdAndUpdate(
      userId,
      { 
        isActive: false,
        lastLogout: new Date()
      },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ 
      message: "Logout successful",
      userId: user._id,
      isActive: user.isActive
    });

  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json({ message: error.message });
  }
};

// ========== GET ALL USERS (For Admin Dashboard) ==========
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find()
      .select('-password') // Don't send password
      .sort({ createdAt: -1 });

    res.json(users);

  } catch (error) {
    console.error("Get users error:", error);
    res.status(500).json({ message: error.message });
  }
};