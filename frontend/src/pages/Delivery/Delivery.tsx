import React from 'react';
import './Delivery.css';

const Delivery: React.FC = () => {
  return (
    <div className="delivery-page">
      <div className="delivery-container">
        <h1>Delivery Information</h1>
        <div className="delivery-content">
          <section className="delivery-section">
            <h2>Delivery Areas</h2>
            <p>
              We currently deliver to the following areas within a 10km radius of our restaurant locations:
            </p>
            <div className="areas-grid">
              <div className="area-item">
                <h3>Downtown</h3>
                <p>Estimated time: 20-30 minutes</p>
              </div>
              <div className="area-item">
                <h3>Suburbs</h3>
                <p>Estimated time: 30-45 minutes</p>
              </div>
              <div className="area-item">
                <h3>Business District</h3>
                <p>Estimated time: 15-25 minutes</p>
              </div>
              <div className="area-item">
                <h3>University Area</h3>
                <p>Estimated time: 25-35 minutes</p>
              </div>
            </div>
          </section>
          
          <section className="delivery-section">
            <h2>Delivery Options</h2>
            <div className="delivery-options">
              <div className="option-item">
                <h3>Standard Delivery</h3>
                <p>Free delivery on orders above $50</p>
                <p>Otherwise: $5 delivery fee</p>
              </div>
              <div className="option-item">
                <h3>Express Delivery</h3>
                <p>Get your food in 20 minutes or less</p>
                <p>Additional $10 fee</p>
              </div>
              <div className="option-item">
                <h3>Scheduled Delivery</h3>
                <p>Schedule your delivery up to 24 hours in advance</p>
                <p>No additional fee</p>
              </div>
            </div>
          </section>
          
          <section className="delivery-section">
            <h2>Delivery Tracking</h2>
            <p>
              Track your order in real-time through our app. You'll receive updates on:
            </p>
            <ul className="tracking-features">
              <li>Order confirmation</li>
              <li>Food preparation status</li>
              <li>Driver assignment</li>
              <li>Real-time location tracking</li>
              <li>Estimated arrival time</li>
            </ul>
          </section>
          
          <section className="delivery-section">
            <h2>Special Instructions</h2>
            <p>
              You can add special instructions for your delivery, such as:
            </p>
            <ul className="special-instructions">
              <li>Leave at doorstep</li>
              <li>Call upon arrival</li>
              <li>Specific building entrance instructions</li>
              <li>Food handling preferences</li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Delivery;
