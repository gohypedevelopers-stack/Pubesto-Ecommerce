"use client";
import { useState } from "react";
import { motion } from "framer-motion";

const categories = [
  ["Home Decor", "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=600&q=80"],
  ["Kitchen", "https://images.unsplash.com/photo-1556911220-bff31c812dba?auto=format&fit=crop&w=600&q=80"],
  ["Bottles", "https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=600&q=80"],
  ["Lunch Box", "https://images.unsplash.com/photo-1543352634-a1c51d9f1fa7?auto=format&fit=crop&w=600&q=80"],
  ["Storage", "https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?auto=format&fit=crop&w=600&q=80"],
  ["Textiles", "https://images.unsplash.com/photo-1604578762246-41134e37f9cc?auto=format&fit=crop&w=600&q=80"],
  ["Gifting", "https://images.unsplash.com/photo-1512909006721-3d6018887383?auto=format&fit=crop&w=600&q=80"],
  ["Sale", "https://images.unsplash.com/photo-1511381939415-e44015466834?auto=format&fit=crop&w=600&q=80"],
];

const products = [
  {
    name: "Hammered Copper Bottle",
    price: "Rs. 899",
    oldPrice: "Rs. 1,199",
    badge: "New",
    image: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=800&q=85",
  },
  {
    name: "Acacia Serving Bowl",
    price: "Rs. 1,450",
    badge: "Best Seller",
    badgeClass: "badge-dark",
    image: "https://images.unsplash.com/photo-1601985705806-5b9a71f6004f?auto=format&fit=crop&w=800&q=85",
  },
  {
    name: "Stoneware Planter Set",
    price: "Rs. 1,099",
    oldPrice: "Rs. 1,399",
    badge: "20% Off",
    badgeClass: "badge-discount",
    image: "https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&w=800&q=85",
  },
  {
    name: "Insulated Lunch Carrier",
    price: "Rs. 799",
    image: "https://images.unsplash.com/photo-1543352634-a1c51d9f1fa7?auto=format&fit=crop&w=800&q=85",
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

function ProductCard({ product, index = 0 }) {
  return (
    <motion.article
      className="product-card"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      viewport={{ once: true, margin: "-50px" }}
    >
      <div className="product-media">
        {product.badge ? (
          <span className={`badge ${product.badgeClass || ""}`}>{product.badge}</span>
        ) : null}
        <img src={product.image} alt={product.name} />
      </div>
      <h3>{product.name}</h3>
      <p className="price">
        {product.price}
        {product.oldPrice ? <span>{product.oldPrice}</span> : null}
      </p>
      <p className="rating" aria-label="Rated 5 out of 5">
        <span>Star</span>
        <span>Star</span>
        <span>Star</span>
        <span>Star</span>
        <span>Star</span>
      </p>
    </motion.article>
  );
}

export default function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <>
      <header className="site-header">
        <a href="#" className="brand" aria-label="Pubesto home">
          Pubesto
        </a>
        <button
          className="mobile-menu-toggle"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? "✕" : "☰"}
        </button>
        <div className={`header-content ${isMenuOpen ? "open" : ""}`}>
          <nav className="main-nav" aria-label="Main navigation">
            <a className="active" href="#">
              Home
            </a>
            <details className="nav-dropdown">
              <summary>Shop</summary>
              <div className="nav-panel">
                <a href="#categories">Categories</a>
                <a href="#featured">Featured Products</a>
                <a href="#newsletter">Offers</a>
              </div>
            </details>
            <a href="#featured">New Arrivals</a>
            <a href="#newsletter">Offers</a>
            <a href="#footer">Contact</a>
          </nav>
          <div className="header-tools">
            <form className="search" role="search">
              <SearchIcon />
              <label className="sr-only" htmlFor="site-search">
                Search products
              </label>
              <input id="site-search" type="search" placeholder="Search decor, bottles..." />
            </form>
            <button className="cart" type="button" aria-label="Open cart">
              <CartIcon />
              <span className="cart-dot" />
            </button>
          </div>
        </div>
      </header>

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
              <p>Bring home warm textures, crafted storage, and refined daily-use pieces.</p>
              <a className="primary-button" href="#featured">
                Shop Now
              </a>
            </div>
          </motion.article>
          <motion.article
            className="hero-card"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <img
              src="https://images.unsplash.com/photo-1603204077779-bed963ea7d0e?auto=format&fit=crop&w=900&q=85"
              alt=""
            />
            <div className="shade" />
            <div className="promo-copy">
              <h2>Serveware</h2>
              <p>Table pieces with quiet detail.</p>
              <a href="#categories">Explore collection</a>
            </div>
          </motion.article>
          <motion.article
            className="hero-card"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <img
              src="https://images.unsplash.com/photo-1594223274512-ad4803739b7c?auto=format&fit=crop&w=900&q=85"
              alt=""
            />
            <div className="shade" />
            <div className="promo-copy">
              <h2>Daily Carry</h2>
              <p>Bottles and lunch storage for workdays.</p>
              <a href="#featured">View essentials</a>
            </div>
          </motion.article>
        </section>

        <section id="categories" className="category-strip" aria-label="Shop by category">
          {categories.map(([name, image], index) => (
            <motion.a
              className={`category-tile ${name === "Sale" ? "sale" : ""}`}
              href="#featured"
              key={name}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              viewport={{ once: true }}
            >
              <img src={image} alt="" />
              <span>{name}</span>
            </motion.a>
          ))}
        </section>

        <section id="featured" className="product-section">
          <div className="section-heading">
            <h2>Featured Products</h2>
            <a className="view-all" href="#categories">
              View all <span aria-hidden="true">&gt;</span>
            </a>
          </div>
          <div className="product-grid">
            {products.map((product, idx) => (
              <ProductCard product={product} key={product.name} index={idx} />
            ))}
          </div>
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
          <form>
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
          <form className="footer-form">
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
