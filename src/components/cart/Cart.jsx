import React from 'react'
import './Cart.css'
import koi_data from '../../data/koi_data.json'

const Cart = () => {
  return (
    <div className="cart-container">
      {koi_data.items.map((item) => (
        <div key={item.id} className="card">
          <img className="img" src={item.image.url} alt={item.type} />
          <span className='textStatus'> {item.status}</span>
          <div className="textBox">
            <p className="text head">{item.type}</p>
            <span>{item.breeder}</span>
            <p className="text price">{item.price} {item.currency}</p>
          </div>
        </div>
      ))}
    </div>
  )
}

export default Cart