import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import koi_data from "../../data/koi_data.json";
import "./KoiDetail.css";
import { useAuth } from "../../AuthContext"; // Change this line

const KoiDetail = () => {
  const { isLoggedIn } = useAuth(); // Change this line
  const { id } = useParams();
  const koi = koi_data.items.find((item) => item.id === parseInt(id));
  const [bidAmount, setBidAmount] = useState("");
  const navigate = useNavigate();

  if (!koi) {
    return <div>Không tìm thấy cá Koi.</div>;
  }

  const handleBidSubmit = (e) => {
    e.preventDefault();
    console.log(`Bid submitted: ${bidAmount}`);
    // Here you would typically send the bid to your backend
    setBidAmount("");
  };

  const handleClose = () => {
    navigate("/auctions");
  };

  return (
    <div className="koi-detail-page">
      <div className="auction-header">
        <h2 className="auction-title">
          Auction #{koi.id}
          <span className="auction-ended">Ended!</span>
        </h2>
        <span className="auction-status">Ended 4 months ago</span>
      </div>
      <button className="back-button" onClick={handleClose}>
        Back to Auctions
      </button>
      <div className="koi-detail-content">
        <div className="koi-detail-left">
          <img
            src={koi.image.url}
            alt={koi.type}
            className="koi-detail-image"
          />
        </div>
        <div className="koi-detail-right">
          <h1 className="koi-detail-title">{koi.type}</h1>
          <div className="koi-rating">
            <span className="star-rating">★★★☆☆</span>
            <span className="koi-id">#{koi.id}</span>
            <span className="auction-ended">Ended!</span>
          </div>
          <div className="koi-info-grid">
            <div className="info-item">
              <span className="info-label">Sex</span>
              <span className="info-value">{koi.sex}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Length</span>
              <span className="info-value">{koi.length}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Breeder</span>
              <span className="info-value">{koi.breeder}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Age</span>
              <span className="info-value">
                {koi.age.years} years ({koi.age.type})
              </span>
            </div>
          </div>
          <div className="bidding-section">
            {isLoggedIn ? (
              <div>
                <p>Place your bid now!</p>
                <form onSubmit={handleBidSubmit}>
                  <input
                    type="number"
                    value={bidAmount}
                    onChange={(e) => setBidAmount(e.target.value)}
                    placeholder="Enter bid amount"
                  />
                  <button type="submit" className="bid-button">
                    Place Bid
                  </button>
                </form>
              </div>
            ) : (
              <>
                <p>Register today to start bidding!</p>
                <div className="bidding-buttons">
                  <button className="login-button">
                    <Link to="/login">Log In</Link>
                  </button>
                  <button className="register-button">
                    <Link to="/register">Register</Link>
                  </button>
                </div>
              </>
            )}
          </div>
          <div className="past-bids">
            <h3>
              Past Bids <button className="refresh-button">Refresh</button>
            </h3>
            <p className="no-bids">
              No Bids Yet
              <br />
              Be the first to bid!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KoiDetail;
