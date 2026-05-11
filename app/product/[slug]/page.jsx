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
  const [activeTab, setActiveTab] = useState("specs");
  const [addEffectKey, setAddEffectKey] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState(null);
  const [activeImage, setActiveImage] = useState(null);

  useEffect(() => {
    // Force scroll to top with a slight delay to ensure content is ready
    const timer = setTimeout(() => {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    }, 10);
    
    // Initialize product states
    const product = products.find((p) => p.slug === slug);
    if (product) {
      setActiveImage(product.image);
      if (product.colors && product.colors.length > 0) {
        setSelectedColor(product.colors[0]);
      }
    }
    
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

  function handleAddToCart() {
    if (product.inStock === false) return;
    
    // Check if we need to show the lead modal
    if (!userPhone) {
      setPendingProduct({ 
        product, 
        options: { color: selectedColor?.name, quantity: quantity } 
      });
      setIsLeadModalOpen(true);
      return;
    }

    const nextKey = Date.now();
    setAddEffectKey(nextKey);
    window.setTimeout(() => {
      setAddEffectKey((currentKey) => (currentKey === nextKey ? null : currentKey));
    }, 1050);

    // Pass the selected options and quantity
    addToCart(product, { 
      color: selectedColor?.name,
      quantity: quantity 
    });
  }

  function adjustQuantity(amount) {
    setQuantity(prev => Math.max(1, prev + amount));
  }

  // Related products (Curated Companions) - Only showing real products with local images
  const relatedProducts = products
    .filter((p) => p.slug !== product.slug && p.image.startsWith('/images/'))
    .slice(0, 4);

  return (
    <motion.main 
      className="product-details-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="product-breadcrumb">
        <Link href="/">Home</Link> / <Link href="/shop">Shop</Link> / <span>{product.name}</span>
      </div>
      <div className="product-hero-container">
        <div className="product-gallery">
          <div className="main-image-wrapper">
            <motion.div 
              className="main-image"
              key={activeImage}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="image-glow" />
              <img src={activeImage || product.image} alt={product.name} />
              {product.badge && <span className={`product-status-badge ${product.badgeClass}`}>{product.badge}</span>}
            </motion.div>
          </div>
          
          {product.gallery && product.gallery.length > 1 && (
            <div className="thumbnail-strip">
              {product.gallery.map((img, idx) => (
                <div 
                  key={idx} 
                  className={`thumb-item ${activeImage === img ? 'active' : ''}`}
                  onClick={() => setActiveImage(img)}
                >
                  <img src={img} alt="thumbnail" />
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="product-info-panel">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="product-header-meta">
              <div className="star-rating">
                {[...Array(5)].map((_, i) => (
                  <Check key={i} size={14} className={i < Math.floor(product.rating || 5) ? "star-active" : "star-inactive"} />
                ))}
                <span>({product.reviews || 0} reviews)</span>
              </div>
              <p className="sku-id">SKU: {product.sku}</p>
            </div>

            <h1 className="product-title bold-title">{product.name}</h1>
            
            <div className="price-display-v2">
              <span className="current-price">{product.price}</span>
              {product.oldPrice && <span className="old-price">{product.oldPrice}</span>}
              <span className="discount-tag">SAVE Rs. {(product.originalPrice || 0) - (product.salePrice || 0)}</span>
            </div>

            <p className="product-short-desc">
              {product.description}
            </p>

            {product.colors && (
              <div className="variant-selector">
                <p className="variant-label">Select Color: <span>{selectedColor?.name || product.colors[0].name}</span></p>
                <div className="color-options">
                  {product.colors.map((color, i) => (
                    <button 
                      key={i} 
                      className={`color-bubble ${selectedColor?.name === color.name ? 'active' : ''}`}
                      style={{ backgroundColor: color.hex }}
                      title={color.name}
                      onClick={() => {
                        setSelectedColor(color);
                        if (color.image) setActiveImage(color.image);
                      }}
                    />
                  ))}
                </div>
              </div>
            )}

            <div className="product-highlights-v2">
              <h4>Key Highlights</h4>
              <ul>
                {(product.highlights || ["Premium Quality", "Artisanal Design", "Durability Guaranteed"]).map((h, i) => (
                  <li key={i}><Check size={16} /> {h}</li>
                ))}
              </ul>
            </div>

            <div className="purchase-actions-v2">
              <div className="qty-wrap">
                <button onClick={() => adjustQuantity(-1)}><Minus size={16} /></button>
                <input type="number" value={quantity} readOnly />
                <button onClick={() => adjustQuantity(1)}><Plus size={16} /></button>
              </div>
              <button 
                className="add-to-cart-btn"
                onClick={() => handleAddToCart()}
              >
                <ShoppingBag size={20} />
                ADD TO CART
              </button>
            </div>

            <div className="trust-badges-strip">
              <div className="trust-item">
                <ShieldCheck size={20} />
                <span>1 Year Warranty</span>
              </div>
              <div className="trust-item">
                <ArrowRight size={20} />
                <span>7 Day Returns</span>
              </div>
              <div className="trust-item">
                <Check size={20} />
                <span>Free Delivery</span>
              </div>
            </div>

            <div className="details-accordion-v2">
              <div className="acc-item">
                <button className="acc-trigger" onClick={() => setActiveTab(activeTab === 'specs' ? '' : 'specs')}>
                  Technical Specifications
                  <Plus size={18} className={activeTab === 'specs' ? 'rotate' : ''} />
                </button>
                <AnimatePresence>
                  {activeTab === 'specs' && (
                    <motion.div 
                      className="acc-body"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                    >
                      <div className="specs-table">
                        {Object.entries(product.specifications || {}).map(([k, v], i) => (
                          <div key={i} className="spec-row-v2">
                            <span className="spec-key">{k}</span>
                            <span className="spec-val">{v}</span>
                          </div>
                        ))}
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
