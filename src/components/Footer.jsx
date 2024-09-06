import React from 'react';
import styled from 'styled-components';

const FooterContainer = styled.footer`
  background-color: #1a1d21;
  padding: 2rem;
  color: #fff;
`;

const FooterContent = styled.div`
  display: flex;
  justify-content: space-between;
  max-width: 1200px;
  margin: 0 auto;
`;

const FooterLogo = styled.div`
  color: #ff4757;
  font-size: 2rem;
  margin-right: 2rem;
`;

const FooterSection = styled.div`
  display: flex;
  flex-direction: column;
`;

const FooterTitle = styled.h3`
  color: #5352ed;
  margin-bottom: 1rem;
`;

const FooterLink = styled.a`
  color: #fff;
  text-decoration: none;
  margin-bottom: 0.5rem;
  &:hover {
    text-decoration: underline;
  }
`;

const FooterBottom = styled.div`
  text-align: center;
  margin-top: 2rem;
  font-size: 0.9rem;
  color: #a4b0be;
`;

function Footer() {
  return (
    <FooterContainer>
      <FooterContent>
        <FooterLogo>
          {/* Thêm SVG hoặc hình ảnh logo ở đây */}
          🐟
        </FooterLogo>
        <FooterSection>
          <FooterTitle>Navigation</FooterTitle>
          <FooterLink href="/">Home</FooterLink>
          <FooterLink href="/auctions">Auctions</FooterLink>
          <FooterLink href="/about">About</FooterLink>
        </FooterSection>
        <FooterSection>
          <FooterTitle>Policy</FooterTitle>
          <FooterLink href="/privacy">Privacy Policy</FooterLink>
          <FooterLink href="/terms">Terms and Conditions</FooterLink>
        </FooterSection>
        <FooterSection>
          <FooterTitle>Account</FooterTitle>
          <FooterLink href="/login">Login</FooterLink>
          <FooterLink href="/register">Register</FooterLink>
        </FooterSection>
      </FooterContent>
      <FooterBottom>
        AuctionKoi.com is a division of SelectKoi.com
      </FooterBottom>
    </FooterContainer>
  );
}

export default Footer;