import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import koi_data from "../../utils/data/koi_data.json";
import "./KoiDetail.scss";
import { useAuth } from "../../AuthContext";
import NavigateButton from "../../components/shared/NavigateButton";

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
          <img
            src={koi.image.url}
            alt={koi.type}
            className="koi-detail-image"
          />
          <img
            src={koi.image.url}
            alt={koi.type}
            className="koi-detail-image-small"
          />
        </div>
        <div className="koi-detail-right">
          <h1 className="koi-detail-title text-5xl">{koi.type}</h1>
          <div className="flex flex-row justify-content-around">
            {/* <span className="star-rating">★★★★★</span> */}
            {/* <span className="koi-id">#{koi.id}</span> */}
            {isAvailable && (
              <span className="flex items-center justify-center text-center mt-3 mb-3 text-white font-bold w-[5rem] h-[2rem] rounded-xl bg-green-500">
                Live
              </span>
            )}
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
              <h3 className="text-3xl mb-5">Bid Details</h3>
              <div className="starting-bid">
                <span className="m-3">Starting time</span>
                <span className="bid-amount">${koi.price}</span>
              </div>
              <div className="starting-bid">
                <span className="m-3">End time</span>
                <span className="bid-amount">${koi.price}</span>
              </div>
              <div className="starting-bid">
                <span className="m-3">Step</span>
                <span className="bid-amount">${koi.price}</span>
              </div>
              <div className="current-bid">
                <span className="m-3">Current Highest Bidder</span>
                <span className="bid-amount">${koi.price}</span>
                <span className="bidder-name m-3">lcaohoanq</span>
              </div>
              <div className="countdown mt-5">Countdown Timer: {timeLeft}</div>
              {isLoggedIn ? (
                <form onSubmit={handleBidSubmit}>
                  <input
                    type="number"
                    value={bidAmount}
                    onChange={(e) => setBidAmount(e.target.value)}
                    placeholder="Enter your bid"
                  />
                  <button type="submit" className="place-bid-button">
                    Place Bid
                  </button>
                </form>
              ) : (
                <div className="bidding-buttons">
                  <NavigateButton
                    text="Login"
                    to="/login"
                    className="w-full h-[50px] font-bold my-[10px] mt-[20px] rounded-xl text-xl text-white border-none bg-blue-500 hover:bg-blue-600"
                  />
                  <NavigateButton
                    text="Register"
                    to="/register"
                    className="w-full h-[50px] font-bold my-[10px] mt-[20px] rounded-xl text-xl text-white border-none bg-red-500 hover:bg-red-600"
                  />
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
