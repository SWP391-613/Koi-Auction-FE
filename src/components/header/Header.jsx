import React from 'react';
import "./Header.css"

function Header() {
  return (
    <header className="header-container">
      <div className="logo">AUCTIONKOI</div>
      <nav className="nav">
        <a href="/" className="nav-link active">Home</a>
        <a href="/auctions" className="nav-link">Auctions</a>
        <a href="/about" className="nav-link">About</a>
      </nav>
      <div className="auth-buttons">
        <button className="login-button">Log in</button>
        <button className="register-button">Register</button>
      </div>
    </header>
  );
}

export default Header;