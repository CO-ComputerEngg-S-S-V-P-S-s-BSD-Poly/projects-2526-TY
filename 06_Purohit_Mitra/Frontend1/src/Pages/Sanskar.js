import React, { useState } from "react";
import "./Sanskar.css";

import mandala from "../Assets/mandalaright-removebg-preview.png";

import garbh from "../Assets/1.jpeg";
import puns from "../Assets/2.jpeg";
import sann from "../Assets/3.jpeg";
import jaat from "../Assets/4.jpeg";
import naam from "../Assets/5.jpeg";
import nish from "../Assets/6.jpeg";
import ann from "../Assets/7.jpeg";
import chuda from "../Assets/8.jpeg";
import karn from "../Assets/9.jpeg";
import vidya from "../Assets/10.jpeg";
import upnan from "../Assets/11.jpeg";
import veda from "../Assets/12.jpeg";
import keshant from "../Assets/13.jpeg";
import samv from "../Assets/14.jpeg";
import vivah from "../Assets/15.jpeg";
import ante from "../Assets/16.jpeg";

const SanskarPage = () => {

  const [isOpen, setIsOpen] = useState(false);
  const [currentData, setCurrentData] = useState(null);

  const sanskars = [
    {
      title: "Garbhadhan Sanskar",
      description: "Performed for conception with pure spiritual intentions.",
      details: "Garbh Sanskar is one of the 16 sanskars prescribed for human beings. It helps in the physical and mental development of the child even before birth.",
      image: garbh
    },
    {
      title: "Punsavan Sanskar",
      description: "Performed after conception for baby's healthy development.",
      details: "Pumsavana Sanskar is the second of the 16 samskaras performed during pregnancy to pray for the healthy development of the baby.",
      image: puns
    },
    {
      title: "Seemantonnayan Sanskar",
      description: "For protection of mother and unborn child.",
      details: "Simantonnayana Sanskar is performed during the last trimester of pregnancy for the safety of mother and baby.",
      image: sann
    },
    {
      title: "Jatakarma Sanskar",
      description: "Performed immediately after birth.",
      details: "Jatakarma Sanskar is performed right after the birth of the child to welcome the newborn into the world.",
      image: jaat
    },
    {
      title: "Namkaran Sanskar",
      description: "Naming ceremony of newborn child.",
      details: "Namkaran Sanskar is the naming ceremony usually performed on the 10th or 12th day after birth.",
      image: naam
    },
    {
      title: "Nishkraman Sanskar",
      description: "Baby's first outing ritual.",
      details: "Nishkramana Sanskar marks the first time the child is taken outside the house and shown the sun.",
      image: nish
    },
    {
      title: "Annaprashan Sanskar",
      description: "First intake of solid food ceremony.",
      details: "Annaprashan Sanskar marks the first time the baby eats solid food, usually rice.",
      image: ann
    },
    {
      title: "Chudakarma Sanskar",
      description: "First head shaving ceremony.",
      details: "Chudakarma Sanskar or Mundan is performed to remove impure hair from birth and promote purity and growth.",
      image: chuda
    },
    {
      title: "Karnavedha Sanskar",
      description: "Ear piercing ceremony.",
      details: "Karnavedha Sanskar is the traditional ear piercing ritual for children.",
      image: karn
    },
    {
      title: "Vidyarambh Sanskar",
      description: "Beginning of formal education.",
      details: "Vidyarambh Sanskar marks the beginning of a child's formal education.",
      image: vidya
    },
    {
      title: "Upanayan Sanskar",
      description: "Sacred thread ceremony.",
      details: "Upanayan Sanskar marks the start of spiritual education and disciplined life.",
      image: upnan
    },
    {
      title: "Vedarambha Sanskar",
      description: "Start of Vedic studies.",
      details: "Vedarambha Sanskar marks the beginning of Vedic learning under a Guru.",
      image: veda
    },
    {
      title: "Keshant Sanskar",
      description: "First shaving in adolescence.",
      details: "Keshant Sanskar is performed around age 16 and marks the transition to adulthood.",
      image: keshant
    },
    {
      title: "Samavartan Sanskar",
      description: "Completion of education ceremony.",
      details: "Samavartan Sanskar marks the completion of education and end of Brahmacharya stage.",
      image: samv
    },
    {
      title: "Vivah Sanskar",
      description: "Sacred Hindu marriage ceremony.",
      details: "Vivah Sanskar is the sacred marriage ritual that unites two individuals and families.",
      image: vivah
    },
    {
      title: "Antyeshti Sanskar",
      description: "Final rites after death.",
      details: "Antyeshti Sanskar is the final ritual performed after death, usually involving cremation.",
      image: ante
    }
  ];

  const openModal = (item) => {
    setCurrentData(item);
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  return (
    <div className="sanskar-page">

      <h1 className="page-title">16 Sanskars</h1>

      <img src={mandala} alt="mandala" className="home-mandala-left" />
      <img src={mandala} alt="mandala" className="home-mandala" />

      <div className="card-container">
        {sanskars.map((item, index) => (
          <div className="card" key={index}>

            <img src={item.image} alt={item.title} className="card-image" />

            <div className="card-body">
              <h3>{item.title}</h3>
              <p>{item.description}</p>

              <button
                className="view-btn"
                onClick={() => openModal(item)}
              >
                View Details
              </button>

            </div>
          </div>
        ))}
      </div>

      {isOpen && currentData && (
        <div className="modal-overlay">

          <div className="modal-box">

            <span className="close-btn" onClick={closeModal}>✖</span>

            <img
              src={currentData.image}
              alt={currentData.title}
              className="modal-image"
            />

            <h2>{currentData.title}</h2>

            <p>{currentData.details}</p>

          </div>

        </div>
      )}

    </div>
  );
};

export default SanskarPage;