import React from 'react';
import styled from 'styled-components';

const HeaderContainer = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
`;

const Logo = styled.div`
  font-size: 1.5rem;
  font-weight: bold;
  color: #ff4757;
`;

const Nav = styled.nav`
  display: flex;
  gap: 1rem;
`;

const NavLink = styled.a`
  color: ${props => props.active ? '#5352ed' : 'white'};
  text-decoration: none;
  &:hover {
    text-decoration: underline;
  }
`;

const AuthButtons = styled.div`
  display: flex;
  gap: 1rem;
`;

const Button = styled.button`
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
`;

const RegisterButton = styled(Button)`
  background-color: #ff4757;
  color: white;
`;

function Header() {
  return (
    <HeaderContainer>
      <Logo>AUCTIONKOI</Logo>
      <Nav>
        <NavLink href="/" active>Home</NavLink>
        <NavLink href="/auctions">Auctions</NavLink>
        <NavLink href="/about">About</NavLink>
      </Nav>
      <AuthButtons>
        <Button>Log in</Button>
        <RegisterButton>Register</RegisterButton>
      </AuthButtons>
    </HeaderContainer>
  );
}

export default Header;