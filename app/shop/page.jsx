"use client";

import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus, Filter, X as CloseIcon, ShoppingBag, Search } from "lucide-react";
import Link from "next/link";
import { useStore } from "../../components/StoreContext";
import '../shop.css';

function getShopProductKey(product) {
  return product.sku || product.slug || product.name;
}

function ShopContent() {
  const { 
    addToCart, updateCartQuantity, cartItems, getProductId,
    searchQuery, products
  } = useStore();
  
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [priceRange, setPriceRange] = useState("all");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [limit, setLimit] = useState(12);

  // Derive dynamic categories from products
  const dynamicCategories = useMemo(() => {
    const allCats = products.flatMap(p => p.categories || []);
    const uniqueCats = Array.from(new Set(allCats)).sort();
    return uniqueCats;
  }, [products]);

  const handleAddToCart = (product) => {
    addToCart(product);
  };

  const filteredProducts = useMemo(() => {
    const baseProducts = products.filter((p) => p.image);

    return baseProducts.filter((product) => {
      // Category filter - robust matching
      const categoryMatch = selectedCategories.length === 0 || 
        (product.categories || []).some((cat) => selectedCategories.includes(cat));
      
      // Price filter
      const numericPrice = Number(product.price?.replace(/[^\d]/g, "")) || product.salePrice || 0;
      let priceMatch = true;
      if (priceRange === "under-500") priceMatch = numericPrice < 500;
      else if (priceRange === "500-1000") priceMatch = numericPrice >= 500 && numericPrice <= 1000;
      else if (priceRange === "over-1000") priceMatch = numericPrice > 1000;

      // Search filter
      const searchMatch = !searchQuery || 
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (product.categories || []).some(cat => cat.toLowerCase().includes(searchQuery.toLowerCase()));

      return categoryMatch && priceMatch && searchMatch;
    });
  }, [selectedCategories, priceRange, searchQuery, products]);

  const toggleCategory = (cat) => {
    setSelectedCategories((prev) =>
      prev.includes(cat) ? prev.filter((f) => f !== cat) : [...prev, cat]
    );
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.05 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } }
  };

  return (
    <main className="pubesto-shop-v2">
      {/* Premium Hero Header */}
      <header className="shop-hero-section">
        <div className="hero-blur-bg" />
        <motion.div 
          className="shop-hero-content"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <span className="hero-subtitle">Premium Collection</span>
          <h1 className="hero-title">The Art of <span>Everyday Living.</span></h1>
          <p className="hero-desc">
            Discover our curated essentials, meticulously crafted for style and utility.
          </p>
        </motion.div>
      </header>

      <div className="shop-main-layout">
        {/* Mobile Toggle & Active Filters Bar */}
        <div className="shop-controls-mobile">
          <button 
            className="filter-toggle-btn" 
            onClick={() => setIsSidebarOpen(true)}
          >
            <Filter size={18} />
            <span>Filter Results</span>
          </button>
          <div className="results-count">
            {filteredProducts.length} Products
          </div>
        </div>

        <div className="shop-flex-container">
          {/* Advanced Sidebar */}
          <aside className={`shop-sidebar-v2 ${isSidebarOpen ? 'is-open' : ''}`}>
            <div className="sidebar-inner">
              <div className="sidebar-header-v2">
                <h3>Filters</h3>
                <button onClick={() => setIsSidebarOpen(false)}><CloseIcon size={22} /></button>
              </div>

              <div className="filter-block">
                <h4 className="block-title">Browse Categories</h4>
                <div className="category-pills">
                  {dynamicCategories.map((cat) => (
                    <button 
                      key={cat} 
                      className={`cat-pill ${selectedCategories.includes(cat) ? 'active' : ''}`}
                      onClick={() => toggleCategory(cat)}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              <div className="filter-block">
                <h4 className="block-title">Price Range</h4>
                <div className="price-radio-group">
                  {[
                    { label: "All Prices", value: "all" },
                    { label: "Under Rs. 500", value: "under-500" },
                    { label: "Rs. 500 - 1000", value: "500-1000" },
                    { label: "Over Rs. 1000", value: "over-1000" }
                  ].map((range) => (
                    <label key={range.value} className="custom-radio">
                      <input
                        type="radio"
                        name="price"
                        checked={priceRange === range.value}
                        onChange={() => setPriceRange(range.value)}
                      />
                      <span className="radio-check"></span>
                      <span className="radio-label">{range.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* Attractive Product Grid */}
          <div className="shop-grid-area">
            <motion.div 
              className="products-grid-v2"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              key={selectedCategories.join('-') + priceRange}
            >
              <AnimatePresence mode="popLayout">
                {filteredProducts.slice(0, limit).map((product) => (
                  <motion.article 
                    key={getShopProductKey(product)}
                    className="premium-product-card"
                    variants={itemVariants}
                    layout
                  >
                    <div className="card-visual">
                      {product.badge && <span className="card-badge">{product.badge}</span>}
                      <Link href={`/product/${product.slug}`} className="image-wrapper">
                        <img src={product.image} alt={product.name} loading="lazy" />
                        <div className="image-overlay" />
                      </Link>
                      <button className="quick-add-circle" onClick={() => handleAddToCart(product)}>
                        <ShoppingBag size={20} />
                      </button>
                    </div>

                    <div className="card-body">
                      <div className="card-meta">
                        <span className="card-category">{product.categories?.[0] || 'Essential'}</span>
                        <div className="card-rating">
                          <Star size={12} fill="currentColor" />
                          <span>{product.rating || '4.8'}</span>
                        </div>
                      </div>
                      <Link href={`/product/${product.slug}`}>
                        <h3 className="card-name">{product.name}</h3>
                      </Link>
                      <div className="card-price-area">
                        <span className="current-price">{product.price}</span>
                        {product.oldPrice && <span className="old-price">{product.oldPrice}</span>}
                      </div>
                      
                      {(() => {
                        const cartQuantity = cartItems.find((item) => item.id === getProductId(product))?.quantity || 0;
                        return cartQuantity > 0 ? (
                          <div className="card-cart-manager">
                            <button onClick={() => updateCartQuantity(getProductId(product), cartQuantity - 1)}>
                              <Minus size={14} />
                            </button>
                            <span>{cartQuantity}</span>
                            <button onClick={() => updateCartQuantity(getProductId(product), cartQuantity + 1)}>
                              <Plus size={14} />
                            </button>
                          </div>
                        ) : (
                          <button className="card-action-btn" onClick={() => handleAddToCart(product)}>
                            Add to Cart
                          </button>
                        );
                      })()}
                    </div>
                  </motion.article>
                ))}
              </AnimatePresence>
            </motion.div>

            {filteredProducts.length === 0 && (
              <div className="shop-empty-state">
                <Search size={48} />
                <h3>No products found</h3>
                <p>Try adjusting your filters or search query.</p>
                <button onClick={() => { setSelectedCategories([]); setPriceRange("all"); }}>
                  Clear All Filters
                </button>
              </div>
            )}

            {filteredProducts.length > limit && (
              <div className="shop-load-more">
                <button onClick={() => setLimit(prev => prev + 12)}>
                  Load More Collection
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}

function Star({ size, fill }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}

export default function ShopPage() {
  return <ShopContent />;
}
