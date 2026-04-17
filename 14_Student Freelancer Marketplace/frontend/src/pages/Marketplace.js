import React, { useState } from 'react';

const Marketplace = () => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  
  // कॅटेगरीनुसार डमी डेटा (प्रोजेक्टमध्ये दिसण्यासाठी)
  const categoryData = {
    "Academic Projects": [
      { id: 1, title: "E-Commerce App (MERN)", price: "₹2500", dev: "Rahul S." },
      { id: 2, title: "AI Chatbot using Python", price: "₹1800", dev: "Priya K." }
    ],
    "Assignments": [
      { id: 3, title: "Java OOPs Concepts", price: "₹300", dev: "Amit T." },
      { id: 4, title: "Data Structures in C++", price: "₹450", dev: "Sneha P." }
    ],
    "Notes & Resources": [
      { id: 5, title: "Full Stack PDF Guide", price: "Free", dev: "GigNexus" },
      { id: 6, title: "Interview Q&A (React)", price: "₹150", dev: "Admin" }
    ]
  };

  const categories = Object.keys(categoryData);

  return (
    <div style={styles.container}>
      <h1 style={styles.mainTitle}>Explore Marketplace</h1>
      <p style={styles.subTitle}>Select a category to discover premium student resources</p>
      
      {/* १. कॅटेगरी कार्ड्स */}
      <div style={styles.categoryWrapper}>
        {categories.map((cat) => (
          <div 
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            style={{
              ...styles.categoryCard,
              border: selectedCategory === cat ? '2px solid #00d2ff' : '1px solid rgba(255,255,255,0.1)',
              background: selectedCategory === cat ? 'rgba(0, 210, 255, 0.1)' : 'rgba(255,255,255,0.05)',
              transform: selectedCategory === cat ? 'scale(1.05)' : 'scale(1)'
            }}
          >
            <div style={styles.icon}>{cat === "Academic Projects" ? "🎓" : cat === "Assignments" ? "📄" : "📚"}</div>
            <h3>{cat}</h3>
          </div>
        ))}
      </div>

      <hr style={styles.divider} />

      {/* २. निवडलेल्या कॅटेगरीचे आयटम्स दाखवणे */}
      <div style={styles.itemsSection}>
        {selectedCategory ? (
          <div>
            <h2 style={styles.resultTitle}>Listing for: <span style={{color: '#00d2ff'}}>{selectedCategory}</span></h2>
            <div style={styles.itemGrid}>
              {categoryData[selectedCategory].map(item => (
                <div key={item.id} style={styles.productCard}>
                  <div style={styles.productBadge}>{item.price}</div>
                  <h3>{item.title}</h3>
                  <p style={{color: '#888', fontSize: '14px'}}>Developer: {item.dev}</p>
                  <button style={styles.buyBtn}>View Details</button>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div style={styles.placeholder}>
            <p>Please select a category above to see available projects.</p>
          </div>
        )}
      </div>
    </div>
  );
};

// ३. प्रोफेशनल स्टाइल्स (Glassmorphism Look)
const styles = {
  container: { padding: '80px 50px', minHeight: '100vh', textAlign: 'center', color: '#fff' },
  mainTitle: { fontSize: '42px', fontWeight: 'bold', marginBottom: '10px', letterSpacing: '1px' },
  subTitle: { color: '#aaa', fontSize: '18px', marginBottom: '40px' },
  categoryWrapper: { display: 'flex', gap: '25px', justifyContent: 'center', flexWrap: 'wrap' },
  categoryCard: { 
    padding: '30px 20px', borderRadius: '20px', cursor: 'pointer', minWidth: '220px', 
    transition: '0.4s all ease', backdropFilter: 'blur(10px)', textAlign: 'center'
  },
  icon: { fontSize: '30px', marginBottom: '10px' },
  divider: { margin: '60px 0', border: '0.1px solid rgba(255,255,255,0.1)' },
  itemsSection: { maxWidth: '1100px', margin: '0 auto' },
  resultTitle: { marginBottom: '30px', fontSize: '24px' },
  itemGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '25px' },
  productCard: { 
    background: 'rgba(255,255,255,0.03)', padding: '25px', borderRadius: '15px', 
    border: '1px solid rgba(255,255,255,0.1)', textAlign: 'left', position: 'relative',
    transition: '0.3s'
  },
  productBadge: { position: 'absolute', top: '15px', right: '15px', background: '#00d2ff', color: '#000', padding: '5px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold' },
  buyBtn: { width: '100%', marginTop: '20px', padding: '12px', background: 'transparent', color: '#00d2ff', border: '1px solid #00d2ff', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', transition: '0.3s' },
  placeholder: { padding: '50px', border: '2px dashed rgba(255,255,255,0.1)', borderRadius: '20px', color: '#555' }
};

export default Marketplace;
