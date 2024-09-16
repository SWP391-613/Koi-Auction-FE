import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import koi_data from "../../utils/data/koi_data.json";
import "./KoiDetail.css";
import { useAuth } from "../../AuthContext";

const KoiDetail = () => {
  const { isLoggedIn } = useAuth();
  const { id } = useParams();
  const [koi, setKoi] = useState(null);
  const [bidAmount, setBidAmount] = useState("");
  const [timeLeft, setTimeLeft] = useState("00:00:00");

  useEffect(() => {
    const foundKoi = koi_data.items.find((item) => item.id === parseInt(id));
    setKoi(foundKoi);

    if (foundKoi && foundKoi.status === "Available") {
      const timer = setInterval(() => {
        setTimeLeft("00:00:00");
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [id]);

  if (!koi) {
    return <div>Không tìm thấy cá Koi.</div>;
  }

  const handleBidSubmit = (e) => {
    e.preventDefault();
    console.log(`Bid submitted: ${bidAmount}`);
    setBidAmount("");
  };

  const isAvailable = koi.status === "Available";

  return (
    <div className="koi-detail-page">
      <div className="auction-header">
        <h2 className="auction-title">
          {isAvailable ? "Ongoing" : "Ended 4 months ago"}
        </h2>
        <span className="auction-status">
          {isAvailable ? "60 minute Auction Info" : "40 minute Auction Info"}
        </span>
      </div>
      <div className="koi-detail-content">
        <div className="koi-detail-left">
          <img src={koi.image.url} alt={koi.type} className="koi-detail-image" />
          <img src={koi.image.url} alt={koi.type} className="koi-detail-image-small" />
        </div>
        <div className="koi-detail-right">
          <h1 className="koi-detail-title">{koi.type}</h1>
          <div className="koi-rating">
            <span className="star-rating">★★★★★</span>
            <span className="koi-id">#{koi.id}</span>
            {isAvailable && <span className="live-tag">Live</span>}
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
                {koi.age.type} ({koi.age.years} years)
              </span>
            </div>
          </div>
          {isAvailable ? (
            <div className="bidding-section">
              <h3>Bids</h3>
              <div className="starting-bid">
                <span>Starting Bid</span>
                <span className="bid-amount">${koi.price}</span>
              </div>
              <div className="current-bid">
                <span>Current Highest Bidder</span>
                <span className="bid-amount">${koi.price}</span>
                <span className="bidder-name">Bidding User Name</span>
              </div>
              <div className="countdown">Countdown Timer: {timeLeft}</div>
              {isLoggedIn ? (
                <form onSubmit={handleBidSubmit}>
                  <input
                    type="number"
                    value={bidAmount}
                    onChange={(e) => setBidAmount(e.target.value)}
                    placeholder="Enter your bid"
                  />
                  <button type="submit" className="place-bid-button">Place Bid</button>
                </form>
              ) : (
                <div className="bidding-buttons">
                  <button className="register-button">Register</button>
                  <button className="login-button">Login</button>
                </div>
              )}
            </div>
          ) : (
            <div className="past-bids">
              <h3>2 Past Bids</h3>
              <div className="bid-history">
                <div className="bid-item">
                  <span className="bid-amount">${koi.price}</span>
                  <span className="bidder-name">Winning Bidder</span>
                </div>
                <div className="bid-item">
                  <span className="bid-amount">${koi.price - 50}</span>
                  <span className="bidder-name">Previous Bidder</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default KoiDetail;
