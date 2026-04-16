import React from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";

import Navbar from "./Pages/Navbar";
import Footer from "./Pages/Footer";

import HomePage from "./Pages/HomePage";
import ExplorePage from "./Pages/ExplorePage";
import AboutUsPage from "./Pages/AboutUsPage";
import HinduFestivalsPage from "./Pages/HinduFestivalsPage";

import UserSelect from "./Pages/UserSelect";
import PanditLogin from "./Pages/PanditLogin";
import UserLogin from "./Pages/UserLogin";
import PujaDetail from "./Pages/PujaDetail";
import AllPujas from "./Pages/AllPujas";
import VedicPage from "./Pages/VedicPage";
import Sanskar from "./Pages/Sanskar";

/* PUJA IMPORTS */
import SaptashatiPath from "./Pages/Pujas/SaptashatiPath";
import NakshatraShanti from "./Pages/Pujas/NakshatraShanti";
import GrahShanti from "./Pages/Pujas/GrahShanti";
import NavnathParayan from "./Pages/Pujas/NavnathParayan";
import GurucharitraParayan from "./Pages/Pujas/GurucharitraParayan";
import KalsarpShanti from "./Pages/Pujas/KalsarpShanti";
import UdakShanti from "./Pages/Pujas/UdakShanti";
import BrahmaVivah from "./Pages/Pujas/BrahmaVivah";
import Upanayan from "./Pages/Pujas/Upanayan";
import Satyanarayan from "./Pages/Pujas/Satyanarayan";
import BhagwatKatha from "./Pages/Pujas/BhagwatKatha";
import ShivPuranKatha from "./Pages/Pujas/ShivPuranKatha";
import Antyeshti from "./Pages/Pujas/Antyeshti";
import Hartalika from "./Pages/Pujas/Hartalika";
import VatSavitri from "./Pages/Pujas/VatSavitri";
import GhatSthapana from "./Pages/Pujas/GhatSthapana";
import LakshmiPujan from "./Pages/Pujas/LakshmiPujan";
import PitraPuja from "./Pages/Pujas/PitraPuja";
import BhumiPujan from "./Pages/Pujas/BhumiPujan";
import Vivah from "./Pages/Pujas/Vivah";
import Rudrabhishek from "./Pages/Pujas/Rudrabhishek";
import SolahSomvar from "./Pages/Pujas/SolahSomvar";
import ChaturthiUdyapan from "./Pages/Pujas/ChaturthiUdyapan";
import GuruJap from "./Pages/Pujas/GuruJap";
import TulsiVivah from "./Pages/Pujas/TulsiVivah";
import GaneshSthapana from "./Pages/Pujas/GaneshSthapana";
import Sakharpuda from "./Pages/Pujas/Sakharpuda";

/* FESTIVAL IMPORTS */
import MakarSankranti from "./Pages/Festivals/mk";
import Sankashti from "./Pages/Festivals/sc";
import BasantPanchami from "./Pages/Festivals/vp";
import Shivratri from "./Pages/Festivals/maha";
import Holi from "./Pages/Festivals/holi";
import Janmashtami from "./Pages/Festivals/jnma";
import Dussehra from "./Pages/Festivals/dasra";
import Onam from "./Pages/Festivals/onam";
import Diwali from "./Pages/Festivals/diwali";
import RakshaBandhan from "./Pages/Festivals/raksha";
import GudiPadwa from "./Pages/Festivals/gudi";
import Teej from "./Pages/Festivals/teej";
import KarvaChauth from "./Pages/Festivals/karva";
import Ekadashi from "./Pages/Festivals/ekadashi";
import Gauri from "./Pages/Festivals/gauri";

/* SPIRITUAL IMPORTS */
import BhagavadGita from "./Pages/Spiritual/BhagavadGita";
import Ramayan from "./Pages/Spiritual/Ramayan";
import VedicMantras from "./Pages/Spiritual/VedicMantras";
import Prayers from "./Pages/Spiritual/Prayers";
import SpiritualQuotes from "./Pages/Spiritual/SpiritualQuotes";
import GodsDeities from "./Pages/Spiritual/GodsDeities";

import YagPage from "./Pages/AllYag/Yag";
import GaneshY from "./Pages/AllYag/GaneshY";
import DattaY from "./Pages/AllYag/DattaY";
import VishnuY from "./Pages/AllYag/VishnuY";
import ChaturmasyaY from "./Pages/AllYag/ChaturmasyaY";
import MahaYadnya from "./Pages/AllYag/MahaYadnya";
import NavchandiY from "./Pages/AllYag/NavchandiY";

/* ================= ALL HAVAN IMPORTS ================= */
import GayatriHavan from "./Pages/AllHavan/GayatriHavan";
import Havan from "./Pages/AllHavan/Havan";
import LaghuRudraHavan from "./Pages/AllHavan/LaghuRudraHavan";
import MahamritunjayHavan from "./Pages/AllHavan/MahamritunjayHavan";
import MahaRudraHavan from "./Pages/AllHavan/MahaRudraHavan";
import NavagrahaHavan from "./Pages/AllHavan/NavagrahaHavan";
import ShatChandiHavan from "./Pages/AllHavan/ShatChandiHavan";
import TemplePratishthaHavan from "./Pages/AllHavan/TemplePratishthaHavan";
import VastuShantiHavan from "./Pages/AllHavan/VastuShantiHavan";

function Layout({ children }) {
  const location = useLocation();

  const hideNavAndFooter =
    location.pathname === "/" ||
    location.pathname === "/pandit-login" ||
    location.pathname === "/user-login";

  return (
    <>
      {!hideNavAndFooter && <Navbar />}
      {children}
      {!hideNavAndFooter && <Footer />}
    </>
  );
}

function App() {
  return (
    <Router>
      <Layout>
        <Routes>

          {/* FIRST PAGE */}
          <Route path="/" element={<UserSelect />} />

          {/* LOGIN ROUTES */}
          <Route path="/pandit-login" element={<PanditLogin />} />
          <Route path="/user-login" element={<UserLogin />} />

          {/* AFTER LOGIN */}
          <Route path="/home" element={<HomePage />} />

       {/* ALL YAG */}
 <Route path="/yag" element={<YagPage />} />

        <Route path="/yag/ganesh" element={<GaneshY />} />
        <Route path="/yag/datta" element={<DattaY />} />
        <Route path="/yag/vishnu" element={<VishnuY />} />
        <Route path="/yag/chaturmasya" element={<ChaturmasyaY />} />
        <Route path="/yag/mahayadnya" element={<MahaYadnya />} />
        <Route path="/yag/navchandi" element={<NavchandiY />} />

          {/* ================= HAVAN ROUTES ================= */}

<Route path="/havan" element={<Havan />} />
<Route path="/havan/gayatri" element={<GayatriHavan />} />
<Route path="/havan/laghurudra" element={<LaghuRudraHavan />} />
<Route path="/havan/mahamrityunjaya" element={<MahamritunjayHavan />} />
<Route path="/havan/pratishtha" element={<TemplePratishthaHavan />} />
<Route path="/havan/maharudra" element={<MahaRudraHavan />} />
<Route path="/havan/navagraha" element={<NavagrahaHavan />} />
<Route path="/havan/shatchandi" element={<ShatChandiHavan />} />
<Route path="/havan/vastu" element={<VastuShantiHavan />} />

          {/* MAIN PAGES */}
          <Route path="/explore" element={<ExplorePage />} />
          <Route path="/about" element={<AboutUsPage />} />
          <Route path="/festivals" element={<HinduFestivalsPage />} />
          <Route path="/vedic" element={<VedicPage />} />
          <Route path="/all-pujas/:pujaName" element={<PujaDetail />} />
          <Route path="/all-pujas" element={<AllPujas />} />
   <Route path="/sanskar" element={<Sanskar />} />

          {/* PUJA ROUTES */}
          <Route path="/puja/saptashati" element={<SaptashatiPath />} />
          <Route path="/puja/nakshatra-shanti" element={<NakshatraShanti />} />
          <Route path="/puja/grah-shanti" element={<GrahShanti />} />
          <Route path="/puja/navnath-parayan" element={<NavnathParayan />} />
          <Route path="/puja/gurucharitra-parayan" element={<GurucharitraParayan />} />
          <Route path="/puja/kalsarp-shanti" element={<KalsarpShanti />} />
          <Route path="/puja/udak-shanti" element={<UdakShanti />} />
          <Route path="/puja/brahma-vivah" element={<BrahmaVivah />} />
          <Route path="/puja/upanayan" element={<Upanayan />} />
          <Route path="/puja/satyanarayan" element={<Satyanarayan />} />
          <Route path="/puja/bhagwat-katha" element={<BhagwatKatha />} />
          <Route path="/puja/shivpuran-katha" element={<ShivPuranKatha />} />
          <Route path="/puja/antyeshti" element={<Antyeshti />} />
          <Route path="/puja/hartalika" element={<Hartalika />} />
          <Route path="/puja/vat-savitri" element={<VatSavitri />} />
          <Route path="/puja/ghat-sthapana" element={<GhatSthapana />} />
          <Route path="/puja/lakshmi-pujan" element={<LakshmiPujan />} />
          <Route path="/puja/pitra-puja" element={<PitraPuja />} />
          <Route path="/puja/bhumi-pujan" element={<BhumiPujan />} />
          <Route path="/puja/vivah" element={<Vivah />} />
          <Route path="/puja/rudrabhishek" element={<Rudrabhishek />} />
          <Route path="/puja/solah-somvar" element={<SolahSomvar />} />
          <Route path="/puja/chaturthi-udyapan" element={<ChaturthiUdyapan />} />
          <Route path="/puja/guru-jap" element={<GuruJap />} />
          <Route path="/puja/tulsi-vivah" element={<TulsiVivah />} />
          <Route path="/puja/ganesh-sthapana" element={<GaneshSthapana />} />
          <Route path="/puja/sakharpuda" element={<Sakharpuda />} />

          {/* FESTIVAL ROUTES */}
          <Route path="/festival/makarsankranti" element={<MakarSankranti />} />
          <Route path="/festival/sankashti" element={<Sankashti />} />
          <Route path="/festival/basant" element={<BasantPanchami />} />
          <Route path="/festival/shivratri" element={<Shivratri />} />
          <Route path="/festival/holi" element={<Holi />} />
          <Route path="/festival/janmashtami" element={<Janmashtami />} />
          <Route path="/festival/dasra" element={<Dussehra />} />
          <Route path="/festival/onam" element={<Onam />} />
          <Route path="/festival/diwali" element={<Diwali />} />
          <Route path="/festival/raksha" element={<RakshaBandhan />} />
          <Route path="/festival/gudi" element={<GudiPadwa />} />
          <Route path="/festival/tij" element={<Teej />} />
          <Route path="/festival/karva" element={<KarvaChauth />} />
          <Route path="/festival/ekadashi" element={<Ekadashi />} />
          <Route path="/festival/gauri" element={<Gauri />} />

          {/* SPIRITUAL ROUTES */}
          <Route path="/spiritual/bhagavadgita" element={<BhagavadGita />} />
          <Route path="/spiritual/ramayan" element={<Ramayan />} />
          <Route path="/spiritual/vedicmantras" element={<VedicMantras />} />
          <Route path="/spiritual/prayers" element={<Prayers />} />
          <Route path="/spiritual/spiritualquotes" element={<SpiritualQuotes />} />
          <Route path="/spiritual/godsdeities" element={<GodsDeities />} />

        </Routes>
      </Layout>
      <ToastContainer position="top-right" autoClose={3000} />
    </Router>
  );
}

export default App;