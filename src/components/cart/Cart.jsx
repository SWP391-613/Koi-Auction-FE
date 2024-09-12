import React from "react";
import { Link } from "react-router-dom";
import "./Cart.css";
import koi_data from "../../data/koi_data.json";

const Cart = () => {
  const koiItems = koi_data.items;

  if (!Array.isArray(koiItems) || koiItems.length === 0) {
    return <div>Không có dữ liệu cá Koi.</div>;
  }

  return (
    <div className="koi-container">
      {koiItems.map((koi) => (
        <Link to={`/koi/${koi.id}`} key={koi.id} className="koi-card">
          <div className="image-container">
            {koi.image && <img src={koi.image.url} alt={koi.type} />}
          </div>
          <div className="info">
            <h2 className="title">{koi.type}</h2>
            <span className="price">{koi.price} {koi.currency}</span>
            <div className="details">
              <p><span>Breeder:</span> {koi.breeder}</p>
              <p><span>Length:</span> {koi.length}</p>
              <p><span>Sex:</span> {koi.sex}</p>
              <p><span>Age:</span> {koi.age.years} years ({koi.age.type})</p>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default Cart;
