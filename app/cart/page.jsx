"use client";

import { useStore } from "../../components/StoreContext";
import { formatPrice } from "../../lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ShoppingBag, 
  Trash2, 
  Plus, 
  Minus, 
  ChevronRight, 
  ShieldCheck, 
  Truck, 
  RefreshCcw,
  ArrowLeft
} from "lucide-react";
import Link from "next/link";

export default function CartPage() {
  const { 
    cartItems, 
    cartTotal, 
    updateCartQuantity, 
    removeFromCart, 
    checkout,
    getProductPrice,
    getProductId 
  } = useStore();

  const isEmpty = cartItems.length === 0;

  return (
    <main className="cart-page-wrapper">
      <div className="cart-page-container">
        {/* Page Header */}
        <header className="cart-page-header">
          <Link href="/" className="back-link">
            <ArrowLeft size={18} />
            <span>Continue Shopping</span>
          </Link>
          <h1>Your Shopping Cart</h1>
          {!isEmpty && (
            <p className="cart-count-subtitle">{cartItems.length} unique items in your bag</p>
          )}
        </header>

        <div className="cart-content-layout">
          {isEmpty ? (
            <motion.div 
              className="cart-empty-state"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="empty-icon-wrapper">
                <ShoppingBag size={48} />
              </div>
              <h2>Your bag is feeling light</h2>
              <p>Looks like you haven't added any artisanal essentials to your cart yet.</p>
              <Link href="/shop" className="primary-cta-btn">
                Explore Collection
              </Link>
            </motion.div>
          ) : (
            <>
              {/* Left Column: Items */}
              <section className="cart-items-column">
                <div className="cart-items-list">
                  <AnimatePresence mode="popLayout">
                    {cartItems.map((item, index) => (
                      <motion.article 
                        key={item.id}
                        className="full-cart-item"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        <div className="item-main-info">
                          <Link href={`/product/${item.product.slug}`} className="item-image">
                            <img src={item.product.image} alt={item.product.name} />
                          </Link>
                          <div className="item-details">
                            <Link href={`/product/${item.product.slug}`}>
                              <h3>{item.product.name}</h3>
                            </Link>
                            {item.color && <p className="item-variant">Color: <span>{item.color}</span></p>}
                            <p className="item-unit-price">{formatPrice(getProductPrice(item.product))}</p>
                          </div>
                        </div>

                        <div className="item-actions-row">
                          <div className="quantity-manager-v2">
                            <button 
                              onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                              aria-label="Decrease quantity"
                            >
                              <Minus size={16} />
                            </button>
                            <span className="qty-value">{item.quantity}</span>
                            <button 
                              onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                              aria-label="Increase quantity"
                            >
                              <Plus size={16} />
                            </button>
                          </div>
                          
                          <div className="item-total-price">
                            {formatPrice(getProductPrice(item.product) * item.quantity)}
                          </div>

                          <button 
                            className="remove-item-btn"
                            onClick={() => removeFromCart(item.id)}
                            aria-label="Remove item"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </motion.article>
                    ))}
                  </AnimatePresence>
                </div>

                <div className="cart-trust-footer">
                  <div className="trust-card">
                    <Truck size={20} />
                    <div>
                      <strong>Free Shipping</strong>
                      <p>On all orders above ₹999</p>
                    </div>
                  </div>
                  <div className="trust-card">
                    <RefreshCcw size={20} />
                    <div>
                      <strong>Easy Returns</strong>
                      <p>7-day worry-free return policy</p>
                    </div>
                  </div>
                </div>
              </section>

              {/* Right Column: Summary */}
              <aside className="cart-summary-column">
                <div className="sticky-summary-card">
                  <h2>Order Summary</h2>
                  
                  <div className="summary-rows">
                    <div className="summary-row">
                      <span>Subtotal</span>
                      <span>{formatPrice(cartTotal)}</span>
                    </div>
                    <div className="summary-row">
                      <span>Shipping</span>
                      <span className="free-text">FREE</span>
                    </div>
                    <div className="summary-row promo-row">
                      <span>Applied Discount</span>
                      <span className="discount-text">-₹0.00</span>
                    </div>
                  </div>

                  <div className="total-divider" />
                  
                  <div className="grand-total-row">
                    <span>Total Amount</span>
                    <span className="total-amount">{formatPrice(cartTotal)}</span>
                  </div>

                  <p className="tax-notice">Taxes and shipping calculated at checkout</p>

                  <button 
                    className="checkout-primary-btn"
                    onClick={() => checkout()}
                  >
                    Proceed to Checkout
                    <ChevronRight size={20} />
                  </button>

                  <div className="secure-checkout-badge">
                    <ShieldCheck size={16} />
                    <span>Secure Checkout via Shopify</span>
                  </div>

                  <div className="payment-icons-row">
                    <img src="/images/payments/gpay.svg" alt="Google Pay" />
                    <img src="/images/payments/mastercard.svg" alt="Mastercard" />
                    <img src="/images/payments/upi.svg" alt="UPI" />
                  </div>
                </div>
              </aside>
            </>
          )}
        </div>
      </div>
    </main>
  );
}
