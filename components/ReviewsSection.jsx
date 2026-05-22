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
      <div className="reviews-container">
        <header className="reviews-header">
          <span className="reviews-eyebrow">TRUSTED BY THOUSANDS</span>
          <h2 id="reviews-title">What Our Customers Say</h2>
          <div className="reviews-summary">
            <div className="summary-stars">
              {[0, 1, 2, 3, 4].map((index) => (
                <Star key={index} size={18} fill="currentColor" stroke="none" />
              ))}
            </div>
            <div className="summary-stats">
              {displayAverage} out of 5 ({displayCount})
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
            type="button"
          >
            <ChevronRight size={24} />
          </button>
        </div>
      </div>
    </section>
  );
}
