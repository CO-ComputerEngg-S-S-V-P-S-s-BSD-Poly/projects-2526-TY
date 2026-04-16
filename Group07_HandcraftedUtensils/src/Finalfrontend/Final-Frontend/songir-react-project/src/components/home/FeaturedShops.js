import React from 'react';
import { Link } from 'react-router-dom';
import { shops } from '../../data/mockData';
import Icon from '../../utils/Icons';

const FeaturedShops = () => {
  const featuredShops = shops.slice(0, 4);
  
  return (
    <section className="py-16">
      <div className="container">
        <div className="text-center mb-8">
          <h2 className="text-copper mb-2">Meet Our Artisans</h2>
          <p className="text-muted">Skilled craftsmen from Songir village</p>
        </div>
        
        <div className="grid grid-cols-1 grid-cols-2 grid-cols-4 gap-6">
          {featuredShops.map((shop) => (
            <Link key={shop.id} to={`/shops/${shop.id}`} className="card">
              <div className="flex items-center gap-3 mb-3">
                <div className="bg-copper text-cream rounded-full" style={{width: '48px', height: '48px', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                  <Icon name="user" size={24} />
                </div>
                <div>
                  <h3 className="font-semibold">{shop.name}</h3>
                  <div className="flex items-center gap-1">
                    <Icon name="star" size={14} className="text-brass" />
                    <span className="text-sm">{shop.rating}</span>
                  </div>
                </div>
              </div>
              <p className="text-sm text-muted mb-2">{shop.speciality}</p>
              <div className="flex justify-between text-sm">
                <span className="text-muted">{shop.products} products</span>
                {shop.verified && <Icon name="check" size={16} className="text-copper" />}
              </div>
            </Link>
          ))}
        </div>
        
        <div className="text-center mt-8">
          <Link to="/shops" className="btn btn-outline">View All Shops</Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedShops;
