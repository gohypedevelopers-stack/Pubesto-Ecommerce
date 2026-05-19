"use client";

import { useStore } from "./StoreContext";
import { SearchIcon, ShoppingBag, UserIcon, MenuIcon } from "./Icons";
import { useState, useEffect, useRef } from "react";
import { motion, useScroll, useMotionValueEvent, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getShopifyAccountUrl, getShopifyAccountLoginUrl } from "../lib/shopify";

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
        <Link href="/" onClick={resetStoreView}>
          Home
        </Link>
        <Link href="/shop" onClick={() => setIsMenuOpen(false)}>
          Shop
        </Link>

        <button className="mobile-drawer-trigger" type="button" onClick={prepareShopifyAccountNavigation}>
          Profile
        </button>
        <button className="mobile-drawer-trigger" type="button" onClick={prepareShopifyCartNavigation}>
          Cart ({cartCount})
        </button>
      </div>
    </motion.header>
  );
}
