"use client";

import { useStore } from "./StoreContext";
import { SearchIcon, ShoppingBag, UserIcon, MenuIcon } from "./Icons";
import { useState, useEffect, useRef } from "react";
import { motion, useScroll, useMotionValueEvent, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getShopifyAccountUrl, getShopifyAccountLoginUrl } from "../lib/shopify";
import { Home, ShoppingBag as LucideShoppingBag, User, ShoppingCart, ChevronRight } from "lucide-react";

export default function Header() {
  const {
    isMenuOpen, setIsMenuOpen,
    isCartOpen, setIsCartOpen,
    isProfileOpen, setIsProfileOpen,
    isSearchOpen, setIsSearchOpen,
    searchQuery, setSearchQuery,
    cartCount, cartPulseKey, shopifyCartUrl,
    closeUtilityPanels,
    setSelectedCategory, setShowAllProducts,
    products
  } = useStore();

  const { scrollY } = useScroll();
  const [hidden, setHidden] = useState(false);
  const [prevScroll, setPrevScroll] = useState(0);
  const [activeIndex, setActiveIndex] = useState(-1);
  const router = useRouter();
  const shopifyAccountUrl = getShopifyAccountUrl();
  const shopifyLoginUrl = getShopifyAccountLoginUrl();
  const searchInputRef = useRef(null);
  const mobileSearchInputRef = useRef(null);

  // Filter products based on search query
  const filteredResults = searchQuery.trim().length >= 2
    ? products.filter(p => 
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.categories?.some(c => c.toLowerCase().includes(searchQuery.toLowerCase()))
      ).slice(0, 6)
    : [];

  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
    setActiveIndex(-1);
  }, [isSearchOpen]);

  useEffect(() => {
    setActiveIndex(-1);
  }, [searchQuery]);

  const handleKeyDown = (e, isMobile = false) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex(prev => Math.min(prev + 1, filteredResults.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex(prev => Math.max(prev - 1, -1));
    } else if (e.key === "Enter") {
      if (activeIndex >= 0) {
        e.preventDefault();
        const product = filteredResults[activeIndex];
        router.push(`/product/${product.slug}`);
        setIsSearchOpen(false);
        setIsMenuOpen(false);
      } else {
        submitSearch(e);
      }
    } else if (e.key === "Escape") {
      setIsSearchOpen(false);
    }
  };

  useMotionValueEvent(scrollY, "change", (latest) => {
    if (isMenuOpen || isCartOpen || isProfileOpen || isSearchOpen) {
      setHidden(false);
      return;
    }

    if (latest > prevScroll && latest > 150) {
      setHidden(true);
    } else {
      setHidden(false);
    }
    setPrevScroll(latest);
  });

  function resetStoreView() {
    setSelectedCategory(null);
    setSearchQuery("");
    setShowAllProducts(false);
    setIsMenuOpen(false);
    setIsSearchOpen(false);
  }

  function openShopView() {
    setSelectedCategory(null);
    setSearchQuery("");
    setShowAllProducts(true);
    setIsMenuOpen(false);
    setIsSearchOpen(false);
  }

  function submitSearch(event) {
    event.preventDefault();
    setSelectedCategory(null);
    setShowAllProducts(true);
    setIsMenuOpen(false);
    setIsSearchOpen(false);
  }

  function clearSearch() {
    setSearchQuery("");
    setShowAllProducts(false);
  }

  function prepareShopifyAccountNavigation(e) {
    e?.preventDefault();
    setIsMenuOpen(false);
    setIsSearchOpen(false);
    window.location.href = shopifyLoginUrl;
  }

  function prepareShopifyCartNavigation(e) {
    e?.preventDefault();
    setIsMenuOpen(false);
    setIsSearchOpen(false);
    setIsCartOpen(true);
  }

  return (
    <motion.header
      className="site-header"
      variants={{
        visible: { y: 0 },
        hidden: { y: "-100%" },
      }}
      animate={hidden ? "hidden" : "visible"}
      transition={{ duration: 0.35, ease: "easeInOut" }}
    >
      <div className="navbar-container">
        <nav className="navbar-links" aria-label="Primary navigation">
          <Link href="/" onClick={resetStoreView}>
            Home
          </Link>
          <Link href="/shop" onClick={() => setIsMenuOpen(false)}>
            Shop
          </Link>
        </nav>

        <Link href="/" className="brand navbar-brand" aria-label="Pubesto home" onClick={resetStoreView}>
          Pubesto
        </Link>

        <div className="navbar-actions">
          <button
            className="navbar-icon"
            type="button"
            aria-label="Search products"
            aria-expanded={isSearchOpen}
            onClick={() => {
              setIsMenuOpen(false);
              setIsSearchOpen((open) => !open);
            }}
          >
            <SearchIcon />
          </button>
          <button
            className="navbar-icon"
            type="button"
            aria-label="Open profile"
            onClick={prepareShopifyAccountNavigation}
          >
            <UserIcon />
          </button>
          <button
            className="navbar-icon navbar-cart cart-action"
            type="button"
            aria-label={`Open cart with ${cartCount} item${cartCount === 1 ? "" : "s"}`}
            onClick={prepareShopifyCartNavigation}
          >
            <motion.div
              key={cartPulseKey}
              className="cart-icon-wrapper"
              animate={
                cartPulseKey
                  ? { scale: [1, 1.18, 1], rotate: [0, -5, 4, 0] }
                  : { scale: 1, rotate: 0 }
              }
              transition={{ duration: 0.5, ease: "easeOut" }}
            >
              <ShoppingBag />
              <span className="cart-count">{cartCount}</span>
            </motion.div>
          </button>
        </div>

        <button
          className="mobile-menu-toggle"
          type="button"
          onClick={() => {
            setIsSearchOpen(false);
            setIsMenuOpen((open) => !open);
          }}
          aria-label="Toggle menu"
          aria-expanded={isMenuOpen}
        >
          <MenuIcon open={isMenuOpen} />
        </button>
      </div>

      {/* Search drawer is now rendered globally by Drawers.jsx */}

      <div className={`mobile-nav-content ${isMenuOpen ? "open" : ""}`}>
        <div className="mobile-nav-header">
          <span className="mobile-nav-logo">Pubesto</span>
        </div>
        
        <div className="mobile-nav-links">
          <Link href="/" className="mobile-nav-item" onClick={() => { resetStoreView(); setIsMenuOpen(false); }}>
            <span className="mobile-nav-item-content">
              <Home size={20} />
              <span>Home</span>
            </span>
            <ChevronRight size={18} className="chevron-icon" />
          </Link>

          <Link href="/shop" className="mobile-nav-item" onClick={() => setIsMenuOpen(false)}>
            <span className="mobile-nav-item-content">
              <LucideShoppingBag size={20} />
              <span>Shop</span>
            </span>
            <ChevronRight size={18} className="chevron-icon" />
          </Link>

          <button className="mobile-nav-item" type="button" onClick={() => { setIsMenuOpen(false); prepareShopifyAccountNavigation(); }}>
            <span className="mobile-nav-item-content">
              <User size={20} />
              <span>Profile</span>
            </span>
            <ChevronRight size={18} className="chevron-icon" />
          </button>

          <button className="mobile-nav-item" type="button" onClick={() => { setIsMenuOpen(false); prepareShopifyCartNavigation(); }}>
            <span className="mobile-nav-item-content">
              <ShoppingCart size={20} />
              <span>Cart</span>
            </span>
            <span className="mobile-nav-item-right">
              {cartCount > 0 && <span className="mobile-cart-badge">{cartCount}</span>}
              <ChevronRight size={18} className="chevron-icon" />
            </span>
          </button>
        </div>

        <div className="mobile-nav-footer">
          <p className="mobile-nav-footer-title">Need help?</p>
          <a href="mailto:support@pubesto.com" className="mobile-nav-footer-link">support@pubesto.com</a>
          <p className="mobile-nav-footer-hours">Mon - Sat: 10AM - 7PM</p>
        </div>
      </div>
    </motion.header>
  );
}
