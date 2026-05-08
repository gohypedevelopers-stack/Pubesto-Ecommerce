"use client";

import { useStore } from "./StoreContext";
import { UserIcon } from "./Icons";
import { formatPrice } from "../lib/utils";

export default function Drawers() {
  const {
    isCartOpen, setIsCartOpen,
    isProfileOpen, setIsProfileOpen,
    cartItems, cartCount, cartTotal,
    updateCartQuantity, removeFromCart, checkout,
    profileNotice, setProfileNotice,
    getProductPrice
  } = useStore();

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
          <button
            className="cart-backdrop"
            type="button"
            aria-label="Close profile panel"
            onClick={() => setIsProfileOpen(false)}
          />
          <aside className="cart-drawer utility-drawer" role="dialog" aria-modal="true" aria-label="Profile">
            <div className="cart-drawer-header">
              <div>
                <p className="eyebrow">Your account</p>
                <h2>Profile</h2>
              </div>
              <button type="button" onClick={() => setIsProfileOpen(false)} aria-label="Close profile panel">
                Close
              </button>
            </div>

            <div className="utility-panel-body">
              <div className="profile-summary">
                <span aria-hidden="true">
                  <UserIcon />
                </span>
                <div>
                  <strong>Welcome to Pubesto</strong>
                  <p>Sign in to track orders, save addresses, and manage your wishlist.</p>
                </div>
              </div>

              <form
                className="utility-form"
                onSubmit={(event) => {
                  event.preventDefault();
                  setProfileNotice("Sign-in request received.");
                }}
              >
                <label htmlFor="profile-phone">Mobile number or email</label>
                <input id="profile-phone" type="text" placeholder="Enter mobile number or email" />
                <button type="submit">Continue</button>
              </form>
              {profileNotice ? <p className="utility-notice">{profileNotice}</p> : null}

              <div className="utility-link-list" aria-label="Profile shortcuts">
                <a href="#featured" onClick={() => setIsProfileOpen(false)}>
                  Orders
                </a>
                <a href="#featured" onClick={() => setIsProfileOpen(false)}>
                  Wishlist
                </a>
                <a href="#footer" onClick={() => setIsProfileOpen(false)}>
                  Help & support
                </a>
              </div>
            </div>
          </aside>
        </div>
      )}
    </>
  );
}
