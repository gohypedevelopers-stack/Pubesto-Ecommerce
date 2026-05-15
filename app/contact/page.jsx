"use client";

import React from 'react';
import { Mail, Clock, ShieldCheck, Send } from 'lucide-react';
import '../contact.css';

export default function ContactPage() {
  return (
    <main className="pubesto-contact-page-v2">
      <div className="contact-page-container">
        {/* Hero Section */}
        <div className="contact-hero-v2">
          <p className="contact-eyebrow">Get In Touch</p>
          <h1 className="contact-title">Contact Us</h1>
          <div className="contact-divider" />
          <p className="contact-description">
            Whether you have a question about our artisanal collection or need assistance with an order, 
            we're here to help you every step of the way.
          </p>
        </div>

        {/* Content Section */}
        <div className="contact-main-content">
          <div className="contact-layout-grid">
            
            {/* Left: Info Cards */}
            <div className="contact-info-panel">
              <div className="contact-info-card-v2">
                <div className="icon-wrapper">
                  <Mail size={22} />
                </div>
                <div className="card-details">
                  <span className="card-label">Email Us</span>
                  <p className="card-value">support@pubesto.com</p>
                  <p className="card-sub">Fast & helpful support</p>
                </div>
              </div>

              <div className="contact-info-card-v2">
                <div className="icon-wrapper">
                  <Clock size={22} />
                </div>
                <div className="card-details">
                  <span className="card-label">Business Hours</span>
                  <p className="card-value">Mon - Sat: 10AM - 7PM</p>
                  <p className="card-sub">Response within 24 hours</p>
                </div>
              </div>

              <div className="contact-info-card-v2">
                <div className="icon-wrapper">
                  <ShieldCheck size={22} />
                </div>
                <div className="card-details">
                  <span className="card-label">Customer Support</span>
                  <p className="card-value">Trusted & Secure</p>
                  <p className="card-sub">Your satisfaction is our priority</p>
                </div>
              </div>
            </div>

            {/* Right: Form */}
            <div className="contact-form-panel">
              <div className="contact-form-card-v2">
                <h3>Send a Message</h3>
                <form className="contact-form-v2" onSubmit={(e) => e.preventDefault()}>
                  <div className="form-group-v2">
                    <label>Full Name</label>
                    <input type="text" placeholder="Your name" required />
                  </div>
                  <div className="form-group-v2">
                    <label>Email Address</label>
                    <input type="email" placeholder="Your email" required />
                  </div>
                  <div className="form-group-v2">
                    <label>Subject</label>
                    <input type="text" placeholder="How can we help?" required />
                  </div>
                  <div className="form-group-v2">
                    <label>Message</label>
                    <textarea rows="4" placeholder="Type your message here..." required></textarea>
                  </div>
                  <button type="submit" className="contact-send-btn">
                    <span>Send Message</span>
                    <Send size={18} />
                  </button>
                </form>
              </div>
            </div>

          </div>
        </div>
      </div>
    </main>
  );
}
