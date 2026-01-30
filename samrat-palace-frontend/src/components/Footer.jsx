import React from 'react';
import '../styles/main.css';

const Footer = () => {
    return (
        <footer className="main-footer">
            <div className="footer-top">
                <div className="footer-brand">
                    <h2 className="luxury-font">SAMRAT <span>PALACE</span></h2>
                    <p>Experience the epitome of luxury and Indian heritage hospitality.</p>
                </div>
                <div className="footer-links">
                    <h4>Quick Links</h4>
                    <ul>
                        <li><a href="/rooms">Our Rooms</a></li>
                        <li><a href="/restaurant">Fine Dining</a></li>
                        <li><a href="/events">Special Events</a></li>
                    </ul>
                </div>
                <div className="footer-contact">
                    <h4>Contact Us</h4>
                    <p>123 Luxury Lane, Heritage City</p>
                    <p>Phone: +91 98765 43210</p>
                    <p>Email: concierge@samratpalace.com</p>
                </div>
            </div>
            <div className="footer-bottom">
                <p>&copy; 2024 Samrat Palace Hotels & Resorts. All Rights Reserved.</p>
            </div>
        </footer>
    );
};

export default Footer;