import React from 'react';

const Main = () => {
  return (
    <section className="bg-white py-12 px-10 flex flex-col md:flex-row items-center gap-10">
      {/* मजकूर भाग */}
      <div className="md:w-1/2 space-y-6">
        <span className="text-green-600 font-semibold uppercase tracking-wider text-sm">Join with Us Freelancer</span>
        <h1 className="text-6xl font-extrabold text-gray-900 leading-tight">
          Join, Work, <br /> and <span className="text-green-600 italic">Succeed</span>
        </h1>
        <button className="bg-orange-500 text-white px-8 py-3 rounded-full font-bold shadow-lg hover:bg-orange-600 transition">
          Get Started
        </button>

        {/* छोटा कार्ड बॉक्स */}
        <div className="mt-8 p-4 bg-gray-900 text-white rounded-2xl flex items-center gap-4 w-fit shadow-xl">
          <div className="text-3xl text-orange-400 font-bold">#1</div>
          <div>
            <p className="text-sm font-semibold">Top Rated Platform for Freelancer</p>
            <p className="text-xs text-gray-400">Awarded for Professional Excellence</p>
          </div>
        </div>
      </div>

      {/* इमेज भाग */}
      <div className="md:w-1/2 relative">
        <div className="bg-green-500 rounded-[40px] overflow-hidden shadow-2xl relative">
          {/* इथे तुमची इमेज येईल, आतासाठी मी एक डमी इमेज वापरली आहे */}
          <img 
            src="https://images.unsplash.com" 
            alt="Freelancer" 
            className="w-full h-[500px] object-cover"
          />
          {/* Floating Graph Element */}
          <div className="absolute bottom-10 right-[-20px] bg-white p-4 rounded-2xl shadow-2xl border border-gray-100 hidden md:block">
            <p className="text-[10px] font-bold text-gray-400 mb-2">PROGRESS BAR</p>
            <div className="w-16 h-16 border-8 border-green-500 border-t-transparent rounded-full animate-spin-slow"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Main;
