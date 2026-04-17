
import React from 'react';

function FreelancerProfile() {
  const freelancer = {
    name: "Rahul Patil",
    title: "Full Stack Web Developer",
    location: "Nashik, Maharashtra", // ✅ आपकी लोकेशन
    hourlyRate: "₹800 / hr",
    about: "I am a passionate Full Stack Developer with 3+ years of experience in building modern web applications. Specializing in React, Node.js, and UI/UX design, I help clients turn ideas into successful digital products.",
    skills: ["React.js", "Node.js", "MongoDB", "Tailwind CSS", "Figma", "JavaScript", "Python"],
    experience: [
      { year: "2023 - Present", role: "Senior Freelancer", company: "Upwork / Global Clients" },
      { year: "2022 - 2023", role: "Web Intern", company: "Tech Nashik Solutions" }
    ],
    projects: [
      { name: "E-commerce Platform", desc: "A full online store with payment integration.", tech: "MERN Stack", icon: "🛒", color: "linear-gradient(45deg, #1e3c72, #2a5298)" },
      { name: "SaaS Dashboard", desc: "Real-time analytics for business management.", tech: "React & Firebase", icon: "📊", color: "linear-gradient(45deg, #0f2027, #2c5364)" }
    ],
    reviews: [
      { client: "Amit Sharma", comment: "Rahul delivered the project on time. His coding skills are top-notch!", stars: 5 },
      { client: "Sanjana Rao", comment: "Very professional and easy to work with. Highly recommended!", stars: 5 }
    ]
  };

  return (
    <div className="profile-page bg-light min-vh-100 pb-5" style={{ fontFamily: "'Poppins', sans-serif" }}>
      
      {/* 1. Header Background */}
      <div style={{ height: '200px', background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)' }}></div>

      <div className="container" style={{ marginTop: '-100px' }}>
        <div className="row g-4">
          
          {/* LEFT SIDE: Profile Card */}
          <div className="col-lg-4">
            <div className="card border-0 shadow-lg rounded-4 p-4 text-center sticky-top" style={{ top: '100px' }}>
              
              {/* Profile Avatar (R Letter) */}
              <div className="position-relative d-inline-block mx-auto mb-3">
                <div 
                  className="rounded-circle border border-5 border-white shadow-sm d-flex align-items-center justify-content-center text-white fw-bold" 
                  style={{ width: '140px', height: '140px', background: '#1e3c72', fontSize: '3.5rem' }}
                >
                  {freelancer.name.charAt(0)}
                </div>
                <span className="position-absolute bottom-0 end-0 bg-success border border-3 border-white rounded-circle" 
                      style={{ width: '22px', height: '22px', marginBottom: '8px', marginRight: '8px' }}></span>
              </div>

              <h3 className="fw-bold mb-1">{freelancer.name}</h3>
              <p className="text-primary fw-semibold mb-2">{freelancer.title}</p>
              
              {/* ✅ यहाँ लोकेशन डाली गई है (Visible Pin Icon) */}
              <div className="d-flex align-items-center justify-content-center mb-4">
                <span style={{fontSize: '1.2rem', marginRight: '5px'}}>📍</span>
                <span className="text-muted fw-bold">{freelancer.location}</span>
              </div>
              
              <div className="d-flex justify-content-around mb-4 border-top border-bottom py-3">
                <div className="text-center">
                    <h6 className="fw-bold mb-0">15+</h6>
                    <small className="text-muted">Projects</small>
                </div>
                <div className="text-center">
                    <h6 className="fw-bold mb-0">4.9/5</h6>
                    <small className="text-muted">Rating</small>
                </div>
              </div>

              <a href="/contact" className="btn btn-primary w-100 fw-bold rounded-pill shadow py-2">
                Hire Me Now
              </a>
            </div>
          </div>

          {/* RIGHT SIDE: Content Sections */}
          <div className="col-lg-8">
            <div className="card border-0 shadow-sm rounded-4 p-4 mb-4">
              <h4 className="fw-bold mb-3 border-start border-primary border-4 ps-3">Professional Bio</h4>
              <p className="text-muted leading-relaxed">{freelancer.about}</p>
              <div className="mt-2 text-success fw-bold">Rate: {freelancer.hourlyRate}</div>
            </div>

            <div className="card border-0 shadow-sm rounded-4 p-4 mb-4">
              <h4 className="fw-bold mb-3 border-start border-primary border-4 ps-3">Technical Skills</h4>
              <div className="d-flex flex-wrap gap-2">
                {freelancer.skills.map((s, i) => (
                  <span key={i} className="badge bg-light text-primary border px-3 py-2 rounded-pill">{s}</span>
                ))}
              </div>
            </div>

            <h4 className="fw-bold mb-3 ps-3">Project Portfolio</h4>
            <div className="row g-3 mb-5">
               {freelancer.projects.map((p, i) => (
                 <div className="col-md-6" key={i}>
                    <div className="card border-0 shadow-sm rounded-4 overflow-hidden h-100">
                       <div style={{ height: '140px', background: p.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3.5rem' }}>{p.icon}</div>
                       <div className="p-4 text-center">
                          <h6 className="fw-bold text-dark mb-1">{p.name}</h6>
                          <p className="text-muted x-small mb-3">{p.desc}</p>
                          <span className="badge bg-light text-primary border rounded-pill px-3">{p.tech}</span>
                       </div>
                    </div>
                 </div>
               ))}
            </div>

            <div className="card border-0 shadow-sm rounded-4 p-4">
              <h4 className="fw-bold mb-4 border-start border-primary border-4 ps-3">Client Feedback</h4>
              {freelancer.reviews.map((r, i) => (
                <div key={i} className="mb-3 p-3 rounded-4 bg-light shadow-sm">
                  <div className="text-warning mb-1">{"⭐".repeat(r.stars)}</div>
                  <p className="small mb-1 font-italic">"{r.comment}"</p>
                  <small className="fw-bold text-secondary d-block text-end">- {r.client}</small>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* Floating WhatsApp Button */}
      <a href="https://wa.me" className="position-fixed bottom-0 end-0 m-4 shadow-lg bg-success text-white rounded-circle d-flex align-items-center justify-content-center text-decoration-none" style={{ width: '60px', height: '60px', fontSize: '30px', zIndex: '1000' }} target="_blank" rel="noreferrer">
        <i className="fab fa-whatsapp"></i>
      </a>

    </div>
  );
}

export default FreelancerProfile;
