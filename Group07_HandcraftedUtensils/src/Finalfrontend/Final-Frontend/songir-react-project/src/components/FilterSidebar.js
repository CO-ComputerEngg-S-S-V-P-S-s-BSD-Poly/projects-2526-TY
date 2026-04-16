import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Icon from '../utils/Icons';

const FilterSidebar = ({
  isOpen,
  onClose,
  categories,
  materials,
  shops,
  selectedFilters,
  onFilterChange,
  priceRange,
  onPriceRangeChange,
  onClearFilters
}) => {
  const [expandedSections, setExpandedSections] = useState({
    category: true,
    material: true,
    shop: false,
    price: true
  });

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleCheckboxChange = (filterType, value) => {
    const currentValues = selectedFilters[filterType] || [];
    const newValues = currentValues.includes(value)
      ? currentValues.filter(v => v !== value)
      : [...currentValues, value];

    onFilterChange(filterType, newValues);
  };

  const FilterSection = ({ title, sectionKey, children }) => (
    <div className="filter-section">
      <button
        className="filter-section-header"
        onClick={() => toggleSection(sectionKey)}
      >
        <span className="filter-section-title">{title}</span>
        <Icon
          name={expandedSections[sectionKey] ? 'chevronUp' : 'chevronDown'}
          size={16}
        />
      </button>

      <AnimatePresence>
        {expandedSections[sectionKey] && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="filter-section-content"
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );

  return (
    <>
      {/* Mobile Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="filter-overlay"
            onClick={onClose}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.div
        className={`filter-sidebar ${isOpen ? 'open' : ''}`}
        initial={{ x: -300 }}
        animate={{ x: isOpen ? 0 : -300 }}
        transition={{ type: 'tween', duration: 0.3 }}
      >
        <div className="filter-sidebar-header">
          <h3 className="filter-sidebar-title">Filters</h3>
          <button className="filter-close-btn" onClick={onClose}>
            <Icon name="x" size={20} />
          </button>
        </div>

        <div className="filter-sidebar-content">
          {/* Category Filter */}
          <FilterSection title="Category" sectionKey="category">
            <div className="filter-options">
              {categories.map(category => (
                <label key={category.id} className="filter-option">
                  <input
                    type="checkbox"
                    checked={(selectedFilters.category || []).includes(category.name)}
                    onChange={() => handleCheckboxChange('category', category.name)}
                  />
                  <span className="checkmark"></span>
                  <span className="filter-option-text">{category.name}</span>
                </label>
              ))}
            </div>
          </FilterSection>

          {/* Material Filter */}
          <FilterSection title="Material" sectionKey="material">
            <div className="filter-options">
              {materials.map(material => (
                <label key={material} className="filter-option">
                  <input
                    type="checkbox"
                    checked={(selectedFilters.material || []).includes(material)}
                    onChange={() => handleCheckboxChange('material', material)}
                  />
                  <span className="checkmark"></span>
                  <span className="filter-option-text">{material}</span>
                </label>
              ))}
            </div>
          </FilterSection>

          {/* Shop Filter */}
          <FilterSection title="Shop" sectionKey="shop">
            <div className="filter-options">
              {shops.map(shop => (
                <label key={shop.id} className="filter-option">
                  <input
                    type="checkbox"
                    checked={(selectedFilters.shop || []).includes(shop.name)}
                    onChange={() => handleCheckboxChange('shop', shop.name)}
                  />
                  <span className="checkmark"></span>
                  <span className="filter-option-text">{shop.name}</span>
                </label>
              ))}
            </div>
          </FilterSection>

          {/* Price Range Filter */}
          <FilterSection title="Price Range" sectionKey="price">
            <div className="price-range-filter">
              <div className="price-inputs">
                <div className="price-input-group">
                  <label>Min Price</label>
                  <input
                    type="number"
                    value={priceRange.min}
                    onChange={(e) => onPriceRangeChange({ ...priceRange, min: Number(e.target.value) })}
                    placeholder="0"
                    min="0"
                  />
                </div>
                <div className="price-input-group">
                  <label>Max Price</label>
                  <input
                    type="number"
                    value={priceRange.max}
                    onChange={(e) => onPriceRangeChange({ ...priceRange, max: Number(e.target.value) })}
                    placeholder="5000"
                    min="0"
                  />
                </div>
              </div>
              <div className="price-range-slider">
                <input
                  type="range"
                  min="0"
                  max="5000"
                  value={priceRange.min}
                  onChange={(e) => onPriceRangeChange({ ...priceRange, min: Number(e.target.value) })}
                  className="price-slider"
                />
                <input
                  type="range"
                  min="0"
                  max="5000"
                  value={priceRange.max}
                  onChange={(e) => onPriceRangeChange({ ...priceRange, max: Number(e.target.value) })}
                  className="price-slider"
                />
              </div>
              <div className="price-range-display">
                ₹{priceRange.min} - ₹{priceRange.max}
              </div>
            </div>
          </FilterSection>
        </div>

        <div className="filter-sidebar-footer">
          <button className="btn btn-outline btn-sm" onClick={onClearFilters}>
            Clear All Filters
          </button>
        </div>
      </motion.div>
    </>
  );
};

export default FilterSidebar;
