import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styled, { ThemeProvider, keyframes, createGlobalStyle } from "styled-components";
import {
  ChevronRight, Award, Heart, CheckCircle, TrendingUp, Truck, Users, Star,
  MapPin, Package, ShoppingBag, Sparkles, Clock, Eye, ArrowRight, BadgeCheck,
  ShoppingCart, CheckCircle2
} from "lucide-react";
import artisanCrafting from "../Assets/artisan-crafting.png";
import { useWishlist } from "../context/WishlistContext";
import { toggleWishlist } from "../utils/wishlistUtils";
import QuickViewModal from "../components/QuickViewModal";

/* ── Google Fonts — Playfair Display + DM Sans ── */
const GlobalFonts = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600;9..40,700&display=swap');
`;

const theme = {
  colors: {
    copperBrown: "#B87333", brassGold: "#C9A44C", cream: "#FFF6E5",
    darkBrown: "#3E2723", lightText: "#6D4C41", white: "#FFFFFF",
    cardBg: "#FFFBF5",
    goldGradient: "linear-gradient(135deg, #421a0c 0%, #B87333 100%)",
    copperGradient: "linear-gradient(135deg, #B87333 0%, #8B5A2B 100%)",
    creamGradient: "linear-gradient(135deg, #FFF6E5 0%, #FFE4B5 100%)",
  },
  shadows: {
    small: "0 4px 12px rgba(184, 115, 51, 0.1)",
    medium: "0 8px 24px rgba(184, 115, 51, 0.15)",
    large: "0 16px 48px rgba(184, 115, 51, 0.2)",
    glow: "0 0 20px rgba(201, 164, 76, 0.3)",
  }
};

/* ─── ANIMATIONS ─── */
const fadeIn = keyframes`from{opacity:0;transform:translateY(30px)}to{opacity:1;transform:translateY(0)}`;
const slideInLeft = keyframes`from{opacity:0;transform:translateX(-50px)}to{opacity:1;transform:translateX(0)}`;
const slideInRight = keyframes`from{opacity:0;transform:translateX(50px)}to{opacity:1;transform:translateX(0)}`;
const scaleIn = keyframes`from{opacity:0;transform:scale(0.8)}to{opacity:1;transform:scale(1)}`;
const float = keyframes`0%,100%{transform:translateY(0px)}50%{transform:translateY(-10px)}`;
const rotate = keyframes`from{transform:rotate(0deg)}to{transform:rotate(360deg)}`;
const shimmerSlide = keyframes`0%{transform:translateX(-100%)}100%{transform:translateX(100%)}`;

const GlobalWrapper = styled.div`
  font-family: 'DM Sans', "Inter", -apple-system, BlinkMacSystemFont, sans-serif;
  background: ${({ theme }) => theme.colors.cream};
  color: ${({ theme }) => theme.colors.darkBrown};
  min-height: 100vh;
  overflow-x: hidden;
`;

const Container = styled.div`
  max-width: 1400px;
  margin: auto;
  padding: 0 2rem;
  @media (max-width: 768px) { padding: 0 1rem; }
`;

const DecorativePattern = styled.div`
  position: absolute;
  width: 300px; height: 300px;
  background: radial-gradient(circle, rgba(201, 164, 76, 0.1) 0%, transparent 70%);
  border-radius: 50%; z-index: 0; pointer-events: none;
  animation: ${float} 6s ease-in-out infinite;
  &.top-left { top: -100px; left: -100px; }
  &.bottom-right { bottom: -100px; right: -100px; }
`;

const HeroSection = styled.section`
  padding: 4rem 0 6rem;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 5rem;
  align-items: center;
  position: relative;
  overflow: hidden;
  @media (max-width: 968px) { grid-template-columns: 1fr; padding: 2rem 0 4rem; gap: 3rem; }
`;

const HeroContent = styled.div`
  animation: ${slideInLeft} 1s ease-out;
  z-index: 1;
  h1 {
    font-family: "Playfair Display", "Cormorant Garamond", Georgia, serif;
    font-size: 3.8rem;
    color: ${({ theme }) => theme.colors.darkBrown};
    margin-bottom: 1.5rem;
    line-height: 1.2;
    font-weight: 700;
    background: ${({ theme }) => theme.colors.goldGradient};
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    @media (max-width: 768px) { font-size: 2.5rem; }
  }
`;

const HeroSubtitle = styled.p`
  font-size: 1.25rem;
  color: ${({ theme }) => theme.colors.lightText};
  margin-bottom: 2.5rem;
  line-height: 1.8;
`;

const ButtonGroup = styled.div`display: flex; gap: 1.2rem; flex-wrap: wrap;`;

const Button = styled.button`
  background: ${({ theme }) => theme.colors.goldGradient};
  color: white; border: none;
  padding: 1.1rem 2.5rem; border-radius: 50px;
  font-weight: 600; font-size: 1rem; cursor: pointer;
  display: inline-flex; align-items: center; gap: 0.6rem;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: ${({ theme }) => theme.shadows.medium};
  position: relative; overflow: hidden;
  &::before { content: ''; position: absolute; top: 0; left: -100%; width: 100%; height: 100%; background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent); transition: left 0.5s; }
  &:hover::before { left: 100%; }
  &:hover { transform: translateY(-3px) scale(1.02); box-shadow: ${({ theme }) => theme.shadows.large}; }
  &:active { transform: translateY(-1px) scale(0.98); }
  &.secondary {
    background: transparent; color: ${({ theme }) => theme.colors.copperBrown};
    border: 2.5px solid ${({ theme }) => theme.colors.copperBrown}; box-shadow: none;
    &:hover { background: ${({ theme }) => theme.colors.copperBrown}; color: white; }
  }
  svg { transition: transform 0.3s ease; }
  &:hover svg { transform: translateX(5px); }
`;

const HeroImage = styled.div`
  height: 550px; border-radius: 24px; overflow: hidden; position: relative;
  animation: ${slideInRight} 1s ease-out;
  box-shadow: ${({ theme }) => theme.shadows.large};
  background: ${({ theme }) => theme.colors.goldGradient}; padding: 3px;
  img { width: 100%; height: 100%; object-fit: cover; border-radius: 20px; transition: transform 0.5s ease; }
  &:hover img { transform: scale(1.05); }
  @media (max-width: 968px) { height: 400px; }
`;

const SectionHeader = styled.div`
  text-align: center; margin-bottom: 4rem; animation: ${fadeIn} 1s ease-out;
  h6 { color: ${({ theme }) => theme.colors.copperBrown}; font-size: 0.95rem; text-transform: uppercase; letter-spacing: 3px; margin-bottom: 0.8rem; font-weight: 700; position: relative; display: inline-block;
    &::after { content: ''; position: absolute; bottom: -8px; left: 50%; transform: translateX(-50%); width: 60px; height: 3px; background: ${({ theme }) => theme.colors.goldGradient}; border-radius: 2px; }
  }
  h2 { font-family: "Playfair Display", "Cormorant Garamond", Georgia, serif; font-size: 3rem; color: ${({ theme }) => theme.colors.darkBrown}; margin-bottom: 1.2rem; margin-top: 1.5rem; font-weight: 700; }
  p { color: ${({ theme }) => theme.colors.lightText}; font-size: 1.15rem; max-width: 750px; margin: 0 auto; line-height: 1.8; }
`;

const PromiseSection = styled.section`padding: 6rem 0; background: ${({ theme }) => theme.colors.cream}; position: relative;`;
const PromiseGrid = styled.div`
  display: grid; grid-template-columns: repeat(3, 1fr); gap: 2.5rem; margin-top: 3rem;
  @media (max-width: 968px) { grid-template-columns: repeat(2, 1fr); }
  @media (max-width: 640px) { grid-template-columns: 1fr; }
`;
const PromiseCard = styled.div`
  background: white; padding: 2.5rem; border-radius: 20px; box-shadow: ${({ theme }) => theme.shadows.small};
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1); border: 2px solid transparent; position: relative; overflow: hidden;
  animation: ${fadeIn} 1s ease-out; animation-delay: ${props => props.delay || '0s'}; animation-fill-mode: both;
  &::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 4px; background: ${({ theme }) => theme.colors.goldGradient}; transform: scaleX(0); transition: transform 0.4s ease; }
  &:hover::before { transform: scaleX(1); }
  &:hover { transform: translateY(-8px); box-shadow: ${({ theme }) => theme.shadows.large}; border-color: ${({ theme }) => theme.colors.brassGold}; }
`;
const IconWrapper = styled.div`
  width: 70px; height: 70px; background: ${({ theme }) => theme.colors.creamGradient}; border-radius: 16px;
  display: flex; align-items: center; justify-content: center; margin-bottom: 1.8rem;
  color: ${({ theme }) => theme.colors.copperBrown}; box-shadow: ${({ theme }) => theme.shadows.small}; transition: all 0.4s ease;
  ${PromiseCard}:hover & { transform: scale(1.1) rotate(5deg); box-shadow: ${({ theme }) => theme.shadows.glow}; }
`;
const CardTitle = styled.h3`font-size: 1.4rem; color: ${({ theme }) => theme.colors.darkBrown}; margin-bottom: 1rem; font-weight: 700;`;
const CardDescription = styled.p`color: ${({ theme }) => theme.colors.lightText}; line-height: 1.7; font-size: 1rem;`;

/* ─── SHOPKEEPERS ─── */
const ShopkeepersSection = styled.section`padding: 6rem 0; background: ${({ theme }) => theme.colors.cardBg}; position: relative;`;
const ShopkeepersHeader = styled.div`
  display: flex; justify-content: space-between; align-items: center; margin-bottom: 4rem; animation: ${fadeIn} 1s ease-out;
  h6 { color: ${({ theme }) => theme.colors.copperBrown}; font-size: 0.95rem; text-transform: uppercase; letter-spacing: 3px; margin-bottom: 0.5rem; font-weight: 700; }
  h2 { font-family: "Playfair Display", "Cormorant Garamond", Georgia, serif; font-size: 2.5rem; color: ${({ theme }) => theme.colors.darkBrown}; font-weight: 700; }
  @media (max-width: 768px) { flex-direction: column; align-items: flex-start; gap: 1.5rem; }
`;
const ViewAllButton = styled.button`
  background: transparent; color: ${({ theme }) => theme.colors.copperBrown}; border: 2.5px solid ${({ theme }) => theme.colors.copperBrown};
  padding: 0.9rem 2rem; border-radius: 50px; font-weight: 600; cursor: pointer; transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  display: inline-flex; align-items: center; gap: 0.5rem;
  &:hover { background: ${({ theme }) => theme.colors.copperBrown}; color: white; transform: translateX(5px); box-shadow: ${({ theme }) => theme.shadows.medium}; }
  svg { transition: transform 0.3s ease; }
  &:hover svg { transform: translateX(5px); }
`;
const ShopkeepersGrid = styled.div`
  display: grid; grid-template-columns: repeat(3, 1fr); gap: 2.5rem;
  @media (max-width: 968px) { grid-template-columns: repeat(2, 1fr); }
  @media (max-width: 640px) { grid-template-columns: 1fr; }
`;
const RealShopCard = styled.div`
  background: white; border-radius: 20px; overflow: hidden;
  box-shadow: 0 4px 24px rgba(62,39,35,0.08); border: 1px solid rgba(201,164,76,0.18);
  transition: all 0.3s cubic-bezier(0.4,0,0.2,1); position: relative;
  animation: ${scaleIn} 0.8s ease-out; animation-delay: ${props => props.delay || '0s'}; animation-fill-mode: both; cursor: pointer;
  &:hover { transform: translateY(-10px); box-shadow: 0 28px 60px rgba(62,39,35,0.16); border-color: ${({ theme }) => theme.colors.brassGold}; }
`;
const VerifiedCorner = styled.div`
  position: absolute; top: 14px; right: 14px; z-index: 2;
  display: inline-flex; align-items: center; gap: 0.3rem;
  background: linear-gradient(135deg,#27AE60,#1E8449); color: white;
  padding: 0.28rem 0.75rem; border-radius: 20px; font-size: 0.75rem; font-weight: 700;
`;
const CardTop = styled.div`
  background: linear-gradient(160deg,#FAF3E8 0%,#F5EBD8 100%);
  padding: 2.2rem 2rem 1.5rem;
  display: flex; flex-direction: column; align-items: center; text-align: center;
  border-bottom: 1px solid rgba(201,164,76,0.15);
`;
const ShopAvatarCircle = styled.div`
  width: 80px; height: 80px; background: linear-gradient(135deg,#B87333,#C9A44C);
  border-radius: 50%; display: flex; align-items: center; justify-content: center;
  font-size: 1.8rem; font-weight: 700; color: #FFF8EE; font-family: "Playfair Display", Georgia, serif;
  box-shadow: 0 6px 20px rgba(184,115,51,0.3); margin-bottom: 1rem; overflow: hidden;
`;
const ShopNameBold = styled.h3`font-size: 1.3rem; font-weight: 700; color: #2C1810; margin: 0 0 0.3rem; font-family: "Playfair Display", Georgia, serif;`;
const ShopOwnerSub = styled.p`font-size: 0.88rem; color: #9E8E7E; margin: 0 0 0.7rem;`;
const StarsRow = styled.div`display: flex; align-items: center; gap: 4px;`;
const CardBottom = styled.div`padding: 1.4rem 1.8rem 1.8rem; background: white;`;
const ShopDesc = styled.p`font-size: 0.9rem; color: #5D4037; line-height: 1.7; margin-bottom: 1rem;`;
const InfoRow = styled.div`display: flex; gap: 0.8rem; flex-wrap: wrap; margin-bottom: 0.9rem;`;
const InfoChip = styled.div`display: flex; align-items: center; gap: 0.35rem; font-size: 0.8rem; color: #7D6E63;`;
const DaysRow = styled.div`display: flex; flex-wrap: wrap; gap: 0.35rem; margin-bottom: 1rem;`;
const DayPill = styled.span`
  background: rgba(184,115,51,0.07); color: #B87333;
  padding: 0.2rem 0.6rem; border-radius: 8px; font-size: 0.76rem; font-weight: 500;
  border: 1px solid rgba(184,115,51,0.15);
`;
const CardBtns = styled.div`display: flex; gap: 0.7rem; margin-top: 1rem;`;
const BtnPrimaryWide = styled.button`
  flex: 1; display: flex; align-items: center; justify-content: center; gap: 0.4rem;
  background: linear-gradient(135deg,#8B5E3C,#B87333); color: #FFF8EE; border: none;
  padding: 0.85rem 1rem; border-radius: 12px; font-size: 0.92rem; font-weight: 600;
  cursor: pointer; transition: all 0.22s;
  &:hover { box-shadow: 0 8px 28px rgba(184,115,51,0.45); transform: translateY(-2px); }
`;
const BtnGhostWide = styled.button`
  flex: 1; background: transparent; color: #8B5E3C; border: 1.5px solid rgba(139,94,60,0.4);
  padding: 0.85rem 1rem; border-radius: 12px; font-size: 0.92rem; font-weight: 500;
  cursor: pointer; transition: all 0.22s; text-align: center;
  &:hover { background: rgba(139,94,60,0.06); }
`;

/* ─── PRODUCTS ─── */
const UtensilsSection = styled.section`padding: 6rem 0; background: ${({ theme }) => theme.colors.cream}; position: relative;`;
const UtensilsGrid = styled.div`
  display: grid; grid-template-columns: repeat(4, 1fr); gap: 2.5rem; margin-top: 3rem;
  @media (max-width: 1200px) { grid-template-columns: repeat(3, 1fr); }
  @media (max-width: 968px) { grid-template-columns: repeat(2, 1fr); }
  @media (max-width: 640px) { grid-template-columns: 1fr; }
`;
const ProductCard = styled.div`
  background: white; border-radius: 20px; overflow: hidden; box-shadow: ${({ theme }) => theme.shadows.small};
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1); position: relative; border: 2px solid transparent;
  animation: ${fadeIn} 0.8s ease-out; animation-delay: ${props => props.delay || '0s'}; animation-fill-mode: both; cursor: pointer;
  &:hover { transform: translateY(-10px) scale(1.02); box-shadow: ${({ theme }) => theme.shadows.large}; border-color: ${({ theme }) => theme.colors.brassGold}; }
`;
const ProductImageBox = styled.div`
  height: 320px; background: ${({ theme }) => theme.colors.creamGradient};
  display: flex; align-items: center; justify-content: center; position: relative; overflow: hidden;
  img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.5s ease; }
  ${ProductCard}:hover & img { transform: scale(1.1); }
  &::after { content: ''; position: absolute; inset: 0; background: linear-gradient(180deg, transparent 0%, rgba(62, 27, 19, 0.05) 100%); }
`;
const ProductBadge = styled.div`
  position: absolute; top: 1.2rem; right: 1.2rem; background: ${({ theme }) => theme.colors.copperGradient};
  color: white; padding: 0.5rem 1rem; border-radius: 50px; font-size: 0.75rem; font-weight: 700;
  box-shadow: ${({ theme }) => theme.shadows.medium}; z-index: 2; text-transform: uppercase; letter-spacing: 1px;
`;
const ProductActions = styled.div`
  position: absolute; top: 1.2rem; left: 1.2rem; display: flex; flex-direction: column; gap: 0.7rem;
  opacity: 0; transform: translateX(-10px); transition: all 0.4s ease; z-index: 2;
  ${ProductCard}:hover & { opacity: 1; transform: translateX(0); }
`;
const ActionButton = styled.button`
  width: 42px; height: 42px; background: white; border: none; border-radius: 50%;
  display: flex; align-items: center; justify-content: center; cursor: pointer;
  box-shadow: ${({ theme }) => theme.shadows.medium}; transition: all 0.3s ease;
  color: ${({ $active, theme }) => $active ? '#E53935' : theme.colors.copperBrown};
  &:hover { background: ${({ $active }) => $active ? '#fff0f0' : 'rgba(184,115,51,0.9)'}; color: ${({ $active }) => $active ? '#E53935' : 'white'}; transform: scale(1.15); }
`;
const ProductInfo = styled.div`padding: 1.8rem;`;
const ProductCategory = styled.p`color: ${({ theme }) => theme.colors.brassGold}; font-size: 0.78rem; margin-bottom: 0.5rem; font-weight: 700; text-transform: uppercase; letter-spacing: 1.5px; font-family: 'DM Sans', sans-serif;`;
const ProductName = styled.h3`font-size: 1.1rem; color: ${({ theme }) => theme.colors.darkBrown}; margin-bottom: 1rem; font-weight: 700; line-height: 1.35; font-family: 'Playfair Display', Georgia, serif;`;
const ProductMeta = styled.div`display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;`;
const ProductRating = styled.div`display: flex; align-items: center; gap: 0.4rem; font-size: 0.9rem; color: ${({ theme }) => theme.colors.lightText}; font-weight: 600; svg { color: ${({ theme }) => theme.colors.brassGold}; fill: ${({ theme }) => theme.colors.brassGold}; }`;
const ProductPrice = styled.div`font-size: 1.3rem; font-weight: 800; background: ${({ theme }) => theme.colors.goldGradient}; -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; font-family: 'Playfair Display', serif;`;
const AddToCartButton = styled.button`
  width: 100%; background: ${({ theme }) => theme.colors.goldGradient}; color: white; border: none;
  padding: 0.9rem; border-radius: 10px; font-weight: 600; cursor: pointer; transition: all 0.3s ease;
  display: flex; align-items: center; justify-content: center; gap: 0.5rem;
  &:hover { transform: translateY(-2px); box-shadow: ${({ theme }) => theme.shadows.medium}; }
  &:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }
`;

/* ─── NEW PRODUCTS ─── */
const NewProductsSection = styled.section`padding: 6rem 0; background: ${({ theme }) => theme.colors.darkBrown}; position: relative; overflow: hidden;`;
const NewProductsContent = styled.div`display: grid; grid-template-columns: 1fr 1fr; gap: 5rem; align-items: center; position: relative; z-index: 1; @media (max-width: 968px) { grid-template-columns: 1fr; gap: 3rem; }`;
const NewProductsText = styled.div`
  animation: ${slideInLeft} 1s ease-out;
  h6 { color: ${({ theme }) => theme.colors.brassGold}; font-size: 0.95rem; text-transform: uppercase; letter-spacing: 3px; margin-bottom: 1rem; font-weight: 700; }
  h2 { font-family: "Playfair Display", "Cormorant Garamond", Georgia, serif; font-size: 3rem; color: white; margin-bottom: 1.5rem; font-weight: 700; line-height: 1.3; }
  p { color: #D7CCC8; font-size: 1.15rem; line-height: 1.8; margin-bottom: 2.5rem; }
`;
const NewProductsList = styled.div`display: flex; flex-direction: column; gap: 1.5rem; animation: ${slideInRight} 1s ease-out;`;
const NewProductItem = styled.div`
  background: rgba(255,255,255,0.08); backdrop-filter: blur(10px); padding: 1.8rem; border-radius: 16px;
  display: flex; justify-content: space-between; align-items: center; border: 2px solid rgba(201,164,76,0.2);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1); position: relative; overflow: hidden;
  &::before { content: ''; position: absolute; left: 0; top: 0; bottom: 0; width: 4px; background: ${({ theme }) => theme.colors.goldGradient}; transform: scaleY(0); transition: transform 0.4s ease; }
  &:hover::before { transform: scaleY(1); }
  &:hover { background: rgba(255,255,255,0.12); transform: translateX(10px); border-color: ${({ theme }) => theme.colors.brassGold}; }
`;
const NewProductInfo = styled.div`display: flex; gap: 1.5rem; align-items: center;`;
const NewProductIconWrapper = styled.div`
  width: 60px; height: 60px; background: ${({ theme }) => theme.colors.goldGradient}; border-radius: 14px;
  display: flex; align-items: center; justify-content: center; color: white;
  box-shadow: ${({ theme }) => theme.shadows.glow}; flex-shrink: 0;
  ${NewProductItem}:hover & { animation: ${rotate} 0.6s ease; }
`;
const NewProductDetails = styled.div`h4 { color: white; font-size: 1.1rem; margin-bottom: 0.4rem; font-weight: 700; } p { color: #BCAAA4; font-size: 0.9rem; margin: 0; display: flex; align-items: center; gap: 0.3rem; }`;
const NewProductPrice = styled.div`color: ${({ theme }) => theme.colors.brassGold}; font-size: 1.4rem; font-weight: 800; flex-shrink: 0;`;

/* ─── CUSTOM ORDER ─── */
const CustomOrderSection = styled.section`padding: 6rem 0; background: ${({ theme }) => theme.colors.cardBg}; position: relative;`;
const CustomOrderGrid = styled.div`
  display: grid; grid-template-columns: repeat(4, 1fr); gap: 2.5rem; margin-top: 3rem;
  @media (max-width: 968px) { grid-template-columns: repeat(2, 1fr); }
  @media (max-width: 640px) { grid-template-columns: 1fr; }
`;
const CustomOrderCard = styled.div`
  background: white; padding: 2.5rem; border-radius: 20px; text-align: center; box-shadow: ${({ theme }) => theme.shadows.small};
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1); border: 2px solid transparent;
  animation: ${scaleIn} 0.8s ease-out; animation-delay: ${props => props.delay || '0s'}; animation-fill-mode: both; position: relative; overflow: hidden;
  & > * { position: relative; z-index: 1; }
  &:hover { border-color: ${({ theme }) => theme.colors.brassGold}; transform: translateY(-8px) scale(1.02); box-shadow: ${({ theme }) => theme.shadows.large}; }
`;
const CustomIconWrapper = styled.div`
  width: 80px; height: 80px; background: ${({ theme }) => theme.colors.creamGradient}; border-radius: 50%;
  display: flex; align-items: center; justify-content: center; margin: 0 auto 1.8rem; color: ${({ theme }) => theme.colors.copperBrown};
  box-shadow: ${({ theme }) => theme.shadows.medium}; border: 3px solid ${({ theme }) => theme.colors.brassGold}; transition: all 0.4s ease;
  ${CustomOrderCard}:hover & { transform: scale(1.15) rotate(360deg); box-shadow: ${({ theme }) => theme.shadows.glow}; }
`;
const CTASection = styled.div`text-align: center; margin-top: 4rem;`;
const CTAButton = styled.button`
  background: ${({ theme }) => theme.colors.goldGradient}; color: white; border: none;
  padding: 1.3rem 3.5rem; border-radius: 50px; font-weight: 700; font-size: 1.15rem;
  cursor: pointer; transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1); box-shadow: ${({ theme }) => theme.shadows.large};
  &:hover { transform: translateY(-4px) scale(1.05); box-shadow: 0 20px 60px rgba(184, 115, 51, 0.4); }
`;

/* ═══════════════════════════════════════════════
   ★ RECENTLY VIEWED SECTION (Flipkart-style)
═══════════════════════════════════════════════ */
const RecentlyViewedSection = styled.section`
  padding: 5rem 0;
  background: #fff;
  border-top: 1px solid rgba(184,115,51,0.12);
  border-bottom: 1px solid rgba(184,115,51,0.12);
  position: relative;
  overflow: hidden;
  &::before {
    content: '';
    position: absolute; inset: 0;
    background: radial-gradient(ellipse at 10% 50%, rgba(184,115,51,0.04) 0%, transparent 50%),
                radial-gradient(ellipse at 90% 50%, rgba(201,164,76,0.03) 0%, transparent 50%);
    pointer-events: none;
  }
`;

const RecentlyViewedHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 2.5rem;
  flex-wrap: wrap;
  gap: 1rem;
`;

const RecentlyViewedTitle = styled.div`
  h6 {
    color: #b87333;
    font-size: 0.85rem;
    text-transform: uppercase;
    letter-spacing: 3px;
    font-weight: 700;
    margin-bottom: 4px;
  }
  h2 {
    font-family: "Playfair Display", Georgia, serif;
    font-size: 2rem;
    color: #3e2723;
    font-weight: 700;
    margin: 0;
  }
`;

const RecentlyViewedScroll = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(170px, 1fr));
  gap: 16px;
  @media (max-width: 640px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
  }
`;

const RecentlyViewedCard = styled.div`
  background: #fff;
  border-radius: 16px;
  overflow: hidden;
  border: 1.5px solid rgba(184,115,51,0.12);
  cursor: pointer;
  transition: all 0.28s cubic-bezier(0.22, 1, 0.36, 1);
  position: relative;
  animation: ${fadeIn} 0.5s ease both;
  animation-delay: ${props => props.delay || '0s'};
  &:hover {
    border-color: #d4a017;
    box-shadow: 0 14px 40px rgba(184,115,51,0.18);
    transform: translateY(-6px);
  }
`;

const RecentlyViewedImg = styled.div`
  height: 150px;
  overflow: hidden;
  background: linear-gradient(145deg, #fdf8f2, #f5e8d0);
  position: relative;
  img {
    width: 100%; height: 100%; object-fit: cover;
    transition: transform 0.35s cubic-bezier(0.22, 1, 0.36, 1);
    display: block;
  }
  ${RecentlyViewedCard}:hover img { transform: scale(1.08); }
  &::after {
    content: '';
    position: absolute; inset: 0;
    background: linear-gradient(to top, rgba(26,8,0,0.12) 0%, transparent 50%);
    pointer-events: none;
  }
`;

const RecentlyViewedBadge = styled.span`
  position: absolute;
  top: 8px; left: 8px;
  background: linear-gradient(135deg, #1a0800, #4a2010);
  color: #d4a017;
  font-size: 8px; font-weight: 800;
  padding: 3px 9px; border-radius: 20px;
  letter-spacing: 0.8px; text-transform: uppercase;
  font-family: 'DM Sans', sans-serif;
  z-index: 2;
`;

const RecentlyViewedInfo = styled.div`
  padding: 12px 12px 14px;
`;

const RecentlyViewedCat = styled.span`
  font-size: 9px; font-weight: 700; color: #b87333;
  letter-spacing: 1px; text-transform: uppercase;
  display: block; margin-bottom: 3px;
`;

const RecentlyViewedName = styled.p`
  font-family: "Playfair Display", Georgia, serif;
  font-size: 13px; font-weight: 700; color: #1a0800;
  line-height: 1.3; margin: 0 0 6px;
  display: -webkit-box; -webkit-line-clamp: 2;
  -webkit-box-orient: vertical; overflow: hidden;
`;

const RecentlyViewedPrice = styled.span`
  font-family: "Playfair Display", Georgia, serif;
  font-size: 15px; font-weight: 700; color: #92400e;
`;

/* ═══════════════════════════════════════════════
   MAIN COMPONENT
═══════════════════════════════════════════════ */
const Home = ({ addToCart }) => {
  const navigate = useNavigate();
  const { refreshWishlist } = useWishlist();

  const [wishlistedIds,       setWishlistedIds]       = useState([]);
  const [addedIds,            setAddedIds]            = useState([]);
  const [quickViewProduct,    setQuickViewProduct]    = useState(null);
  const [quickViewWishlisted, setQuickViewWishlisted] = useState(false);
  const [featuredShops,       setFeaturedShops]       = useState([]);
  const [shopsLoading,        setShopsLoading]        = useState(true);
  const [popularProducts,     setPopularProducts]     = useState([]);  // ← REAL backend products

  /* ── Per-User Auth Helper ── */
  const getUserId = React.useCallback(() => {
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
  }, []);
  const getRecentKey = React.useCallback(() => `songir_recently_viewed_${getUserId()}`, [getUserId]);

  /* ── Recently Viewed (per user) ── */
  const [recentlyViewed, setRecentlyViewed] = useState([]);

  useEffect(() => {
    const readRecent = () => {
      try {
        const stored = localStorage.getItem(getRecentKey());
        if (stored) setRecentlyViewed(JSON.parse(stored));
      } catch (e) {}
    };

    // Initial load
    readRecent();

    // Listen for storage events — fires for cross-tab AND same-tab
    // (ProductDetailPage dispatches a StorageEvent to make same-tab work)
    window.addEventListener('storage', readRecent);
    return () => window.removeEventListener('storage', readRecent);
  }, [getRecentKey]);

  // Also refresh on mount with small delay (catches navigation back to home)
  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        const stored = localStorage.getItem(getRecentKey());
        if (stored) setRecentlyViewed(JSON.parse(stored));
      } catch (e) {}
    }, 200);
    return () => clearTimeout(timer);
  }, [getRecentKey]);

  /* ── Fetch Shops ── */
  useEffect(() => {
    const fetchShops = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/shops/approved");
        const data = await res.json();
        const arr = Array.isArray(data) ? data : (data.shops || []);
        setFeaturedShops(arr.slice(0, 3));
      } catch (err) {
        console.error("Shops fetch error:", err);
      } finally {
        setShopsLoading(false);
      }
    };
    fetchShops();
  }, []);

  // ── Popular Products — fetch real products from backend, auto-refresh every 60s ──
  useEffect(() => {
    const fetchPopular = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/products");
        const data = await res.json();
        const arr = Array.isArray(data) ? data : (data.products || []);
        // Sort by newest (createdAt desc) then take top 4
        const sorted = arr.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
        setPopularProducts(sorted.slice(0, 4));
      } catch (err) {
        console.error("Products fetch error:", err);
      }
    };
    fetchPopular();
    // Auto-refresh every 60 seconds so new products appear live
    const interval = setInterval(fetchPopular, 60000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    try {
      const wishlist = JSON.parse(localStorage.getItem('songirWishlist') || '[]');
      setWishlistedIds(wishlist.map(item => item.id));
    } catch (e) { console.error(e); }
  }, []);

  const handleToggleWishlist = (e, product) => {
    e.stopPropagation();
    const pid = String(product._id || product.id);
    const wishlistItem = {
      id: pid, _id: pid,
      name: product.name, price: product.price,
      oldPrice: (product.price || 0) + 300, originalPrice: (product.price || 0) + 300,
      image: getImageSrc(product.image) || product.image,
      category: product.category, shop: product.shopName || product.shop,
      shopName: product.shopName || product.shop,
      rating: product.rating, reviews: product.reviews, inStock: product.inStock,
    };
    const wasAdded = toggleWishlist(wishlistItem);
    setWishlistedIds(prev => wasAdded ? [...prev, pid] : prev.filter(id => id !== pid));
    refreshWishlist();
    const toast = document.createElement('div');
    toast.style.cssText = `position:fixed;bottom:20px;left:50%;transform:translateX(-50%);background:${wasAdded ? '#b87333' : '#dc2626'};color:white;padding:8px 20px;border-radius:30px;font-weight:600;z-index:9999;font-family:sans-serif;`;
    toast.textContent = wasAdded ? '❤️ Added to Wishlist!' : '🗑️ Removed from Wishlist';
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 2000);
  };

  const handleAddToCart = (e, product) => {
    e.stopPropagation();
    const pid = product._id || product.id;
    if (!product.inStock || !addToCart) return;
    addToCart({
      ...product,
      id: pid,
      originalPrice: (product.price || 0) + 300,
      image: getImageSrc(product.image) || product.image,
    });
    setAddedIds(prev => [...prev, String(pid)]);
    setTimeout(() => setAddedIds(prev => prev.filter(id => id !== String(pid))), 1800);
  };

  const handleViewProduct = (product) => {
    navigate("/ProductDetail", { state: { product } });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const openQuickView  = (product) => { setQuickViewWishlisted(wishlistedIds.includes(product.id)); setQuickViewProduct(product); };
  const closeQuickView = () => setQuickViewProduct(null);

  const handleQuickAddToCart = (product) => {
    if (!product.inStock || !addToCart) return;
    addToCart({ ...product, id: product._id || product.id, originalPrice: (product.price || 0) + 300, image: getImageSrc(product.image) || product.image });
    const toast = document.createElement('div');
    toast.style.cssText = `position:fixed;bottom:20px;left:50%;transform:translateX(-50%);background:#b87333;color:white;padding:8px 20px;border-radius:30px;font-weight:600;z-index:9999;font-family:sans-serif;`;
    toast.textContent = '🛒 Added to Cart!';
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 2000);
  };

  const handleQuickToggleWishlist = (product) => {
    const wishlistItem = { id: product.id, name: product.name, price: product.price, oldPrice: product.oldPrice, image: product.image, category: product.category, shop: product.shop, rating: product.rating, inStock: product.inStock };
    const wasAdded = toggleWishlist(wishlistItem);
    setWishlistedIds(prev => wasAdded ? [...prev, product.id] : prev.filter(id => id !== product.id));
    setQuickViewWishlisted(wasAdded);
    refreshWishlist();
  };

  const handleQuickViewFull = (product) => { handleViewProduct(product); closeQuickView(); };

  const getImageSrc = (img) => {
    if (!img) return null;
    return img.startsWith('http') ? img : `http://localhost:5000/${img}`;
  };

  const promises = [
    { icon: <Award size={32} />, title: "Pure Materials", description: "We use 100% authentic and certified raw materials. No mixed metals or impurities." },
    { icon: <Heart size={32} />, title: "Handmade with Love", description: "Each piece is carefully crafted by skilled artisans using traditional techniques." },
    { icon: <CheckCircle size={32} />, title: "Quality Assured", description: "Every product undergoes strict quality checks to ensure durability and authenticity." },
    { icon: <TrendingUp size={32} />, title: "Actionable Results", description: "Proven health benefits and superior cooking experience with our utensils." },
    { icon: <Truck size={32} />, title: "Safe Delivery", description: "Carefully packed and safely delivered to your doorstep with full insurance." },
    { icon: <Users size={32} />, title: "Direct from Artisans", description: "Supporting local artisans by buying directly from their workshops." },
  ];

  const newProducts = [
    { name: "Copper Masala Dibba",       artisan: "Rashmi Wagh",   price: "₹1,299" },
    { name: "Authentic Brass Glass Set", artisan: "Ashok Tagar",   price: "₹2,999" },
    { name: "Traditional Copper Bowl",   artisan: "Uttam Gavhale", price: "₹799" },
  ];

  const customFeatures = [
    { icon: <Package size={36} />,     title: "Request Quote",  description: "Get custom orders tailored to your needs" },
    { icon: <ShoppingBag size={36} />, title: "Customization",  description: "Your design, engraved on brass/copper" },
    { icon: <Users size={36} />,       title: "Bulk Orders",    description: "Special rates for bulk and corporate gifts" },
    { icon: <Clock size={36} />,       title: "Fast Delivery",  description: "We prioritize timely and reliable delivery" },
  ];

  return (
    <ThemeProvider theme={theme}>
      <GlobalFonts />
      <GlobalWrapper>

        {/* HERO */}
        <Container>
          <HeroSection>
            <DecorativePattern className="top-left" />
            <HeroContent>
              <h1>Tradition Crafted by Hand. Heritage Served in Every Utensil.</h1>
              <HeroSubtitle>Discover authentic handmade brass, copper, and clay utensils from Songir artisans.</HeroSubtitle>
              <ButtonGroup>
                <Button onClick={() => navigate("/products")}>Explore Collection <ChevronRight size={20} /></Button>
                <Button className="secondary" onClick={() => navigate("/shops")}>Meet Our Artisans</Button>
              </ButtonGroup>
            </HeroContent>
            <HeroImage>
              <img src={artisanCrafting} alt="Songir artisan at work" />
            </HeroImage>
          </HeroSection>
        </Container>

        {/* PROMISE */}
        <PromiseSection>
          <DecorativePattern className="bottom-right" />
          <Container>
            <SectionHeader>
              <h6>Why Choose Us</h6>
              <h2>The Songir Promise</h2>
              <p>Our promise to you: Songir is where excellence meets tradition and integrity in every crafted utensil.</p>
            </SectionHeader>
            <PromiseGrid>
              {promises.map((promise, index) => (
                <PromiseCard key={index} delay={`${index * 0.1}s`}>
                  <IconWrapper>{promise.icon}</IconWrapper>
                  <CardTitle>{promise.title}</CardTitle>
                  <CardDescription>{promise.description}</CardDescription>
                </PromiseCard>
              ))}
            </PromiseGrid>
          </Container>
        </PromiseSection>

        {/* SHOPKEEPERS */}
        <ShopkeepersSection>
          <Container>
            <ShopkeepersHeader>
              <div>
                <h6>Our Artisans</h6>
                <h2>Featured Shopkeepers</h2>
              </div>
              <ViewAllButton onClick={() => navigate("/shops")}>
                View All Shops <ArrowRight size={18} />
              </ViewAllButton>
            </ShopkeepersHeader>

            {shopsLoading ? (
              <div style={{ textAlign: "center", padding: "3rem", color: "#B87333" }}>Loading artisan shops...</div>
            ) : (
              <ShopkeepersGrid>
                {featuredShops.map((shop, index) => {
                  const initials = shop.shopName ? shop.shopName.substring(0, 2).toUpperCase() : "SH";
                  return (
                    <RealShopCard key={shop._id} delay={`${index * 0.15}s`} onClick={() => navigate("/shops")}>
                      <VerifiedCorner><CheckCircle2 size={13} fill="#27AE60" color="#27AE60" /> Verified</VerifiedCorner>
                      <CardTop>
                        <ShopAvatarCircle>{initials}</ShopAvatarCircle>
                        <ShopNameBold>{shop.shopName}</ShopNameBold>
                        <ShopOwnerSub>{shop.ownerName}</ShopOwnerSub>
                        <StarsRow>
                          <Star size={15} fill="#F59E0B" color="#F59E0B" />
                          <span style={{ marginLeft: "4px", fontSize: "0.9rem", fontWeight: 700, color: "#3E2723" }}>4.5</span>
                          <span style={{ fontSize: "0.82rem", color: "#B0A090", marginLeft: "2px" }}>(0 reviews)</span>
                        </StarsRow>
                      </CardTop>
                      <CardBottom>
                        <ShopDesc>Handcrafted items with traditional techniques.</ShopDesc>
                        <InfoRow>
                          {shop.openingTime && shop.closingTime && (
                            <InfoChip><Clock size={12} color="#B87333" /><span>{shop.openingTime} - {shop.closingTime}</span></InfoChip>
                          )}
                          <InfoChip><Package size={12} color="#B87333" /><span>{shop.productCount || 0} products</span></InfoChip>
                          {shop.address && (<InfoChip><MapPin size={12} color="#B87333" /><span>{shop.address.substring(0, 12)}...</span></InfoChip>)}
                        </InfoRow>
                        {shop.workingDays?.length > 0 && (
                          <DaysRow>{shop.workingDays.map((d, di) => <DayPill key={di}>{d}</DayPill>)}</DaysRow>
                        )}
                        <CardBtns>
                          <BtnPrimaryWide onClick={(e) => { e.stopPropagation(); navigate("/shops"); }}>View Shop <ArrowRight size={15} /></BtnPrimaryWide>
                          <BtnGhostWide onClick={(e) => { e.stopPropagation(); navigate("/quote"); }}>Get Quote</BtnGhostWide>
                        </CardBtns>
                      </CardBottom>
                    </RealShopCard>
                  );
                })}
              </ShopkeepersGrid>
            )}
          </Container>
        </ShopkeepersSection>

        {/* POPULAR UTENSILS — real backend products, auto-refreshes */}
        <UtensilsSection>
          <Container>
            <SectionHeader>
              <h6>Our Collection</h6>
              <h2>Popular Utensils</h2>
              <p>Handpicked premium brass and copper utensils crafted by master artisans.</p>
            </SectionHeader>

            {popularProducts.length === 0 ? (
              <div style={{ textAlign: "center", padding: "3rem 0", color: "#b87333" }}>
                <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🏺</div>
                <p style={{ fontSize: "1rem", color: "#8d6e63" }}>Loading latest products...</p>
              </div>
            ) : (
              <UtensilsGrid>
                {popularProducts.map((product, index) => {
                  const pid = String(product._id || product.id);
                  const imgSrc = getImageSrc(product.image);
                  const isLiked = wishlistedIds.includes(pid);
                  const isAdded = addedIds.includes(pid);
                  const badge = index === 0 ? "NEW" : index === 1 ? "POPULAR" : index === 2 ? "TRENDING" : "FEATURED";
                  return (
                    <ProductCard key={pid} delay={`${index * 0.1}s`} onClick={() => handleViewProduct(product)}>
                      <ProductImageBox>
                        <ProductBadge>{badge}</ProductBadge>
                        <ProductActions>
                          <ActionButton
                            title={isLiked ? "Remove from Wishlist" : "Add to Wishlist"}
                            $active={isLiked}
                            onClick={(e) => { e.stopPropagation(); handleToggleWishlist(e, product); }}
                          >
                            <Heart size={20} fill={isLiked ? 'currentColor' : 'none'} />
                          </ActionButton>
                          <ActionButton title="View Product" onClick={(e) => { e.stopPropagation(); handleViewProduct(product); }}>
                            <Eye size={20} />
                          </ActionButton>
                        </ProductActions>
                        <img
                          src={imgSrc}
                          alt={product.name}
                          onError={e => { e.target.src = "https://placehold.co/400x320?text=Product"; }}
                        />
                      </ProductImageBox>
                      <ProductInfo>
                        <ProductCategory>{product.category}</ProductCategory>
                        <ProductName>{product.name}</ProductName>
                        <ProductMeta>
                          <ProductRating>
                            <Star size={15} />
                            {product.rating || "4.8"}
                          </ProductRating>
                          <ProductPrice>₹{(product.price || 0).toLocaleString()}</ProductPrice>
                        </ProductMeta>
                        <AddToCartButton
                          onClick={(e) => handleAddToCart(e, product)}
                          disabled={!product.inStock || isAdded}
                        >
                          {isAdded
                            ? <><CheckCircle size={18} /> Added to Cart!</>
                            : <><ShoppingCart size={18} /> {product.inStock !== false ? "Add to Cart" : "Out of Stock"}</>
                          }
                        </AddToCartButton>
                      </ProductInfo>
                    </ProductCard>
                  );
                })}
              </UtensilsGrid>
            )}

            <CTASection>
              <ViewAllButton onClick={() => navigate("/products")}>See All Products <ArrowRight size={18} /></ViewAllButton>
            </CTASection>
          </Container>
        </UtensilsSection>

        {/* ════════════════════════════════════════
            ★ RECENTLY VIEWED — Flipkart-style
        ════════════════════════════════════════ */}
        {recentlyViewed.length > 0 && (
          <RecentlyViewedSection>
            <Container>
              <RecentlyViewedHeader>
                <RecentlyViewedTitle>
                  <h6>Your History</h6>
                  <h2>Recently Viewed</h2>
                </RecentlyViewedTitle>
                <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                  <span style={{ fontSize: 12, color: "#b0a090", fontFamily: "inherit" }}>
                    {recentlyViewed.length} item{recentlyViewed.length > 1 ? "s" : ""}
                  </span>
                  <button
                    onClick={() => { localStorage.removeItem(getRecentKey()); setRecentlyViewed([]); }}
                    style={{ background: "none", border: "1px solid #e0d5c5", color: "#9a8070", fontSize: 11, cursor: "pointer", fontFamily: "inherit", borderRadius: 20, padding: "4px 12px", transition: "all 0.2s" }}
                    onMouseOver={e => { e.currentTarget.style.borderColor = "#b87333"; e.currentTarget.style.color = "#b87333"; }}
                    onMouseOut={e => { e.currentTarget.style.borderColor = "#e0d5c5"; e.currentTarget.style.color = "#9a8070"; }}
                  >
                    🗑 Clear
                  </button>
                  <ViewAllButton onClick={() => navigate("/products")} style={{ fontSize: "0.85rem", padding: "0.6rem 1.4rem" }}>
                    Browse All <ArrowRight size={15} />
                  </ViewAllButton>
                </div>
              </RecentlyViewedHeader>

              {/* Meesho-style: horizontal scroll row */}
              <div style={{
                display: "flex",
                gap: "14px",
                overflowX: "auto",
                paddingBottom: "16px",
                scrollbarWidth: "thin",
                scrollbarColor: "#d4a01730 transparent",
                WebkitOverflowScrolling: "touch",
              }}>
                {recentlyViewed.map((item, index) => (
                  <div
                    key={item.id}
                    onClick={() => navigate("/ProductDetail", { state: { product: item } })}
                    style={{
                      minWidth: 160,
                      maxWidth: 160,
                      background: "#fff",
                      borderRadius: 14,
                      overflow: "hidden",
                      border: "1.5px solid rgba(184,115,51,0.12)",
                      cursor: "pointer",
                      transition: "all 0.25s cubic-bezier(0.22,1,0.36,1)",
                      flexShrink: 0,
                      boxShadow: "0 2px 12px rgba(184,115,51,0.07)",
                      animation: `rvFadeIn 0.4s ease ${index * 0.05}s both`,
                    }}
                    onMouseOver={e => { e.currentTarget.style.borderColor = "#d4a017"; e.currentTarget.style.transform = "translateY(-5px)"; e.currentTarget.style.boxShadow = "0 12px 32px rgba(184,115,51,0.18)"; }}
                    onMouseOut={e => { e.currentTarget.style.borderColor = "rgba(184,115,51,0.12)"; e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = "0 2px 12px rgba(184,115,51,0.07)"; }}
                  >
                    {/* Image */}
                    <div style={{ height: 148, overflow: "hidden", background: "linear-gradient(145deg,#fdf8f2,#f5e8d0)", position: "relative" }}>
                      <span style={{ position: "absolute", top: 7, left: 7, background: "linear-gradient(135deg,#1a0800,#4a2010)", color: "#d4a017", fontSize: 8, fontWeight: 800, padding: "3px 8px", borderRadius: 20, letterSpacing: "0.7px", textTransform: "uppercase", zIndex: 2 }}>
                        Viewed
                      </span>
                      <img
                        src={item.image} alt={item.name} loading="lazy"
                        style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", transition: "transform 0.35s ease" }}
                        onError={e => { e.target.src = "https://placehold.co/200x148?text=Product"; }}
                        onMouseOver={e => { e.target.style.transform = "scale(1.08)"; }}
                        onMouseOut={e => { e.target.style.transform = ""; }}
                      />
                    </div>
                    {/* Info */}
                    <div style={{ padding: "10px 11px 13px" }}>
                      <span style={{ fontSize: 9, fontWeight: 700, color: "#b87333", letterSpacing: "0.9px", textTransform: "uppercase", display: "block", marginBottom: 3 }}>
                        {item.category}
                      </span>
                      <p style={{ fontFamily: "Georgia, serif", fontSize: 12.5, fontWeight: 700, color: "#1a0800", lineHeight: 1.3, margin: "0 0 7px", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                        {item.name}
                      </p>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        <span style={{ fontFamily: "Georgia, serif", fontSize: 14, fontWeight: 700, color: "#92400e" }}>
                          ₹{item.price?.toLocaleString()}
                        </span>
                        {item.rating && (
                          <span style={{ fontSize: 10, color: "#c8960c", fontWeight: 700, background: "rgba(200,150,12,0.1)", padding: "2px 6px", borderRadius: 6 }}>
                            ⭐ {item.rating}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <style>{`
                @keyframes rvFadeIn { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:none; } }
                div::-webkit-scrollbar { height: 4px; }
                div::-webkit-scrollbar-track { background: transparent; }
                div::-webkit-scrollbar-thumb { background: rgba(212,160,23,0.25); border-radius: 4px; }
                div::-webkit-scrollbar-thumb:hover { background: rgba(184,115,51,0.4); }
              `}</style>
            </Container>
          </RecentlyViewedSection>
        )}

        {/* NEW PRODUCTS */}
        <NewProductsSection>
          <Container>
            <NewProductsContent>
              <NewProductsText>
                <h6>Latest Arrivals</h6>
                <h2>New Products from Our Artisans</h2>
                <p>Be the first to discover our latest handcrafted utensils. Fresh from the workshops of Songir's finest artisans.</p>
                <Button onClick={() => navigate("/products")}>See All New Arrivals <ChevronRight size={20} /></Button>
              </NewProductsText>
              <NewProductsList>
                {newProducts.map((product, index) => (
                  <NewProductItem key={index}>
                    <NewProductInfo>
                      <NewProductIconWrapper><Sparkles size={28} /></NewProductIconWrapper>
                      <NewProductDetails>
                        <h4>{product.name}</h4>
                        <p><BadgeCheck size={14} /> {product.artisan}</p>
                      </NewProductDetails>
                    </NewProductInfo>
                    <NewProductPrice>{product.price}</NewProductPrice>
                  </NewProductItem>
                ))}
              </NewProductsList>
            </NewProductsContent>
          </Container>
        </NewProductsSection>

        {/* CUSTOM ORDER */}
        <CustomOrderSection>
          <Container>
            <SectionHeader>
              <h6>Personalized Service</h6>
              <h2>Need a Custom Order?</h2>
              <p>Get personalized brass and copper utensils made specifically for you.</p>
            </SectionHeader>
            <CustomOrderGrid>
              {customFeatures.map((feature, index) => (
                <CustomOrderCard key={index} delay={`${index * 0.1}s`}>
                  <CustomIconWrapper>{feature.icon}</CustomIconWrapper>
                  <CardTitle>{feature.title}</CardTitle>
                  <CardDescription>{feature.description}</CardDescription>
                </CustomOrderCard>
              ))}
            </CustomOrderGrid>
            <CTASection>
              <CTAButton onClick={() => navigate('/quote')}>Request Custom Quote</CTAButton>
            </CTASection>
          </Container>
        </CustomOrderSection>

        {/* QUICK VIEW MODAL */}
        <QuickViewModal
          product={quickViewProduct}
          isOpen={!!quickViewProduct}
          onClose={closeQuickView}
          onAddToCart={handleQuickAddToCart}
          onViewFullDetails={handleQuickViewFull}
          onToggleWishlist={handleQuickToggleWishlist}
          isWishlisted={quickViewWishlisted}
        />

      </GlobalWrapper>
    </ThemeProvider>
  );
};

export default Home;

// <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>.......


// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import styled, { ThemeProvider, keyframes, createGlobalStyle } from "styled-components";
// import {
//   ChevronRight, Award, Heart, CheckCircle, TrendingUp, Truck, Users, Star,
//   MapPin, Package, ShoppingBag, Sparkles, Clock, Eye, ArrowRight, BadgeCheck,
//   ShoppingCart, CheckCircle2
// } from "lucide-react";
// import artisanCrafting from "../Assets/artisan-crafting.png";
// import { useWishlist } from "../context/WishlistContext";
// import { toggleWishlist } from "../utils/wishlistUtils";
// import QuickViewModal from "../components/QuickViewModal";

// /* ── Google Fonts ── */
// const GlobalFonts = createGlobalStyle`
//   @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600;9..40,700&display=swap');
//   * {
//     margin: 0;
//     padding: 0;
//     box-sizing: border-box;
//   }
//   body {
//     overflow-x: hidden;
//     width: 100%;
//   }
// `;

// const theme = {
//   colors: {
//     copperBrown: "#B87333", brassGold: "#C9A44C", cream: "#FFF6E5",
//     darkBrown: "#3E2723", lightText: "#6D4C41", white: "#FFFFFF",
//     cardBg: "#FFFBF5",
//     goldGradient: "linear-gradient(135deg, #421a0c 0%, #B87333 100%)",
//     copperGradient: "linear-gradient(135deg, #B87333 0%, #8B5A2B 100%)",
//     creamGradient: "linear-gradient(135deg, #FFF6E5 0%, #FFE4B5 100%)",
//   },
//   shadows: {
//     small: "0 4px 12px rgba(184, 115, 51, 0.1)",
//     medium: "0 8px 24px rgba(184, 115, 51, 0.15)",
//     large: "0 16px 48px rgba(184, 115, 51, 0.2)",
//     glow: "0 0 20px rgba(201, 164, 76, 0.3)",
//   }
// };

// /* ─── ANIMATIONS ─── */
// const fadeIn = keyframes`from{opacity:0;transform:translateY(30px)}to{opacity:1;transform:translateY(0)}`;
// const slideInLeft = keyframes`from{opacity:0;transform:translateX(-50px)}to{opacity:1;transform:translateX(0)}`;
// const slideInRight = keyframes`from{opacity:0;transform:translateX(50px)}to{opacity:1;transform:translateX(0)}`;
// const scaleIn = keyframes`from{opacity:0;transform:scale(0.8)}to{opacity:1;transform:scale(1)}`;
// const float = keyframes`0%,100%{transform:translateY(0px)}50%{transform:translateY(-10px)}`;
// const rotate = keyframes`from{transform:rotate(0deg)}to{transform:rotate(360deg)}`;

// const GlobalWrapper = styled.div`
//   font-family: 'DM Sans', "Inter", -apple-system, BlinkMacSystemFont, sans-serif;
//   background: ${({ theme }) => theme.colors.cream};
//   color: ${({ theme }) => theme.colors.darkBrown};
//   min-height: 100vh;
//   overflow-x: hidden;
//   width: 100%;
// `;

// const Container = styled.div`
//   max-width: 1400px;
//   margin: 0 auto;
//   padding: 0 2rem;
//   @media (max-width: 768px) {
//     padding: 0 1.25rem;
//   }
//   @media (max-width: 480px) {
//     padding: 0 1rem;
//   }
// `;

// const DecorativePattern = styled.div`
//   position: absolute;
//   width: 300px; height: 300px;
//   background: radial-gradient(circle, rgba(201, 164, 76, 0.1) 0%, transparent 70%);
//   border-radius: 50%; z-index: 0; pointer-events: none;
//   animation: ${float} 6s ease-in-out infinite;
//   &.top-left { top: -100px; left: -100px; }
//   &.bottom-right { bottom: -100px; right: -100px; }
//   @media (max-width: 768px) {
//     width: 150px; height: 150px;
//   }
// `;

// const HeroSection = styled.section`
//   padding: 4rem 0 6rem;
//   display: grid;
//   grid-template-columns: 1fr 1fr;
//   gap: 5rem;
//   align-items: center;
//   position: relative;
//   @media (max-width: 968px) {
//     grid-template-columns: 1fr;
//     gap: 3rem;
//     text-align: center;
//     padding: 2rem 0 4rem;
//   }
// `;

// const HeroContent = styled.div`
//   animation: ${slideInLeft} 1s ease-out;
//   z-index: 1;
//   h1 {
//     font-family: "Playfair Display", serif;
//     font-size: 3.8rem;
//     margin-bottom: 1.5rem;
//     line-height: 1.2;
//     font-weight: 700;
//     background: ${({ theme }) => theme.colors.goldGradient};
//     -webkit-background-clip: text;
//     -webkit-text-fill-color: transparent;
//     background-clip: text;
//     @media (max-width: 768px) {
//       font-size: 2.5rem;
//     }
//     @media (max-width: 480px) {
//       font-size: 2rem;
//     }
//   }
// `;

// const HeroSubtitle = styled.p`
//   font-size: 1.25rem;
//   color: ${({ theme }) => theme.colors.lightText};
//   margin-bottom: 2.5rem;
//   line-height: 1.8;
//   @media (max-width: 768px) {
//     font-size: 1.1rem;
//   }
// `;

// const ButtonGroup = styled.div`
//   display: flex;
//   gap: 1.2rem;
//   flex-wrap: wrap;
//   justify-content: center;
// `;

// const Button = styled.button`
//   background: ${({ theme }) => theme.colors.goldGradient};
//   color: white; border: none;
//   padding: 1rem 2rem;
//   border-radius: 50px;
//   font-weight: 600;
//   font-size: 1rem;
//   cursor: pointer;
//   display: inline-flex;
//   align-items: center;
//   gap: 0.6rem;
//   transition: all 0.3s ease;
//   box-shadow: ${({ theme }) => theme.shadows.medium};
//   &:hover {
//     transform: translateY(-3px);
//     box-shadow: ${({ theme }) => theme.shadows.large};
//   }
//   &.secondary {
//     background: transparent;
//     color: ${({ theme }) => theme.colors.copperBrown};
//     border: 2px solid ${({ theme }) => theme.colors.copperBrown};
//     box-shadow: none;
//     &:hover {
//       background: ${({ theme }) => theme.colors.copperBrown};
//       color: white;
//     }
//   }
//   @media (max-width: 480px) {
//     padding: 0.7rem 1.5rem;
//     font-size: 0.9rem;
//   }
// `;

// const HeroImage = styled.div`
//   height: 550px;
//   border-radius: 24px;
//   overflow: hidden;
//   position: relative;
//   animation: ${slideInRight} 1s ease-out;
//   box-shadow: ${({ theme }) => theme.shadows.large};
//   background: ${({ theme }) => theme.colors.goldGradient};
//   padding: 3px;
//   img {
//     width: 100%;
//     height: 100%;
//     object-fit: cover;
//     border-radius: 20px;
//   }
//   @media (max-width: 968px) {
//     height: 400px;
//   }
//   @media (max-width: 480px) {
//     height: 250px;
//   }
// `;

// const SectionHeader = styled.div`
//   text-align: center;
//   margin-bottom: 3rem;
//   h6 {
//     color: ${({ theme }) => theme.colors.copperBrown};
//     font-size: 0.9rem;
//     text-transform: uppercase;
//     letter-spacing: 3px;
//     font-weight: 700;
//     display: inline-block;
//     position: relative;
//     &::after {
//       content: '';
//       position: absolute;
//       bottom: -8px;
//       left: 50%;
//       transform: translateX(-50%);
//       width: 50px;
//       height: 2px;
//       background: ${({ theme }) => theme.colors.goldGradient};
//     }
//   }
//   h2 {
//     font-family: "Playfair Display", serif;
//     font-size: 2.8rem;
//     color: ${({ theme }) => theme.colors.darkBrown};
//     margin: 1rem 0 1rem;
//     font-weight: 700;
//     @media (max-width: 768px) {
//       font-size: 2rem;
//     }
//   }
//   p {
//     color: ${({ theme }) => theme.colors.lightText};
//     font-size: 1.1rem;
//     max-width: 700px;
//     margin: 0 auto;
//     line-height: 1.6;
//     @media (max-width: 768px) {
//       font-size: 1rem;
//     }
//   }
// `;

// const PromiseSection = styled.section`
//   padding: 5rem 0;
//   background: ${({ theme }) => theme.colors.cream};
// `;

// const PromiseGrid = styled.div`
//   display: grid;
//   grid-template-columns: repeat(3, 1fr);
//   gap: 2rem;
//   @media (max-width: 968px) {
//     grid-template-columns: repeat(2, 1fr);
//   }
//   @media (max-width: 640px) {
//     grid-template-columns: 1fr;
//   }
// `;

// const PromiseCard = styled.div`
//   background: white;
//   padding: 2rem;
//   border-radius: 20px;
//   text-align: center;
//   transition: all 0.3s ease;
//   border: 1px solid rgba(201,164,76,0.2);
//   &:hover {
//     transform: translateY(-5px);
//     box-shadow: ${({ theme }) => theme.shadows.medium};
//     border-color: ${({ theme }) => theme.colors.brassGold};
//   }
// `;

// const IconWrapper = styled.div`
//   width: 70px;
//   height: 70px;
//   background: ${({ theme }) => theme.colors.creamGradient};
//   border-radius: 50%;
//   display: flex;
//   align-items: center;
//   justify-content: center;
//   margin: 0 auto 1.5rem;
//   color: ${({ theme }) => theme.colors.copperBrown};
// `;

// const CardTitle = styled.h3`
//   font-size: 1.3rem;
//   margin-bottom: 0.8rem;
//   color: ${({ theme }) => theme.colors.darkBrown};
// `;

// const CardDescription = styled.p`
//   color: ${({ theme }) => theme.colors.lightText};
//   line-height: 1.6;
// `;

// // Shopkeepers
// const ShopkeepersSection = styled.section`
//   padding: 5rem 0;
//   background: ${({ theme }) => theme.colors.cardBg};
// `;

// const ShopkeepersHeader = styled.div`
//   display: flex;
//   justify-content: space-between;
//   align-items: center;
//   flex-wrap: wrap;
//   gap: 1.5rem;
//   margin-bottom: 3rem;
//   h6 {
//     color: ${({ theme }) => theme.colors.copperBrown};
//     font-size: 0.9rem;
//     letter-spacing: 3px;
//     text-transform: uppercase;
//   }
//   h2 {
//     font-family: "Playfair Display", serif;
//     font-size: 2.2rem;
//     color: ${({ theme }) => theme.colors.darkBrown};
//     @media (max-width: 768px) {
//       font-size: 1.8rem;
//     }
//   }
// `;

// const ViewAllButton = styled.button`
//   background: transparent;
//   border: 2px solid ${({ theme }) => theme.colors.copperBrown};
//   color: ${({ theme }) => theme.colors.copperBrown};
//   padding: 0.6rem 1.5rem;
//   border-radius: 40px;
//   font-weight: 600;
//   cursor: pointer;
//   display: inline-flex;
//   align-items: center;
//   gap: 0.5rem;
//   transition: all 0.3s;
//   &:hover {
//     background: ${({ theme }) => theme.colors.copperBrown};
//     color: white;
//   }
// `;

// const ShopkeepersGrid = styled.div`
//   display: grid;
//   grid-template-columns: repeat(3, 1fr);
//   gap: 2rem;
//   @media (max-width: 968px) {
//     grid-template-columns: repeat(2, 1fr);
//   }
//   @media (max-width: 640px) {
//     grid-template-columns: 1fr;
//   }
// `;

// const RealShopCard = styled.div`
//   background: white;
//   border-radius: 20px;
//   overflow: hidden;
//   box-shadow: 0 4px 12px rgba(0,0,0,0.05);
//   cursor: pointer;
//   transition: all 0.3s;
//   &:hover {
//     transform: translateY(-5px);
//     box-shadow: 0 12px 24px rgba(0,0,0,0.1);
//   }
// `;

// const VerifiedCorner = styled.div`
//   position: absolute;
//   top: 12px;
//   right: 12px;
//   background: #27AE60;
//   color: white;
//   padding: 4px 8px;
//   border-radius: 20px;
//   font-size: 0.7rem;
//   display: flex;
//   align-items: center;
//   gap: 4px;
// `;

// const CardTop = styled.div`
//   background: linear-gradient(135deg, #FFF6E5, #FFE4B5);
//   padding: 1.5rem;
//   text-align: center;
//   border-bottom: 1px solid rgba(201,164,76,0.2);
// `;

// const ShopAvatarCircle = styled.div`
//   width: 70px;
//   height: 70px;
//   background: linear-gradient(135deg, #B87333, #C9A44C);
//   border-radius: 50%;
//   display: flex;
//   align-items: center;
//   justify-content: center;
//   margin: 0 auto 1rem;
//   font-size: 1.5rem;
//   font-weight: bold;
//   color: white;
// `;

// const ShopNameBold = styled.h3`
//   font-size: 1.2rem;
//   margin-bottom: 0.2rem;
// `;

// const ShopOwnerSub = styled.p`
//   font-size: 0.8rem;
//   color: #7D6E63;
// `;

// const StarsRow = styled.div`
//   display: flex;
//   justify-content: center;
//   gap: 4px;
//   margin-top: 6px;
// `;

// const CardBottom = styled.div`
//   padding: 1.2rem;
// `;

// const ShopDesc = styled.p`
//   font-size: 0.85rem;
//   color: #5D4037;
//   margin-bottom: 1rem;
// `;

// const InfoRow = styled.div`
//   display: flex;
//   flex-wrap: wrap;
//   gap: 0.8rem;
//   margin-bottom: 0.8rem;
// `;

// const InfoChip = styled.div`
//   display: flex;
//   align-items: center;
//   gap: 4px;
//   font-size: 0.75rem;
//   color: #8D6E63;
// `;

// const DaysRow = styled.div`
//   display: flex;
//   flex-wrap: wrap;
//   gap: 0.4rem;
//   margin-bottom: 1rem;
// `;

// const DayPill = styled.span`
//   background: rgba(184,115,51,0.1);
//   padding: 2px 8px;
//   border-radius: 12px;
//   font-size: 0.7rem;
//   color: #B87333;
// `;

// const CardBtns = styled.div`
//   display: flex;
//   gap: 0.8rem;
//   margin-top: 1rem;
// `;

// const BtnPrimaryWide = styled.button`
//   flex: 1;
//   background: ${({ theme }) => theme.colors.copperGradient};
//   color: white;
//   border: none;
//   padding: 0.6rem;
//   border-radius: 12px;
//   font-weight: 600;
//   cursor: pointer;
//   display: flex;
//   align-items: center;
//   justify-content: center;
//   gap: 6px;
//   font-size: 0.8rem;
// `;

// const BtnGhostWide = styled.button`
//   flex: 1;
//   background: transparent;
//   border: 1px solid ${({ theme }) => theme.colors.copperBrown};
//   color: ${({ theme }) => theme.colors.copperBrown};
//   padding: 0.6rem;
//   border-radius: 12px;
//   font-weight: 500;
//   cursor: pointer;
//   font-size: 0.8rem;
// `;

// // Products
// const UtensilsSection = styled.section`
//   padding: 5rem 0;
//   background: ${({ theme }) => theme.colors.cream};
// `;

// const UtensilsGrid = styled.div`
//   display: grid;
//   grid-template-columns: repeat(4, 1fr);
//   gap: 2rem;
//   @media (max-width: 1200px) {
//     grid-template-columns: repeat(3, 1fr);
//   }
//   @media (max-width: 968px) {
//     grid-template-columns: repeat(2, 1fr);
//   }
//   @media (max-width: 640px) {
//     grid-template-columns: 1fr;
//   }
// `;

// const ProductCard = styled.div`
//   background: white;
//   border-radius: 20px;
//   overflow: hidden;
//   box-shadow: 0 4px 12px rgba(0,0,0,0.05);
//   cursor: pointer;
//   transition: all 0.3s;
//   &:hover {
//     transform: translateY(-5px);
//     box-shadow: 0 12px 24px rgba(0,0,0,0.1);
//   }
// `;

// const ProductImageBox = styled.div`
//   height: 260px;
//   background: #FDF8F2;
//   position: relative;
//   overflow: hidden;
//   img {
//     width: 100%;
//     height: 100%;
//     object-fit: cover;
//     transition: transform 0.3s;
//   }
//   &:hover img {
//     transform: scale(1.05);
//   }
// `;

// const ProductBadge = styled.div`
//   position: absolute;
//   top: 12px;
//   right: 12px;
//   background: ${({ theme }) => theme.colors.copperGradient};
//   color: white;
//   padding: 4px 10px;
//   border-radius: 20px;
//   font-size: 0.7rem;
//   font-weight: bold;
//   z-index: 1;
// `;

// const ProductActions = styled.div`
//   position: absolute;
//   top: 12px;
//   left: 12px;
//   display: flex;
//   flex-direction: column;
//   gap: 8px;
//   opacity: 0;
//   transform: translateX(-10px);
//   transition: all 0.3s;
//   ${ProductCard}:hover & {
//     opacity: 1;
//     transform: translateX(0);
//   }
// `;

// const ActionButton = styled.button`
//   width: 36px;
//   height: 36px;
//   background: white;
//   border-radius: 50%;
//   border: none;
//   display: flex;
//   align-items: center;
//   justify-content: center;
//   cursor: pointer;
//   box-shadow: 0 2px 8px rgba(0,0,0,0.1);
//   color: ${({ $active, theme }) => $active ? '#E53935' : theme.colors.copperBrown};
//   &:hover {
//     background: ${({ $active }) => $active ? '#FFEBEE' : theme.colors.copperBrown};
//     color: white;
//   }
// `;

// const ProductInfo = styled.div`
//   padding: 1rem;
// `;

// const ProductCategory = styled.p`
//   font-size: 0.7rem;
//   color: ${({ theme }) => theme.colors.brassGold};
//   text-transform: uppercase;
//   letter-spacing: 1px;
//   margin-bottom: 4px;
// `;

// const ProductName = styled.h3`
//   font-size: 1rem;
//   font-weight: 700;
//   margin-bottom: 0.5rem;
//   font-family: "Playfair Display", serif;
// `;

// const ProductMeta = styled.div`
//   display: flex;
//   justify-content: space-between;
//   align-items: center;
//   margin-bottom: 1rem;
// `;

// const ProductRating = styled.div`
//   display: flex;
//   align-items: center;
//   gap: 4px;
//   font-size: 0.8rem;
// `;

// const ProductPrice = styled.div`
//   font-size: 1.2rem;
//   font-weight: 800;
//   color: ${({ theme }) => theme.colors.copperBrown};
// `;

// const AddToCartButton = styled.button`
//   width: 100%;
//   background: ${({ theme }) => theme.colors.goldGradient};
//   color: white;
//   border: none;
//   padding: 0.7rem;
//   border-radius: 12px;
//   font-weight: 600;
//   cursor: pointer;
//   display: flex;
//   align-items: center;
//   justify-content: center;
//   gap: 8px;
//   transition: all 0.3s;
//   &:hover {
//     transform: translateY(-2px);
//     box-shadow: ${({ theme }) => theme.shadows.medium};
//   }
//   &:disabled {
//     opacity: 0.6;
//     cursor: not-allowed;
//   }
// `;

// // New Products
// const NewProductsSection = styled.section`
//   padding: 5rem 0;
//   background: ${({ theme }) => theme.colors.darkBrown};
//   color: white;
// `;

// const NewProductsContent = styled.div`
//   display: grid;
//   grid-template-columns: 1fr 1fr;
//   gap: 4rem;
//   align-items: center;
//   @media (max-width: 968px) {
//     grid-template-columns: 1fr;
//     gap: 2rem;
//   }
// `;

// const NewProductsText = styled.div`
//   h6 {
//     color: ${({ theme }) => theme.colors.brassGold};
//     letter-spacing: 3px;
//     text-transform: uppercase;
//     font-size: 0.8rem;
//   }
//   h2 {
//     font-family: "Playfair Display", serif;
//     font-size: 2.5rem;
//     margin: 1rem 0;
//     @media (max-width: 768px) {
//       font-size: 2rem;
//     }
//   }
//   p {
//     color: #D7CCC8;
//     line-height: 1.6;
//     margin-bottom: 1.5rem;
//   }
// `;

// const NewProductsList = styled.div`
//   display: flex;
//   flex-direction: column;
//   gap: 1rem;
// `;

// const NewProductItem = styled.div`
//   background: rgba(255,255,255,0.1);
//   backdrop-filter: blur(8px);
//   padding: 1rem;
//   border-radius: 16px;
//   display: flex;
//   justify-content: space-between;
//   align-items: center;
//   flex-wrap: wrap;
//   gap: 1rem;
//   transition: all 0.3s;
//   &:hover {
//     background: rgba(255,255,255,0.15);
//     transform: translateX(5px);
//   }
// `;

// const NewProductInfo = styled.div`
//   display: flex;
//   align-items: center;
//   gap: 1rem;
// `;

// const NewProductIconWrapper = styled.div`
//   width: 50px;
//   height: 50px;
//   background: ${({ theme }) => theme.colors.goldGradient};
//   border-radius: 12px;
//   display: flex;
//   align-items: center;
//   justify-content: center;
// `;

// const NewProductDetails = styled.div`
//   h4 {
//     font-size: 1rem;
//     margin-bottom: 4px;
//   }
//   p {
//     font-size: 0.8rem;
//     color: #D7CCC8;
//     display: flex;
//     align-items: center;
//     gap: 4px;
//   }
// `;

// const NewProductPrice = styled.div`
//   font-size: 1.2rem;
//   font-weight: bold;
//   color: ${({ theme }) => theme.colors.brassGold};
// `;

// // Custom Order
// const CustomOrderSection = styled.section`
//   padding: 5rem 0;
//   background: ${({ theme }) => theme.colors.cardBg};
// `;

// const CustomOrderGrid = styled.div`
//   display: grid;
//   grid-template-columns: repeat(4, 1fr);
//   gap: 2rem;
//   @media (max-width: 968px) {
//     grid-template-columns: repeat(2, 1fr);
//   }
//   @media (max-width: 640px) {
//     grid-template-columns: 1fr;
//   }
// `;

// const CustomOrderCard = styled.div`
//   background: white;
//   padding: 2rem;
//   border-radius: 20px;
//   text-align: center;
//   transition: all 0.3s;
//   border: 1px solid rgba(201,164,76,0.2);
//   &:hover {
//     transform: translateY(-5px);
//     box-shadow: ${({ theme }) => theme.shadows.medium};
//     border-color: ${({ theme }) => theme.colors.brassGold};
//   }
// `;

// const CustomIconWrapper = styled.div`
//   width: 70px;
//   height: 70px;
//   background: ${({ theme }) => theme.colors.creamGradient};
//   border-radius: 50%;
//   display: flex;
//   align-items: center;
//   justify-content: center;
//   margin: 0 auto 1rem;
//   color: ${({ theme }) => theme.colors.copperBrown};
// `;

// const CTASection = styled.div`
//   text-align: center;
//   margin-top: 3rem;
// `;

// const CTAButton = styled.button`
//   background: ${({ theme }) => theme.colors.goldGradient};
//   color: white;
//   border: none;
//   padding: 0.8rem 2rem;
//   border-radius: 40px;
//   font-weight: 600;
//   font-size: 1rem;
//   cursor: pointer;
//   transition: all 0.3s;
//   &:hover {
//     transform: translateY(-3px);
//     box-shadow: ${({ theme }) => theme.shadows.large};
//   }
// `;

// // Recently Viewed (horizontal scroll, but contained)
// const RecentlyViewedSection = styled.section`
//   padding: 3rem 0;
//   background: white;
//   border-top: 1px solid rgba(184,115,51,0.1);
//   border-bottom: 1px solid rgba(184,115,51,0.1);
// `;

// const RecentlyViewedHeader = styled.div`
//   display: flex;
//   justify-content: space-between;
//   align-items: center;
//   flex-wrap: wrap;
//   gap: 1rem;
//   margin-bottom: 1.5rem;
//   h6 {
//     color: #B87333;
//     font-size: 0.8rem;
//     letter-spacing: 2px;
//   }
//   h2 {
//     font-family: "Playfair Display", serif;
//     font-size: 1.8rem;
//     color: #3E2723;
//   }
// `;

// const ScrollRow = styled.div`
//   display: flex;
//   gap: 1rem;
//   overflow-x: auto;
//   padding-bottom: 0.5rem;
//   scrollbar-width: thin;
//   -webkit-overflow-scrolling: touch;
//   &::-webkit-scrollbar {
//     height: 4px;
//   }
//   &::-webkit-scrollbar-track {
//     background: #f0e6dc;
//     border-radius: 10px;
//   }
//   &::-webkit-scrollbar-thumb {
//     background: #B87333;
//     border-radius: 10px;
//   }
// `;

// // Main Component
// const Home = ({ addToCart }) => {
//   const navigate = useNavigate();
//   const { refreshWishlist } = useWishlist();

//   const [wishlistedIds, setWishlistedIds] = useState([]);
//   const [addedIds, setAddedIds] = useState([]);
//   const [quickViewProduct, setQuickViewProduct] = useState(null);
//   const [quickViewWishlisted, setQuickViewWishlisted] = useState(false);
//   const [featuredShops, setFeaturedShops] = useState([]);
//   const [shopsLoading, setShopsLoading] = useState(true);
//   const [popularProducts, setPopularProducts] = useState([]);
//   const [recentlyViewed, setRecentlyViewed] = useState([]);

//   const getUserId = () => {
//     try {
//       const keys = ['songirUser', 'currentUser', 'user'];
//       for (let k of keys) {
//         const raw = localStorage.getItem(k);
//         if (raw) {
//           const u = JSON.parse(raw);
//           const id = u._id || u.id || u.email;
//           if (id) return String(id).replace(/[^a-zA-Z0-9_-]/g, '_');
//         }
//       }
//     } catch {}
//     return 'guest';
//   };
//   const getRecentKey = () => `songir_recently_viewed_${getUserId()}`;

//   useEffect(() => {
//     const readRecent = () => {
//       try {
//         const stored = localStorage.getItem(getRecentKey());
//         if (stored) setRecentlyViewed(JSON.parse(stored));
//       } catch (e) {}
//     };
//     readRecent();
//     window.addEventListener('storage', readRecent);
//     return () => window.removeEventListener('storage', readRecent);
//   }, []);

//   useEffect(() => {
//     const fetchShops = async () => {
//       try {
//         const res = await fetch("http://localhost:5000/api/shops/approved");
//         const data = await res.json();
//         const arr = Array.isArray(data) ? data : (data.shops || []);
//         setFeaturedShops(arr.slice(0, 3));
//       } catch (err) {
//         console.error(err);
//       } finally {
//         setShopsLoading(false);
//       }
//     };
//     fetchShops();
//   }, []);

//   useEffect(() => {
//     const fetchProducts = async () => {
//       try {
//         const res = await fetch("http://localhost:5000/api/products");
//         const data = await res.json();
//         const arr = Array.isArray(data) ? data : (data.products || []);
//         const sorted = arr.sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt));
//         setPopularProducts(sorted.slice(0, 4));
//       } catch (err) {
//         console.error(err);
//       }
//     };
//     fetchProducts();
//     const interval = setInterval(fetchProducts, 60000);
//     return () => clearInterval(interval);
//   }, []);

//   useEffect(() => {
//     try {
//       const wishlist = JSON.parse(localStorage.getItem('songirWishlist') || '[]');
//       setWishlistedIds(wishlist.map(item => item.id));
//     } catch (e) {}
//   }, []);

//   const getImageSrc = (img) => {
//     if (!img) return null;
//     return img.startsWith('http') ? img : `http://localhost:5000/${img}`;
//   };

//   const showToast = (msg, bg) => {
//     const toast = document.createElement('div');
//     toast.textContent = msg;
//     toast.style.cssText = `position:fixed;bottom:20px;left:50%;transform:translateX(-50%);background:${bg};color:white;padding:8px 20px;border-radius:30px;font-weight:600;z-index:9999;font-size:0.9rem;`;
//     document.body.appendChild(toast);
//     setTimeout(() => toast.remove(), 2000);
//   };

//   const handleToggleWishlist = (e, product) => {
//     e.stopPropagation();
//     const pid = String(product._id || product.id);
//     const item = {
//       id: pid, name: product.name, price: product.price,
//       oldPrice: product.price + 300,
//       image: getImageSrc(product.image),
//       category: product.category,
//       shop: product.shopName,
//       rating: product.rating,
//       inStock: product.inStock
//     };
//     const added = toggleWishlist(item);
//     setWishlistedIds(prev => added ? [...prev, pid] : prev.filter(id => id !== pid));
//     refreshWishlist();
//     showToast(added ? '❤️ Added to Wishlist' : '🗑️ Removed from Wishlist', added ? '#B87333' : '#DC2626');
//   };

//   const handleAddToCart = (e, product) => {
//     e.stopPropagation();
//     if (!product.inStock || !addToCart) return;
//     addToCart({ ...product, id: product._id, originalPrice: product.price + 300, image: getImageSrc(product.image) });
//     setAddedIds(prev => [...prev, String(product._id)]);
//     setTimeout(() => setAddedIds(prev => prev.filter(id => id !== String(product._id))), 1500);
//     showToast('🛒 Added to Cart', '#B87333');
//   };

//   const handleViewProduct = (product) => {
//     navigate('/ProductDetail', { state: { product } });
//     window.scrollTo(0, 0);
//   };

//   const openQuickView = (product) => {
//     setQuickViewWishlisted(wishlistedIds.includes(product.id));
//     setQuickViewProduct(product);
//   };
//   const closeQuickView = () => setQuickViewProduct(null);

//   const handleQuickAddToCart = (product) => {
//     if (!product.inStock || !addToCart) return;
//     addToCart({ ...product, id: product._id, originalPrice: product.price + 300, image: getImageSrc(product.image) });
//     showToast('🛒 Added to Cart', '#B87333');
//   };

//   const handleQuickToggleWishlist = (product) => {
//     const item = { id: product.id, name: product.name, price: product.price, image: product.image, category: product.category };
//     const added = toggleWishlist(item);
//     setWishlistedIds(prev => added ? [...prev, product.id] : prev.filter(id => id !== product.id));
//     setQuickViewWishlisted(added);
//     refreshWishlist();
//     showToast(added ? '❤️ Added to Wishlist' : '🗑️ Removed', added ? '#B87333' : '#DC2626');
//   };

//   const handleQuickViewFull = (product) => {
//     handleViewProduct(product);
//     closeQuickView();
//   };

//   const promises = [
//     { icon: <Award size={28} />, title: "Pure Materials", description: "Authentic raw materials, no impurities." },
//     { icon: <Heart size={28} />, title: "Handmade with Love", description: "Skilled artisans craft each piece." },
//     { icon: <CheckCircle size={28} />, title: "Quality Assured", description: "Strict quality checks for durability." },
//     { icon: <TrendingUp size={28} />, title: "Actionable Results", description: "Health benefits & superior cooking." },
//     { icon: <Truck size={28} />, title: "Safe Delivery", description: "Carefully packed & insured delivery." },
//     { icon: <Users size={28} />, title: "Direct from Artisans", description: "Support local craftsmen directly." },
//   ];

//   const newProductsList = [
//     { name: "Copper Masala Dibba", artisan: "Rashmi Wagh", price: "₹1,299" },
//     { name: "Brass Glass Set", artisan: "Ashok Tagar", price: "₹2,999" },
//     { name: "Traditional Copper Bowl", artisan: "Uttam Gavhale", price: "₹799" },
//   ];

//   const customFeatures = [
//     { icon: <Package size={32} />, title: "Request Quote", description: "Tailored orders for your needs" },
//     { icon: <ShoppingBag size={32} />, title: "Customization", description: "Your design engraved on metal" },
//     { icon: <Users size={32} />, title: "Bulk Orders", description: "Special rates for corporate gifts" },
//     { icon: <Clock size={32} />, title: "Fast Delivery", description: "Timely and reliable shipping" },
//   ];

//   return (
//     <ThemeProvider theme={theme}>
//       <GlobalFonts />
//       <GlobalWrapper>
//         <Container>
//           <HeroSection>
//             <DecorativePattern className="top-left" />
//             <HeroContent>
//               <h1>Tradition Crafted by Hand. Heritage Served in Every Utensil.</h1>
//               <HeroSubtitle>Discover authentic handmade brass, copper, and clay utensils from Songir artisans.</HeroSubtitle>
//               <ButtonGroup>
//                 <Button onClick={() => navigate("/products")}>Explore Collection <ChevronRight size={18} /></Button>
//                 <Button className="secondary" onClick={() => navigate("/shops")}>Meet Our Artisans</Button>
//               </ButtonGroup>
//             </HeroContent>
//             <HeroImage>
//               <img src={artisanCrafting} alt="Artisan at work" />
//             </HeroImage>
//           </HeroSection>
//         </Container>

//         <PromiseSection>
//           <Container>
//             <SectionHeader>
//               <h6>Why Choose Us</h6>
//               <h2>The Songir Promise</h2>
//               <p>Excellence meets tradition and integrity in every crafted utensil.</p>
//             </SectionHeader>
//             <PromiseGrid>
//               {promises.map((p, i) => (
//                 <PromiseCard key={i}>
//                   <IconWrapper>{p.icon}</IconWrapper>
//                   <CardTitle>{p.title}</CardTitle>
//                   <CardDescription>{p.description}</CardDescription>
//                 </PromiseCard>
//               ))}
//             </PromiseGrid>
//           </Container>
//         </PromiseSection>

//         <ShopkeepersSection>
//           <Container>
//             <ShopkeepersHeader>
//               <div>
//                 <h6>Our Artisans</h6>
//                 <h2>Featured Shopkeepers</h2>
//               </div>
//               <ViewAllButton onClick={() => navigate("/shops")}>View All Shops <ArrowRight size={16} /></ViewAllButton>
//             </ShopkeepersHeader>
//             {shopsLoading ? (
//               <div style={{ textAlign: "center", padding: "2rem" }}>Loading artisans...</div>
//             ) : (
//               <ShopkeepersGrid>
//                 {featuredShops.map((shop, idx) => (
//                   <RealShopCard key={shop._id} onClick={() => navigate("/shops")}>
//                     <VerifiedCorner><CheckCircle2 size={12} /> Verified</VerifiedCorner>
//                     <CardTop>
//                       <ShopAvatarCircle>{shop.shopName?.slice(0,2).toUpperCase()}</ShopAvatarCircle>
//                       <ShopNameBold>{shop.shopName}</ShopNameBold>
//                       <ShopOwnerSub>{shop.ownerName}</ShopOwnerSub>
//                       <StarsRow>
//                         <Star size={14} fill="#F59E0B" color="#F59E0B" />
//                         <span>4.5</span>
//                       </StarsRow>
//                     </CardTop>
//                     <CardBottom>
//                       <ShopDesc>Handcrafted items with traditional techniques.</ShopDesc>
//                       <InfoRow>
//                         <InfoChip><Clock size={12} /> {shop.openingTime || "10:00"} - {shop.closingTime || "20:00"}</InfoChip>
//                         <InfoChip><Package size={12} /> {shop.productCount || 0} products</InfoChip>
//                       </InfoRow>
//                       <DaysRow>
//                         {(shop.workingDays || ["Mon","Tue","Wed","Thu","Fri"]).map((d, i) => <DayPill key={i}>{d}</DayPill>)}
//                       </DaysRow>
//                       <CardBtns>
//                         <BtnPrimaryWide>View Shop <ArrowRight size={14} /></BtnPrimaryWide>
//                         <BtnGhostWide>Get Quote</BtnGhostWide>
//                       </CardBtns>
//                     </CardBottom>
//                   </RealShopCard>
//                 ))}
//               </ShopkeepersGrid>
//             )}
//           </Container>
//         </ShopkeepersSection>

//         <UtensilsSection>
//           <Container>
//             <SectionHeader>
//               <h6>Our Collection</h6>
//               <h2>Popular Utensils</h2>
//               <p>Handpicked premium brass and copper utensils crafted by master artisans.</p>
//             </SectionHeader>
//             {popularProducts.length === 0 ? (
//               <div style={{ textAlign: "center", padding: "2rem" }}>Loading products...</div>
//             ) : (
//               <UtensilsGrid>
//                 {popularProducts.map((product, idx) => {
//                   const pid = String(product._id);
//                   const isLiked = wishlistedIds.includes(pid);
//                   const isAdded = addedIds.includes(pid);
//                   const badges = ["NEW", "POPULAR", "TRENDING", "BESTSELLER"];
//                   return (
//                     <ProductCard key={pid} onClick={() => handleViewProduct(product)}>
//                       <ProductImageBox>
//                         <ProductBadge>{badges[idx % 4]}</ProductBadge>
//                         <ProductActions>
//                           <ActionButton $active={isLiked} onClick={(e) => handleToggleWishlist(e, product)}>
//                             <Heart size={16} fill={isLiked ? "currentColor" : "none"} />
//                           </ActionButton>
//                           <ActionButton onClick={(e) => { e.stopPropagation(); openQuickView(product); }}>
//                             <Eye size={16} />
//                           </ActionButton>
//                         </ProductActions>
//                         <img src={getImageSrc(product.image)} alt={product.name} onError={e => e.target.src = "https://placehold.co/300x260"} />
//                       </ProductImageBox>
//                       <ProductInfo>
//                         <ProductCategory>{product.category}</ProductCategory>
//                         <ProductName>{product.name}</ProductName>
//                         <ProductMeta>
//                           <ProductRating><Star size={12} fill="#C9A44C" color="#C9A44C" /> {product.rating || "4.8"}</ProductRating>
//                           <ProductPrice>₹{(product.price || 0).toLocaleString()}</ProductPrice>
//                         </ProductMeta>
//                         <AddToCartButton onClick={(e) => handleAddToCart(e, product)} disabled={!product.inStock || isAdded}>
//                           {isAdded ? <><CheckCircle size={14} /> Added</> : <><ShoppingCart size={14} /> Add to Cart</>}
//                         </AddToCartButton>
//                       </ProductInfo>
//                     </ProductCard>
//                   );
//                 })}
//               </UtensilsGrid>
//             )}
//             <CTASection>
//               <ViewAllButton onClick={() => navigate("/products")}>See All Products <ArrowRight size={16} /></ViewAllButton>
//             </CTASection>
//           </Container>
//         </UtensilsSection>

//         {recentlyViewed.length > 0 && (
//           <RecentlyViewedSection>
//             <Container>
//               <RecentlyViewedHeader>
//                 <div>
//                   <h6>Your History</h6>
//                   <h2>Recently Viewed</h2>
//                 </div>
//                 <div style={{ display: "flex", gap: "0.8rem", alignItems: "center" }}>
//                   <span style={{ fontSize: "0.75rem", color: "#8D6E63" }}>{recentlyViewed.length} items</span>
//                   <button onClick={() => { localStorage.removeItem(getRecentKey()); setRecentlyViewed([]); }} style={{ background: "none", border: "1px solid #E0D5C5", padding: "4px 10px", borderRadius: "20px", fontSize: "0.7rem", cursor: "pointer" }}>Clear</button>
//                   <ViewAllButton onClick={() => navigate("/products")} style={{ padding: "4px 12px", fontSize: "0.7rem" }}>Browse All <ArrowRight size={12} /></ViewAllButton>
//                 </div>
//               </RecentlyViewedHeader>
//               <ScrollRow>
//                 {recentlyViewed.map(item => (
//                   <div key={item.id} onClick={() => navigate("/ProductDetail", { state: { product: item } })} style={{ minWidth: "140px", width: "140px", background: "white", borderRadius: "12px", overflow: "hidden", border: "1px solid #F0E6DC", cursor: "pointer" }}>
//                     <div style={{ height: "120px", overflow: "hidden" }}>
//                       <img src={item.image} alt={item.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
//                     </div>
//                     <div style={{ padding: "8px" }}>
//                       <p style={{ fontSize: "0.7rem", color: "#B87333", fontWeight: "bold" }}>{item.category}</p>
//                       <p style={{ fontSize: "0.8rem", fontWeight: "600", margin: "4px 0" }}>{item.name}</p>
//                       <p style={{ fontSize: "0.9rem", fontWeight: "bold", color: "#B87333" }}>₹{item.price?.toLocaleString()}</p>
//                     </div>
//                   </div>
//                 ))}
//               </ScrollRow>
//             </Container>
//           </RecentlyViewedSection>
//         )}

//         <NewProductsSection>
//           <Container>
//             <NewProductsContent>
//               <NewProductsText>
//                 <h6>Latest Arrivals</h6>
//                 <h2>New Products from Our Artisans</h2>
//                 <p>Be the first to discover our latest handcrafted utensils. Fresh from the workshops.</p>
//                 <Button onClick={() => navigate("/products")}>See All New Arrivals <ChevronRight size={18} /></Button>
//               </NewProductsText>
//               <NewProductsList>
//                 {newProductsList.map((item, idx) => (
//                   <NewProductItem key={idx}>
//                     <NewProductInfo>
//                       <NewProductIconWrapper><Sparkles size={22} /></NewProductIconWrapper>
//                       <NewProductDetails>
//                         <h4>{item.name}</h4>
//                         <p><BadgeCheck size={12} /> {item.artisan}</p>
//                       </NewProductDetails>
//                     </NewProductInfo>
//                     <NewProductPrice>{item.price}</NewProductPrice>
//                   </NewProductItem>
//                 ))}
//               </NewProductsList>
//             </NewProductsContent>
//           </Container>
//         </NewProductsSection>

//         <CustomOrderSection>
//           <Container>
//             <SectionHeader>
//               <h6>Personalized Service</h6>
//               <h2>Need a Custom Order?</h2>
//               <p>Get personalized brass and copper utensils made specifically for you.</p>
//             </SectionHeader>
//             <CustomOrderGrid>
//               {customFeatures.map((f, idx) => (
//                 <CustomOrderCard key={idx}>
//                   <CustomIconWrapper>{f.icon}</CustomIconWrapper>
//                   <CardTitle>{f.title}</CardTitle>
//                   <CardDescription>{f.description}</CardDescription>
//                 </CustomOrderCard>
//               ))}
//             </CustomOrderGrid>
//             <CTASection>
//               <CTAButton onClick={() => navigate('/quote')}>Request Custom Quote</CTAButton>
//             </CTASection>
//           </Container>
//         </CustomOrderSection>

//         <QuickViewModal
//           product={quickViewProduct}
//           isOpen={!!quickViewProduct}
//           onClose={closeQuickView}
//           onAddToCart={handleQuickAddToCart}
//           onViewFullDetails={handleQuickViewFull}
//           onToggleWishlist={handleQuickToggleWishlist}
//           isWishlisted={quickViewWishlisted}
//         />
//       </GlobalWrapper>
//     </ThemeProvider>
//   );
// };

// export default Home;