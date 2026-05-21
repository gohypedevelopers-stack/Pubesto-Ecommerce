"use client";

import { useParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag, ChevronDown, Check, Plus, Minus, ArrowRight, ShieldCheck, Sparkles, ChevronRight, CheckSquare, Tag, Undo2, Volume2, VolumeX, X } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useStore } from "../../../components/StoreContext";
import { peopleChoiceVideos } from "../../../lib/data";
import { getShopifyCheckoutUrl } from "../../../lib/shopify";

const INDIAN_NAMES = [
  "Rahul", "Kavya", "Vivek", "Sunita", "Srinivas", "Priya", "Amit", "Riya", 
  "Deepa", "Harish", "Ananya", "Vikram", "Sneha", "Rohan", "Pooja", "Arjun", 
  "Karan", "Neha", "Aditya", "Manish", "Shikha", "Aman", "Rajesh", "Meera", 
  "Suresh", "Divya", "Sanjay", "Komal", "Abhishek", "Preeti"
];

const INDIAN_CITIES = [
  "Mumbai", "Delhi", "Bangalore", "Pune", "Hyderabad", "Chennai", "Kolkata", 
  "Ahmedabad", "Gurgaon", "Noida", "Jaipur", "Lucknow", "Chandigarh", "Surat", 
  "Kochi", "Indore", "Patna", "Bhopal", "Visakhapatnam", "Coimbatore"
];

const getDeterministicSales = (prod) => {
  if (!prod) return 1100;
  const hash = (prod.slug || prod.name || "").split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return 850 + (hash % 650); // Generates between 850 and 1500
};

const getDeterministicStock = (prod, colorName) => {
  if (!prod) return 8;
  const key = (prod.slug || "") + (colorName || "");
  const hash = key.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return 5 + (hash % 10); // Generates between 5 and 14
};

function ProductPageContent() {
  const { slug } = useParams();
  const { 
    addToCart, cartItems, getProductId, getProductPrice, products, updateCartQuantity, checkout, setIsCartOpen
  } = useStore();
  const [activeTab, setActiveTab] = useState("specs");
  const [addEffectKey, setAddEffectKey] = useState(null);
  const [quantity, setQuantity] = useState(2);
  const [selectedColor, setSelectedColor] = useState(null);
  const [activeImage, setActiveImage] = useState(null);
  const [videoSoundOn, setVideoSoundOn] = useState(false);
  const [isBuyingNow, setIsBuyingNow] = useState(false);
  const [selectedBundleItems, setSelectedBundleItems] = useState({});
  const [bundleInitialized, setBundleInitialized] = useState(false);
  const reviewTrackRef = useRef(null);

  // Bundle Customization Popup State
  const [isBundlePopupOpen, setIsBundlePopupOpen] = useState(false);
  const [popupBundleSize, setPopupBundleSize] = useState(2);
  const [popupColors, setPopupColors] = useState([]);
  const [popupQuantity, setPopupQuantity] = useState(1);

  // Dynamic ticker states
  const [unitsSold, setUnitsSold] = useState(1100);
  const [stockCount, setStockCount] = useState(8);
  const [activeViewers, setActiveViewers] = useState(24);
  const [tickerIndex, setTickerIndex] = useState(0);
  const [lastBuyer, setLastBuyer] = useState({ name: "Rahul", city: "Mumbai", qty: 2 });

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

  // Initialize bundle selections when product loads
  useEffect(() => {
    if (product && product.bundleProducts && product.bundleProducts.length > 0 && !bundleInitialized) {
      const initialSelections = {};
      // Current product is always selected
      initialSelections['__current__'] = true;
      product.bundleProducts.forEach((bp) => {
        initialSelections[bp.id] = true;
      });
      setSelectedBundleItems(initialSelections);
      setBundleInitialized(true);
    }
  }, [product, bundleInitialized]);

  // Initialize and update ticker data based on product
  useEffect(() => {
    if (product) {
      const sales = getDeterministicSales(product);
      setUnitsSold(sales);
      
      const hash = (product.slug || "").split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
      setActiveViewers(12 + (hash % 20));
      
      const initialColor = product.colors && product.colors.length > 0 ? product.colors[0].name : "";
      setStockCount(getDeterministicStock(product, initialColor));
    }
  }, [product]);

  // Update variant stock levels when color is changed
  useEffect(() => {
    if (product && selectedColor) {
      setStockCount(getDeterministicStock(product, selectedColor.name));
    }
  }, [selectedColor, product]);

  // Periodically increment sales and toggle viewer count / stock levels
  useEffect(() => {
    if (!product) return;
    
    const interval = setInterval(() => {
      // Randomly increment units sold
      const increment = Math.random() > 0.5 ? 2 : 1;
      setUnitsSold(prev => prev + increment);
      
      // Select new buyer details
      const randomName = INDIAN_NAMES[Math.floor(Math.random() * INDIAN_NAMES.length)];
      const randomCity = INDIAN_CITIES[Math.floor(Math.random() * INDIAN_CITIES.length)];
      const randomQty = Math.random() > 0.7 ? 4 : (Math.random() > 0.4 ? 2 : 1);
      
      setLastBuyer({
        name: randomName,
        city: randomCity,
        qty: randomQty
      });
      
      // Randomly toggle viewers slightly
      setActiveViewers(prev => {
        const change = Math.floor(Math.random() * 5) - 2; // -2 to +2
        return Math.max(8, prev + change);
      });
      
      // Randomly decrement stock count occasionally
      if (Math.random() > 0.75) {
        setStockCount(prev => Math.max(2, prev - 1));
      }
    }, 12000 + Math.random() * 6000); // 12-18s
    
    return () => clearInterval(interval);
  }, [product]);

  // Cycle through ticker messages
  useEffect(() => {
    const interval = setInterval(() => {
      setTickerIndex(prev => (prev + 1) % 4);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

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
      color: selectedColorName,
      quantity: quantity 
    });
  }

  async function handleBuyNow() {
    if (product.inStock === false || isBuyingNow) return;

    const shopifyHandle = product.shopifyHandle || product.slug;
    setIsBuyingNow(true);

    try {
      const variantId = product.shopifyVariantId || product.variantId || product.sku;
      const name = getSelectedProductName();
      const totalPrice = selectedBundle?.price || getProductPrice(product);
      const discountedUnitPrice = quantity > 0 ? totalPrice / quantity : totalPrice;

      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: [{
            variantId,
            quantity,
            name,
            discountedUnitPrice
          }]
        }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.checkoutUrl) {
          window.location.href = data.checkoutUrl;
          return;
        }
      }

      // Fallback to standard checkout if dynamic endpoint fails
      const checkoutUrl = await getShopifyCheckoutUrl(shopifyHandle, quantity);
      window.location.href = checkoutUrl;
    } catch (err) {
      console.warn("Shopify checkout unavailable, falling back to Razorpay:", err.message);
      
      addToCart(product, {
        color: selectedColorName,
        quantity: quantity,
        openCart: false
      });
      const fallbackProduct = selectedColorName
        ? { ...product, selectedColor: selectedColorName }
        : product;
      checkout({
        items: [{ id: getProductId(fallbackProduct), product: fallbackProduct, quantity }],
        amount: selectedBundle?.price || getProductPrice(product)
      });
    } finally {
      setIsBuyingNow(false);
    }
  }

  function adjustQuantity(amount) {
    setQuantity(prev => Math.max(1, prev + amount));
  }

  function openCustomizationPopup(bundleId) {
    const colors = Array.isArray(product.colors) ? product.colors.filter(c => c && c.name && c.hex) : [];
    if (colors.length === 0) {
      return; // Bypass popup entirely if product has no color options
    }
    const size = bundleId === 1 ? 1 : bundleId; // bundleId is 1, 2, or 4
    setPopupBundleSize(size);
    const defaultColor = colors[0].name;
    setPopupColors(Array(size).fill(defaultColor));
    setPopupQuantity(1);
    setIsBundlePopupOpen(true);
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

  const FREE_SHIPPING_THRESHOLD = 999;
  const SHIPPING_FEE = 99;

  const getShippingSubtext = (price, label = "") => {
    const shippingText = price >= FREE_SHIPPING_THRESHOLD
      ? "Free Priority Shipping"
      : `+ ₹${SHIPPING_FEE} Shipping (Free above ₹${FREE_SHIPPING_THRESHOLD})`;
    return label ? `${label} | ${shippingText}` : shippingText;
  };

  const bundles = [
    { 
      id: 1, 
      title: 'Single', 
      badge: null,
      subtext: getShippingSubtext(basePrice, 'Additional Prepaid Discount'), 
      price: basePrice, 
      oldPrice: baseOldPrice 
    },
    { 
      id: 2, 
      title: 'Pack of 2', 
      badge: '10% OFF',
      badgeLabel: `Save ₹${(baseOldPrice * 2) - Math.floor(basePrice * 2 * 0.90)}`,
      subtext: getShippingSubtext(Math.floor(basePrice * 2 * 0.90)), 
      price: Math.floor(basePrice * 2 * 0.90), 
      oldPrice: baseOldPrice * 2,
      topBadge: 'MOST POPULAR'
    },
    { 
      id: 4, 
      title: 'Pack of 4', 
      badge: '20% OFF',
      badgeLabel: `Save ₹${(baseOldPrice * 4) - Math.floor(basePrice * 4 * 0.80)}`,
      subtext: getShippingSubtext(Math.floor(basePrice * 4 * 0.80)), 
      price: Math.floor(basePrice * 4 * 0.80), 
      oldPrice: baseOldPrice * 4,
      topBadge: 'LOWEST PRICE EVER!'
    }
  ];

  const selectedBundle = bundles.find(b => b.id === quantity) || bundles[0];

  const displayBadge = (() => {
    if (quantity === 1) {
      return product.badge;
    }
    return selectedBundle.badge;
  })();

  const displayBadgeClass = (() => {
    if (quantity === 1) {
      return product.badgeClass || 'badge-discount';
    }
    return 'badge-discount';
  })();

  const productColors = Array.isArray(product.colors)
    ? product.colors.filter((color) => color && color.name && color.hex)
    : [];
  const selectedColorName = selectedColor?.name || productColors[0]?.name || "";

  function handleColorSelect(color) {
    if (!color || color.available === false) return;

    setSelectedColor(color);
    setActiveImage(color.image || product.image);
  }

  function getSelectedProductName() {
    return selectedColorName ? `${product.name} - ${selectedColorName}` : product.name;
  }

  const tickerMessages = [
    {
      id: "sales",
      content: (
        <span>
          <strong>
            <motion.span
              key={unitsSold}
              initial={{ scale: 1.25, color: "#ef4444" }}
              animate={{ scale: 1, color: "inherit" }}
              style={{ display: "inline-block" }}
              transition={{ duration: 0.4, type: "spring", stiffness: 200 }}
            >
              {unitsSold}+ units sold
            </motion.span>
          </strong> in the last 24 hours
        </span>
      )
    },
    {
      id: "live",
      content: (
        <span>
          🔥 <strong>{lastBuyer.name}</strong> from <strong>{lastBuyer.city}</strong> just bought <strong>{lastBuyer.qty} {lastBuyer.qty > 1 ? "units" : "unit"}</strong>!
        </span>
      )
    },
    {
      id: "stock",
      content: (
        <span>
          ⚡ <strong>High Demand:</strong> Only <strong>{stockCount}</strong> left in stock {selectedColorName ? `for ${selectedColorName}` : ""}!
        </span>
      )
    },
    {
      id: "viewers",
      content: (
        <span>
          ✨ <strong>{activeViewers} people</strong> are viewing this product right now
        </span>
      )
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
              <img
                src={activeImage || product.image}
                alt={product.name}
                loading="eager"
                fetchPriority="high"
                decoding="async"
              />
              {displayBadge && <span className={`product-status-badge ${displayBadgeClass}`}>{displayBadge}</span>}
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
                  <img src={img} alt="thumbnail" loading="lazy" decoding="async" />
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
              <span className="current-price">Rs. {selectedBundle.price}</span>
              <span className="old-price">Rs. {selectedBundle.oldPrice}</span>
              {selectedBundle.oldPrice - selectedBundle.price > 0 && (
                <span className="discount-tag">SAVE Rs. {selectedBundle.oldPrice - selectedBundle.price}</span>
              )}
            </div>

            <div className="shipping-dynamic-notice" style={{ fontSize: "14px", fontWeight: "600", marginTop: "8px", display: "flex", alignItems: "center", gap: "6px" }}>
              {selectedBundle.price >= FREE_SHIPPING_THRESHOLD ? (
                <span style={{ color: "var(--brand-color)", display: "inline-flex", alignItems: "center", gap: "4px" }}>
                  <Check size={16} strokeWidth={3} /> Free Priority Shipping Eligible
                </span>
              ) : (
                <span style={{ color: "#c27803", display: "inline-flex", alignItems: "center", gap: "4px" }}>
                  🚚 Add Rs. {FREE_SHIPPING_THRESHOLD - selectedBundle.price} more for Free Shipping (Current: +₹{SHIPPING_FEE} Shipping)
                </span>
              )}
            </div>

            <p className="product-short-desc">
              {product.description}
            </p>

            {productColors.length > 0 && (
              <div className="variant-selector">
                <p className="variant-label">
                  Select Color: <span>{selectedColorName}</span>
                </p>
                <div className="color-options" role="radiogroup" aria-label="Select product color">
                  {productColors.map((color, i) => {
                    const isActive = selectedColor ? selectedColor.name === color.name : i === 0;
                    const isUnavailable = color.available === false;
                    return (
                      <button 
                        key={color.name} 
                        className={`color-bubble ${isActive ? 'active' : ''} ${isUnavailable ? 'is-disabled' : ''}`}
                        style={{ "--swatch-color": color.hex }}
                        title={isUnavailable ? `${color.name} unavailable` : color.name}
                        type="button"
                        role="radio"
                        aria-label={`${color.name}${isUnavailable ? " unavailable" : ""}`}
                        aria-checked={isActive}
                        disabled={isUnavailable}
                        onClick={() => handleColorSelect(color)}
                      >
                        {isActive ? <Check size={14} strokeWidth={3} /> : null}
                      </button>
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

            <div className="units-sold-ticker" style={{ overflow: "hidden", display: "inline-flex", alignItems: "center", width: "100%", minHeight: "42px" }}>
              <div className="pulsing-dot" style={{ flexShrink: 0 }}></div>
              <div style={{ flex: 1, overflow: "hidden", position: "relative", minHeight: "20px", display: "flex", alignItems: "center" }}>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={tickerIndex}
                    initial={{ y: 15, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -15, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                  >
                    {tickerMessages[tickerIndex].content}
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>

            <div className="bundle-separator">
              <span>BUNDLE & SAVE</span>
            </div>

            <div className="bundle-options">
              {bundles.map((b) => (
                <div 
                  key={b.id} 
                  className={`bundle-option ${quantity === b.id ? 'selected' : ''}`}
                  onClick={() => {
                    setQuantity(b.id);
                    openCustomizationPopup(b.id);
                  }}
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
                     <span className="payment-badge gpay">GPay</span>
                     <span className="payment-badge phonepe">Pe</span>
                     <span className="payment-badge paytm">Paytm</span>
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
        <div className="loved-badge">
          <span className="heart-icon">💖</span> Loved by {product.reviews ? Number(product.reviews) * 127 : '10,000'}+ Customers
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
                  <img src={review.image || (
                    review.name === "Kavya Reddy" ? "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&h=150&q=80" :
                    review.name === "Vivek Gulati" ? "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&h=150&q=80" :
                    review.name === "Sunita Patil" ? "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&h=150&q=80" :
                    review.name === "Srinivas Murthy" ? "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&h=150&q=80" :
                    "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&h=150&q=80"
                  )}
                    alt={review.name}
                    loading="lazy"
                    fetchPriority="low"
                    decoding="async"
                  />
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
                    <img src={p.image} alt={p.name} loading="lazy" fetchPriority="low" decoding="async" />
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

      <AnimatePresence>
        {isBundlePopupOpen && (
          <motion.div 
            className="bundle-popup-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsBundlePopupOpen(false)}
          >
            <motion.div 
              className="bundle-popup-content"
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: "spring", duration: 0.5 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button 
                className="bundle-popup-close"
                onClick={() => setIsBundlePopupOpen(false)}
                aria-label="Close customization popup"
              >
                <X size={18} />
              </button>

              <div className="bundle-popup-header">
                <h2>Customize Your Bundle</h2>
                <p>Select your preferred color combination below</p>
              </div>

              <div className="bundle-popup-grid">
                <div className="bundle-popup-slots">
                  {Array.from({ length: popupBundleSize }).map((_, index) => {
                    const chosenColorName = popupColors[index] || "";
                    const chosenColorObj = productColors.find(c => c.name === chosenColorName) || productColors[0];
                    const slotImg = chosenColorObj?.image || product.image;

                    return (
                      <div key={index} className="bundle-slot-card">
                        <span className="slot-title">Fan #{index + 1} Color</span>
                        <div className="slot-body">
                          <div className="slot-preview">
                            <img src={slotImg} alt={chosenColorName} />
                          </div>
                          <div className="slot-colors">
                            <p className="color-name-label">{chosenColorName || "Select Color"}</p>
                            <div className="color-options-row">
                              {productColors.map((color) => {
                                const isSelected = chosenColorName === color.name;
                                return (
                                  <button
                                    key={color.name}
                                    className={`color-chip ${isSelected ? 'active' : ''}`}
                                    style={{ "--swatch-color": color.hex }}
                                    title={color.name}
                                    type="button"
                                    onClick={() => {
                                      const updated = [...popupColors];
                                      updated[index] = color.name;
                                      setPopupColors(updated);
                                    }}
                                  >
                                    {isSelected && <Check size={14} strokeWidth={3} />}
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="bundle-popup-footer">
                <div className="footer-left">
                  <div className="bundle-quantity-control">
                    <span className="qty-label">Quantity:</span>
                    <div className="qty-selector">
                      <button 
                        type="button" 
                        onClick={() => setPopupQuantity(q => Math.max(1, q - 1))}
                        aria-label="Decrease bundle quantity"
                      >
                        <Minus size={14} strokeWidth={2.5} />
                      </button>
                      <span className="qty-count">{popupQuantity}</span>
                      <button 
                        type="button" 
                        onClick={() => setPopupQuantity(q => q + 1)}
                        aria-label="Increase bundle quantity"
                      >
                        <Plus size={14} strokeWidth={2.5} />
                      </button>
                    </div>
                  </div>

                  {(() => {
                    const bundleObj = bundles.find(b => b.id === popupBundleSize) || bundles[0];
                    const currentPrice = bundleObj.price * popupQuantity;
                    const oldPrice = bundleObj.oldPrice * popupQuantity;

                    return (
                      <div className="bundle-popup-price">
                        <div className="popup-price-row">
                          <span className="current-price">Rs. {currentPrice}</span>
                          {oldPrice > currentPrice && (
                            <span className="old-price">Rs. {oldPrice}</span>
                          )}
                        </div>
                      </div>
                    );
                  })()}
                </div>

                <button 
                  className="bundle-popup-next"
                  type="button"
                  onClick={async () => {
                    if (isBuyingNow) return;
                    setIsBuyingNow(true);
                    try {
                      // 1. Add customized bundle to cart
                      await addToCart(product, {
                        quantity: popupQuantity,
                        selectedColors: popupColors,
                        openCart: false
                      });
                      // 2. Direct storefront checkout redirect
                      await checkout({
                        items: [{
                          product: {
                            ...product,
                            selectedColors: popupColors
                          },
                          quantity: popupQuantity
                        }]
                      });
                    } catch (error) {
                      console.error("Popup checkout redirection failed:", error);
                    } finally {
                      setIsBuyingNow(false);
                      setIsBundlePopupOpen(false);
                    }
                  }}
                  disabled={isBuyingNow}
                >
                  <span>{isBuyingNow ? "Redirecting..." : "Next"}</span>
                  {!isBuyingNow && <ArrowRight size={18} strokeWidth={2.2} />}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.main>
  );
}

export default function ProductPage() {
  return <ProductPageContent />;
}
