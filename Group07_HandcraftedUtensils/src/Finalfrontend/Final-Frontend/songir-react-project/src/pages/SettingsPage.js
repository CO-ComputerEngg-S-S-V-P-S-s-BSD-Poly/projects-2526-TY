// import React, { useState } from "react";
// import styled, { keyframes } from "styled-components";
// import {
//   Settings, Bell, Shield, Palette, Globe,
//   LogOut, Trash2, ChevronRight, Moon, Sun, Check
// } from "lucide-react";
// import { useApp } from "../context/AppContext";
// import { useNavigate } from "react-router-dom";

// const fadeUp = keyframes`
//   from { opacity: 0; transform: translateY(16px); }
//   to   { opacity: 1; transform: translateY(0); }
// `;

// const Wrap = styled.div`
//   max-width: 760px;
//   margin: 0 auto;
//   padding: 2rem 1.5rem;
//   animation: ${fadeUp} 0.5s ease;
// `;

// const PageTitle = styled.div`
//   margin-bottom: 2rem;
//   h1 {
//     font-family: 'Playfair Display', serif;
//     font-size: 1.9rem; font-weight: 700;
//     color: #3E2723; margin: 0 0 0.35rem;
//     display: flex; align-items: center; gap: 0.6rem;
//   }
//   p { color: #8D6E63; font-size: 0.9rem; margin: 0; }
// `;

// const Section = styled.div`
//   background: white; border-radius: 16px;
//   padding: 1.5rem;
//   box-shadow: 0 2px 12px rgba(62,27,19,0.07);
//   border: 1px solid #F0E6D8;
//   margin-bottom: 1.25rem;

//   h3 {
//     font-size: 0.72rem; font-weight: 700;
//     text-transform: uppercase; letter-spacing: 1.5px;
//     color: #B8762E; margin: 0 0 1.1rem;
//     display: flex; align-items: center; gap: 0.5rem;
//     padding-bottom: 0.65rem;
//     border-bottom: 1.5px solid #F5EBD8;
//   }
// `;

// const Row = styled.div`
//   display: flex; align-items: center; justify-content: space-between;
//   padding: 0.85rem 0;
//   border-bottom: 1px solid #F9F2E8;
//   &:last-child { border-bottom: none; padding-bottom: 0; }
// `;

// const RowLeft = styled.div`
//   display: flex; align-items: center; gap: 0.85rem;

//   .row-icon {
//     width: 36px; height: 36px;
//     background: rgba(201,148,61,0.08);
//     border-radius: 9px; display: flex;
//     align-items: center; justify-content: center;
//     color: #B8762E; flex-shrink: 0;
//   }

//   .row-label  { font-size: 0.9rem; font-weight: 500; color: #3E2723; }
//   .row-sub    { font-size: 0.75rem; color: #8D6E63; margin-top: 1px; }
// `;

// /* Toggle switch */
// const Toggle = styled.label`
//   position: relative; display: inline-block;
//   width: 46px; height: 26px; cursor: pointer;

//   input { opacity: 0; width: 0; height: 0; }

//   span {
//     position: absolute; inset: 0;
//     background: ${({ checked }) => checked ? '#C9943D' : '#E0D4C0'};
//     border-radius: 99px;
//     transition: background 0.3s;
//   }

//   span::before {
//     content: '';
//     position: absolute;
//     height: 20px; width: 20px;
//     left: ${({ checked }) => checked ? '22px' : '3px'};
//     top: 3px;
//     background: white;
//     border-radius: 50%;
//     transition: left 0.3s;
//     box-shadow: 0 1px 4px rgba(0,0,0,0.15);
//   }
// `;

// /* Pill select */
// const PillRow = styled.div`
//   display: flex; gap: 0.5rem; flex-wrap: wrap;
// `;

// const Pill = styled.button`
//   padding: 0.45rem 1rem;
//   border-radius: 99px;
//   font-size: 0.78rem; font-weight: 600;
//   cursor: pointer; transition: all 0.2s;
//   font-family: inherit;
//   background:   ${({ $active }) => $active ? 'linear-gradient(135deg,#C9943D,#B8762E)' : 'transparent'};
//   color:        ${({ $active }) => $active ? 'white' : '#8D6E63'};
//   border:       ${({ $active }) => $active ? 'none' : '1.5px solid #E0D4C0'};
//   &:hover { border-color: #C9943D; color: ${({ $active }) => $active ? 'white' : '#B8762E'}; }
// `;

// const DangerBtn = styled.button`
//   display: flex; align-items: center; gap: 0.6rem;
//   padding: 0.8rem 1.25rem;
//   background: transparent;
//   border: 1.5px solid ${({ $red }) => $red ? '#E74C3C' : '#E0D4C0'};
//   border-radius: 8px;
//   color: ${({ $red }) => $red ? '#E74C3C' : '#8D6E63'};
//   font-size: 0.84rem; font-weight: 600;
//   cursor: pointer; font-family: inherit;
//   width: 100%; justify-content: center;
//   transition: all 0.2s;
//   margin-bottom: 0.75rem;

//   &:hover {
//     background: ${({ $red }) => $red ? 'rgba(231,76,60,0.07)' : 'rgba(201,148,61,0.06)'};
//     border-color: ${({ $red }) => $red ? '#C0392B' : '#C9943D'};
//     color: ${({ $red }) => $red ? '#C0392B' : '#B8762E'};
//   }
//   &:last-child { margin-bottom: 0; }
// `;

// const SaveBar = styled.div`
//   display: flex; justify-content: flex-end; gap: 0.75rem;
//   margin-top: 1.5rem;
// `;

// const Btn = styled.button`
//   padding: 0.75rem 1.75rem;
//   border-radius: 8px;
//   font-family: inherit; font-size: 0.84rem; font-weight: 700;
//   cursor: pointer; transition: all 0.25s;
//   background: ${({ $primary }) => $primary ? 'linear-gradient(135deg,#C9943D,#B8762E)' : 'transparent'};
//   color:      ${({ $primary }) => $primary ? 'white' : '#8D6E63'};
//   border:     ${({ $primary }) => $primary ? 'none' : '1.5px solid #E0D4C0'};

//   &:hover {
//     transform: translateY(-1px);
//     box-shadow: ${({ $primary }) => $primary ? '0 6px 18px rgba(184,118,46,0.35)' : 'none'};
//   }
// `;

// const Toast = styled.div`
//   position: fixed; bottom: 2rem; right: 2rem;
//   background: #3E2713; color: white;
//   padding: 0.9rem 1.5rem; border-radius: 10px;
//   font-size: 0.85rem; font-weight: 500;
//   box-shadow: 0 8px 28px rgba(0,0,0,0.3);
//   display: flex; align-items: center; gap: 0.6rem;
//   z-index: 9999;
//   animation: ${fadeUp} 0.3s ease;
//   border-left: 4px solid #C9943D;
// `;

// /* ═══════════════════════════════════════════
//    COMPONENT
// ═══════════════════════════════════════════ */
// export default function SettingsPage() {
//   const { logout } = useApp();
//   const navigate   = useNavigate();

//   const [toast, setToast]   = useState(false);
//   const [settings, setS]    = useState({
//     emailNotifs:  true,
//     smsNotifs:    false,
//     orderUpdates: true,
//     newsletter:   false,
//     newArrivals:  true,
//     twoFactor:    false,
//     loginAlerts:  true,
//     darkMode:     false,
//     language:     "en",
//     currency:     "INR",
//   });

//   const toggle = key => setS(p => ({ ...p, [key]: !p[key] }));

//   const showToast = () => {
//     setToast(true);
//     setTimeout(() => setToast(false), 2800);
//   };

//   const handleLogout = () => {
//     logout?.();
//     navigate("/login");
//   };

//   return (
//     <Wrap>
//       <PageTitle>
//         <h1><Settings size={22} color="#C9943D" /> Settings</h1>
//         <p>Manage your Songir account preferences</p>
//       </PageTitle>

//       {/* ── Notifications ── */}
//       <Section>
//         <h3><Bell size={13} /> Notifications</h3>
//         {[
//           { key:"emailNotifs",  label:"Email Notifications",  sub:"Receive order and account emails"   },
//           { key:"smsNotifs",    label:"SMS Notifications",    sub:"Get SMS alerts for your orders"     },
//           { key:"orderUpdates", label:"Order Status Updates", sub:"Shipping & delivery notifications"  },
//           { key:"newsletter",   label:"Newsletter",           sub:"Craft stories & artisan updates"    },
//           { key:"newArrivals",  label:"New Arrivals Alerts",  sub:"Be first to know about new products"},
//         ].map(n => (
//           <Row key={n.key}>
//             <RowLeft>
//               <div className="row-icon"><Bell size={16} /></div>
//               <div>
//                 <div className="row-label">{n.label}</div>
//                 <div className="row-sub">{n.sub}</div>
//               </div>
//             </RowLeft>
//             <Toggle checked={settings[n.key]}>
//               <input type="checkbox" checked={settings[n.key]} onChange={() => toggle(n.key)} />
//               <span />
//             </Toggle>
//           </Row>
//         ))}
//       </Section>

//       {/* ── Security ── */}
//       <Section>
//         <h3><Shield size={13} /> Security</h3>
//         {[
//           { key:"twoFactor",  label:"Two-Factor Authentication", sub:"Extra layer of account security" },
//           { key:"loginAlerts",label:"Login Alerts",              sub:"Alert me of new sign-ins"        },
//         ].map(n => (
//           <Row key={n.key}>
//             <RowLeft>
//               <div className="row-icon"><Shield size={16} /></div>
//               <div>
//                 <div className="row-label">{n.label}</div>
//                 <div className="row-sub">{n.sub}</div>
//               </div>
//             </RowLeft>
//             <Toggle checked={settings[n.key]}>
//               <input type="checkbox" checked={settings[n.key]} onChange={() => toggle(n.key)} />
//               <span />
//             </Toggle>
//           </Row>
//         ))}
//         <Row>
//           <RowLeft>
//             <div className="row-icon"><Shield size={16} /></div>
//             <div>
//               <div className="row-label">Change Password</div>
//               <div className="row-sub">Update your account password</div>
//             </div>
//           </RowLeft>
//           <ChevronRight size={18} color="#C9943D" style={{ cursor:'pointer' }} />
//         </Row>
//       </Section>

//       {/* ── Appearance ── */}
//       <Section>
//         <h3><Palette size={13} /> Appearance</h3>
//         <Row>
//           <RowLeft>
//             <div className="row-icon">
//               {settings.darkMode ? <Moon size={16} /> : <Sun size={16} />}
//             </div>
//             <div>
//               <div className="row-label">Dark Mode</div>
//               <div className="row-sub">Switch to dark interface</div>
//             </div>
//           </RowLeft>
//           <Toggle checked={settings.darkMode}>
//             <input type="checkbox" checked={settings.darkMode} onChange={() => toggle("darkMode")} />
//             <span />
//           </Toggle>
//         </Row>
//       </Section>

//       {/* ── Language & Currency ── */}
//       <Section>
//         <h3><Globe size={13} /> Language & Currency</h3>
//         <Row style={{ flexDirection:"column", alignItems:"flex-start", gap:"0.75rem" }}>
//           <div className="row-label" style={{ fontWeight:600, color:"#3E2723", fontSize:"0.88rem" }}>Language</div>
//           <PillRow>
//             {["en","hi","mr"].map(l => (
//               <Pill key={l} $active={settings.language===l} onClick={() => setS(p=>({...p,language:l}))}>
//                 {l==="en"?"English":l==="hi"?"हिंदी":"मराठी"}
//               </Pill>
//             ))}
//           </PillRow>
//         </Row>
//         <Row style={{ flexDirection:"column", alignItems:"flex-start", gap:"0.75rem", border:"none", paddingBottom:0 }}>
//           <div className="row-label" style={{ fontWeight:600, color:"#3E2723", fontSize:"0.88rem" }}>Currency</div>
//           <PillRow>
//             {["INR","USD","EUR"].map(c => (
//               <Pill key={c} $active={settings.currency===c} onClick={() => setS(p=>({...p,currency:c}))}>
//                 {c}
//               </Pill>
//             ))}
//           </PillRow>
//         </Row>
//       </Section>

//       {/* ── Account Actions ── */}
//       <Section>
//         <h3><Settings size={13} /> Account</h3>
//         <DangerBtn onClick={handleLogout}>
//           <LogOut size={16} /> Sign Out of Songir
//         </DangerBtn>
//         <DangerBtn $red>
//           <Trash2 size={16} /> Delete Account
//         </DangerBtn>
//       </Section>

//       {/* Save Bar */}
//       <SaveBar>
//         <Btn onClick={() => navigate(-1)}>Cancel</Btn>
//         <Btn $primary onClick={showToast}>
//           <Check size={15} style={{ display:'inline', marginRight:4 }} />
//           Save Settings
//         </Btn>
//       </SaveBar>

//       {toast && (
//         <Toast>
//           <Check size={16} color="#C9943D" /> Settings saved successfully!
//         </Toast>
//       )}
//     </Wrap>
//   );
// }









import React, { useState } from "react";
import styled, { keyframes } from "styled-components";
import {
  Settings, Bell, Shield, Palette, Globe,
  LogOut, Trash2, ChevronRight, Moon, Sun, Check
} from "lucide-react";
import { useApp } from "../context/AppContext";
import { useNavigate } from "react-router-dom";

const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(16px); }
  to   { opacity: 1; transform: translateY(0); }
`;

const Wrap = styled.div`
  max-width: 760px;
  margin: 0 auto;
  padding: 2rem 1.5rem;
  animation: ${fadeUp} 0.5s ease;
`;

const PageTitle = styled.div`
  margin-bottom: 2rem;
  h1 {
    font-family: 'Playfair Display', serif;
    font-size: 1.9rem; font-weight: 700;
    color: #3E2723; margin: 0 0 0.35rem;
    display: flex; align-items: center; gap: 0.6rem;
  }
  p { color: #8D6E63; font-size: 0.9rem; margin: 0; }
`;

const Section = styled.div`
  background: white; border-radius: 16px;
  padding: 1.5rem;
  box-shadow: 0 2px 12px rgba(62,27,19,0.07);
  border: 1px solid #F0E6D8;
  margin-bottom: 1.25rem;

  h3 {
    font-size: 0.72rem; font-weight: 700;
    text-transform: uppercase; letter-spacing: 1.5px;
    color: #B8762E; margin: 0 0 1.1rem;
    display: flex; align-items: center; gap: 0.5rem;
    padding-bottom: 0.65rem;
    border-bottom: 1.5px solid #F5EBD8;
  }
`;

const Row = styled.div`
  display: flex; align-items: center; justify-content: space-between;
  padding: 0.85rem 0;
  border-bottom: 1px solid #F9F2E8;
  &:last-child { border-bottom: none; padding-bottom: 0; }
`;

const RowLeft = styled.div`
  display: flex; align-items: center; gap: 0.85rem;

  .row-icon {
    width: 36px; height: 36px;
    background: rgba(201,148,61,0.08);
    border-radius: 9px; display: flex;
    align-items: center; justify-content: center;
    color: #B8762E; flex-shrink: 0;
  }

  .row-label  { font-size: 0.9rem; font-weight: 500; color: #3E2723; }
  .row-sub    { font-size: 0.75rem; color: #8D6E63; margin-top: 1px; }
`;

/* Toggle switch */
const Toggle = styled.label`
  position: relative; display: inline-block;
  width: 46px; height: 26px; cursor: pointer;

  input { opacity: 0; width: 0; height: 0; }

  span {
    position: absolute; inset: 0;
    background: ${({ checked }) => checked ? '#C9943D' : '#E0D4C0'};
    border-radius: 99px;
    transition: background 0.3s;
  }

  span::before {
    content: '';
    position: absolute;
    height: 20px; width: 20px;
    left: ${({ checked }) => checked ? '22px' : '3px'};
    top: 3px;
    background: white;
    border-radius: 50%;
    transition: left 0.3s;
    box-shadow: 0 1px 4px rgba(0,0,0,0.15);
  }
`;

/* Pill select */
const PillRow = styled.div`
  display: flex; gap: 0.5rem; flex-wrap: wrap;
`;

const Pill = styled.button`
  padding: 0.45rem 1rem;
  border-radius: 99px;
  font-size: 0.78rem; font-weight: 600;
  cursor: pointer; transition: all 0.2s;
  font-family: inherit;
  background:   ${({ $active }) => $active ? 'linear-gradient(135deg,#C9943D,#B8762E)' : 'transparent'};
  color:        ${({ $active }) => $active ? 'white' : '#8D6E63'};
  border:       ${({ $active }) => $active ? 'none' : '1.5px solid #E0D4C0'};
  &:hover { border-color: #C9943D; color: ${({ $active }) => $active ? 'white' : '#B8762E'}; }
`;

const DangerBtn = styled.button`
  display: flex; align-items: center; gap: 0.6rem;
  padding: 0.8rem 1.25rem;
  background: transparent;
  border: 1.5px solid ${({ $red }) => $red ? '#E74C3C' : '#E0D4C0'};
  border-radius: 8px;
  color: ${({ $red }) => $red ? '#E74C3C' : '#8D6E63'};
  font-size: 0.84rem; font-weight: 600;
  cursor: pointer; font-family: inherit;
  width: 100%; justify-content: center;
  transition: all 0.2s;
  margin-bottom: 0.75rem;

  &:hover {
    background: ${({ $red }) => $red ? 'rgba(231,76,60,0.07)' : 'rgba(201,148,61,0.06)'};
    border-color: ${({ $red }) => $red ? '#C0392B' : '#C9943D'};
    color: ${({ $red }) => $red ? '#C0392B' : '#B8762E'};
  }
  &:last-child { margin-bottom: 0; }
`;

const SaveBar = styled.div`
  display: flex; justify-content: flex-end; gap: 0.75rem;
  margin-top: 1.5rem;
`;

const Btn = styled.button`
  padding: 0.75rem 1.75rem;
  border-radius: 8px;
  font-family: inherit; font-size: 0.84rem; font-weight: 700;
  cursor: pointer; transition: all 0.25s;
  background: ${({ $primary }) => $primary ? 'linear-gradient(135deg,#C9943D,#B8762E)' : 'transparent'};
  color:      ${({ $primary }) => $primary ? 'white' : '#8D6E63'};
  border:     ${({ $primary }) => $primary ? 'none' : '1.5px solid #E0D4C0'};

  &:hover {
    transform: translateY(-1px);
    box-shadow: ${({ $primary }) => $primary ? '0 6px 18px rgba(184,118,46,0.35)' : 'none'};
  }
`;

const Toast = styled.div`
  position: fixed; bottom: 2rem; right: 2rem;
  background: #3E2713; color: white;
  padding: 0.9rem 1.5rem; border-radius: 10px;
  font-size: 0.85rem; font-weight: 500;
  box-shadow: 0 8px 28px rgba(0,0,0,0.3);
  display: flex; align-items: center; gap: 0.6rem;
  z-index: 9999;
  animation: ${fadeUp} 0.3s ease;
  border-left: 4px solid #C9943D;
`;

/* ═══════════════════════════════════════════
   COMPONENT
═══════════════════════════════════════════ */
export default function SettingsPage() {
  const { logout } = useApp();
  const navigate   = useNavigate();

  const [toast, setToast]   = useState(false);
  const [settings, setS]    = useState({
    emailNotifs:  true,
    smsNotifs:    false,
    orderUpdates: true,
    newsletter:   false,
    newArrivals:  true,
    twoFactor:    false,
    loginAlerts:  true,
    darkMode:     false,
    language:     "en",
    currency:     "INR",
  });

  const toggle = key => setS(p => ({ ...p, [key]: !p[key] }));

  const showToast = () => {
    setToast(true);
    setTimeout(() => setToast(false), 2800);
  };

  const handleLogout = () => {
    logout?.();
    navigate("/login");
  };

  return (
    <Wrap>
      <PageTitle>
        <h1><Settings size={22} color="#C9943D" /> Settings</h1>
        <p>Manage your Songir account preferences</p>
      </PageTitle>

      {/* ── Notifications ── */}
      <Section>
        <h3><Bell size={13} /> Notifications</h3>
        {[
          { key:"emailNotifs",  label:"Email Notifications",  sub:"Receive order and account emails"   },
          { key:"smsNotifs",    label:"SMS Notifications",    sub:"Get SMS alerts for your orders"     },
          { key:"orderUpdates", label:"Order Status Updates", sub:"Shipping & delivery notifications"  },
          { key:"newsletter",   label:"Newsletter",           sub:"Craft stories & artisan updates"    },
          { key:"newArrivals",  label:"New Arrivals Alerts",  sub:"Be first to know about new products"},
        ].map(n => (
          <Row key={n.key}>
            <RowLeft>
              <div className="row-icon"><Bell size={16} /></div>
              <div>
                <div className="row-label">{n.label}</div>
                <div className="row-sub">{n.sub}</div>
              </div>
            </RowLeft>
            <Toggle checked={settings[n.key]}>
              <input type="checkbox" checked={settings[n.key]} onChange={() => toggle(n.key)} />
              <span />
            </Toggle>
          </Row>
        ))}
      </Section>

      {/* ── Security ── */}
      <Section>
        <h3><Shield size={13} /> Security</h3>
        {[
          { key:"twoFactor",  label:"Two-Factor Authentication", sub:"Extra layer of account security" },
          { key:"loginAlerts",label:"Login Alerts",              sub:"Alert me of new sign-ins"        },
        ].map(n => (
          <Row key={n.key}>
            <RowLeft>
              <div className="row-icon"><Shield size={16} /></div>
              <div>
                <div className="row-label">{n.label}</div>
                <div className="row-sub">{n.sub}</div>
              </div>
            </RowLeft>
            <Toggle checked={settings[n.key]}>
              <input type="checkbox" checked={settings[n.key]} onChange={() => toggle(n.key)} />
              <span />
            </Toggle>
          </Row>
        ))}
        <Row>
          <RowLeft>
            <div className="row-icon"><Shield size={16} /></div>
            <div>
              <div className="row-label">Change Password</div>
              <div className="row-sub">Update your account password</div>
            </div>
          </RowLeft>
          <ChevronRight size={18} color="#C9943D" style={{ cursor:'pointer' }} />
        </Row>
      </Section>

      {/* ── Appearance ── */}
      <Section>
        <h3><Palette size={13} /> Appearance</h3>
        <Row>
          <RowLeft>
            <div className="row-icon">
              {settings.darkMode ? <Moon size={16} /> : <Sun size={16} />}
            </div>
            <div>
              <div className="row-label">Dark Mode</div>
              <div className="row-sub">Switch to dark interface</div>
            </div>
          </RowLeft>
          <Toggle checked={settings.darkMode}>
            <input type="checkbox" checked={settings.darkMode} onChange={() => toggle("darkMode")} />
            <span />
          </Toggle>
        </Row>
      </Section>

      {/* ── Language & Currency ── */}
      <Section>
        <h3><Globe size={13} /> Language & Currency</h3>
        <Row style={{ flexDirection:"column", alignItems:"flex-start", gap:"0.75rem" }}>
          <div className="row-label" style={{ fontWeight:600, color:"#3E2723", fontSize:"0.88rem" }}>Language</div>
          <PillRow>
            {["en","hi","mr"].map(l => (
              <Pill key={l} $active={settings.language===l} onClick={() => setS(p=>({...p,language:l}))}>
                {l==="en"?"English":l==="hi"?"हिंदी":"मराठी"}
              </Pill>
            ))}
          </PillRow>
        </Row>
        <Row style={{ flexDirection:"column", alignItems:"flex-start", gap:"0.75rem", border:"none", paddingBottom:0 }}>
          <div className="row-label" style={{ fontWeight:600, color:"#3E2723", fontSize:"0.88rem" }}>Currency</div>
          <PillRow>
            {["INR","USD","EUR"].map(c => (
              <Pill key={c} $active={settings.currency===c} onClick={() => setS(p=>({...p,currency:c}))}>
                {c}
              </Pill>
            ))}
          </PillRow>
        </Row>
      </Section>

      {/* ── Account Actions ── */}
      <Section>
        <h3><Settings size={13} /> Account</h3>
        <DangerBtn onClick={handleLogout}>
          <LogOut size={16} /> Sign Out of Songir
        </DangerBtn>
        <DangerBtn $red>
          <Trash2 size={16} /> Delete Account
        </DangerBtn>
      </Section>

      {/* Save Bar */}
      <SaveBar>
        <Btn onClick={() => navigate(-1)}>Cancel</Btn>
        <Btn $primary onClick={showToast}>
          <Check size={15} style={{ display:'inline', marginRight:4 }} />
          Save Settings
        </Btn>
      </SaveBar>

      {toast && (
        <Toast>
          <Check size={16} color="#C9943D" /> Settings saved successfully!
        </Toast>
      )}
    </Wrap>
  );
}
