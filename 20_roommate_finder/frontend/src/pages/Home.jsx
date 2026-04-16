import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { FaSearch } from "react-icons/fa"; // ✅ Search Icon
import HomeImage from "../assets/Home.png"; // ✅ Ensure Correct Path
import HomeImage3 from "../assets/Home3.png"; // ✅ Ensure Correct Path

// ✅ Import City Images
import puneImage from "../assets/Pune1.png";
import mumbaiImage from "../assets/Mumbai2.jpg";
import nagpurImage from "../assets/Nagpur3.png";
import nashikImage from "../assets/Nashik4.jpg";
import sambhajinagarImage from "../assets/Sambhajinagar5.jpg";
import dhuleImage from "../assets/dhule.jpg";
import room1Image from "../assets/room1.jpg";
import room2Image from "../assets/room2.jpg";
import room3Image from "../assets/room3.jpg";
import room5Image from "../assets/room5.jpg";
import room6Image from "../assets/room6.jpg";

import Footer from "../components/Footer";

// Default images per city for room cards
const cityImages = {
  Pune: puneImage,
  Mumbai: mumbaiImage,
  Nagpur: nagpurImage,
  Nashik: nashikImage,
  Sambhajinagar: sambhajinagarImage,
  Dhule: dhuleImage,
};

const roomImages = [room1Image, room2Image, room3Image, room5Image, room6Image];

const cityCatalog = {
  Pune: [
    {
      name: "Hinjewadi",
      rooms: [
        { title: "Blue Ridge Studio", type: "Fully Furnished", price: 18000, size: "Studio | 420 sq.ft", perks: ["Wi-Fi", "Gym", "Pool", "Covered Parking"] },
        { title: "Phase 1 2BHK", type: "Semi-Furnished", price: 14500, size: "2 BHK | 780 sq.ft", perks: ["Modular Kitchen", "Balcony", "Lift"] },
        { title: "Wipro Circle PG", type: "Budget Rooms", price: 8500, size: "Single | 220 sq.ft", perks: ["Meals Included", "Housekeeping"] },
        { title: "Corner Retail Shop", type: "Shop Rooms", price: 26000, size: "300 sq.ft", perks: ["Ground Floor", "24x7 Access", "Frontage"] },
        { title: "Eon Waterfront 3BHK", type: "Fully Furnished", price: 32000, size: "3 BHK | 1120 sq.ft", perks: ["AC in all rooms", "Covered Parking", "Club Access"] }
      ]
    },
    {
      name: "Kothrud",
      rooms: [
        { title: "Paud Road 1BHK", type: "Budget Rooms", price: 10500, size: "1 BHK | 520 sq.ft", perks: ["Fresh Paint", "Market Nearby"] },
        { title: "Karve Nagar 2BHK", type: "Semi-Furnished", price: 16000, size: "2 BHK | 780 sq.ft", perks: ["Wardrobes", "Geyser", "Lift"] },
        { title: "Bharti Vidyapeeth PG", type: "Budget Rooms", price: 7500, size: "Twin Share | 200 sq.ft", perks: ["Meals", "Study Desk"] },
        { title: "Mulay Colony Shop", type: "Shop Rooms", price: 21000, size: "250 sq.ft", perks: ["Main Road", "Shutter", "Storage Loft"] },
        { title: "Ideal Colony 3BHK", type: "Fully Furnished", price: 28000, size: "3 BHK | 1080 sq.ft", perks: ["AC", "Washer", "Covered Parking"] }
      ]
    },
    {
      name: "Magarpatta",
      rooms: [
        { title: "Cosmos 2BHK", type: "Semi-Furnished", price: 19000, size: "2 BHK | 860 sq.ft", perks: ["Gated", "Club House", "Lift"] },
        { title: "South Gate Studio", type: "Budget Rooms", price: 9500, size: "Studio | 300 sq.ft", perks: ["Kitchenette", "Wi-Fi"] },
        { title: "Seasons 3BHK", type: "Fully Furnished", price: 34000, size: "3 BHK | 1200 sq.ft", perks: ["AC", "Pool Access", "Power Backup"] },
        { title: "Destination Centre Shop", type: "Shop Rooms", price: 35000, size: "360 sq.ft", perks: ["High Footfall", "Display Front"] },
        { title: "Annexe 1BHK", type: "Fully Furnished", price: 17000, size: "1 BHK | 640 sq.ft", perks: ["Appliances", "Balcony"] }
      ]
    }
  ],
  Mumbai: [
    {
      name: "Andheri West",
      rooms: [
        { title: "Lokhandwala 1RK", type: "Budget Rooms", price: 14000, size: "1 RK | 280 sq.ft", perks: ["Gas Pipeline", "Lift", "CCTV"] },
        { title: "Versova 2BHK", type: "Fully Furnished", price: 42000, size: "2 BHK | 900 sq.ft", perks: ["Sea Breeze", "AC", "Wardrobes"] },
        { title: "DN Nagar Shop", type: "Shop Rooms", price: 55000, size: "400 sq.ft", perks: ["Corner Unit", "High Visibility"] },
        { title: "Oshiwara 3BHK", type: "Semi-Furnished", price: 52000, size: "3 BHK | 1180 sq.ft", perks: ["Modular Kitchen", "Parking"] },
        { title: "Four Bungalows PG", type: "Budget Rooms", price: 12000, size: "Twin Share | 210 sq.ft", perks: ["Meals", "Wi-Fi"] }
      ]
    },
    {
      name: "Thane",
      rooms: [
        { title: "Ghodbunder 2BHK", type: "Semi-Furnished", price: 23000, size: "2 BHK | 880 sq.ft", perks: ["Parking", "Club House"] },
        { title: "Majiwada 1BHK", type: "Budget Rooms", price: 16000, size: "1 BHK | 520 sq.ft", perks: ["Lift", "Security"] },
        { title: "Vasant Vihar 3BHK", type: "Fully Furnished", price: 38000, size: "3 BHK | 1150 sq.ft", perks: ["AC", "Appliances", "Pool"] },
        { title: "Hiranandani Shop", type: "Shop Rooms", price: 48000, size: "350 sq.ft", perks: ["Plush Complex", "Glass Front"] },
        { title: "Teen Hath Naka Studio", type: "Budget Rooms", price: 12500, size: "Studio | 320 sq.ft", perks: ["Kitchenette", "Geyser"] }
      ]
    },
    {
      name: "Bandra",
      rooms: [
        { title: "Pali Hill 2BHK", type: "Fully Furnished", price: 62000, size: "2 BHK | 960 sq.ft", perks: ["AC", "Designer Decor", "Parking"] },
        { title: "Linking Road Shop", type: "Shop Rooms", price: 90000, size: "420 sq.ft", perks: ["Prime Footfall", "Wide Frontage"] },
        { title: "Bandra East 1BHK", type: "Semi-Furnished", price: 32000, size: "1 BHK | 540 sq.ft", perks: ["Lift", "Security"] },
        { title: "Chimbai 1RK", type: "Budget Rooms", price: 18500, size: "1 RK | 260 sq.ft", perks: ["Sea Breeze", "Market Access"] },
        { title: "Kalanagar 3BHK", type: "Fully Furnished", price: 68000, size: "3 BHK | 1240 sq.ft", perks: ["Appliances", "Balcony"] }
      ]
    }
  ],
  Nagpur: [
    {
      name: "Sitabuldi",
      rooms: [
        { title: "Variety Square 2BHK", type: "Semi-Furnished", price: 14000, size: "2 BHK | 820 sq.ft", address: "Variety Square, Sitabuldi", nearby: "Metro station", perks: ["Lift", "Parking", "Balcony"] },
        { title: "Sitabuldi Studio", type: "Budget Rooms", price: 8000, size: "Studio | 300 sq.ft", address: "Jhansi Rani Sq", nearby: "Market & eateries", perks: ["Wi-Fi", "Kitchenette"] },
        { title: "Residency Road 3BHK", type: "Fully Furnished", price: 22000, size: "3 BHK | 1180 sq.ft", address: "Residency Rd, Sitabuldi", nearby: "Civil Lines", perks: ["AC", "Washer", "Covered Parking"] },
        { title: "Sitabuldi Shop", type: "Shop Rooms", price: 25000, size: "280 sq.ft", address: "Central Ave, Sitabuldi", nearby: "High footfall", perks: ["Shutter", "Power Backup"] },
        { title: "Sitabuldi PG", type: "Budget Rooms", price: 6500, size: "Twin Share | 210 sq.ft", address: "Temple Rd, Sitabuldi", nearby: "Metro 5 min", perks: ["Meals", "Housekeeping"] }
      ]
    },
    {
      name: "Wardha Road",
      rooms: [
        { title: "MIHAN 2BHK", type: "Semi-Furnished", price: 15000, size: "2 BHK | 860 sq.ft", address: "MIHAN, Wardha Rd", nearby: "Airport 8 min", perks: ["Lift", "Parking"] },
        { title: "VCA Stadium Studio", type: "Budget Rooms", price: 7500, size: "Studio | 290 sq.ft", address: "Jamtha, Wardha Rd", nearby: "Stadium walkable", perks: ["Wi-Fi", "Kitchenette"] },
        { title: "Wardha Rd 3BHK", type: "Fully Furnished", price: 24000, size: "3 BHK | 1220 sq.ft", address: "Somalwada, Wardha Rd", nearby: "Metro station", perks: ["AC", "Appliances", "Parking"] },
        { title: "Wardha Rd Shop", type: "Shop Rooms", price: 27000, size: "300 sq.ft", address: "Wardha Rd frontage", nearby: "Highway traffic", perks: ["Shutter", "Signage"] },
        { title: "Wardha Rd PG", type: "Budget Rooms", price: 7000, size: "Twin Share | 200 sq.ft", address: "Chinchbhavan", nearby: "Airport 5 min", perks: ["Meals", "Housekeeping"] }
      ]
    }
  ],
  Nashik: [
    {
      name: "College Road",
      rooms: [
        { title: "College Road 2BHK", type: "Semi-Furnished", price: 15000, size: "2 BHK | 820 sq.ft", address: "202 Sunrise Apt, College Road, Nashik", nearby: "Near BYK College & Big Bazaar", perks: ["Lift", "Parking", "Balcony"] },
        { title: "Gangapur Naka Studio", type: "Budget Rooms", price: 8500, size: "Studio | 320 sq.ft", address: "Plot 11, Gangapur Naka, Nashik", nearby: "Walk to City Centre Mall", perks: ["Kitchenette", "Wi-Fi"] },
        { title: "College Road 3BHK", type: "Fully Furnished", price: 25000, size: "3 BHK | 1180 sq.ft", address: "C-3 Greenwoods, College Road", nearby: "Opp. Domino's", perks: ["AC", "Washer", "Covered Parking"] },
        { title: "College Plaza Shop", type: "Shop Rooms", price: 22000, size: "280 sq.ft", address: "Shop 4, College Plaza, Nashik", nearby: "High footfall, main road", perks: ["Shutter", "Power Backup"] },
        { title: "College Road PG", type: "Budget Rooms", price: 7000, size: "Twin Share | 210 sq.ft", address: "Lane 5, College Road", nearby: "Bus stop 2 min", perks: ["Meals", "Housekeeping"] }
      ]
    },
    {
      name: "Gangapur Road",
      rooms: [
        { title: "Pandav Leni 2BHK", type: "Semi-Furnished", price: 16000, size: "2 BHK | 840 sq.ft", address: "D-602 Galaxy, Gangapur Rd", nearby: "Near Pandav Leni", perks: ["Lift", "Geyser", "Balcony"] },
        { title: "Serene Meadows 1BHK", type: "Fully Furnished", price: 14000, size: "1 BHK | 620 sq.ft", address: "Serene Meadows, Gangapur Rd", nearby: "Close to Sula route", perks: ["AC", "Wardrobe", "Parking"] },
        { title: "Gangapur Road PG", type: "Budget Rooms", price: 7500, size: "Single | 200 sq.ft", address: "Lane 9, Gangapur Rd", nearby: "Hospitals & cafes", perks: ["Wi-Fi", "Meals"] },
        { title: "Gangapur Corner Shop", type: "Shop Rooms", price: 26000, size: "300 sq.ft", address: "Shop 2, Corner Complex", nearby: "Signal junction", perks: ["Glass Front", "Water Supply"] },
        { title: "Lake View 3BHK", type: "Fully Furnished", price: 27000, size: "3 BHK | 1250 sq.ft", address: "Lake View Apt, Gangapur", nearby: "Near Someshwar Temple", perks: ["AC", "Modular Kitchen", "Parking"] }
      ]
    }
  ],
  Sambhajinagar: [
    {
      name: "CIDCO",
      rooms: [
        { title: "CIDCO N-3 2BHK", type: "Semi-Furnished", price: 13000, size: "2 BHK | 800 sq.ft", address: "N-3, Sector 8, CIDCO, Sambhaji Nagar", nearby: "Prozone Mall", perks: ["Wardrobes", "Lift"] },
        { title: "CIDCO Studio", type: "Budget Rooms", price: 7500, size: "Studio | 300 sq.ft", address: "Sector 4, CIDCO", nearby: "Near Bus Stop", perks: ["Wi-Fi", "Kitchenette"] },
        { title: "CIDCO 3BHK", type: "Fully Furnished", price: 22000, size: "3 BHK | 1150 sq.ft", address: "Plot 21, N-6 CIDCO", nearby: "Railway Station 10 min", perks: ["AC", "Appliances", "Parking"] },
        { title: "CIDCO Market Shop", type: "Shop Rooms", price: 18000, size: "240 sq.ft", address: "Shop 6, CIDCO Market", nearby: "Market frontage", perks: ["Shutter", "Signage"] },
        { title: "CIDCO PG", type: "Budget Rooms", price: 6500, size: "Twin Share | 190 sq.ft", address: "N-2, CIDCO", nearby: "Walk to park", perks: ["Meals", "Housekeeping"] }
      ]
    },
    {
      name: "Waluj",
      rooms: [
        { title: "Waluj 2BHK", type: "Semi-Furnished", price: 11000, size: "2 BHK | 760 sq.ft", address: "Plot 18, Waluj Mahanagar 2", nearby: "MIDC gate", perks: ["Parking", "Geyser"] },
        { title: "Waluj Dorm", type: "Budget Rooms", price: 5500, size: "Single | 180 sq.ft", address: "Sector A, Waluj", nearby: "Industrial area", perks: ["Meals", "Locker"] },
        { title: "Waluj 3BHK", type: "Fully Furnished", price: 19000, size: "3 BHK | 1080 sq.ft", address: "Sector D, Waluj", nearby: "Near HP Chowk", perks: ["AC", "Washer"] },
        { title: "Waluj Highway Shop", type: "Shop Rooms", price: 20000, size: "260 sq.ft", address: "Shop 3, Aurangabad-Jalna Rd", nearby: "Highway frontage", perks: ["Shutter", "Parking"] },
        { title: "Waluj 1BHK", type: "Fully Furnished", price: 9500, size: "1 BHK | 580 sq.ft", address: "Plot 8, Waluj", nearby: "MIDC circle", perks: ["Wardrobe", "Geyser"] }
      ]
    }
  ],
  Dhule: [
    {
      name: "Deopur",
      rooms: [
        { title: "Deopur 2BHK", type: "Semi-Furnished", price: 11000, size: "2 BHK | 810 sq.ft", address: "Flat 201, Shreeram Heights, Deopur", nearby: "Near Gurudwara", perks: ["Lift", "Parking", "Geyser"] },
        { title: "Deopur Studio", type: "Budget Rooms", price: 6500, size: "Studio | 280 sq.ft", address: "Plot 6, Deopur Lane 3", nearby: "Market 3 min", perks: ["Wi-Fi", "Kitchenette"] },
        { title: "Deopur 3BHK", type: "Fully Furnished", price: 18000, size: "3 BHK | 1080 sq.ft", address: "C-3, Green Meadows, Deopur", nearby: "School road", perks: ["AC", "Appliances", "Parking"] },
        { title: "Deopur Shop", type: "Shop Rooms", price: 19000, size: "240 sq.ft", address: "Shop 2, Deopur Main Road", nearby: "High footfall", perks: ["Shutter", "Signage"] },
        { title: "Deopur PG", type: "Budget Rooms", price: 5200, size: "Twin Share | 200 sq.ft", address: "Lane 5, Deopur", nearby: "Bus stop", perks: ["Meals", "Housekeeping"] }
      ]
    },
    {
      name: "MIDC",
      rooms: [
        { title: "MIDC 2BHK", type: "Semi-Furnished", price: 10500, size: "2 BHK | 780 sq.ft", address: "Plot 18, MIDC Rd, Dhule", nearby: "Industrial area", perks: ["Parking", "Geyser"] },
        { title: "MIDC Hostel", type: "Budget Rooms", price: 4800, size: "Single | 190 sq.ft", address: "Sector A, MIDC", nearby: "Factory gate", perks: ["Meals", "Locker"] },
        { title: "MIDC 3BHK", type: "Fully Furnished", price: 16500, size: "3 BHK | 1020 sq.ft", address: "A-4, MIDC Colony", nearby: "Hospital 5 min", perks: ["AC", "Wardrobes"] },
        { title: "MIDC Highway Shop", type: "Shop Rooms", price: 17500, size: "230 sq.ft", address: "Shop 1, Dhule-Malegaon Rd", nearby: "Highway frontage", perks: ["Shutter", "Power"] },
        { title: "MIDC 1BHK", type: "Fully Furnished", price: 9000, size: "1 BHK | 600 sq.ft", address: "Sector B, MIDC", nearby: "College nearby", perks: ["AC", "Wardrobe", "Parking"] }
      ]
    }
  ]
};

const Home = () => {
  const navigate = useNavigate();
  const [searchCity, setSearchCity] = useState("");
  const [selectedCity, setSelectedCity] = useState("Pune");
  const [selectedArea, setSelectedArea] = useState(cityCatalog["Pune"][0].name);
  const [selectedType, setSelectedType] = useState("All");

  useEffect(() => {
    setSelectedArea(cityCatalog[selectedCity][0].name);
  }, [selectedCity]);

  // 🔍 Handle City Search & Redirect to Dashboard
  const handleSearch = (e) => {
    if (e.key === "Enter" && searchCity) {
      navigate(`/dashboard?location=${searchCity}`);
    }
  };

  // 🔹 Quick Navigation to Dashboard with Selected City
  const handleCityClick = (city) => {
    navigate(`/dashboard?location=${city}`);
  };

  const currentArea =
    cityCatalog[selectedCity].find((area) => area.name === selectedArea) ||
    cityCatalog[selectedCity][0];

  const filteredRooms =
    selectedType === "All"
      ? currentArea.rooms
      : currentArea.rooms.filter((room) => room.type === selectedType);

  return (
    <div style={styles.container} className="container-fluid">
      {/* ✅ Search Bar */}
      <div style={styles.searchContainer}>
        <input
          type="text"
          className="form-control"
          placeholder="Search for Rooms or Roommates..."
          value={searchCity}
          onChange={(e) => setSearchCity(e.target.value)}
          onKeyDown={handleSearch} // 🔍 Search on Enter
          style={styles.searchInput}
        />
        <button className="btn" onClick={() => handleSearch({ key: "Enter" })} style={styles.searchButton}>
          <FaSearch />
        </button>
      </div>

{/* ✅ City Links for Quick Navigation */}
<div className="text-center mt-2">
  <span style={styles.cityLinks}>
    {["Pune", "Mumbai", "Nagpur", "Sambhajinagar", "Nashik", "Dhule"].map((city, index, arr) => (
      <span key={city}>
        <button 
          className="btn btn-link p-0 m-0" 
          onClick={() => handleCityClick(city)} 
          style={styles.cityLink}
        >
          {city}
        </button>
        {index !== arr.length - 1 && ", "} {/* ✅ Add comma between cities, except last one */}
      </span>
    ))}
  </span>
</div>


      {/* ✅ Animated Heading */}
      <h1 style={styles.animatedHeading}>
        <span style={styles.textSeaGreen}>Find Your Perfect</span> <span style={styles.textPink}>Roommate</span> <span style={styles.textBlack}>Easily!</span>
      </h1>

      {/* ✅ Centered Image */}
      <div className="text-center">
        <img src={HomeImage} alt="Home" style={styles.imageCentered} />
      </div>

      {/* ✅ Left: Text Content | Right: Image */}
      <div className="row align-items-center mt-5">
        {/* Left Side - Text Content */}
        <div className="col-lg-6 text-center text-lg-start">
          <h2 style={styles.leftHeading}>Effortless Flat Hunting</h2>
          <p style={styles.text}>
            Discover the best Rooms and roommates in your city with our easy-to-use platform. Hassle-free connections and verified listings ensure a smooth experience!
          </p>
        </div>

        {/* Right Side - Image */}
        <div className="col-lg-6 text-center">
          <img src={HomeImage3} alt="Home3" style={styles.imageRight} />
        </div>
      </div>

      {/* ✅ "View Rooms in Popular Cities" Section */}
      <div className="container text-center mt-4 ">
      <h1 className="fw-bold mb-3" style={{ color: "#20b2aa" }}>
    View Rooms in Popular Cities
  </h1>
  <br/>
  <br/>
        <div className="row g-4">
          {[
            { city: "Pune", img: puneImage },
            { city: "Mumbai", img: mumbaiImage },
            { city: "Nagpur", img: nagpurImage },
            { city: "Nashik", img: nashikImage },
            { city: "Sambhajinagar", img: sambhajinagarImage },
            { city: "Dhule", img: dhuleImage },
          ].map(({ city, img }) => (
            <div key={city} className="col-12 col-sm-6 col-md-4 d-flex">
              <div className="bg-white rounded-3 shadow-sm p-2 w-100 d-flex flex-column align-items-center">
                <img
                  src={img}
                  alt={city}
                  className="w-100"
                  style={styles.popularCityImage}
                  onClick={() => handleCityClick(city)}
                />
                <h5 className="mt-2 mb-1">{city}</h5>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* City & Area based room explorer */}
      <section className="container mt-5">
        <div style={exploreStyles.wrapper} className="row g-4">
          {/* City + filters column */}
          <div className="col-lg-3">
            <div style={exploreStyles.panel}>
              <h5 className="mb-3">Select a city</h5>
              <div className="d-flex flex-column gap-2">
                {Object.keys(cityCatalog).map((city) => (
                  <button
                    key={city}
                    className="btn text-start"
                    style={{
                      ...exploreStyles.chip,
                      backgroundColor: selectedCity === city ? "#20b2aa" : "#f1f5f9",
                      color: selectedCity === city ? "white" : "#0f172a",
                      borderColor: selectedCity === city ? "#20b2aa" : "#e2e8f0"
                    }}
                    onClick={() => setSelectedCity(city)}
                  >
                    {city}
                  </button>
                ))}
              </div>

              <h6 className="mt-4 mb-2">Room types</h6>
              <div className="d-flex flex-wrap gap-2">
                {["All", "Fully Furnished", "Semi-Furnished", "Budget Rooms", "Shop Rooms"].map((type) => (
                  <button
                    key={type}
                    className="btn"
                    style={{
                      ...exploreStyles.pill,
                      backgroundColor: selectedType === type ? "#ff7a9e" : "#fff",
                      color: selectedType === type ? "#fff" : "#0f172a",
                      borderColor: selectedType === type ? "#ff7a9e" : "#e2e8f0"
                    }}
                    onClick={() => setSelectedType(type)}
                  >
                    {type}
                  </button>
                ))}
              </div>

              <div className="mt-4 p-3 rounded" style={{ background: "#f8fafc", border: "1px solid #e2e8f0" }}>
                <p className="mb-1"><strong>Need 5+ options?</strong></p>
                <p className="mb-0 small text-muted">Each area already lists five ready-to-book rooms. Switch city or type to explore more.</p>
              </div>
            </div>
          </div>

          {/* Area + cards */}
          <div className="col-lg-9">
            <div style={exploreStyles.areaHeader} className="mb-3">
              <div>
                <p className="mb-1 text-muted">{selectedCity}</p>
                <h4 className="mb-2">Area-wise rooms</h4>
                <div className="d-flex flex-wrap gap-2">
                  {cityCatalog[selectedCity].map((area) => (
                    <button
                      key={area.name}
                      className="btn"
                      style={{
                        ...exploreStyles.pill,
                        backgroundColor: selectedArea === area.name ? "#0ea5e9" : "#fff",
                        color: selectedArea === area.name ? "#fff" : "#0f172a",
                        borderColor: selectedArea === area.name ? "#0ea5e9" : "#e2e8f0"
                      }}
                      onClick={() => setSelectedArea(area.name)}
                    >
                      {area.name} <span className="badge text-bg-light ms-1">{area.rooms.length} rooms</span>
                    </button>
                  ))}
                </div>
              </div>
              <div className="text-end">
                <p className="mb-0 fw-semibold">{filteredRooms.length} of {currentArea.rooms.length} options</p>
                <small className="text-muted">Showing at least five choices per area by default.</small>
              </div>
            </div>

            <div className="row g-3">
              {filteredRooms.map((room, idx) => (
                <div className="col-md-6 col-xl-4" key={room.title + room.price + idx}>
                  <div style={exploreStyles.card} className="shadow-sm">
                    <img
                      src={room.image || roomImages[idx % roomImages.length] || cityImages[selectedCity]}
                      alt={`${room.title} ${selectedCity}`}
                      style={exploreStyles.roomImage}
                    />
                    <div className="d-flex justify-content-between align-items-start mb-2">
                      <h6 className="mb-0">{room.title}</h6>
                      <span style={exploreStyles.typeBadge}>{room.type}</span>
                    </div>
                    <p className="mb-1 text-muted">{selectedArea}, {selectedCity}</p>
                    <p className="fw-bold mb-1">Rs {room.price.toLocaleString()}/mo</p>
                    <p className="mb-1"><strong>Location:</strong> {selectedCity}</p>
                    <p className="mb-1"><strong>Area:</strong> {selectedArea}</p>
                    <p className="mb-1"><strong>Address:</strong> {room.address || `${room.title}, ${selectedArea}, ${selectedCity}`}</p>
                    <p className="mb-2"><strong>Nearby:</strong> {room.nearby || "Near markets, transit and daily essentials"}</p>
                    <p className="mb-2">{room.size}</p>
                    <div className="d-flex flex-wrap gap-2">
                      {room.perks.map((perk) => (
                        <span key={perk} className="badge text-bg-light border">{perk}</span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};

// ✅ Inline Styles (Bootstrap + Custom Animations)
const styles = {
  container: {
    padding: "50px 10px",
    textAlign: "center",
  },

  // ✅ Search Bar Container
  searchContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    maxWidth: "600px",
    margin: "0 auto 30px",
    border: "2px solid #20b2aa",
    borderRadius: "30px",
    overflow: "hidden",
  },
  searchInput: {
    flex: 1,
    border: "none",
    padding: "12px",
    fontSize: "16px",
    outline: "none",
  },
  searchButton: {
    backgroundColor: "#20b2aa",
    color: "white",
    padding: "12px 12px",
    border: "none",
    borderRadius: "0 30px 30px 0",
    cursor: "pointer",
  },

  // ✅ City Links for Quick Navigation
  // ✅ Animated Heading
  animatedHeading: {
    fontSize: "3rem",
    fontWeight: "bold",
    textTransform: "uppercase",
    letterSpacing: "2px",
    animation: "fadeIn 1.5s ease-in-out",
    marginTop: "90px",
  },
  textSeaGreen: { color: "#20b2aa", fontWeight: "bold" },
  textPink: { color: "rgb(219,112,147)", fontWeight: "bold" },
  textBlack: { color: "black", fontWeight: "bold" },

  // ✅ Centered Image
  imageCentered: {
    width: "90%",
    height: "90%",
    maxWidth: "900px",
  },

  // ✅ Left Side Heading
  leftHeading: {
    fontSize: "3rem",
    fontWeight: "bold",
    color: "#20b2aa",
    marginLeft: "20%",
  },
  text: {
    fontSize: "1.2rem",
    color: "black",
    fontWeight: "400",
    marginLeft: "10%",
  },

  // ✅ Right Side Image
  imageRight: {
    width: "100%",
    maxWidth: "550px",
    height: "auto",
  },
  cityLinks: {
    fontSize: "16px",
    color: "#20b2aa", // ✅ Default text color
  },
  cityLink: {
    textDecoration: "none",
    color: "#20b2aa", // ✅ Remove bold effect & keep default color
    background: "none",
    border: "none",
    cursor: "pointer",
    fontSize: "16px",
    padding: "0 2px", // ✅ Minimize space between city names
  },
  popularCityImage: {
    cursor: "pointer",
    width: "100%",
    height: "200px",       // uniform height across all cards
    objectFit: "cover",    // crop without distortion
    borderRadius: "12px",
    display: "block",
  },

  // ✅ Responsive Design
  "@media (max-width: 768px)": {
    imageCentered: { width: "80%" },
    animatedHeading: { fontSize: "2.5rem" },
    leftHeading: { fontSize: "1.8rem" },
    text: { fontSize: "1rem" },
  },
  "@media (max-width: 480px)": {
    imageCentered: { width: "90%" },
    animatedHeading: { fontSize: "2rem" },
    leftHeading: { fontSize: "1.6rem" },
    text: { fontSize: "0.9rem" },
  },
};

const exploreStyles = {
  wrapper: {
    background: "linear-gradient(135deg, #f8fafc 0%, #eef2ff 50%, #fdf2f8 100%)",
    padding: "24px",
    borderRadius: "18px",
    border: "1px solid #e2e8f0",
  },
  panel: {
    background: "#fff",
    borderRadius: "14px",
    border: "1px solid #e2e8f0",
    padding: "18px",
    boxShadow: "0 10px 30px rgba(15, 23, 42, 0.05)",
  },
  chip: {
    borderRadius: "12px",
    border: "1px solid #e2e8f0",
    padding: "10px 12px",
    fontWeight: 600,
  },
  pill: {
    borderRadius: "999px",
    border: "1px solid #e2e8f0",
    padding: "8px 14px",
    fontWeight: 600,
  },
  areaHeader: {
    background: "#fff",
    borderRadius: "14px",
    border: "1px solid #e2e8f0",
    padding: "14px 18px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    boxShadow: "0 10px 30px rgba(15, 23, 42, 0.05)",
  },
  card: {
    background: "#fff",
    borderRadius: "14px",
    border: "1px solid #e2e8f0",
    padding: "16px",
    minHeight: "180px",
  },
  roomImage: {
    width: "100%",
    height: "140px",
    objectFit: "cover",
    borderRadius: "10px",
    marginBottom: "10px",
  },
  typeBadge: {
    background: "#e0f2fe",
    color: "#0369a1",
    borderRadius: "999px",
    padding: "6px 12px",
    fontSize: "12px",
    fontWeight: 700,
  },
};

export default Home;
