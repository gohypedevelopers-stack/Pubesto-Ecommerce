"use client";

import { useState, useMemo } from "react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import Drawers from "../../components/Drawers";
import { StoreProvider, useStore } from "../../components/StoreContext";
import LeadModal from "../../components/LeadModal";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus, Filter, X as CloseIcon } from "lucide-react";
import Link from "next/link";

const shopFamilies = [
  { label: "Home Decor", value: "Home Decor" },
  { label: "Fans", value: "Fans" },
  { label: "Lunch Box", value: "Lunch Box" },
  { label: "Water Bottles", value: "Bottles" },
  { label: "Storage", value: "Storage" },
];

const shopFamilyValues = shopFamilies.map((family) => family.value);

function getShopProductKey(product) {
  return product.sku || product.slug || product.name;
}

function uniqueProductsByKey(productList) {
  const seen = new Set();

  return productList.filter((product) => {
    const key = getShopProductKey(product);
    if (seen.has(key)) {
      return false;
    }
    seen.add(key);
    return true;
  });
}

function ShopContent() {
  const { 
    addToCart, updateCartQuantity, cartItems, getProductId,
    searchQuery, products
  } = useStore();
  const [selectedFamilies, setSelectedFamilies] = useState([]);
  const [priceRange, setPriceRange] = useState("all");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [limit, setLimit] = useState(12);

  const handleAddToCart = (product) => {
    addToCart(product);
  };

  const filteredProducts = useMemo(() => {
    // 1. Initial filter for real products with valid categories
    const baseProducts = products.filter((p) => p.image && (p.image.startsWith('/images/') || p.image.startsWith('https://')));

    return baseProducts.filter((product) => {
      // Family filter
      const familyMatch = selectedFamilies.length === 0 || 
        (product.categories || []).some((cat) => selectedFamilies.some(sf => cat.toLowerCase().includes(sf.toLowerCase())));
      
      // Price filter
      const numericPrice = Number(product.price?.replace(/[^\d]/g, "")) || 0;
      let priceMatch = true;
      if (priceRange === "under-500") priceMatch = numericPrice < 500;
      else if (priceRange === "500-1000") priceMatch = numericPrice >= 500 && numericPrice <= 1000;
      else if (priceRange === "over-1000") priceMatch = numericPrice > 1000;

      // Search filter
      const searchMatch = !searchQuery || 
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (product.categories || []).some(cat => cat.toLowerCase().includes(searchQuery.toLowerCase()));

      return familyMatch && priceMatch && searchMatch;
    });
  }, [selectedFamilies, priceRange, searchQuery, products]);

  const toggleFamily = (family) => {
    setSelectedFamilies((prev) =>
      prev.includes(family) ? prev.filter((f) => f !== family) : [...prev, family]
    );
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
  };

  return (
    <main className="shop-page">
      <header className="shop-header">
        <motion.div 
          className="shop-header-content"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.h1 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          >
            The Collection
          </motion.h1>
          <p>
            Explore our curated selection of home essentials, artisanal lunch boxes, and premium water bottles. 
            Meticulously designed for your everyday lifestyle.
          </p>
        </motion.div>
      </header>

      <div className="shop-container">
        {/* Mobile Filter Toggle */}
        <button 
          className="mobile-filter-toggle" 
          onClick={() => setIsSidebarOpen(true)}
        >
          <Filter size={18} />
          Filters
        </button>

        {/* Sidebar Filters */}
        <aside className={`shop-sidebar ${isSidebarOpen ? 'open' : ''}`}>
          <div className="sidebar-header">
            <h3>Filters</h3>
            <button className="close-sidebar" onClick={() => setIsSidebarOpen(false)}>
              <CloseIcon size={20} />
            </button>
          </div>

          <div className="filter-group">
            <h3 className="filter-title">Categories</h3>
            <div className="filter-options">
              {shopFamilies.map((family) => (
                <label key={family.value} className="filter-label">
                  <input
                    type="checkbox"
                    checked={selectedFamilies.includes(family.value)}
                    onChange={() => toggleFamily(family.value)}
                  />
                  <span>{family.label}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="filter-group">
            <h3 className="filter-title">Price Range</h3>
            <div className="filter-options">
              {[
                { label: "All Prices", value: "all" },
                { label: "Under Rs. 500", value: "under-500" },
                { label: "Rs. 500 - 1000", value: "500-1000" },
                { label: "Over Rs. 1000", value: "over-1000" }
              ].map((range) => (
                <label key={range.value} className="filter-label">
                  <input
                    type="radio"
                    name="price"
                    checked={priceRange === range.value}
                    onChange={() => setPriceRange(range.value)}
                  />
                  <span>{range.label}</span>
                </label>
              ))}
            </div>
          </div>
        </aside>

        {/* Product Grid */}
        <div className="shop-content">
          <motion.div 
            className="shop-grid"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            key={selectedFamilies.join('-') + priceRange}
          >
            <AnimatePresence mode="popLayout">
              {filteredProducts.slice(0, limit).map((product) => (
                <motion.article 
                  key={getShopProductKey(product)}
                  className="shop-product-card"
                  variants={itemVariants}
                  layout
                >
                  {product.badge && <div className="shop-product-badge">{product.badge}</div>}
                  <button className="shop-product-plus" onClick={() => handleAddToCart(product)}>
                    <Plus size={18} />
                  </button>
                  
                  <Link className="shop-product-media" href={`/product/${product.slug}`}>
                    <img src={product.image} alt={product.name} />
                  </Link>
                  
                  <div className="shop-product-content">
                    <span className="shop-product-detail-tag">{product.detail}</span>
                    <Link href={`/product/${product.slug}`}>
                      <h3 className="shop-product-name">{product.name}</h3>
                    </Link>
                    <div className="shop-product-price-row">
                      <span className="shop-current-price">{product.price}</span>
                      {product.oldPrice && <span className="shop-old-price">{product.oldPrice}</span>}
                    </div>
                    {(() => {
                      const cartQuantity = cartItems.find((item) => item.id === getProductId(product))?.quantity || 0;
                      return cartQuantity > 0 ? (
                        <div className="shop-quantity-selector">
                          <button 
                            type="button" 
                            onClick={() => updateCartQuantity(getProductId(product), cartQuantity - 1)}
                            aria-label="Decrease quantity"
                          >
                            <Minus size={14} />
                          </button>
                          <span>{cartQuantity}</span>
                          <button 
                            type="button" 
                            onClick={() => updateCartQuantity(getProductId(product), cartQuantity + 1)}
                            aria-label="Increase quantity"
                          >
                            <Plus size={14} />
                          </button>
                        </div>
                      ) : (
                        <button 
                          className="shop-add-btn"
                          onClick={() => handleAddToCart(product)}
                        >
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
            <motion.div 
              className="no-results"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <p>No products match your current filters.</p>
              <button className="clear-filters-btn" onClick={() => { setSelectedFamilies([]); setPriceRange("all"); }}>
                Clear All Filters
              </button>
            </motion.div>
          )}

          {filteredProducts.length > limit && (
            <div className="shop-actions">
              <motion.button 
                className="secondary-button discover-more"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setLimit(prev => prev + 12)}
              >
                Load More Items
              </motion.button>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

export default function ShopPage() {
  return (
    <StoreProvider>
      <Header />
      <Drawers />
      <LeadModal />
      <ShopContent />
      <Footer />
    </StoreProvider>
  );
}

