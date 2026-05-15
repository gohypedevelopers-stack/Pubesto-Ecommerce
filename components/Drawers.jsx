"use client";

import { useStore } from "./StoreContext";
import { UserIcon } from "./Icons";
import { formatPrice } from "../lib/utils";
import { motion } from "framer-motion";
import { ChevronRight, ExternalLink, LogIn, MapPin, Package } from "lucide-react";
import { useEffect } from "react";
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
    openShopifyCart
  } = useStore();
  const shopifyAccountUrl = getShopifyAccountUrl();
  const shopifyLoginUrl = getShopifyAccountLoginUrl();
  const shopifyAddressesUrl = getShopifyAccountAddressesUrl();

  useEffect(() => {
    if (isCartOpen) {
      setIsCartOpen(false);
      openShopifyCart();
    }
  }, [isCartOpen]);

  if (!isProfileOpen) {
    return null;
  }

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
    </>
  );
}
