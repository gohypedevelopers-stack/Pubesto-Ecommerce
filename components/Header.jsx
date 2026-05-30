"use client";

import { useStore } from "./StoreContext";
import { SearchIcon, ShoppingBag, UserIcon, MenuIcon } from "./Icons";
import { useState, useEffect, useRef } from "react";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { Home, ShoppingBag as LucideShoppingBag, User, ShoppingCart, ChevronRight, Eye, EyeOff, Package, Truck, LogOut } from "lucide-react";

export default function Header() {
  const {
    isMenuOpen, setIsMenuOpen,
    isCartOpen, setIsCartOpen,
    isProfileOpen,
    isSearchOpen, setIsSearchOpen,
    searchQuery, setSearchQuery,
    cartCount, cartPulseKey,
    closeUtilityPanels,
    setSelectedCategory, setShowAllProducts,
    products,
    isLoggedIn,
    user,
    logout,
    refreshAuthSession
  } = useStore();

  const { scrollY } = useScroll();
  const [hidden, setHidden] = useState(false);
  const [prevScroll, setPrevScroll] = useState(0);
  const [activeIndex, setActiveIndex] = useState(-1);
  const router = useRouter();
  const pathname = usePathname();
  const searchInputRef = useRef(null);

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

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [authMode, setAuthMode] = useState("login");
  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [signupForm, setSignupForm] = useState({ name: "", email: "", phone: "", password: "" });
  const [forgotEmail, setForgotEmail] = useState("");
  const [authMessage, setAuthMessage] = useState("");
  const [authMessageKind, setAuthMessageKind] = useState("success");
  const [authLoading, setAuthLoading] = useState(false);
  const [hoverTimeout, setHoverTimeout] = useState(null);
  const [resetUrl, setResetUrl] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  function handleMouseEnter() {
    if (hoverTimeout) {
      clearTimeout(hoverTimeout);
      setHoverTimeout(null);
    }
    setIsDropdownOpen(true);
  }

  function handleMouseLeave() {
    const timeout = setTimeout(() => {
      setIsDropdownOpen(false);
    }, 300);
    setHoverTimeout(timeout);
  }

  async function handlePopupAuth(event) {
    event.preventDefault();
    setAuthLoading(true);
    setAuthMessage("");
    setAuthMessageKind("success");

    try {
      const endpoint = authMode === "signup" ? "/api/auth/signup" : "/api/auth/login";
      const payload = authMode === "signup"
        ? {
            ...signupForm,
            name: signupForm.name.trim(),
            email: signupForm.email.trim().toLowerCase(),
            phone: signupForm.phone.trim(),
          }
        : {
            ...loginForm,
            email: loginForm.email.trim().toLowerCase(),
          };
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        setAuthMessage(data.error || "Authentication failed.");
        setAuthMessageKind("error");
        return;
      }

      const nextUser = await refreshAuthSession?.();
      if (!nextUser && !data.user) {
        setAuthMessage("Account created, but session could not load.");
        setAuthMessageKind("error");
        setAuthMode("login");
        return;
      }

      setAuthMessage("Successfully signed in!");
      setAuthMessageKind("success");
      
      setTimeout(() => {
        setIsDropdownOpen(false);
        setAuthMessage("");
      }, 1000);
    } catch {
      setAuthMessage("Network error. Please try again.");
      setAuthMessageKind("error");
    } finally {
      setAuthLoading(false);
    }
  }

  async function handlePopupForgot(event) {
    event.preventDefault();
    setAuthLoading(true);
    setAuthMessage("");
    setAuthMessageKind("success");

    try {
      const email = forgotEmail.trim().toLowerCase();
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        setAuthMessage(data.error || "Password reset failed.");
        setAuthMessageKind("error");
        return;
      }

      setAuthMessage(data.resetPath ? "Password reset link is ready for local testing." : (data.message || "Reset link prepared!"));
      setAuthMessageKind("success");
      setResetUrl(data.resetPath || data.resetUrl || "");
    } catch {
      setAuthMessage("Network error. Please try again.");
      setAuthMessageKind("error");
    } finally {
      setAuthLoading(false);
    }
  }

  function prepareAccountNavigation(e) {
    e?.preventDefault();
    setIsMenuOpen(false);
    setIsSearchOpen(false);
    closeUtilityPanels();
    router.push(isLoggedIn ? "/account" : "/account/login");
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
          <div 
            className="profile-dropdown-container"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <button
              className="navbar-icon"
              type="button"
              aria-label="Open profile"
              onClick={prepareAccountNavigation}
            >
              <UserIcon />
            </button>
            
            {isDropdownOpen && (
              <div className="profile-dropdown-popup">
                {isLoggedIn && user ? (
                  <div className="dropdown-authed">
                    <div className="dropdown-welcome-wrapper">
                      <div className="dropdown-avatar">
                        {user.name ? user.name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2) : "C"}
                      </div>
                      <div>
                        <p className="dropdown-welcome-label">Welcome,</p>
                        <p className="dropdown-welcome-name"><strong>{user.name || "Customer"}</strong></p>
                      </div>
                    </div>
                    <div className="dropdown-divider" />
                    <Link 
                      href="/account" 
                      className={`dropdown-item ${pathname === "/account" ? "active" : ""}`} 
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      <User size={15} />
                      My Profile
                    </Link>
                    <Link 
                      href="/orders/cancel" 
                      className={`dropdown-item ${pathname === "/orders/cancel" ? "active" : ""}`} 
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      <Package size={15} />
                      My Orders
                    </Link>
                    <Link 
                      href="/returns/track" 
                      className={`dropdown-item ${pathname === "/returns/track" ? "active" : ""}`} 
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      <Truck size={15} />
                      Track Order
                    </Link>
                    <div className="dropdown-divider" />
                    <button 
                      className="dropdown-btn-logout" 
                      type="button" 
                      onClick={async () => {
                        await logout();
                        setIsDropdownOpen(false);
                        router.push("/");
                      }}
                    >
                      <LogOut size={14} />
                      Logout
                    </button>
                  </div>
                ) : (
                  <div className="dropdown-auth">
                    <div className="dropdown-tabs">
                      <button 
                        className={authMode === "login" ? "active" : ""} 
                        type="button" 
                        onClick={() => { setAuthMode("login"); setAuthMessage(""); setResetUrl(""); setShowPassword(false); }}
                      >
                        Login
                      </button>
                      <button 
                        className={authMode === "signup" ? "active" : ""} 
                        type="button" 
                        onClick={() => { setAuthMode("signup"); setAuthMessage(""); setResetUrl(""); setShowPassword(false); }}
                      >
                        Signup
                      </button>
                      <button 
                        className={authMode === "forgot" ? "active" : ""} 
                        type="button" 
                        onClick={() => { setAuthMode("forgot"); setAuthMessage(""); setResetUrl(""); setShowPassword(false); }}
                      >
                        Forgot
                      </button>
                    </div>

                    {authMode === "forgot" ? (
                      <form onSubmit={handlePopupForgot} className="dropdown-form">
                        <label>
                          <span>Email address</span>
                          <input 
                            type="email" 
                            value={forgotEmail} 
                            onChange={(e) => setForgotEmail(e.target.value)} 
                            placeholder="you@example.com" 
                            required 
                          />
                        </label>
                        {authMessage && (
                          <p className={`dropdown-message ${authMessageKind === "error" ? "error" : ""}`}>
                            {authMessage}
                          </p>
                        )}
                        {resetUrl && (
                          resetUrl.startsWith("/") ? (
                            <Link 
                              className="dropdown-reset-link" 
                              href={resetUrl} 
                              onClick={() => {
                                setIsDropdownOpen(false);
                                setResetUrl("");
                              }}
                            >
                              Continue to reset password
                            </Link>
                          ) : (
                            <a 
                              className="dropdown-reset-link" 
                              href={resetUrl} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              onClick={() => {
                                setIsDropdownOpen(false);
                                setResetUrl("");
                              }}
                            >
                              Continue to reset password
                            </a>
                          )
                        )}
                        <button type="submit" className="dropdown-submit" disabled={authLoading}>
                          {authLoading ? "Sending..." : "Reset Password"}
                        </button>
                      </form>
                    ) : (
                      <form onSubmit={handlePopupAuth} className="dropdown-form">
                        {authMode === "signup" && (
                          <>
                            <label>
                              <span>Full name</span>
                              <input 
                                type="text" 
                                value={signupForm.name} 
                                onChange={(e) => setSignupForm(prev => ({ ...prev, name: e.target.value }))} 
                                placeholder="Your name" 
                                required 
                              />
                            </label>
                            <label>
                              <span>Phone</span>
                              <input 
                                type="tel" 
                                value={signupForm.phone} 
                                onChange={(e) => setSignupForm(prev => ({ ...prev, phone: e.target.value }))} 
                                placeholder="Optional" 
                              />
                            </label>
                          </>
                        )}
                        <label>
                          <span>Email address</span>
                          <input 
                            type="email" 
                            value={authMode === "signup" ? signupForm.email : loginForm.email} 
                            onChange={(e) => authMode === "signup" 
                              ? setSignupForm(prev => ({ ...prev, email: e.target.value }))
                              : setLoginForm(prev => ({ ...prev, email: e.target.value }))
                            } 
                            placeholder="you@example.com" 
                            required 
                          />
                        </label>
                        <label>
                          <span>Password</span>
                          <div className="dropdown-password-wrap">
                            <input 
                              type={showPassword ? "text" : "password"} 
                              value={authMode === "signup" ? signupForm.password : loginForm.password} 
                              onChange={(e) => authMode === "signup" 
                                ? setSignupForm(prev => ({ ...prev, password: e.target.value }))
                                : setLoginForm(prev => ({ ...prev, password: e.target.value }))
                              } 
                              placeholder="At least 8 chars" 
                              required 
                              minLength={8}
                            />
                            <button
                              type="button"
                              className="dropdown-password-toggle"
                              onClick={() => setShowPassword(!showPassword)}
                              aria-label={showPassword ? "Hide password" : "Show password"}
                            >
                              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                            </button>
                          </div>
                        </label>
                        {authMessage && (
                          <p className={`dropdown-message ${authMessageKind === "error" ? "error" : ""}`}>
                            {authMessage}
                          </p>
                        )}
                        <button type="submit" className="dropdown-submit" disabled={authLoading}>
                          {authLoading ? "Please wait..." : authMode === "signup" ? "Create Account" : "Login"}
                        </button>
                      </form>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
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

          <button className="mobile-nav-item" type="button" onClick={() => { setIsMenuOpen(false); prepareAccountNavigation(); }}>
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
