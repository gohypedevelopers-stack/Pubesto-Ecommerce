"use client";

import { useStore, StoreProvider } from "../../../components/StoreContext";
import { products, categories } from "../../../lib/data";
import Header from "../../../components/Header";
import Footer from "../../../components/Footer";
import Drawers from "../../../components/Drawers";
import { useParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag, ChevronDown, Check, Plus, Minus, ArrowRight, ShieldCheck, Sparkles } from "lucide-react";
import { useState, useEffect } from "react";
import Link from "next/link";

function ProductPageContent() {
  const { slug } = useParams();
  const { 
    addToCart, cartItems, getProductId,
    isLeadModalOpen, setIsLeadModalOpen,
    pendingProduct, setPendingProduct,
    userPhone
  } = useStore();
  const [activeTab, setActiveTab] = useState("specifications");
  const [addEffectKey, setAddEffectKey] = useState(null);

  useEffect(() => {
    // Force scroll to top with a slight delay to ensure content is ready
    const timer = setTimeout(() => {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    }, 10);
    return () => clearTimeout(timer);
  }, [slug]);

  const product = products.find((p) => p.slug === slug);

  if (!product) {
    return (
      <div className="error-page">
        <h1>Product not found</h1>
        <Link href="/">Return to Home</Link>
      </div>
    );
  }

  const cartQuantity = cartItems.find((item) => item.id === getProductId(product))?.quantity || 0;

  function handleAddToCart(options) {
    if (product.inStock === false) return;
    
    // Check if we need to show the lead modal
    if (!userPhone) {
      setPendingProduct(product);
      setIsLeadModalOpen(true);
      return;
    }

    const nextKey = Date.now();
    setAddEffectKey(nextKey);
    window.setTimeout(() => {
      setAddEffectKey((currentKey) => (currentKey === nextKey ? null : currentKey));
    }, 1050);
    addToCart(product, options);
  }

  // Related products (Curated Companions) - Only showing real products with local images
  const relatedProducts = products
    .filter((p) => p.slug !== product.slug && p.image.startsWith('/images/'))
    .slice(0, 4);

  return (
    <motion.main 
      className="product-details-page"
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="product-hero-container">
        <div className="product-gallery">
          {product.gallery ? (
            product.gallery.map((img, idx) => (
              <motion.div 
                className="main-image"
                key={idx}
                initial={{ opacity: 0, y: -30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 1, delay: idx * 0.1 }}
              >
                <img src={img} alt={`${product.name} - View ${idx + 1}`} />
              </motion.div>
            ))
          ) : (
            <motion.div 
              className="main-image"
              initial={{ opacity: 0, y: -30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="image-glow" />
              <img src={product.image} alt={product.name} />
            </motion.div>
          )}
        </div>

        <div className="product-info-panel">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
          >
            <div className="functional-price-table">
              <div className="price-row">
                <span>Price</span>
                <span>: {product.oldPrice || product.price}</span>
              </div>
              <div className="price-row highlight">
                <span>Discounted price</span>
                <span>: {product.price}</span>
              </div>
              <div className="price-row savings">
                <span>You save</span>
                <span>: Rs. {(product.originalPrice || 0) - (product.salePrice || 0)} ({product.discountPercent || "20% off"})</span>
              </div>
              <div className="moq-tag">
                MOQ: {product.moq || 2}
              </div>
            </div>

            <h1 className="product-title bold-title">{product.name}</h1>
            <p className="sku-tag">SKU : {product.sku || "JA-CC0000"}</p>

            <div className="product-description">
              <p>
                {product.description || "A masterclass in functional artistry. This daily-carry essential merges traditional handcrafted techniques with modern thermal insulation, keeping contents perfectly tempered."}
              </p>
            </div>

            <div className="purchase-actions">
              {product.inStock === false ? (
                <button className="primary-button buy-button disabled" disabled>Out of Stock</button>
              ) : cartQuantity > 0 ? (
                <div className="product-page-quantity-selector">
                  <button 
                    type="button" 
                    onClick={() => updateCartQuantity(getProductId(product), cartQuantity - 1)}
                    aria-label="Decrease quantity"
                  >
                    <Minus size={20} />
                  </button>
                  <span className="quantity-display">{cartQuantity}</span>
                  <button 
                    type="button" 
                    onClick={() => updateCartQuantity(getProductId(product), cartQuantity + 1)}
                    aria-label="Increase quantity"
                  >
                    <Plus size={20} />
                  </button>
                </div>
              ) : (
                <button 
                  className="primary-button buy-button"
                  onClick={() => handleAddToCart()}
                >
                  ADD TO CART
                </button>
              )}
            </div>

            <div className="product-extra-info">
              <div className="info-accordion">
                <button className="accordion-trigger" onClick={() => setActiveTab(activeTab === 'specifications' ? '' : 'specifications')}>
                  Specifications <ChevronDown className={activeTab === 'specifications' ? 'rotate' : ''} />
                </button>
                <AnimatePresence>
                  {activeTab === 'specifications' && (
                    <motion.div 
                      className="accordion-content"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                    >
                      <div className="spec-row">
                        <span>Material</span>
                        <span>Pure Copper / Artisanal Wood</span>
                      </div>
                      <div className="spec-row">
                        <span>Capacity</span>
                        <span>1000ml / Standard</span>
                      </div>
                      <div className="spec-row">
                        <span>Care</span>
                        <span>Hand wash only</span>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            <div className="product-features-grid">
              <div className="feature-item">
                <div className="feature-icon"><Sparkles size={18} /></div>
                <span>Premium Quality</span>
              </div>
              <div className="feature-item">
                <div className="feature-icon"><Check size={18} /></div>
                <span>Leak Proof</span>
              </div>
              <div className="feature-item">
                <div className="feature-icon"><ShieldCheck size={18} /></div>
                <span>BPA Free</span>
              </div>
            </div>
          </motion.div>
      </div>
    </div>

    <motion.section 
      className="curated-companions"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1 }}
      >
        <div className="section-heading centered">
          <p className="eyebrow">Discover More</p>
          <h2>Curated Companions</h2>
        </div>
        <div className="companions-grid">
          {relatedProducts.map((p, i) => (
            <motion.div
              key={p.slug}
              initial={{ opacity: 0, y: -20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
            >
              <Link href={`/product/${p.slug}`} className="companion-card">
                <div className="companion-media">
                  <img src={p.image} alt={p.name} />
                </div>
                <div className="companion-body">
                  <h3>{p.name}</h3>
                  <p className="price">{p.price}</p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </motion.section>
    </motion.main>
  );
}

export default function ProductPage() {
  return (
    <StoreProvider categories={categories} products={products}>
      <Header />
      <Drawers />
      <ProductPageContent />
      <Footer />
    </StoreProvider>
  );
}
