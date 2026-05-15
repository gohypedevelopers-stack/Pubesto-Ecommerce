"use client";

import { useStore } from "./StoreContext";
import { SearchIcon, ShoppingBag, UserIcon, MenuIcon } from "./Icons";
import { useState, useEffect, useRef } from "react";
import { motion, useScroll, useMotionValueEvent, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getShopifyAccountUrl } from "../lib/shopify";

export default function Header() {
  const {
    isMenuOpen, setIsMenuOpen,
    isCartOpen,
    isProfileOpen,
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

  function prepareShopifyAccountNavigation() {
    setIsMenuOpen(false);
    closeUtilityPanels();
    setIsSearchOpen(false);
  }

  function prepareShopifyCartNavigation() {
    setIsMenuOpen(false);
    closeUtilityPanels();
    setIsSearchOpen(false);
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
          <a
            className="navbar-icon"
            href={shopifyAccountUrl}
            aria-label="Open Shopify account"
            onClick={prepareShopifyAccountNavigation}
          >
            <UserIcon />
          </a>
          <a
            className="navbar-icon navbar-cart cart-action"
            href={shopifyCartUrl}
            aria-label={`Open Shopify cart with ${cartCount} item${cartCount === 1 ? "" : "s"}`}
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
          </a>
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

      {isSearchOpen ? (
        <>
          <motion.div 
            className="search-backdrop" 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsSearchOpen(false)}
          />
          <form className="search navbar-search-panel" role="search" onSubmit={submitSearch}>
            <SearchIcon />
            <label className="sr-only" htmlFor="site-search">
              Search products
            </label>
            <input
              ref={searchInputRef}
              id="site-search"
              type="search"
              placeholder="Try 'Lunch Box' or Search by Product..."
              value={searchQuery}
              autoComplete="off"
              onKeyDown={(e) => handleKeyDown(e)}
              onChange={(event) => {
                setSearchQuery(event.target.value);
                setSelectedCategory(null);
              }}
            />
            {searchQuery ? (
              <button className="search-clear" type="button" onClick={clearSearch} aria-label="Clear search">
                x
              </button>
            ) : null}

            <AnimatePresence>
              {searchQuery.trim().length >= 2 && (
                <motion.div 
                  className="search-results-dropdown"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                >
                  {filteredResults.length > 0 ? (
                    filteredResults.map((product, index) => (
                      <Link
                        key={product.slug}
                        href={`/product/${product.slug}`}
                        className={`search-result-item ${index === activeIndex ? 'active' : ''}`}
                        onClick={() => {
                          setIsSearchOpen(false);
                          setSearchQuery("");
                        }}
                        onMouseEnter={() => setActiveIndex(index)}
                      >
                        <div className="search-result-image">
                          <img src={product.image} alt="" />
                        </div>
                        <div className="search-result-info">
                          <h4>{product.name}</h4>
                          <p>{product.price}</p>
                        </div>
                      </Link>
                    ))
                  ) : (
                    <div className="search-no-results">
                      <p>No products found for "{searchQuery}"</p>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </form>
        </>
      ) : null}

      <div className={`mobile-nav-content ${isMenuOpen ? "open" : ""}`}>
        <Link href="/" onClick={resetStoreView}>
          Home
        </Link>
        <Link href="/shop" onClick={() => setIsMenuOpen(false)}>
          Shop
        </Link>
        <form className="mobile-search" role="search" onSubmit={submitSearch}>
          <label className="sr-only" htmlFor="mobile-site-search">
            Search products
          </label>
          <div style={{ position: 'relative', width: '100%' }}>
            <input
              ref={mobileSearchInputRef}
              id="mobile-site-search"
              type="search"
              placeholder="Search products"
              value={searchQuery}
              autoComplete="off"
              onKeyDown={(e) => handleKeyDown(e, true)}
              onChange={(event) => {
                setSearchQuery(event.target.value);
                setSelectedCategory(null);
              }}
            />
            <AnimatePresence>
              {searchQuery.trim().length >= 2 && (
                <motion.div 
                  className="search-results-dropdown"
                  style={{ position: 'absolute', top: '100%', left: 0, right: 0, marginTop: '8px' }}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 5 }}
                >
                  {filteredResults.length > 0 ? (
                    filteredResults.map((product, index) => (
                      <Link
                        key={product.slug}
                        href={`/product/${product.slug}`}
                        className={`search-result-item ${index === activeIndex ? 'active' : ''}`}
                        onClick={() => {
                          setIsMenuOpen(false);
                          setSearchQuery("");
                        }}
                        onMouseEnter={() => setActiveIndex(index)}
                      >
                        <div className="search-result-image" style={{ width: '40px', height: '40px' }}>
                          <img src={product.image} alt="" />
                        </div>
                        <div className="search-result-info">
                          <h4 style={{ fontSize: '13px' }}>{product.name}</h4>
                          <p style={{ fontSize: '12px' }}>{product.price}</p>
                        </div>
                      </Link>
                    ))
                  ) : (
                    <div className="search-no-results" style={{ padding: '16px' }}>
                      <p style={{ fontSize: '13px' }}>No products found</p>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <button type="submit">Search</button>
        </form>
        <a href={shopifyAccountUrl} onClick={prepareShopifyAccountNavigation}>
          Profile
        </a>
        <a href={shopifyCartUrl} onClick={prepareShopifyCartNavigation}>
          Cart ({cartCount})
        </a>
      </div>
    </motion.header>
  );
}
