"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Star, ShieldCheck, ChevronLeft, ChevronRight, Check } from "lucide-react";

export default function ReviewsSection() {
  const scrollRef = useRef(null);
  const [reviews, setReviews] = useState([]);
  const [summary, setSummary] = useState({ averageRating: 0, count: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let ignore = false;

    async function loadReviews() {
      try {
        const response = await fetch("/api/reviews?scope=home", { cache: "no-store" });
        const data = await response.json();

        if (!ignore && response.ok) {
          setReviews(data.reviews || []);
          setSummary(data.summary || { averageRating: 0, count: 0 });
        }
      } catch (error) {
        console.error("Failed to load homepage reviews:", error);
      } finally {
        if (!ignore) setLoading(false);
      }
    }

    loadReviews();
    return () => {
      ignore = true;
    };
  }, []);

  const [scrollProgress, setScrollProgress] = useState(0);

  const handleScroll = () => {
    if (scrollRef.current) {
      const container = scrollRef.current;
      const maxScroll = container.scrollWidth - container.clientWidth;
      if (maxScroll > 0) {
        const percentage = (container.scrollLeft / maxScroll) * 100;
        setScrollProgress(percentage);
      }
    }
  };

  useEffect(() => {
    const container = scrollRef.current;
    if (container) {
      container.addEventListener("scroll", handleScroll, { passive: true });
      // Calculate initial progress
      handleScroll();
    }
    return () => {
      if (container) {
        container.removeEventListener("scroll", handleScroll);
      }
    };
  }, [reviews]);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const container = scrollRef.current;
      const scrollAmount = container.offsetWidth * 0.8;
      const targetScroll = direction === "left"
        ? container.scrollLeft - scrollAmount
        : container.scrollLeft + scrollAmount;

      container.scrollTo({
        left: targetScroll,
        behavior: "smooth",
      });
    }
  };

  if (!loading && reviews.length === 0) {
    return null;
  }

  const displayAverage = summary.averageRating ? summary.averageRating.toFixed(1) : "0.0";
  const displayCount = summary.count || reviews.length;

  return (
    <section className="reviews-section" aria-labelledby="reviews-title">
      <div className="reviews-bg-pattern" />
      <div className="reviews-container">
        <header className="reviews-header">
          <div className="reviews-eyebrow-container">
            <span className="reviews-eyebrow">TRUSTED BY THOUSANDS</span>
          </div>
          <h2 id="reviews-title">
            What Our <span className="highlight-word">Customers</span> Say
          </h2>
          <div className="reviews-summary-card">
            <div className="summary-stars">
              {[0, 1, 2, 3, 4].map((index) => {
                const isFilled = index < Math.round(Number(summary.averageRating || 5));
                return (
                  <Star 
                    key={index} 
                    size={18} 
                    fill={isFilled ? "currentColor" : "none"} 
                    stroke={isFilled ? "none" : "rgba(251, 191, 36, 0.4)"} 
                    strokeWidth={2}
                  />
                );
              })}
            </div>
            <div className="summary-stats">
              {displayAverage} out of 5 ({displayCount})
            </div>
            <div className="verified-badge">
              <ShieldCheck size={14} className="verified-icon-pulse" />
              <span>VERIFIED</span>
            </div>
          </div>
        </header>

        <div className="reviews-carousel-wrapper">
          <button
            className="carousel-nav prev"
            onClick={() => scroll("left")}
            aria-label="Previous reviews"
            type="button"
          >
            <ChevronLeft size={24} />
          </button>

          <div className="reviews-scroll-container" ref={scrollRef}>
            {(loading ? [] : reviews).map((review, index) => (
              <motion.article
                key={review.id || index}
                className="review-card"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="review-stars">
                  {[0, 1, 2, 3, 4].map((starIndex) => (
                    <Star
                      key={starIndex}
                      size={14}
                      fill={starIndex < Math.round(Number(review.rating || 0)) ? "currentColor" : "none"}
                      strokeWidth={2}
                    />
                  ))}
                </div>

                <blockquote className="review-text">
                  &quot;{review.text}&quot;
                </blockquote>

                <footer className="review-footer">
                  <div className="reviewer-info">
                    <div className="reviewer-avatar">
                      {review.customerImage ? (
                        <img src={review.customerImage} alt={review.customerName} loading="lazy" decoding="async" />
                      ) : (
                        review.initials
                      )}
                    </div>
                    <div className="reviewer-details">
                      <span className="reviewer-name">{review.customerName}</span>
                      <span className="reviewer-status">
                        <Check size={12} strokeWidth={3} />
                        Verified Buyer
                      </span>
                    </div>
                  </div>
                  <div className="verified-icon">
                    <ShieldCheck size={18} />
                  </div>
                </footer>
              </motion.article>
            ))}
          </div>

          <button
            className="carousel-nav next"
            onClick={() => scroll("right")}
            aria-label="Next reviews"
            type="button"
          >
            <ChevronRight size={24} />
          </button>
        </div>

        <div className="carousel-progress-container">
          <span className="carousel-progress-label">Swipe</span>
          <div className="carousel-progress-track">
            <div
              className="carousel-progress-fill"
              style={{ width: `${scrollProgress}%` }}
            />
          </div>
          <span className="carousel-progress-label">Scroll</span>
        </div>
      </div>
    </section>
  );
}
