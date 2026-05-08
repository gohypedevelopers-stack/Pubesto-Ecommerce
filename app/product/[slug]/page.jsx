"use client";

import { useStore, StoreProvider } from "../../../components/StoreContext";
import { products, categories } from "../../../lib/data";
import Header from "../../../components/Header";
import Footer from "../../../components/Footer";
import Drawers from "../../../components/Drawers";
import { useParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag, ChevronDown, Check, Plus, ArrowRight } from "lucide-react";
import { useState } from "react";
import Link from "next/link";

function ProductPageContent() {
  const { slug } = useParams();
  const { addToCart, cartItems, getProductId } = useStore();
  const [activeTab, setActiveTab] = useState("specifications");
  const [addEffectKey, setAddEffectKey] = useState(null);

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
    const nextKey = Date.now();
    setAddEffectKey(nextKey);
    window.setTimeout(() => {
      setAddEffectKey((currentKey) => (currentKey === nextKey ? null : currentKey));
    }, 1050);
    addToCart(product, options);
  }

  // Related products (Curated Companions)
  const relatedProducts = products
    .filter((p) => p.slug !== product.slug)
    .slice(0, 2);

  return (
    <main className="product-details-page">
      <div className="product-hero-container">
        <div className="product-gallery">
          <motion.div 
            className="main-image"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          >
            <img src={product.image} alt={product.name} />
          </motion.div>
        </div>

        <div className="product-info-panel">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
          >
            <p className="eyebrow">{product.detail || "Artisanal Collection"}</p>
            <h1 className="product-title">{product.name}</h1>
            <div className="price-tag">
              <span className="current-price">{product.price}</span>
              {product.oldPrice && <span className="old-price">{product.oldPrice}</span>}
            </div>

            <div className="product-description">
              <p>
                {product.description || "A masterclass in functional artistry. This daily-carry essential merges traditional handcrafted techniques with modern thermal insulation, keeping contents perfectly tempered."}
              </p>
            </div>

            <div className="purchase-actions">
              <button 
                className={`primary-button buy-button ${product.inStock === false ? 'disabled' : ''}`}
                onClick={() => handleAddToCart()}
                disabled={product.inStock === false}
              >
                {product.inStock === false ? "Out of Stock" : "ADD TO CART"}
              </button>
              <button 
                className={`secondary-button buy-now-button ${product.inStock === false ? 'disabled' : ''}`}
                onClick={() => handleAddToCart({ openCart: true })}
                disabled={product.inStock === false}
              >
                BUY NOW
              </button>
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
          </motion.div>
        </div>
      </div>

      <motion.section 
        className="craft-section"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="craft-container">
          <div className="craft-content">
            <p className="eyebrow">The Craft</p>
            <h2>Handmade Perfection</h2>
            <p>
              Utilizing techniques passed down through generations, master craftspeople painstakingly shape each vessel. 
              The mesmerizing texture interacts beautifully with light, embodying the essence of artisanal design.
            </p>
          </div>
          <div className="craft-media">
            <img src="https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?auto=format&fit=crop&w=1200&q=80" alt="Artisan craftsmanship" />
          </div>
        </div>
      </motion.section>

      <motion.section 
        className="curated-companions"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1 }}
      >
        <div className="section-heading centered">
          <h2>Curated Companions</h2>
        </div>
        <div className="companions-grid">
          {relatedProducts.map((p, i) => (
            <motion.div
              key={p.slug}
              initial={{ opacity: 0, y: 20 }}
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
                  <p>{p.price}</p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </motion.section>
    </main>
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
