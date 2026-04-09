import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Footer.css';
import { assets } from '../../assets/assets';

const Footer: React.FC = () => {
  const navigate = useNavigate();

  const handleNavigation = (path: string) => {
    navigate(path);
    window.scrollTo(0, 0);
  };

  const handleSocialLink = (platform: string) => {
    const urls = {
      facebook: 'https://www.facebook.com',
      twitter: 'https://www.twitter.com',
      linkedin: 'https://www.linkedin.com'
    };
    window.open(urls[platform as keyof typeof urls], '_blank');
  };

  const handleContact = () => {
    window.location.href = 'mailto:contact@tomato.com';
  };

  const handlePhone = () => {
    window.location.href = 'tel:+1-212-456-7890';
  };

  return (
    <div className='footer' id='footer'>
      <div className="footer-content">
        <div className="footer-content-left">
            <img src={assets.logo} alt="Tomato Logo" />
            <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.</p>
            <div className="footer-social-icons">
                <img 
                  src={assets.facebook_icon} 
                  alt="Facebook" 
                  onClick={() => handleSocialLink('facebook')}
                  style={{ cursor: 'pointer' }}
                />
                <img 
                  src={assets.twitter_icon} 
                  alt="Twitter" 
                  onClick={() => handleSocialLink('twitter')}
                  style={{ cursor: 'pointer' }}
                />
                <img 
                  src={assets.linkedin_icon} 
                  alt="LinkedIn" 
                  onClick={() => handleSocialLink('linkedin')}
                  style={{ cursor: 'pointer' }}
                />
            </div>
        </div>
        <div className="footer-content-center">
            <h2>COMPANY</h2>
            <ul>
                <li onClick={() => handleNavigation('/')} style={{ cursor: 'pointer' }}>Home</li>
                <li onClick={() => handleNavigation('/about')} style={{ cursor: 'pointer' }}>About us</li>
                <li onClick={() => handleNavigation('/delivery')} style={{ cursor: 'pointer' }}>Delivery</li>
                <li onClick={() => handleNavigation('/privacy')} style={{ cursor: 'pointer' }}>Privacy policy</li>
            </ul>
        </div>
        <div className="footer-content-right">
            <h2>GET IN TOUCH</h2>
            <ul>
                <li onClick={handlePhone} style={{ cursor: 'pointer' }}>+1-212-456-7890</li>
                <li onClick={handleContact} style={{ cursor: 'pointer' }}>contact@tomato.com</li>
            </ul>
        </div>
      </div>
      <hr />
      <p className="footer-copyright">Copyright 2024 © Tomato.com - All Right Reserved.</p>
    </div>
  );
};

export default Footer;
