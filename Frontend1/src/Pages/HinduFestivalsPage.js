import React from "react";
import { useNavigate } from "react-router-dom";
import "./HinduFestivalsPage.css";
import mandala from '../Assets/mandalaright-removebg-preview.png';
import ganpati from '../Assets/ganpati.jpeg';
import makar from '../Assets/makar.jpeg';
import diwali from '../Assets/diwali.jpeg';
import onam from '../Assets/onam.jpeg';
import bandhan from '../Assets/bandhan.jpeg';
import ram from '../Assets/ram.jpeg';
import shiv from '../Assets/shiv.jpeg';
import krishna from '../Assets/krishna.jpeg';
import holi from '../Assets/holi.jpeg';
import Panchami from '../Assets/panchami.jpeg';
import teej from '../Assets/teej.jpeg';
import ekadashi from '../Assets/ekadashi.jpeg';
import karva from '../Assets/karva.jpeg';
import gauri from '../Assets/gauri.jpeg';
import gudi from '../Assets/gudi.jpeg';


const festivals = [
  {
    id: "makarsankranti",
    name: "Makar Sankranti",
    img: makar ,
    desc:
      "This holy festival Makar Sankranti is dedicated to the worshipping of the Sun God Surya for success..."
  },
  {
    id: "sankashti",
    name: "Sankashti Chaturthi",
    img: ganpati,
    desc:
      "Sankashti Shri Ganesh Chaturthi is a significant day dedicated to Lord Ganesha..."
  },
  {
    id: "basant",
    name: "Basant Panchami",
    img: Panchami,
    desc:
      "As per Hindu beliefs Maa Saraswati the deity of learning, music and art was born on this day..."
  },
  {
    id: "shivratri",
    name: "Mahashivratri",
    img: shiv,
    desc:
      "Maha Shivaratri is the birthday of Lord Shiva and celebrated on the 6th night of the dark Phalgun..."
  },
  {
    id: "holi",
    name: "Dhulivandan Holi",
    img: holi,
    desc:
      "Holi is a popular and significant Hindu festival celebrated as the Festival of Colours, Love..."
  },
  {
    id: "janmashtami",
    name: "Jamnashtami",
    img: krishna,
    desc:
      "Celebrates the birth of Lord Krishna and his divine teachings..."
  },
  {
    id: "dasra",
    name: "Dussehra",
    img: ram,
    desc:
      "Symbolizes the victory of good over evil and righteousness over injustice..."
  },
  {
    id: "onam",
    name: "Onam",
    img: onam,
    desc:
      "Harvest festival of Kerala celebrating culture, unity, and King Mahabali’s return..."
  },
  {
    id: "diwali",
    name: "Diwali",
    img: diwali,
    desc:
      "Festival of lights celebrating happiness, prosperity, and spiritual victory..."
  },
  {
    id: "raksha",
    name: "Raksha Bandhan",
    img: bandhan,
    desc:
      "Celebrates the sacred bond of love and protection between siblings..."
  },
    {
    id: "gudi",
    name: "Gudhi Padwa",
    img: gudi,
    desc:
      "Marks the Marathi New Year and symbolizes victory and new beginnings..."
  },
  {
    id: "tij",
    name: "Teej",
    img: teej,
    desc:
      "Celebrated by women for marital happiness and devotion to Lord Shiva and Goddess Parvati..."
  },
  {
    id: "Karva",
    name: "Karva-chauth",
    img: karva,
    desc:
      "Karva Chauth – Married women fast for the long life and well-being of their husbands..."
  },
  {
    id: "ekadashi",
    name: "Ashadhi Ekadashi",
    img: ekadashi,
    desc:
      "Ashadi Ekadashi – Dedicated to Lord Vitthal, celebrated with devotion and Pandharpur Wari pilgrimage..."
  },
  {
    id: "gauri",
    name: "Gauri Aavahan",
    img: gauri,
    desc:
      "Welcoming Goddess Gauri for prosperity, happiness, and marital bliss..."
  },
];

const HinduFestivalsPage = () => {
  const navigate = useNavigate();

  return (

      <div className="home-container">

      <img src={mandala} alt="mandala" className="home-mandala-left" />
      <img src={mandala} alt="mandala" className="home-mandala" />
          <div className="festival-wrapper">
      <h1 className="festival-heading">Important Hindu Festivals</h1>

      <div className="festival-grid">
        {festivals.map((f) => (
          <div className="festival-card" key={f.id}>
            <img src={f.img} alt={f.name} />
            <h3>{f.name}</h3>
            <p>{f.desc}</p>

            <button onClick={() => navigate(`/festival/${f.id}`)}>
              Show More →
            </button>
          </div>
        ))}
      </div>
    </div>
    </div>
  );
};

export default HinduFestivalsPage;
