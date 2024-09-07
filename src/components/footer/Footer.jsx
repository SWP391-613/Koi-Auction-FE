import React from "react";
import "./Footer.css";
import SecurityIcon from '@mui/icons-material/Security';
import DescriptionIcon from '@mui/icons-material/Description';
import HomeIcon from '@mui/icons-material/Home';
import AuctionIcon from '@mui/icons-material/Gavel';
import InfoIcon from '@mui/icons-material/Info';
import LoginIcon from '@mui/icons-material/Login';
import PersonAddIcon from '@mui/icons-material/PersonAdd';

function Footer() {
  return (
    <footer className="footer-container">
      <div className="footer-content">
        <div className="footer-section">
          <h3 className="footer-title">Navigation</h3>
          <a href="/" className="footer-link">
            <div className="svg-wrapper-1">
              <div className="svg-wrapper">
                <HomeIcon />
              </div>
            </div>
            <span>Home</span>
          </a>
          <a href="/auctions" className="footer-link">
            <div className="svg-wrapper-1">
              <div className="svg-wrapper">
                <AuctionIcon />
              </div>
            </div>
            <span>Auctions</span>
          </a>
          <a href="/about" className="footer-link">
            <div className="svg-wrapper-1">
              <div className="svg-wrapper">
                <InfoIcon />
              </div>
            </div>
            <span>About</span>
          </a>
        </div>
        <div className="footer-section">
          <h3 className="footer-title">Policy</h3>
          <a href="/privacy" className="footer-link">
            <div className="svg-wrapper-1">
              <div className="svg-wrapper">
                <SecurityIcon />
              </div>
            </div>
            <span>Privacy Policy</span>
          </a>
          <a href="/terms" className="footer-link">
            <div className="svg-wrapper-1">
              <div className="svg-wrapper">
                <DescriptionIcon />
              </div>
            </div>
            <span>Terms and Conditions</span>
          </a>
        </div>
        <div className="footer-section">
          <h3 className="footer-title">Account</h3>
          <a href="/login" className="footer-link">
            <div className="svg-wrapper-1">
              <div className="svg-wrapper">
                <LoginIcon />
              </div>
            </div>
            <span>Login</span>
          </a>
          <a href="/register" className="footer-link">
            <div className="svg-wrapper-1">
              <div className="svg-wrapper">
                <PersonAddIcon />
              </div>
            </div>
            <span>Register</span>
          </a>
        </div>
      </div>
      <div className="footer-bottom">AuctionKoi.com is a division of SelectKoi.com</div>
    </footer>
  );
}

export default Footer;