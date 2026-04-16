import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled, { keyframes } from "styled-components";
import { useApp } from "../context/AppContext";

const fadeUp = keyframes`
  from { opacity:0; transform:translateY(32px) scale(0.97); }
  to   { opacity:1; transform:translateY(0) scale(1); }
`;
const ripple  = keyframes`0%{transform:scale(0.6);opacity:0.7;}100%{transform:scale(2.2);opacity:0;}`;
const barGrow = keyframes`from{width:0;}to{width:100%;}`;
const spin    = keyframes`to{transform:rotate(360deg);}`;

const Root = styled.div`
  min-height: 100vh;
  position: relative;
  display: flex; align-items: center; justify-content: center;
  padding: 32px 16px; gap: 20px; flex-direction: column;
  overflow: hidden;
  font-family: 'DM Sans', 'Segoe UI', sans-serif;
`;

const BgIframe = styled.iframe`
  position: fixed; inset: 0;
  width: 100%; height: 100%;
  border: none; z-index: 0;
  pointer-events: none;
`;

const Overlay = styled.div`
  position: fixed; inset: 0; z-index: 1;
  background: linear-gradient(150deg,
    rgba(20,10,3,0.87) 0%, rgba(62,39,19,0.80) 50%, rgba(100,60,20,0.72) 100%
  );
`;

const Card = styled.div`
  position: relative; z-index: 2;
  background: rgba(255,253,248,0.97);
  backdrop-filter: blur(20px);
  border-radius: 16px; width: 100%; max-width: 500px;
  box-shadow: 0 28px 72px rgba(0,0,0,0.4), 0 0 0 1px rgba(201,164,76,0.15);
  overflow: hidden;
  animation: ${fadeUp} 0.65s cubic-bezier(.22,1,.36,1);
`;

const CardStripe = styled.div`
  height: 4px;
  background: linear-gradient(90deg,#3E2713 0%,#C9943D 50%,#B8762E 100%);
`;

const CardHeader = styled.div`
  display: flex; align-items: center; gap: 18px;
  padding: 28px 32px 22px;
  border-bottom: 1px solid rgba(232,222,205,0.6);
`;

const Avatar = styled.div`
  width: 64px; height: 64px; border-radius: 50%;
  background: linear-gradient(135deg,#C9943D,#3E2713);
  border: 3px solid #C9943D;
  display: flex; align-items: center; justify-content: center;
  font-family: 'Playfair Display', serif;
  font-size: 1.5rem; font-weight: 700; color: white;
  box-shadow: 0 6px 20px rgba(201,148,61,0.35);
  position: relative; flex-shrink: 0;
`;

const OnlineDot = styled.div`
  position: absolute; bottom: -1px; right: -1px;
  width: 16px; height: 16px;
  background: #4CAF50; border-radius: 50%;
  border: 2.5px solid #FFFDF8;
`;

const HeaderInfo = styled.div`
  .hg  { font-size:.68rem; font-weight:600; letter-spacing:2px; text-transform:uppercase; color:#A0907A; margin-bottom:2px; }
  .hn  { font-family:'Playfair Display',serif; font-size:1.4rem; font-weight:500; color:#2A1A0A; margin-bottom:2px; }
  .he  { font-size:.78rem; color:#8D6E63; }
  .hph { font-size:.74rem; color:#A0907A; margin-top:3px; }
`;

const SessionBar = styled.div`
  display: flex; align-items: center; gap: 8px;
  padding: 10px 32px;
  background: rgba(62,39,19,0.04);
  border-bottom: 1px solid rgba(232,222,205,0.5);
  font-size: .74rem; color: #8D6E63; flex-wrap: wrap;
`;
const SessDot = styled.div`width:3px;height:3px;border-radius:50%;background:#C9943D;margin:0 4px;`;

const Message = styled.div`
  display: flex; gap: 12px; align-items: flex-start;
  padding: 18px 32px;
  background: rgba(201,148,61,0.05);
  border-bottom: 1px solid rgba(232,222,205,0.5);
  .m-icon { font-size:1.1rem; flex-shrink:0; margin-top:2px; }
  p { font-size:.83rem; font-weight:300; color:#6D4C30; line-height:1.7; font-style:italic; margin:0; }
`;

const Actions = styled.div`
  display: flex; gap: 10px;
  padding: 20px 32px 16px;
`;

const BackBtn = styled.button`
  padding: 12px 18px; background: transparent;
  border: 1.5px solid #E8DECD; border-radius: 8px;
  font-family: inherit; font-size: .78rem; font-weight: 600; color: #6D4C30;
  cursor: pointer; transition: all .25s; white-space: nowrap;
  &:hover { border-color:#B8762E; color:#B8762E; }
`;

const SignOutBtn = styled.button`
  flex:1; padding: 12px 18px;
  background: linear-gradient(135deg,#3E2713,#6D4C30);
  color: white; border: none; border-radius: 8px;
  font-family: inherit; font-size: .78rem; font-weight: 700;
  letter-spacing: .5px; text-transform: uppercase;
  cursor: pointer; transition: all .3s;
  display: flex; align-items: center; justify-content: center; gap: 7px;
  &:hover { transform:translateY(-1px); box-shadow:0 8px 22px rgba(62,27,19,.35); }
  &:disabled { opacity:.6; cursor:not-allowed; transform:none; }
`;

const Spinner2 = styled.div`
  width:15px; height:15px;
  border:2px solid rgba(255,255,255,.3);
  border-top-color:white; border-radius:50%;
  animation:${spin} .7s linear infinite;
`;

const QuickLinks = styled.div`
  display: grid; grid-template-columns: repeat(4,1fr);
  padding: 0 24px 24px; gap: 8px;
`;

const QuickBtn = styled.button`
  display: flex; flex-direction: column; align-items: center;
  gap: 5px; padding: 12px 8px;
  background: #FAFAF7; border: 1.5px solid #EDE0CC;
  border-radius: 10px; font-family: inherit;
  font-size: .62rem; font-weight: 600; color: #6D4C30;
  cursor: pointer; text-align: center; line-height: 1.3; transition: all .2s;
  span:first-child { font-size: 1rem; }
  &:hover { border-color:#C9943D; background:rgba(201,148,61,.06);
    transform:translateY(-2px); box-shadow:0 4px 12px rgba(184,118,46,.12); }
`;

const RecoCard = styled.div`
  position: relative; z-index: 2;
  background: rgba(255,253,248,0.9); backdrop-filter: blur(12px);
  border-radius: 14px; width: 100%; max-width: 500px; padding: 18px 22px;
  border: 1px solid rgba(201,164,76,.2);
  box-shadow: 0 10px 36px rgba(0,0,0,.2);
  animation: ${fadeUp} .65s cubic-bezier(.22,1,.36,1) .15s both;
`;
const RecoLabel = styled.div`font-size:.64rem;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:#A0907A;margin-bottom:12px;`;
const RecoItem  = styled.div`
  display:flex;align-items:center;gap:12px;padding:9px 12px;background:white;
  border:1px solid #EDE0CC;border-radius:9px;cursor:pointer;transition:all .2s;margin-bottom:8px;
  &:last-child{margin-bottom:0;}
  &:hover{border-color:#C9943D;transform:translateX(3px);box-shadow:0 3px 12px rgba(184,118,46,.1);}
  .ri-em{width:38px;height:38px;background:#FFF6E5;border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:1.2rem;flex-shrink:0;}
  .ri-nm{font-size:.82rem;font-weight:600;color:#2A1A0A;}
  .ri-pr{font-size:.76rem;color:#B8762E;margin-top:1px;}
  .ri-tg{margin-left:auto;font-size:.6rem;font-weight:700;letter-spacing:.8px;text-transform:uppercase;padding:2px 8px;border-radius:99px;background:rgba(62,39,19,.08);color:#6D4C30;flex-shrink:0;}
`;

const ConfirmOverlay = styled.div`
  position:fixed;inset:0;background:rgba(20,10,3,.72);
  backdrop-filter:blur(8px);z-index:100;
  display:flex;align-items:center;justify-content:center;padding:20px;
`;
const ConfirmBox = styled.div`
  background:#FFFDF8;border-radius:14px;padding:36px 36px 30px;
  max-width:360px;width:100%;text-align:center;
  box-shadow:0 24px 60px rgba(0,0,0,.4);border-top:4px solid #C9943D;
  animation:${fadeUp} .35s ease;
  h3{font-family:'Playfair Display',serif;font-size:1.4rem;font-weight:500;color:#2A1A0A;margin:0 0 10px;}
  p{font-size:.84rem;color:#8D6E63;line-height:1.7;margin:0 0 24px;}
`;
const CBRow     = styled.div`display:flex;gap:10px;`;
const CBBack    = styled.button`flex:1;padding:12px;background:transparent;border:1.5px solid #E8DECD;border-radius:8px;font-family:inherit;font-size:.8rem;font-weight:600;color:#6D4C30;cursor:pointer;transition:all .2s;&:hover{border-color:#B8762E;color:#B8762E;}`;
const CBConfirm = styled.button`flex:1;padding:12px;background:linear-gradient(135deg,#C9943D,#B8762E);color:white;border:none;border-radius:8px;font-family:inherit;font-size:.8rem;font-weight:700;cursor:pointer;transition:all .2s;&:hover{transform:translateY(-1px);box-shadow:0 6px 18px rgba(184,118,46,.4);}`;

const DoneWrap  = styled.div`position:relative;z-index:2;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;gap:16px;animation:${fadeUp} .6s ease;`;
const RippleWrap= styled.div`position:relative;width:90px;height:90px;display:flex;align-items:center;justify-content:center;&::before,&::after{content:'';position:absolute;inset:0;border-radius:50%;border:2px solid #C9943D;animation:${ripple} 1.8s ease-out infinite;opacity:0;}&::after{animation-delay:.6s;}`;
const DoneIcon  = styled.div`width:80px;height:80px;border-radius:50%;background:linear-gradient(135deg,#C9943D,#B8762E);display:flex;align-items:center;justify-content:center;font-size:2rem;box-shadow:0 12px 32px rgba(201,148,61,.4);position:relative;z-index:1;`;
const DoneTitle = styled.h2`font-family:'Playfair Display',serif;font-size:2.2rem;font-weight:400;color:white;margin:0;`;
const DoneSub   = styled.p`font-size:.9rem;color:rgba(255,255,255,.7);margin:0;`;
const LoadBar   = styled.div`width:200px;height:2px;background:rgba(255,255,255,.15);border-radius:99px;overflow:hidden;`;
const LoadFill  = styled.div`height:100%;background:linear-gradient(90deg,#C9943D,#FFD97D);border-radius:99px;animation:${barGrow} 2.2s ease both;`;

/* ═══════════════════════════════════════════
   COMPONENT
═══════════════════════════════════════════ */
export default function LogoutPage({ user: userProp, onLogout }) {
  const navigate = useNavigate();
  const { user: contextUser } = useApp();

  // ✅ Pehle hi snapshot lo — logout ke baad bhi naam dikhega
  const [savedUser] = useState(() => {
    const fromContext = contextUser;
    const fromProp    = userProp;
    const fromStorage = (() => {
      try { return JSON.parse(localStorage.getItem('songir_session')) || {}; }
      catch { return {}; }
    })();
    return (fromContext?.fullName) ? fromContext
         : (fromProp?.fullName)    ? fromProp
         : fromStorage;
  });

  const [confirm, setConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [done,    setDone]    = useState(false);

  const [time] = useState(() =>
    new Date().toLocaleTimeString('en-IN', { hour:'2-digit', minute:'2-digit' })
  );
  const [greeting] = useState(() => {
    const h = new Date().getHours();
    return h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening';
  });

  const displayName = savedUser?.fullName || savedUser?.name || 'User';
  const email       = savedUser?.email    || '';
  const phone       = savedUser?.phone    || '';
  const city        = savedUser?.city     || '';
  const firstName   = displayName.split(' ')[0];
  const initials    = displayName.split(' ').map(w => w[0]).slice(0,2).join('').toUpperCase() || 'U';

  const handleConfirm = async () => {
    setConfirm(false);
    setLoading(true);
    await onLogout?.();
    setLoading(false);
    setDone(true);
    setTimeout(() => navigate('/'), 2500);
  };

  if (done) {
    return (
      <Root>
        <BgIframe src="http://localhost:3000/" title="songir-bg" />
        <Overlay />
        <DoneWrap>
          <RippleWrap><DoneIcon>👋</DoneIcon></RippleWrap>
          <DoneTitle>See you soon, {firstName}!</DoneTitle>
          <DoneSub>Logged out successfully. Redirecting to home…</DoneSub>
          <LoadBar><LoadFill /></LoadBar>
        </DoneWrap>
      </Root>
    );
  }

  return (
    <Root>
      <BgIframe src="http://localhost:3000/" title="songir-bg" />
      <Overlay />

      <Card>
        <CardStripe />
        <CardHeader>
          <Avatar>
            {initials}
            <OnlineDot />
          </Avatar>
          <HeaderInfo>
            <div className="hg">{greeting},</div>
            <div className="hn">{displayName}</div>
            <div className="he">{email}</div>
            {(phone || city) && (
              <div className="hph">
                {phone && <>📞 {phone}</>}
                {phone && city && ' · '}
                {city  && <>📍 {city}</>}
              </div>
            )}
          </HeaderInfo>
        </CardHeader>

        <SessionBar>
          <span>🕐</span> Session active since {time}
          <SessDot />
          <span>🔒</span> SSL Secured
          <SessDot />
          <span>✓</span> Verified Member
        </SessionBar>

        <Message>
          <div className="m-icon">🌿</div>
          <p>
            Your cart & wishlist are safely saved. Every piece of craft you've
            explored will be here when you return, <strong>{firstName}</strong>!
          </p>
        </Message>

        <Actions>
          <BackBtn onClick={() => navigate('/')}>← Continue Shopping</BackBtn>
          <SignOutBtn onClick={() => setConfirm(true)} disabled={loading}>
            {loading ? <Spinner2 /> : <>Log Out →</>}
          </SignOutBtn>
        </Actions>

        <QuickLinks>
          <QuickBtn onClick={() => navigate('/OrdersPage')}>
            <span>📦</span><span>My Orders</span>
          </QuickBtn>
          <QuickBtn onClick={() => navigate('/WishlistPage')}>
            <span>❤️</span><span>Wishlist</span>
          </QuickBtn>
          <QuickBtn onClick={() => navigate('/SettingsPage')}>
            <span>⚙️</span><span>Settings</span>
          </QuickBtn>
          <QuickBtn onClick={() => navigate('/ContactPage')}>
            <span>💬</span><span>Help</span>
          </QuickBtn>
        </QuickLinks>
      </Card>

      <RecoCard>
        <RecoLabel>Don't miss before you leave</RecoLabel>
        {[
          { em:'🏺', nm:'Earthy Copper Bowl',       pr:'₹ 1,240', tag:'New'        },
          { em:'🪵', nm:'Mango Wood Ladle Set',      pr:'₹ 890',  tag:'Best Seller' },
          { em:'🪔', nm:'Handbeaten Brass Diya Set', pr:'₹ 640',  tag:'Sale'        },
        ].map(r => (
          <RecoItem key={r.nm} onClick={() => navigate('/ProductsPage')}>
            <div className="ri-em">{r.em}</div>
            <div>
              <div className="ri-nm">{r.nm}</div>
              <div className="ri-pr">{r.pr}</div>
            </div>
            <div className="ri-tg">{r.tag}</div>
          </RecoItem>
        ))}
      </RecoCard>

      {confirm && (
        <ConfirmOverlay onClick={() => setConfirm(false)}>
          <ConfirmBox onClick={e => e.stopPropagation()}>
            <div style={{ fontSize:'2.5rem', marginBottom:'12px' }}>🚪</div>
            <h3>Sign out of Songir?</h3>
            <p>Your cart and wishlist are safely saved.<br/>You can login back in anytime.</p>
            <CBRow>
              <CBBack onClick={() => setConfirm(false)}>Stay Logged In</CBBack>
              <CBConfirm onClick={handleConfirm}>Yes, Log Out</CBConfirm>
            </CBRow>
          </ConfirmBox>
        </ConfirmOverlay>
      )}
    </Root>
  );
}