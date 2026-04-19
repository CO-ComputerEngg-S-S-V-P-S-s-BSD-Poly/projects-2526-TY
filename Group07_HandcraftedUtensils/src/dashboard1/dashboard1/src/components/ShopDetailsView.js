// import React from 'react';
// import { 
//   ArrowLeft, Star, MapPin, Phone, Mail, Clock, Package, 
//   TrendingUp, Award, CheckCircle2, Calendar 
// } from 'lucide-react';

// const ShopDetailsView = ({ shop, onBack }) => {
//   return (
//     <div className="view-content">
//       <button 
//         onClick={onBack}
//         style={{
//           display: 'flex',
//           alignItems: 'center',
//           gap: '0.5rem',
//           background: 'transparent',
//           border: 'none',
//           color: '#C17A3F',
//           fontSize: '0.95rem',
//           fontWeight: '600',
//           cursor: 'pointer',
//           marginBottom: '1.5rem',
//           padding: '0.5rem 0'
//         }}
//       >
//         <ArrowLeft size={20} />
//         Back to Shops
//       </button>

//       <div style={{
//         background: 'white',
//         borderRadius: '16px',
//         overflow: 'hidden',
//         boxShadow: '0 2px 12px rgba(0, 0, 0, 0.08)',
//         border: '2px solid #E5D4C1'
//       }}>
//         {/* Header Section */}
//         <div style={{
//           background: 'linear-gradient(135deg, #C17A3F 0%, #A85C28 100%)',
//           padding: '2.5rem',
//           color: 'white',
//           position: 'relative'
//         }}>
//           {shop.verified && (
//             <div style={{
//               position: 'absolute',
//               top: '1.5rem',
//               right: '1.5rem',
//               background: '#10B981',
//               color: 'white',
//               padding: '0.5rem 1rem',
//               borderRadius: '20px',
//               fontSize: '0.875rem',
//               fontWeight: '600',
//               display: 'flex',
//               alignItems: 'center',
//               gap: '0.5rem'
//             }}>
//               <CheckCircle2 size={16} />
//               Verified Shop
//             </div>
//           )}

//           <div style={{
//             display: 'flex',
//             alignItems: 'center',
//             gap: '2rem',
//             marginBottom: '1.5rem'
//           }}>
//             <div style={{
//               width: '120px',
//               height: '120px',
//               borderRadius: '50%',
//               background: 'rgba(255, 255, 255, 0.2)',
//               display: 'flex',
//               alignItems: 'center',
//               justifyContent: 'center',
//               fontSize: '3rem',
//               fontWeight: '700',
//               border: '4px solid rgba(255, 255, 255, 0.3)'
//             }}>
//               {shop.initials}
//             </div>
//             <div>
//               <h1 style={{ fontSize: '2.5rem', fontWeight: '700', marginBottom: '0.5rem' }}>
//                 {shop.name}
//               </h1>
//               <p style={{ fontSize: '1.2rem', opacity: 0.95, marginBottom: '0.75rem' }}>
//                 Owner: {shop.owner}
//               </p>
//               <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
//                 <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
//                   <Star size={20} fill="white" />
//                   <span style={{ fontSize: '1.1rem', fontWeight: '600' }}>{shop.rating}</span>
//                   <span style={{ opacity: 0.9 }}>({shop.reviews} reviews)</span>
//                 </div>
//                 <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
//                   <Award size={20} />
//                   <span>{shop.years} years experience</span>
//                 </div>
//               </div>
//             </div>
//           </div>

//           <div style={{
//             display: 'grid',
//             gridTemplateColumns: 'repeat(3, 1fr)',
//             gap: '1.5rem',
//             marginTop: '2rem'
//           }}>
//             <div style={{
//               background: 'rgba(255, 255, 255, 0.15)',
//               padding: '1rem',
//               borderRadius: '12px',
//               backdropFilter: 'blur(10px)'
//             }}>
//               <Package size={24} style={{ marginBottom: '0.5rem' }} />
//               <div style={{ fontSize: '2rem', fontWeight: '700' }}>{shop.products}</div>
//               <div style={{ fontSize: '0.9rem', opacity: 0.9 }}>Products Listed</div>
//             </div>
//             <div style={{
//               background: 'rgba(255, 255, 255, 0.15)',
//               padding: '1rem',
//               borderRadius: '12px',
//               backdropFilter: 'blur(10px)'
//             }}>
//               <TrendingUp size={24} style={{ marginBottom: '0.5rem' }} />
//               <div style={{ fontSize: '2rem', fontWeight: '700' }}>₹45,200</div>
//               <div style={{ fontSize: '0.9rem', opacity: 0.9 }}>Monthly Sales</div>
//             </div>
//             <div style={{
//               background: 'rgba(255, 255, 255, 0.15)',
//               padding: '1rem',
//               borderRadius: '12px',
//               backdropFilter: 'blur(10px)'
//             }}>
//               <Clock size={24} style={{ marginBottom: '0.5rem' }} />
//               <div style={{ fontSize: '2rem', fontWeight: '700' }}>128</div>
//               <div style={{ fontSize: '0.9rem', opacity: 0.9 }}>Total Orders</div>
//             </div>
//           </div>
//         </div>

//         {/* Details Section */}
//         <div style={{ padding: '2.5rem' }}>
//           <div style={{
//             display: 'grid',
//             gridTemplateColumns: '1fr 1fr',
//             gap: '2rem',
//             marginBottom: '2rem'
//           }}>
//             <div>
//               <h3 style={{ 
//                 fontSize: '1.3rem', 
//                 fontWeight: '600', 
//                 color: '#1F2937',
//                 marginBottom: '1rem',
//                 borderBottom: '2px solid #E5D4C1',
//                 paddingBottom: '0.5rem'
//               }}>
//                 Shop Information
//               </h3>
              
//               <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
//                 <div style={{ display: 'flex', alignItems: 'start', gap: '1rem' }}>
//                   <MapPin size={20} color="#C17A3F" style={{ marginTop: '0.2rem' }} />
//                   <div>
//                     <div style={{ fontWeight: '600', color: '#6B7280', fontSize: '0.85rem' }}>
//                       Location
//                     </div>
//                     <div style={{ color: '#1F2937', marginTop: '0.25rem' }}>
//                       {shop.location}, Maharashtra, India
//                     </div>
//                   </div>
//                 </div>

//                 <div style={{ display: 'flex', alignItems: 'start', gap: '1rem' }}>
//                   <Phone size={20} color="#C17A3F" style={{ marginTop: '0.2rem' }} />
//                   <div>
//                     <div style={{ fontWeight: '600', color: '#6B7280', fontSize: '0.85rem' }}>
//                       Contact Number
//                     </div>
//                     <div style={{ color: '#1F2937', marginTop: '0.25rem' }}>
//                       +91 98765 43210
//                     </div>
//                   </div>
//                 </div>

//                 <div style={{ display: 'flex', alignItems: 'start', gap: '1rem' }}>
//                   <Mail size={20} color="#C17A3F" style={{ marginTop: '0.2rem' }} />
//                   <div>
//                     <div style={{ fontWeight: '600', color: '#6B7280', fontSize: '0.85rem' }}>
//                       Email Address
//                     </div>
//                     <div style={{ color: '#1F2937', marginTop: '0.25rem' }}>
//                       {shop.owner.toLowerCase().replace(' ', '.')}@songir.com
//                     </div>
//                   </div>
//                 </div>

//                 <div style={{ display: 'flex', alignItems: 'start', gap: '1rem' }}>
//                   <Calendar size={20} color="#C17A3F" style={{ marginTop: '0.2rem' }} />
//                   <div>
//                     <div style={{ fontWeight: '600', color: '#6B7280', fontSize: '0.85rem' }}>
//                       Member Since
//                     </div>
//                     <div style={{ color: '#1F2937', marginTop: '0.25rem' }}>
//                       January 2020
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             <div>
//               <h3 style={{ 
//                 fontSize: '1.3rem', 
//                 fontWeight: '600', 
//                 color: '#1F2937',
//                 marginBottom: '1rem',
//                 borderBottom: '2px solid #E5D4C1',
//                 paddingBottom: '0.5rem'
//               }}>
//                 About the Shop
//               </h3>
              
//               <p style={{ 
//                 color: '#4B5563', 
//                 lineHeight: '1.8',
//                 marginBottom: '1.5rem',
//                 fontSize: '0.95rem'
//               }}>
//                 {shop.description}
//               </p>

//               <div>
//                 <div style={{ 
//                   fontWeight: '600', 
//                   color: '#6B7280', 
//                   fontSize: '0.85rem',
//                   marginBottom: '0.75rem'
//                 }}>
//                   Specializations
//                 </div>
//                 <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
//                   {shop.tags.map((tag, idx) => (
//                     <span 
//                       key={idx}
//                       style={{
//                         padding: '0.5rem 1rem',
//                         background: '#FDF8F4',
//                         border: '2px solid #E5D4C1',
//                         borderRadius: '20px',
//                         fontSize: '0.875rem',
//                         color: '#C17A3F',
//                         fontWeight: '600'
//                       }}
//                     >
//                       {tag}
//                     </span>
//                   ))}
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Action Buttons */}
//           <div style={{
//             display: 'flex',
//             gap: '1rem',
//             paddingTop: '1.5rem',
//             borderTop: '1px solid #E5D4C1'
//           }}>
//             <button style={{
//               flex: 1,
//               background: 'linear-gradient(135deg, #C17A3F 0%, #A85C28 100%)',
//               color: 'white',
//               border: 'none',
//               padding: '1rem 2rem',
//               borderRadius: '12px',
//               fontSize: '1rem',
//               fontWeight: '600',
//               cursor: 'pointer',
//               transition: 'all 0.3s ease'
//             }}>
//               View All Products
//             </button>
//             <button style={{
//               flex: 1,
//               background: 'white',
//               color: '#C17A3F',
//               border: '2px solid #C17A3F',
//               padding: '1rem 2rem',
//               borderRadius: '12px',
//               fontSize: '1rem',
//               fontWeight: '600',
//               cursor: 'pointer',
//               transition: 'all 0.3s ease'
//             }}>
//               Contact Shop
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ShopDetailsView;


import React from 'react';
import { 
  ArrowLeft, Star, MapPin, Phone, Mail, Clock, Package, 
  TrendingUp, Award, CheckCircle2, Calendar 
} from 'lucide-react';

const ShopDetailsView = ({ shop, onBack, onViewProducts, onContactClick }) => {
  return (
    <div className="view-content">
      <button 
        onClick={onBack}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          background: 'transparent',
          border: 'none',
          color: '#C17A3F',
          fontSize: '0.95rem',
          fontWeight: '600',
          cursor: 'pointer',
          marginBottom: '1.5rem',
          padding: '0.5rem 0'
        }}
      >
        <ArrowLeft size={20} />
        Back to Shops
      </button>

      <div style={{
        background: 'white',
        borderRadius: '16px',
        overflow: 'hidden',
        boxShadow: '0 2px 12px rgba(0, 0, 0, 0.08)',
        border: '2px solid #E5D4C1'
      }}>
        {/* Header Section */}
        <div style={{
          background: 'linear-gradient(135deg, #C17A3F 0%, #A85C28 100%)',
          padding: '2.5rem',
          color: 'white',
          position: 'relative'
        }}>
          {shop.verified && (
            <div style={{
              position: 'absolute',
              top: '1.5rem',
              right: '1.5rem',
              background: '#10B981',
              color: 'white',
              padding: '0.5rem 1rem',
              borderRadius: '20px',
              fontSize: '0.875rem',
              fontWeight: '600',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              <CheckCircle2 size={16} />
              Verified Shop
            </div>
          )}

          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '2rem',
            marginBottom: '1.5rem'
          }}>
            <div style={{
              width: '120px',
              height: '120px',
              borderRadius: '50%',
              background: 'rgba(255, 255, 255, 0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '3rem',
              fontWeight: '700',
              border: '4px solid rgba(255, 255, 255, 0.3)'
            }}>
              {shop.initials}
            </div>
            <div>
              <h1 style={{ fontSize: '2.5rem', fontWeight: '700', marginBottom: '0.5rem' }}>
                {shop.name}
              </h1>
              <p style={{ fontSize: '1.2rem', opacity: 0.95, marginBottom: '0.75rem' }}>
                Owner: {shop.owner}
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Star size={20} fill="white" />
                  <span style={{ fontSize: '1.1rem', fontWeight: '600' }}>{shop.rating}</span>
                  <span style={{ opacity: 0.9 }}>({shop.reviews} reviews)</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Award size={20} />
                  <span>{shop.years} years experience</span>
                </div>
              </div>
            </div>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '1.5rem',
            marginTop: '2rem'
          }}>
            <div style={{
              background: 'rgba(255, 255, 255, 0.15)',
              padding: '1rem',
              borderRadius: '12px',
              backdropFilter: 'blur(10px)'
            }}>
              <Package size={24} style={{ marginBottom: '0.5rem' }} />
              <div style={{ fontSize: '2rem', fontWeight: '700' }}>{shop.products}</div>
              <div style={{ fontSize: '0.9rem', opacity: 0.9 }}>Products Listed</div>
            </div>
            <div style={{
              background: 'rgba(255, 255, 255, 0.15)',
              padding: '1rem',
              borderRadius: '12px',
              backdropFilter: 'blur(10px)'
            }}>
              <TrendingUp size={24} style={{ marginBottom: '0.5rem' }} />
              <div style={{ fontSize: '2rem', fontWeight: '700' }}>₹45,200</div>
              <div style={{ fontSize: '0.9rem', opacity: 0.9 }}>Monthly Sales</div>
            </div>
            <div style={{
              background: 'rgba(255, 255, 255, 0.15)',
              padding: '1rem',
              borderRadius: '12px',
              backdropFilter: 'blur(10px)'
            }}>
              <Clock size={24} style={{ marginBottom: '0.5rem' }} />
              <div style={{ fontSize: '2rem', fontWeight: '700' }}>128</div>
              <div style={{ fontSize: '0.9rem', opacity: 0.9 }}>Total Orders</div>
            </div>
          </div>
        </div>

        {/* Details Section */}
        <div style={{ padding: '2.5rem' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '2rem',
            marginBottom: '2rem'
          }}>
            <div>
              <h3 style={{ 
                fontSize: '1.3rem', 
                fontWeight: '600', 
                color: '#1F2937',
                marginBottom: '1rem',
                borderBottom: '2px solid #E5D4C1',
                paddingBottom: '0.5rem'
              }}>
                Shop Information
              </h3>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'start', gap: '1rem' }}>
                  <MapPin size={20} color="#C17A3F" style={{ marginTop: '0.2rem' }} />
                  <div>
                    <div style={{ fontWeight: '600', color: '#6B7280', fontSize: '0.85rem' }}>
                      Location
                    </div>
                    <div style={{ color: '#1F2937', marginTop: '0.25rem' }}>
                      {shop.location}, Maharashtra, India
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'start', gap: '1rem' }}>
                  <Phone size={20} color="#C17A3F" style={{ marginTop: '0.2rem' }} />
                  <div>
                    <div style={{ fontWeight: '600', color: '#6B7280', fontSize: '0.85rem' }}>
                      Contact Number
                    </div>
                    <div style={{ color: '#1F2937', marginTop: '0.25rem' }}>
                      +91 98765 43210
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'start', gap: '1rem' }}>
                  <Mail size={20} color="#C17A3F" style={{ marginTop: '0.2rem' }} />
                  <div>
                    <div style={{ fontWeight: '600', color: '#6B7280', fontSize: '0.85rem' }}>
                      Email Address
                    </div>
                    <div style={{ color: '#1F2937', marginTop: '0.25rem' }}>
                      {shop.owner.toLowerCase().replace(' ', '.')}@songir.com
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'start', gap: '1rem' }}>
                  <Calendar size={20} color="#C17A3F" style={{ marginTop: '0.2rem' }} />
                  <div>
                    <div style={{ fontWeight: '600', color: '#6B7280', fontSize: '0.85rem' }}>
                      Member Since
                    </div>
                    <div style={{ color: '#1F2937', marginTop: '0.25rem' }}>
                      January 2020
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 style={{ 
                fontSize: '1.3rem', 
                fontWeight: '600', 
                color: '#1F2937',
                marginBottom: '1rem',
                borderBottom: '2px solid #E5D4C1',
                paddingBottom: '0.5rem'
              }}>
                About the Shop
              </h3>
              
              <p style={{ 
                color: '#4B5563', 
                lineHeight: '1.8',
                marginBottom: '1.5rem',
                fontSize: '0.95rem'
              }}>
                {shop.description}
              </p>

              <div>
                <div style={{ 
                  fontWeight: '600', 
                  color: '#6B7280', 
                  fontSize: '0.85rem',
                  marginBottom: '0.75rem'
                }}>
                  Specializations
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                  {shop.tags.map((tag, idx) => (
                    <span 
                      key={idx}
                      style={{
                        padding: '0.5rem 1rem',
                        background: '#FDF8F4',
                        border: '2px solid #E5D4C1',
                        borderRadius: '20px',
                        fontSize: '0.875rem',
                        color: '#C17A3F',
                        fontWeight: '600'
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div style={{
            display: 'flex',
            gap: '1rem',
            paddingTop: '1.5rem',
            borderTop: '1px solid #E5D4C1'
          }}>
            <button 
              onClick={onViewProducts}
              style={{
              flex: 1,
              background: 'linear-gradient(135deg, #C17A3F 0%, #A85C28 100%)',
              color: 'white',
              border: 'none',
              padding: '1rem 2rem',
              borderRadius: '12px',
              fontSize: '1rem',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}>
              View All Products
            </button>
            <button 
              onClick={onContactClick}
              style={{
              flex: 1,
              background: 'white',
              color: '#C17A3F',
              border: '2px solid #C17A3F',
              padding: '1rem 2rem',
              borderRadius: '12px',
              fontSize: '1rem',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}>
              Contact Shop
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShopDetailsView;

