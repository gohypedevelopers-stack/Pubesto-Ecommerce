"use client";

import { useState } from "react";
import { motion } from "framer-motion";

const departments = [
  "Home Decor",
  "Kitchen",
  "Bottles",
  "Lunch Storage",
  "Storage",
  "Textiles",
  "Gifting",
];

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
];

const products = [
  {
    name: "Hammered Copper Bottle",
    price: "Rs. 899",
    oldPrice: "Rs. 1,199",
    badge: "Deal",
    rating: "4.8",
    reviews: "1,248",
    meta: "Leak-proof | 950 ml",
    image: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=800&q=85",
  },
  {
    name: "Acacia Serving Bowl",
    price: "Rs. 1,450",
    badge: "Best Seller",
    rating: "4.7",
    reviews: "864",
    meta: "Natural wood finish",
    image: "https://images.unsplash.com/photo-1601985705806-5b9a71f6004f?auto=format&fit=crop&w=800&q=85",
  },
  {
    name: "Stoneware Planter Set",
    price: "Rs. 1,099",
    oldPrice: "Rs. 1,399",
    badge: "20% Off",
    rating: "4.6",
    reviews: "519",
    meta: "Set of 2 indoor planters",
    image: "https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&w=800&q=85",
  },
  {
    name: "Insulated Lunch Carrier",
    price: "Rs. 799",
    rating: "4.5",
    reviews: "410",
    meta: "Office-ready storage",
    image: "https://images.unsplash.com/photo-1543352634-a1c51d9f1fa7?auto=format&fit=crop&w=800&q=85",
  },
  {
    name: "Minimal Desk Organizer",
    price: "Rs. 650",
    rating: "4.4",
    reviews: "283",
    meta: "Compact daily organizer",
    image: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=800&q=85",
  },
  {
    name: "Ribbed Glass Tumbler",
    price: "Rs. 399",
    oldPrice: "Rs. 549",
    badge: "Value",
    rating: "4.6",
    reviews: "932",
    meta: "Dishwasher safe",
    image: "https://images.unsplash.com/photo-1606813907291-d86efa9b94db?auto=format&fit=crop&w=800&q=85",
  },
  {
    name: "Cotton Table Runner",
    price: "Rs. 749",
    oldPrice: "Rs. 949",
    rating: "4.3",
    reviews: "190",
    meta: "Soft woven cotton",
    image: "https://images.unsplash.com/photo-1604578762246-41134e37f9cc?auto=format&fit=crop&w=800&q=85",
  },
  {
    name: "Matte Ceramic Vase",
    price: "Rs. 1,250",
    badge: "New",
    rating: "4.7",
    reviews: "351",
    meta: "Premium shelf accent",
    image: "https://images.unsplash.com/photo-1612196808214-b40b9faef597?auto=format&fit=crop&w=800&q=85",
  },
];

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
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21c1.8-4 4.5-6 8-6s6.2 2 8 6" />
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

function ProductCard({ product, index = 0 }) {
  return (
    <motion.article
      className="product-card"
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: index * 0.04 }}
      viewport={{ once: true, margin: "-60px" }}
    >
      <a className="product-media" href="#featured" aria-label={`View ${product.name}`}>
        {product.badge ? <span className="badge">{product.badge}</span> : null}
        <button className="wish-button" type="button" aria-label={`Save ${product.name}`}>
          <span aria-hidden="true">+</span>
        </button>
        <img src={product.image} alt="" />
      </a>
      <div className="product-info">
        <p className="product-meta">{product.meta}</p>
        <h3>{product.name}</h3>
        <div className="rating-line" aria-label={`${product.rating} out of 5 stars from ${product.reviews} reviews`}>
          <span className="stars" aria-hidden="true">
            Star Star Star Star Star
          </span>
          <span>{product.rating}</span>
          <span>({product.reviews})</span>
        </div>
        <p className="price">
          {product.price}
          {product.oldPrice ? <span>{product.oldPrice}</span> : null}
        </p>
        <p className="delivery">Free delivery in 2-4 days</p>
        <button className="add-button" type="button">
          Add to Cart
        </button>
      </div>
    </motion.article>
  );
}

export default function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <>
      <header className="site-header">
        <div className="utility-bar">
          <p>Free shipping over Rs. 999</p>
          <div>
            <a href="#footer">Help</a>
            <a href="#footer">Track Order</a>
            <a href="#newsletter">Offers</a>
          </div>
        </div>

        <div className="main-header">
          <a href="#" className="brand" aria-label="Pubesto home">
            Pubesto
          </a>

          <form className="search" role="search" onSubmit={(event) => event.preventDefault()}>
            <label className="sr-only" htmlFor="site-search">
              Search products
            </label>
            <select aria-label="Search category" defaultValue="all">
              <option value="all">All</option>
              <option value="decor">Decor</option>
              <option value="kitchen">Kitchen</option>
              <option value="bottles">Bottles</option>
            </select>
            <input id="site-search" type="search" placeholder="Search homeware, bottles, lunch boxes..." />
            <button type="submit" aria-label="Search">
              <SearchIcon />
            </button>
          </form>

          <div className="header-actions">
            <a href="#footer" className="account-link">
              <UserIcon />
              <span>Account</span>
            </a>
            <button className="cart" type="button" aria-label="Open cart">
              <CartIcon />
              <span>Cart</span>
              <strong>2</strong>
            </button>
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

        <nav className={`department-nav ${isMenuOpen ? "open" : ""}`} aria-label="Main navigation">
          <a className="active" href="#">
            Home
          </a>
          {departments.map((department) => (
            <a href="#categories" key={department}>
              {department}
            </a>
          ))}
          <a href="#newsletter">Deals</a>
        </nav>
      </header>

      <main>
        <section className="home-hero" aria-label="Pubesto shopping highlights">
          <aside className="department-panel" aria-label="Popular departments">
            <p className="panel-label">Shop by department</p>
            {departments.slice(0, 6).map((department) => (
              <a href="#categories" key={department}>
                <span>{department}</span>
                <span aria-hidden="true">-&gt;</span>
              </a>
            ))}
          </aside>

          <motion.article
            className="hero-feature"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55 }}
          >
            <img
              src="https://images.unsplash.com/photo-1618220179428-22790b461013?auto=format&fit=crop&w=1600&q=85"
              alt=""
            />
            <div className="hero-copy">
              <p className="eyebrow">Monochrome Edit 2026</p>
              <h1>
                <span className="hero-title-line">Premium home essentials,</span>
                <span className="hero-title-line">priced for everyday shopping.</span>
              </h1>
              <p>
                Discover refined decor, kitchen storage, drinkware, and gifting picks with a clean
                marketplace experience.
              </p>
              <div className="hero-actions">
                <a className="primary-button" href="#featured">
                  Shop Deals
                </a>
                <a className="secondary-button" href="#categories">
                  Browse Categories
                </a>
              </div>
            </div>
          </motion.article>

          <div className="hero-deals" aria-label="Today deals">
            <a href="#featured" className="deal-card dark">
              <span>Today only</span>
              <strong>Up to 30% off</strong>
              <small>Storage, bottles, serveware</small>
            </a>
            <a href="#featured" className="deal-card light">
              <span>New arrivals</span>
              <strong>Desk, dining, carry</strong>
              <small>Fresh drops every week</small>
            </a>
          </div>
        </section>

        <section className="service-strip" aria-label="Store benefits">
          <div>
            <strong>Fast Dispatch</strong>
            <span>Most orders ship in 24 hours</span>
          </div>
          <div>
            <strong>Cash on Delivery</strong>
            <span>Available on eligible orders</span>
          </div>
          <div>
            <strong>Easy Returns</strong>
            <span>Simple 7-day return support</span>
          </div>
          <div>
            <strong>Secure Checkout</strong>
            <span>Protected payments and order updates</span>
          </div>
        </section>

        <section id="categories" className="category-section">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Popular departments</p>
              <h2>Shop by category</h2>
            </div>
            <a className="view-all" href="#featured">
              View all
            </a>
          </div>
          <div className="category-grid">
            {categories.map((category, index) => (
              <motion.a
                className="category-tile"
                href="#featured"
                key={category.name}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.04 }}
                viewport={{ once: true }}
              >
                <img src={category.image} alt="" />
                <span>{category.name}</span>
                <small>{category.count}</small>
              </motion.a>
            ))}
          </div>
        </section>

        <section id="featured" className="product-section">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Customer favourites</p>
              <h2>Featured products</h2>
            </div>
            <a className="view-all" href="#categories">
              See more
            </a>
          </div>
          <div className="product-grid">
            {products.map((product, index) => (
              <ProductCard product={product} key={product.name} index={index} />
            ))}
          </div>
        </section>

        <section className="editorial-band" aria-label="Premium homeware offer">
          <div>
            <p className="eyebrow">Pubesto Select</p>
            <h2>Black Friday energy, everyday essentials.</h2>
            <p>
              Clean silhouettes, dependable materials, and useful pieces built for daily Indian
              homes.
            </p>
          </div>
          <a className="secondary-button inverse" href="#featured">
            Explore Select
          </a>
        </section>

        <motion.section
          id="newsletter"
          className="newsletter"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55 }}
          viewport={{ once: true }}
        >
          <div>
            <p className="eyebrow">Members first</p>
            <h2>Get early access to new launches and private deals.</h2>
            <p>Join the Pubesto list for drops, restocks, and limited-time monochrome edits.</p>
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
          <p>Premium homeware, lunch storage, drinkware, and thoughtful daily essentials.</p>
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
          <p>Get early access to fresh drops and seasonal edits.</p>
          <form className="footer-form" onSubmit={(event) => event.preventDefault()}>
            <label className="sr-only" htmlFor="footer-email">
              Email address
            </label>
            <input id="footer-email" type="email" placeholder="Email" />
            <button type="submit" aria-label="Subscribe">
              Go
            </button>
          </form>
        </div>
      </footer>
    </>
  );
}
