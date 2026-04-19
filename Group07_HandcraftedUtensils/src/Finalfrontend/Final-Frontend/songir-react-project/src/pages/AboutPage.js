import React, { useEffect } from 'react';
import styled, { keyframes, createGlobalStyle, css } from 'styled-components';
import { useNavigate } from 'react-router-dom';
import {
  MapPin, Clock, Users, Award, Hammer, BookOpen,
  ExternalLink, ChevronRight, Shield, Star, Globe,
  Mountain, Landmark, Navigation, Castle, Heart, Layers
} from 'lucide-react';

/* ══════════════════════════════════════════════
   LOCAL ASSET IMPORTS — teri Assets folder se
══════════════════════════════════════════════ */
import artisanCrafting  from '../Assets/artisan-crafting.png';   // Hero background
import artisans         from '../Assets/artisans.jpg';          // Story section + Community
import songirFort       from '../Assets/Songirfort.jpeg';         // Fort section (all 3 cards)
import lota             from '../Assets/lota.jpeg';               // Materials — Brass
import coppertan        from '../Assets/Coppertan.webp.jpeg';         // Materials — Copper
import designerglass    from '../Assets/designerglass.jpeg';      // Materials — German Silver
import cookware         from '../Assets/Cookware.jpeg';           // Pillars — Legacy card
import kadhai           from '../Assets/Kadhai.jpeg';             // Process — Raising/Forming
import pujathali        from '../Assets/Pujathali.jpeg';          // Pillars — Sacred Kalash
import bowl             from '../Assets/bowl.webp.jpeg';              // Process — Raw Material
import bowl1            from '../Assets/bowl1.jpeg';              // Process — Finishing
import Teapan           from '../Assets/Teapan.jpeg';             // Research section image
import Shopkeeper       from '../Assets/Shopkeper.jpeg';          // Pillars — Community card
import Fort1  from "../Assets/Fort1.webp";
import  Fort2 from "../Assets/Fort2.jpg";

/* ══════════════════════════════════════════════
   GLOBAL — fonts via useEffect link injection
   (DO NOT use @import inside createGlobalStyle)
══════════════════════════════════════════════ */
const GlobalStyle = createGlobalStyle`
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
`;

/* ══════════════════════════════════════════════
   KEYFRAMES
══════════════════════════════════════════════ */
const fadeUp    = keyframes`from{opacity:0;transform:translateY(40px)}to{opacity:1;transform:translateY(0)}`;
const fadeLeft  = keyframes`from{opacity:0;transform:translateX(-60px)}to{opacity:1;transform:translateX(0)}`;
const fadeRight = keyframes`from{opacity:0;transform:translateX(60px)}to{opacity:1;transform:translateX(0)}`;
const shimmerKf = keyframes`0%{background-position:-200% center}100%{background-position:200% center}`;
const pulseKf   = keyframes`0%,100%{box-shadow:0 0 0 0 rgba(255,215,0,0.5)}60%{box-shadow:0 0 0 14px rgba(255,215,0,0)}`;
const pinKf     = keyframes`0%,100%{transform:translate(-50%,-110%) scale(1)}50%{transform:translate(-50%,-125%) scale(1.1)}`;
const lineKf    = keyframes`from{height:0;opacity:0}to{height:100%;opacity:1}`;

/* css snippets — safe keyframe interpolation */
const animFadeLeft  = css`animation:${fadeLeft}  1.1s cubic-bezier(0.22,1,0.36,1) both;`;
const animFadeRight = css`animation:${fadeRight} 1s ease both;`;
const animFadeUp    = css`animation:${fadeUp}    1s 1.8s both;`;
const animShimmer   = css`animation:${shimmerKf} 5s linear infinite;`;
const animPulse     = css`animation:${pulseKf}   3s ease infinite;`;
const animPin       = css`animation:${pinKf}     3s ease-in-out infinite;`;
const animLine      = css`animation:${lineKf}    1.5s ease both;`;

/* ══════════════════════════════════════════════
   DESIGN TOKENS
══════════════════════════════════════════════ */
const C = {
  bg:      '#faf7f2',
  bg2:     '#f2ebe0',
  cream:   '#fff9f0',
  brown:   '#2d1a12',
  copper:  '#B87333',
  copperL: '#d4895a',
  gold:    '#FFD700',
  goldD:   '#e6b800',
  text:    '#3d2b1a',
  muted:   '#8a7560',
  border:  'rgba(184,115,51,0.18)',
};

/* ══════════════════════════════════════════════
   REAL SONGIR COORDINATES
   Songir village, Dhule district, Maharashtra
   Lat: 21.0167 N  |  Lng: 74.5833 E
══════════════════════════════════════════════ */
const LAT    = 21.0167;
const LNG    = 74.5833;
const BBOX   = `${LNG-0.06},${LAT-0.04},${LNG+0.06},${LAT+0.04}`;
const EMBED  = `https://www.openstreetmap.org/export/embed.html?bbox=${BBOX}&layer=mapnik&marker=${LAT},${LNG}`;
const MAPLINK= `https://www.openstreetmap.org/?mlat=${LAT}&mlon=${LNG}#map=14/${LAT}/${LNG}`;

/* ══════════════════════════════════════════════
   SHARED LAYOUT
══════════════════════════════════════════════ */
const Page = styled.div`
  background:${C.bg};
  min-height:100vh;
  margin-top:0;
  font-family:'DM Sans',-apple-system,sans-serif;
  overflow-x:hidden;
  color:${C.text};
`;
const Wrap = styled.div`max-width:1200px;margin:0 auto;padding:0 2rem;`;
const SecLabel = styled.span`
  display:inline-flex;align-items:center;gap:0.5rem;
  background:${C.copper};color:#fff;
  padding:0.4rem 1.1rem;border-radius:40px;
  font-size:0.75rem;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;
  margin-bottom:1rem;
`;
const Display = styled.h2`
  font-family:'Cormorant Garamond',serif;
  font-size:clamp(2.2rem,4vw,3.2rem);font-weight:700;
  color:${C.brown};line-height:1.15;margin-bottom:0.5rem;
  &::after{
    content:'';display:block;width:56px;height:3px;margin-top:14px;
    background:linear-gradient(90deg,${C.copper},${C.gold});border-radius:2px;
  }
`;
const BodyText = styled.p`font-size:1.05rem;line-height:1.85;color:${C.muted};margin-bottom:1.1rem;`;

/* ══════════════════════════════════════════════
   HERO — artisanCrafting.png as background
══════════════════════════════════════════════ */
const HeroSection = styled.section`
  position:relative;
  height:100vh;
  min-height:720px;
  background:#0e0805;
  overflow:hidden;

`;
/* Use <img> tag for hero bg — avoids CSS interpolation issues with imported images */
const HeroBgImg = styled.img`
  position:absolute;inset:0;width:100%;height:100%;
  object-fit:cover;object-position:center;
  opacity:0.55;z-index:0;
`;
const HeroGlow = styled.div`
  position:absolute;inset:0;z-index:1;
  background: linear-gradient(
    105deg,
    rgba(13,6,2,0.82) 0%,
    rgba(13,6,2,0.60) 40%,
    rgba(13,6,2,0.15) 100%
  );
`;
const HeroFade = styled.div`
  position:absolute;bottom:0;left:0;right:0;height:220px;z-index:1;
  background:linear-gradient(to top,${C.bg},transparent);
`;
const HeroInner = styled.div`
  position:relative;
  z-index:2;
  max-width:1200px;
  margin:0 auto;
  padding:0 2rem;
  height:100%;
  display:flex;
  align-items:center;
`;

const HeroContent = styled.div`max-width:720px;${animFadeLeft}`;
const HeroBadge = styled.div`
  display:inline-flex;align-items:center;gap:0.5rem;
  border:1px solid rgba(255,215,0,0.35);background:rgba(255,215,0,0.1);
  color:${C.gold};backdrop-filter:blur(6px);
  padding:0.5rem 1.2rem;border-radius:40px;
  font-size:0.8rem;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;
  margin-bottom:2rem;
`;
const HeroTitle = styled.h1`
  font-family:'Cormorant Garamond',serif;
  font-size:clamp(4rem,8vw,7rem);font-weight:700;line-height:0.95;color:#fff;
  .shine{
    display:block;
    background:linear-gradient(135deg,${C.gold} 0%,${C.copperL} 40%,${C.gold} 80%);
    background-size:200% auto;
    -webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;
    ${animShimmer}
  }
  .sub{
    display:block;font-size:clamp(1rem,2vw,1.5rem);font-weight:400;font-style:italic;
    color:rgba(255,255,255,0.55);-webkit-text-fill-color:rgba(255,255,255,0.55);margin-top:0.8rem;
  }
`;
const HeroDesc = styled.p`
  font-size:clamp(1rem,1.5vw,1.15rem);line-height:1.8;
  color:rgba(255,255,255,0.7);margin:2rem 0 2.5rem;max-width:580px;
`;
const HeroPills = styled.div`display:flex;gap:1rem;flex-wrap:wrap;margin-bottom:2.5rem;`;
const Pill = styled.div`
  display:flex;align-items:center;gap:0.6rem;
  background:rgba(255,255,255,0.07);border:1px solid rgba(255,255,255,0.1);
  backdrop-filter:blur(8px);padding:0.6rem 1.2rem;border-radius:40px;
  font-size:0.88rem;color:#fff;
  svg{color:${C.gold};width:16px;}strong{font-weight:700;}span{opacity:0.65;}
`;
const BtnRow = styled.div`display:flex;gap:1rem;flex-wrap:wrap;`;
const BtnPrimary = styled.button`
  display:inline-flex;align-items:center;gap:0.55rem;
  background:${C.gold};color:#1a1a1a;border:none;
  padding:0.9rem 2.2rem;border-radius:40px;
  font-weight:700;font-size:0.95rem;cursor:pointer;transition:all 0.3s;
  ${animPulse}
  &:hover{background:${C.goldD};transform:translateY(-2px);box-shadow:0 14px 30px rgba(255,215,0,0.3);}
`;
const BtnSecondary = styled.button`
  display:inline-flex;align-items:center;gap:0.55rem;
  background:transparent;border:2px solid rgba(255,255,255,0.25);
  color:#fff;padding:0.9rem 2.2rem;border-radius:40px;
  font-weight:600;font-size:0.95rem;cursor:pointer;transition:all 0.3s;
  &:hover{border-color:${C.gold};background:rgba(255,215,0,0.1);}
`;
const BtnLight = styled.button`
  display:inline-flex;align-items:center;gap:0.55rem;
  background:transparent;border:2px solid ${C.border};
  color:${C.brown};padding:0.9rem 2.2rem;border-radius:40px;
  font-weight:600;font-size:0.95rem;cursor:pointer;transition:all 0.3s;
  &:hover{border-color:${C.copper};background:rgba(184,115,51,0.06);}
`;
const ScrollHint = styled.div`
  position:absolute;bottom:2.5rem;left:50%;transform:translateX(-50%);
  z-index:3;display:flex;flex-direction:column;align-items:center;gap:8px;
  color:rgba(255,255,255,0.35);font-size:0.68rem;letter-spacing:0.3em;text-transform:uppercase;
  ${animFadeUp}
  &::after{content:'';width:1px;height:48px;background:linear-gradient(to bottom,rgba(255,215,0,0.6),transparent);}
`;

/* ══════════════════════════════════════════════
   STORY — artisans.jpeg as right image
          bowl.webp as story img (brass products)
══════════════════════════════════════════════ */
const StorySection = styled.section`padding:7rem 2rem;`;
const StoryGrid = styled.div`
  display:grid;grid-template-columns:1.1fr 0.9fr;gap:6rem;align-items:center;
  @media(max-width:860px){grid-template-columns:1fr;gap:3rem;}
`;
const StoryLeft  = styled.div`${animFadeLeft}`;
const StoryRight = styled.div`${animFadeRight}`;
const StoryQuote = styled.blockquote`
  font-family:'Cormorant Garamond',serif;font-size:1.4rem;font-style:italic;
  color:${C.brown};line-height:1.65;border-left:4px solid ${C.copper};padding-left:1.5rem;margin:2rem 0;
`;
const StoryImgWrap = styled.div`
  position:relative;border-radius:24px;overflow:hidden;
  box-shadow:0 30px 80px rgba(139,90,43,0.2);
  &::before{content:'';position:absolute;inset:0;z-index:1;background:linear-gradient(135deg,rgba(184,115,51,0.15),transparent 60%);}
`;
const StoryImg     = styled.img`width:100%;height:480px;object-fit:cover;display:block;`;
const StoryCaption = styled.div`
  position:absolute;bottom:0;left:0;right:0;z-index:2;
  background:linear-gradient(to top,rgba(30,15,5,0.85),transparent);
  padding:2rem 1.5rem 1.5rem;font-size:0.85rem;color:rgba(255,255,255,0.8);
  display:flex;align-items:center;gap:0.5rem;svg{color:${C.gold};flex-shrink:0;}
`;
const StatsBox  = styled.div`
  display:grid;grid-template-columns:1fr 1fr;gap:1.5px;
  border:1px solid ${C.border};border-radius:20px;overflow:hidden;background:${C.border};margin-top:2.5rem;
`;
const StatCell  = styled.div`
  background:${C.cream};padding:2.2rem 1.8rem;text-align:center;transition:background 0.3s;
  &:hover{background:#fff;}
`;
const StatNum   = styled.div`font-family:'Cormorant Garamond',serif;font-size:2.6rem;font-weight:700;color:${C.copper};line-height:1;margin-bottom:0.3rem;`;
const StatLbl   = styled.div`font-size:0.75rem;font-weight:700;color:${C.muted};text-transform:uppercase;letter-spacing:0.1em;`;

/* ══════════════════════════════════════════════
   PILLARS
   artisanCrafting → Legacy, Shopkeeper → Community
   pujathali → Kalash, Songirfort → Fort
══════════════════════════════════════════════ */
const PillarsSection = styled.section`padding:2rem 2rem 7rem;`;
const PillarsGrid = styled.div`display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:1.5rem;margin-top:3rem;`;
const PillarCard = styled.div`
  background:#fff;border-radius:20px;padding:0;overflow:hidden;
  border:1px solid ${C.border};box-shadow:0 6px 24px rgba(184,115,51,0.06);transition:all 0.35s;
  &:hover{transform:translateY(-6px);box-shadow:0 20px 50px rgba(184,115,51,0.14);border-color:rgba(184,115,51,0.35);}
`;
const PillarImg  = styled.div`
  width:100%;height:160px;overflow:hidden;
  img{width:100%;height:100%;object-fit:cover;transition:transform 0.5s;}
  ${PillarCard}:hover & img{transform:scale(1.06);}
`;
const PillarBody  = styled.div`padding:1.4rem 1.5rem;`;
const PillarIcon  = styled.div`font-size:1.6rem;margin-bottom:0.6rem;`;
const PillarTitle = styled.h3`font-size:1.05rem;font-weight:700;color:${C.brown};margin-bottom:0.4rem;`;
const PillarText  = styled.p`font-size:0.87rem;line-height:1.65;color:${C.muted};`;

/* ══════════════════════════════════════════════
   PROCESS — DARK
   bowl → Raw Material, kadhai → Annealing
   artisans → Raising/Forming, bowl1 → Finishing
══════════════════════════════════════════════ */
const ProcessSec = styled.section`
  background:linear-gradient(135deg,#150a02 0%,#2d1a12 100%);
  padding:7rem 2rem;position:relative;overflow:hidden;
  &::before{content:'';position:absolute;top:-1px;left:0;right:0;height:80px;background:${C.bg};clip-path:ellipse(55% 100% at 50% 0%);}
  &::after{content:'';position:absolute;bottom:-1px;left:0;right:0;height:80px;background:${C.bg};clip-path:ellipse(55% 100% at 50% 100%);}
`;
const DarkH2  = styled.h2`font-family:'Cormorant Garamond',serif;font-size:clamp(2.2rem,4vw,3rem);font-weight:700;color:#fff;text-align:center;margin-bottom:0.8rem;`;
const DarkSub = styled.p`text-align:center;color:rgba(255,255,255,0.45);max-width:500px;margin:0 auto 3.5rem;font-size:1rem;line-height:1.7;`;
const ProcessGrid = styled.div`display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:1.5rem;`;
const ProcessCard = styled.div`
  border-radius:20px;overflow:hidden;background:rgba(255,255,255,0.04);
  border:1px solid rgba(255,255,255,0.08);transition:all 0.35s;
  &:hover{background:rgba(255,255,255,0.08);border-color:rgba(255,215,0,0.25);transform:translateY(-5px);}
`;
const ProcessImgWrap = styled.div`
  height:180px;overflow:hidden;position:relative;
  img{width:100%;height:100%;object-fit:cover;opacity:0.7;transition:all 0.5s;}
  ${ProcessCard}:hover & img{opacity:0.9;transform:scale(1.05);}
  &::after{content:'';position:absolute;inset:0;background:linear-gradient(to top,rgba(21,10,2,0.9),transparent 60%);}
`;
const ProcessNum   = styled.div`position:absolute;top:1rem;left:1.2rem;z-index:1;font-family:'Cormorant Garamond',serif;font-size:3rem;font-weight:700;color:rgba(255,215,0,0.5);line-height:1;`;
const ProcessBody  = styled.div`padding:1.5rem 1.6rem;`;
const ProcessIcon  = styled.div`font-size:1.6rem;margin-bottom:0.6rem;`;
const ProcessTitle = styled.h4`font-size:1rem;font-weight:700;color:#ffe4c4;margin-bottom:0.5rem;`;
const ProcessText  = styled.p`font-size:0.86rem;line-height:1.65;color:rgba(255,255,255,0.5);`;

/* ══════════════════════════════════════════════
   MAP — Real Songir Location
══════════════════════════════════════════════ */
const MapSec      = styled.section`padding:7rem 2rem;`;
const MapGrid     = styled.div`display:grid;grid-template-columns:0.9fr 1.1fr;gap:4rem;align-items:start;margin-top:3.5rem;@media(max-width:860px){grid-template-columns:1fr;gap:2.5rem;}`;
const MapInfoList = styled.div`display:flex;flex-direction:column;gap:1rem;`;
const MapInfoItem = styled.div`
  display:flex;gap:1rem;align-items:flex-start;padding:1.1rem 1.3rem;
  background:#fff;border-radius:14px;border:1px solid ${C.border};transition:all 0.3s;
  &:hover{border-color:rgba(184,115,51,0.45);box-shadow:0 6px 22px rgba(184,115,51,0.1);}
  svg{color:${C.copper};flex-shrink:0;margin-top:2px;}
`;
const MapInfoText  = styled.div`h4{font-size:0.85rem;font-weight:700;color:${C.brown};margin-bottom:0.2rem;}p{font-size:0.83rem;color:${C.muted};line-height:1.5;}`;
const MapBox       = styled.div`border-radius:24px;overflow:hidden;border:1px solid ${C.border};box-shadow:0 24px 70px rgba(184,115,51,0.18);position:relative;`;
const MapFrame     = styled.iframe`width:100%;height:420px;border:none;display:block;filter:sepia(10%) contrast(1.05);`;
const MapPin2      = styled.div`position:absolute;top:50%;left:50%;font-size:2.2rem;pointer-events:none;z-index:2;filter:drop-shadow(0 4px 8px rgba(0,0,0,0.5));${animPin}`;
const MapTag       = styled.a`
  position:absolute;bottom:1.2rem;left:1.2rem;right:1.2rem;
  background:rgba(255,255,255,0.97);backdrop-filter:blur(12px);border-radius:14px;padding:1rem 1.3rem;
  display:flex;align-items:center;gap:0.9rem;z-index:2;
  box-shadow:0 4px 20px rgba(0,0,0,0.12);text-decoration:none;transition:all 0.3s;
  &:hover{box-shadow:0 8px 30px rgba(184,115,51,0.2);}svg{color:${C.copper};flex-shrink:0;}
`;
const MapTagInner  = styled.div`strong{font-size:0.9rem;font-weight:700;color:${C.brown};display:block;}span{font-size:0.78rem;color:${C.muted};}`;
const MapCoordBar  = styled.div`
  margin-top:1rem;padding:0.85rem 1.2rem;background:${C.bg2};border-radius:10px;
  font-size:0.82rem;color:${C.muted};display:flex;align-items:center;gap:0.6rem;
  svg{color:${C.copper};flex-shrink:0;}code{font-family:monospace;color:${C.copper};font-weight:600;}
`;

/* ══════════════════════════════════════════════
   TIMELINE
══════════════════════════════════════════════ */
const TimelineSec  = styled.section`padding:7rem 2rem;background:linear-gradient(135deg,${C.bg2} 0%,${C.bg} 100%);`;
const TimelineWrap = styled.div`
  position:relative;margin-top:4rem;padding:1rem 0;
  &::before{
    content:'';position:absolute;left:50%;transform:translateX(-50%);
    width:2px;top:0;bottom:0;background:linear-gradient(to bottom,${C.copper},${C.gold},${C.copper});
    ${animLine}
  }
  @media(max-width:700px){&::before{left:22px;}}
`;
const TItem  = styled.div`
  display:flex;
  justify-content:${p=>p.$r?'flex-start':'flex-end'};
  padding:${p=>p.$r?'0 0 2.5rem calc(50% + 40px)':'0 calc(50% + 40px) 2.5rem 0'};
  @media(max-width:700px){padding:0 0 2rem 52px !important;justify-content:flex-start !important;}
`;
const TCard  = styled.div`
  background:#fff;border-radius:18px;padding:1.5rem 1.8rem;
  border:1px solid ${C.border};max-width:330px;width:100%;
  box-shadow:0 4px 18px rgba(184,115,51,0.07);position:relative;transition:all 0.3s;
  &:hover{transform:translateY(-3px);box-shadow:0 14px 40px rgba(184,115,51,0.13);}
`;
const TDot   = styled.div`
  position:absolute;width:18px;height:18px;border-radius:50%;
  background:${C.copper};border:3px solid ${C.bg2};box-shadow:0 0 0 2px ${C.copper};top:50%;
  ${p=>p.$r?'left:-47px;':'right:-47px;'}transform:translateY(-50%);
  @media(max-width:700px){left:-38px !important;right:auto !important;}
`;
const TYear   = styled.div`font-family:'Cormorant Garamond',serif;font-size:1.4rem;font-weight:700;color:${C.copper};margin-bottom:0.3rem;`;
const TTitle  = styled.div`font-size:0.92rem;font-weight:700;color:${C.brown};margin-bottom:0.35rem;`;
const TText   = styled.div`font-size:0.83rem;color:${C.muted};line-height:1.6;`;
const TCenter = styled.div`text-align:center;`;

/* ══════════════════════════════════════════════
   FORT — Songirfort.jpg in all 3 cards
══════════════════════════════════════════════ */
const FortSec       = styled.section`padding:7rem 2rem;`;
const FortCards     = styled.div`display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));gap:2rem;margin-top:3rem;`;
const FortCard      = styled.div`
  background:#fff;border-radius:20px;overflow:hidden;
  border:1px solid ${C.border};box-shadow:0 8px 28px rgba(184,115,51,0.07);transition:all 0.35s;
  &:hover{transform:translateY(-6px);box-shadow:0 24px 56px rgba(184,115,51,0.15);}
`;
const FortCardImg   = styled.div`
  height:210px;overflow:hidden;
  img{width:100%;height:100%;object-fit:cover;transition:transform 0.6s;}
  ${FortCard}:hover & img{transform:scale(1.06);}
`;
const FortCardBody  = styled.div`padding:1.6rem;`;
const FortCardTitle = styled.h3`font-size:1.15rem;font-weight:700;color:${C.brown};margin-bottom:0.5rem;`;
const FortCardText  = styled.p`font-size:0.88rem;line-height:1.65;color:${C.muted};margin-bottom:1rem;`;
const TagRow  = styled.div`display:flex;flex-wrap:wrap;gap:0.4rem;`;
const Tag     = styled.span`background:${C.bg2};color:${C.brown};padding:0.3rem 0.85rem;border-radius:20px;font-size:0.8rem;font-weight:600;`;
const MetaRow = styled.div`display:flex;gap:1rem;color:${C.copper};font-size:0.83rem;font-weight:600;margin-top:0.8rem;align-items:center;svg{width:14px;}`;
const FortStats = styled.div`display:grid;grid-template-columns:repeat(auto-fit,minmax(130px,1fr));gap:1.2rem;margin-top:2.5rem;`;
const FortStat  = styled.div`
  text-align:center;padding:1.8rem 1.2rem;background:#fff;border-radius:14px;border:1px solid ${C.border};
  svg{color:${C.copper};margin-bottom:0.4rem;}
  .v{font-family:'Cormorant Garamond',serif;font-size:2rem;font-weight:700;color:${C.copper};}
  .l{font-size:0.75rem;color:${C.muted};text-transform:uppercase;letter-spacing:0.08em;margin-top:0.2rem;}
`;

/* ══════════════════════════════════════════════
   MATERIALS — lota, coppertan, designerglass
══════════════════════════════════════════════ */
const MatSec  = styled.section`padding:7rem 2rem;background:linear-gradient(135deg,${C.bg2} 0%,${C.bg} 100%);`;
const MatGrid = styled.div`
  display:grid;grid-template-columns:repeat(3,1fr);gap:1px;
  background:${C.border};border-radius:24px;overflow:hidden;margin-top:3rem;
  @media(max-width:700px){grid-template-columns:1fr;}
`;
const MatItem = styled.div`
  background:#fff;overflow:hidden;transition:background 0.3s;position:relative;
  &::after{content:'';position:absolute;bottom:0;left:0;right:0;height:3px;background:linear-gradient(90deg,${C.copper},${C.gold},${C.copper});transform:scaleX(0);transition:transform 0.4s;}
  &:hover::after{transform:scaleX(1);}&:hover{background:${C.cream};}
`;
const MatImg  = styled.div`
  height:200px;overflow:hidden;
  img{width:100%;height:100%;object-fit:cover;transition:transform 0.5s;}
  ${MatItem}:hover & img{transform:scale(1.05);}
`;
const MatBody = styled.div`padding:1.8rem;`;
const MatDot  = styled.div`width:10px;height:10px;border-radius:50%;background:${C.copper};box-shadow:0 0 14px rgba(184,115,51,0.6);margin-bottom:1rem;`;
const MatName = styled.h3`font-family:'Cormorant Garamond',serif;font-size:1.6rem;font-weight:700;color:${C.brown};margin-bottom:0.6rem;`;
const MatText = styled.p`font-size:0.9rem;color:${C.muted};line-height:1.7;`;

/* ══════════════════════════════════════════════
   COMMUNITY — DARK
   artisans.jpeg as background accent
══════════════════════════════════════════════ */
const CommSec  = styled.section`
  background:linear-gradient(135deg,#150a02 0%,#2d1a12 100%);
  padding:7rem 2rem;position:relative;overflow:hidden;
  &::before{content:'';position:absolute;top:-1px;left:0;right:0;height:80px;background:${C.bg2};clip-path:ellipse(55% 100% at 50% 0%);}
  &::after{content:'';position:absolute;bottom:-1px;left:0;right:0;height:80px;background:${C.bg};clip-path:ellipse(55% 100% at 50% 100%);}
`;
const CommGrid     = styled.div`display:grid;grid-template-columns:1fr 1fr;gap:5rem;margin-top:3rem;@media(max-width:860px){grid-template-columns:1fr;gap:3rem;}`;
const DarkTitle    = styled.h2`font-family:'Cormorant Garamond',serif;font-size:clamp(2rem,3.5vw,2.8rem);font-weight:700;color:#fff;margin-bottom:1rem;line-height:1.2;`;
const DarkBody     = styled.p`font-size:0.95rem;line-height:1.8;color:rgba(255,255,255,0.5);margin-bottom:1rem;`;
const ChalList     = styled.ul`list-style:none;margin-top:1.5rem;`;
const ChalItem     = styled.li`
  display:flex;gap:0.9rem;align-items:flex-start;padding:1rem 0;border-bottom:1px solid rgba(255,255,255,0.06);
  font-size:0.92rem;color:rgba(255,255,255,0.6);line-height:1.6;
  &::before{content:'◆';color:${C.copper};font-size:0.5rem;flex-shrink:0;margin-top:0.55rem;}
`;
const ChalSideTitle = styled.h3`font-family:'Cormorant Garamond',serif;font-size:1.8rem;font-weight:700;color:#ffe4c4;margin-bottom:0.5rem;`;
const MissionBox   = styled.div`background:rgba(255,255,255,0.04);border:1px solid rgba(255,215,0,0.2);border-radius:20px;padding:2.5rem;margin-top:2rem;`;
const MissionQ     = styled.blockquote`font-family:'Cormorant Garamond',serif;font-size:1.3rem;font-style:italic;color:rgba(255,255,255,0.85);line-height:1.65;margin-bottom:0.8rem;`;
const MissionBy    = styled.div`font-size:0.78rem;color:rgba(255,255,255,0.35);letter-spacing:0.08em;`;

/* ══════════════════════════════════════════════
   RESEARCH — Teapan.jpg as right image
══════════════════════════════════════════════ */
const ResearchSec = styled.section`padding:7rem 2rem;`;
const ResearchBox = styled.div`
  background:linear-gradient(135deg,#fdf5e8 0%,#fff9f4 100%);border-radius:28px;padding:3.5rem;
  border-left:5px solid ${C.copper};box-shadow:0 20px 70px rgba(184,115,51,0.12);
  display:grid;grid-template-columns:1fr 0.55fr;gap:3rem;align-items:center;
  @media(max-width:860px){grid-template-columns:1fr;gap:2rem;}@media(max-width:600px){padding:2rem;}
`;
const ResTitle    = styled.h3`font-family:'Cormorant Garamond',serif;font-size:2rem;font-weight:700;color:${C.brown};margin:1rem 0;line-height:1.3;`;
const AuthorRow   = styled.div`display:flex;flex-wrap:wrap;gap:0.6rem;margin:1.5rem 0;`;
const AuthorChip  = styled.span`background:#fff;padding:0.35rem 1rem;border-radius:30px;font-weight:600;color:${C.copper};font-size:0.82rem;box-shadow:0 2px 8px rgba(0,0,0,0.06);border:1px solid ${C.border};`;
const ResText     = styled.p`font-size:0.97rem;color:${C.text};line-height:1.8;margin-bottom:1.5rem;`;
const ResBtn      = styled.a`
  display:inline-flex;align-items:center;gap:0.6rem;background:${C.copper};color:#fff;
  padding:0.9rem 2rem;border-radius:40px;font-weight:700;font-size:0.92rem;text-decoration:none;transition:all 0.3s;
  &:hover{background:${C.brown};transform:translateY(-2px);box-shadow:0 12px 30px rgba(184,115,51,0.35);}
`;
const ResImgBox   = styled.div`border-radius:18px;overflow:hidden;box-shadow:0 16px 50px rgba(184,115,51,0.15);img{width:100%;height:280px;object-fit:cover;display:block;}`;

/* ══════════════════════════════════════════════
   CTA
══════════════════════════════════════════════ */
const CTASec   = styled.section`padding:7rem 2rem;background:${C.bg};text-align:center;`;
const CTATitle = styled.h2`font-family:'Cormorant Garamond',serif;font-size:clamp(2.2rem,4vw,3.2rem);font-weight:700;color:${C.brown};margin-bottom:1rem;`;
const CTABody  = styled.p`font-size:1.05rem;color:${C.muted};max-width:540px;margin:0 auto 2.5rem;line-height:1.75;`;

/* ══════════════════════════════════════════════
   DATA — using local Assets
══════════════════════════════════════════════ */
const PILLARS = [
  { icon:'🔥', img: bowl,    title:'500+ Year Legacy',    text:'Metal crafting in Songir dates back to the Farooqi Sultanate era — an unbroken chain of knowledge passed hand to hand.' },
  { icon:'👨‍👩‍👧', img: Shopkeeper, title:'Thathara Community',  text:'100+ artisan families of the Thathara community have built their entire identity and livelihood around metalwork.' },
  { icon:'🪔', img: lota,   title:'Sacred Kalash',        text:'The iconic Kalash water vessel — used in Hindu rituals across Maharashtra — is Songir\'s most revered creation.' },
  { icon:'🏔️', img: songirFort,  title:'14th Century Fort',    text:'Songir Fort on Galana Hills, 1000 ft above, protected the ancient Burhanpur–Surat trade route for centuries.' },
];

const PROCESS_STEPS = [
  { n:'01', icon:'⚗️', img: bowl,       title:'Raw Material',       text:'Brass, copper & German silver sheets sourced for quality. The metal\'s grade defines the vessel\'s resonance & durability.' },
  { n:'02', icon:'🔥', img: kadhai,     title:'Annealing (Heat)',   text:'Metal is heated repeatedly to soften it — alternating cycles of fire and cooling allow deep, precise forming by hand.' },
  { n:'03', icon:'🔨', img: artisans,   title:'Raising & Forming',  text:'Flat sheets hammered on wooden anvils into three-dimensional forms using inherited hand tools passed down generations.' },
  { n:'04', icon:'✨', img: bowl1,      title:'Finishing & Polish', text:'Surfaces buffed, polished, traditional motifs etched — each piece carries the visual vocabulary of its maker.' },
];

const TIMELINE = [
  { year:'~14th C', title:'Fort Established',   text:'Songir Fort built by the Farooqi Sultans to guard the Burhanpur–Surat trade route through Sukaldevi Pass.', r:false },
  { year:'1370',    title:'First Recorded',      text:'Earliest documented reference to Songir under Farooqi rule. Metal craft already a thriving local trade.', r:true  },
  { year:'~16th C', title:'Mughal Era',           text:'Fort and village pass to Mughal control. Songir\'s commercial importance grows on the NH3 corridor.', r:false },
  { year:'~17th C', title:'Maratha Rule',         text:'Marathas take control. Craft traditions continue to flourish alongside the fort\'s strategic use.', r:true  },
  { year:'1818',    title:'British Takeover',    text:'British Empire captures the fort. Songir shifts identity from military post to craft centre.', r:false },
  { year:'2015',    title:'Research Documented', text:'Textile Design students publish landmark documentation — preserving techniques for future generations.', r:true  },
];

const MATERIALS = [
  { name:'Brass',         img: lota,         text:'An alloy of copper and zinc — warm golden tone, corrosion-resistant and supremely workable. The primary metal of Songir\'s craft tradition.' },
  { name:'Copper',        img: coppertan,    text:'Revered for centuries in Indian ritual. Copper vessels are auspicious, central to Hindu ceremonies across Maharashtra.' },
  { name:'pure brass', img: bowl1,text:'A nickel-silver alloy delivering a bright, silvery finish. Prized for decorative wares contrasting beautifully with warmer metals.' },
];

/* ══════════════════════════════════════════════
   COMPONENT
══════════════════════════════════════════════ */
const SongirAbout = () => {
  const navigate = useNavigate();
  const scroll = id => document.getElementById(id)?.scrollIntoView({ behavior:'smooth' });

  // Inject Google Fonts safely via <link> tag
  useEffect(() => {
    const id = 'songir-gfonts';
    if (document.getElementById(id)) return;
    const link = document.createElement('link');
    link.id = id; link.rel = 'stylesheet';
    link.href = 'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400;1,600&family=DM+Sans:wght@300;400;500;600;700&display=swap';
    document.head.appendChild(link);
  }, []);

  return (
    <>
      <GlobalStyle />
      <Page>

        {/* ━━━ HERO — artisanCrafting.png ━━━ */}
        <HeroSection>
          <HeroBgImg src={artisanCrafting} alt="Artisan crafting metal — Songir" />
          <HeroGlow />
          <HeroFade />
          <HeroInner>
            <HeroContent>
              <HeroBadge><Shield size={14}/> Maharashtra's Metal Craft Capital</HeroBadge>
              <HeroTitle>
                <span className="shine">SONGIR</span>
                <span className="sub">Suvarngiri — The Golden Mountain</span>
              </HeroTitle>
              <HeroDesc>
                Where five centuries of metal craft tradition meet the grandeur of an ancient fort.
                A living village of artisans in Dhule district, Maharashtra — at the crossroads
                of history, culture, and hand-made excellence.
              </HeroDesc>
              <HeroPills>
                <Pill><Clock size={15}/><strong>500+</strong><span>Years Heritage</span></Pill>
                <Pill><Users size={15}/><strong>100+</strong><span>Artisan Families</span></Pill>
                <Pill><Castle size={15}/><strong>14th C.</strong><span>Fort</span></Pill>
                <Pill><MapPin size={15}/><strong>Dhule</strong><span>Maharashtra</span></Pill>
              </HeroPills>
              <BtnRow>
                <BtnPrimary onClick={() => scroll('craft')}><Hammer size={17}/> The Craft</BtnPrimary>
                <BtnSecondary onClick={() => scroll('map')}><MapPin size={17}/> Find Songir</BtnSecondary>
              </BtnRow>
            </HeroContent>
          </HeroInner>
          <ScrollHint>Scroll to explore</ScrollHint>
        </HeroSection>

        {/* ━━━ STORY — artisans.jpeg (right side) ━━━ */}
        <StorySection>
          <Wrap>
            <StoryGrid>
              <StoryLeft>
                <SecLabel><MapPin size={13}/> Our Origin</SecLabel>
                <Display>Songir's Living<br/>Craft Tradition</Display>
                <StoryQuote>
                  "Songir is not just a village — it is a living museum of metal artistry,
                  where every hammered vessel carries the memory of the hands that shaped it."
                </StoryQuote>
                <BodyText>
                  Located in Dhule district, Songir is home to the Thathara community —
                  specialist metalworkers whose identity is inseparable from their craft.
                  For centuries their days have begun with the rhythmic percussion of hammer
                  on metal, shaping raw brass and copper into vessels of daily and sacred use.
                </BodyText>
                <BodyText>
                  The craft travels as knowledge passed from parent to child — no written manuals,
                  no formal schools. Each artisan carries a complete technical vocabulary
                  that no machine can replicate or replace.
                </BodyText>
                <StatsBox>
                  {[{n:'300+',l:'Years of Craft'},{n:'3',l:'Metals Used'},{n:'Kalash',l:'Signature Product'},{n:'100%',l:'Handcrafted'}].map(s=>(
                    <StatCell key={s.l}><StatNum>{s.n}</StatNum><StatLbl>{s.l}</StatLbl></StatCell>
                  ))}
                </StatsBox>
              </StoryLeft>
              <StoryRight>
                <StoryImgWrap>
                  <StoryImg src={artisans} alt="Songir artisans at work — Dhule, Maharashtra"/>
                  <StoryCaption>
                    <Award size={15}/> Thathara community artisans — Songir, Dhule, Maharashtra
                  </StoryCaption>
                </StoryImgWrap>
              </StoryRight>
            </StoryGrid>
          </Wrap>
        </StorySection>

        {/* ━━━ PILLARS — cookware, Shopkeeper, pujathali, Songirfort ━━━ */}
        <PillarsSection>
          <Wrap>
            <SecLabel><Star size={13}/> What Makes Songir</SecLabel>
            <Display>Four Pillars of Heritage</Display>
            <PillarsGrid>
              {PILLARS.map(p=>(
                <PillarCard key={p.title}>
                  <PillarImg><img src={p.img} alt={p.title} loading="lazy"/></PillarImg>
                  <PillarBody>
                    <PillarIcon>{p.icon}</PillarIcon>
                    <PillarTitle>{p.title}</PillarTitle>
                    <PillarText>{p.text}</PillarText>
                  </PillarBody>
                </PillarCard>
              ))}
            </PillarsGrid>
          </Wrap>
        </PillarsSection>

        {/* ━━━ PROCESS — bowl, kadhai, artisans, bowl1 ━━━ */}
        <ProcessSec id="craft">
          <Wrap>
            <SecLabel style={{background:'rgba(184,115,51,0.7)',display:'flex',width:'fit-content',margin:'0 auto 1rem'}}>
              <Hammer size={13}/> The Making
            </SecLabel>
            <DarkH2>How Each Piece Is Made</DarkH2>
            <DarkSub>Four patient steps — refined over 500 years. No shortcuts, no machines. Just skill and metal.</DarkSub>
            <ProcessGrid>
              {PROCESS_STEPS.map(p=>(
                <ProcessCard key={p.n}>
                  <ProcessImgWrap>
                    <img src={p.img} alt={p.title} loading="lazy"/>
                    <ProcessNum>{p.n}</ProcessNum>
                  </ProcessImgWrap>
                  <ProcessBody>
                    <ProcessIcon>{p.icon}</ProcessIcon>
                    <ProcessTitle>{p.title}</ProcessTitle>
                    <ProcessText>{p.text}</ProcessText>
                  </ProcessBody>
                </ProcessCard>
              ))}
            </ProcessGrid>
          </Wrap>
        </ProcessSec>

        {/* ━━━ MAP — Real Songir 21.0167N, 74.5833E ━━━ */}
        <MapSec id="map">
          <Wrap>
            <SecLabel><Navigation size={13}/> Location</SecLabel>
            <Display>Find Songir</Display>
            <BodyText style={{maxWidth:560,marginTop:'0.5rem'}}>
              Songir sits at the intersection of NH3 (Mumbai–Agra) and SH17 (Ahmedabad route)
              in Dhule district, Maharashtra — a commercial hub for 100+ surrounding villages.
            </BodyText>
            <MapGrid>
              <MapInfoList>
                {[
                  {icon:<Navigation size={17}/>,title:'Exact Coordinates',text:`${LAT}° N, ${LNG}° E`},
                  {icon:<MapPin size={17}/>,     title:'District & State', text:'Dhule District, Maharashtra, India'},
                  {icon:<Globe size={17}/>,      title:'Major Highways',   text:'NH3 (Mumbai–Agra) & SH17 (Ahmedabad)'},
                  {icon:<Mountain size={17}/>,   title:'Songir Fort',      text:'Galana Hills — 1000 ft, 20 min climb from village'},
                  {icon:<Clock size={17}/>,      title:'Heritage Since',   text:'~14th Century — Farooqi Sultanate period'},
                  {icon:<Users size={17}/>,      title:'Regional Hub',     text:'Commercial & craft hub for 100+ villages in Dhule'},
                ].map(b=>(
                  <MapInfoItem key={b.title}>
                    {b.icon}
                    <MapInfoText><h4>{b.title}</h4><p>{b.text}</p></MapInfoText>
                  </MapInfoItem>
                ))}
                <MapCoordBar>
                  <Navigation size={15}/>
                  <span>Pinned: <code>{LAT}°N, {LNG}°E</code> — Songir, Dhule</span>
                </MapCoordBar>
              </MapInfoList>
              <div>
                <MapBox>
                  <MapFrame src={EMBED} title="Songir village — Dhule, Maharashtra" loading="lazy" allowFullScreen/>
                  <MapPin2>📍</MapPin2>
                  <MapTag href={MAPLINK} target="_blank" rel="noreferrer">
                    <MapPin size={20}/>
                    <MapTagInner>
                      <strong>Songir, Dhule District</strong>
                      <span>Maharashtra, India · Click to open full map</span>
                    </MapTagInner>
                    <ExternalLink size={15} style={{color:'#8a7560',marginLeft:'auto',flexShrink:0}}/>
                  </MapTag>
                </MapBox>
              </div>
            </MapGrid>
          </Wrap>
        </MapSec>

        {/* ━━━ TIMELINE ━━━ */}
        <TimelineSec>
          <Wrap>
            <TCenter>
              <SecLabel><Clock size={13}/> History</SecLabel>
              <Display style={{display:'block',textAlign:'center'}}>Songir Through Time</Display>
              <BodyText style={{textAlign:'center',margin:'1.2rem auto 0',maxWidth:520}}>
                From a 14th-century fortress to Maharashtra's metal craft heartland — a 700-year journey.
              </BodyText>
            </TCenter>
            <TimelineWrap>
              {TIMELINE.map((t,i)=>(
                <TItem key={i} $r={t.r}>
                  <TCard>
                    <TDot $r={t.r}/>
                    <TYear>{t.year}</TYear>
                    <TTitle>{t.title}</TTitle>
                    <TText>{t.text}</TText>
                  </TCard>
                </TItem>
              ))}
            </TimelineWrap>
          </Wrap>
        </TimelineSec>

        {/* ━━━ FORT — Songirfort.jpg (all 3 cards) ━━━ */}
        <FortSec id="fort">
          <Wrap>
            <SecLabel><Castle size={13}/> Historic Fort</SecLabel>
            <Display>Songir Fort</Display>
            <BodyText style={{maxWidth:540,marginTop:'0.5rem'}}>
              The silent guardian watching over the craft village since the 14th century —
              built to protect the ancient trade route from Burhanpur to Surat.
            </BodyText>
            <FortCards>
              {[
                { img:Fort1, title:'🏰 Fort Overview',     text:'Located 1000 ft above on Galana hills, this narrow fort (only 30m wide) was built to control the Burhanpur–Surat corridor through Sukaldevi Pass.', meta:['14th Century','1000 ft elevation'] },
                { img:songirFort, title:'📜 Historical Rulers', text:'Farooqi Sultans (1370) → Mughals → Marathas → British (1818). Each empire left architectural and cultural marks on this vital outpost.', tags:['Farooqi','Mughal','Maratha','British'] },
                { img:Fort2, title:'⚔️ Fort Features',     text:'Deep water well, a 14-cornered pond, mansion ruins, and strong bastions. A 20-minute climb rewards with panoramic views of Dhule.', meta:['20 min climb','3 nearby forts'] },
              ].map(c=>(
                <FortCard key={c.title}>
                  <FortCardImg><img src={c.img} alt={c.title} loading="lazy"/></FortCardImg>
                  <FortCardBody>
                    <FortCardTitle>{c.title}</FortCardTitle>
                    <FortCardText>{c.text}</FortCardText>
                    {c.tags && <TagRow>{c.tags.map(t=><Tag key={t}>{t}</Tag>)}</TagRow>}
                    {c.meta && <MetaRow><Clock size={14}/>{c.meta[0]}<MapPin size={14}/>{c.meta[1]}</MetaRow>}
                  </FortCardBody>
                </FortCard>
              ))}
            </FortCards>
            <FortStats>
              {[
                {icon:<Landmark size={20}/>,v:'1370',  l:'First Recorded'},
                {icon:<Castle size={20}/>,  v:'30m',   l:'Fort Width'},
                {icon:<Clock size={20}/>,   v:'20 min',l:'Climb Time'},
                {icon:<Globe size={20}/>,   v:'1818',  l:'British Era'},
              ].map(s=>(
                <FortStat key={s.l}>{s.icon}<div className="v">{s.v}</div><div className="l">{s.l}</div></FortStat>
              ))}
            </FortStats>
          </Wrap>
        </FortSec>

        {/* ━━━ MATERIALS — lota, coppertan, designerglass ━━━ */}
        <MatSec>
          <Wrap>
            <SecLabel><Layers size={13}/> Raw Materials</SecLabel>
            <Display>Metals We Work With</Display>
            <BodyText style={{maxWidth:530,marginTop:'0.5rem'}}>
              Each metal brings its own character — its own sound under the hammer,
              warmth in the hand, and story across centuries of Indian tradition.
            </BodyText>
            <MatGrid>
              {MATERIALS.map(m=>(
                <MatItem key={m.name}>
                  <MatImg><img src={m.img} alt={m.name} loading="lazy"/></MatImg>
                  <MatBody>
                    <MatDot/><MatName>{m.name}</MatName><MatText>{m.text}</MatText>
                  </MatBody>
                </MatItem>
              ))}
            </MatGrid>
          </Wrap>
        </MatSec>

        {/* ━━━ COMMUNITY ━━━ */}
        <CommSec>
          <Wrap>
            <CommGrid>
              <div>
                <SecLabel style={{background:'rgba(184,115,51,0.6)'}}>
                  <Users size={13}/> The People
                </SecLabel>
                <DarkTitle>Community &amp;<br/>Heritage</DarkTitle>
                <DarkBody>
                  The craft belongs to the Thathara community — families whose social, economic,
                  and cultural identity has been built entirely around metalwork across generations.
                  Most workshops are home-based; family members contribute at every stage.
                </DarkBody>
                <DarkBody>
                  Their signature product — the <em style={{color:'#ffe4c4'}}>Kalash</em> — is an auspicious
                  water vessel central to Hindu rituals across Maharashtra. Its form, surface and gleam
                  make it both functional object and work of art.
                </DarkBody>
                <MissionBox>
                  <MissionQ>
                    "When a craft dies, it takes with it a way of seeing the world —
                    a knowledge no book can fully preserve, and no machine can recreate."
                  </MissionQ>
                  <MissionBy>— Final Documentation on Metal Craft, 2015</MissionBy>
                </MissionBox>
              </div>
              <div>
                <ChalSideTitle>Challenges Facing<br/>the Tradition</ChalSideTitle>
                <DarkBody style={{marginBottom:0}}>
                  Despite its deep roots, Songir's craft faces growing pressures:
                </DarkBody>
                <ChalList>
                  {[
                    'Diminishing number of skilled artisans willing to continue the craft',
                    'Machine-made utensils competing at far lower price points',
                    'Rising raw material costs squeezing artisan profit margins',
                    'Limited market reach — no formal branding or online presence',
                    'Youth migrating to cities, breaking the knowledge transfer chain',
                  ].map(c=><ChalItem key={c}>{c}</ChalItem>)}
                </ChalList>
              </div>
            </CommGrid>
          </Wrap>
        </CommSec>

        {/* ━━━ RESEARCH — Teapan.jpg as right image ━━━ */}
        <ResearchSec>
          <Wrap>
            <SecLabel><BookOpen size={13}/> Documentation</SecLabel>
            <ResearchBox>
              <div>
                <SecLabel style={{background:'#8B4513'}}>
                  <BookOpen size={13}/> Research Paper · 2015
                </SecLabel>
                <ResTitle>"Final Documentation on<br/>Metal Craft" — Songir, Dhule</ResTitle>
                <AuthorRow>
                  {['Pooja Kamble','Ritu Singh','Sanyia Shaikh','Shivani Gupta','Srejoyee Naskar','Vanshika Parekh'].map(a=>(
                    <AuthorChip key={a}>{a}</AuthorChip>
                  ))}
                </AuthorRow>
                <ResText>
                  A landmark research paper by Textile Design students (Semester IV) under
                  Dr. Sentil Kumar Venkatlu &amp; Director Nilima Rani — documenting the full
                  lifecycle of Songir's metal craft: materials, tools, forming process,
                  community economics, and cultural significance.
                </ResText>
                <ResBtn href="https://www.scribd.com/document/276015551/01-Final-Documentation-on-Metal-Craft" target="_blank" rel="noreferrer">
                  <BookOpen size={16}/> Read Full Paper <ExternalLink size={14}/>
                </ResBtn>
              </div>
              <ResImgBox>
                <img src={Teapan} alt="Handcrafted metal teapan — Songir craft" loading="lazy"/>
              </ResImgBox>
            </ResearchBox>
          </Wrap>
        </ResearchSec>

        {/* ━━━ CTA ━━━ */}
        <CTASec>
          <Wrap>
            <div style={{maxWidth:600,margin:'0 auto'}}>
              <SecLabel style={{justifyContent:'center'}}><Heart size={13}/> Support the Craft</SecLabel>
              <CTATitle>Every Purchase Keeps<br/>a Tradition Alive</CTATitle>
              <CTABody>
                Buying from Songir artisans supports a living family, a living community,
                and a cultural heritage that has endured for five centuries. Choose handmade.
              </CTABody>
              <BtnRow style={{justifyContent:'center'}}>
                <BtnPrimary onClick={()=>navigate('/Product')}><ChevronRight size={17}/> Browse Collection</BtnPrimary>
                <BtnLight onClick={()=>navigate('/shops')}><MapPin size={17}/> Find Artisans</BtnLight>
              </BtnRow>
            </div>
          </Wrap>
        </CTASec>

      </Page>
    </>
  );
};

export default SongirAbout;