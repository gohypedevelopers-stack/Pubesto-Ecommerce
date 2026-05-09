"use client";

import { useStore } from "./StoreContext";
import { SearchIcon, ShoppingBag, UserIcon, MenuIcon } from "./Icons";
import { useState, useEffect } from "react";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import Link from "next/link";

export default function Header() {
  const {
    isMenuOpen, setIsMenuOpen,
    isCartOpen, setIsCartOpen,
    isProfileOpen, setIsProfileOpen,
    isSearchOpen, setIsSearchOpen,
    searchQuery, setSearchQuery,
    cartCount, cartPulseKey,
    closeUtilityPanels,
    setSelectedCategory, setShowAllProducts
  } = useStore();

  const { scrollY } = useScroll();
  const [hidden, setHidden] = useState(false);
  const [prevScroll, setPrevScroll] = useState(0);

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
            aria-expanded={isProfileOpen}
            onClick={() => {
              closeUtilityPanels();
              setIsSearchOpen(false);
              setIsProfileOpen(true);
            }}
          >
            <UserIcon />
          </button>
          <button
            className="navbar-icon navbar-cart cart-action"
            type="button"
            aria-label={`Open cart with ${cartCount} item${cartCount === 1 ? "" : "s"}`}
            aria-expanded={isCartOpen}
            onClick={() => {
              closeUtilityPanels();
              setIsSearchOpen(false);
              setIsCartOpen(true);
            }}
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

      {isSearchOpen ? (
        <form className="search navbar-search-panel" role="search" onSubmit={submitSearch}>
          <SearchIcon />
          <label className="sr-only" htmlFor="site-search">
            Search products
          </label>
          <input
            id="site-search"
            type="search"
            placeholder="Try 'Lunch Box' or Search by Product..."
            value={searchQuery}
            onChange={(event) => {
              setSearchQuery(event.target.value);
              setSelectedCategory(null);
              setShowAllProducts(true);
            }}
          />
          {searchQuery ? (
            <button className="search-clear" type="button" onClick={clearSearch} aria-label="Clear search">
              x
            </button>
          ) : null}
        </form>
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
          <input
            id="mobile-site-search"
            type="search"
            placeholder="Search products"
            value={searchQuery}
            onChange={(event) => {
              setSearchQuery(event.target.value);
              setSelectedCategory(null);
              setShowAllProducts(true);
            }}
          />
          <button type="submit">Search</button>
        </form>
        <button
          type="button"
          onClick={() => {
            setIsMenuOpen(false);
            closeUtilityPanels();
            setIsProfileOpen(true);
          }}
        >
          Profile
        </button>
        <button
          type="button"
          onClick={() => {
            setIsMenuOpen(false);
            closeUtilityPanels();
            setIsCartOpen(true);
          }}
        >
          Cart ({cartCount})
        </button>
      </div>
    </motion.header>
  );
}
