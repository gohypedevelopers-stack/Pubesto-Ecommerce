"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ShoppingBag,
  Sparkles,
  Plus,
  Minus,
  Check,
  Volume2,
  VolumeX
} from "lucide-react";
import Link from "next/link";
import { useStore } from "../components/StoreContext";
import {
  categories,
  products,
  heroSlides,
  peopleChoiceVideos,
  socialGalleryItems
} from "../lib/data";
import { formatPrice } from "../lib/utils";
import ReviewsSection from "../components/ReviewsSection";
import "./reviews.css";

function ProductCard({ product, index = 0 }) {
  const { 
    cartItems, addToCart, removeFromCart, getProductId, updateCartQuantity
  } = useStore();
  const [addEffectKey, setAddEffectKey] = useState(null);

  const cartQuantity = cartItems.find((item) => item.id === getProductId(product))?.quantity || 0;

  function showAddAnimation() {
    const nextKey = Date.now();
    setAddEffectKey(nextKey);
    window.setTimeout(() => {
      setAddEffectKey((currentKey) => (currentKey === nextKey ? null : currentKey));
    }, 1050);
  }

  function handleAddToCart(options) {
    if (product.inStock === false) return;



    showAddAnimation();
    addToCart(product, options);
  }

  function handleRemoveFromCart() {
    removeFromCart(getProductId(product));
  }

  return (
    <motion.article
      className="product-card"
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: index * 0.04 }}
      viewport={{ once: true, margin: "-50px" }}
    >
      <div className="product-media">
        <Link className="product-media-link" href={`/product/${product.slug}`} aria-label={`View ${product.name}`}>
          <img src={product.image} alt={product.name} />
        </Link>
        {product.badge ? (
          <span className={`badge ${product.badgeClass || ""}`}>{product.badge}</span>
        ) : null}
        <AnimatePresence>
          {addEffectKey ? (
            <motion.div
              className="premium-add-animation"
              key={addEffectKey}
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 1, 1, 0] }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.05, ease: "easeOut" }}
              aria-hidden="true"
            >
              <span className="premium-add-glow" />
              <span className="premium-add-ring ring-one" />
              <span className="premium-add-ring ring-two" />
              <span className="premium-add-sparkle sparkle-one"><Sparkles /></span>
              <span className="premium-add-sparkle sparkle-two"><Sparkles /></span>
              <span className="premium-add-sparkle sparkle-three"><Sparkles /></span>
              <motion.span
                className="premium-add-chip"
                initial={{ opacity: 0, y: 16, scale: 0.9 }}
                animate={{ opacity: [0, 1, 1, 0], y: [16, 0, -6, -18], scale: [0.9, 1, 1, 0.96] }}
                transition={{ duration: 1.05, ease: "easeOut" }}
              >
                <ShoppingBag />
                Added
              </motion.span>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
      <div className="product-body">
        <Link href={`/product/${product.slug}`}>
          <h3>{product.name}</h3>
        </Link>
        <p className="price">
          {product.price}
          {product.oldPrice ? <span>{product.oldPrice}</span> : null}
        </p>
        {product.inStock === false ? (
          <button className="quick-add disabled" disabled>Out of Stock</button>
        ) : cartQuantity > 0 ? (
          <div className="product-quantity-selector">
            <button 
              type="button" 
              onClick={() => updateCartQuantity(getProductId(product), cartQuantity - 1)}
              aria-label="Decrease quantity"
            >
              <Minus size={16} />
            </button>
            <span>{cartQuantity}</span>
            <button 
              type="button" 
              onClick={() => updateCartQuantity(getProductId(product), cartQuantity + 1)}
              aria-label="Increase quantity"
            >
              <Plus size={16} />
            </button>
          </div>
        ) : (
          <button
            className="quick-add"
            type="button"
            onClick={() => handleAddToCart()}
          >
            Add to Cart
          </button>
        )}
      </div>
    </motion.article>
  );
}

function HomeContent() {
  const {
    selectedCategory, setSelectedCategory,
    searchQuery, setSearchQuery,
    showAllProducts, setShowAllProducts,
    categories, products
  } = useStore();

  const [showAllCategories, setShowAllCategories] = useState(false);
  const [activeSoundVideo, setActiveSoundVideo] = useState(null);
  const [heroSoundOn, setHeroSoundOn] = useState(false);

  const normalizedSearchQuery = searchQuery.trim().toLowerCase();
  const activeProducts = (products || []).filter((product) => {
    if (!product || !product.image) return false;
    const img = String(product.image);
    const hasRealImage = img.startsWith('/images/') || img.includes('shopify.com');
    const isNotDummy = !img.includes('unsplash.com');
    return hasRealImage && isNotDummy;
  });
  
  const categoryFilteredProducts = selectedCategory
    ? activeProducts.filter((product) =>
        selectedCategory.name === "Sale"
          ? product.oldPrice
          : product.categories?.some(cat => cat.toLowerCase() === selectedCategory.name.toLowerCase())
      )
    : activeProducts;

  const filteredProducts = normalizedSearchQuery
    ? categoryFilteredProducts.filter((product) =>
        product.name.toLowerCase().includes(normalizedSearchQuery) ||
        product.description?.toLowerCase().includes(normalizedSearchQuery) ||
        product.categories?.some(cat => cat.toLowerCase().includes(normalizedSearchQuery))
      )
    : categoryFilteredProducts;

  const deduplicatedProducts = filteredProducts.reduce((acc, current) => {
    const x = acc.find(item => item.slug === current.slug);
    if (!x) {
      return acc.concat([current]);
    } else {
      return acc;
    }
  }, []);

  const visibleProducts = showAllProducts ? deduplicatedProducts : deduplicatedProducts.slice(0, 8);

  const productEyebrow = normalizedSearchQuery
    ? `${filteredProducts.length} result${filteredProducts.length === 1 ? "" : "s"} for "${searchQuery.trim()}"`
    : selectedCategory
      ? `Showing ${categoryFilteredProducts.length} product${categoryFilteredProducts.length === 1 ? "" : "s"}`
      : "Customer favourites";

  const productHeading = normalizedSearchQuery
    ? "Search results"
    : selectedCategory
      ? `${selectedCategory.label || selectedCategory.name} products`
      : "Featured products";

  return (
    <>
      <main>
        <section className="hero-section" aria-label="Featured offers">
          <div className="hero-overflow-container">
            <div className={`hero-flex-container ${heroSlides.length === 1 ? "is-static" : "is-animating"}`}>
              {(heroSlides.length > 1 ? [...heroSlides, heroSlides[0]] : heroSlides).map((slide, index) => {
                const isDuplicateSlide = heroSlides.length > 1 && index === heroSlides.length;
                return (
                  <article 
                    className={`hero-slide-item ${slide.video ? "has-video" : ""}`} 
                    aria-hidden={isDuplicateSlide} 
                    key={`${slide.title}-${index}`}
                  >
                    {/* Background Layer */}
                    <div className="hero-slide-bg">
                      {slide.video ? (
                        <video 
                          className="hero-media-bg" 
                          autoPlay 
                          muted={!heroSoundOn || isDuplicateSlide} 
                          loop 
                          playsInline 
                          preload="auto" 
                          poster={slide.image}
                        >
                          <source src={slide.video} type="video/mp4" />
                        </video>
                      ) : (
                        <img className="hero-media-bg" src={slide.image} alt="" />
                      )}
                      <div className="hero-slide-overlay" />
                    </div>

                    {/* Content Container */}
                    <div className="hero-slide-container">
                      <div className="hero-slide-layout">
                        {/* Text Content */}
                        <motion.div 
                          className="hero-content-card"
                          initial={{ opacity: 0, y: 30 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                          viewport={{ once: true }}
                        >
                          <span className="hero-eyebrow-tag">{slide.eyebrow}</span>
                          <h2 className="hero-title">{slide.title}</h2>
                          <p className="hero-description">{slide.copy}</p>
                          <Link href={slide.link} className="hero-primary-cta">
                            {slide.cta}
                          </Link>
                        </motion.div>

                        {/* Floating Product Card Removed */}
                      </div>
                    </div>

                    {/* Sound Toggle */}
                    {slide.video && !isDuplicateSlide && (
                      <button
                        className={`hero-sound-control ${heroSoundOn ? "is-active" : ""}`}
                        type="button"
                        title={heroSoundOn ? "Mute hero video" : "Unmute hero video"}
                        onClick={(event) => {
                          const video = event.currentTarget.closest('.hero-slide-item')?.querySelector("video");
                          const shouldUnmute = !heroSoundOn;

                          document.querySelectorAll(".video-choice-video").forEach((v) => v.muted = true);
                          setActiveSoundVideo(null);

                          if (video) {
                            video.muted = !shouldUnmute;
                            video.volume = 1;
                            if (shouldUnmute) video.play().catch(() => {});
                          }
                          setHeroSoundOn(shouldUnmute);
                        }}
                      >
                        {heroSoundOn ? <Volume2 size={20} /> : <VolumeX size={20} />}
                      </button>
                    )}
                  </article>
                );
              })}
            </div>

            {/* Progress Indicators */}
            {heroSlides.length > 1 && (
              <div className="hero-indicators">
                {heroSlides.map((_, i) => (
                  <div key={i} className="hero-indicator-dot">
                    <div 
                      className="hero-indicator-progress" 
                      style={{ 
                        animation: `hero-progress-fill 16s linear infinite`,
                        animationDelay: `${i * 8}s`
                      }} 
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        <section className="video-choice-section" aria-labelledby="people-choice-title">
          <div className="video-choice-heading">
            <p>Shop from videos</p>
            <h2 id="people-choice-title">People&apos;s choice</h2>
          </div>
          <div className="video-choice-scroll" role="list">
            {peopleChoiceVideos.map((item) => {
              const isSoundOn = activeSoundVideo === item.title;

              return (
                <article className="video-choice-card" role="listitem" key={item.title}>
                  <Link className="video-choice-card-link" href={`/product/${item.slug}`} aria-label={`Shop ${item.title}`}>
                    {item.video && !item.video.includes('pin.it') ? (
                      <video className="video-choice-video" autoPlay muted={!isSoundOn} loop playsInline preload="auto" poster={item.image}>
                        <source src={item.video} type="video/mp4" />
                      </video>
                    ) : (
                      <img className="video-choice-video simulated-video" src={item.image} alt={item.title} />
                    )}
                    <span className="video-choice-gradient" />
                    <span className="video-choice-product">
                      <span className="video-choice-thumb"><img src={item.thumb} alt="" /></span>
                      <span className="video-choice-copy">
                        <strong>{item.title}</strong>
                      </span>
                    </span>
                  </Link>
                  {item.video && !item.video.includes('pin.it') ? (
                    <button
                      className={`video-choice-sound ${isSoundOn ? "active" : ""}`}
                      type="button"
                      title={isSoundOn ? "Mute sound" : "Unmute sound"}
                      aria-label={`${isSoundOn ? "Mute" : "Unmute"} ${item.title}`}
                      aria-pressed={isSoundOn}
                      onClick={(event) => {
                        const video = event.currentTarget.parentElement?.querySelector("video");
                        if (!video) return;

                        const shouldUnmute = activeSoundVideo !== item.title;
                        document.querySelectorAll(".hero-media-bg").forEach((videoElement) => {
                          if (videoElement.tagName === 'VIDEO') videoElement.muted = true;
                        });
                        document.querySelectorAll(".video-choice-video").forEach((videoElement) => {
                          if (videoElement.tagName === 'VIDEO') videoElement.muted = true;
                        });
                        // Assume setHeroSoundOn is available from context or state
                        if (typeof setHeroSoundOn === 'function') setHeroSoundOn(false);

                        if (shouldUnmute) {
                          video.muted = false;
                          video.volume = 1;
                          video.play().catch(() => {});
                          setActiveSoundVideo(item.title);
                        } else {
                          video.muted = true;
                          setActiveSoundVideo(null);
                        }
                      }}
                    >
                      {isSoundOn ? <Volume2 /> : <VolumeX />}
                    </button>
                  ) : null}
                </article>
              );
            })}
          </div>
        </section>

        <section id="categories" className="category-section">
          <div className="section-heading centered">
            <div>
              <p className="eyebrow">Shop the range</p>
              <h2>Browse by category</h2>
            </div>
            {/* View all button removed from categories */}
          </div>
          <div className={showAllCategories ? "category-grid" : "category-scroll-container"}>
            <motion.div
              className={showAllCategories ? "category-grid-inner" : "category-marquee"}
              animate={showAllCategories ? { x: 0 } : { x: [0, "-50%"] }}
              transition={{ 
                x: { 
                  repeat: Infinity, 
                  duration: 25, 
                  ease: "linear",
                  repeatType: "loop"
                } 
              }}
            >
              {(showAllCategories ? categories : [...categories, ...categories]).map((category, index) => (
                <button
                  className={`category-tile ${category.name === "Sale" ? "sale" : ""} ${selectedCategory?.name === category.name ? "selected" : ""}`}
                  type="button"
                  onClick={() => {
                    setSelectedCategory(category);
                    setShowAllProducts(true);
                    document.getElementById("featured")?.scrollIntoView({ behavior: "smooth" });
                  }}
                  key={`${category.name}-${index}`}
                >
                  <img src={category.image} alt="" />
                  <span>{category.name}</span>
                </button>
              ))}
            </motion.div>
          </div>
        </section>

        <section id="featured" className="product-section">
          <div className="section-heading centered">
            <div>
              <p className="eyebrow">{productEyebrow}</p>
              <h2>{productHeading}</h2>
            </div>
            <div className="section-actions">
              <button className="view-all" type="button" onClick={() => setShowAllProducts((v) => !v)}>
                {showAllProducts ? "Show less" : "See more"} <span>&gt;</span>
              </button>
            </div>
          </div>
          <div className="product-grid">
            {visibleProducts.map((product, idx) => (
              <ProductCard product={product} key={product.name} index={idx} />
            ))}
          </div>
        </section>

        <ReviewsSection />

        <div className="section-heading centered">
          <div>
            <p className="eyebrow">Follow Us</p>
            <h2 id="social-circle-title">Join the Pubesto Home Circle</h2>
          </div>
        </div>

        <section className="social-circle-section" aria-labelledby="social-circle-title">
          <span className="social-circle-wave" aria-hidden="true" />
          <div className="social-gallery" role="list">
            {socialGalleryItems.map((item) => (
              <a
                className="social-gallery-card"
                href="https://www.instagram.com/pubesto_in/"
                target="_blank"
                rel="noreferrer"
                role="listitem"
                aria-label={`${item.title} on Instagram`}
                key={item.title}
              >
                <img src={item.image} alt="" />
                <span className="social-gallery-shade" />
                <span className="social-gallery-copy">
                  <strong>{item.title}</strong>
                  <span>{item.caption}</span>
                </span>
              </a>
            ))}
          </div>
        </section>
      </main>
    </>
  );
}

export default function Home() {
  return <HomeContent />;
}
