import React from 'react';
import styled from 'styled-components';
import brands from '../data/brands';

const GridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 1rem;
  padding: 2rem;
`;

const BrandItem = styled.div`
  background-color: #2f3542;
  border-radius: 8px;
  padding: 1rem;
  text-align: center;
`;

const BrandLogo = styled.img`
  width: 80px;
  height: 80px;
  object-fit: contain;
`;

function BrandGrid() {
  return (
    <GridContainer>
      {brands.map((brand, index) => (
        <BrandItem key={index}>
          <BrandLogo src={brand.logo} alt={brand.name} />
          <p>{brand.name}</p>
        </BrandItem>
      ))}
    </GridContainer>
  );
}

export default BrandGrid;