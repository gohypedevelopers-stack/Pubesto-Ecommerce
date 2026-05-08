"use client";

import { useStore } from "./StoreContext";
import { UserIcon } from "./Icons";
import { formatPrice } from "../lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, LogOut, Package, Heart, HelpCircle } from "lucide-react";
import { useState } from "react";

export default function Drawers() {
  const {
    isCartOpen, setIsCartOpen,
    isProfileOpen, setIsProfileOpen,
    cartItems, cartCount, cartTotal,
    updateCartQuantity, removeFromCart, checkout,
    profileNotice, setProfileNotice,
    getProductPrice
  } = useStore();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [emailInput, setEmailInput] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isCartOpen && !isProfileOpen) return null;

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
            <div className="cart-drawer-header">
              <div>
                <p className="eyebrow">Your cart</p>
                <h2>{cartCount} item{cartCount === 1 ? "" : "s"} selected</h2>
              </div>
              <button type="button" onClick={() => setIsCartOpen(false)} aria-label="Close cart">
                Close
              </button>
            </div>

            {cartItems.length > 0 ? (
              <>
                <div className="cart-items">
                  {cartItems.map((item) => (
                    <article className="cart-item" key={item.id}>
                      <div className="cart-item-media">
                        {item.product.image ? (
                          <img src={item.product.image} alt={item.product.name} />
                        ) : (
                          <span>Image pending</span>
                        )}
                      </div>
                      <div className="cart-item-body">
                        <h3>{item.product.name}</h3>
                        <p>{formatPrice(getProductPrice(item.product))}</p>
                        <div className="quantity-control" aria-label={`Quantity for ${item.product.name}`}>
                          <button
                            type="button"
                            onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                            aria-label={`Decrease ${item.product.name} quantity`}
                          >
                            -
                          </button>
                          <span>{item.quantity}</span>
                          <button
                            type="button"
                            onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                            aria-label={`Increase ${item.product.name} quantity`}
                          >
                            +
                          </button>
                        </div>
                      </div>
                      <button className="remove-item" type="button" onClick={() => removeFromCart(item.id)}>
                        Remove
                      </button>
                    </article>
                  ))}
                </div>
                <div className="cart-summary">
                  <div>
                    <span>Subtotal</span>
                    <strong>{formatPrice(cartTotal)}</strong>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      checkout();
                    }}
                  >
                    Checkout
                  </button>
                </div>
              </>
            ) : (
              <div className="empty-cart">
                <h3>Your cart is empty</h3>
                <p>Add products from the featured section to see them here.</p>
                <button type="button" onClick={() => setIsCartOpen(false)}>
                  Continue shopping
                </button>
              </div>
            )}
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
                <h2 style={{ color: '#fff' }}>{isLoggedIn ? "Account Dashboard" : "Profile"}</h2>
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
              <AnimatePresence mode="wait">
                {!isLoggedIn ? (
                  <motion.div 
                    key="login"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="login-view"
                  >
                    <div className="profile-summary premium-card">
                      <div className="avatar-glow">
                        <UserIcon />
                      </div>
                      <div>
                        <strong>Welcome to Pubesto</strong>
                        <p>Sign in to track orders, save addresses, and manage your wishlist.</p>
                      </div>
                    </div>

                    <form
                      className="utility-form premium-form"
                      onSubmit={(event) => {
                        event.preventDefault();
                        if (!emailInput) return;
                        setIsSubmitting(true);
                        setTimeout(() => {
                          setIsLoggedIn(true);
                          setIsSubmitting(false);
                          setProfileNotice("Successfully signed in!");
                        }, 1200);
                      }}
                    >
                      <div className="form-group">
                        <label htmlFor="profile-phone">Mobile number or email</label>
                        <input 
                          id="profile-phone" 
                          type="text" 
                          placeholder="e.g. hello@artisanal.com" 
                          value={emailInput}
                          onChange={(e) => setEmailInput(e.target.value)}
                          required
                        />
                      </div>
                      <button type="submit" disabled={isSubmitting} className="action-button">
                        {isSubmitting ? "Processing..." : "Continue"}
                      </button>
                    </form>
                  </motion.div>
                ) : (
                  <motion.div 
                    key="dashboard"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="dashboard-view"
                  >
                    <div className="user-header">
                      <div className="user-avatar">{emailInput[0]?.toUpperCase() || "U"}</div>
                      <div className="user-info">
                        <h3>Artisanal Member</h3>
                        <p>{emailInput}</p>
                      </div>
                    </div>

                    <div className="dashboard-stats">
                      <div className="stat-card">
                        <span>0</span>
                        <p>Orders</p>
                      </div>
                      <div className="stat-card">
                        <span>0</span>
                        <p>Wishlist</p>
                      </div>
                    </div>

                    <div className="utility-link-list interactive-list">
                      <button onClick={() => setIsProfileOpen(false)}>
                        <div className="link-icon"><Package size={18} /></div>
                        <span>My Orders</span>
                        <ChevronRight size={16} className="chevron" />
                      </button>
                      <button onClick={() => setIsProfileOpen(false)}>
                        <div className="link-icon"><Heart size={18} /></div>
                        <span>Wishlist</span>
                        <ChevronRight size={16} className="chevron" />
                      </button>
                      <button onClick={() => setIsProfileOpen(false)}>
                        <div className="link-icon"><HelpCircle size={18} /></div>
                        <span>Help & Support</span>
                        <ChevronRight size={16} className="chevron" />
                      </button>
                    </div>

                    <button className="logout-button" onClick={() => setIsLoggedIn(false)}>
                      <LogOut size={16} />
                      <span>Sign Out</span>
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
              
              {profileNotice && (
                <motion.p 
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
    </>
  );
}
