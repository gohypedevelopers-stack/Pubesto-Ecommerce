"use client";

import { useParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag, ChevronDown, Check, Plus, Minus, ArrowRight, ShieldCheck, Sparkles, ChevronRight, CheckSquare, Tag, Undo2, Volume2, VolumeX } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useStore } from "../../../components/StoreContext";
import { peopleChoiceVideos } from "../../../lib/data";
import { getShopifyCheckoutUrl } from "../../../lib/shopify";

function ProductPageContent() {
  const { slug } = useParams();
  const { 
    addToCart, cartItems, getProductId, products, updateCartQuantity, checkout
  } = useStore();
  const [activeTab, setActiveTab] = useState("specs");
  const [addEffectKey, setAddEffectKey] = useState(null);
  const [quantity, setQuantity] = useState(2);
  const [selectedColor, setSelectedColor] = useState(null);
  const [activeImage, setActiveImage] = useState(null);
  const [videoSoundOn, setVideoSoundOn] = useState(false);
  const [isBuyingNow, setIsBuyingNow] = useState(false);
  const reviewTrackRef = useRef(null);

  useEffect(() => {
    // Force scroll to top with a slight delay to ensure content is ready
    const timer = setTimeout(() => {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    }, 10);
    
    // Initialize product states
    const product = products.find((p) => 
      p.slug === slug || 
      p.shopifyHandle === slug || 
      (p.slug && p.slug.toLowerCase().includes(slug.toLowerCase()))
    );
    if (product) {
      setActiveImage(product.image);
      if (product.colors && product.colors.length > 0) {
        setSelectedColor(product.colors[0]);
        if (product.colors[0].image) {
          setActiveImage(product.colors[0].image);
        }
      } else {
        setSelectedColor(null);
      }
    }
    
    return () => clearTimeout(timer);
  }, [slug, products]);

  const product = products.find((p) => 
    p.slug === slug || 
    p.shopifyHandle === slug || 
    (p.slug && p.slug.toLowerCase().includes(slug.toLowerCase()))
  );

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

  async function handleBuyNow() {
    if (product.inStock === false || isBuyingNow) return;

    const shopifyHandle = product.shopifyHandle || product.slug;
    setIsBuyingNow(true);

    try {
      const checkoutUrl = await getShopifyCheckoutUrl(shopifyHandle, quantity);
      window.location.href = checkoutUrl;
    } catch (err) {
      console.warn("Shopify checkout unavailable, falling back to Razorpay:", err.message);
      const selectedBundle = bundles.find(b => b.id === quantity) || bundles[0];
      addToCart(product, {
        color: selectedColor?.name,
        quantity: quantity,
        openCart: false
      });
      checkout({
        items: [{ id: getProductId(product), product, quantity }],
        amount: selectedBundle.price
      });
    } finally {
      setIsBuyingNow(false);
    }
  }

  function adjustQuantity(amount) {
    setQuantity(prev => Math.max(1, prev + amount));
  }

  // Related products (Curated Companions) - prioritizing same category
  const relatedProducts = products
    .filter((p) => p.slug !== product.slug && p.image)
    .sort((a, b) => {
      const aSameCat = a.categories?.some(cat => product.categories?.includes(cat));
      const bSameCat = b.categories?.some(cat => product.categories?.includes(cat));
      if (aSameCat && !bSameCat) return -1;
      if (!aSameCat && bSameCat) return 1;
      return 0;
    })
    .slice(0, 4);

  const parsePrice = (priceStr) => {
    const num = Number((priceStr || '').replace(/[^\d.]/g, ''));
    return isNaN(num) || num === 0 ? null : num;
  };

  const basePrice = product.salePrice || parsePrice(product.price) || 599;
  const baseOldPrice = product.originalPrice || parsePrice(product.oldPrice) || Math.round(basePrice * 1.35);
  const productHighlights = Array.isArray(product.highlights) && product.highlights.filter(Boolean).length > 0
    ? product.highlights.filter(Boolean)
    : ["Premium Quality", "Artisanal Design", "Durability Guaranteed"];

  const bundles = [
    { 
      id: 1, 
      title: 'Single', 
      badge: '25% off',
      subtext: 'Additional Prepaid Discount', 
      price: basePrice, 
      oldPrice: baseOldPrice 
    },
    { 
      id: 2, 
      title: 'Pack of 2', 
      badgeLabel: `Save ₹${(baseOldPrice * 2) - Math.floor(basePrice * 1.417)}`,
      subtext: 'Free Priority Shipping', 
      price: Math.floor(basePrice * 1.417), 
      oldPrice: baseOldPrice * 2,
      topBadge: 'MOST POPULAR'
    },
    { 
      id: 4, 
      title: 'Pack of 4', 
      badgeLabel: `Save ₹${(baseOldPrice * 4) - Math.floor(basePrice * 3.003)}`,
      subtext: 'Free Priority Shipping', 
      price: Math.floor(basePrice * 3.003), 
      oldPrice: baseOldPrice * 4,
      topBadge: 'LOWEST PRICE EVER!'
    }
  ];

  return (
    <motion.main 
      className="product-details-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
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


            <h1 className="product-title bold-title">{product.name}</h1>


            
            <div className="price-display-v2">
              <span className="current-price">{product.price}</span>
              {product.oldPrice && <span className="old-price">{product.oldPrice}</span>}
              {(() => {
                const savings = (product.originalPrice || Number((product.oldPrice || '').replace(/[^\d.]/g, '')) || 0) 
                              - (product.salePrice || Number((product.price || '').replace(/[^\d.]/g, '')) || 0);
                return savings > 0 ? <span className="discount-tag">SAVE Rs. {savings}</span> : null;
              })()}
            </div>

            <p className="product-short-desc">
              {product.description}
            </p>

            {product.colors && product.colors.length > 0 && (
              <div className="variant-selector">
                <p className="variant-label">Select Color: <span>{selectedColor?.name || product.colors[0]?.name}</span></p>
                <div className="color-options">
                  {product.colors.map((color, i) => {
                    const isActive = selectedColor ? selectedColor.name === color.name : i === 0;
                    return (
                      <button 
                        key={i} 
                        className={`color-bubble ${isActive ? 'active' : ''}`}
                        style={{ backgroundColor: color.hex }}
                        title={color.name}
                        onClick={() => {
                          setSelectedColor(color);
                          if (color.image) {
                            setActiveImage(color.image);
                          }
                        }}
                      />
                    );
                  })}
                </div>
              </div>
            )}

            <div className="product-highlights-v2">
              <h4>Key Highlights</h4>
              <div className="highlights-chips">
                {productHighlights.map((h, i) => (
                  <span key={i} className="highlight-chip">{h}</span>
                ))}
              </div>
            </div>

            <div className="marketing-banners">
              <div className="banner-green">extra discount + FREE GIFT on prepaid orders!</div>
              <div className="banner-text">🎇 SUMMER SALE- BEST PRICE GUARENTEED!</div>
            </div>

            <div className="units-sold-ticker">
              <div className="pulsing-dot"></div>
              <span><strong>1100 + units sold</strong> in the last 24 hours</span>
            </div>

            <div className="bundle-separator">
              <span>BUNDLE & SAVE</span>
            </div>

            <div className="bundle-options">
              {bundles.map((b) => (
                <div 
                  key={b.id} 
                  className={`bundle-option ${quantity === b.id ? 'selected' : ''}`}
                  onClick={() => setQuantity(b.id)}
                >
                  {b.topBadge && <div className="bundle-top-badge">{b.topBadge}</div>}
                  <div className="bundle-radio">
                    <div className={`radio-outer ${quantity === b.id ? 'active' : ''}`}>
                      {quantity === b.id && <div className="radio-inner" />}
                    </div>
                  </div>
                  <div className="bundle-details">
                    <div className="bundle-title-row">
                      <span className="bundle-title">{b.title}</span>
                      {b.badge && <span className="bundle-badge">{b.badge}</span>}
                      {b.badgeLabel && <span className="bundle-badge">{b.badgeLabel}</span>}
                    </div>
                    <div className="bundle-subtext">{b.subtext}</div>
                  </div>
                  <div className="bundle-pricing">
                    <div className="bundle-price">Rs. {b.price}</div>
                    <div className="bundle-old-price">Rs. {b.oldPrice}</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="purchase-actions-v2 product-buy-actions">
              <button 
                className="block-btn"
                type="button"
                onClick={() => handleAddToCart()}
              >
                <ShoppingBag size={18} strokeWidth={2.2} />
                <span>Add to cart</span>
              </button>

              <button 
                className={`buy-now-btn ${isBuyingNow ? 'loading' : ''}`} 
                type="button"
                onClick={() => handleBuyNow()}
                disabled={isBuyingNow}
              >
                <span className="buy-text">{isBuyingNow ? 'Redirecting...' : 'BUY NOW'}</span>
                {!isBuyingNow && (
                  <div className="buy-icons-pill">
                     <div className="payment-circle gpay">G</div>
                     <div className="payment-circle phonepe">Pe</div>
                     <div className="payment-circle paytm">pay</div>
                  </div>
                )}
                {isBuyingNow ? (
                  <div className="buy-now-spinner" />
                ) : (
                  <ChevronRight size={20} />
                )}
              </button>
            </div>



            <div className="trust-features-grid">
              <div className="trust-feature">
                <div className="tf-icon"><CheckSquare size={32} strokeWidth={1.2} /></div>
                <span>COD<br/>Available</span>
              </div>
              <div className="trust-feature">
                <div className="tf-icon"><Tag size={32} strokeWidth={1.2} /></div>
                <span>EXTRA<br/>SAVINGS on<br/>PREPAID</span>
              </div>
              <div className="trust-feature">
                <div className="tf-icon"><Undo2 size={32} strokeWidth={1.2} /></div>
                <span>7-Day Worry<br/>Free Returns</span>
              </div>
            </div>

            {product.specifications && Object.keys(product.specifications).length > 0 && (
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
                        {Object.entries(product.specifications).map(([k, v], i) => (
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
            )}
          </motion.div>
      </div>
    </div>

    {/* Product Video Section */}
    {(() => {
      const productVideo = peopleChoiceVideos.find(v => v.slug === slug);
      if (!productVideo || !productVideo.video) return null;

      return (
        <section className="product-video-section">
          <div className="section-heading centered">
            <p className="eyebrow">Product in action</p>
            <h2>See it for yourself</h2>
          </div>
          <div className="product-video-container">
            <video 
              className="product-detail-video" 
              autoPlay 
              muted={!videoSoundOn} 
              loop 
              playsInline 
              preload="auto"
            >
              <source src={productVideo.video} type="video/mp4" />
            </video>
            <button
              className={`product-video-sound ${videoSoundOn ? "is-active" : ""}`}
              type="button"
              onClick={() => setVideoSoundOn(!videoSoundOn)}
              title={videoSoundOn ? "Mute video" : "Unmute video"}
            >
              {videoSoundOn ? <Volume2 size={24} /> : <VolumeX size={24} />}
            </button>
            <div className="video-overlay-gradient" />
          </div>
        </section>
      );
    })()}

    {/* Customer Reviews Section */}
    <section className="customer-reviews-section">
      <div className="reviews-header">
        <p className="eyebrow" style={{ textAlign: 'center', marginBottom: '8px' }}>Trusted by thousands</p>
        <div className="loved-badge" style={{ margin: '0 auto 12px', width: 'fit-content' }}>
          💖 Loved by {product.reviews ? Number(product.reviews) * 127 : '10,000'}+ Customers
        </div>
        <h2>What Our Customers Say</h2>
        <div className="reviews-meta">
          <span className="stars-display">{'★'.repeat(Math.round(Number(product.rating || 5)))}</span>
          <span className="rating-text">{product.rating || '5.0'} ★ ({product.reviews || '0'})</span>
          <span className="verified-badge">
             <Check size={14} strokeWidth={3} /> Verified
          </span>
        </div>
      </div>
      <div className="reviews-carousel">
        <button className="review-nav review-prev" onClick={() => { if (reviewTrackRef.current) reviewTrackRef.current.scrollBy({ left: -344, behavior: 'smooth' }); }}>‹</button>
        <div className="reviews-track" ref={reviewTrackRef}>
          {(product.reviewsList || [
            { text: "Absolutely love the quality! It fits perfectly in my bag and doesn't leak at all. Highly recommend.", name: "Kavya Reddy" },
            { text: "Perfect for daily use. The design is so unique and I get compliments every time I use it.", name: "Vivek Gulati" },
            { text: "The finish is premium and durable. Even after months of use, it still looks brand new.", name: "Sunita Patil" },
            { text: "Exceeded my expectations! Shipping was fast and the packaging was very secure.", name: "Srinivas Murthy" }
          ]).map((review, i) => (
            <div className="review-card" key={i}>
              <div className="review-stars">{'★'.repeat(Math.round(Number(product.rating || 5)))}</div>
              <p className="review-text">"{review.text}"</p>
              <div className="reviewer-info">
                <div className="reviewer-avatar">
                  {review.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div className="reviewer-details">
                  <h4>{review.name}</h4>
                  <p>Verified Buyer</p>
                </div>
                <div className="verified-tag">
                  <ShieldCheck size={18} fill="rgba(27, 98, 75, 0.1)" />
                </div>
              </div>
            </div>
          ))}
        </div>
        <button className="review-nav review-next" onClick={() => { if (reviewTrackRef.current) reviewTrackRef.current.scrollBy({ left: 344, behavior: 'smooth' }); }}>›</button>
      </div>
    </section>

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
          {relatedProducts.map((p, i) => {
            const pCartQty = cartItems.find((item) => item.id === getProductId(p))?.quantity || 0;
            return (
              <motion.article
                className="product-card"
                key={p.slug}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                <div className="product-media">
                  <Link className="product-media-link" href={`/product/${p.slug}`} aria-label={`View ${p.name}`}>
                    <img src={p.image} alt={p.name} />
                  </Link>
                  {p.badge ? (
                    <span className={`badge ${p.badgeClass || ""}`}>{p.badge}</span>
                  ) : null}
                </div>
                <div className="product-body">
                  <Link href={`/product/${p.slug}`}>
                    <h3>{p.name}</h3>
                  </Link>
                  <p className="price">
                    {p.price}
                    {p.oldPrice ? <span>{p.oldPrice}</span> : null}
                  </p>
                  {p.inStock === false ? (
                    <button className="quick-add disabled" disabled>Out of Stock</button>
                  ) : pCartQty > 0 ? (
                    <div className="product-quantity-selector">
                      <button 
                        type="button" 
                        onClick={() => updateCartQuantity(getProductId(p), pCartQty - 1)}
                        aria-label="Decrease quantity"
                      >
                        <Minus size={16} />
                      </button>
                      <span>{pCartQty}</span>
                      <button 
                        type="button" 
                        onClick={() => updateCartQuantity(getProductId(p), pCartQty + 1)}
                        aria-label="Increase quantity"
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                  ) : (
                    <button
                      className="quick-add"
                      type="button"
                      onClick={() => addToCart(p)}
                    >
                      Add to Cart
                    </button>
                  )}
                </div>
              </motion.article>
            );
          })}
        </div>
      </motion.section>
    </motion.main>
  );
}

export default function ProductPage() {
  return <ProductPageContent />;
}
