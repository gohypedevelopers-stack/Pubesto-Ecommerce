"use client";

import Link from "next/link";

import { useStore } from "./StoreContext";
import { UserIcon, SearchIcon } from "./Icons";
import { formatPrice } from "../lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, ExternalLink, LogIn, MapPin, Package, TrendingUp, ShoppingBag } from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  getShopifyAccountAddressesUrl,
  getShopifyAccountLoginUrl,
  getShopifyAccountUrl,
} from "../lib/shopify";


export default function Drawers() {
  const {
    isCartOpen, setIsCartOpen,
    isProfileOpen, setIsProfileOpen,
    cartItems, cartCount, cartTotal,
    updateCartQuantity, removeFromCart, checkout,
    profileNotice,
    getProductPrice,
    getCartItemTotalPrice, getCartItemDisplayName,
    openShopifyCart,
    isSearchOpen, setIsSearchOpen,
    searchQuery, setSearchQuery,
    products,
    setSelectedCategory, setShowAllProducts
  } = useStore();
  const shopifyAccountUrl = getShopifyAccountUrl();
  const shopifyLoginUrl = getShopifyAccountLoginUrl();
  const shopifyAddressesUrl = getShopifyAccountAddressesUrl();
  const router = useRouter();

  const [recentSearches, setRecentSearches] = useState([]);

  useEffect(() => {
    if (isSearchOpen) {
      const saved = localStorage.getItem("pubesto_recent_searches");
      if (saved) {
        try {
          setRecentSearches(JSON.parse(saved));
        } catch (e) {
          console.error(e);
        }
      }
    }
  }, [isSearchOpen]);

  const handleSearchSubmit = (term = searchQuery) => {
    const trimmed = term.trim();
    if (!trimmed) return;
    
    setSearchQuery(trimmed);
    setIsSearchOpen(false);
    setShowAllProducts(true);

    // Save to recent searches
    const updated = [trimmed, ...recentSearches.filter(t => t.toLowerCase() !== trimmed.toLowerCase())].slice(0, 5);
    setRecentSearches(updated);
    localStorage.setItem("pubesto_recent_searches", JSON.stringify(updated));

    if (window.location.pathname !== '/shop') {
      router.push('/shop');
    }
  };

  const handleClearHistory = (e) => {
    e.stopPropagation();
    setRecentSearches([]);
    localStorage.removeItem("pubesto_recent_searches");
  };




  return (
    <>
      {isCartOpen && (
        <div className="cart-layer">
          <button
            className="cart-backdrop"
            type="button"
            aria-label="Close cart"
            onClick={() => setIsCartOpen(false)}
          />
          <aside className="cart-drawer" role="dialog" aria-modal="true" aria-label="Shopping cart">
            {/* Header */}
            <div className="cart-drawer-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '16px', borderBottom: '1px solid rgba(211, 201, 189, 0.5)' }}>
              <h2 style={{ fontSize: '20px', fontWeight: 600, margin: 0 }}>
                Your Cart {cartCount > 0 && <span style={{ fontSize: '14px', fontWeight: 500, color: 'var(--muted)', marginLeft: '6px' }}>({cartCount} item{cartCount !== 1 ? 's' : ''})</span>}
              </h2>
              <button
                type="button"
                onClick={() => setIsCartOpen(false)}
                aria-label="Close cart"
                style={{ border: 'none', background: 'transparent', padding: '4px 8px', fontSize: '20px', color: 'var(--muted)', cursor: 'pointer', lineHeight: 1 }}
              >
                ✕
              </button>
            </div>

            {/* Body */}
            <div className="cart-drawer-body" style={{ flex: 1, overflowY: 'auto', padding: '16px 0', display: 'flex', flexDirection: 'column' }}>
              {cartItems.length > 0 ? (
                <div className="cart-items">
                  {cartItems.map((item) => (
                    <article
                      key={item.id}
                      style={{ display: 'grid', gridTemplateColumns: '68px 1fr auto', gap: '12px', alignItems: 'start', border: '1px solid rgba(211, 201, 189, 0.4)', borderRadius: '10px', padding: '12px', background: 'var(--panel)', marginBottom: '12px' }}
                    >
                      {/* Product Image → links to product page */}
                      <Link
                        href={`/product/${item.product.slug}`}
                        onClick={() => setIsCartOpen(false)}
                        style={{ display: 'block', width: '68px', height: '68px', overflow: 'hidden', borderRadius: '6px', flexShrink: 0 }}
                      >
                        <img
                          src={item.product.image}
                          alt={item.product.name}
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                      </Link>

                      {/* Product Details */}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', minWidth: 0 }}>
                        <Link
                          href={`/product/${item.product.slug}`}
                          onClick={() => setIsCartOpen(false)}
                          style={{ textDecoration: 'none', color: 'inherit' }}
                        >
                          <h3 style={{ fontSize: '13px', fontWeight: 700, margin: 0, color: 'var(--ink)', lineHeight: 1.4 }}>
                            {getCartItemDisplayName(item.product, item.quantity)}
                          </h3>
                        </Link>
                        <p style={{ fontSize: '13px', fontWeight: 800, color: 'var(--brand-color)', margin: 0 }}>
                          {formatPrice(getCartItemTotalPrice(item.product, item.quantity) / item.quantity)}
                        </p>
                        {/* Quantity Controls */}
                        <div style={{ display: 'inline-grid', gridTemplateColumns: '26px 32px 26px', alignItems: 'center', border: '1px solid rgba(211, 201, 189, 0.8)', borderRadius: '6px', background: 'var(--cream)', width: 'fit-content', marginTop: '4px', overflow: 'hidden' }}>
                          <button
                            type="button"
                            aria-label="Decrease quantity"
                            onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                            style={{ border: 'none', background: 'transparent', width: '26px', height: '26px', cursor: 'pointer', fontWeight: 'bold', fontSize: '16px', color: 'var(--ink)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                          >
                            −
                          </button>
                          <span style={{ textAlign: 'center', fontSize: '12px', fontWeight: 700, color: 'var(--ink)', borderLeft: '1px solid rgba(211,201,189,0.6)', borderRight: '1px solid rgba(211,201,189,0.6)', height: '26px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            aria-label="Increase quantity"
                            onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                            style={{ border: 'none', background: 'transparent', width: '26px', height: '26px', cursor: 'pointer', fontWeight: 'bold', fontSize: '16px', color: 'var(--ink)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                          >
                            +
                          </button>
                        </div>
                      </div>

                      {/* Right side: line total + remove */}
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px', flexShrink: 0 }}>
                        <span style={{ fontSize: '13px', fontWeight: 800, color: 'var(--ink)' }}>
                          {formatPrice(getCartItemTotalPrice(item.product, item.quantity))}
                        </span>
                        <button
                          type="button"
                          aria-label={`Remove ${item.product.name}`}
                          onClick={() => removeFromCart(item.id)}
                          title="Remove item"
                          style={{ border: '1px solid rgba(211,201,189,0.6)', background: 'transparent', borderRadius: '50%', width: '24px', height: '24px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--muted)', fontSize: '11px', padding: 0, flexShrink: 0 }}
                        >
                          ✕
                        </button>
                      </div>
                    </article>
                  ))}
                </div>
              ) : (
                /* Empty State */
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flex: 1, padding: '60px 20px', textAlign: 'center' }}>
                  <div style={{ width: '80px', height: '80px', borderRadius: '50%', border: '1px solid rgba(211, 201, 189, 0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px', background: 'var(--panel)' }}>
                    <ShoppingBag size={34} style={{ color: 'var(--muted)' }} />
                  </div>
                  <h3 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--ink)', margin: '0 0 8px 0' }}>Your cart is empty</h3>
                  <p style={{ fontSize: '13px', color: 'var(--muted)', margin: '0 0 24px 0', maxWidth: '220px', lineHeight: 1.5 }}>Let's add something you'll love.</p>
                  <button
                    type="button"
                    onClick={() => {
                      setIsCartOpen(false);
                      router.push('/shop');
                    }}
                    className="cart-empty-continue-btn"
                  >
                    Continue shopping
                  </button>
                </div>
              )}
            </div>

            {/* Footer */}
            <div style={{ borderTop: '1px solid rgba(211, 201, 189, 0.5)', paddingTop: '16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--muted)' }}>Subtotal</span>
                <strong style={{ fontSize: '18px', fontWeight: 800, color: 'var(--brand-color)' }}>{formatPrice(cartTotal)}</strong>
              </div>
              <p style={{ fontSize: '12px', color: 'var(--muted)', margin: 0, textAlign: 'center' }}>Taxes &amp; shipping calculated at checkout.</p>

              <button
                type="button"
                disabled={cartItems.length === 0}
                onClick={() => checkout()}
                className="cart-checkout-btn"
              >
                {cartItems.length === 0 ? 'Cart is empty' : `Checkout — ${formatPrice(cartTotal)}`}
              </button>

              <button
                type="button"
                onClick={() => {
                  setIsCartOpen(false);
                  router.push('/shop');
                }}
                className="cart-continue-btn"
              >
                Continue shopping
              </button>
            </div>
          </aside>
        </div>
      )}

      {isProfileOpen && (
        <div className="cart-layer">
          <motion.button
            className="cart-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsProfileOpen(false)}
          />
          <motion.aside 
            className="cart-drawer utility-drawer"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
          >
            <div className="cart-drawer-header premium-gradient">
              <div>
                <p className="eyebrow" style={{ color: 'rgba(255,255,255,0.7)' }}>Your account</p>
                <h2 style={{ color: '#fff' }}>Shopify Account</h2>
              </div>
              <button 
                type="button" 
                onClick={() => setIsProfileOpen(false)} 
                style={{ background: 'rgba(255,255,255,0.1)', color: '#fff', border: '1px solid rgba(255,255,255,0.2)' }}
              >
                Close
              </button>
            </div>

            <div className="utility-panel-body">
              <motion.div
                key="shopify-account"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="shopify-account-panel"
              >
                <div className="profile-summary premium-card">
                  <div className="avatar-glow">
                    <UserIcon />
                  </div>
                  <div>
                    <strong>Continue with Shopify</strong>
                    <p>Log in through Shopify to view your profile, orders, and saved addresses.</p>
                  </div>
                </div>

                <div className="shopify-account-actions">
                  <a className="action-button shopify-account-primary" href={shopifyAccountUrl}>
                    <span>Open Shopify profile</span>
                    <ExternalLink size={16} />
                  </a>
                  <a className="shopify-account-secondary" href={shopifyLoginUrl}>
                    <LogIn size={16} />
                    <span>Log in with Shopify</span>
                  </a>
                </div>

                <div className="utility-link-list interactive-list shopify-account-links">
                  <a href={shopifyAccountUrl}>
                    <div className="link-icon"><Package size={18} /></div>
                    <span>Orders</span>
                    <ChevronRight size={16} className="chevron" />
                  </a>
                  <a href={shopifyAddressesUrl}>
                    <div className="link-icon"><MapPin size={18} /></div>
                    <span>Addresses</span>
                    <ChevronRight size={16} className="chevron" />
                  </a>
                </div>
              </motion.div>
              
              {profileNotice && (
                <motion.p 
                  key={profileNotice}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="utility-notice success"
                >
                  {profileNotice}
                </motion.p>
              )}
            </div>
          </motion.aside>
        </div>
      )}

      {isSearchOpen && (
        <div className="cart-layer">
          <motion.button
            className="cart-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsSearchOpen(false)}
          />
          <motion.aside 
            className="cart-drawer search-drawer"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            style={{ right: 0, left: 'auto', borderLeft: '1px solid rgba(211, 201, 189, 0.86)' }}
          >
            <div className="cart-drawer-header">
              <h2 style={{ fontSize: '20px' }}>Search</h2>
              <button 
                type="button" 
                onClick={() => setIsSearchOpen(false)} 
                style={{ border: 'none', background: 'transparent', padding: '0', fontSize: '20px', color: 'var(--muted)' }}
              >
                ✕
              </button>
            </div>

            <div className="search-drawer-body">
              <div className="search-drawer-input-container">
                <SearchIcon />
                <input
                  type="search"
                  placeholder="Search products or collections..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleSearchSubmit();
                    }
                  }}
                  autoFocus
                />
                {searchQuery && (
                  <button 
                    onClick={() => setSearchQuery("")} 
                    style={{ border: 'none', background: 'transparent', cursor: 'pointer', padding: '0 4px', fontSize: '14px', color: 'var(--muted)' }}
                  >
                    ✕
                  </button>
                )}
              </div>

              {searchQuery.trim().length >= 2 ? (
                <div className="search-drawer-results">
                  {products.filter(p => 
                    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    p.categories?.some(c => c.toLowerCase().includes(searchQuery.toLowerCase()))
                  ).slice(0, 6).map((product) => (
                    <Link
                      key={product.slug}
                      href={`/product/${product.slug}`}
                      className="search-drawer-result-item"
                      onClick={() => {
                        setIsSearchOpen(false);
                        setSearchQuery("");
                      }}
                    >
                      <img src={product.image} alt={product.name} />
                      <div>
                        <h4>{product.name}</h4>
                        <p>{product.price}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <>
                  <div className="search-drawer-section">
                    <h3>Recent searches</h3>
                    {recentSearches.length > 0 ? (
                      <div className="search-pills" style={{ marginBottom: '8px' }}>
                        {recentSearches.map((term) => (
                          <button 
                            key={term} 
                            className="search-pill"
                            onClick={() => handleSearchSubmit(term)}
                          >
                            {term}
                          </button>
                        ))}
                        <button 
                          className="search-pill" 
                          style={{ border: 'none', background: 'transparent', textDecoration: 'underline', color: 'var(--muted)', fontSize: '12px' }}
                          onClick={handleClearHistory}
                        >
                          Clear all
                        </button>
                      </div>
                    ) : (
                      <p className="empty-text">No recent searches yet.</p>
                    )}
                  </div>

                  <div className="search-drawer-section">
                    <h3>Popular right now</h3>
                    <div className="search-pills">
                      {["Neck Fan", "Bottles", "Lunch Box", "Speaker Tumbler", "Wall Mounted AC", "Copper Bottle", "LED Fan", "Sale"].map((term) => (
                        <button 
                          key={term} 
                          className="search-pill"
                          onClick={() => handleSearchSubmit(term)}
                        >
                          <TrendingUp size={14} />
                          {term}
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>

            <div className="search-drawer-footer">
              <button 
                className="btn-search-submit" 
                onClick={() => handleSearchSubmit()}
              >
                Search {searchQuery ? `"${searchQuery}"` : '""'}
              </button>
              <button className="btn-search-close" onClick={() => setIsSearchOpen(false)}>
                Close
              </button>
            </div>
          </motion.aside>
        </div>
      )}
    </>
  );
}
