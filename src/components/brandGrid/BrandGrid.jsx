import React from 'react';
import brands from '../data/brands';
import './BrandGrid.css';

function BrandGrid() {
  return (
    <div className="grid-container">
      {brands.map((brand, index) => (
        <div key={index} className="brand-item">
          <img src={brand.logo} alt={brand.name} className="brand-logo" />
          <p>{brand.name}</p>
        </div>
      ))}
    </div>
  );
}

export default BrandGrid;