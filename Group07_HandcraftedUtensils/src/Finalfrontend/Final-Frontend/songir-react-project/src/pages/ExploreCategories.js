import React from "react";

const categories = [
  {
    id: 1,
    title: "Brass Collection",
    description: "Traditional brass utensils for cooking & rituals",
    craft: "Hand-hammered finish",
    artisans: "28 Artisan Families",
    badge: "TRADITIONAL",
    image:
      "https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: 2,
    title: "Copper Collection",
    description: "Pure copper vessels for healthy living",
    craft: "Pure copper sheets",
    artisans: "34 Artisan Families",
    badge: "PURE COPPER",
    image:
      "https://images.unsplash.com/photo-1626785774573-4b799315345d?auto=format&fit=crop&w=1200&q=80",
  },
];

const ExploreCategories = () => {
  return (
    <section className="bg-[#FFF6E5] py-20 px-6">
      {/* Section Header */}
      <div className="max-w-7xl mx-auto text-center mb-14">
        <h2 className="text-4xl font-bold text-[#3E2723] mb-4">
          Explore Collections
        </h2>
        <p className="text-[#5D4037] max-w-2xl mx-auto">
          Discover handcrafted brass and copper utensils made by Songir artisans
          using time-honored techniques.
        </p>
      </div>

      {/* Cards */}
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-10">
        {categories.map((cat) => (
          <div
            key={cat.id}
            className="group relative h-[420px] rounded-3xl overflow-hidden cursor-pointer transition-transform duration-500 hover:-translate-y-3"
          >
            {/* Image */}
            <img
              src={cat.image}
              alt={cat.title}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-[6000ms] group-hover:scale-110"
            />

            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#3E2723]/90 via-[#B87333]/40 to-transparent"></div>

            {/* Badge */}
            <div className="absolute top-5 right-5 bg-[#C9A44C] text-[#3E2723] text-xs font-semibold px-4 py-1 rounded-full shadow-md">
              {cat.badge}
            </div>

            {/* Content */}
            <div className="absolute bottom-0 p-8 text-[#FFF6E5] w-full">
              <h3 className="text-3xl font-semibold mb-2">
                {cat.title}
              </h3>

              <p className="text-sm opacity-90 mb-3">
                {cat.description}
              </p>

              <p className="text-xs italic opacity-80 mb-4">
                {cat.craft}
              </p>

              {/* Bottom Row */}
              <div className="flex items-center justify-between">
                <span className="text-xs opacity-90">
                  👨‍👩‍👦 {cat.artisans}
                </span>

                <span className="text-sm font-semibold text-[#C9A44C] group-hover:underline transition-all">
                  Explore Collection →
                </span>
              </div>
            </div>

            {/* Glow Effect */}
            <div className="absolute inset-0 rounded-3xl ring-1 ring-[#B87333]/20 group-hover:ring-[#B87333]/50 transition-all"></div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ExploreCategories;