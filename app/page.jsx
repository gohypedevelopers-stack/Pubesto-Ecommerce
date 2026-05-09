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
import { StoreProvider, useStore } from "../components/StoreContext";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Drawers from "../components/Drawers";
import {
  categories,
  products,
  heroSlides,
  peopleChoiceVideos,
  socialGalleryItems
} from "../lib/data";
import { formatPrice } from "../lib/utils";

function ProductCard({ product, index = 0 }) {
  const { 
    cartItems, addToCart, removeFromCart, getProductId,
    userPhone, setIsLeadModalOpen, setPendingProduct 
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

    if (!userPhone) {
      setPendingProduct(product);
      setIsLeadModalOpen(true);
      return;
    }

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
          {product.photoCount ? <span className="photo-count">{product.photoCount}</span> : null}
        </Link>
        {product.badge ? (
          <span className={`badge ${product.badgeClass || ""}`}>{product.badge}</span>
        ) : null}
        {product.stockBadge ? <span className="stock-badge">{product.stockBadge}</span> : null}
        {!product.stockBadge ? (
          <motion.button
            className={`save-button ${cartQuantity > 0 ? "active" : ""}`}
            type="button"
            onClick={(e) => {
              e.preventDefault();
              if (cartQuantity > 0) {
                handleRemoveFromCart();
              } else {
                handleAddToCart({ openCart: false });
              }
            }}
            whileTap={{ scale: 0.86 }}
            aria-label={cartQuantity > 0 ? `Remove ${product.name} from cart` : `Add ${product.name} to cart`}
          >
            {cartQuantity > 0 ? <Minus /> : <Plus />}
          </motion.button>
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
        <p className="product-detail">{product.detail}</p>
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
  const activeProducts = products.filter((product) => product.inStock !== false && product.image.startsWith('/images/'));
  
  const categoryFilteredProducts = selectedCategory
    ? activeProducts.filter((product) =>
        selectedCategory.name === "Sale"
          ? product.oldPrice
          : product.categories?.includes(selectedCategory.name)
      )
    : activeProducts;

  const filteredProducts = normalizedSearchQuery
    ? categoryFilteredProducts.filter((product) =>
        product.name.toLowerCase().includes(normalizedSearchQuery)
      )
    : categoryFilteredProducts;

  const visibleProducts = showAllProducts ? filteredProducts : filteredProducts.slice(0, 8);

  const productEyebrow = normalizedSearchQuery
    ? `${filteredProducts.length} result${filteredProducts.length === 1 ? "" : "s"} for "${searchQuery.trim()}"`
    : selectedCategory
      ? `Showing ${selectedCategory.count}`
      : "Customer favourites";

  const productHeading = normalizedSearchQuery
    ? "Search results"
    : selectedCategory
      ? `${selectedCategory.label || selectedCategory.name} products`
      : "Featured products";

  return (
    <>
      <Header />
      <Drawers />
      <main>
        <section className="hero-carousel" aria-label="Featured offers">
          <div className="hero-marquee">
            <div className={`hero-track ${heroSlides.length === 1 ? "single-slide" : ""}`}>
              {(heroSlides.length > 1 ? [...heroSlides, heroSlides[0]] : heroSlides).map((slide, index) => {
                const isDuplicateSlide = heroSlides.length > 1 && index === heroSlides.length;
                return (
                  <article className={`hero-slide ${slide.video ? "has-video" : ""}`} aria-hidden={isDuplicateSlide} key={`${slide.title}-${index}`}>
                    {slide.video ? (
                      <video className="hero-bg hero-bg-video" autoPlay muted={!heroSoundOn || isDuplicateSlide} loop playsInline preload="auto" poster={slide.image}>
                        <source src={slide.video} type="video/mp4" />
                      </video>
                    ) : slide.link ? (
                      <Link href={slide.link} className="hero-bg-link">
                        <img className="hero-bg" src={slide.image} alt="" />
                      </Link>
                    ) : (
                      <img className="hero-bg" src={slide.image} alt="" />
                    )}
                    {slide.title && <div className="hero-slide-shade" />}
                    {slide.video && !isDuplicateSlide ? (
                      <button
                        className={`hero-sound-toggle ${heroSoundOn ? "active" : ""}`}
                        type="button"
                        title={heroSoundOn ? "Mute hero video" : "Unmute hero video"}
                        aria-label={heroSoundOn ? "Mute hero video" : "Unmute hero video"}
                        aria-pressed={heroSoundOn}
                        onClick={(event) => {
                          const video = event.currentTarget.parentElement?.querySelector("video");
                          const shouldUnmute = !heroSoundOn;

                          document.querySelectorAll(".video-choice-video").forEach((videoElement) => {
                            videoElement.muted = true;
                          });
                          setActiveSoundVideo(null);

                          if (video) {
                            video.muted = !shouldUnmute;
                            video.volume = 1;
                            if (shouldUnmute) {
                              video.play().catch(() => {});
                            }
                          }

                          setHeroSoundOn(shouldUnmute);
                        }}
                      >
                        {heroSoundOn ? <Volume2 /> : <VolumeX />}
                      </button>
                    ) : null}
                    {slide.title && (
                      <motion.div 
                        className="hero-slide-content glass-card"
                        initial={{ opacity: 0, x: -40 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                      >
                        <p className="eyebrow hero-eyebrow">{slide.eyebrow}</p>
                        {index === 0 ? <h1>{slide.title}</h1> : <h2>{slide.title}</h2>}
                        <p>{slide.copy}</p>
                        {slide.cta && (
                          <div className="hero-actions">
                            <a className="primary-button hero-cta" href={slide.link || "#featured"} tabIndex={isDuplicateSlide ? -1 : undefined}>
                              {slide.cta}
                            </a>
                          </div>
                        )}
                      </motion.div>
                    )}
                    {slide.productImage && (
                      <motion.div 
                        className="hero-floating-badge"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
                      >
                        <div className="hero-badge-inner">
                          <img src={slide.productImage} alt="" />
                          <div className="hero-badge-info">
                            <span className="badge-title">{slide.productName || "Featured Product"}</span>
                            <span className="badge-price">{slide.price} <s className="old-price">{slide.oldPrice}</s></span>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </article>
                );
              })}
            </div>
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
                    <video className="video-choice-video" autoPlay muted={!isSoundOn} loop playsInline preload="auto" poster={item.image}>
                      <source src={item.video} type="video/mp4" />
                    </video>
                    <span className="video-choice-gradient" />
                    <span className="video-choice-product">
                      <span className="video-choice-thumb"><img src={item.thumb} alt="" /></span>
                      <span className="video-choice-copy">
                        <strong>{item.title}</strong>
                        <span>{item.price} {item.oldPrice && <s>{item.oldPrice}</s>}</span>
                      </span>
                    </span>
                  </Link>
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
                      document.querySelectorAll(".hero-bg-video").forEach((videoElement) => {
                        videoElement.muted = true;
                      });
                      document.querySelectorAll(".video-choice-video").forEach((videoElement) => {
                        videoElement.muted = true;
                      });
                      setHeroSoundOn(false);

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
                </article>
              );
            })}
          </div>
        </section>

        <section id="categories" className="category-section">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Shop the range</p>
              <h2>Browse by category</h2>
            </div>
            <button className="view-all" type="button" onClick={() => setShowAllCategories((v) => !v)}>
              {showAllCategories ? "Show less" : "View all"} <span>&gt;</span>
            </button>
          </div>
          <div className={showAllCategories ? "category-grid" : "category-scroll-container"}>
            <motion.div
              className={showAllCategories ? "category-grid-inner" : "category-marquee"}
              animate={showAllCategories ? {} : { x: [0, -50 + "%"] }}
              transition={{ x: { repeat: Infinity, duration: 30, ease: "linear" } }}
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
                  <small>{category.count}</small>
                </button>
              ))}
            </motion.div>
          </div>
        </section>

        <section id="featured" className="product-section">
          <div className="section-heading">
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

        <section className="social-circle-section" aria-labelledby="social-circle-title">
          <span className="social-circle-wave" aria-hidden="true" />
          <span className="social-circle-object" aria-hidden="true">
            <img src="/images/products/new-products/b-07-premium-nice-glass-bottle.svg" alt="" />
          </span>
          <div className="social-circle-heading">
            <h2 id="social-circle-title">Join the Pubesto Home Circle</h2>
            <p>Follow Us</p>
          </div>
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
      <Footer />
    </>
  );
}

export default function Home() {
  return (
    <StoreProvider categories={categories} products={products}>
      <HomeContent />
    </StoreProvider>
  );
}
