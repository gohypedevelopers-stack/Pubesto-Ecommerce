"use client";

import Header from "../../components/Header";
import Footer from "../../components/Footer";
import Drawers from "../../components/Drawers";
import { StoreProvider } from "../../components/StoreContext";
import { ArrowRight } from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";
import { pubestoTrustFeatures } from "../../lib/data";
import { useRef } from "react";

export default function AboutPage() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });
  const heroImageScale = useTransform(scrollYProgress, [0, 0.3], [1, 1.2]);

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
    <StoreProvider>
      <Header />
      <Drawers />
      <main className="about-page" ref={containerRef}>
        {/* Section 1: Hero */}
        <section className="about-hero">
          <motion.div
            className="about-hero-content"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          >
            <motion.p className="eyebrow" {...fadeIn}>
              About Pubesto
            </motion.p>
            <motion.h1 {...fadeIn}>Useful Finds for Everyday Homes.</motion.h1>
            <motion.p className="about-description" {...fadeIn}>
              Pubesto curates practical home, kitchen, bottle, lunch box, fan,
              and daily-use products for Indian homes. We focus on clear value,
              dependable materials, easy ordering, and products that fit
              naturally into everyday routines.
            </motion.p>
            <motion.a
              href="/shop"
              className="secondary-button about-cta"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              {...fadeIn}
            >
              Shop the Range
            </motion.a>
          </motion.div>
          <motion.div
            className="about-hero-media"
            initial={{ opacity: 0, x: 100, rotateY: 15 }}
            animate={{ opacity: 1, x: 0, rotateY: 0 }}
            transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
            whileHover={{ rotateY: -8, rotateX: 5, scale: 1.05 }}
          >
            <div className="about-composite-frame">
              <motion.img
                src="https://images.unsplash.com/photo-1618220179428-22790b461013?auto=format&fit=crop&w=1200&q=88"
                alt="Styled home decor setup with warm everyday interiors"
                animate={{ 
                  y: [0, -20, 0],
                }}
                transition={{ 
                  duration: 8, 
                  repeat: Infinity, 
                  ease: "easeInOut" 
                }}
                style={{ scale: heroImageScale }}
              />
              <div className="glass-reflection" />
            </div>
            <motion.div 
              className="media-3d-shadow"
              animate={{ 
                scale: [1, 1.1, 1],
                opacity: [0.2, 0.3, 0.2]
              }}
              transition={{ 
                duration: 8, 
                repeat: Infinity, 
                ease: "easeInOut" 
              }}
            />
          </motion.div>
        </section>

        {/* Section 2: Curation */}
        <section className="about-sourcing">
          <motion.div
            className="section-heading-centered"
            initial="initial"
            whileInView="whileInView"
            variants={staggerContainer}
            viewport={{ once: true }}
          >
            <motion.p className="eyebrow" variants={fadeIn}>
              What We Curate
            </motion.p>
            <motion.h2 variants={fadeIn}>
              Practical Picks, Not Clutter.
            </motion.h2>
            <motion.p className="section-intro" variants={fadeIn}>
              Every Pubesto product is selected for a clear purpose: better
              storage, cleaner carry, easier meal prep, compact cooling, or
              simple comfort at home. The range stays focused on daily
              usefulness and honest value.
            </motion.p>
          </motion.div>

          <motion.div
            className="ingredient-grid"
            initial="initial"
            whileInView="whileInView"
            variants={staggerContainer}
            viewport={{ once: true }}
          >
            <motion.article className="ingredient-card" variants={fadeIn}>
              <div className="ingredient-media">
                <img
                  src="https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=900&q=88"
                  alt="Modern home decor corner with sofa and styled interiors"
                />
              </div>
              <div className="ingredient-body">
                <div>
                  <h3>Home Decor</h3>
                  <p>
                    Shelf-ready accents and practical pieces for fresh-looking
                    spaces
                  </p>
                </div>
                <ArrowRight size={24} className="ingredient-arrow" />
              </div>
            </motion.article>

            <motion.article className="ingredient-card" variants={fadeIn}>
              <div className="ingredient-media product-showcase-media">
                <img
                  src="/images/products/new-products/v8-otg-fan.svg"
                  alt="V8 OTG mobile fan product"
                />
              </div>
              <div className="ingredient-body">
                <div>
                  <h3>OTG Fans</h3>
                  <p>
                    Compact mobile fans for quick cooling at work, travel, and
                    study
                  </p>
                </div>
                <ArrowRight size={24} className="ingredient-arrow" />
              </div>
            </motion.article>

            <motion.article className="ingredient-card" variants={fadeIn}>
              <div className="ingredient-media product-showcase-media">
                <img
                  src="/images/products/new-products/b-07-premium-nice-glass-bottle.svg"
                  alt="Premium glass water bottle product"
                />
              </div>
              <div className="ingredient-body">
                <div>
                  <h3>Water Bottles</h3>
                  <p>
                    Clean daily-carry bottles for school, office, gifting, and
                    home
                  </p>
                </div>
                <ArrowRight size={24} className="ingredient-arrow" />
              </div>
            </motion.article>
          </motion.div>
        </section>

        {/* Section 3: Process */}
        <section className="about-process">
          <div className="about-process-grid">
            <motion.div
              className="about-process-media"
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 1 }}
              viewport={{ once: true }}
            >
              <img
                src="https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?auto=format&fit=crop&w=1200&q=80"
                alt="Organized home storage and packed essentials"
              />
            </motion.div>
            <div className="about-process-content">
              <motion.p className="eyebrow" {...fadeIn}>
                How We Work
              </motion.p>
              <motion.h2 {...fadeIn}>From Pick to Package.</motion.h2>
              <motion.div
                className="process-steps"
                initial="initial"
                whileInView="whileInView"
                variants={staggerContainer}
                viewport={{ once: true }}
              >
                {[
                  {
                    step: "01",
                    title: "Select",
                    desc: "We look for products with a clear everyday job, simple maintenance, useful sizing, and value that makes sense.",
                  },
                  {
                    step: "02",
                    title: "Check",
                    desc: "Listings are kept clear about price, stock, product details, photos, and the practical use case for each item.",
                  },
                  {
                    step: "03",
                    title: "Pack",
                    desc: "Orders are prepared with secure packaging so bottles, lunch boxes, fans, and home items travel safely.",
                  },
                  {
                    step: "04",
                    title: "Support",
                    desc: "For delivery, return, refund, or product questions, Pubesto support helps customers resolve issues clearly.",
                  },
                ].map((item) => (
                  <motion.div
                    className="process-step"
                    key={item.step}
                    variants={fadeIn}
                  >
                    <strong>
                      {item.step}. {item.title}
                    </strong>
                    <p>{item.desc}</p>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </div>
        </section>

        {/* Section 4: Why Choose Pubesto */}
        <section className="why-pubesto-section">
          <motion.div className="why-pubesto-heading" {...fadeIn}>
            <p>Useful. Reliable. Everyday.</p>
            <h2>Why Choose Pubesto</h2>
          </motion.div>
          <motion.div
            className="why-pubesto-card"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            viewport={{ once: true }}
          >
            {pubestoTrustFeatures.map((feature, idx) => (
              <motion.div
                className="why-pubesto-feature"
                key={feature.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * idx }}
                viewport={{ once: true }}
              >
                <span className="why-pubesto-icon">
                  {feature.mark ? (
                    <span className="why-pubesto-mark">{feature.mark}</span>
                  ) : (
                    <feature.Icon size={32} />
                  )}
                </span>
                <span>{feature.label}</span>
              </motion.div>
            ))}
          </motion.div>
        </section>
      </main>
      <Footer />
    </StoreProvider>
  );
}
