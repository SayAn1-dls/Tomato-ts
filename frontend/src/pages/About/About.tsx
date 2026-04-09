import React from 'react';
import './About.css';

const About: React.FC = () => {
  return (
    <div className="about-page">
      <div className="about-container">
        <h1>About Tomato Food Delivery</h1>
        <div className="about-content">
          <section className="about-section">
            <h2>Our Story</h2>
            <p>
              Founded in 2024, Tomato Food Delivery started with a simple mission: 
              to bring delicious, high-quality food right to your doorstep. We believe 
              that great food should be accessible to everyone, anytime, anywhere.
            </p>
          </section>
          
          <section className="about-section">
            <h2>Our Mission</h2>
            <p>
              To connect food lovers with their favorite local restaurants through 
              innovative technology, exceptional service, and a commitment to quality.
            </p>
          </section>
          
          <section className="about-section">
            <h2>Why Choose Us?</h2>
            <div className="features-grid">
              <div className="feature-item">
                <h3>Fast Delivery</h3>
                <p>30-minute delivery guarantee or your money back</p>
              </div>
              <div className="feature-item">
                <h3>Quality Food</h3>
                <p>Partnered with the best restaurants in your area</p>
              </div>
              <div className="feature-item">
                <h3>Easy Ordering</h3>
                <p>Simple, intuitive ordering process</p>
              </div>
              <div className="feature-item">
                <h3>24/7 Support</h3>
                <p>Always here to help you</p>
              </div>
            </div>
          </section>
          
          <section className="about-section">
            <h2>Our Team</h2>
            <p>
              Our team is passionate about food and technology. We work tirelessly 
              to ensure that every order is perfect and every customer is happy.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default About;
