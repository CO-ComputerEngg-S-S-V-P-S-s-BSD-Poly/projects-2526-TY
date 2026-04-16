// import React from 'react';

// const OrdersPage = () => {
//   return (
//     <div className="container py-12">
//       <h1 className="text-center mb-6">Orders</h1>
//       <p className="text-center text-muted">This page is under development.</p>
//       <div className="text-center mt-8">
//         <a href="/" className="btn btn-primary">Back to Home</a>
//       </div>
//     </div>
//   );
// };

// export default OrdersPage;





import React, { useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { Package, ChevronRight, ShoppingBag, Clock, CheckCircle, XCircle, Truck } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';

const fadeUp = keyframes`
  from { opacity:0; transform:translateY(16px); }
  to   { opacity:1; transform:translateY(0); }
`;

const Wrap = styled.div`
  max-width: 760px; margin: 0 auto;
  padding: 2rem 1.5rem;
  animation: ${fadeUp} 0.5s ease;
`;

const PageTitle = styled.div`
  margin-bottom: 2rem;
  h1 { font-family:'Playfair Display',serif; font-size:1.9rem; font-weight:700;
    color:#3E2723; margin:0 0 0.35rem;
    display:flex; align-items:center; gap:0.6rem; }
  p { color:#8D6E63; font-size:0.9rem; margin:0; }
`;

const WelcomeBar = styled.div`
  background: linear-gradient(135deg,#3E2713,#6D4C30);
  border-radius: 16px; padding: 1.25rem 1.5rem;
  margin-bottom: 1.5rem;
  display: flex; align-items: center; justify-content: space-between;
  box-shadow: 0 4px 20px rgba(62,39,19,0.2);
`;

const WelcomeText = styled.div`
  .wt { font-size:0.72rem; font-weight:600; letter-spacing:1.5px; text-transform:uppercase;
    color:rgba(255,228,160,0.6); margin-bottom:3px; }
  .wn { font-family:'Playfair Display',serif; font-size:1.1rem; color:white; font-weight:500; }
`;

const WelcomeAvatar = styled.div`
  width:44px; height:44px; border-radius:50%;
  background:linear-gradient(135deg,#C9943D,#B8762E);
  display:flex; align-items:center; justify-content:center;
  font-family:'Playfair Display',serif;
  font-size:1rem; font-weight:700; color:white;
  border:2px solid rgba(255,255,255,0.2);
`;

const StatsRow = styled.div`
  display: grid; grid-template-columns: repeat(3,1fr);
  gap: 1rem; margin-bottom: 1.5rem;
`;

const StatBox = styled.div`
  background: white; border-radius: 12px;
  padding: 1.1rem; text-align: center;
  border: 1px solid #F0E6D8;
  box-shadow: 0 2px 8px rgba(62,39,19,0.05);
  .sb-icon { font-size:1.4rem; margin-bottom:6px; }
  .sb-val  { font-family:'Playfair Display',serif; font-size:1.6rem; font-weight:700; color:#3E2723; }
  .sb-lbl  { font-size:0.68rem; color:#A0907A; font-weight:600; letter-spacing:0.5px; margin-top:2px; }
`;

const EmptyState = styled.div`
  background: white; border-radius: 16px;
  padding: 3rem 2rem; text-align: center;
  border: 1px solid #F0E6D8;
  box-shadow: 0 2px 12px rgba(62,39,19,0.06);
`;

const EmptyIcon = styled.div`
  width: 80px; height: 80px; border-radius: 50%;
  background: rgba(201,148,61,0.08);
  display: flex; align-items: center; justify-content: center;
  margin: 0 auto 1.25rem;
  font-size: 2rem;
`;

const EmptyTitle = styled.h3`
  font-family: 'Playfair Display', serif;
  font-size: 1.3rem; font-weight:500;
  color: #3E2723; margin: 0 0 0.5rem;
`;

const EmptyDesc = styled.p`
  color: #8D6E63; font-size: 0.88rem;
  line-height: 1.7; margin: 0 0 1.5rem;
  max-width: 320px; margin-left: auto; margin-right: auto;
`;

const ShopBtn = styled.button`
  background: linear-gradient(135deg,#C9943D,#B8762E);
  color: white; border: none; border-radius: 50px;
  padding: 0.85rem 2rem;
  font-family: inherit; font-size: 0.88rem; font-weight: 700;
  cursor: pointer; transition: all 0.25s;
  display: inline-flex; align-items: center; gap: 0.5rem;
  &:hover { transform:translateY(-2px); box-shadow:0 8px 22px rgba(184,118,46,0.4); }
`;

const FilterRow = styled.div`
  display: flex; gap: 0.5rem; margin-bottom: 1rem; flex-wrap: wrap;
`;

const FilterBtn = styled.button`
  padding: 0.4rem 1rem; border-radius: 99px;
  font-size: 0.76rem; font-weight: 600;
  cursor: pointer; transition: all 0.2s; font-family: inherit;
  background:   ${({ $active }) => $active ? 'linear-gradient(135deg,#C9943D,#B8762E)' : 'white'};
  color:        ${({ $active }) => $active ? 'white' : '#8D6E63'};
  border:       ${({ $active }) => $active ? 'none' : '1.5px solid #E0D4C0'};
  &:hover { border-color:#C9943D; }
`;

const OrderCard = styled.div`
  background: white; border-radius: 14px;
  border: 1px solid #F0E6D8;
  box-shadow: 0 2px 10px rgba(62,39,19,0.06);
  margin-bottom: 1rem; overflow: hidden;
  transition: box-shadow 0.2s;
  &:hover { box-shadow: 0 4px 18px rgba(62,39,19,0.1); }
`;

const OrderHeader = styled.div`
  display: flex; align-items: center; justify-content: space-between;
  padding: 1rem 1.25rem;
  border-bottom: 1px solid #F9F2E8;
  .oh-id   { font-size:0.8rem; font-weight:700; color:#3E2723; }
  .oh-date { font-size:0.72rem; color:#A0907A; margin-top:2px; }
`;

const StatusBadge = styled.span`
  padding: 0.3rem 0.8rem; border-radius: 99px;
  font-size: 0.7rem; font-weight: 700; letter-spacing: 0.5px;
  background: ${({ $status }) =>
    $status === 'Delivered'  ? 'rgba(34,197,94,0.12)'  :
    $status === 'Shipped'    ? 'rgba(59,130,246,0.12)'  :
    $status === 'Processing' ? 'rgba(234,179,8,0.12)'   :
    'rgba(239,68,68,0.12)'};
  color: ${({ $status }) =>
    $status === 'Delivered'  ? '#16a34a' :
    $status === 'Shipped'    ? '#2563eb' :
    $status === 'Processing' ? '#b45309' :
    '#dc2626'};
`;

const OrderBody = styled.div`
  padding: 1rem 1.25rem;
  display: flex; align-items: center; gap: 1rem;
  .ob-em  { font-size:2rem; width:52px; height:52px; background:#FFF6E5;
    border-radius:10px; display:flex; align-items:center; justify-content:center; flex-shrink:0; }
  .ob-nm  { font-size:0.88rem; font-weight:600; color:#2A1A0A; }
  .ob-qty { font-size:0.75rem; color:#8D6E63; margin-top:2px; }
  .ob-pr  { font-size:0.9rem; font-weight:700; color:#B8762E; margin-left:auto; }
`;

export default function OrdersPage() {
  const { user } = useApp();
  const navigate = useNavigate();
  const [filter, setFilter] = useState('All');

  // ✅ Real user data
  const sessionUser  = (() => {
    try { return JSON.parse(localStorage.getItem('songir_session')) || {}; } catch { return {}; }
  })();
  const resolvedUser = user || sessionUser;
  const displayName  = resolvedUser?.fullName || resolvedUser?.name || 'Guest';
  const firstName    = displayName.split(' ')[0];
  const initials     = displayName.split(' ').map(w => w[0]).slice(0,2).join('').toUpperCase() || 'G';

  // Sample orders — replace with real API data when ready
  const orders = [
    { id:'#SON-2024-001', date:'28 Feb 2026', status:'Delivered', em:'🏺', name:'Brass Diya Set (x2)', qty:'Qty: 2', price:'₹ 1,798' },
    { id:'#SON-2024-002', date:'01 Mar 2026', status:'Shipped',   em:'🪔', name:'Pooja Thali',          qty:'Qty: 1', price:'₹ 1,499' },
    { id:'#SON-2024-003', date:'03 Mar 2026', status:'Processing',em:'🫙', name:'Copper Water Bottle',  qty:'Qty: 1', price:'₹ 699'   },
  ];

  const filtered = filter === 'All' ? orders : orders.filter(o => o.status === filter);

  return (
    <Wrap>
      <PageTitle>
        <h1><Package size={22} color="#C9943D" /> My Orders</h1>
        <p>Track and manage all your orders</p>
      </PageTitle>

      {/* ✅ Dynamic welcome bar */}
      <WelcomeBar>
        <WelcomeText>
          <div className="wt">Welcome back,</div>
          <div className="wn">{displayName}'s Orders</div>
        </WelcomeText>
        <WelcomeAvatar>{initials}</WelcomeAvatar>
      </WelcomeBar>

      {/* Stats */}
      <StatsRow>
        {[
          { icon:'📦', val: orders.length, lbl:'Total Orders' },
          { icon:'✅', val: orders.filter(o=>o.status==='Delivered').length,  lbl:'Delivered'  },
          { icon:'🚚', val: orders.filter(o=>o.status==='Shipped').length,    lbl:'In Transit'  },
        ].map(s => (
          <StatBox key={s.lbl}>
            <div className="sb-icon">{s.icon}</div>
            <div className="sb-val">{s.val}</div>
            <div className="sb-lbl">{s.lbl}</div>
          </StatBox>
        ))}
      </StatsRow>

      {orders.length === 0 ? (
        /* Empty state */
        <EmptyState>
          <EmptyIcon>🛍️</EmptyIcon>
          <EmptyTitle>No orders yet, {firstName}!</EmptyTitle>
          <EmptyDesc>
            You haven't placed any orders yet. Explore our collection of
            handcrafted brass & copper artisan pieces.
          </EmptyDesc>
          <ShopBtn onClick={() => navigate('/ProductsPage')}>
            <ShoppingBag size={16} /> Start Shopping
          </ShopBtn>
        </EmptyState>
      ) : (
        <>
          {/* Filter tabs */}
          <FilterRow>
            {['All','Processing','Shipped','Delivered'].map(f => (
              <FilterBtn key={f} $active={filter===f} onClick={() => setFilter(f)}>{f}</FilterBtn>
            ))}
          </FilterRow>

          {/* Order cards */}
          {filtered.map(order => (
            <OrderCard key={order.id}>
              <OrderHeader>
                <div>
                  <div className="oh-id">{order.id}</div>
                  <div className="oh-date">📅 {order.date}</div>
                </div>
                <StatusBadge $status={order.status}>{order.status}</StatusBadge>
              </OrderHeader>
              <OrderBody>
                <div className="ob-em">{order.em}</div>
                <div>
                  <div className="ob-nm">{order.name}</div>
                  <div className="ob-qty">{order.qty}</div>
                </div>
                <div className="ob-pr">{order.price}</div>
              </OrderBody>
            </OrderCard>
          ))}
        </>
      )}

      {/* Back to shopping */}
      <div style={{ textAlign:'center', marginTop:'2rem' }}>
        <ShopBtn onClick={() => navigate('/ProductsPage')}>
          <ShoppingBag size={16} /> Continue Shopping
        </ShopBtn>
      </div>
    </Wrap>
  );
}
