"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import { Star, ShieldCheck, ChevronLeft, ChevronRight, Check } from "lucide-react";
import { customerReviews } from "../lib/data";

export default function ReviewsSection() {
  const scrollRef = useRef(null);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const container = scrollRef.current;
      const scrollAmount = container.offsetWidth * 0.8;
      const targetScroll = direction === "left" 
        ? container.scrollLeft - scrollAmount 
        : container.scrollLeft + scrollAmount;
      
      container.scrollTo({
        left: targetScroll,
        behavior: "smooth"
      });
    }
  };

  return (
    <section className="reviews-section" aria-labelledby="reviews-title">
      <div className="reviews-container">
        <header className="reviews-header">
          <span className="reviews-eyebrow">TRUSTED BY THOUSANDS</span>
          <h2 id="reviews-title">What Our Customers Say</h2>
          <div className="reviews-summary">
            <div className="summary-stars">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={18} fill="currentColor" stroke="none" />
              ))}
            </div>
            <div className="summary-stats">
              4.8 ★ (34)
            </div>
            <div className="verified-badge">
              <Check size={14} strokeWidth={3} />
              <span>VERIFIED</span>
            </div>
          </div>
        </header>

        <div className="reviews-carousel-wrapper">
          <button 
            className="carousel-nav prev" 
            onClick={() => scroll("left")}
            aria-label="Previous reviews"
          >
            <ChevronLeft size={24} />
          </button>
          
          <div className="reviews-scroll-container" ref={scrollRef}>
            {customerReviews.map((review, index) => (
              <motion.article 
                key={index} 
                className="review-card"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="review-stars">
                  {[...Array(review.rating)].map((_, i) => (
                    <Star key={i} size={14} fill="currentColor" stroke="none" />
                  ))}
                </div>
                
                <blockquote className="review-text">
                  &quot;{review.text}&quot;
                </blockquote>
                
                <footer className="review-footer">
                  <div className="reviewer-info">
                    <div className="reviewer-avatar">
                      {review.initials}
                    </div>
                    <div className="reviewer-details">
                      <span className="reviewer-name">{review.name}</span>
                      <span className="reviewer-status">Verified Buyer</span>
                    </div>
                  </div>
                  <div className="verified-icon">
                    <ShieldCheck size={20} />
                  </div>
                </footer>
              </motion.article>
            ))}
          </div>

          <button 
            className="carousel-nav next" 
            onClick={() => scroll("right")}
            aria-label="Next reviews"
          >
            <ChevronRight size={24} />
          </button>
        </div>
      </div>
    </section>
  );
}
