import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
// NOTE: productsData export from ProductsPage is always [] (it's async state).
// ProductDetailPage fetches the API directly into liveProducts state instead.
import ProductReviews from "./ProductReviews";
import { toggleWishlist, getWishlist } from "../utils/wishlistUtils";
import "./Productdetailpage.css";
import { saveRecentlyViewed, getRelatedProducts } from '../utils/recentlyViewedUtils';


/* ══════════════════════════════════════════════════════════════
   EXTENDED PRODUCTS DATA
══════════════════════════════════════════════════════════════ */
export const extendedProducts = [
  { id: 101, name: "Copper Hammered Tawa", category: "Copper", weight: "1.8 kg", price: 2800, image: "https://images.unsplash.com/photo-1590779033100-9f60a05a013d?w=600&q=80", shop: "Shree Puja Store", description: "Traditional copper tawa with hammered finish for perfect roti making.", rating: 4.9, reviews: 214, inStock: true },
  { id: 102, name: "Copper Water Bottle", category: "Copper", weight: "0.6 kg", price: 950, image: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=600&q=80", shop: "Shree Puja Store", description: "Pure copper water bottle with engraved motifs for Ayurvedic health benefits.", rating: 4.8, reviews: 178, inStock: true },
  { id: 103, name: "Copper Kadhai Set", category: "Copper", weight: "3.2 kg", price: 4500, image: "https://images.unsplash.com/photo-1585515656273-64e21e07e13c?w=600&q=80", shop: "Shree Puja Store", description: "Set of 3 copper kadhai in various sizes. Premium cooking experience.", rating: 4.7, reviews: 132, inStock: true },
  { id: 104, name: "Copper Handi Pot", category: "Copper", weight: "2.1 kg", price: 3200, image: "https://images.unsplash.com/photo-1624517452488-04e6d22ef1f3?w=600&q=80", shop: "Shree Puja Store", description: "Traditional copper handi for slow cooking dals and curries authentically.", rating: 4.8, reviews: 96, inStock: true },
  { id: 105, name: "Copper Serving Tray", category: "Copper", weight: "1.4 kg", price: 1800, image: "https://images.unsplash.com/photo-1617093727343-374698b1b08d?w=600&q=80", shop: "Shree Puja Store", description: "Elegant copper serving tray with intricate border engravings.", rating: 4.6, reviews: 88, inStock: true },
  { id: 201, name: "Brass Dinner Thali Set", category: "Brass", weight: "2.5 kg", price: 3800, image: "https://images.unsplash.com/photo-1585515320310-259814833e62?w=600&q=80", shop: "Golden Utensils", description: "Complete brass dinner thali set with 6 katoris. Elegant and durable.", rating: 4.8, reviews: 156, inStock: true },
  { id: 202, name: "Brass Diya Deep Set", category: "Brass", weight: "0.8 kg", price: 1200, image: "https://images.unsplash.com/photo-1635750498052-0b5e16a33905?w=600&q=80", shop: "Golden Utensils", description: "Set of 12 ornate brass diyas for festivals, navratri and daily worship.", rating: 4.9, reviews: 342, inStock: true },
  { id: 203, name: "Brass Kalash Lota", category: "Brass", weight: "1.1 kg", price: 1600, image: "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=600&q=80", shop: "Golden Utensils", description: "Sacred brass kalash lota for puja and religious ceremonies. Pure brass.", rating: 4.7, reviews: 208, inStock: true },
  { id: 204, name: "Brass Ghee Lamp", category: "Brass", weight: "0.4 kg", price: 850, image: "https://images.unsplash.com/photo-1633613286848-e6f43bbafb8d?w=600&q=80", shop: "Golden Utensils", description: "Traditional 5-flame brass deepak for auspicious occasions and daily puja.", rating: 4.8, reviews: 119, inStock: true },
  { id: 205, name: "Brass Incense Holder", category: "Brass", weight: "0.3 kg", price: 650, image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=80", shop: "Golden Utensils", description: "Intricately carved brass agarbatti stand. Perfect for daily spiritual practice.", rating: 4.6, reviews: 77, inStock: true },
  { id: 301, name: "Lord Ganesha Brass Murti", category: "Statue", weight: "1.2 kg", price: 4200, image: "https://images.unsplash.com/photo-1518049362265-d5b2a6467637?w=600&q=80", shop: "Divine Crafts", description: "Stunning brass Ganesha idol with intricate detailing. Auspicious for home and office.", rating: 4.9, reviews: 425, inStock: true },
  { id: 302, name: "Goddess Lakshmi Murti", category: "Statue", weight: "0.9 kg", price: 3800, image: "https://images.unsplash.com/photo-1561361058-c24e5e3d885e?w=600&q=80", shop: "Divine Crafts", description: "Beautiful brass Lakshmi idol radiating prosperity. For home puja and gifting.", rating: 4.9, reviews: 312, inStock: true },
  { id: 303, name: "Lord Shiva Nataraja", category: "Statue", weight: "2.4 kg", price: 6500, image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=600&q=80", shop: "Divine Crafts", description: "Magnificent Nataraja dancing Shiva in traditional Chola style. Museum quality.", rating: 5.0, reviews: 198, inStock: true },
  { id: 304, name: "Saraswati Copper Idol", category: "Statue", weight: "1.1 kg", price: 4800, image: "https://images.unsplash.com/photo-1625480859988-ce54a54ab8e1?w=600&q=80", shop: "Divine Crafts", description: "Graceful Saraswati statue in copper, holding veena. Perfect for study rooms.", rating: 4.8, reviews: 143, inStock: true },
  { id: 305, name: "Hanuman Panchmukhi Idol", category: "Statue", weight: "1.8 kg", price: 5500, image: "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=600&q=80", shop: "Divine Crafts", description: "Powerful 5-faced Panchmukhi Hanuman in brass for ultimate protection.", rating: 4.9, reviews: 267, inStock: true },
  { id: 306, name: "Krishna Flute Murti", category: "Statue", weight: "0.7 kg", price: 3200, image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=600&q=80", shop: "Divine Crafts", description: "Enchanting brass Krishna with flute in tribhanga pose. Gold-like finish.", rating: 4.8, reviews: 189, inStock: true },
];

// allProducts = extendedProducts only at module level.
// Real backend products are merged in at runtime via liveProducts state (see below).
const allProducts = [...extendedProducts];

/* ── Per-User Auth Helper ── */
function getUserId() {
  try {
    const keys = ['songirUser', 'songir_user', 'currentUser', 'userData', 'user', 'loggedInUser'];
    for (const k of keys) {
      const raw = localStorage.getItem(k);
      if (raw) {
        const u = JSON.parse(raw);
        const id = u._id || u.id || u.userId || u.email;
        if (id) return String(id).replace(/[^a-zA-Z0-9_-]/g, '_');
      }
    }
  } catch {}
  return 'guest';
}
function getRecentKey() { return `songir_recently_viewed_${getUserId()}`; }

/* ── Resolve backend image URL ── */
const BASE = "http://localhost:5000";
function resolveImg(img) {
  if (!img) return "https://placehold.co/600x600?text=Product";
  if (img.startsWith("http")) return img;
  return `${BASE}/${img.replace(/^\//, "")}`;
}

/* ── Recently Viewed — Per User ── */
function addToRecentlyViewed(p) {
  try {
    const key = getRecentKey();
    const pid = String(p._id || p.id);
    const s = JSON.parse(localStorage.getItem(key) || "[]");
    const f = s.filter(x => String(x.id) !== pid);
    const entry = {
      id: pid,
      name: p.name,
      price: p.price,
      image: resolveImg(p.image),
      category: p.category,
      rating: p.rating,
      shop: p.shop || p.shopName || "",
    };
    const updated = [entry, ...f].slice(0, 20);
    localStorage.setItem(key, JSON.stringify(updated));
    window.dispatchEvent(new StorageEvent("storage", { key, newValue: JSON.stringify(updated), storageArea: localStorage }));
  } catch {}
}
function getRecentlyViewed() { try { return JSON.parse(localStorage.getItem(getRecentKey()) || "[]"); } catch { return []; } }

/* ── Saved Reviews — Per Product ── */
const REVIEWS_KEY = "songir_saved_reviews";
function getSavedReviews(productId) {
  try { return JSON.parse(localStorage.getItem(`${REVIEWS_KEY}_${productId}`) || "[]"); } catch { return []; }
}
function saveReview(productId, review) {
  try {
    const existing = getSavedReviews(productId);
    localStorage.setItem(`${REVIEWS_KEY}_${productId}`, JSON.stringify([review, ...existing]));
  } catch {}
}

/* ══════════════════════════════════════════════════════════════
   STATIC DATA
══════════════════════════════════════════════════════════════ */
const BENEFITS = {
  Copper: [
    { title: "Kills Bacteria",    desc: "Natural antimicrobial properties eliminate 99.9% of pathogens on contact", img: "https://media.istockphoto.com/id/1186077353/photo/maharashtra-wedding-ceremony-in-hinduism.jpg?s=612x612&w=0&k=20&c=_UCXBdp4tFGUNlKEFUkCzZJBLImuLTNNhcIKPJuDVcU=" },
    { title: "Slows Ageing",      desc: "Rich in antioxidants that neutralise free radicals and support cellular health", img: "https://media.istockphoto.com/id/858541110/photo/copper-kalash-glass-spoon-and-plate-used-by-bramhins-after-sacred-thread-ceremony-while.jpg?s=612x612&w=0&k=20&c=nHaVqhPeRHV0-37pAGLZ_48scOOc_diaBV-85XL1xWU=" },
    { title: "Purifies Water",    desc: "Copper ions naturally purify stored water overnight — no chemicals needed", img: "https://media.istockphoto.com/id/2222639013/photo/traditional-indian-woman-collecting-spring-water-in-a-brass-pot.webp?a=1&b=1&s=612x612&w=0&k=20&c=uFmf8QaOQYRn63T0oZ8NqFX97OOJAAOQoXPFfeT785c=" },
    { title: "Better Digestion",  desc: "Stimulates the digestive system and promotes healthy peristalsis naturally", img: "https://plus.unsplash.com/premium_photo-1664303714911-f89d3021e9b4?w=600&auto=format&fit=crop&q=60" },
    { title: "Heart Health",      desc: "Helps regulate bad cholesterol and supports stable blood pressure over time", img: "https://media.istockphoto.com/id/1428561028/photo/pouring-tea-tea-sets-traditional-chinese-tea-art-tea-culture-exquisite-incense-burners-futon.jpg?s=612x612&w=0&k=20&c=t8hYWhHx4bzcO_Wu5h11dYEDLgOHNHWJth3lyrJndu0=" },
    { title: "Strengthens Bones", desc: "Supports bone and joint health with regular use across all age groups", img: "https://images.unsplash.com/photo-1743263617586-a8a60d68491e?w=600&auto=format&fit=crop&q=60" },
  ],
  Brass: [
    { title: "Pure & Natural",    desc: "100% authentic solid brass — no coatings, no plating, no shortcuts, ever", img: "https://static.india.com/wp-content/uploads/2022/08/copper-vessel-1-1.gif" },
    { title: "Even Heat",         desc: "Superior heat distribution ensures perfectly cooked meals every single time", img: "https://images.pexels.com/photos/33411604/pexels-photo-33411604.jpeg" },
    { title: "Naturally Healthy", desc: "Promotes mineral absorption and supports overall digestive wellness daily", img: "https://media.istockphoto.com/id/938008462/photo/cardamom-cinnamon-bay-leaf-spice-in-shiny-metal-pot-brass-copper-golden-on-white-background.jpg?s=612x612&w=0&k=20&c=-_8E7cSoUlJLb3FK67aXra_YjUMd7HVYIcEg0XkuBR4=" },
    { title: "Eco-Friendly",      desc: "Sustainable craftsmanship designed to last generations, not just years", img: "https://media.istockphoto.com/id/516462999/photo/hand-stamping-or-engraving-metal-pattern.jpg?s=612x612&w=0&k=20&c=HQJBmJdqPlQ5ewNsFMXGx58QNkWcKGfWgBicXGO2ojw=" },
    { title: "Artisan Quality",   desc: "Hand-crafted by master artisans using centuries-old traditional methods", img: "https://media.istockphoto.com/id/1545150262/photo/chasing-work-on-the-brass-plate.jpg?s=612x612&w=0&k=20&c=7DgTaxX2QXyanKnt6KNFsM9zh1oq9v2MB7XPvfDlpkE=" },
    { title: "Family Safe",       desc: "Trusted by generations of Indian families for daily cooking and serving", img: "https://media.istockphoto.com/id/1451340656/photo/north-indian-thali.jpg?s=612x612&w=0&k=20&c=56kUg_sHjoWmVZ0cfIOr5sNkXCVP90B_McdWlngv0Iw=" },
  ],
  Statue: [
    { title: "Divine Blessings",  desc: "Each idol is energized through traditional prana pratishtha rituals", img: "https://images.unsplash.com/photo-1518049362265-d5b2a6467637?w=400&q=80" },
    { title: "Master Artistry",   desc: "Crafted by 5th-generation sculptors from the ancient city of Moradabad", img: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=400&q=80" },
    { title: "Heritage Design",   desc: "Designs based on classical Agama Shastra iconographic proportions", img: "https://images.unsplash.com/photo-1561361058-c24e5e3d885e?w=400&q=80" },
    { title: "Pure Metals",       desc: "Only Panchadhatu (5 sacred metals) or pure brass/copper is used", img: "https://images.unsplash.com/photo-1563252722-6434563a985d?w=400&q=80" },
    { title: "Premium Gift",      desc: "Comes in a luxury velvet box — perfect for weddings and housewarming", img: "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=400&q=80" },
    { title: "Vastu Compliant",   desc: "Placement and direction guidance provided with each idol for maximum benefit", img: "https://images.unsplash.com/photo-1625480859988-ce54a54ab8e1?w=400&q=80" },
  ],
};

const CARE_STEPS = [
  { num: "01", title: "Wash Gently",     desc: "Clean with mild soap and warm water using a soft cloth. Avoid harsh scrubbers." },
  { num: "02", title: "Apply Pitambari", desc: "Apply Pitambari powder to a damp cloth and scrub all surfaces gently in circles." },
  { num: "03", title: "Lemon & Salt",    desc: "No Pitambari? Mix fresh lemon juice with salt — a natural polishing solution." },
  { num: "04", title: "Rinse & Air Dry", desc: "Rinse thoroughly and air dry completely before storing. Avoid moisture buildup." },
];

const PRESS = ["Hindustan Times", "bon appétit", "livemint", "Traveller", "Forbes India"];

const FAQ_TEASER = [
  { q: "What materials are used in your handicrafts?", a: "We use only premium-grade pure copper (99.9% purity) and high-quality brass (70% copper, 30% zinc). All idols use traditional Panchadhatu. No plating — solid metal throughout." },
  { q: "How do I care for my brass and copper handicrafts?", a: "Clean with mild soap and warm water. For deep cleaning, use Pitambari powder or lemon-salt paste, scrub gently, rinse and air dry. Polish every 2–3 months." },
  { q: "Do you offer customization?", a: "Yes! Custom engravings, special sizes, personalized designs, and corporate gifting packages for bulk orders of 10+ pieces. Contact: +91 96362 88882." },
  { q: "What is your return and exchange policy?", a: "7-day hassle-free return policy. Unused products in original packaging. Damaged or defective items replaced free of charge." },
];

/* YouTube Shorts — embed via iframe (browser blocks direct <video> for YouTube) */
const VIDEOS = [
  {
    id: 1,
    youtubeId: "6sJsbolT4kE",
    poster: "https://img.youtube.com/vi/6sJsbolT4kE/maxresdefault.jpg",
    title: "How Brass Utensils Are Made",
    subtitle: "Traditional hammering & casting",
    category: "Making",
    accent: "#b87333",
  },
  {
    id: 2,
    youtubeId: "0-yTRG1ErmE",
    poster: "https://img.youtube.com/vi/0-yTRG1ErmE/maxresdefault.jpg",
    title: "Copper Vessel Health Benefits",
    subtitle: "Ayurvedic wisdom explained",
    category: "Health",
    accent: "#d4a017",
  },
  {
    id: 3,
    youtubeId: "zrjH6MhHFfY",
    poster: "https://img.youtube.com/vi/zrjH6MhHFfY/maxresdefault.jpg",
    title: "UNESCO Heritage Craft",
    subtitle: "500 years of tradition",
    category: "Heritage",
    accent: "#c9a84c",
  },
  {
    id: 4,
    youtubeId: "s22aEBrrRGE",
    poster: "https://img.youtube.com/vi/s22aEBrrRGE/maxresdefault.jpg",
    title: "Care & Cleaning Guide",
    subtitle: "Natural home remedies",
    category: "Care",
    accent: "#5a8a5a",
  },
];

/* ══════════════════════════════════════════════════════════════
   ICONS
══════════════════════════════════════════════════════════════ */
const IC = {
  cart:   <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>,
  back:   <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>,
  share:  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>,
  check:  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>,
  checkG: <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>,
  play:   <svg width="28" height="28" viewBox="0 0 24 24" fill="white"><polygon points="6 3 20 12 6 21 6 3"/></svg>,
  pause:  <svg width="28" height="28" viewBox="0 0 24 24" fill="white"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>,
  mute:   <svg width="20" height="20" viewBox="0 0 24 24" fill="white"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><line x1="23" y1="9" x2="17" y2="15"/><line x1="17" y1="9" x2="23" y2="15"/></svg>,
  unmute: <svg width="20" height="20" viewBox="0 0 24 24" fill="white"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"/></svg>,
  close:  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
  plus:   <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
  chevL:  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>,
  chevR:  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>,
  star:   (sz = 16, fill = "#c8960c") => <svg width={sz} height={sz} viewBox="0 0 24 24" fill={fill}><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>,
};

/* ══════════════════════════════════════════════════════════════
   VIDEO REEL CARD — YouTube Shorts via iframe
   Strategy:
   • Default state: show hi-res thumbnail + animated play button
   • On click: swap to YouTube iframe with autoplay=1
   • When another card activates (isActive → false): go back to thumbnail
   • Clicking the playing iframe again shows a close "✕" button
   Note: YouTube blocks direct <video> src — iframe is the only
         valid embed method for YouTube content.
══════════════════════════════════════════════════════════════ */
function VideoReelCard({ video, isActive, onActivate }) {
  const [playing, setPlaying] = useState(false);

  // When a different card becomes active, stop this one
  useEffect(() => {
    if (!isActive) setPlaying(false);
  }, [isActive]);

  const handlePlay = (e) => {
    e.stopPropagation();
    onActivate();
    setPlaying(true);
  };

  const handleClose = (e) => {
    e.stopPropagation();
    setPlaying(false);
  };

  // YouTube embed URL — autoplay, muted start, loop, no related videos
  const embedUrl = `https://www.youtube.com/embed/${video.youtubeId}?autoplay=1&mute=0&loop=1&playlist=${video.youtubeId}&rel=0&modestbranding=1&playsinline=1`;

  return (
    <div className="video-reel-card">

      {/* ── Thumbnail state (default) ── */}
      {!playing && (
        <div className="vrc-thumb-wrap" onClick={handlePlay}>
          {/* Hi-res YouTube thumbnail */}
          <img
            src={video.poster}
            alt={video.title}
            className="vrc-thumb-img"
            onError={e => { e.target.src = `https://img.youtube.com/vi/${video.youtubeId}/hqdefault.jpg`; }}
          />
          {/* Dark gradient for legibility */}
          <div className="vrc-thumb-overlay" />

          {/* YouTube-style play button */}
          <div className="vrc-play-wrap">
            <div className="vrc-yt-btn" style={{ borderColor: video.accent }}>
              {/* YouTube logo mark */}
              <svg width="36" height="26" viewBox="0 0 36 26" fill="none">
                <rect width="36" height="26" rx="6" fill="#FF0000"/>
                <polygon points="14,7 28,13 14,19" fill="white"/>
              </svg>
            </div>
            <span className="vrc-play-hint">Tap to play</span>
          </div>

          {/* Category badge */}
          <div className="video-category-badge" style={{ background: video.accent }}>
            {video.category}
          </div>

          {/* Shorts pill */}
          <div className="vrc-shorts-pill">
            <svg width="12" height="16" viewBox="0 0 12 16" fill="none" style={{marginRight:4}}>
              <path d="M7.5 0L3 7h4l-2.5 9L12 6H7.5L10 0z" fill="white"/>
            </svg>
            Shorts
          </div>

          {/* Info overlay */}
          <div className="video-info-overlay">
            <h4 className="video-title">{video.title}</h4>
            <p className="video-subtitle">{video.subtitle}</p>
          </div>
        </div>
      )}

      {/* ── Playing state — YouTube iframe ── */}
      {playing && (
        <div className="vrc-player-wrap">
          <iframe
            src={embedUrl}
            title={video.title}
            className="vrc-iframe"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            frameBorder="0"
          />
          {/* Close button */}
          <button className="vrc-close-btn" onClick={handleClose} title="Close video">
            {IC.close}
          </button>
          {/* Category badge stays visible */}
          <div className="video-category-badge" style={{ background: video.accent, zIndex: 10 }}>
            {video.category}
          </div>
        </div>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   VIDEO REELS SECTION
══════════════════════════════════════════════════════════════ */
function VideoReelsSection({ videos = VIDEOS }) {
  const [activeIdx, setActiveIdx] = useState(null);

  return (
    <>
      <div className="video-reels-grid">
        {videos.map((v, i) => (
          <VideoReelCard
            key={v.id}
            video={v}
            isActive={activeIdx === i}
            onActivate={() => setActiveIdx(i)}
          />
        ))}
      </div>
      <style>{`
        /* ── Grid ── */
        .video-reels-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 16px;
          width: 100%;
        }
        @media(max-width:1024px) { .video-reels-grid { grid-template-columns: repeat(2,1fr); } }
        @media(max-width:640px)  { .video-reels-grid { grid-template-columns: 1fr; } }

        /* ── Card shell ── */
        .video-reel-card {
          position: relative;
          aspect-ratio: 9/16;
          border-radius: 16px;
          overflow: hidden;
          background: #111;
          box-shadow: 0 8px 32px rgba(0,0,0,.4);
          transition: transform .3s ease, box-shadow .3s;
        }
        .video-reel-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 20px 52px rgba(0,0,0,.55);
        }

        /* ── Thumbnail wrapper ── */
        .vrc-thumb-wrap {
          position: absolute;
          inset: 0;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .vrc-thumb-img {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
          transition: transform .4s ease;
        }
        .vrc-thumb-wrap:hover .vrc-thumb-img { transform: scale(1.05); }

        .vrc-thumb-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            to bottom,
            rgba(0,0,0,.15) 0%,
            rgba(0,0,0,.05) 40%,
            rgba(0,0,0,.6)  100%
          );
          z-index: 1;
        }

        /* ── Play button area ── */
        .vrc-play-wrap {
          position: relative;
          z-index: 3;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 10px;
        }
        .vrc-yt-btn {
          width: 72px;
          height: 72px;
          border-radius: 50%;
          background: rgba(0,0,0,.55);
          border: 2.5px solid rgba(255,255,255,.7);
          display: flex;
          align-items: center;
          justify-content: center;
          backdrop-filter: blur(6px);
          transition: transform .25s, background .25s;
          animation: vrcPulse 2.2s ease-in-out infinite;
          box-shadow: 0 0 0 0 rgba(255,255,255,.3);
        }
        .vrc-thumb-wrap:hover .vrc-yt-btn {
          transform: scale(1.12);
          background: rgba(255,0,0,.75);
          border-color: transparent;
        }
        @keyframes vrcPulse {
          0%,100% { box-shadow: 0 0 0 0 rgba(255,255,255,.25); }
          50%      { box-shadow: 0 0 0 12px rgba(255,255,255,0); }
        }
        .vrc-play-hint {
          font-size: 11px;
          font-weight: 700;
          color: rgba(255,255,255,.8);
          letter-spacing: .08em;
          text-transform: uppercase;
          background: rgba(0,0,0,.45);
          padding: 3px 10px;
          border-radius: 20px;
          backdrop-filter: blur(4px);
        }

        /* ── Shorts pill ── */
        .vrc-shorts-pill {
          position: absolute;
          top: 46px;
          left: 12px;
          z-index: 4;
          display: flex;
          align-items: center;
          background: rgba(0,0,0,.6);
          color: #fff;
          font-size: 10px;
          font-weight: 800;
          padding: 3px 9px;
          border-radius: 20px;
          letter-spacing: .06em;
          backdrop-filter: blur(4px);
        }

        /* ── Category badge ── */
        .video-category-badge {
          position: absolute;
          top: 12px;
          left: 12px;
          z-index: 4;
          padding: 4px 12px;
          border-radius: 20px;
          font-size: 10px;
          font-weight: 800;
          color: #fff;
          text-transform: uppercase;
          letter-spacing: .1em;
        }

        /* ── Info overlay ── */
        .video-info-overlay {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          padding: 20px 14px;
          background: linear-gradient(to top, rgba(0,0,0,.9), transparent);
          z-index: 3;
        }
        .video-title {
          font-family: 'Playfair Display', serif;
          font-size: 14px;
          font-weight: 700;
          color: #fff;
          margin: 0 0 4px;
          line-height: 1.3;
        }
        .video-subtitle {
          font-size: 11px;
          color: rgba(255,255,255,.7);
          margin: 0;
          line-height: 1.4;
        }

        /* ── YouTube iframe player ── */
        .vrc-player-wrap {
          position: absolute;
          inset: 0;
        }
        .vrc-iframe {
          width: 100%;
          height: 100%;
          border: none;
          display: block;
        }
        .vrc-close-btn {
          position: absolute;
          top: 10px;
          right: 10px;
          z-index: 10;
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: rgba(0,0,0,.75);
          border: 1.5px solid rgba(255,255,255,.3);
          color: #fff;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background .2s, transform .2s;
          backdrop-filter: blur(4px);
        }
        .vrc-close-btn:hover {
          background: rgba(220,0,0,.85);
          transform: scale(1.1);
        }
      `}</style>
    </>
  );
}

/* ══════════════════════════════════════════════════════════════
   PRODUCT GALLERY
══════════════════════════════════════════════════════════════ */
function ProductGallery({ images, selImg, setSelImg }) {
  const [zoomed, setZoomed] = useState(false);
  const [hovered, setHovered] = useState(false);
  const angles = [{ label: "Front", pos: "center center" }, { label: "Side", pos: "80% center" }, { label: "Top", pos: "center 20%" }, { label: "Detail", pos: "30% 70%" }];
  return (
    <>
      {zoomed && (
        <div className="gal-zoom-modal" onClick={() => setZoomed(false)}>
          <button className="gal-zoom-close" onClick={() => setZoomed(false)}>{IC.close}</button>
          <img src={images[selImg]} alt="Zoom" className="gal-zoom-full" onClick={e => e.stopPropagation()} />
          <p className="gal-zoom-hint">Click outside to close · Pinch to zoom on mobile</p>
        </div>
      )}
      <div className="gal-root">
        <div className="gal-thumbs">
          {images.map((img, i) => (
            <div key={i} className={`gal-thumb ${selImg === i ? "gal-thumb--active" : ""}`} onClick={() => setSelImg(i)}>
              <img src={img} alt={`View ${i + 1}`} style={{ objectPosition: angles[i]?.pos || "center" }} />
              <span className="gal-thumb__label">{angles[i]?.label || `View ${i + 1}`}</span>
            </div>
          ))}
        </div>
        <div className={`gal-main ${hovered ? "gal-main--hovered" : ""}`} onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)} onClick={() => setZoomed(true)} title="Click to open full zoom">
          <div className="gal-main__badge">🏆 BESTSELLER</div>
          <div className="gal-main__zoom-hint">{hovered ? "🔍 Click for full view" : "🔍 Hover to zoom"}</div>
          <div className="gal-main__img-clip">
            <img src={images[selImg]} alt="Product" className="gal-main__img" style={{ objectPosition: angles[selImg]?.pos || "center", transform: hovered ? "scale(1.18)" : "scale(1)" }} draggable={false} />
          </div>
          <div className="gal-main__angle-label">{angles[selImg]?.label} View</div>
        </div>
      </div>
      <style>{`
        .gal-root{display:flex;gap:12px;width:100%;max-width:560px;}
        .gal-thumbs{display:flex;flex-direction:column;gap:10px;flex-shrink:0;}
        .gal-thumb{width:72px;height:72px;border-radius:10px;overflow:hidden;cursor:pointer;border:2.5px solid transparent;transition:border-color .25s,transform .25s;position:relative;background:#f0ebe2;}
        .gal-thumb img{width:100%;height:100%;object-fit:cover;display:block;transition:transform .4s ease;}
        .gal-thumb:hover img{transform:scale(1.1);}
        .gal-thumb--active{border-color:#b87333;box-shadow:0 0 0 2px rgba(184,115,51,.2);}
        .gal-thumb__label{position:absolute;bottom:0;left:0;right:0;text-align:center;font-size:8px;font-weight:700;color:#fff;background:rgba(0,0,0,.5);padding:2px 0;letter-spacing:.06em;text-transform:uppercase;}
        .gal-main{flex:1;border-radius:16px;overflow:hidden;cursor:zoom-in;position:relative;background:linear-gradient(135deg,#fdf4e8 0%,#f5e8d0 100%);box-shadow:0 8px 40px rgba(184,115,51,.1);aspect-ratio:1/1;}
        .gal-main__img-clip{width:100%;height:100%;overflow:hidden;}
        .gal-main__img{width:100%;height:100%;object-fit:cover;display:block;transition:transform .55s cubic-bezier(.4,0,.2,1);will-change:transform;}
        .gal-main__badge{position:absolute;top:14px;left:14px;z-index:4;padding:5px 14px;border-radius:100px;background:linear-gradient(135deg,#b87333,#d4a017);color:#fff;font-size:10px;font-weight:800;letter-spacing:.08em;text-transform:uppercase;box-shadow:0 4px 16px rgba(184,115,51,.4);}
        .gal-main__zoom-hint{position:absolute;bottom:44px;right:12px;z-index:4;padding:4px 10px;border-radius:8px;background:rgba(0,0,0,.55);color:rgba(255,255,255,.8);font-size:10.5px;font-weight:600;transition:opacity .3s;pointer-events:none;}
        .gal-main__angle-label{position:absolute;bottom:14px;left:14px;z-index:4;padding:4px 12px;border-radius:8px;background:rgba(184,115,51,.85);color:#fff;font-size:11px;font-weight:700;letter-spacing:.06em;text-transform:uppercase;}
        .gal-zoom-modal{position:fixed;inset:0;z-index:9000;background:rgba(0,0,0,.92);backdrop-filter:blur(12px);display:flex;align-items:center;justify-content:center;flex-direction:column;gap:16px;cursor:zoom-out;padding:20px;animation:galZoomIn .25s ease;}
        @keyframes galZoomIn{from{opacity:0;}to{opacity:1;}}
        .gal-zoom-close{position:absolute;top:18px;right:18px;width:42px;height:42px;border-radius:50%;background:rgba(255,255,255,.12);border:1px solid rgba(255,255,255,.2);color:#fff;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:background .2s;z-index:2;}
        .gal-zoom-close:hover{background:rgba(255,255,255,.22);}
        .gal-zoom-full{max-width:90vw;max-height:82vh;border-radius:12px;object-fit:contain;cursor:default;box-shadow:0 20px 80px rgba(0,0,0,.6);animation:galZoomImg .3s cubic-bezier(.34,1.56,.64,1);}
        @keyframes galZoomImg{from{transform:scale(.9);opacity:0;}to{transform:scale(1);opacity:1;}}
        .gal-zoom-hint{font-size:12px;color:rgba(255,255,255,.4);letter-spacing:.05em;}
        @media(max-width:480px){.gal-root{flex-direction:column;max-width:100%;}.gal-thumbs{flex-direction:row;overflow-x:auto;}.gal-thumb{width:60px;height:60px;flex-shrink:0;}}
      `}</style>
    </>
  );
}

/* ══════════════════════════════════════════════════════════════
   PHOTO LIGHTBOX
══════════════════════════════════════════════════════════════ */
function PhotoLightbox({ photos, startIdx, onClose }) {
  const [idx, setIdx] = useState(startIdx);
  useEffect(() => {
    const h = e => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") setIdx(i => (i - 1 + photos.length) % photos.length);
      if (e.key === "ArrowRight") setIdx(i => (i + 1) % photos.length);
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [photos.length]);
  return (
    <div className="plb-bd" onClick={onClose}>
      <div className="plb-box" onClick={e => e.stopPropagation()}>
        <button className="plb-close" onClick={onClose}>{IC.close}</button>
        {photos.length > 1 && <>
          <button className="plb-arr plb-arr--l" onClick={() => setIdx(i => (i - 1 + photos.length) % photos.length)}>{IC.chevL}</button>
          <button className="plb-arr plb-arr--r" onClick={() => setIdx(i => (i + 1) % photos.length)}>{IC.chevR}</button>
        </>}
        <img src={typeof photos[idx] === "string" ? photos[idx] : photos[idx].url} alt="" className="plb-img" />
        {photos.length > 1 && <div className="plb-dots">{photos.map((_, i) => <span key={i} className={`plb-dot ${i === idx ? "plb-dot--on" : ""}`} onClick={() => setIdx(i)} />)}</div>}
      </div>
      <style>{`
        .plb-bd{position:fixed;inset:0;z-index:9100;background:rgba(0,0,0,.92);backdrop-filter:blur(10px);display:flex;align-items:center;justify-content:center;padding:20px;animation:plbIn .2s ease}
        @keyframes plbIn{from{opacity:0}to{opacity:1}}
        .plb-box{position:relative;max-width:860px;width:100%;display:flex;flex-direction:column;align-items:center;gap:16px}
        .plb-close{position:absolute;top:-14px;right:-14px;width:38px;height:38px;border-radius:50%;background:rgba(255,255,255,.15);border:1px solid rgba(255,255,255,.25);color:#fff;cursor:pointer;display:flex;align-items:center;justify-content:center;z-index:2;transition:background .2s}
        .plb-close:hover{background:rgba(255,255,255,.25)}
        .plb-arr{position:absolute;top:50%;transform:translateY(-50%);width:44px;height:44px;border-radius:50%;background:rgba(255,255,255,.12);border:1px solid rgba(255,255,255,.2);color:#fff;cursor:pointer;display:flex;align-items:center;justify-content:center;z-index:2;transition:all .25s}
        .plb-arr:hover{background:rgba(255,255,255,.22)}
        .plb-arr--l{left:-24px}.plb-arr--r{right:-24px}
        .plb-img{max-width:100%;max-height:75vh;border-radius:12px;object-fit:contain;box-shadow:0 20px 60px rgba(0,0,0,.6)}
        .plb-dots{display:flex;gap:8px;padding:4px}
        .plb-dot{width:8px;height:8px;border-radius:50%;background:rgba(255,255,255,.3);cursor:pointer;transition:all .2s}
        .plb-dot--on{background:#b87333;width:20px;border-radius:4px}
      `}</style>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   REVIEW PHOTO GRID
══════════════════════════════════════════════════════════════ */
function ReviewPhotoGrid({ photos }) {
  const [lb, setLb] = useState(null);
  if (!photos?.length) return null;
  return (
    <>
      {lb !== null && <PhotoLightbox photos={photos} startIdx={lb} onClose={() => setLb(null)} />}
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 12 }}>
        {photos.slice(0, 3).map((p, i) => (
          <div key={i} onClick={() => setLb(i)} style={{ width: 80, height: 80, borderRadius: 10, overflow: "hidden", cursor: "pointer", border: "2px solid rgba(184,115,51,.2)", transition: "transform .25s,border-color .25s", flexShrink: 0, position: "relative" }}
            onMouseEnter={e => { e.currentTarget.style.transform = "scale(1.06)"; e.currentTarget.style.borderColor = "rgba(184,115,51,.6)"; }}
            onMouseLeave={e => { e.currentTarget.style.transform = ""; e.currentTarget.style.borderColor = "rgba(184,115,51,.2)"; }}>
            <img src={typeof p === "string" ? p : p.url} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
            {i === 2 && photos.length > 3 && <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,.6)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 16, fontWeight: 700 }}>+{photos.length - 3}</div>}
          </div>
        ))}
      </div>
    </>
  );
}

/* ══════════════════════════════════════════════════════════════
   REVIEW FORM MODAL
══════════════════════════════════════════════════════════════ */
function ReviewFormModal({ productId, onSubmitted, onClose }) {
  const [form, setForm] = useState({ name: "", email: "", title: "", rating: 0, text: "", recommend: false });
  const [hovStar, setHovStar] = useState(0);
  const [customerImg, setCustomerImg] = useState(null);
  const [reviewImg, setReviewImg] = useState(null);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const custRef = useRef(null);
  const revRef = useRef(null);

  useEffect(() => {
    const h = e => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", h);
    document.body.style.overflow = "hidden";
    return () => { window.removeEventListener("keydown", h); document.body.style.overflow = ""; };
  }, []);

  const readFile = (file, setter) => {
    const r = new FileReader();
    r.onload = ev => setter({ url: ev.target.result, name: file.name });
    r.readAsDataURL(file);
  };

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Name is required";
    if (!form.email.trim()) e.email = "Email is required";
    if (form.rating === 0) e.rating = "Please select a rating";
    if (!form.text.trim() || form.text.length < 10) e.text = "Please write at least 10 characters";
    return e;
  };

  const handleSubmit = () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    setSubmitting(true);
    const d = new Date();
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const photos = [customerImg, reviewImg].filter(Boolean).map(p => p.url);
    const review = {
      id: `u_${Date.now()}`,
      name: form.name.trim(),
      avatar: form.name.trim().charAt(0).toUpperCase(),
      role: "Verified Buyer",
      badge: "Verified Purchase",
      location: "India",
      purchasedItem: null,
      rating: form.rating,
      title: form.title.trim() || "My Review",
      date: `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`,
      verified: false,
      helpful: 0,
      text: form.text.trim(),
      photos,
      recommend: form.recommend,
    };
    saveReview(productId, review);
    setTimeout(() => { setSubmitting(false); onSubmitted(review); }, 600);
  };

  const inputStyle = (hasError) => ({
    width: "100%", padding: "10px 14px", border: `1px solid ${hasError ? "#e05a5a" : "#d1d5db"}`,
    borderRadius: 6, fontSize: 14, color: "#111", background: "#fff",
    outline: "none", boxSizing: "border-box", fontFamily: "inherit",
    transition: "border-color .2s, box-shadow .2s",
  });

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 9500, background: "rgba(0,0,0,.55)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center", padding: "20px", animation: "rfmIn .25s ease" }}>
      <style>{`
        @keyframes rfmIn { from { opacity:0; } to { opacity:1; } }
        @keyframes rfmSlide { from { opacity:0; transform:translateY(20px) scale(.97); } to { opacity:1; transform:none; } }
        .rfm-input:focus { border-color: #1e3a5f !important; box-shadow: 0 0 0 3px rgba(30,58,95,.1) !important; }
        .rfm-star { background:none; border:none; cursor:pointer; padding:2px; transition:transform .15s; }
        .rfm-star:hover { transform:scale(1.2); }
        .rfm-browse { width:100%; padding:10px; border:1px solid #d1d5db; background:#f9fafb; border-radius:6px; cursor:pointer; font-size:13px; font-weight:600; color:#374151; transition:all .2s; text-align:center; }
        .rfm-browse:hover { background:#f0f4f8; border-color:#9ca3af; }
        .rfm-submit { width:auto; padding:12px 40px; background:#1e3a5f; color:#fff; border:none; border-radius:6px; font-size:15px; font-weight:700; cursor:pointer; transition:all .25s; letter-spacing:.02em; }
        .rfm-submit:hover:not(:disabled) { background:#162d4a; transform:translateY(-1px); box-shadow:0 6px 20px rgba(30,58,95,.35); }
        .rfm-submit:disabled { opacity:.65; cursor:not-allowed; }
      `}</style>
      <div style={{ background: "#fff", borderRadius: 10, width: "100%", maxWidth: 700, maxHeight: "92vh", overflowY: "auto", boxShadow: "0 25px 80px rgba(0,0,0,.35)", animation: "rfmSlide .3s cubic-bezier(.34,1.56,.64,1)", position: "relative" }}
        onClick={e => e.stopPropagation()}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "22px 28px 18px", borderBottom: "1px solid #e5e7eb" }}>
          <h2 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: "#111", fontFamily: "inherit" }}>Write a review</h2>
          <button onClick={onClose} style={{ width: 36, height: 36, borderRadius: 6, background: "#1e3a5f", border: "none", color: "#fff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: 18 }}>✕</button>
        </div>
        <div style={{ padding: "24px 28px 28px" }}>
          <div style={{ marginBottom: 18 }}>
            <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 6 }}>Name *</label>
            <input className="rfm-input" style={inputStyle(errors.name)} value={form.name}
              onChange={e => { setForm(f => ({ ...f, name: e.target.value })); setErrors(x => ({ ...x, name: "" })); }}
              placeholder="Enter Your Name" />
            {errors.name && <p style={{ fontSize: 11, color: "#e05a5a", margin: "4px 0 0" }}>{errors.name}</p>}
          </div>
          <div style={{ marginBottom: 18 }}>
            <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 6 }}>Email *</label>
            <input className="rfm-input" style={inputStyle(errors.email)} type="email" value={form.email}
              onChange={e => { setForm(f => ({ ...f, email: e.target.value })); setErrors(x => ({ ...x, email: "" })); }}
              placeholder="Enter Your Email" />
            {errors.email && <p style={{ fontSize: 11, color: "#e05a5a", margin: "4px 0 0" }}>{errors.email}</p>}
          </div>
          <div style={{ marginBottom: 18 }}>
            <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 8 }}>Rating *</label>
            <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
              {[1, 2, 3, 4, 5].map(n => (
                <button key={n} className="rfm-star" type="button"
                  onClick={() => { setForm(f => ({ ...f, rating: n })); setErrors(x => ({ ...x, rating: "" })); }}
                  onMouseEnter={() => setHovStar(n)} onMouseLeave={() => setHovStar(0)}>
                  {IC.star(28, n <= (hovStar || form.rating) ? "#f5a623" : "#d1d5db")}
                </button>
              ))}
              {form.rating > 0 && <span style={{ fontSize: 13, color: "#6b7280", marginLeft: 8 }}>{["", "Poor", "Fair", "Good", "Very Good", "Excellent"][form.rating]}</span>}
            </div>
            {errors.rating && <p style={{ fontSize: 11, color: "#e05a5a", margin: "4px 0 0" }}>{errors.rating}</p>}
          </div>
          <div style={{ marginBottom: 18 }}>
            <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 6 }}>Review Title</label>
            <input className="rfm-input" style={inputStyle(false)} value={form.title}
              onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
              placeholder="Give your review a title" maxLength={80} />
          </div>
          <div style={{ marginBottom: 18 }}>
            <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 6 }}>Body of Review *</label>
            <textarea className="rfm-input" style={{ ...inputStyle(errors.text), resize: "vertical", minHeight: 120, lineHeight: 1.6 }}
              value={form.text}
              onChange={e => { setForm(f => ({ ...f, text: e.target.value })); setErrors(x => ({ ...x, text: "" })); }}
              placeholder="Write your comments here" rows={5} />
            {errors.text && <p style={{ fontSize: 11, color: "#e05a5a", margin: "4px 0 0" }}>{errors.text}</p>}
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 20 }}>
            <div>
              <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 8 }}>Customer Image</label>
              {customerImg ? (
                <div style={{ position: "relative", height: 90, borderRadius: 8, overflow: "hidden", border: "1px solid #d1d5db" }}>
                  <img src={customerImg.url} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  <button onClick={() => setCustomerImg(null)} style={{ position: "absolute", top: 4, right: 4, width: 22, height: 22, borderRadius: "50%", background: "rgba(0,0,0,.65)", border: "none", color: "#fff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12 }}>✕</button>
                </div>
              ) : (
                <button className="rfm-browse" onClick={() => custRef.current?.click()}>Browse</button>
              )}
              <input ref={custRef} type="file" accept="image/*" style={{ display: "none" }} onChange={e => e.target.files[0] && readFile(e.target.files[0], setCustomerImg)} />
            </div>
            <div>
              <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 8 }}>Review Image</label>
              {reviewImg ? (
                <div style={{ position: "relative", height: 90, borderRadius: 8, overflow: "hidden", border: "1px solid #d1d5db" }}>
                  <img src={reviewImg.url} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  <button onClick={() => setReviewImg(null)} style={{ position: "absolute", top: 4, right: 4, width: 22, height: 22, borderRadius: "50%", background: "rgba(0,0,0,.65)", border: "none", color: "#fff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12 }}>✕</button>
                </div>
              ) : (
                <button className="rfm-browse" onClick={() => revRef.current?.click()}>Browse</button>
              )}
              <input ref={revRef} type="file" accept="image/*" style={{ display: "none" }} onChange={e => e.target.files[0] && readFile(e.target.files[0], setReviewImg)} />
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 24 }}>
            <input type="checkbox" id="recommend-check" checked={form.recommend}
              onChange={e => setForm(f => ({ ...f, recommend: e.target.checked }))}
              style={{ width: 16, height: 16, accentColor: "#1e3a5f", cursor: "pointer" }} />
            <label htmlFor="recommend-check" style={{ fontSize: 14, color: "#374151", cursor: "pointer" }}>
              Would you recommend this product?
            </label>
          </div>
          <button className="rfm-submit" onClick={handleSubmit} disabled={submitting}>
            {submitting ? "Submitting..." : "Submit Review"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   SHARED COMPONENTS
══════════════════════════════════════════════════════════════ */
function StarRow({ rating, size = 15 }) {
  return <span style={{ display: "inline-flex", alignItems: "center", gap: 2 }}>{[1, 2, 3, 4, 5].map(i => IC.star(size, i <= rating ? "#c8960c" : "#e0d5c7"))}</span>;
}
function Toast({ msg, show, type }) {
  return <div className={`pdp-toast pdp-toast--${type} ${show ? "pdp-toast--show" : ""}`}>{msg}</div>;
}
function SectionTitle({ eyebrow, title, subtitle, align = "center", light = false }) {
  const th = light ? "light" : "dark";
  return (
    <div className={`pdp-section-title pdp-section-title--${align}`}>
      {eyebrow && <p className={`pdp-section-title__eyebrow pdp-section-title__eyebrow--${th}`}>{eyebrow}</p>}
      <h2 className={`pdp-section-title__h pdp-section-title__h--${th}`}>{title}</h2>
      {subtitle && <p className={`pdp-section-title__sub pdp-section-title__sub--${th}`}>{subtitle}</p>}
      <div className={`pdp-section-title__line pdp-section-title__line--${th}`} />
    </div>
  );
}
function CareCard({ num, icon, title, desc, index }) {
  return (
    <div className="pdp-care-card" style={{ animationDelay: `${index * .1}s` }}>
      <div className="pdp-care-card__icon-wrap">
        <span style={{ fontSize: 18 }}>{icon}</span>
        <span className="pdp-care-card__num">{num}</span>
      </div>
      <div className="pdp-care-card__body">
        <h4 className="pdp-care-card__title">{title}</h4>
        <p className="pdp-care-card__desc">{desc}</p>
      </div>
    </div>
  );
}
function BenefitCard({ icon, title, desc, img, index }) {
  return (
    <div className="pdp-benefit-card" style={{ animationDelay: `${index * .07}s` }}>
      <div className="pdp-benefit-card__img-wrap">
        <img src={img} alt={title} className="pdp-benefit-card__img" loading="lazy" />
        <div className="pdp-benefit-card__img-overlay" />
        <span className="pdp-benefit-card__icon-badge">{icon}</span>
      </div>
      <div className="pdp-benefit-card__body">
        <h4 className="pdp-benefit-card__title">{title}</h4>
        <p className="pdp-benefit-card__desc">{desc}</p>
      </div>
    </div>
  );
}
function TickerBar({ items }) {
  const text = items.map(b => `✦  ${b.title}`).join("   ·   ");
  return (
    <div className="pdp-ticker">
      <div className="pdp-ticker__track">
        {[text, "   ·   ", text, "   ·   "].map((t, i) => <span key={i} className="pdp-ticker__item">{t}</span>)}
      </div>
    </div>
  );
}

/* ── FAQ TEASER ── */
function FAQTeaser({ navigate }) {
  const [openIdx, setOpenIdx] = useState(null);
  return (
    <div className="pdp-faq-section">
      <div className="pdp-faq-inner">
        <SectionTitle eyebrow="Got Questions?" title="Frequently Asked Questions" subtitle="Common questions about our traditional metalware — or visit our full FAQ page" />
        <div className="pdp-faq-grid">
          {FAQ_TEASER.map((faq, i) => (
            <div key={i} className={`pdp-faq-item ${openIdx === i ? "pdp-faq-item--open" : ""}`}>
              <button className={`pdp-faq-q ${openIdx === i ? "pdp-faq-q--open" : ""}`} onClick={() => setOpenIdx(openIdx === i ? null : i)}>
                <span>{faq.q}</span>
                <span className={`pdp-faq-icon ${openIdx === i ? "pdp-faq-icon--open" : ""}`}>{IC.plus}</span>
              </button>
              {openIdx === i && <div className="pdp-faq-a">{faq.a}</div>}
            </div>
          ))}
        </div>
        <div style={{ textAlign: "center", marginTop: 40 }}>
          <p style={{ color: "#9a8070", fontSize: 14, marginBottom: 16 }}>Have more questions? Visit our dedicated FAQ page for complete answers.</p>
          <button
            onClick={() => navigate("/FAQPage")}
            style={{ padding: "14px 40px", background: "linear-gradient(135deg,#1a0800,#4a2010)", color: "#d4a017", border: "1.5px solid rgba(212,160,23,.3)", borderRadius: 50, fontWeight: 700, fontSize: 14, cursor: "pointer", fontFamily: "'DM Sans',sans-serif", letterSpacing: ".04em", transition: "all .25s", boxShadow: "0 6px 24px rgba(26,8,0,.25)" }}
            onMouseOver={e => { e.currentTarget.style.background = "linear-gradient(135deg,#b87333,#d4a017)"; e.currentTarget.style.color = "#fff"; }}
            onMouseOut={e => { e.currentTarget.style.background = "linear-gradient(135deg,#1a0800,#4a2010)"; e.currentTarget.style.color = "#d4a017"; }}
          >
            📋 View All FAQs →
          </button>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   SIMILAR CARD  ✅ ENHANCED
   New: Add-to-cart button · wishlist heart · star ratings ·
        discount ribbon · out-of-stock overlay
══════════════════════════════════════════════════════════════ */
function SimilarCard({ product: p, index, navigate, addToCart }) {
  const [hovered, setHovered]     = useState(false);
  const [added, setAdded]         = useState(false);
  const [wishlisted, setWishlisted] = useState(() =>
    getWishlist().map(i => String(i._id || i.id || i)).includes(String(p._id || p.id))
  );

  const img      = resolveImg(p.image);
  const discount = Math.round(300 / (p.price + 300) * 100);

  const handleCart = (e) => {
    e.stopPropagation();
    if (!p.inStock || typeof addToCart !== "function") return;
    addToCart({ ...p, originalPrice: p.price + 300 });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleWish = (e) => {
    e.stopPropagation();
    toggleWishlist({
      id: p._id || p.id, _id: p._id || p.id,
      name: p.name, price: p.price, oldPrice: p.price + 300,
      image: img, category: p.category,
      shop: p.shop || p.shopName, rating: p.rating,
    });
    setWishlisted(w => !w);
  };

  const goToProduct = () => {
    navigate("/ProductDetail", { state: { product: p } });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div
      className="sim-card"
      style={{ animationDelay: `${index * .08}s` }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={goToProduct}
    >
      {/* ── Image area ── */}
      <div className="sim-img-wrap">
        {/* Discount ribbon */}
        {discount > 0 && (
          <div className="sim-ribbon">{discount}%<br />OFF</div>
        )}
        {/* Wishlist button */}
        <button
          className={`sim-wish-btn ${wishlisted ? "sim-wish-btn--on" : ""}`}
          onClick={handleWish}
          title={wishlisted ? "Remove from wishlist" : "Save to wishlist"}
        >
          {wishlisted ? "❤️" : "🤍"}
        </button>
        {/* Bestseller badge */}
        {p.rating >= 4.8 && (
          <div className="sim-best-badge">★ BESTSELLER</div>
        )}
        {/* Out of stock overlay */}
        {!p.inStock && (
          <div className="sim-oos-overlay"><span>Out of Stock</span></div>
        )}
        <img
          src={img} alt={p.name}
          className="sim-img"
          style={{ transform: hovered ? "scale(1.07)" : "scale(1)" }}
          onError={e => { e.target.src = "https://placehold.co/400x400?text=Product"; }}
        />
      </div>

      {/* ── Body ── */}
      <div className="sim-body">
        <span className="sim-cat">{p.category}</span>
        <h4 className="sim-name">{p.name}</h4>

        {/* Stars + review count */}
        <div className="sim-stars-row">
          <StarRow rating={Math.round(p.rating)} size={13} />
          <span className="sim-rating-num">{p.rating}</span>
          <span className="sim-review-cnt">({typeof p.reviews === "number" ? p.reviews : 0})</span>
        </div>

        {/* Price */}
        <div className="sim-price-row">
          <span className="sim-price">₹{p.price.toLocaleString()}</span>
          <span className="sim-old-price">₹{(p.price + 300).toLocaleString()}</span>
          <span className="sim-discount-pill">{discount}% off</span>
        </div>

        {/* Add to cart */}
        <button
          className={`sim-cart-btn ${added ? "sim-cart-btn--added" : ""} ${!p.inStock ? "sim-cart-btn--oos" : ""}`}
          onClick={handleCart}
          disabled={!p.inStock || added}
        >
          {added
            ? <><span>✓</span>&nbsp; Added!</>
            : !p.inStock
            ? "Out of Stock"
            : <>{IC.cart}&nbsp; Add to Cart</>
          }
        </button>
      </div>
    </div>
  );
}

function RecentlyViewed({ currentId, navigate }) {
  const [items, setItems] = useState([]);
  useEffect(() => { setItems(getRecentlyViewed().filter(p => p.id !== currentId)); }, [currentId]);
  if (!items.length) return null;
  return (
    <div className="pdp-recent-section">
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        <SectionTitle eyebrow="Your Journey" title="Recently Viewed" subtitle="Products you've explored — pick up where you left off" align="left" />
        <div className="pdp-recent-grid">
          {items.map((p, i) => (
            <div key={p.id} className="pdp-recent-card" style={{ animationDelay: `${i * .06}s` }}
              onClick={() => { navigate("/ProductDetail", { state: { product: allProducts.find(x => x.id === p.id) || p } }); window.scrollTo({ top: 0, behavior: "smooth" }); }}>
              <span className="pdp-recent-card__viewing">Viewed</span>
              <div className="pdp-recent-card__img-wrap"><img src={p.image} alt={p.name} className="pdp-recent-card__img" loading="lazy" /></div>
              <div className="pdp-recent-card__body">
                <span className="pdp-recent-card__cat">{p.category}</span>
                <p className="pdp-recent-card__name">{p.name}</p>
                <span className="pdp-recent-card__price">₹{p.price.toLocaleString()}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   MAIN EXPORT
══════════════════════════════════════════════════════════════ */
export default function ProductDetailPage({ Cart = [], addToCart, setSelectedProductForQuote }) {
  const navigate = useNavigate();
  const location = useLocation();

  const routeProduct = location.state?.product || null;
  const product = routeProduct ? (allProducts.find(p => p.id === routeProduct.id) || routeProduct) : null;

  const [selImg, setSelImg] = useState(0);
  const [qty, setQty] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);
  const [wishlistIds, setWishlistIds] = useState(() =>
    getWishlist().map(i => String(i._id || i.id || i))
  );
  const [toast, setToast] = useState({ msg: "", show: false, type: "wish" });
  const [activeTab, setActiveTab] = useState("description");
  const [reviews, setReviews] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [showAllRevs, setShowAllRevs] = useState(false);
  const [copied, setCopied] = useState(false);
  const [reviewRefresh, setReviewRefresh] = useState(0);

  // ── Fetch real backend products for "You May Also Like" ─────────
  // productsData export from ProductsPage is always [] (populated via async
  // state, not exported). We fetch the same API endpoint here directly so
  // the similar section shows REAL catalog products, not hardcoded ones.
  const [liveProducts, setLiveProducts] = useState([]);
  useEffect(() => {
    fetch("http://localhost:5000/api/products")
      .then(r => r.json())
      .then(data => {
        const arr = Array.isArray(data)
          ? data
          : Array.isArray(data.products) ? data.products : [];
        setLiveProducts(arr);
      })
      .catch(() => {}); // silent — fallback to extendedProducts
  }, []);
  const reviewsRef = useRef(null);

  useEffect(() => {
    if (!product) return;
    const saved = getSavedReviews(String(product._id || product.id));
    setReviews(saved);
    setShowAllRevs(false);
  }, [product?.id]);

  useEffect(() => { if (product) addToRecentlyViewed(product); }, [product?.id]);
  useEffect(() => { window.scrollTo({ top: 0, behavior: "smooth" }); }, [product?.id]);

  useEffect(() => {
    const sync = () => setWishlistIds(getWishlist().map(i => String(i._id || i.id || i)));
    window.addEventListener("wishlistUpdated", sync);
    return () => window.removeEventListener("wishlistUpdated", sync);
  }, []);

  const showToast = useCallback((msg, type = "wish") => {
    setToast({ msg, show: true, type });
    setTimeout(() => setToast(t => ({ ...t, show: false })), 2600);
  }, []);

  const pid = product ? String(product._id || product.id) : "";

  const displayReviewCount = useMemo(() => {
    if (!product) return 0;
    const bc = Array.isArray(product.reviews)
      ? product.reviews.length
      : (typeof product.reviews === "number" ? product.reviews : 0);
    return bc + getSavedReviews(pid).length;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pid, reviewRefresh]);

  if (!product) return (
    <div style={{ minHeight: "70vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 20, padding: "60px 20px", background: "#fdfaf5" }}>
      <div style={{ fontSize: 80 }}>🏺</div>
      <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 32, color: "#b87333", margin: 0 }}>Product Not Found</h2>
      <p style={{ color: "#888", fontSize: 15 }}>Please go back and select a valid product.</p>
      <button onClick={() => navigate(-1)} style={{ padding: "12px 32px", background: "linear-gradient(135deg,#b87333,#d4a017)", color: "#fff", border: "none", borderRadius: 10, fontWeight: 700, cursor: "pointer", fontSize: 15 }}>← Go Back</button>
    </div>
  );

  const benefits  = BENEFITS[product.category] || BENEFITS.Brass;

  // ── "You May Also Like" — REAL backend products first ──────────
  //
  // Priority:
  //   1. Same category from liveProducts  ← real backend (ProductsPage API)
  //   2. Same category from extendedProducts (hardcoded fallback)
  //   3. Any product from liveProducts    (if category has no siblings)
  //   4. Any product from extendedProducts (absolute last resort)
  //
  // Field normalisation handles MongoDB _id, missing inStock,
  // shopName vs shop, array-reviews, and lowercase categories.

  const currentPid      = String(product._id || product.id || "");
  const currentCategory = (product.category || "").toLowerCase().trim();

  const normalise = (p) => ({
    ...p,
    id:       p._id || p.id,
    name:     p.name     || "Unnamed Product",
    price:    Number(p.price)   || 0,
    image:    p.image    || p.img || "",
    category: p.category || p.type || "Brass",
    rating:   Number(p.rating)  || 4.5,
    reviews:  Array.isArray(p.reviews) ? p.reviews.length : (Number(p.reviews) || 0),
    shop:     p.shop || p.shopName || "Songir Artisan",
    inStock:  p.inStock !== undefined ? p.inStock : true,
  });

  const isCurrent = (p) => String(p._id || p.id || "") === currentPid;
  const isSameCat = (p) => (p.category || "").toLowerCase().trim() === currentCategory;

  // Priority pools
  const fromLiveSameCat = liveProducts.filter(p => !isCurrent(p) && isSameCat(p));
  const fromExtSameCat  = extendedProducts.filter(p => !isCurrent(p) && isSameCat(p));
  const fromLiveAny     = liveProducts.filter(p => !isCurrent(p));
  const fromExtAny      = extendedProducts.filter(p => !isCurrent(p));

  // Pick best available pool
  const rawPool =
    fromLiveSameCat.length > 0 ? fromLiveSameCat :
    fromExtSameCat.length  > 0 ? fromExtSameCat  :
    fromLiveAny.length     > 0 ? fromLiveAny     :
                                  fromExtAny;

  const displaySimilar = rawPool.slice(0, 4).map(normalise);

  // Track whether we're showing real catalog items (for subtitle text)
  const showingLive = fromLiveSameCat.length > 0 || fromLiveAny.length > 0;
  const isWish    = wishlistIds.includes(String(product._id || product.id));
  const cartQty   = Array.isArray(Cart) ? (Cart.find(i => i.id === product.id)?.quantity || 0) : 0;
  const discount  = Math.round(300 / (product.price + 300) * 100);
  const resolvedImg = resolveImg(product.image);
  const images    = [resolvedImg, resolvedImg, resolvedImg, resolvedImg];
  const catClass  = product.category === "Copper" ? "pdp-info__cat-badge--copper" : product.category === "Statue" ? "pdp-info__cat-badge--statue" : "pdp-info__cat-badge--brass";

  const handleAddToCart = () => {
    if (typeof addToCart !== "function" || !product.inStock) return;
    for (let i = 0; i < qty; i++) addToCart({ ...product, originalPrice: product.price + 300 });
    setAddedToCart(true);
    showToast(`🛒 ${qty} item${qty > 1 ? "s" : ""} added to cart`, "cart");
    setTimeout(() => setAddedToCart(false), 2400);
  };

  const handleWishlist = () => {
    const added = toggleWishlist({
      id: product._id || product.id, _id: product._id || product.id,
      name: product.name, price: product.price,
      oldPrice: product.price + 300, originalPrice: product.price + 300,
      image: resolvedImg, category: product.category,
      shop: product.shop || product.shopName, shopName: product.shop || product.shopName,
      rating: product.rating, reviews: product.reviews, inStock: product.inStock,
    });
    setWishlistIds(prev => added ? [...prev, pid] : prev.filter(id => id !== pid));
    showToast(added ? "❤️ Added to Wishlist" : "🗑️ Removed from Wishlist", "wish");
  };

  const handleQuote = () => {
    try { localStorage.setItem("songirQuoteProduct", JSON.stringify({ id: product.id, name: product.name, price: product.price, category: product.category, weight: product.weight, shop: product.shop, description: product.description, rating: product.rating, inStock: product.inStock })); } catch {}
    if (typeof setSelectedProductForQuote === "function") setSelectedProductForQuote(product);
    navigate("/QuotePage");
  };

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href)
      .then(() => { setCopied(true); showToast("🔗 Link copied!", "success"); setTimeout(() => setCopied(false), 2000); })
      .catch(() => showToast("🔗 Share this page URL", "success"));
  };

  const handleReviewSubmitted = (rev) => {
    setReviews(prev => [rev, ...prev]);
    setShowForm(false);
    setShowAllRevs(true);
    setReviewRefresh(r => r + 1);
    showToast("✅ Review submitted — Thank you!", "success");
    setTimeout(() => reviewsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 200);
  };

  return (
    <div style={{ fontFamily: "'DM Sans',sans-serif", background: "#fdfaf5", minHeight: "100vh", paddingBottom: 100 }}>
      <Toast msg={toast.msg} show={toast.show} type={toast.type} />

      {showForm && (
        <ReviewFormModal
          productId={pid}
          onSubmitted={handleReviewSubmitted}
          onClose={() => setShowForm(false)}
        />
      )}

      {/* BREADCRUMB */}
      <div className="pdp-breadcrumb">
        <div className="pdp-breadcrumb__inner">
          <div className="pdp-breadcrumb__trail">
            <button className="pdp-breadcrumb__back" onClick={() => navigate(-1)}>{IC.back} Back</button>
            <span className="pdp-breadcrumb__sep">/</span>
            {[["Home", "/"], ["Products", "/ProductsPage"], [product.name, null]].map(([label, path], i, arr) => (
              <React.Fragment key={i}>
                <span onClick={() => path && navigate(path)} className={`pdp-breadcrumb__crumb ${path ? "pdp-breadcrumb__crumb--link" : "pdp-breadcrumb__crumb--active"}`}>{label}</span>
                {i < arr.length - 1 && <span className="pdp-breadcrumb__sep">›</span>}
              </React.Fragment>
            ))}
          </div>
          <button className={`pdp-breadcrumb__share ${copied ? "pdp-breadcrumb__share--copied" : ""}`} onClick={handleShare}>{IC.share} {copied ? "Copied!" : "Share"}</button>
        </div>
      </div>

      {/* HERO */}
      <div style={{ display: "grid", gridTemplateColumns: "minmax(0,55%) minmax(0,45%)", gap: "3.5rem", maxWidth: 1280, margin: "0 auto", padding: "40px 48px 60px", alignItems: "start" }} className="pdp-hero-grid">
        <div style={{ position: "sticky", top: 90 }}>
          <ProductGallery images={images} selImg={selImg} setSelImg={setSelImg} />
        </div>
        <div className="pdp-info" style={{ minWidth: 0 }}>
          <div className="pdp-info__badges">
            <span className={`pdp-info__cat-badge ${catClass}`}>{product.category}</span>
            {product.inStock ? <span className="pdp-info__stock-in">{IC.checkG} In Stock</span> : <span className="pdp-info__stock-out">× Out of Stock</span>}
            <span className="pdp-info__sku">SKU: SNG-{String(product.id).padStart(4, "0")}</span>
          </div>
          <h1 className="pdp-info__title">{product.name}</h1>
          <div className="pdp-info__rating-row">
            <StarRow rating={Math.round(product.rating)} size={17} />
            <span className="pdp-info__rating-num">{product.rating}</span>
            <button className="pdp-info__review-link" onClick={() => reviewsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })}>
              {displayReviewCount} reviews
            </button>
            <span className="pdp-info__dot">·</span>
            <span className="pdp-info__shop">By <strong>{product.shop}</strong></span>
          </div>
          <div className="pdp-info__divider" />
          <div className="pdp-info__price-box">
            <div className="pdp-info__price-row">
              <span className="pdp-info__price-now">₹{product.price.toLocaleString()}</span>
              <span className="pdp-info__price-old">₹{(product.price + 300).toLocaleString()}</span>
              <span className="pdp-info__price-off">{discount}% OFF</span>
            </div>
            <p className="pdp-info__price-note">🏺 Authentic Songir Handicraft &nbsp;·&nbsp; 🤝 Direct from Artisan</p>
          </div>
          <div className="pdp-info__specs">
            {[
              ["Material", product.category === "Statue" ? "Panchadhatu / Brass" : product.category],
              ["Weight",   product.weight || "—"],
              ["Shop",     product.shop || product.shopName || "Songir Artisan"],
              ["Origin",   "Songir, Maharashtra"],
            ].map(([lbl, val]) => (
              <div key={lbl} className="pdp-info__spec">
                <div className="pdp-info__spec-label">{lbl}</div>
                <div className="pdp-info__spec-val">{val}</div>
              </div>
            ))}
          </div>
          <p className="pdp-info__desc">{product.description}</p>
          <div className="pdp-info__qty-row">
            <span className="pdp-info__qty-label">Quantity</span>
            <div className="pdp-info__qty-ctrl">
              <button className="pdp-info__qty-btn" onClick={() => setQty(q => Math.max(1, q - 1))}>−</button>
              <span className="pdp-info__qty-num">{qty}</span>
              <button className="pdp-info__qty-btn" onClick={() => setQty(q => q + 1)}>+</button>
            </div>
            {cartQty > 0 && <span className="pdp-info__cart-note">({cartQty} already in cart)</span>}
          </div>
          <div className="pdp-info__cta">
            <button
              onClick={handleAddToCart}
              disabled={!product.inStock}
              className={`pdp-info__btn-cart ${addedToCart ? "pdp-info__btn-cart--active" : !product.inStock ? "pdp-info__btn-cart--disabled" : "pdp-info__btn-cart--inactive"}`}
            >
              {addedToCart
                ? <><span style={{ fontSize: 18 }}>✓</span>&nbsp; Added to Cart!</>
                : <>{IC.cart}&nbsp;&nbsp;{product.inStock ? "Add to Cart" : "Out of Stock"}</>
              }
            </button>
            <button
              onClick={handleWishlist}
              className={`pdp-info__btn-wish ${isWish ? "pdp-info__btn-wish--on" : "pdp-info__btn-wish--off"}`}
            >
              {isWish ? "❤️  Saved to Wishlist" : "🤍  Add to Wishlist"}
            </button>
            <div className="pdp-info__btn-row-2">
              <button className="pdp-info__btn-quote" onClick={handleQuote}>📋 Get a Quote</button>
              <button className="pdp-info__btn-compare" onClick={() => navigate("/ComparePage", { state: { product } })}>⚖️ Compare</button>
            </div>
          </div>
        </div>
      </div>

      <TickerBar items={benefits} />

      {/* TABS */}
      <div className="pdp-tabs-bar">
        <div className="pdp-tabs-inner">
          {[["description", "Description"], ["specifications", "Specifications"], ["careGuide", "Care Guide"]].map(([key, label]) => (
            <button key={key} className={`pdp-tab ${activeTab === key ? "pdp-tab--active" : ""}`} onClick={() => setActiveTab(key)}>{label}</button>
          ))}
        </div>
      </div>
      <div className="pdp-tab-content">
        {activeTab === "description" && (
          <div className="pdp-desc-grid">
            <div>
              <h3 className="pdp-desc-heading">About This Product</h3>
              <p className="pdp-desc-p">{product.description}</p>
              <p className="pdp-desc-p">Each piece is crafted by master artisans who have dedicated their lives to preserving the traditional art of metalwork. The {product.category.toLowerCase()} used is of the highest purity, sourced responsibly to ensure longevity and authenticity.</p>
            </div>
            <div>
              <h3 className="pdp-desc-heading">A Gift of Legacy</h3>
              <p className="pdp-desc-p">A true heirloom — perfect for mindful families, health-conscious homes, or as a meaningful gift.</p>
              <ul className="pdp-desc-check-list">
                {["Sustainable & Long-Lasting — built for generations", "Handcrafted with centuries-old traditional techniques", "Enhanced cooking & serving experience daily", "Excellent heat retention and responsiveness"].map((item, i) => (
                  <li key={i} className="pdp-desc-check-item">
                    <span className="pdp-desc-check-icon">{IC.check}</span>
                    <span style={{ color: "#5a4030", fontSize: 14.5, lineHeight: 1.6 }}>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
        {activeTab === "specifications" && (
          <div className="pdp-specs-table">
            {[
              ["Product Name",   product.name],
              ["Category",       product.category],
              ["Material",       product.category === "Statue" ? "Panchadhatu / Pure Brass" : product.category],
              ["Weight",         product.weight],
              ["Origin",         "Songir, Maharashtra"],
              ["Crafted By",     product.shop],
              ["Average Rating", `${product.rating} / 5.0 ⭐`],
              ["Total Reviews",  `${displayReviewCount} reviews`],
              ["Availability",   product.inStock ? "✓ In Stock" : "× Out of Stock"],
              ["MRP",            `₹${(product.price + 300).toLocaleString()}`],
              ["Offer Price",    `₹${product.price.toLocaleString()} (${discount}% OFF)`],
            ].map(([key, val], i) => (
              <div key={key} className={`pdp-specs-row pdp-specs-row--${i % 2 === 0 ? "even" : "odd"}`}>
                <span className="pdp-specs-key">{key}</span>
                <span className="pdp-specs-val">{val}</span>
              </div>
            ))}
          </div>
        )}
        {activeTab === "careGuide" && (
          <div>
            <p style={{ textAlign: "center", color: "#7a5c3a", fontSize: 15, lineHeight: 1.8, maxWidth: 580, margin: "0 auto 44px" }}>
              Utensils can be cleaned just like your other kitchenware.<br />For bringing back the full shine, follow these four steps:
            </p>
            <div className="pdp-care-grid">
              {CARE_STEPS.map((step, i) => <CareCard key={i} {...step} index={i} />)}
            </div>
          </div>
        )}
      </div>

      {/* BENEFITS */}
      <div className="pdp-benefits-section">
        <div style={{ maxWidth: 1280, margin: "0 auto", position: "relative", zIndex: 1 }}>
          <SectionTitle eyebrow={`Why ${product.category}?`} title={`Why Is ${product.category} Essential For You?`} subtitle="Discover the ancient wisdom behind traditional metalware cherished for thousands of years" align="center" light />
          <div className="pdp-benefits-grid">
            {benefits.map((b, i) => <BenefitCard key={i} {...b} index={i} />)}
          </div>
        </div>
      </div>

      {/* CARE */}
      <div className="pdp-care-section">
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <SectionTitle eyebrow="Care Instructions" title="Maintain the Shine" subtitle="Simple, time-tested care steps to keep your utensils gleaming beautifully for generations" />
          <div className="pdp-care-grid">
            {CARE_STEPS.map((step, i) => <CareCard key={i} {...step} index={i} />)}
          </div>
        </div>
      </div>

      {/* VIDEO REELS */}
      <div className="pdp-videos-section">
        <div style={{ maxWidth: 1280, margin: "0 auto", position: "relative", zIndex: 1 }}>
          <SectionTitle eyebrow="Watch & Learn" title="Expert Video Gallery" subtitle="Tap to play inline — crafting process, health benefits & care guides" align="center" light />
          <VideoReelsSection videos={VIDEOS} />
        </div>
      </div>

      {/* REVIEWS */}
      <div className="pdp-reviews-section" ref={reviewsRef}>
        <div className="pdp-reviews-inner">
          <ProductReviews productId={product._id || product.id} />
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════
          YOU MAY ALSO LIKE  ✅ ENHANCED
          • Add-to-cart on each card (with ✓ success state)
          • Wishlist heart toggle
          • Star ratings + review count
          • Discount ribbon
          • "View All" button
      ══════════════════════════════════════════════════════════ */}
      {displaySimilar.length > 0 && (
        <div className="pdp-similar-section">
          <div style={{ maxWidth: 1280, margin: "0 auto" }}>

            {/* Header row */}
            <div className="pdp-similar-header">
              <div>
                <p className="pdp-similar-eyebrow">✦ Handcrafted in Songir</p>
                <h2 className="pdp-similar-title">You May Also Like</h2>
                <p className="pdp-similar-subtitle">
                  {fromLiveSameCat.length > 0
                    ? `More ${product.category} pieces from our catalog`
                    : fromExtSameCat.length > 0
                    ? `More ${product.category} pieces you might love`
                    : "More handcrafted pieces from our collection"}
                </p>
              </div>
              <button
                className="pdp-similar-view-all"
                onClick={() => navigate("/ProductsPage")}
              >
                {fromLiveSameCat.length > 0 || fromExtSameCat.length > 0
                  ? `View All ${product.category} →`
                  : "Browse All Products →"}
              </button>
            </div>

            {/* Cards grid */}
            <div className="pdp-similar-grid">
              {displaySimilar.map((p, i) => (
                <SimilarCard
                  key={String(p._id || p.id)}
                  product={p}
                  index={i}
                  navigate={navigate}
                  addToCart={addToCart}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* FAQ */}
      <FAQTeaser navigate={navigate} />

      {/* ══════════════════════════════════════════════════════════
          ALL STYLES
      ══════════════════════════════════════════════════════════ */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400&family=DM+Sans:wght@300;400;500;600;700&family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&display=swap');

        /* ── You May Also Like section wrapper ── */
        .pdp-similar-section {
          padding: 80px 48px;
          background: linear-gradient(135deg, #fdf6ee 0%, #fdfaf5 100%);
        }

        /* ── Header ── */
        .pdp-similar-header {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          margin-bottom: 44px;
          flex-wrap: wrap;
          gap: 16px;
        }
        .pdp-similar-eyebrow {
          font-family: 'Cormorant Garamond', serif;
          font-size: 15px; color: #8b7355;
          margin: 0 0 10px; letter-spacing: .05em;
        }
        .pdp-similar-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: 40px; font-weight: 600; color: #2c1810;
          margin: 0 0 10px; line-height: 1.1;
        }
        .pdp-similar-subtitle {
          font-family: 'DM Sans', sans-serif;
          font-size: 14px; color: #9a8070; margin: 0;
        }
        .pdp-similar-view-all {
          padding: 12px 28px;
          background: transparent;
          border: 1.5px solid #b87333;
          color: #b87333;
          border-radius: 50px;
          font-size: 13px; font-weight: 700;
          cursor: pointer;
          font-family: 'DM Sans', sans-serif;
          transition: all .25s;
          white-space: nowrap;
          flex-shrink: 0;
        }
        .pdp-similar-view-all:hover {
          background: linear-gradient(135deg,#b87333,#d4a017);
          color: #fff; border-color: transparent;
          box-shadow: 0 6px 20px rgba(184,115,51,.3);
        }

        /* ── Cards grid ── */
        .pdp-similar-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 22px;
        }
        @media(max-width:1100px) { .pdp-similar-grid { grid-template-columns: repeat(2,1fr); } }
        @media(max-width:580px) {
          .pdp-similar-grid { grid-template-columns: 1fr; }
          .pdp-similar-section { padding: 60px 20px; }
          .pdp-similar-title { font-size: 30px; }
        }

        /* ── Individual card ── */
        .sim-card {
          background: #fff;
          border-radius: 14px;
          overflow: hidden;
          cursor: pointer;
          border: 1.5px solid rgba(184,115,51,.1);
          transition: transform .3s ease, box-shadow .3s, border-color .3s;
          animation: simIn .45s ease both;
          display: flex;
          flex-direction: column;
        }
        @keyframes simIn {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: none; }
        }
        .sim-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 22px 52px rgba(184,115,51,.18);
          border-color: #d4a017;
        }

        /* image */
        .sim-img-wrap {
          position: relative;
          height: 260px;
          overflow: hidden;
          background: linear-gradient(145deg,#fdf8f2,#f5e8d0);
          flex-shrink: 0;
        }
        .sim-img {
          width: 100%; height: 100%; object-fit: cover; display: block;
          transition: transform .45s cubic-bezier(.4,0,.2,1);
        }
        .sim-ribbon {
          position: absolute; top: 0; right: 0; z-index: 4;
          background: linear-gradient(135deg,#b87333,#d4a017);
          color: #fff; font-size: 10px; font-weight: 800;
          text-align: center; padding: 6px 10px; line-height: 1.25;
          border-bottom-left-radius: 10px; letter-spacing: .04em;
          box-shadow: -2px 2px 8px rgba(0,0,0,.2);
        }
        .sim-wish-btn {
          position: absolute; top: 10px; left: 10px; z-index: 4;
          width: 36px; height: 36px; border-radius: 50%;
          background: rgba(255,255,255,.92);
          border: 1.5px solid rgba(184,115,51,.25);
          cursor: pointer; font-size: 16px;
          display: flex; align-items: center; justify-content: center;
          transition: transform .2s, box-shadow .2s;
          box-shadow: 0 2px 8px rgba(0,0,0,.1);
        }
        .sim-wish-btn:hover { transform: scale(1.15); box-shadow: 0 4px 14px rgba(0,0,0,.15); }
        .sim-wish-btn--on { background: #fff5f5; border-color: #e87070; }
        .sim-best-badge {
          position: absolute; bottom: 10px; left: 10px; z-index: 4;
          background: linear-gradient(135deg,#b87333,#d4a017);
          color: #fff; font-size: 9px; font-weight: 800;
          padding: 3px 10px; border-radius: 20px;
          letter-spacing: .12em; text-transform: uppercase;
          box-shadow: 0 4px 12px rgba(184,115,51,.4);
        }
        .sim-oos-overlay {
          position: absolute; inset: 0; z-index: 3;
          background: rgba(0,0,0,.45);
          display: flex; align-items: center; justify-content: center;
        }
        .sim-oos-overlay span {
          color: #fff; font-size: 13px; font-weight: 700;
          background: rgba(0,0,0,.65);
          padding: 6px 18px; border-radius: 6px; letter-spacing: .06em;
        }

        /* body */
        .sim-body {
          padding: 16px 18px 20px;
          display: flex; flex-direction: column; gap: 6px;
          flex: 1;
        }
        .sim-cat {
          font-size: 10px; font-weight: 800; color: #b87333;
          text-transform: uppercase; letter-spacing: 1.4px;
          font-family: 'DM Sans', sans-serif;
        }
        .sim-name {
          font-family: 'Cormorant Garamond', serif;
          font-size: 19px; font-weight: 600; color: #1a0800; line-height: 1.3;
          margin: 0;
          display: -webkit-box; -webkit-line-clamp: 2;
          -webkit-box-orient: vertical; overflow: hidden;
        }
        .sim-stars-row {
          display: flex; align-items: center; gap: 5px;
        }
        .sim-rating-num {
          font-size: 12px; font-weight: 700; color: #b87333;
        }
        .sim-review-cnt {
          font-size: 11px; color: #aaa;
        }
        .sim-price-row {
          display: flex; align-items: center; gap: 8px; flex-wrap: wrap;
        }
        .sim-price {
          font-family: 'Cormorant Garamond', serif;
          font-size: 21px; font-weight: 700; color: #92400e;
        }
        .sim-old-price {
          font-size: 13px; color: #b0a090; text-decoration: line-through;
        }
        .sim-discount-pill {
          font-size: 10px; font-weight: 800; color: #fff;
          background: linear-gradient(135deg,#b87333,#d4a017);
          padding: 2px 7px; border-radius: 20px; letter-spacing: .04em;
        }

        /* Add to cart button */
        .sim-cart-btn {
          margin-top: 8px;
          width: 100%; padding: 11px 0;
          background: linear-gradient(135deg,#b87333,#d4a017);
          color: #fff; border: none; border-radius: 8px;
          font-size: 13px; font-weight: 700; cursor: pointer;
          display: flex; align-items: center; justify-content: center; gap: 6px;
          transition: all .25s;
          letter-spacing: .03em;
          font-family: 'DM Sans', sans-serif;
        }
        .sim-cart-btn:hover:not(:disabled) {
          background: linear-gradient(135deg,#a06428,#c49010);
          box-shadow: 0 6px 20px rgba(184,115,51,.38);
          transform: translateY(-1px);
        }
        .sim-cart-btn--added {
          background: linear-gradient(135deg,#2d7a4f,#3aad6e) !important;
        }
        .sim-cart-btn--oos {
          background: #e0d5c5 !important;
          color: #a09080 !important;
          cursor: not-allowed !important;
        }
        .sim-cart-btn:disabled { opacity: .9; }

        /* ── Videos section ── */
        .pdp-videos-section {
          background: linear-gradient(135deg, #5d1300 0%, #5d1300 100%);
          padding: 88px 48px;
          position: relative;
        }
        .pdp-videos-section .pdp-section-title__h { color: #fff !important; }
        .pdp-videos-section .pdp-section-title__eyebrow--dark { color: #d4a017 !important; }
        .pdp-videos-section .pdp-section-title__sub--dark { color: rgba(255,255,255,.55) !important; }
        .pdp-videos-section .pdp-section-title__line--dark { background: linear-gradient(90deg,transparent,#d4a017,transparent) !important; }

        /* ── Responsive hero ── */
        @media(max-width:900px) {
          .pdp-hero-grid { grid-template-columns: 1fr !important; padding: 24px 20px 40px !important; }
        }
        @media(max-width:640px) {
          .pdp-similar-section { padding: 48px 16px; }
          .pdp-videos-section  { padding: 60px 16px; }
        }
      `}</style>
    </div>
  );
}