"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ShoppingBag,
  Sparkles,
  Plus,
  Check
} from "lucide-react";
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
  const { cartItems, addToCart, getProductId } = useStore();
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

  return (
    <motion.article
      className="product-card"
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: index * 0.04 }}
      viewport={{ once: true, margin: "-50px" }}
    >
      <div className="product-media">
        <a className="product-media-link" href="#featured" aria-label={`View ${product.name}`}>
          <img src={product.image} alt={product.name} />
          {product.photoCount ? <span className="photo-count">{product.photoCount}</span> : null}
        </a>
        {product.badge ? (
          <span className={`badge ${product.badgeClass || ""}`}>{product.badge}</span>
        ) : null}
        {product.stockBadge ? <span className="stock-badge">{product.stockBadge}</span> : null}
        {!product.stockBadge ? (
          <motion.button
            className={`save-button ${cartQuantity > 0 ? "active" : ""}`}
            type="button"
            onClick={() => handleAddToCart({ openCart: false })}
            whileTap={{ scale: 0.86 }}
            aria-label={`Add ${product.name} to cart`}
          >
            {cartQuantity > 0 ? <Check /> : <Plus />}
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
        <h3>{product.name}</h3>
        <p className="price">
          {product.price}
          {product.oldPrice ? <span>{product.oldPrice}</span> : null}
        </p>
        <button
          className="quick-add"
          type="button"
          onClick={() => handleAddToCart()}
          disabled={product.inStock === false}
        >
          {product.inStock === false ? "Out of Stock" : cartQuantity > 0 ? `Added (${cartQuantity})` : "Add to Cart"}
        </button>
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

  const normalizedSearchQuery = searchQuery.trim().toLowerCase();
  const activeProducts = products.filter((product) => product.inStock !== false);
  
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

  const visibleProducts = filteredProducts;

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
            <div className="hero-track">
              {[...heroSlides, heroSlides[0]].map((slide, index) => {
                const isDuplicateSlide = index === heroSlides.length;
                return (
                  <article className="hero-slide" aria-hidden={isDuplicateSlide} key={`${slide.title}-${index}`}>
                    <img className="hero-bg" src={slide.image} alt="" />
                    <div className="hero-slide-shade" />
                    <div className="hero-slide-content">
                      <p className="eyebrow hero-eyebrow">{slide.eyebrow}</p>
                      {index === 0 ? <h1>{slide.title}</h1> : <h2>{slide.title}</h2>}
                      <p>{slide.copy}</p>
                      <a className="primary-button hero-cta" href="#featured" tabIndex={isDuplicateSlide ? -1 : undefined}>
                        {slide.cta}
                      </a>
                    </div>
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
            {peopleChoiceVideos.map((item) => (
              <a className="video-choice-card" href="#featured" role="listitem" key={item.title}>
                <video className="video-choice-video" autoPlay muted loop playsInline preload="metadata" poster={item.image}>
                  <source src={item.video} type="video/mp4" />
                </video>
                <span className="video-choice-gradient" />
                <span className="video-choice-product">
                  <span className="video-choice-thumb"><img src={item.thumb} alt="" /></span>
                  <span className="video-choice-copy">
                    <strong>{item.title}</strong>
                    <span>{item.price} <s>{item.oldPrice}</s></span>
                  </span>
                </span>
              </a>
            ))}
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
