"use client";

import { useState } from "react";
import { motion } from "framer-motion";

const categories = [
  {
    name: "Home Decor",
    count: "128 products",
    image: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=600&q=80",
  },
  {
    name: "Kitchen",
    count: "96 products",
    image: "https://images.unsplash.com/photo-1556911220-bff31c812dba?auto=format&fit=crop&w=600&q=80",
  },
  {
    name: "Bottles",
    count: "42 products",
    image: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=600&q=80",
  },
  {
    name: "Fans",
    count: "2 products",
    image: "https://images.unsplash.com/photo-1556911220-bff31c812dba?auto=format&fit=crop&w=600&q=80",
  },
  {
    name: "Lunch Box",
    count: "38 products",
    image: "https://images.unsplash.com/photo-1543352634-a1c51d9f1fa7?auto=format&fit=crop&w=600&q=80",
  },
  {
    name: "Storage",
    count: "74 products",
    image: "https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?auto=format&fit=crop&w=600&q=80",
  },
  {
    name: "Textiles",
    count: "57 products",
    image: "https://images.unsplash.com/photo-1604578762246-41134e37f9cc?auto=format&fit=crop&w=600&q=80",
  },
  {
    name: "Gifting",
    count: "34 products",
    image: "https://images.unsplash.com/photo-1512909006721-3d6018887383?auto=format&fit=crop&w=600&q=80",
  },
  {
    name: "Sale",
    count: "24 products",
    image: "https://images.unsplash.com/photo-1511381939415-e44015466834?auto=format&fit=crop&w=600&q=80",
  },
];

const products = [
  {
    name: "Hammered Copper Bottle",
    price: "Rs. 899",
    oldPrice: "Rs. 1,199",
    badge: "New",
    detail: "Insulated daily carry",
    categories: ["Bottles", "Daily Carry"],
    rating: "4.8",
    reviews: "1,248",
    image: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=800&q=85",
  },
  {
    name: "Acacia Serving Bowl",
    price: "Rs. 1,450",
    badge: "Best Seller",
    badgeClass: "badge-dark",
    detail: "Hand-finished wood",
    categories: ["Kitchen", "Home Decor"],
    rating: "4.7",
    reviews: "864",
    image: "https://images.unsplash.com/photo-1601985705806-5b9a71f6004f?auto=format&fit=crop&w=800&q=85",
  },
  {
    name: "Stoneware Planter Set",
    price: "Rs. 1,099",
    oldPrice: "Rs. 1,399",
    badge: "20% Off",
    badgeClass: "badge-discount",
    detail: "Set of two planters",
    categories: ["Home Decor", "Storage"],
    rating: "4.6",
    reviews: "519",
    image: "https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&w=800&q=85",
  },
  {
    name: "Insulated Lunch Carrier",
    price: "Rs. 799",
    detail: "Compact workday storage",
    categories: ["Lunch Box", "Storage"],
    rating: "4.5",
    reviews: "410",
    image: "https://images.unsplash.com/photo-1543352634-a1c51d9f1fa7?auto=format&fit=crop&w=800&q=85",
  },
  {
    name: "Minimal Desk Organizer",
    price: "Rs. 650",
    badge: "Fresh Drop",
    detail: "Calm desk essentials",
    categories: ["Home Decor", "Storage"],
    rating: "4.4",
    reviews: "283",
    image: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=800&q=85",
  },
  {
    name: "Ribbed Glass Tumbler",
    price: "Rs. 399",
    oldPrice: "Rs. 549",
    detail: "Everyday glassware",
    categories: ["Kitchen", "Bottles"],
    rating: "4.6",
    reviews: "932",
    image: "https://images.unsplash.com/photo-1606813907291-d86efa9b94db?auto=format&fit=crop&w=800&q=85",
  },
  {
    name: "Cotton Table Runner",
    price: "Rs. 749",
    oldPrice: "Rs. 949",
    detail: "Soft woven cotton",
    categories: ["Textiles", "Home Decor"],
    rating: "4.3",
    reviews: "190",
    image: "https://images.unsplash.com/photo-1604578762246-41134e37f9cc?auto=format&fit=crop&w=800&q=85",
  },
  {
    name: "Matte Ceramic Vase",
    price: "Rs. 1,250",
    badge: "Limited",
    badgeClass: "badge-dark",
    detail: "Shelf-ready accent",
    categories: ["Home Decor", "Gifting"],
    rating: "4.7",
    reviews: "351",
    image: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=800&q=85",
  },
  {
    name: "V8 OTG Fan",
    slug: "v8-otg-fan",
    price: "Rs. 16",
    oldPrice: "Rs. 22",
    salePrice: 16,
    originalPrice: 22,
    badge: "27% Off",
    badgeClass: "badge-discount",
    detail: "OTG Fan | Mobile Fan",
    description: "Compact OTG fan for quick personal cooling while using compatible mobile devices.",
    categories: ["Fans"],
    rating: "4.8",
    reviews: "0",
    stock: 100,
    active: true,
    inStock: true,
    photoCount: "2 photos",
    image: "/images/products/new-products/v8-otg-fan.svg",
    imageFilename: "v8-otg-fan.svg",
  },
  {
    name: "RL-7064 Table Fan",
    slug: "rl-7064-table-fan",
    price: "Rs. 495",
    oldPrice: "Rs. 595",
    salePrice: 495,
    originalPrice: 595,
    badge: "17% Off",
    badgeClass: "badge-discount",
    detail: "Table Fan | Portable Fan",
    description: "Portable table fan for desk, bedside, and small-room personal cooling.",
    categories: ["Fans"],
    rating: "4.8",
    reviews: "0",
    stock: 100,
    active: true,
    inStock: true,
    photoCount: "2 photos",
    image: "/images/products/new-products/rl-7064-table-fan.svg",
    imageFilename: "rl-7064-table-fan.svg",
  },
  {
    name: "B-84 Unicorn Printed Temperature Bottle (Imported)",
    slug: "b-84-unicorn-printed-temperature-bottle-imported",
    price: "Rs. 132",
    oldPrice: "Rs. 195",
    salePrice: 132,
    originalPrice: 195,
    badge: "32% Off",
    badgeClass: "badge-discount",
    stockBadge: "Out of Stock",
    detail: "Temperature Bottle | Kids Bottle",
    description: "Imported unicorn printed temperature bottle for kids and daily carry.",
    categories: ["Bottles"],
    rating: "4.8",
    reviews: "0",
    stock: 0,
    active: true,
    inStock: false,
    photoCount: "3 photos",
    image: "/images/products/new-products/b-84-unicorn-printed-temperature-bottle.svg",
    imageFilename: "b-84-unicorn-printed-temperature-bottle.svg",
  },
  {
    name: "Transparent Leak Proof Lunch Box",
    slug: "transparent-leak-proof-lunch-box",
    price: "Rs. 55",
    oldPrice: "Rs. 95",
    salePrice: 55,
    originalPrice: 95,
    badge: "42% Off",
    badgeClass: "badge-discount",
    stockBadge: "Out of Stock",
    detail: "Lunch Box | Leak Proof",
    description: "Transparent leak proof lunch box for compact meal storage and daily use.",
    categories: ["Lunch Box", "Storage"],
    rating: "4.8",
    reviews: "0",
    stock: 0,
    active: true,
    inStock: false,
    image: "/images/products/new-products/transparent-leak-proof-lunch-box.svg",
    imageFilename: "transparent-leak-proof-lunch-box.svg",
  },
  {
    name: "B-07 Premium Nice Glass Bottle",
    slug: "b-07-premium-nice-glass-bottle",
    price: "Rs. 52",
    oldPrice: "Rs. 95",
    salePrice: 52,
    originalPrice: 95,
    badge: "45% Off",
    badgeClass: "badge-discount",
    stockBadge: "Out of Stock",
    detail: "Glass Bottle | Drinkware",
    description: "Premium glass bottle with a clean look for gifting, carry, and everyday drinkware.",
    categories: ["Bottles", "Gifting"],
    rating: "4.8",
    reviews: "0",
    stock: 0,
    active: true,
    inStock: false,
    photoCount: "5 photos",
    image: "/images/products/new-products/b-07-premium-nice-glass-bottle.svg",
    imageFilename: "b-07-premium-nice-glass-bottle.svg",
  },
];

function getProductId(product) {
  return product.sku || product.slug || product.name;
}

function getProductPrice(product) {
  if (typeof product.salePrice === "number") {
    return product.salePrice;
  }

  const rawPrice = String(product.price || "0").replace(/[^\d.]/g, "");
  return Number(rawPrice) || 0;
}

function formatPrice(value) {
  return `Rs. ${value.toLocaleString("en-IN")}`;
}

function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="11" cy="11" r="7" />
      <path d="m16.5 16.5 4 4" />
    </svg>
  );
}

function CartIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M6 7h14l-2 9H8L6 7Z" />
      <path d="M6 7 5.4 4H3" />
      <circle cx="9" cy="20" r="1" />
      <circle cx="17" cy="20" r="1" />
    </svg>
  );
}

function UserIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="7" r="4" />
      <path d="M4 21v-2a4 4 0 0 1 4-4h8a4 4 0 0 1 4 4v2" />
    </svg>
  );
}



function StoreIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  );
}

function MenuIcon({ open }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      {open ? (
        <>
          <path d="M6 6l12 12" />
          <path d="M18 6 6 18" />
        </>
      ) : (
        <>
          <path d="M4 7h16" />
          <path d="M4 12h16" />
          <path d="M4 17h16" />
        </>
      )}
    </svg>
  );
}

function ProductCard({ product, index = 0, cartQuantity = 0, onAddToCart }) {
  return (
    <motion.article
      className="product-card"
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: index * 0.04 }}
      viewport={{ once: true, margin: "-50px" }}
    >
      <a className="product-media" href="#featured" aria-label={`View ${product.name}`}>
        {product.badge ? (
          <span className={`badge ${product.badgeClass || ""}`}>{product.badge}</span>
        ) : null}
        {product.stockBadge ? <span className="stock-badge">{product.stockBadge}</span> : null}
        {!product.stockBadge ? (
          <span className="save-button" aria-hidden="true">
            +
          </span>
        ) : null}
        {product.image ? (
          <img src={product.image} alt={product.name} />
        ) : (
          <span className="product-image-todo">
            <strong>Product image pending</strong>
            <small>{product.imageFilename}</small>
          </span>
        )}
        {product.photoCount ? <span className="photo-count">{product.photoCount}</span> : null}
      </a>
      <div className="product-body">
        <p className="product-detail">{product.detail}</p>
        <h3>{product.name}</h3>
        {product.description ? <p className="product-description">{product.description}</p> : null}
        <p className="rating" aria-label={`${product.rating} out of 5 stars from ${product.reviews} reviews`}>
          <span>Star</span>
          <span>Star</span>
          <span>Star</span>
          <span>Star</span>
          <span>Star</span>
          <strong>{product.rating}</strong>
          <em>({product.reviews})</em>
        </p>
        <p className="price">
          {product.price}
          {product.oldPrice ? <span>{product.oldPrice}</span> : null}
        </p>
        <p className="delivery">Free delivery in 2-4 days</p>
        <button
          className="quick-add"
          type="button"
          onClick={() => onAddToCart(product)}
          disabled={product.inStock === false}
        >
          {product.inStock === false ? "Out of Stock" : cartQuantity > 0 ? `Added (${cartQuantity})` : "Add to Cart"}
        </button>
      </div>
    </motion.article>
  );
}

export default function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showAllCategories, setShowAllCategories] = useState(false);
  const [showAllProducts, setShowAllProducts] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const visibleCategories = showAllCategories ? categories : categories.slice(0, 6);
  const activeProducts = products.filter((product) => product.inStock !== false);
  const filteredProducts = selectedCategory
    ? activeProducts.filter((product) =>
        selectedCategory.name === "Sale"
          ? product.oldPrice
          : product.categories?.includes(selectedCategory.name)
      )
    : activeProducts;
  const visibleProducts = showAllProducts ? filteredProducts : filteredProducts.slice(0, 4);
  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);
  const cartTotal = cartItems.reduce((total, item) => total + getProductPrice(item.product) * item.quantity, 0);

  function addToCart(product) {
    const productId = getProductId(product);

    setCartItems((items) => {
      const existingItem = items.find((item) => item.id === productId);

      if (existingItem) {
        return items.map((item) =>
          item.id === productId ? { ...item, quantity: item.quantity + 1 } : item
        );
      }

      return [...items, { id: productId, product, quantity: 1 }];
    });
    setIsCartOpen(true);
  }

  function updateCartQuantity(productId, nextQuantity) {
    setCartItems((items) => {
      if (nextQuantity <= 0) {
        return items.filter((item) => item.id !== productId);
      }

      return items.map((item) => (item.id === productId ? { ...item, quantity: nextQuantity } : item));
    });
  }

  function removeFromCart(productId) {
    setCartItems((items) => items.filter((item) => item.id !== productId));
  }

  function showCategoryProducts(category) {
    setSelectedCategory(category);
    setShowAllProducts(true);
    window.setTimeout(() => {
      document.getElementById("featured")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 0);
  }

  return (
    <>


      <header className="site-header">
        <div className="header-top">
          <div className="header-container">
            <div className="brand-section">
              <a href="#" className="brand" aria-label="Pubesto home">
                Pubesto
              </a>
            </div>
            
            <div className="search-section">
              <form className="search" role="search" onSubmit={(event) => event.preventDefault()}>
                <SearchIcon />
                <label className="sr-only" htmlFor="site-search">
                  Search products
                </label>
                <input id="site-search" type="search" placeholder="Try 'Lunch Box' or Search by Product..." />
              </form>
            </div>

            <div className="actions-section">

              <div className="action-item supplier">
                <span>Become a Supplier</span>
              </div>
              <div className="divider" />
              <button className="action-item profile">
                <UserIcon />
                <span>Profile</span>
              </button>
              <button
                className="action-item cart-action"
                type="button"
                aria-label={`Open cart with ${cartCount} item${cartCount === 1 ? "" : "s"}`}
                aria-expanded={isCartOpen}
                onClick={() => setIsCartOpen(true)}
              >
                <div className="cart-icon-wrapper">
                  <CartIcon />
                  {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
                </div>
                <span>Cart</span>
              </button>
            </div>
            
            <button
              className="mobile-menu-toggle"
              type="button"
              onClick={() => setIsMenuOpen((open) => !open)}
              aria-label="Toggle menu"
              aria-expanded={isMenuOpen}
            >
              <MenuIcon open={isMenuOpen} />
            </button>
          </div>
        </div>

        <nav className="category-nav">
          <div className="header-container">
            <a href="#categories">Home Decor</a>
            <a href="#categories">Kitchen & Dining</a>
            <a href="#categories">Bottles & Drinkware</a>
            <a href="#categories">Lunch Storage</a>
            <a href="#categories">Textiles</a>
            <a href="#categories">Gifting</a>
            <a href="#categories" className="sale-link">Sale</a>
          </div>
        </nav>
        
        {/* Mobile menu content */}
        <div className={`mobile-nav-content ${isMenuOpen ? "open" : ""}`}>
           <a href="#categories">Categories</a>
           <a href="#featured">Featured products</a>
           <a href="#newsletter">Offers</a>
           <a href="#featured">New arrivals</a>
           <a href="#footer">Contact</a>
        </div>
      </header>

      {isCartOpen ? (
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
                  <button type="button">Checkout</button>
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
      ) : null}

      <main>
        <section className="hero-grid" aria-label="Featured collections">
          <motion.article
            className="hero-card hero-main"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <img
              src="https://images.unsplash.com/photo-1618220179428-22790b461013?auto=format&fit=crop&w=1600&q=85"
              alt=""
            />
            <div className="shade" />
            <div className="hero-copy">
              <p className="eyebrow">Curated Living</p>
              <h1>Artisanal essentials for calmer everyday spaces</h1>
              <p>Warm textures, crafted storage, and refined daily-use pieces selected for modern homes.</p>
            </div>
            <div className="hero-actions">
              <a className="primary-button" href="#featured">
                Shop Now
              </a>
            </div>
          </motion.article>

          <motion.article
            className="hero-card promo-card"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <img
              src="https://images.unsplash.com/photo-1603204077779-bed963ea7d0e?auto=format&fit=crop&w=900&q=85"
              alt=""
            />
            <div className="shade compact-shade" />
            <div className="promo-copy">
              <p className="eyebrow">Table Edit</p>
              <h2>Serveware</h2>
              <p>Quiet pieces for thoughtful hosting.</p>
              <a href="#categories">Explore collection</a>
            </div>
          </motion.article>

          <motion.article
            className="hero-card promo-card"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <img
              src="https://images.unsplash.com/photo-1594223274512-ad4803739b7c?auto=format&fit=crop&w=900&q=85"
              alt=""
            />
            <div className="shade compact-shade" />
            <div className="promo-copy">
              <p className="eyebrow">Daily Carry</p>
              <h2>Bags, bottles, lunch storage</h2>
              <p>Workday essentials with a cleaner finish.</p>
              <a href="#featured">View essentials</a>
            </div>
          </motion.article>
        </section>

        <section className="service-strip" aria-label="Store benefits">
          <div>
            <strong>Fast Shipping</strong>
            <span>Dispatch on most orders within 24 hours</span>
          </div>
          <div>
            <strong>Easy Returns</strong>
            <span>Simple support for exchanges and returns</span>
          </div>
          <div>
            <strong>Curated Quality</strong>
            <span>Useful materials, calm forms, refined finishes</span>
          </div>
          <div>
            <strong>Gift Ready</strong>
            <span>Thoughtful picks for homes, hosts, and workdays</span>
          </div>
        </section>

        <section id="categories" className="category-section">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Shop the range</p>
              <h2>Browse by category</h2>
            </div>
            <button
              className="view-all"
              type="button"
              onClick={() => setShowAllCategories((visible) => !visible)}

              aria-expanded={showAllCategories}
            >
              {showAllCategories ? "Show less" : "View all"} <span aria-hidden="true">&gt;</span>
            </button>
          </div>
          <div className={showAllCategories ? "category-grid" : "category-scroll-container"}>
            <motion.div 
              className={showAllCategories ? "category-grid-inner" : "category-marquee"}
              animate={showAllCategories ? {} : {
                x: [0, -50 + "%"]
              }}
              transition={{
                x: {
                  repeat: Infinity,
                  repeatType: "loop",
                  duration: 30,
                  ease: "linear",
                },
              }}
            >
              {(showAllCategories ? categories : [...categories, ...categories]).map((category, index) => (
                <button
                  className={`category-tile ${category.name === "Sale" ? "sale" : ""} ${
                    selectedCategory?.name === category.name ? "selected" : ""
                  }`}
                  type="button"
                  onClick={() => showCategoryProducts(category)}
                  key={`${category.name}-${index}`}
                >
                  <img src={category.image} alt="" />
                  <span>{category.name}</span>
                  <small>{category.count}</small>
                </button>
              ))}
            </motion.div>
          </div>
        </section>

        <section id="featured" className="product-section">
          <div className="section-heading">
            <div>
              <p className="eyebrow">
                {selectedCategory ? `Showing ${selectedCategory.count}` : "Customer favourites"}
              </p>
              <h2>{selectedCategory ? `${selectedCategory.name} products` : "Featured products"}</h2>
            </div>
            <div className="section-actions">
              {selectedCategory ? (
                <button
                  className="view-all"
                  type="button"
                  onClick={() => {
                    setSelectedCategory(null);
                    setShowAllProducts(false);
                  }}
                >
                  All products <span aria-hidden="true">&gt;</span>
                </button>
              ) : null}
              <button
                className="view-all"
                type="button"
                onClick={() => setShowAllProducts((visible) => !visible)}
                aria-expanded={showAllProducts}
              >
                {showAllProducts ? "Show less" : "See more"} <span aria-hidden="true">&gt;</span>
              </button>
            </div>
          </div>
          {visibleProducts.length > 0 ? (
            <div className="product-grid">
              {visibleProducts.map((product, idx) => (
                <ProductCard
                  product={product}
                  key={product.name}
                  index={idx}
                  cartQuantity={cartItems.find((item) => item.id === getProductId(product))?.quantity || 0}
                  onAddToCart={addToCart}
                />
              ))}
            </div>
          ) : (
            <div className="empty-products">
              <h3>No products available yet</h3>
              <p>{selectedCategory?.name} products can appear here after they are added to the catalog.</p>
            </div>
          )}
        </section>

        <section id="journal" className="editorial-section" aria-label="Pubesto style edit">
          <div className="editorial-image">
            <img
              src="https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1200&q=85"
              alt=""
            />
          </div>
          <div className="editorial-copy">
            <p className="eyebrow">The Pubesto Edit</p>
            <h2>Small upgrades that make everyday routines feel considered.</h2>
            <p>
              Layer storage, ceramics, drinkware, and soft textiles to create a home that feels
              composed without feeling formal.
            </p>
            <a className="secondary-button inverse" href="#featured">
              Shop the edit
            </a>
          </div>
        </section>

        <section className="select-banner" aria-label="Pubesto Select offer">
          <div>
            <p className="eyebrow">Pubesto Select</p>
            <h2>Black Friday energy, everyday essentials.</h2>
            <p>Clean silhouettes, dependable materials, and useful pieces built for daily homes.</p>
          </div>
          <a className="secondary-button inverse" href="#featured">
            Explore Select
          </a>
        </section>

        <motion.section
          id="newsletter"
          className="newsletter"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
        >
          <div>
            <p className="eyebrow">Pubesto Journal</p>
            <h2>Receive new launches and seasonal offers</h2>
            <p>Sign up for notes on home accents, kitchen updates, gifting edits, and limited discounts.</p>
          </div>
          <form onSubmit={(event) => event.preventDefault()}>
            <label className="sr-only" htmlFor="newsletter-email">
              Email address
            </label>
            <input id="newsletter-email" type="email" placeholder="Email address" />
            <button type="submit">Subscribe</button>
          </form>
        </motion.section>
      </main>

      <footer id="footer" className="site-footer">
        <div>
          <a href="#" className="brand">
            Pubesto
          </a>
          <p>Homeware, lunch storage, drinkware, and thoughtful daily essentials.</p>
        </div>
        <div>
          <h2>Shop</h2>
          <a href="#categories">Home Decor</a>
          <a href="#featured">Kitchen</a>
          <a href="#featured">Bottles</a>
          <a href="#featured">Lunch Storage</a>
        </div>
        <div>
          <h2>Support</h2>
          <a href="#">Shipping</a>
          <a href="#">Returns</a>
          <a href="#">Track Order</a>
          <a href="#">Care Guide</a>
        </div>
        <div>
          <h2>Newsletter</h2>
          <p>Get early access to fresh drops and festive edits.</p>
          <form className="footer-form" onSubmit={(event) => event.preventDefault()}>
            <label className="sr-only" htmlFor="footer-email">
              Email address
            </label>
            <input id="footer-email" type="email" placeholder="Email" />
            <button type="submit" aria-label="Subscribe">
              &gt;
            </button>
          </form>
        </div>
      </footer>
    </>
  );
}
