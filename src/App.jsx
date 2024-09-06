import React from 'react';
import styled from 'styled-components';
import Header from './components/Header';
import BrandGrid from './components/BrandGrid';
import Footer from './components/Footer';

const AppContainer = styled.div`
  background-color: #1a1d21;
  color: white;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
`;

function App() {
  return (
    <AppContainer>
      <Header />
      <BrandGrid />
      <Footer />
    </AppContainer>
  );
}

export default App;