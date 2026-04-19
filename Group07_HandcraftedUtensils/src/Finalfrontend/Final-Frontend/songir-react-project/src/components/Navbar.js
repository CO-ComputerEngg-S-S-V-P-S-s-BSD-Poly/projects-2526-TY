import React, { useState, useEffect, useRef, useCallback } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import styled, { keyframes, css } from 'styled-components';
import {
  Menu, X, ShoppingCart, User, Search, ChevronDown,
  Package, Sparkles, Award, TrendingUp, Heart, Grid,
  Tag, Zap, Gift, Home, LogOut, Settings, MapPin,
  UserPlus, Star, Shield, ArrowRight,
  Flame, Crown, Compass, CheckCircle,
  Truck, RefreshCw, Users, ChevronRight,
  HelpCircle, MessageSquare, Bell, Hexagon,
  Aperture, Sun, Feather, Eye, ShoppingBag, LogIn
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useWishlist } from '../context/WishlistContext';
import { toggleWishlist, isInWishlist } from '../utils/wishlistUtils';

const BASE_URL = "http://localhost:5000";

/* ═══════════════════════════════════════════════
   KEYFRAMES
═══════════════════════════════════════════════ */
const fadeDown   = keyframes`from{opacity:0;transform:translateY(-10px)}to{opacity:1;transform:translateY(0)}`;
const shimmer    = keyframes`0%{background-position:-500% center}100%{background-position:500% center}`;
const pulseBadge = keyframes`0%,100%{transform:scale(1)}50%{transform:scale(1.18)}`;
const glowRing   = keyframes`0%,100%{box-shadow:0 0 0 0 rgba(201,164,76,0)}50%{box-shadow:0 0 0 5px rgba(201,164,76,0.22)}`;
const fadeIn     = keyframes`from{opacity:0}to{opacity:1}`;
const slideUp    = keyframes`from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}`;
const scaleIn    = keyframes`from{opacity:0;transform:scale(0.95)}to{opacity:1;transform:scale(1)}`;
const popIn      = keyframes`from{opacity:0;transform:scale(0.8)}to{opacity:1;transform:scale(1)}`;

/* ── Announcement bar ── */
const AnnBar = styled.div`
  background:linear-gradient(270deg,#7a4a0a 0%,#c9943d 25%,#b8762e 50%,#c9943d 75%,#7a4a0a 100%);
  background-size:300% 100%;animation:${shimmer} 8s linear infinite;
  padding:0.48rem 1rem;text-align:center;position:relative;overflow:hidden;
  &::before,&::after{content:'✦';position:absolute;top:50%;transform:translateY(-50%);color:rgba(255,255,255,0.38);font-size:0.65rem}
  &::before{left:1.5rem}&::after{right:1.5rem}
`;
const AnnText = styled.span`
  color:#fff;font-size:0.75rem;font-weight:600;letter-spacing:0.7px;position:relative;z-index:1;
  em{font-style:normal;color:#FFE4A0;font-weight:700}
  @media(max-width:768px){font-size:0.68rem}
`;
const AnnClose = styled.button`
  position:absolute;right:0.9rem;top:50%;transform:translateY(-50%);
  background:none;border:none;color:rgba(255,255,255,0.65);cursor:pointer;font-size:0.75rem;z-index:2;padding:0 4px;
  &:hover{color:#fff}
`;

/* ── Nav shell ── */
const Wrapper = styled.div`position:fixed;top:0;left:0;right:0;z-index:1000;`;
const Nav = styled.nav`
  background:${({$s})=>$s?'rgba(71, 29, 6, 0.96)':'linear-gradient(90deg,#1e0b02 0%,#3E2713 35%,#6b3d12 70%,#9f5e1a 100%)'};
  backdrop-filter:${({$s})=>$s?'blur(20px)':'none'};
  box-shadow:${({$s})=>$s?'0 2px 24px rgba(10,4,0,0.55),0 1px 0 rgba(201,164,76,0.12)':'0 1px 12px rgba(30,10,0,0.18)'};
  border-bottom:1px solid ${({$s})=>$s?'rgba(209,162,50,0.72)':'rgba(255,255,255,0.05)'};
  transition:all 0.35s cubic-bezier(0.4,0,0.2,1);
`;
const Inner = styled.div`
  max-width:1440px;margin:0 auto;padding:0 2.5rem;height:60px;
  display:flex;justify-content:space-between;align-items:center;gap:1.25rem;
  @media(max-width:1200px){padding:0 1.5rem}
  @media(max-width:768px){padding:0 1rem}
`;

/* ── Logo ── */
const Logo = styled(NavLink)`
  display:flex;align-items:center;gap:0.6rem;text-decoration:none;flex-shrink:0;
  transition:opacity 0.2s;&:hover{opacity:0.9}
`;
const LogoMark = styled.div`
  width:36px;height:36px;background:linear-gradient(135deg,#9f680f,#C9943D);border-radius:9px;
  display:flex;align-items:center;justify-content:center;box-shadow:0 3px 10px rgba(201,164,76,0.3);
  position:relative;overflow:hidden;
  &::after{content:'';position:absolute;inset:0;background:linear-gradient(135deg,rgba(255,255,255,0.12),transparent)}
`;
const LogoText = styled.div`
  display:flex;flex-direction:column;
  h1{font-family:'Georgia',serif;font-size:1.25rem;font-weight:700;color:#fff;margin:0;line-height:1;letter-spacing:-0.2px}
  p{font-size:0.55rem;color:rgba(255,255,255,0.55);letter-spacing:3px;text-transform:uppercase;font-weight:600;margin:0;margin-top:1px}
  @media(max-width:768px){h1{font-size:1.1rem}}
`;

/* ── Mobile hamburger ── */
const Hamburger = styled.button`
  display:none;background:rgba(255,255,255,0.07);border:1px solid rgba(255,255,255,0.16);
  color:#fff;width:38px;height:38px;border-radius:8px;cursor:pointer;
  align-items:center;justify-content:center;transition:all 0.25s;flex-shrink:0;
  &:hover{background:rgba(255,255,255,0.13)}
  @media(max-width:1024px){display:flex}
`;

/* ── Nav links ── */
const NavLinks = styled.div`
  display:flex;gap:0;align-items:center;flex:0 1 auto;
  @media(max-width:1024px){
    display:${({$o})=>$o?'flex':'none'};flex-direction:column;
    position:fixed;top:${({$h})=>$h}px;left:0;right:0;
    background:rgba(18,7,1,0.99);backdrop-filter:blur(20px);
    padding:0.75rem 1rem 1.75rem;box-shadow:0 16px 48px rgba(0,0,0,0.55);
    animation:${fadeDown} 0.25s ease;gap:0.1rem;
    max-height:calc(100vh - ${({$h})=>$h}px);overflow-y:auto;
    border-top:1px solid rgba(201,164,76,0.18);z-index:999;
  }
`;
const NavItm = styled.div`position:relative;@media(max-width:1024px){width:100%}`;

const linkBase = css`
  color:rgba(255,255,255,0.8);text-decoration:none;font-weight:500;font-size:0.83rem;
  padding:0.45rem 0.78rem;display:flex;align-items:center;gap:0.35rem;border-radius:7px;
  transition:all 0.2s;position:relative;letter-spacing:0.15px;cursor:pointer;font-family:inherit;
  &::after{content:'';position:absolute;bottom:3px;left:50%;width:0;height:1.5px;
    background:linear-gradient(90deg,#C9943D,#FFD97D);border-radius:99px;transform:translateX(-50%);transition:width 0.25s}
  &:hover{color:#fff;background:rgba(255,255,255,0.07);&::after{width:calc(100% - 1.5rem)}}
  &.active{color:#FFD97D;background:rgba(201,164,76,0.1);&::after{width:calc(100% - 1.5rem);background:#FFD97D}}
  @media(max-width:1024px){width:100%;padding:0.75rem 1rem;border-radius:9px;&::after{display:none}&:hover{background:rgba(201,164,76,0.09)}}
`;
const NavA = styled(NavLink)`${linkBase}`;
const DropTrigger = styled.button`
  ${linkBase}background:none;border:none;
  svg.ch{margin-left:2px;transition:transform 0.25s;opacity:0.55;${({$o})=>$o&&'transform:rotate(180deg)'}}
  @media(max-width:1024px){justify-content:space-between}
`;

/* ── Mega menu ── */
const Mega = styled.div`
  position:absolute;top:calc(100% + 8px);left:50%;
  transform:${({$o})=>$o?'translateX(-50%) translateY(0)':'translateX(-50%) translateY(-10px)'};
  background:#fff;border:1px solid rgba(184,118,46,0.14);border-radius:14px;
  box-shadow:0 16px 48px rgba(20,8,0,0.18),0 2px 12px rgba(184,118,46,0.08);
  opacity:${({$o})=>$o?1:0};visibility:${({$o})=>$o?'visible':'hidden'};
  transition:all 0.28s cubic-bezier(0.4,0,0.2,1);
  width:${({$w})=>$w?'720px':'640px'};z-index:1001;overflow:hidden;
  @media(max-width:1024px){
    position:static;transform:none;width:100%;margin:0.2rem 0 0.4rem 0.65rem;
    border-radius:10px;background:rgba(255,255,255,0.04);box-shadow:none;
    border:1px solid rgba(201,164,76,0.13);display:${({$o})=>$o?'block':'none'};opacity:1;visibility:visible;
  }
`;
const MegaTopBar = styled.div`
  background:linear-gradient(90deg,#3E2713,#7a4a0a);
  padding:0.6rem 1.1rem;display:flex;align-items:center;justify-content:space-between;
  @media(max-width:1024px){display:none}
`;
const MegaTopTitle = styled.div`color:#FFE4A0;font-family:'Georgia',serif;font-size:0.82rem;font-weight:700;display:flex;align-items:center;gap:0.4rem;span{color:rgba(255,228,160,0.55);font-size:0.68rem;font-weight:400;font-family:inherit;margin-left:0.4rem}`;
const MegaViewAll = styled.button`background:rgba(255,228,160,0.1);border:1px solid rgba(255,228,160,0.28);color:#FFE4A0;padding:0.25rem 0.75rem;border-radius:14px;font-size:0.68rem;font-weight:600;cursor:pointer;display:flex;align-items:center;gap:0.3rem;transition:all 0.2s;font-family:inherit;&:hover{background:rgba(255,228,160,0.2);transform:translateX(2px)}`;
const MegaGrid = styled.div`display:grid;grid-template-columns:1fr 1fr;@media(max-width:640px){grid-template-columns:1fr}`;
const MegaCol = styled.div`padding:0.9rem 1rem;&:first-child{border-right:1px solid rgba(184,118,46,0.09)}@media(max-width:1024px){padding:0.65rem 0.75rem;&:first-child{border-right:none;border-bottom:1px solid rgba(201,164,76,0.09)}}`;
const ColHead = styled.div`display:flex;align-items:center;gap:0.38rem;margin-bottom:0.55rem;span{color:#a06520;font-size:0.62rem;font-weight:800;text-transform:uppercase;letter-spacing:2px}svg{color:#C9943D;flex-shrink:0}`;
const MItem = styled.div`
  display:flex;align-items:center;gap:0.6rem;padding:0.48rem 0.55rem;border-radius:8px;cursor:pointer;transition:all 0.2s;border:1px solid transparent;margin-bottom:0.1rem;
  &:hover{background:rgba(184,118,46,0.06);border-color:rgba(184,118,46,0.15);transform:translateX(3px)}
  .mi{width:32px;height:32px;border-radius:8px;display:flex;align-items:center;justify-content:center;flex-shrink:0;background:${({$ib})=>$ib||'rgba(201,148,61,0.09)'};color:${({$ic})=>$ic||'#B8762E'};transition:all 0.25s}
  &:hover .mi{background:${({$hb})=>$hb||'linear-gradient(135deg,#C9943D,#9f5e1a)'};color:#fff}
  .mc{flex:1;min-width:0}.mt{display:flex;align-items:center;gap:0.3rem;h4{color:#2a1408;font-size:0.8rem;font-weight:600;white-space:nowrap}}
  p{color:#a07850;font-size:0.68rem;margin-top:0.08rem;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
  &:hover .mt h4{color:#9f5e1a}
  .ar{color:rgba(184,118,46,0.28);transition:all 0.2s;flex-shrink:0}&:hover .ar{color:#B8762E;transform:translateX(2px)}
`;
const Pip = styled.span`
  font-size:0.54rem;font-weight:800;padding:1px 5px;border-radius:12px;text-transform:uppercase;letter-spacing:0.3px;flex-shrink:0;
  ${({$v})=>{switch($v){
    case 'new': return 'background:#e8f5e9;color:#2E7D32;border:1px solid rgba(46,125,50,0.18)';
    case 'hot': return 'background:#fff3e0;color:#E65100;border:1px solid rgba(230,81,0,0.18)';
    case 'sale':return 'background:#fce4ec;color:#C62828;border:1px solid rgba(198,40,40,0.18)';
    case 'top': return 'background:#fff8e1;color:#9f5e1a;border:1px solid rgba(184,118,46,0.28)';
    case 'eco': return 'background:#f1f8e9;color:#33691E;border:1px solid rgba(51,105,30,0.18)';
    case 'vfy': return 'background:#e3f2fd;color:#0D47A1;border:1px solid rgba(13,71,161,0.18)';
    default:    return 'background:rgba(184,118,46,0.09);color:#9f5e1a;border:1px solid rgba(184,118,46,0.18)';
  }}}
`;

const DeityRow = styled.div`
  display:flex;flex-wrap:wrap;gap:0.3rem;margin-top:0.55rem;padding:0.45rem 0.55rem;
  background:rgba(255,160,0,0.04);border:1px solid rgba(255,160,0,0.12);border-radius:9px;
`;
const DeityChip = styled.button`
  background:rgba(255,160,0,0.07);border:1px solid rgba(255,140,0,0.2);color:#7a3a00;
  padding:0.22rem 0.6rem;border-radius:12px;font-size:0.67rem;font-weight:700;cursor:pointer;
  font-family:inherit;transition:all 0.18s;display:flex;align-items:center;gap:0.25rem;
  &:hover{background:linear-gradient(135deg,#F9A825,#e65100);color:#fff;border-color:transparent;transform:translateY(-1px)}
`;

/* ── Dynamic Shops Scrollable list ── */
const ShopsScroll = styled.div`
  max-height:210px;overflow-y:auto;padding-right:2px;
  scrollbar-width:thin;scrollbar-color:rgba(184,118,46,0.35) transparent;
  &::-webkit-scrollbar{width:4px}
  &::-webkit-scrollbar-track{background:rgba(184,118,46,0.05);border-radius:99px}
  &::-webkit-scrollbar-thumb{background:rgba(184,118,46,0.35);border-radius:99px}
  &::-webkit-scrollbar-thumb:hover{background:rgba(184,118,46,0.6)}
`;
const ShopsDotWrap = styled.div`
  display:flex;align-items:center;justify-content:center;gap:5px;padding:1.1rem;color:#bda98a;font-size:0.74rem;
`;
const ShopsDot = styled.span`
  width:6px;height:6px;border-radius:50%;background:#C9943D;display:inline-block;
  animation:${pulseBadge} 1.1s ease infinite;
  &:nth-child(2){animation-delay:0.18s}&:nth-child(3){animation-delay:0.36s}
`;

/* ── Shop artisan row ── */
const ArtRow = styled.div`
  display:flex;align-items:center;gap:0.6rem;padding:0.5rem 0.55rem;border-radius:9px;
  cursor:pointer;transition:all 0.2s;border:1px solid rgba(184,118,46,0.09);
  margin-bottom:0.22rem;background:#fdfaf6;
  &:hover{border-color:rgba(184,118,46,0.25);background:#fff;box-shadow:0 2px 10px rgba(62,27,19,0.07);transform:translateX(2px)}
  @media(max-width:1024px){background:transparent}
`;
const ArtAva = styled.div`
  width:34px;height:34px;border-radius:9px;background:${({$bg})=>$bg};
  display:flex;align-items:center;justify-content:center;
  font-family:'Georgia',serif;font-size:0.82rem;font-weight:700;color:#fff;flex-shrink:0;position:relative;
`;
const ArtVfy = styled.div`
  position:absolute;bottom:-2px;right:-2px;width:13px;height:13px;
  background:#4CAF50;border-radius:50%;border:2px solid #fff;
  display:flex;align-items:center;justify-content:center;color:#fff;
`;
const ArtInfo = styled.div`
  flex:1;min-width:0;
  h4{color:#2a1408;font-size:0.79rem;font-weight:650;display:flex;align-items:center;gap:0.3rem;margin-bottom:0.1rem}
  p{color:#a07850;font-size:0.67rem;display:flex;align-items:center;gap:0.22rem;margin:0}
`;
const ArtMeta = styled.div`
  flex-shrink:0;text-align:right;
  .c{font-size:0.67rem;color:#9f5e1a;font-weight:700;display:block}
  .s{font-size:0.61rem;color:#bda98a}
`;
const Stars = styled.div`display:flex;align-items:center;gap:1px;margin-top:2px;`;
const StatsRow = styled.div`display:flex;border-top:1px solid rgba(184,118,46,0.09);background:rgba(201,148,61,0.025);@media(max-width:1024px){display:none}`;
const StatItem = styled.div`flex:1;padding:0.5rem 0.75rem;display:flex;align-items:center;gap:0.45rem;border-right:1px solid rgba(184,118,46,0.09);&:last-child{border-right:none}svg{color:#C9943D;flex-shrink:0}strong{display:block;color:#2a1408;font-size:0.76rem;font-weight:700}span{color:#9e7a5a;font-size:0.61rem}`;

/* ── Right icons ── */
const Right = styled.div`display:flex;align-items:center;gap:0.55rem;flex-shrink:0;@media(max-width:1024px){display:none}`;
const IBtn = styled.button`
  background:rgba(255,255,255,0.07);border:1px solid rgba(255,255,255,0.13);
  width:36px;height:36px;border-radius:8px;color:rgba(255,255,255,0.82);
  cursor:pointer;display:flex;align-items:center;justify-content:center;
  transition:all 0.25s;position:relative;flex-shrink:0;
  &:hover{background:rgba(255,255,255,0.14);border-color:rgba(255,255,255,0.28);color:#fff;transform:translateY(-1px)}
`;
const WishBdg = styled.span`position:absolute;top:-4px;right:-4px;background:linear-gradient(135deg,#dc2626,#b91c1c);color:#fff;font-size:0.56rem;font-weight:700;min-width:16px;height:16px;border-radius:50%;display:flex;align-items:center;justify-content:center;border:2px solid transparent;animation:${pulseBadge} 2.5s ease infinite;padding:0 2px;`;
const Bdg = styled.span`position:absolute;top:-4px;right:-4px;background:linear-gradient(135deg,#E05A1A,#F08040);color:#fff;font-size:0.56rem;font-weight:700;min-width:16px;height:16px;border-radius:50%;display:flex;align-items:center;justify-content:center;border:2px solid transparent;animation:${pulseBadge} 2.5s ease infinite;padding:0 2px;`;

/* ── Guest auth buttons (Sign In + Register) ── */
const AuthWrap = styled.div`display:flex;align-items:center;gap:0.45rem;`;
const SignInBtn = styled.button`
  background:rgba(255,255,255,0.08);border:1.5px solid rgba(255,255,255,0.26);
  color:#fff;padding:0.44rem 0.9rem;border-radius:7px;font-size:0.78rem;font-weight:600;
  cursor:pointer;transition:all 0.25s;display:flex;align-items:center;gap:0.35rem;
  font-family:inherit;white-space:nowrap;
  &:hover{background:rgba(255,255,255,0.15);border-color:rgba(255,255,255,0.45);transform:translateY(-1px)}
`;
const RegisterBtn = styled.button`
  background:linear-gradient(135deg,#C9943D,#996320);border:none;color:#fff;
  padding:0.44rem 0.9rem;border-radius:7px;font-size:0.78rem;font-weight:700;
  cursor:pointer;transition:all 0.25s;display:flex;align-items:center;gap:0.35rem;
  box-shadow:0 3px 10px rgba(198,130,20,0.35);font-family:inherit;white-space:nowrap;
  &:hover{transform:translateY(-1px);box-shadow:0 6px 18px rgba(201,148,61,0.45)}
`;

const QuoteBtn = styled.button`
  background:linear-gradient(135deg,#3E2713,#7a4a0a);border:1.5px solid rgba(201,164,76,0.35);
  color:#FFE4A0;padding:0.44rem 1.1rem;border-radius:7px;font-size:0.78rem;font-weight:700;
  cursor:pointer;transition:all 0.25s;display:flex;align-items:center;gap:0.35rem;
  box-shadow:0 3px 10px rgba(30,10,0,0.3);font-family:inherit;white-space:nowrap;
  &:hover{transform:translateY(-1px);box-shadow:0 6px 18px rgba(62,39,19,0.45);background:linear-gradient(135deg,#7a4a0a,#b8762e)}
`;

/* ── User dropdown ── */
const AvaBtn = styled.button`width:36px;height:36px;border-radius:8px;background:linear-gradient(135deg,#C9943D,#7a4a0a);border:2px solid rgba(201,164,76,0.4);color:#fff;cursor:pointer;display:flex;align-items:center;justify-content:center;font-family:'Georgia',serif;font-size:0.82rem;font-weight:700;transition:all 0.25s;position:relative;animation:${glowRing} 3s ease infinite;&:hover{transform:translateY(-1px);box-shadow:0 6px 18px rgba(201,164,76,0.38)}`;
const AvaOnline = styled.span`position:absolute;bottom:-2px;right:-2px;width:8px;height:8px;background:#4CAF50;border-radius:50%;border:2px solid rgba(22,9,2,0.9);`;
const UDrop = styled.div`position:absolute;top:calc(100% + 8px);right:0;background:#fff;border:1px solid rgba(201,148,61,0.14);border-radius:14px;padding:0;box-shadow:0 16px 48px rgba(20,8,0,0.2),0 3px 12px rgba(184,118,46,0.07);opacity:${({$o})=>$o?1:0};visibility:${({$o})=>$o?'visible':'hidden'};transform:${({$o})=>$o?'translateY(0)':'translateY(-10px)'};transition:all 0.25s cubic-bezier(0.4,0,0.2,1);min-width:248px;z-index:1001;overflow:hidden;`;
const UHead = styled.div`background:linear-gradient(135deg,#2a1008 0%,#6b3d12 100%);padding:0.9rem 1rem;display:flex;align-items:center;gap:0.75rem;`;
const UAva = styled.div`width:38px;height:38px;border-radius:10px;background:linear-gradient(135deg,#C9943D,#9f5e1a);display:flex;align-items:center;justify-content:center;font-family:'Georgia',serif;font-size:0.88rem;font-weight:700;color:#fff;flex-shrink:0;border:2px solid rgba(255,228,160,0.28);box-shadow:0 2px 8px rgba(0,0,0,0.22);`;
const UHeadText = styled.div`flex:1;min-width:0;.nm{color:#fff;font-size:0.84rem;font-weight:700;margin-bottom:0.12rem;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.em{color:rgba(255,228,160,0.58);font-size:0.67rem;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}`;
const UPlan = styled.div`display:inline-flex;align-items:center;gap:0.24rem;background:rgba(255,228,160,0.13);border:1px solid rgba(255,228,160,0.28);color:#FFE4A0;font-size:0.56rem;font-weight:700;padding:1.5px 6px;border-radius:10px;letter-spacing:0.4px;margin-top:0.24rem;text-transform:uppercase;`;
const UBody = styled.div`padding:0.45rem;`;
const USec = styled.div`margin-bottom:0.08rem;`;
const ULbl = styled.div`font-size:0.59rem;font-weight:800;text-transform:uppercase;letter-spacing:2px;color:#bda98a;padding:0.28rem 0.5rem 0.2rem;`;
const UItem = styled.button`width:100%;background:none;border:none;padding:0.52rem 0.65rem;text-align:left;cursor:pointer;display:flex;align-items:center;gap:0.6rem;border-radius:8px;transition:all 0.2s;color:#2a1408;font-size:0.8rem;font-weight:500;font-family:inherit;.ui{width:27px;height:27px;border-radius:7px;display:flex;align-items:center;justify-content:center;background:rgba(184,118,46,0.07);color:#B8762E;flex-shrink:0;transition:all 0.22s}.ul{flex:1}&:hover{background:rgba(184,118,46,0.06);color:#9f5e1a;transform:translateX(2px);.ui{background:linear-gradient(135deg,#C9943D,#9f5e1a);color:#fff}}&.dng{color:#b71c1c;.ui{color:#c62828;background:rgba(198,40,40,0.07)}}&.dng:hover{background:rgba(183,28,28,0.05);.ui{background:rgba(198,40,40,0.13)}}`;
const UDiv = styled.div`height:1px;background:rgba(184,118,46,0.09);margin:0.28rem 0.5rem;`;
const UQuick = styled.div`display:grid;grid-template-columns:1fr 1fr;gap:0.32rem;padding:0 0.45rem 0.38rem;`;
const UQBtn = styled.button`background:rgba(184,118,46,0.05);border:1px solid rgba(184,118,46,0.13);border-radius:9px;padding:0.48rem 0.35rem;display:flex;flex-direction:column;align-items:center;gap:0.22rem;cursor:pointer;transition:all 0.2s;font-family:inherit;svg{color:#B8762E}span{font-size:0.62rem;font-weight:600;color:#6b3d12}&:hover{background:rgba(184,118,46,0.1);border-color:rgba(184,118,46,0.28);transform:translateY(-1px);svg{color:#9f5e1a}span{color:#9f5e1a}}`;

const MobileRight = styled.div`display:none;align-items:center;gap:0.45rem;@media(max-width:1024px){display:flex}`;

/* ── Search overlay ── */
const SOverlay = styled.div`position:fixed;inset:0;z-index:2000;display:${({$s})=>$s?'flex':'none'};flex-direction:column;animation:${fadeIn} 0.16s ease;`;
const SBg = styled.div`position:absolute;inset:0;background:rgba(12,4,0,0.75);backdrop-filter:blur(5px);`;
const SBox = styled.div`position:relative;z-index:1;background:#fff;border-radius:0 0 18px 18px;box-shadow:0 24px 70px rgba(12,4,0,0.3);max-width:1020px;width:94%;margin:4.5rem auto 0;animation:${slideUp} 0.24s ease;overflow:hidden;max-height:calc(100vh - 6rem);display:flex;flex-direction:column;`;
const SBar = styled.div`display:flex;align-items:center;border-bottom:2px solid #C9943D;background:#fff;flex-shrink:0;`;
const SIn = styled.input`flex:1;border:none;outline:none;padding:0.95rem 1.1rem;font-size:1rem;font-family:inherit;color:#2a1408;&::placeholder{color:#bda98a}`;
const SSubmit = styled.button`background:linear-gradient(135deg,#C9943D,#9f5e1a);border:none;width:54px;height:54px;display:flex;align-items:center;justify-content:center;cursor:pointer;color:#fff;flex-shrink:0;transition:background 0.25s;&:hover{background:linear-gradient(135deg,#B8762E,#7a4a0a)}`;
const SClear = styled.button`background:none;border:none;color:#bda98a;cursor:pointer;padding:0.45rem 0.55rem;display:flex;align-items:center;justify-content:center;&:hover{color:#9f5e1a}`;
const SClose = styled.button`background:none;border:none;cursor:pointer;padding:0.85rem;color:#9e7a5a;display:flex;align-items:center;justify-content:center;&:hover{color:#2a1408}`;
const SBody = styled.div`display:grid;grid-template-columns:200px 1fr;flex:1;overflow:hidden;@media(max-width:640px){grid-template-columns:1fr}`;
const SLeft = styled.div`border-right:1px solid rgba(184,118,46,0.11);padding:1rem;overflow-y:auto;background:#faf7f3;flex-shrink:0;`;
const SRight = styled.div`padding:1rem;overflow-y:auto;`;
const STitle = styled.div`font-size:0.64rem;font-weight:800;text-transform:uppercase;letter-spacing:2.5px;color:#9f5e1a;margin-bottom:0.65rem;padding-bottom:0.4rem;border-bottom:1.5px solid rgba(184,118,46,0.11);display:flex;align-items:center;justify-content:space-between;span{font-weight:400;letter-spacing:0;text-transform:none;color:#9e7a5a;font-size:0.7rem}`;
const SCat = styled.div`padding:0.42rem 0.55rem;border-radius:7px;cursor:pointer;font-size:0.79rem;color:#3E2713;transition:all 0.18s;font-weight:${({$a})=>$a?700:400};margin-bottom:0.08rem;background:${({$a})=>$a?'rgba(201,148,61,0.09)':'transparent'};border-left:${({$a})=>$a?'2.5px solid #C9943D':'2.5px solid transparent'};padding-left:${({$a})=>$a?'0.7rem':'0.55rem'};&:hover{background:rgba(201,148,61,0.07);color:#9f5e1a}em{font-style:normal;font-weight:700;color:#9f5e1a}`;
const PGrid = styled.div`display:grid;grid-template-columns:repeat(3,1fr);gap:0.75rem;@media(max-width:768px){grid-template-columns:repeat(2,1fr)}`;
const PCard = styled.div`
  border:1px solid rgba(184,118,46,0.11);border-radius:11px;overflow:hidden;cursor:pointer;
  transition:all 0.22s;background:#fff;position:relative;
  &:hover{border-color:rgba(184,118,46,0.28);box-shadow:0 6px 20px rgba(40,16,0,0.1);transform:translateY(-2px)}
  &:hover .qv-overlay{opacity:1}
`;
const PImgBox = styled.div`width:100%;aspect-ratio:1;position:relative;overflow:hidden;background:#f5ede0;display:flex;align-items:center;justify-content:center;`;
const PImg = styled.img`width:100%;height:100%;object-fit:cover;display:block;`;
const PDiscTag = styled.div`position:absolute;top:7px;left:7px;background:#E05A1A;color:#fff;font-size:0.59rem;font-weight:800;padding:2px 7px;border-radius:5px;`;
const QVHover = styled.div`
  position:absolute;inset:0;background:rgba(20,8,0,0.45);display:flex;align-items:center;justify-content:center;
  opacity:0;transition:opacity 0.22s;
  span{background:rgba(255,255,255,0.95);color:#3E2713;font-size:0.7rem;font-weight:700;padding:0.35rem 0.9rem;border-radius:20px;display:flex;align-items:center;gap:0.3rem;}
`;
const PWish = styled.button`
  position:absolute;top:7px;right:7px;width:26px;height:26px;border-radius:50%;background:#fff;
  border:none;display:flex;align-items:center;justify-content:center;
  cursor:pointer;box-shadow:0 2px 7px rgba(43,32,32,0.8);transition:all 0.18s;z-index:10;
  svg{color:${({$active})=>$active?'#E05A1A':'#bda98a'};fill:${({$active})=>$active?'#E05A1A':'none'};transition:all 0.18s}
  &:hover svg{color:#E05A1A;fill:#E05A1A}
`;
const PInfo = styled.div`padding:0.55rem 0.6rem 0.45rem;.pcat{font-size:0.62rem;color:#bda98a;margin-bottom:0.14rem}h5{color:#2a1408;font-size:0.75rem;font-weight:600;margin-bottom:0.2rem;line-height:1.3;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}.ppr{display:flex;align-items:center;gap:0.35rem}.pp{color:#9f5e1a;font-size:0.84rem;font-weight:700}.po{color:#bda98a;font-size:0.68rem;text-decoration:line-through}`;
const PCartBtn = styled.button`
  width:100%;background:linear-gradient(135deg,#C9943D,#9f5e1a);border:none;color:#fff;
  padding:0.4rem 0.5rem;font-size:0.69rem;font-weight:700;cursor:pointer;
  display:flex;align-items:center;justify-content:center;gap:0.3rem;
  font-family:inherit;transition:all 0.22s;
  &:hover:not(:disabled){background:linear-gradient(135deg,#b8762e,#7a4a0a)}
  &:disabled{opacity:0.5;cursor:not-allowed}
`;
const PCartAdded = styled.div`
  width:100%;background:linear-gradient(135deg,#2E7D32,#1b5e20);color:#fff;
  padding:0.4rem 0.5rem;font-size:0.69rem;font-weight:700;
  display:flex;align-items:center;justify-content:center;gap:0.3rem;
  animation:${popIn} 0.18s ease;
`;
const SEmpty = styled.div`display:flex;flex-direction:column;align-items:center;justify-content:center;padding:3rem 1rem;color:#bda98a;text-align:center;svg{opacity:0.22;margin-bottom:0.8rem}p{font-size:0.82rem}`;

/* ── Quick View modal ── */
const QVOverlay = styled.div`position:fixed;inset:0;z-index:3000;display:${({$o})=>$o?'flex':'none'};align-items:center;justify-content:center;padding:1rem;animation:${fadeIn} 0.18s ease;`;
const QVBg = styled.div`position:absolute;inset:0;background:rgba(10,3,0,0.8);backdrop-filter:blur(6px);`;
const QVBox = styled.div`position:relative;z-index:1;background:#fff;border-radius:18px;box-shadow:0 32px 80px rgba(10,4,0,0.4);display:grid;grid-template-columns:1fr 1fr;width:100%;max-width:820px;overflow:hidden;animation:${scaleIn} 0.24s cubic-bezier(0.4,0,0.2,1);@media(max-width:600px){grid-template-columns:1fr;max-height:90vh;overflow-y:auto}`;
const QVImgSide = styled.div`position:relative;background:#f5ede0;min-height:340px;display:flex;align-items:center;justify-content:center;@media(max-width:600px){min-height:220px}`;
const QVImage = styled.img`width:100%;height:100%;object-fit:cover;position:absolute;inset:0;`;
const QVDiscBadge = styled.div`position:absolute;top:12px;left:12px;background:linear-gradient(135deg,#E05A1A,#c04010);color:#fff;font-size:0.65rem;font-weight:800;padding:3px 10px;border-radius:7px;`;
const QVClose = styled.button`position:absolute;top:10px;right:10px;width:32px;height:32px;border-radius:50%;background:rgba(255,255,255,0.92);border:none;cursor:pointer;display:flex;align-items:center;justify-content:center;color:#3E2713;box-shadow:0 2px 10px rgba(0,0,0,0.2);transition:all 0.2s;z-index:2;&:hover{background:#fff;transform:scale(1.08)}`;
const QVDetails = styled.div`padding:1.5rem;display:flex;flex-direction:column;gap:0.7rem;overflow-y:auto;`;
const QVCatBadge = styled.div`display:inline-flex;align-items:center;gap:0.3rem;background:rgba(201,148,61,0.09);border:1px solid rgba(184,118,46,0.2);color:#9f5e1a;font-size:0.65rem;font-weight:700;padding:3px 9px;border-radius:12px;text-transform:uppercase;letter-spacing:0.5px;width:fit-content;`;
const QVName = styled.h2`font-family:'Georgia',serif;font-size:1.18rem;font-weight:700;color:#1a0905;margin:0;line-height:1.35;`;
const QVPriceRow = styled.div`display:flex;align-items:center;gap:0.6rem;flex-wrap:wrap;`;
const QVPrice = styled.span`font-size:1.5rem;font-weight:800;color:#9f5e1a;font-family:'Georgia',serif;`;
const QVOld = styled.span`font-size:0.9rem;color:#bda98a;text-decoration:line-through;`;
const QVSave = styled.span`background:#fff3e0;color:#e65100;font-size:0.65rem;font-weight:800;padding:2px 8px;border-radius:8px;border:1px solid rgba(230,81,0,0.18);`;
const QVShopRow = styled.div`display:flex;align-items:center;gap:0.4rem;color:#9e7a5a;font-size:0.76rem;svg{color:#C9943D;flex-shrink:0}span{font-weight:600;color:#6b3d12}`;
const QVStockBadge = styled.div`display:inline-flex;align-items:center;gap:0.3rem;font-size:0.7rem;font-weight:700;padding:3px 10px;border-radius:10px;${({$in})=>$in?'background:#e8f5e9;color:#2E7D32;border:1px solid rgba(46,125,50,0.2)':'background:#fce4ec;color:#c62828;border:1px solid rgba(198,40,40,0.2)'}width:fit-content;`;
const QVDivider = styled.div`height:1px;background:rgba(184,118,46,0.1);`;
const QVActions = styled.div`display:flex;flex-direction:column;gap:0.55rem;margin-top:auto;`;
const QVAddCart = styled.button`background:linear-gradient(135deg,#C9943D,#9f5e1a);border:none;color:#fff;padding:0.7rem 1.2rem;border-radius:10px;font-size:0.88rem;font-weight:700;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:0.45rem;font-family:inherit;transition:all 0.25s;box-shadow:0 4px 14px rgba(201,148,61,0.35);&:hover{transform:translateY(-2px);box-shadow:0 8px 22px rgba(201,148,61,0.45)}&:disabled{opacity:0.55;cursor:not-allowed;transform:none}`;
const QVViewFull = styled.button`background:transparent;border:1.5px solid rgba(184,118,46,0.35);color:#9f5e1a;padding:0.62rem 1.2rem;border-radius:10px;font-size:0.84rem;font-weight:600;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:0.4rem;font-family:inherit;transition:all 0.25s;&:hover{background:rgba(184,118,46,0.06);border-color:rgba(184,118,46,0.6);color:#7a4a0a}`;
const QVWishRow = styled.div`display:flex;align-items:center;justify-content:space-between;`;
const QVWishBtn = styled.button`background:none;border:none;cursor:pointer;display:flex;align-items:center;gap:0.35rem;color:${({$active})=>$active?'#E05A1A':'#bda98a'};font-size:0.76rem;font-weight:600;font-family:inherit;transition:all 0.2s;padding:0.25rem 0;svg{transition:all 0.2s;fill:${({$active})=>$active?'#E05A1A':'none'}}&:hover{color:#E05A1A;svg{fill:#E05A1A}}`;

/* ═══════════════════════════════════════════════
   HELPERS
═══════════════════════════════════════════════ */
const WISH_KEY = 'songir_wishlist';
const getWishIds = () => {
  try {
    const raw = JSON.parse(localStorage.getItem(WISH_KEY) || '[]');
    return raw.filter(i => i !== null && typeof i === 'object').map(i => String(i.id || i._id || ''));
  } catch { return []; }
};

const GRAD_POOL = [
  'linear-gradient(135deg,#C9943D,#9f5e1a)',
  'linear-gradient(135deg,#6b3d12,#3E2713)',
  'linear-gradient(135deg,#b87c30,#7a5018)',
  'linear-gradient(135deg,#8B5E3C,#5a2e10)',
  'linear-gradient(135deg,#a06520,#6b3d12)',
  'linear-gradient(135deg,#9f5e1a,#3E2713)',
];

const DEITY_KEYWORDS = ['lord ganesh','lord krishna','saraswati','laxmi','lakshmi','lord shiva','ganesh','krishna','shiva','deity','statue','idol','murti'];

/* ═══════════════════════════════════════════════
   COMPONENT
═══════════════════════════════════════════════ */
export default function Navbar({ cartCount = 0, onCartOpen, addToCart }) {
  const { user, logout } = useApp();
  const { wishlistCount, refreshWishlist } = useWishlist();
  const navigate = useNavigate();
  const location = useLocation();

  const [menuOpen,   setMenuOpen]  = useState(false);
  const [openDrop,   setOpenDrop]  = useState(null);
  const [searchOpen, setSearchOpen]= useState(false);
  const [searchQ,    setSearchQ]   = useState('');
  const [activeCat,  setActiveCat] = useState('All');
  const [userDrop,   setUserDrop]  = useState(false);
  const [scrolled,   setScrolled]  = useState(false);
  const [annVis,     setAnnVis]    = useState(true);
  const [annIdx,     setAnnIdx]    = useState(0);
  const [searchWishlistedIds, setSearchWishlistedIds] = useState([]);
  const [cartAddedId, setCartAddedId] = useState(null);

  const [allProducts,     setAllProducts]     = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(false);

  /* Dynamic shops */
  const [dropShops,    setDropShops]    = useState([]);
  const [loadingShops, setLoadingShops] = useState(false);
  const [shopsFetched, setShopsFetched] = useState(false);

  const [quickViewProduct,    setQuickViewProduct]    = useState(null);
  const [quickViewWishlisted, setQuickViewWishlisted] = useState(false);

  const isLoggedIn = !!user;
  const currentUser = user ? {
    name:  user.name || user.displayName || user.email?.split('@')[0] || 'User',
    email: user.email || '',
    plan:  user.plan  || 'Standard',
  } : null;

  const userRef   = useRef(null);
  const annRef    = useRef(null);
  const searchRef = useRef(null);

  const anns = [
    <>Free shipping on orders above <em>₹999</em> &nbsp;✦&nbsp; Code <em>SONGIR15</em> for 15% off</>,
    <>New: <em>Copper Masala Dibba</em> & <em>Brass Puja Thali Sets</em> now in stock!</>,
    <>🏺 <em>320+ master craftsmen</em> from Songir region — support local artisans</>,
  ];

  /* ── Fetch products on search open ── */
  useEffect(() => {
    if (searchOpen && allProducts.length === 0) {
      setLoadingProducts(true);
      fetch(`${BASE_URL}/api/products`)
        .then(r => r.json())
        .then(d => setAllProducts(d.products || (Array.isArray(d) ? d : [])))
        .catch(() => setAllProducts([]))
        .finally(() => setLoadingProducts(false));
    }
    if (searchOpen) setSearchWishlistedIds(getWishIds());
  }, [searchOpen]);

  /* ── Fetch shops when dropdown opens ── */
  useEffect(() => {
    if (openDrop === 'shops' && !shopsFetched) {
      setLoadingShops(true);
      fetch(`${BASE_URL}/api/shops/approved`)
        .then(r => r.json())
        .then(d => { setDropShops(Array.isArray(d) ? d : []); setShopsFetched(true); })
        .catch(() => { setDropShops([]); setShopsFetched(true); })
        .finally(() => setLoadingShops(false));
    }
  }, [openDrop, shopsFetched]);

  /* ── Wishlist sync ── */
  useEffect(() => {
    const sync = () => setSearchWishlistedIds(getWishIds());
    window.addEventListener('wishlistUpdated', sync);
    return () => window.removeEventListener('wishlistUpdated', sync);
  }, []);

  /* ── Scroll ── */
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  /* ── Ann rotate ── */
  useEffect(() => {
    const t = setInterval(() => setAnnIdx(i => (i + 1) % anns.length), 5000);
    return () => clearInterval(t);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ── Outside click user drop ── */
  useEffect(() => {
    const fn = e => { if (userRef.current && !userRef.current.contains(e.target)) setUserDrop(false); };
    document.addEventListener('mousedown', fn);
    return () => document.removeEventListener('mousedown', fn);
  }, []);

  /* ── Close on route change ── */
  useEffect(() => {
    setMenuOpen(false); setOpenDrop(null); setUserDrop(false); setSearchOpen(false);
  }, [location]);

  /* ── Body overflow ── */
  useEffect(() => {
    document.body.style.overflow = (searchOpen || !!quickViewProduct) ? 'hidden' : '';
    if (searchOpen) setTimeout(() => searchRef.current?.focus(), 80);
    return () => { document.body.style.overflow = ''; };
  }, [searchOpen, quickViewProduct]);

  /* ── Auto deity category ── */
  useEffect(() => {
    if (searchQ.length >= 2) {
      const q = searchQ.toLowerCase();
      if (DEITY_KEYWORDS.some(kw => kw.includes(q) || q.includes(kw.split(' ').pop()))) setActiveCat('Divine Statues');
    }
  }, [searchQ]);

  /* ── Derived data ── */
  const dynamicCategories = ['All', ...new Set(allProducts.map(p => p.category).filter(Boolean))];
  const sidebarCats = dynamicCategories.includes('Divine Statues') ? dynamicCategories : [...dynamicCategories, 'Divine Statues'];
  const visCats = sidebarCats.filter(c => {
    if (c === 'All' || searchQ.length < 2) return true;
    const q = searchQ.toLowerCase();
    return allProducts.some(p => p.category === c && (
      (p.name||'').toLowerCase().includes(q) ||
      (p.description||'').toLowerCase().includes(q)
    ));
  });
  const visProds = allProducts.filter(p => {
    const catOk = activeCat === 'All' || p.category === activeCat;
    const q = searchQ.toLowerCase().trim();
    const qOk = q.length < 2 || (p.name||'').toLowerCase().includes(q) || (p.category||'').toLowerCase().includes(q) || (p.description||'').toLowerCase().includes(q) || (p.shopName||'').toLowerCase().includes(q);
    return catOk && qOk;
  }).slice(0, 9);

  const getImageUrl = img => {
    if (!img) return 'https://placehold.co/400x300?text=No+Image';
    return img.startsWith('http') ? img : `${BASE_URL}/${img}`;
  };

  /* ── Handlers ── */
  const annH = annVis ? (annRef.current?.offsetHeight ?? 32) : 0;

  /* Navigate + close everything */
  const go = path => {
    navigate(path);
    setMenuOpen(false); setOpenDrop(null); setUserDrop(false); setSearchOpen(false);
  };

  /* ── SHOP CLICK: navigate to specific shop page with state ── */
  const handleShopClick = (shop) => {
    const shopName = shop.shopName || shop.name || '';
    const shopId   = shop._id || shop.id || '';
    // Pass full shop object as state so ShopDetailPage can use it directly
    navigate(`/shops/${encodeURIComponent(shopName || shopId)}`, {
      state: { shop, shopId, shopName }
    });
    setMenuOpen(false); setOpenDrop(null);
  };

  /* ── QUOTE: no auth needed, navigate directly ── */
  // const handleQuote = () => go('/quote');

  // Inside Navbar component
const handleQuote = () => {
  if (isLoggedIn) {
    go('/quote');
  } else {
    // Save the intended destination (quote page) in navigation state
    navigate('/Registration', { state: { from: { pathname: '/quote' } } });
    // Close any open menus
    setMenuOpen(false);
    setOpenDrop(null);
  }
};

  /* ── Search add to cart ── */
  const handleSearchAddToCart = (e, product) => {
    e.stopPropagation();
    if (!product.inStock && product.inStock !== undefined) return;
    if (typeof addToCart === 'function') {
      addToCart({ ...product, id: product._id || product.id, originalPrice: product.price + 300 });
    }
    const pid = String(product._id || product.id);
    setCartAddedId(pid);
    setTimeout(() => setCartAddedId(null), 1500);
  };

  const handleSearchWishlist = (e, product) => {
    e.stopPropagation();
    const pid = product._id || product.id;
    const wasAdded = toggleWishlist({
      id: pid, _id: pid, name: product.name, price: product.price,
      oldPrice: product.price + 300, image: product.image,
      category: product.category, shop: product.shopName||product.shop||'',
      shopName: product.shopName||product.shop||'', inStock: product.inStock??true,
    });
    refreshWishlist();
    const t = document.createElement('div');
    t.style.cssText = `position:fixed;bottom:20px;left:50%;transform:translateX(-50%);background:${wasAdded?'#b87333':'#dc2626'};color:white;padding:8px 20px;border-radius:30px;font-weight:600;z-index:9999;font-family:sans-serif;box-shadow:0 4px 16px rgba(0,0,0,0.2);`;
    t.textContent = wasAdded ? '❤️ Added to Wishlist!' : '🗑️ Removed from Wishlist';
    document.body.appendChild(t); setTimeout(() => t.remove(), 2000);
  };

  /* ── QV handlers ── */
  const openQuickView = product => {
    setQuickViewWishlisted(isInWishlist(product._id || product.id));
    setQuickViewProduct(product);
  };
  const closeQuickView = () => setQuickViewProduct(null);

  const handleQVWishlist = () => {
    if (!quickViewProduct) return;
    const pid = quickViewProduct._id || quickViewProduct.id;
    const wasAdded = toggleWishlist({
      id: pid, _id: pid, name: quickViewProduct.name, price: quickViewProduct.price,
      oldPrice: quickViewProduct.price+300, image: quickViewProduct.image,
      category: quickViewProduct.category, shop: quickViewProduct.shopName||quickViewProduct.shop||'',
      shopName: quickViewProduct.shopName||quickViewProduct.shop||'', inStock: quickViewProduct.inStock??true,
    });
    setQuickViewWishlisted(wasAdded); refreshWishlist();
  };

  const handleQVAddToCart = () => {
    if (!quickViewProduct) return;
    if (typeof addToCart === 'function') {
      addToCart({ ...quickViewProduct, id: quickViewProduct._id||quickViewProduct.id, originalPrice: quickViewProduct.price+300 });
    } else if (typeof onCartOpen === 'function') onCartOpen();
    closeQuickView();
  };

  const handleQVViewFull = () => {
    if (!quickViewProduct) return;
    navigate('/ProductDetail', { state: { product: { ...quickViewProduct, image: getImageUrl(quickViewProduct.image) } } });
    closeQuickView();
  };

  const handleSearchSubmit = () => { if (searchQ.trim()) go(`/products?search=${encodeURIComponent(searchQ)}`); };

  const highlight = text => {
    if (searchQ.length < 2) return text;
    return String(text).split(new RegExp(`(${searchQ})`, 'gi')).map((p, i) =>
      p.toLowerCase() === searchQ.toLowerCase() ? <em key={i} style={{fontStyle:'normal',fontWeight:700,color:'#9f5e1a'}}>{p}</em> : p
    );
  };

  const initials = isLoggedIn && currentUser
    ? currentUser.name.split(' ').map(w=>w[0]).join('').slice(0,2).toUpperCase()
    : '';

  const handleCartOpen = () => { if (typeof onCartOpen==='function') onCartOpen(); else navigate('/Cart'); };
  const handleWishlistClick = () => navigate('/WishlistPage');

  /* ── Static nav data ── */
  const prodCats = [
    { path:'/products/brass',     Icon:Hexagon,  name:'Brass Utensils',  sub:'Cookware & vessels',        $ib:'rgba(201,148,61,0.1)',  $ic:'#9f5e1a', $hb:'linear-gradient(135deg,#C9943D,#9f5e1a)' },
    { path:'/products/copper',    Icon:Aperture, name:'Copper Utensils', sub:'Pure copper health ware',   $ib:'rgba(183,120,46,0.09)', $ic:'#9f5e1a', $hb:'linear-gradient(135deg,#b87c30,#7a5018)'  },
    { path:'/products/religious', Icon:Sun,      name:'Religious Items', sub:'Puja thalis & diyas',       $ib:'rgba(255,160,0,0.09)', $ic:'#e65100',  $hb:'linear-gradient(135deg,#F9A825,#e65100)'  },
    { path:'/products/statues',   Icon:Sparkles, name:'Divine Statues',  sub:'Brass & copper deity idols',$ib:'rgba(255,215,0,0.1)',  $ic:'#c07b00',  $hb:'linear-gradient(135deg,#FFD700,#e67e00)'  },
    { path:'/products/decor',     Icon:Feather,  name:'Home Décor',      sub:'Art, frames & accents',     $ib:'rgba(124,77,255,0.07)',$ic:'#4527A0',  $hb:'linear-gradient(135deg,#7c4dff,#4527A0)'  },
  ];
  const deities = [
    { name:'Lord Ganesh',       path:'/products/statues/ganesh',    emoji:'🐘' },
    { name:'Lord Krishna',      path:'/products/statues/krishna',   emoji:'🦚' },
    { name:'Goddess Saraswati', path:'/products/statues/saraswati', emoji:'🪷' },
    { name:'Goddess Lakshmi',   path:'/products/statues/lakshmi',   emoji:'🌸' },
    { name:'Lord Shiva',        path:'/products/statues/shiva',     emoji:'🔱' },
  ];
  const prodCols = [
    { path:'/products/bestsellers', Icon:Crown, name:'Best Sellers',  sub:'Community favourites', badge:'top'  },
    { path:'/products/new',         Icon:Zap,   name:'New Arrivals',  sub:'Fresh from artisans',  badge:'new'  },
    { path:'/products/deals',       Icon:Tag,   name:'Special Offers',sub:'Up to 40% off',        badge:'hot'  },
    { path:'/products/gifts',       Icon:Gift,  name:'Gift Sets',     sub:'Curated gift packs',   badge:'sale' },
  ];
  const shopBrowse = [
    { path:'/shops',          Icon:Grid,   name:'All Shops',       sub:'Browse every artisan', badge:null  },
    { path:'/shops/verified', Icon:Shield, name:'Verified Sellers',sub:'Certified authentic',  badge:'vfy' },
    { path:'/shops/trending', Icon:Flame,  name:'Trending Now',    sub:'Popular this week',    badge:'hot' },
    { path:'/shops/local',    Icon:Heart,  name:'Local Artisans',  sub:'Support local craft',  badge:'eco' },
  ];
  const accountItems = [
    { label:'My Profile', Icon:User,     path:'/ProfilePage'  },
    { label:'My Orders',  Icon:Package,  path:'/orders'       },
    { label:'Wishlist',   Icon:Heart,    path:'/WishlistPage' },
    { label:'Settings',   Icon:Settings, path:'/settings'     },
  ];
  const supportItems = [
    { label:'FAQs',    Icon:HelpCircle,   path:'/faq'      },
    { label:'Feedback',Icon:MessageSquare,path:'/Feedback' },
  ];
  const quickActions = [
    { label:'My Reviews', Icon:Star, path:'/Feedback'      },
    { label:'Alerts',     Icon:Bell, path:'/notifications' },
  ];

  /* ═══════════════════════════════════════════════
     RENDER
  ═══════════════════════════════════════════════ */
  return (
    <Wrapper>

      {/* ── Announcement bar ── */}
      {annVis && (
        <AnnBar ref={annRef}>
          <AnnText key={annIdx}>{anns[annIdx]}</AnnText>
          <AnnClose onClick={() => setAnnVis(false)}>✕</AnnClose>
        </AnnBar>
      )}

      <Nav $s={scrolled}>
        <Inner>

          {/* Logo */}
          <Logo to="/">
            <LogoMark>
              <svg width="22" height="22" viewBox="0 0 32 32" fill="none">
                <path d="M16 4L8 8V16C8 22 16 28 16 28C16 28 24 22 24 16V8L16 4Z"
                  stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="rgba(255,255,255,0.15)"/>
                <path d="M12 16L14.5 18.5L20 13" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </LogoMark>
            <LogoText><h1>Songir</h1><p>Handcrafted</p></LogoText>
          </Logo>

          <Hamburger onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X size={20}/> : <Menu size={20}/>}
          </Hamburger>

          {/* Nav links */}
          <NavLinks $o={menuOpen} $h={annH + 60}>

            <NavItm>
              <NavA to="/" onClick={() => setMenuOpen(false)}><Home size={14}/> Home</NavA>
            </NavItm>

            {/* Products dropdown */}
            <NavItm onMouseEnter={() => !menuOpen && setOpenDrop('prod')} onMouseLeave={() => !menuOpen && setOpenDrop(null)}>
              <DropTrigger $o={openDrop==='prod'} onClick={() => menuOpen && setOpenDrop(openDrop==='prod'?null:'prod')}>
                <Package size={14}/> Products <ChevronDown size={13} className="ch"/>
              </DropTrigger>
              <Mega $o={openDrop==='prod'}>
                <MegaTopBar>
                  <MegaTopTitle><Package size={14}/> Products <span>1,200+ handcrafted items</span></MegaTopTitle>
                  <MegaViewAll onClick={() => go('/products')}>View All <ArrowRight size={11}/></MegaViewAll>
                </MegaTopBar>
                <MegaGrid>
                  <MegaCol>
                    <ColHead><Grid size={12}/><span>By Category</span></ColHead>
                    {prodCats.map(i => (
                      <MItem key={i.path} $ib={i.$ib} $ic={i.$ic} $hb={i.$hb} onClick={() => go(i.path)}>
                        <div className="mi"><i.Icon size={15}/></div>
                        <div className="mc"><div className="mt"><h4>{i.name}</h4></div><p>{i.sub}</p></div>
                        <ChevronRight size={12} className="ar"/>
                      </MItem>
                    ))}
                    <ColHead style={{marginTop:'0.6rem'}}><Sparkles size={12}/><span>Deity Idols</span></ColHead>
                    <DeityRow>
                      {deities.map(d => (
                        <DeityChip key={d.path} onClick={() => go(d.path)}>
                          <span>{d.emoji}</span>{d.name.split(' ').slice(-1)[0]}
                        </DeityChip>
                      ))}
                    </DeityRow>
                  </MegaCol>
                  <MegaCol>
                    <ColHead><TrendingUp size={12}/><span>Collections</span></ColHead>
                    {prodCols.map(i => (
                      <MItem key={i.path} onClick={() => go(i.path)}>
                        <div className="mi"><i.Icon size={15}/></div>
                        <div className="mc">
                          <div className="mt"><h4>{i.name}</h4><Pip $v={i.badge}>{i.badge==='top'?'★ Top':i.badge==='new'?'New':i.badge==='hot'?'🔥':'Sale'}</Pip></div>
                          <p>{i.sub}</p>
                        </div>
                        <ChevronRight size={12} className="ar"/>
                      </MItem>
                    ))}
                  </MegaCol>
                </MegaGrid>
                <StatsRow>
                  {[{Icon:Package,s:'1,200+',l:'Products'},{Icon:Users,s:'320+',l:'Artisans'},{Icon:Truck,s:'Free',l:'On ₹999+'},{Icon:RefreshCw,s:'7-Day',l:'Returns'}].map(x=>(
                    <StatItem key={x.l}><x.Icon size={13}/><div><strong>{x.s}</strong><span>{x.l}</span></div></StatItem>
                  ))}
                </StatsRow>
              </Mega>
            </NavItm>

            {/* ════ SHOPS DROPDOWN — DYNAMIC ════ */}
            <NavItm onMouseEnter={() => !menuOpen && setOpenDrop('shops')} onMouseLeave={() => !menuOpen && setOpenDrop(null)}>
              <DropTrigger $o={openDrop==='shops'} onClick={() => menuOpen && setOpenDrop(openDrop==='shops'?null:'shops')}>
                <Grid size={14}/> Shops <ChevronDown size={13} className="ch"/>
              </DropTrigger>
              <Mega $o={openDrop==='shops'} $w>
                <MegaTopBar>
                  <MegaTopTitle>
                    <Users size={14}/> Artisan Marketplace
                    <span>{loadingShops ? 'Loading…' : `${dropShops.length} verified seller${dropShops.length !== 1 ? 's' : ''}`}</span>
                  </MegaTopTitle>
                  <MegaViewAll onClick={() => go('/shops')}>All Shops <ArrowRight size={11}/></MegaViewAll>
                </MegaTopBar>
                <MegaGrid>
                  <MegaCol>
                    <ColHead><Award size={12}/><span>Our Artisans</span></ColHead>

                    {/* Loading */}
                    {loadingShops && (
                      <ShopsDotWrap>
                        <ShopsDot/><ShopsDot/><ShopsDot/>
                        <span style={{marginLeft:6}}>Fetching shops…</span>
                      </ShopsDotWrap>
                    )}

                    {/* No shops yet */}
                    {!loadingShops && shopsFetched && dropShops.length === 0 && (
                      <div style={{padding:'0.8rem 0.55rem',color:'#bda98a',fontSize:'0.75rem',textAlign:'center',background:'rgba(184,118,46,0.04)',borderRadius:8,border:'1px dashed rgba(184,118,46,0.2)'}}>
                        No shops approved yet
                      </div>
                    )}

                    {/* Dynamic shops list with scrollbar */}
                    {!loadingShops && dropShops.length > 0 && (
                      <ShopsScroll>
                        {dropShops.map((shop, idx) => {
                          const ini = (shop.shopName || 'SH').substring(0, 2).toUpperCase();
                          const bg  = GRAD_POOL[idx % GRAD_POOL.length];
                          const prodCount = (shop.products || []).length;
                          return (
                            <ArtRow key={shop._id || idx} onClick={() => handleShopClick(shop)}>
                              <ArtAva $bg={bg}>
                                {ini}
                                <ArtVfy><CheckCircle size={7}/></ArtVfy>
                              </ArtAva>
                              <ArtInfo>
                                <h4>
                                  {(shop.shopName || 'Artisan Shop').length > 18
                                    ? (shop.shopName || 'Artisan Shop').substring(0, 18) + '…'
                                    : (shop.shopName || 'Artisan Shop')}
                                  <Pip $v="vfy">✓ Auth</Pip>
                                </h4>
                                <p>
                                  <MapPin size={9}/>
                                  {shop.address ? (shop.address.length > 20 ? shop.address.substring(0, 20) + '…' : shop.address) : 'Songir Region'}
                                </p>
                                <Stars>
                                  {[...Array(5)].map((_,i) => (
                                    <Star key={i} size={9} fill={i < 4 ? '#F9A825' : 'none'} color={i < 4 ? '#F9A825' : '#ddd'}/>
                                  ))}
                                  <span style={{fontSize:'0.62rem',color:'#9e7a5a',marginLeft:3}}>4.5</span>
                                </Stars>
                              </ArtInfo>
                              <ArtMeta>
                                <span className="c">{prodCount} item{prodCount !== 1 ? 's' : ''}</span>
                                <span className="s">{shop.ownerName ? (shop.ownerName.length > 12 ? shop.ownerName.substring(0,12)+'…' : shop.ownerName) : 'Artisan'}</span>
                              </ArtMeta>
                            </ArtRow>
                          );
                        })}
                      </ShopsScroll>
                    )}
                  </MegaCol>

                  <MegaCol>
                    <ColHead><Compass size={12}/><span>Browse</span></ColHead>
                    {shopBrowse.map(i => (
                      <MItem key={i.path} onClick={() => go(i.path)}>
                        <div className="mi"><i.Icon size={15}/></div>
                        <div className="mc">
                          <div className="mt"><h4>{i.name}</h4>{i.badge && <Pip $v={i.badge}>{i.badge==='vfy'?'✓ Auth':i.badge==='hot'?'🔥':i.badge==='eco'?'🌿':''}</Pip>}</div>
                          <p>{i.sub}</p>
                        </div>
                        <ChevronRight size={12} className="ar"/>
                      </MItem>
                    ))}

                    {/* Become a Seller CTA */}
                    <div
                      onClick={() => go('/AddShop')}
                      style={{marginTop:'0.45rem',padding:'0.65rem 0.7rem',background:'linear-gradient(135deg,rgba(201,148,61,0.07),rgba(184,118,46,0.11))',border:'1.5px dashed rgba(184,118,46,0.3)',borderRadius:'9px',cursor:'pointer',display:'flex',alignItems:'center',gap:'0.6rem',transition:'all 0.22s'}}
                      onMouseEnter={e=>{e.currentTarget.style.borderColor='rgba(184,118,46,0.5)';e.currentTarget.style.background='linear-gradient(135deg,rgba(201,148,61,0.12),rgba(184,118,46,0.18))'}}
                      onMouseLeave={e=>{e.currentTarget.style.borderColor='rgba(184,118,46,0.3)';e.currentTarget.style.background='linear-gradient(135deg,rgba(201,148,61,0.07),rgba(184,118,46,0.11))'}}
                    >
                      <div style={{width:30,height:30,borderRadius:8,background:'linear-gradient(135deg,#C9943D,#9f5e1a)',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>
                        <UserPlus size={14} color="#fff"/>
                      </div>
                      <div>
                        <div style={{fontSize:'0.78rem',fontWeight:700,color:'#3E2713',marginBottom:1}}>Become a Seller</div>
                        <div style={{fontSize:'0.67rem',color:'#9e7a5a'}}>Join {dropShops.length > 0 ? `${dropShops.length}+` : '320+'} artisans</div>
                      </div>
                      <ArrowRight size={12} color="#B8762E" style={{marginLeft:'auto'}}/>
                    </div>
                  </MegaCol>
                </MegaGrid>
                <StatsRow>
                  {[
                    {Icon:Users,  s: dropShops.length > 0 ? `${dropShops.length}` : '0', l:'Artisans'},
                    {Icon:Shield, s:'100%',  l:'Authentic'},
                    {Icon:Star,   s:'4.8★',  l:'Avg Rating'},
                    {Icon:MapPin, s:'12+',   l:'Locations'},
                  ].map(x=>(
                    <StatItem key={x.l}><x.Icon size={13}/><div><strong>{x.s}</strong><span>{x.l}</span></div></StatItem>
                  ))}
                </StatsRow>
              </Mega>
            </NavItm>

            <NavItm><NavA to="/about"   onClick={()=>setMenuOpen(false)}>About</NavA></NavItm>
            <NavItm><NavA to="/contact" onClick={()=>setMenuOpen(false)}>Contact</NavA></NavItm>
          </NavLinks>

          {/* ── Right section ── */}
          <Right>
            <IBtn onClick={() => setSearchOpen(true)} title="Search"><Search size={16}/></IBtn>

            <IBtn onClick={handleWishlistClick} title={`Wishlist (${wishlistCount})`}
              style={wishlistCount > 0 ? {borderColor:'rgba(98,0,0,0.65)',color:'#ff9090'} : {}}>
              <Heart size={16} fill={wishlistCount > 0 ? '#ff0000' : 'none'}/>
              {wishlistCount > 0 && <WishBdg>{wishlistCount > 99 ? '99+' : wishlistCount}</WishBdg>}
            </IBtn>

            <IBtn onClick={handleCartOpen} title="Cart">
              <ShoppingCart size={16}/>
              {cartCount > 0 && <Bdg>{cartCount}</Bdg>}
            </IBtn>

            {/* ── Guest: Sign In + Register ── */}
            {!isLoggedIn ? (
              <AuthWrap>
                <RegisterBtn onClick={() => navigate('/Registration')}>
                  <UserPlus size={13}/> Register
                </RegisterBtn>
              </AuthWrap>
            ) : (
              /* ── Logged in: avatar dropdown ── */
              <div ref={userRef} style={{position:'relative'}}>
                <AvaBtn onClick={() => setUserDrop(!userDrop)} title={currentUser?.name}>
                  {initials}<AvaOnline/>
                </AvaBtn>
                <UDrop $o={userDrop}>
                  <UHead>
                    <UAva>{initials}</UAva>
                    <UHeadText>
                      <div className="nm">{currentUser?.name}</div>
                      <div className="em">{currentUser?.email}</div>
                      {currentUser?.plan === 'Premium' && <UPlan><Crown size={8}/> {currentUser.plan}</UPlan>}
                    </UHeadText>
                  </UHead>
                  <UBody>
                    <UQuick>
                      {quickActions.map(a=>(
                        <UQBtn key={a.path} onClick={()=>go(a.path)}>
                          <a.Icon size={15}/><span>{a.label}</span>
                        </UQBtn>
                      ))}
                    </UQuick>
                    <UDiv/>
                    <USec>
                      <ULbl>Account</ULbl>
                      {accountItems.map(i=>(
                        <UItem key={i.path} onClick={()=>go(i.path)}>
                          <div className="ui"><i.Icon size={13}/></div>
                          <span className="ul">{i.label}</span>
                        </UItem>
                      ))}
                    </USec>
                    <UDiv/>
                    <USec>
                      <ULbl>Support</ULbl>
                      {supportItems.map(i=>(
                        <UItem key={i.path} onClick={()=>go(i.path)}>
                          <div className="ui"><i.Icon size={13}/></div>
                          <span className="ul">{i.label}</span>
                        </UItem>
                      ))}
                    </USec>
                    <UDiv/>
                    <UItem className="dng" onClick={() => { logout?.(); setUserDrop(false); navigate('/Logout'); }}>
                      <div className="ui"><LogOut size={13}/></div>
                      <span className="ul">Sign Out</span>
                    </UItem>
                  </UBody>
                </UDrop>
              </div>
            )}

            {/* Get Quote — publicly accessible */}
            <QuoteBtn onClick={handleQuote}>Get Quote</QuoteBtn>

            {/* Add Shop */}
            <button
              type="button"
              onClick={() => navigate('/AddShop')}
              style={{background:'linear-gradient(135deg,#D4AF37,#c9a020)',color:'#2d0000',border:'none',padding:'8px 14px',display:'flex',alignItems:'center',gap:'0.4rem',borderRadius:'8px',fontWeight:700,fontSize:'13px',cursor:'pointer',transition:'all 0.25s',boxShadow:'0 4px 10px rgba(42,0,0,0.2)',whiteSpace:'nowrap'}}
              onMouseOver={e => e.currentTarget.style.transform='translateY(-2px)'}
              onMouseOut={e => e.currentTarget.style.transform='translateY(0)'}
            >
              + Add Shop
            </button>
          </Right>

          {/* Mobile right */}
          <MobileRight>
            <IBtn onClick={() => setSearchOpen(true)} style={{width:36,height:36}}><Search size={15}/></IBtn>
            <IBtn onClick={handleWishlistClick} style={{width:36,height:36,...(wishlistCount>0?{borderColor:'rgba(220,38,38,0.4)',color:'#fca5a5'}:{})}}>
              <Heart size={15} fill={wishlistCount>0?'#fca5a5':'none'}/>
              {wishlistCount > 0 && <WishBdg>{wishlistCount>99?'99+':wishlistCount}</WishBdg>}
            </IBtn>
            <IBtn onClick={handleCartOpen} style={{width:36,height:36}}>
              <ShoppingCart size={15}/>
              {cartCount > 0 && <Bdg>{cartCount}</Bdg>}
            </IBtn>
          </MobileRight>

        </Inner>
      </Nav>

      {/* ════════════════════════════════════════
          SEARCH OVERLAY
      ════════════════════════════════════════ */}
      <SOverlay $s={searchOpen}>
        <SBg onClick={() => setSearchOpen(false)}/>
        <SBox>
          <SBar>
            <Search size={19} style={{color:'#bda98a',flexShrink:0,marginLeft:'1rem'}}/>
            <SIn
              ref={searchRef}
              type="text"
              placeholder="Search brass utensils, copper pots, deity statues…"
              value={searchQ}
              onChange={e => setSearchQ(e.target.value)}
              onKeyDown={e => { if(e.key==='Enter') handleSearchSubmit(); if(e.key==='Escape') setSearchOpen(false); }}
            />
            {searchQ && <SClear onClick={() => setSearchQ('')}><X size={16}/></SClear>}
            <SClose onClick={() => setSearchOpen(false)}><X size={21}/></SClose>
            <SSubmit onClick={handleSearchSubmit}><Search size={18}/></SSubmit>
          </SBar>

          <SBody>
            {/* Sidebar categories */}
            <SLeft>
              <STitle>Categories</STitle>
              {loadingProducts ? (
                <div style={{color:'#bda98a',fontSize:'0.75rem',padding:'0.5rem'}}>Loading...</div>
              ) : (
                visCats.map(c => (
                  <SCat key={c} $a={activeCat===c} onClick={() => setActiveCat(c)}>
                    {c==='Divine Statues'
                      ? <><Sparkles size={11} style={{display:'inline',marginRight:3,color:'#e67e00'}}/>{highlight(c)}</>
                      : highlight(c)}
                  </SCat>
                ))
              )}

              {(activeCat==='Divine Statues' || searchQ.length<2) && (
                <>
                  <STitle style={{marginTop:'1rem'}}>Deity Idols</STitle>
                  <div style={{display:'flex',flexDirection:'column',gap:'0.2rem'}}>
                    {deities.map(d => (
                      <div key={d.name}
                        onClick={() => { setActiveCat('Divine Statues'); setSearchQ(''); }}
                        style={{padding:'0.38rem 0.55rem',borderRadius:'7px',cursor:'pointer',fontSize:'0.76rem',color:'#3E2713',transition:'all 0.18s',display:'flex',alignItems:'center',gap:'0.4rem',background:'rgba(255,160,0,0.04)',border:'1px solid rgba(255,140,0,0.12)',marginBottom:'0.18rem'}}
                        onMouseEnter={e=>e.currentTarget.style.background='rgba(255,160,0,0.12)'}
                        onMouseLeave={e=>e.currentTarget.style.background='rgba(255,160,0,0.04)'}
                      >
                        <span>{d.emoji}</span>{d.name}
                      </div>
                    ))}
                  </div>
                </>
              )}
            </SLeft>

            {/* Product grid */}
            <SRight>
              <STitle>
                {searchQ.length>1 ? `Results for "${searchQ}"` : activeCat==='Divine Statues' ? '✨ Divine Statues' : activeCat!=='All' ? activeCat : 'Top Products'}
                <span>{loadingProducts ? '...' : `${visProds.length} items`}</span>
              </STitle>

              {loadingProducts ? (
                <SEmpty><div style={{fontSize:'2rem',marginBottom:'0.8rem'}}>🏺</div><p>Loading products...</p></SEmpty>
              ) : visProds.length===0 ? (
                <SEmpty>
                  <Search size={40}/>
                  <p>No results{searchQ ? ` for "${searchQ}"` : ''}</p>
                  <p style={{marginTop:'0.3rem',fontSize:'0.71rem'}}>Try a different keyword or category</p>
                </SEmpty>
              ) : (
                <PGrid>
                  {visProds.map(p => {
                    const pid = String(p._id || p.id);
                    const isWished = searchWishlistedIds.includes(pid);
                    const isAdded  = cartAddedId === pid;
                    const imgUrl   = getImageUrl(p.image);
                    return (
                      <PCard key={pid} onClick={() => openQuickView(p)}>
                        <PImgBox>
                          <PImg src={imgUrl} alt={p.name}
                            onError={e => { e.currentTarget.src='https://placehold.co/400x300?text=No+Image'; }}/>
                          <PDiscTag>Save ₹300</PDiscTag>
                          <QVHover className="qv-overlay">
                            <span><Eye size={12}/> Quick View</span>
                          </QVHover>
                          <PWish $active={isWished}
                            onClick={e => handleSearchWishlist(e, p)}
                            title={isWished ? 'Remove from Wishlist' : 'Add to Wishlist'}>
                            <Heart size={11}/>
                          </PWish>
                        </PImgBox>
                        <PInfo>
                          <div className="pcat">{p.category}</div>
                          <h5>{highlight(p.name)}</h5>
                          <div className="ppr">
                            <span className="pp">₹{p.price?.toLocaleString()}</span>
                            <span className="po">₹{(p.price+300)?.toLocaleString()}</span>
                          </div>
                        </PInfo>
                        {/* Add to Cart / Added feedback */}
                        {isAdded ? (
                          <PCartAdded onClick={e => e.stopPropagation()}>
                            <CheckCircle size={12}/> Added to Cart!
                          </PCartAdded>
                        ) : (
                          <PCartBtn
                            onClick={e => handleSearchAddToCart(e, p)}
                            disabled={p.inStock === false}
                            title={p.inStock===false ? 'Out of Stock' : 'Add to Cart'}
                          >
                            <ShoppingCart size={12}/>
                            {p.inStock===false ? 'Out of Stock' : 'Add to Cart'}
                          </PCartBtn>
                        )}
                      </PCard>
                    );
                  })}
                </PGrid>
              )}
            </SRight>
          </SBody>
        </SBox>
      </SOverlay>

      {/* ════════════════════════════════════════
          QUICK VIEW MODAL
      ════════════════════════════════════════ */}
      <QVOverlay $o={!!quickViewProduct}>
        <QVBg onClick={closeQuickView}/>
        {quickViewProduct && (
          <QVBox>
            <QVImgSide>
              <QVImage
                src={getImageUrl(quickViewProduct.image)}
                alt={quickViewProduct.name}
                onError={e => { e.currentTarget.style.display='none'; }}
              />
              <QVDiscBadge>Save ₹300</QVDiscBadge>
              <QVClose onClick={closeQuickView}><X size={15}/></QVClose>
            </QVImgSide>
            <QVDetails>
              <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',flexWrap:'wrap',gap:'0.4rem'}}>
                <QVCatBadge>
                  {quickViewProduct.category==='Divine Statues'||quickViewProduct.category==='Religious Items'
                    ? <><Sparkles size={10}/> {quickViewProduct.category}</>
                    : quickViewProduct.category}
                </QVCatBadge>
                <QVStockBadge $in={quickViewProduct.inStock!==false}>
                  {quickViewProduct.inStock!==false ? <><CheckCircle size={10}/> In Stock</> : '⚠ Out of Stock'}
                </QVStockBadge>
              </div>
              <QVName>{quickViewProduct.name}</QVName>
              <QVPriceRow>
                <QVPrice>₹{quickViewProduct.price?.toLocaleString()}</QVPrice>
                <QVOld>₹{(quickViewProduct.price+300)?.toLocaleString()}</QVOld>
                <QVSave>Save ₹300</QVSave>
              </QVPriceRow>
              <QVShopRow>
                <ShoppingBag size={13}/>
                Sold by <span>{quickViewProduct.shopName||quickViewProduct.shop||'Artisan Shop'}</span>
              </QVShopRow>
              {quickViewProduct.description && (
                <p style={{fontSize:'0.78rem',color:'#6b4f2a',lineHeight:1.5,margin:0}}>
                  {quickViewProduct.description}
                </p>
              )}
              <QVDivider/>
              <QVWishRow>
                <QVWishBtn $active={quickViewWishlisted} onClick={handleQVWishlist}>
                  <Heart size={14}/> {quickViewWishlisted ? 'Wishlisted ✓' : 'Add to Wishlist'}
                </QVWishBtn>
                <span style={{fontSize:'0.67rem',color:'#bda98a'}}>Click to {quickViewWishlisted?'remove':'save'}</span>
              </QVWishRow>
              <QVActions>
                <QVAddCart onClick={handleQVAddToCart} disabled={quickViewProduct.inStock===false}>
                  <ShoppingCart size={16}/>
                  {quickViewProduct.inStock!==false ? 'Add to Cart' : 'Out of Stock'}
                </QVAddCart>
                <QVViewFull onClick={handleQVViewFull}>
                  View Full Details <ArrowRight size={14}/>
                </QVViewFull>
              </QVActions>
            </QVDetails>
          </QVBox>
        )}
      </QVOverlay>

    </Wrapper>
  );
}
