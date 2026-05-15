"use client";

import React, { useRef } from "react";
import { ArrowRight, Star, ShieldCheck, Zap, Heart } from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";
import { pubestoTrustFeatures } from "../../lib/data";

export default function AboutPage() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const fadeIn = {
    initial: { opacity: 0, y: 30 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-100px" },
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
  };

  const staggerContainer = {
    initial: {},
    whileInView: {
      transition: {
        staggerChildren: 0.2,
      },
    },
    viewport: { once: true },
  };

  return (
    <div className="about-page-v2">
      <main className="about-main" ref={containerRef}>
        
        {/* Section 1: Hero - Using Real Neck Fan & Arctic Air */}
        <section className="about-hero-v2">
          <div className="hero-grid">
            <motion.div
              className="hero-text-content"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            >
              <p className="eyebrow-accent">Our Journey</p>
              <h1>Useful Finds for <br/><span>Everyday Homes.</span></h1>
              <p className="hero-subtext">
                Pubesto curates practical essentials for modern Indian living. 
                We skip the clutter and focus on dependable quality that fits 
                naturally into your daily routine.
              </p>
              <div className="hero-stats">
                <div className="stat-item">
                  <strong>50k+</strong>
                  <span>Happy Homes</span>
                </div>
                <div className="stat-item">
                  <strong>QC</strong>
                  <span>Strict Quality</span>
                </div>
              </div>
            </motion.div>

            <div className="hero-visual-stack">
              <motion.div 
                className="visual-main"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1.2, delay: 0.2 }}
              >
                <img src="/images/products/neck-fan.png" alt="Featured Product" />
                <div className="floating-badge">Best Seller</div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Section 2: Core Categories - Using Real Product Images */}
        <section className="about-showcase">
          <motion.div className="section-title-area" {...fadeIn}>
            <h2>Practical Picks, Not Clutter.</h2>
            <p>Every Pubesto product is selected for a clear purpose: better storage, cleaner carry, or simple comfort.</p>
          </motion.div>

          <div className="showcase-grid">
            {[
              {
                title: "Portable Cooling",
                desc: "Compact fans for work, travel, and study corners.",
                img: "/images/products/mist-fan.jpg",
                tag: "Fans"
              },
              {
                title: "Smart Hydration",
                desc: "Leak-proof, stylish bottles for school and office.",
                img: "/images/products/notebook-bottle.png",
                tag: "Bottles"
              },
              {
                title: "Everyday Storage",
                desc: "Smart solutions for organized home living.",
                img: "/images/products/lunch-box.jpg",
                tag: "Essentials"
              }
            ].map((item, i) => (
              <motion.div 
                key={i}
                className="showcase-card"
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="card-image">
                  <img src={item.img} alt={item.title} />
                  <span className="card-tag">{item.tag}</span>
                </div>
                <div className="card-info">
                  <h3>{item.title}</h3>
                  <p>{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Section 3: Trust Pillars - Dynamic Cards */}
        <section className="about-trust">
          <div className="trust-container">
            <div className="trust-header">
              <h2>Built on Trust.</h2>
              <div className="line-accent" />
            </div>
            
            <div className="trust-pillars">
              <div className="pillar-item">
                <Zap className="pillar-icon" />
                <h3>Fast Dispatch</h3>
                <p>We know you're excited. Most orders leave our warehouse within 24 hours.</p>
              </div>
              <div className="pillar-item">
                <ShieldCheck className="pillar-icon" />
                <h3>QC Verified</h3>
                <p>Every single item undergoes a strict quality check before reaching you.</p>
              </div>
              <div className="pillar-item">
                <Heart className="pillar-icon" />
                <h3>Home Centric</h3>
                <p>Curated specifically for the needs and aesthetics of Indian households.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Section 4: Process - Real Shipping Vibe */}
        <section className="about-process-v2">
          <div className="process-split">
            <div className="process-visual">
              <img src="/images/products/portable-ac.jpg" alt="Shipping Quality" className="main-process-img" />
              <div className="experience-box">
                <strong>5+ Years</strong>
                <span>of Excellence</span>
              </div>
            </div>
            <div className="process-content">
              <h2>From Pick to Package.</h2>
              <div className="process-list">
                {[
                  { step: "01", title: "Select", desc: "We find products with useful sizing and real value." },
                  { step: "02", title: "Check", desc: "Clear pricing and honest stock details, always." },
                  { step: "03", title: "Pack", desc: "Secure packaging for safe travel to your door." },
                  { step: "04", title: "Support", desc: "Human support to resolve your issues clearly." }
                ].map((step, i) => (
                  <motion.div 
                    key={i}
                    className="step-row"
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <span className="step-num">{step.step}</span>
                    <div className="step-text">
                      <h4>{step.title}</h4>
                      <p>{step.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Section 5: Why Choose Pubesto - Using Trust Data */}
        <section className="why-pubesto-v2">
          <div className="why-header">
            <h2>Why Pubesto?</h2>
            <p>The choice of thousands of happy Indian customers.</p>
          </div>
          <div className="features-carousel">
            {pubestoTrustFeatures.map((feature, idx) => (
              <div key={idx} className="feature-pill">
                {feature.mark ? <span className="pill-mark">{feature.mark}</span> : <feature.Icon size={18} />}
                <span>{feature.label}</span>
              </div>
            ))}
          </div>
        </section>

      </main>

      <style jsx>{`
        .about-page-v2 {
          background: #fdfdfd;
          color: #333;
          overflow-x: hidden;
        }

        .about-hero-v2 {
          padding: 140px 24px 80px;
          max-width: 1400px;
          margin: 0 auto;
        }

        .hero-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 60px;
          align-items: center;
        }

        .eyebrow-accent {
          text-transform: uppercase;
          letter-spacing: 3px;
          font-weight: 700;
          color: #3f6469;
          font-size: 14px;
          margin-bottom: 20px;
        }

        .hero-text-content h1 {
          font-size: 80px;
          line-height: 0.9;
          margin-bottom: 30px;
          color: #3f6469;
        }

        .hero-text-content h1 span {
          font-style: italic;
          opacity: 0.6;
        }

        .hero-subtext {
          font-size: 20px;
          line-height: 1.6;
          color: #666;
          max-width: 500px;
          margin-bottom: 40px;
        }

        .hero-stats {
          display: flex;
          gap: 40px;
        }

        .stat-item {
          display: flex;
          flex-direction: column;
        }

        .stat-item strong {
          font-size: 32px;
          color: #3f6469;
        }

        .stat-item span {
          font-size: 14px;
          color: #999;
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        .hero-visual-stack {
          position: relative;
          height: 500px;
        }

        .visual-main {
          width: 80%;
          height: 100%;
          background: #f6f4f2;
          border-radius: 40px;
          overflow: hidden;
          position: relative;
        }

        .visual-main img {
          width: 100%;
          height: 100%;
          object-fit: contain;
          padding: 40px;
        }

        .floating-badge {
          position: absolute;
          top: 30px;
          right: 30px;
          background: #3f6469;
          color: white;
          padding: 8px 16px;
          border-radius: 30px;
          font-size: 12px;
          font-weight: 700;
          text-transform: uppercase;
        }


        .about-showcase {
          padding: 100px 24px;
          max-width: 1400px;
          margin: 0 auto;
        }

        .section-title-area {
          text-align: center;
          margin-bottom: 60px;
        }

        .section-title-area h2 {
          font-size: 48px;
          color: #3f6469;
          margin-bottom: 15px;
        }

        .section-title-area p {
          color: #666;
          font-size: 18px;
        }

        .showcase-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 30px;
        }

        .showcase-card {
          background: white;
          border-radius: 24px;
          overflow: hidden;
          box-shadow: 0 10px 20px rgba(0,0,0,0.03);
          transition: transform 0.3s ease;
        }

        .showcase-card:hover {
          transform: translateY(-10px);
        }

        .card-image {
          height: 350px;
          background: #f9f9f9;
          position: relative;
        }

        .card-image img {
          width: 100%;
          height: 100%;
          object-fit: contain;
          padding: 30px;
        }

        .card-tag {
          position: absolute;
          bottom: 20px;
          left: 20px;
          background: white;
          padding: 6px 14px;
          border-radius: 20px;
          font-size: 11px;
          font-weight: 700;
          text-transform: uppercase;
          color: #3f6469;
        }

        .card-info {
          padding: 30px;
        }

        .card-info h3 {
          font-size: 24px;
          color: #3f6469;
          margin-bottom: 10px;
        }

        .card-info p {
          color: #777;
          line-height: 1.5;
        }

        .about-trust {
          background: #3f6469;
          color: white;
          padding: 100px 24px;
        }

        .trust-container {
          max-width: 1200px;
          margin: 0 auto;
        }

        .trust-header {
          text-align: center;
          margin-bottom: 80px;
        }

        .trust-header h2 {
          font-size: 56px;
          margin-bottom: 20px;
        }

        .line-accent {
          width: 80px;
          height: 3px;
          background: #e5dada;
          margin: 0 auto;
        }

        .trust-pillars {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 60px;
        }

        .pillar-item {
          text-align: center;
        }

        .pillar-icon {
          width: 48px;
          height: 48px;
          margin-bottom: 24px;
          opacity: 0.8;
        }

        .pillar-item h3 {
          font-size: 22px;
          margin-bottom: 15px;
        }

        .pillar-item p {
          opacity: 0.7;
          line-height: 1.6;
        }

        .about-process-v2 {
          padding: 120px 24px;
          max-width: 1400px;
          margin: 0 auto;
        }

        .process-split {
          display: grid;
          grid-template-columns: 1.2fr 1fr;
          gap: 100px;
          align-items: center;
        }

        .process-visual {
          position: relative;
        }

        .main-process-img {
          width: 100%;
          border-radius: 40px;
          box-shadow: 0 30px 60px rgba(0,0,0,0.1);
        }

        .experience-box {
          position: absolute;
          top: 40px;
          left: -40px;
          background: #3f6469;
          color: white;
          padding: 30px;
          border-radius: 24px;
          display: flex;
          flex-direction: column;
        }

        .experience-box strong {
          font-size: 36px;
        }

        .process-content h2 {
          font-size: 48px;
          color: #3f6469;
          margin-bottom: 50px;
        }

        .process-list {
          display: flex;
          flex-direction: column;
          gap: 40px;
        }

        .step-row {
          display: flex;
          gap: 24px;
        }

        .step-num {
          font-size: 32px;
          font-weight: 700;
          color: #3f6469;
          opacity: 0.2;
        }

        .step-text h4 {
          font-size: 20px;
          color: #3f6469;
          margin-bottom: 5px;
        }

        .step-text p {
          color: #777;
        }

        .why-pubesto-v2 {
          padding: 100px 24px;
          text-align: center;
          background: #f9f9f9;
        }

        .why-header h2 {
          font-size: 40px;
          color: #3f6469;
          margin-bottom: 10px;
        }

        .why-header p {
          color: #888;
          margin-bottom: 50px;
        }

        .features-carousel {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 15px;
          max-width: 1000px;
          margin: 0 auto;
        }

        .feature-pill {
          background: white;
          padding: 12px 24px;
          border-radius: 50px;
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 14px;
          font-weight: 600;
          color: #3f6469;
          box-shadow: 0 4px 10px rgba(0,0,0,0.05);
        }

        @media (max-width: 1024px) {
          .hero-grid, .process-split {
            grid-template-columns: 1fr;
          }
          .hero-text-content h1 {
            font-size: 60px;
          }
          .showcase-grid {
            grid-template-columns: 1fr 1fr;
          }
          .trust-pillars {
            grid-template-columns: 1fr;
            gap: 40px;
          }
        }

        @media (max-width: 768px) {
          .hero-text-content h1 {
            font-size: 48px;
          }
          .showcase-grid {
            grid-template-columns: 1fr;
          }
          .visual-sub {
            display: none;
          }
        }
      `}</style>
    </div>
  );
}
