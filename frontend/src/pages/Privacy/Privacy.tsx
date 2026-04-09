import React from 'react';
import './Privacy.css';

const Privacy: React.FC = () => {
  return (
    <div className="privacy-page">
      <div className="privacy-container">
        <h1>Privacy Policy</h1>
        <div className="privacy-content">
          <section className="privacy-section">
            <h2>Information We Collect</h2>
            <p>
              When you use our food delivery service, we collect certain information to provide you with best experience:
            </p>
            <ul>
              <li><strong>Personal Information:</strong> Name, email, phone number, delivery address</li>
              <li><strong>Order Information:</strong> Food preferences, order history, payment details</li>
              <li><strong>Technical Information:</strong> IP address, device information, browsing behavior</li>
              <li><strong>Location Data:</strong> GPS coordinates for delivery tracking (with your consent)</li>
            </ul>
          </section>
          
          <section className="privacy-section">
            <h2>How We Use Your Information</h2>
            <p>We use your information to:</p>
            <ul>
              <li><strong>Process and deliver your orders</strong></li>
              <li><strong>Provide customer support</strong></li>
              <li><strong>Improve our services</strong></li>
              <li><strong>Ensure platform security</strong></li>
            </ul>
          </section>
          
          <section className="privacy-section">
            <h2>Data Protection</h2>
            <p>
              We implement industry-standard security measures to protect your personal information:
            </p>
            <ul>
              <li><strong>SSL Encryption:</strong> All data transmissions are encrypted</li>
              <li><strong>Secure Payment Processing:</strong> Protected payment gateway</li>
              <li><strong>Regular Security Audits:</strong> Continuous monitoring</li>
              <li><strong>Employee Access Restrictions:</strong> Limited access to data</li>
            </ul>
          </section>
          
          <section className="privacy-section">
            <h2>Third-Party Sharing</h2>
            <p>
              We may share your information with trusted third parties only when necessary:
            </p>
            <ul>
              <li><strong>Delivery Partners:</strong> To complete your orders</li>
              <li><strong>Payment Processors:</strong> To process payments securely</li>
              <li><strong>Restaurants:</strong> To prepare and deliver your food</li>
              <li><strong>Legal Authorities:</strong> When required by law</li>
            </ul>
          </section>
          
          <section className="privacy-section">
            <h2>Your Rights</h2>
            <p>You have the right to:</p>
            <ul>
              <li><strong>Access your personal information</strong></li>
              <li><strong>Correct inaccurate information</strong></li>
              <li><strong>Delete your account and data</strong></li>
              <li><strong>Opt-out of marketing communications</strong></li>
              <li><strong>Request data portability</strong></li>
              <li><strong>File complaints with authorities</strong></li>
            </ul>
          </section>
          
          <section className="privacy-section">
            <h2>Changes to This Policy</h2>
            <p>
              We may update this privacy policy from time to time. We will notify you of any changes by:
            </p>
            <ul>
              <li>Email notification</li>
              <li>In-app notification</li>
              <li>Posting on our website</li>
            </ul>
          </section>
          
          <section className="privacy-section">
            <h2>Contact Us</h2>
            <p>
              If you have questions about this privacy policy, please contact us at:
            </p>
            <ul>
              <li>Email: privacy@tomato.com</li>
              <li>Phone: +1-212-456-7890</li>
              <li>Address: 123 Food Street, Culinary City, CC 12345</li>
            </ul>
          </section>
          
          <div className="policy-footer">
            <p><strong>Last Updated:</strong> October 9, 2024</p>
            <p><strong>Effective Date:</strong> October 9, 2024</p>
          </div>
        </div>
    </div>
  );
};

export default Privacy;
