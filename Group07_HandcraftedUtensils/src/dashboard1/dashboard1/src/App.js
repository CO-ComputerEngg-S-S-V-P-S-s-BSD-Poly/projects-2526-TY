// import React from "react";
// import { BrowserRouter, Routes, Route } from "react-router-dom";
// import DashboardHome from "./components/DashboardHome";
// import Shopsmanagement from "./components/Shopsmanagement";
// // import Setting from "./components/Setting";




// function App() {
//   return (
//     <BrowserRouter>
//       <Routes>
//         <Route path="/" element={<DashboardHome />} />
//         {/* <Route path="/" element={<Setting/>}/> */}
//       <Route path="/" element={<Shopsmanagement/>}/>
//       </Routes>
//     </BrowserRouter>
//   );
// }

// export default App;


//==============================================


import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import DashboardHome from "./components/DashboardHome";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<DashboardHome />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;