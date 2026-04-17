import React from 'react';
import { Link } from 'react-router-dom';

function Services() {
  const serviceData = [
    { id: 1, title: "Web Development", icon: "fas fa-code", desc: "Modern, responsive websites built with React and Node.js.", color: "#0d6efd" },
    { id: 2, title: "UI/UX Design", icon: "fas fa-paint-brush", desc: "Creative and user-friendly interface designs.", color: "#dc3545" },
    { id: 3, title: "App Development", icon: "fas fa-mobile-alt", desc: "Custom Android and iOS applications.", color: "#198754" },
    { id: 4, title: "Assignment Support", icon: "fas fa-book-open", desc: "Expert help for academic projects and assignments.", color: "#ffc107" },
    { id: 5, title: "PPT Design", icon: "fas fa-file-powerpoint", desc: "Professional presentations for business and college.", color: "#0dcaf0" },
    { id: 6, title: "Report Writing", icon: "fas fa-file-alt", desc: "Detailed technical and business report writing.", color: "#6c757d" },
    { id: 7, title: "Digital Marketing", icon: "fas fa-bullhorn", desc: "Grow your online presence with social media ads.", color: "#343a40" },
    { id: 8, title: "Content Writing", icon: "fas fa-pen-nib", desc: "High-quality blog posts and creative writing.", color: "#0d6efd" },
    { id: 9, title: "SEO Optimization", icon: "fas fa-search-plus", desc: "Improve your website ranking on search engines.", color: "#0dcaf0" }
  ];

  return (
    <div className="services-page" style={{ backgroundColor: '#f4f7f6', minHeight: '100vh' }}>
      
      {/* 1. Professional Header */}
      <header className="py-5 text-white text-center shadow-sm" style={{ background: '#0f2027' }}>
        <div className="container py-4">
          <h1 className="fw-bold display-5">Our <span style={{ color: '#00d2ff' }}>Specialized</span> Services</h1>
          <p className="lead opacity-75">Professional solutions for your digital and academic success.</p>
          <div className="mx-auto mt-3" style={{ width: '50px', height: '3px', backgroundColor: '#00d2ff', borderRadius: '10px' }}></div>
        </div>
      </header>

      {/* 2. Services Grid with Professional Colors */}
      <section className="container py-5">
        <div className="row g-4">
          {serviceData.map((service) => (
            <div className="col-lg-4 col-md-6" key={service.id}>
              <div className="card h-100 border-0 shadow-sm p-4 text-center service-card-pro">
                
                {/* Icon with soft background color */}
                <div className="mx-auto mb-4 d-flex align-items-center justify-content-center" 
                     style={{ width: '70px', height: '70px', backgroundColor: `${service.color}15`, borderRadius: '20px', color: service.color }}>
                  <i className={`${service.icon} fa-2x`}></i>
                </div>
                
                <h4 className="fw-bold mb-3" style={{ color: '#2c3e50' }}>{service.title}</h4>
                <p className="text-muted small mb-4 px-2">{service.desc}</p>
                
                {/* Action Link with Matching Color */}
                <Link to="/register" className="mt-auto fw-bold text-decoration-none" style={{ color: service.color, fontSize: '0.9rem' }}>
                  Get Started <i className="fas fa-chevron-right ms-1 small"></i>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Internal CSS for Hover effects */}
      <style>{`
        .service-card-pro {
          transition: all 0.3s ease;
          border-radius: 20px;
          background: #ffffff;
        }
        
        .service-card-pro:hover {
          transform: translateY(-8px);
          box-shadow: 0 15px 30px rgba(0,0,0,0.1) !important;
        }

        .service-card-pro:hover h4 {
          color: #0d6efd !important;
        }
      `}</style>
    </div>
  );
}

export default Services;
