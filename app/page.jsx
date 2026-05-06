"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  AtSign,
  Camera,
  Check,
  Clock8,
  Feather,
  MapPinned,
  PackageCheck,
  Play,
  Plus,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
} from "lucide-react";

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

const navLabelByCategory = {
  Kitchen: "Kitchen & Dining",
  Bottles: "Bottles & Drinkware",
  "Lunch Box": "Lunch Storage",
};

const primaryNavCategoryNames = ["Home Decor", "Kitchen", "Bottles", "Lunch Box", "Textiles", "Gifting", "Sale"];

const primaryNavItems = categories
  .filter((category) => primaryNavCategoryNames.includes(category.name))
  .sort((a, b) => primaryNavCategoryNames.indexOf(a.name) - primaryNavCategoryNames.indexOf(b.name))
  .map((category) => ({
    ...category,
    label: navLabelByCategory[category.name] || category.name,
  }));

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

const heroSlides = [
  {
    eyebrow: "Payday Sale",
    title: "Buy 1 Get 1",
    copy: "+ Up to 45% off on bottles, fans, and lunch storage.",
    cta: "Shop Offers",
    image: "https://images.unsplash.com/photo-1618220179428-22790b461013?auto=format&fit=crop&w=1800&q=88",
    productImage: "/images/products/new-products/b-07-premium-nice-glass-bottle.svg",
    productName: "Premium Glass Bottle",
    productDetail: "Glass Bottle | Drinkware",
    price: "Rs. 52",
    oldPrice: "Rs. 95",
  },
  {
    eyebrow: "Bottle Week",
    title: "Up to 45% Off",
    copy: "Clean bottles for school, work, gifting, and everyday carry with fast dispatch.",
    cta: "View Bottles",
    image: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=1800&q=88",
    productImage: "/images/products/new-products/b-84-unicorn-printed-temperature-bottle.svg",
    productName: "Unicorn Temperature Bottle",
    productDetail: "Kids Bottle | Imported",
    price: "Rs. 132",
    oldPrice: "Rs. 195",
  },
  {
    eyebrow: "Cooling Drop",
    title: "Fan Deals Live",
    copy: "Compact cooling picks for workdays, bedside use, and on-the-go comfort.",
    cta: "Shop Fans",
    image: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1800&q=88",
    productImage: "/images/products/new-products/rl-7064-table-fan.svg",
    productName: "RL Table Fan",
    productDetail: "Table Fan | Portable Fan",
    price: "Rs. 495",
    oldPrice: "Rs. 595",
  },
];

const peopleChoiceVideos = [
  {
    title: "Dive Club - 50ML",
    price: "Rs. 1,299",
    oldPrice: "Rs. 1,999",
    image: "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=600&q=86",
    video: "https://videos.pexels.com/video-files/7815759/7815759-sd_960_540_25fps.mp4",
    thumb: "/images/products/new-products/b-07-premium-nice-glass-bottle.svg",
  },
  {
    title: "Oak & Smoke Eau De Parfum",
    price: "Rs. 1,299",
    oldPrice: "Rs. 1,999",
    image: "https://images.unsplash.com/photo-1514222709107-a180c68d72b4?auto=format&fit=crop&w=600&q=86",
    video: "https://videos.pexels.com/video-files/7250670/7250670-sd_540_960_25fps.mp4",
    thumb: "/images/products/new-products/transparent-leak-proof-lunch-box.svg",
  },
  {
    title: "After Hours Eau De Parfum",
    price: "Rs. 1,299",
    oldPrice: "Rs. 1,999",
    image: "https://images.unsplash.com/photo-1507914464562-6ff4ac29692f?auto=format&fit=crop&w=600&q=86",
    video: "https://videos.pexels.com/video-files/7815963/7815963-sd_960_540_25fps.mp4",
    thumb: "/images/products/new-products/rl-7064-table-fan.svg",
  },
  {
    title: "Spoiled Sweet Daily Pick",
    price: "Rs. 1,299",
    oldPrice: "Rs. 1,999",
    image: "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?auto=format&fit=crop&w=600&q=86",
    video: "https://videos.pexels.com/video-files/7815962/7815962-sd_540_960_25fps.mp4",
    thumb: "/images/products/new-products/b-84-unicorn-printed-temperature-bottle.svg",
  },
  {
    title: "Dive Club Gift Box",
    price: "Rs. 1,299",
    oldPrice: "Rs. 1,999",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=86",
    video: "https://videos.pexels.com/video-files/6214216/6214216-sd_540_960_30fps.mp4",
    thumb: "/images/products/new-products/v8-otg-fan.svg",
  },
  {
    title: "Premium Glass Bottle",
    price: "Rs. 52",
    oldPrice: "Rs. 95",
    image: "https://images.unsplash.com/photo-1511988617509-a57c8a288659?auto=format&fit=crop&w=600&q=86",
    video: "https://videos.pexels.com/video-files/4962806/4962806-sd_540_960_25fps.mp4",
    thumb: "/images/products/new-products/b-07-premium-nice-glass-bottle.svg",
  },
];

const pubestoTrustFeatures = [
  {
    label: "Quality-checked products",
    mark: "QC",
  },
  {
    label: "Made for Indian homes",
    Icon: MapPinned,
  },
  {
    label: "Secure packaging",
    Icon: PackageCheck,
  },
  {
    label: "Fast dispatch on most orders",
    Icon: Clock8,
  },
  {
    label: "Easy returns and support",
    Icon: ShieldCheck,
  },
  {
    label: "Useful daily essentials",
    Icon: Feather,
  },
  {
    label: "Value pricing on trusted picks",
    mark: "Rs",
  },
];

const socialGalleryItems = [
  {
    title: "Carry it clean",
    caption: "Bottles for desk, school, and daily errands.",
    image: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=900&q=86",
  },
  {
    title: "Pack the day",
    caption: "Lunch storage that keeps workdays simple.",
    image: "https://images.unsplash.com/photo-1543352634-a1c51d9f1fa7?auto=format&fit=crop&w=900&q=86",
  },
  {
    title: "Cool corners",
    caption: "Compact fans and comfort picks for home.",
    image: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=900&q=86",
  },
  {
    title: "Everyday edits",
    caption: "Useful finds styled for Indian homes.",
    image: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=900&q=86",
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
  const [addEffectKey, setAddEffectKey] = useState(null);

  function showAddAnimation() {
    const nextKey = Date.now();

    setAddEffectKey(nextKey);
    window.setTimeout(() => {
      setAddEffectKey((currentKey) => (currentKey === nextKey ? null : currentKey));
    }, 1050);
  }

  function handleAddToCart(options) {
    if (product.inStock === false) {
      return;
    }

    showAddAnimation();
    onAddToCart(product, options);
  }

  return (
    <motion.article
      className="product-card"
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: index * 0.04 }}
      viewport={{ once: true, margin: "-50px" }}
    >
      <div className="product-media">
        <a className="product-media-link" href="#featured" aria-label={`View ${product.name}`}>
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
        {product.badge ? (
          <span className={`badge ${product.badgeClass || ""}`}>{product.badge}</span>
        ) : null}
        {product.stockBadge ? <span className="stock-badge">{product.stockBadge}</span> : null}
        {!product.stockBadge ? (
          <motion.button
            className={`save-button ${cartQuantity > 0 ? "active" : ""}`}
            type="button"
            onClick={() => handleAddToCart({ openCart: false })}
            whileTap={{ scale: 0.86 }}
            aria-label={`Add ${product.name} to cart`}
          >
            {cartQuantity > 0 ? <Check /> : <Plus />}
          </motion.button>
        ) : null}
        <AnimatePresence>
          {addEffectKey ? (
            <motion.div
              className="premium-add-animation"
              key={addEffectKey}
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 1, 1, 0] }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.05, ease: "easeOut" }}
              aria-hidden="true"
            >
              <span className="premium-add-glow" />
              <span className="premium-add-ring ring-one" />
              <span className="premium-add-ring ring-two" />
              <span className="premium-add-sparkle sparkle-one">
                <Sparkles />
              </span>
              <span className="premium-add-sparkle sparkle-two">
                <Sparkles />
              </span>
              <span className="premium-add-sparkle sparkle-three">
                <Sparkles />
              </span>
              <motion.span
                className="premium-add-chip"
                initial={{ opacity: 0, y: 16, scale: 0.9 }}
                animate={{ opacity: [0, 1, 1, 0], y: [16, 0, -6, -18], scale: [0.9, 1, 1, 0.96] }}
                transition={{ duration: 1.05, ease: "easeOut" }}
              >
                <ShoppingBag />
                Added
              </motion.span>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
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
          onClick={() => handleAddToCart()}
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
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isSupplierOpen, setIsSupplierOpen] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [cartPulseKey, setCartPulseKey] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [profileNotice, setProfileNotice] = useState("");
  const [supplierNotice, setSupplierNotice] = useState("");

  const visibleCategories = showAllCategories ? categories : categories.slice(0, 6);
  const normalizedSearchQuery = searchQuery.trim().toLowerCase();
  const activeProducts = products.filter((product) => product.inStock !== false);
  const categoryFilteredProducts = selectedCategory
    ? activeProducts.filter((product) =>
        selectedCategory.name === "Sale"
          ? product.oldPrice
          : product.categories?.includes(selectedCategory.name)
      )
    : activeProducts;
  const filteredProducts = normalizedSearchQuery
    ? categoryFilteredProducts.filter((product) =>
        [
          product.name,
          product.detail,
          product.description,
          product.price,
          product.oldPrice,
          ...(product.categories || []),
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase()
          .includes(normalizedSearchQuery)
      )
    : categoryFilteredProducts;
  const visibleProducts = showAllProducts || normalizedSearchQuery ? filteredProducts : filteredProducts.slice(0, 4);
  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);
  const cartTotal = cartItems.reduce((total, item) => total + getProductPrice(item.product) * item.quantity, 0);
  const productEyebrow = normalizedSearchQuery
    ? `${filteredProducts.length} result${filteredProducts.length === 1 ? "" : "s"} for "${searchQuery.trim()}"`
    : selectedCategory
      ? `Showing ${selectedCategory.count}`
      : "Customer favourites";
  const productHeading = normalizedSearchQuery
    ? "Search results"
    : selectedCategory
      ? `${selectedCategory.name} products`
      : "Featured products";

  function closeUtilityPanels() {
    setIsCartOpen(false);
    setIsProfileOpen(false);
    setIsSupplierOpen(false);
  }

  function scrollToFeatured() {
    window.setTimeout(() => {
      document.getElementById("featured")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 0);
  }

  function addToCart(product, options = {}) {
    const productId = getProductId(product);
    const shouldOpenCart = options.openCart !== false;

    setCartItems((items) => {
      const existingItem = items.find((item) => item.id === productId);

      if (existingItem) {
        return items.map((item) =>
          item.id === productId ? { ...item, quantity: item.quantity + 1 } : item
        );
      }

      return [...items, { id: productId, product, quantity: 1 }];
    });
    setCartPulseKey((key) => key + 1);
    setIsProfileOpen(false);
    setIsSupplierOpen(false);
    if (shouldOpenCart) {
      setIsCartOpen(true);
    }
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
    setSearchQuery("");
    setShowAllProducts(true);
    setIsMenuOpen(false);
    scrollToFeatured();
  }

  function resetStoreView() {
    setSelectedCategory(null);
    setSearchQuery("");
    setShowAllProducts(false);
    setIsMenuOpen(false);
  }

  function submitSearch(event) {
    event.preventDefault();
    setSelectedCategory(null);
    setShowAllProducts(true);
    setIsMenuOpen(false);
    scrollToFeatured();
  }

  function clearSearch() {
    setSearchQuery("");
    setShowAllProducts(false);
  }

  return (
    <>


      <header className="site-header">
        <div className="header-top">
          <div className="header-container">
            <div className="brand-section">
              <a href="#" className="brand" aria-label="Pubesto home" onClick={resetStoreView}>
                Pubesto
              </a>
            </div>
            
            <div className="search-section">
              <form className="search" role="search" onSubmit={submitSearch}>
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
            </div>

            <div className="actions-section">

              <button
                className="action-item supplier"
                type="button"
                onClick={() => {
                  closeUtilityPanels();
                  setSupplierNotice("");
                  setIsSupplierOpen(true);
                }}
                aria-expanded={isSupplierOpen}
              >
                <StoreIcon />
                <span>Become a Supplier</span>
              </button>
              <div className="divider" />
              <button
                className="action-item profile"
                type="button"
                onClick={() => {
                  closeUtilityPanels();
                  setProfileNotice("");
                  setIsProfileOpen(true);
                }}
                aria-expanded={isProfileOpen}
              >
                <UserIcon />
                <span>Profile</span>
              </button>
              <button
                className="action-item cart-action"
                type="button"
                aria-label={`Open cart with ${cartCount} item${cartCount === 1 ? "" : "s"}`}
                aria-expanded={isCartOpen}
                onClick={() => {
                  closeUtilityPanels();
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
                  <CartIcon />
                  {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
                </motion.div>
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
            {primaryNavItems.map((category) => (
              <button
                className={`${category.name === "Sale" ? "sale-link" : ""} ${
                  selectedCategory?.name === category.name ? "active" : ""
                }`}
                type="button"
                onClick={() => showCategoryProducts(category)}
                aria-current={selectedCategory?.name === category.name ? "page" : undefined}
                key={category.name}
              >
                {category.label}
              </button>
            ))}
          </div>
        </nav>
        
        {/* Mobile menu content */}
        <div className={`mobile-nav-content ${isMenuOpen ? "open" : ""}`}>
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
          {primaryNavItems.map((category) => (
            <button
              className={category.name === "Sale" ? "sale-link" : ""}
              type="button"
              onClick={() => showCategoryProducts(category)}
              key={`mobile-${category.name}`}
            >
              {category.label}
            </button>
          ))}
          <a href="#newsletter" onClick={() => setIsMenuOpen(false)}>
            Offers
          </a>
          <button
            type="button"
            onClick={() => {
              setIsMenuOpen(false);
              closeUtilityPanels();
              setSupplierNotice("");
              setIsSupplierOpen(true);
            }}
          >
            Become a Supplier
          </button>
          <button
            type="button"
            onClick={() => {
              setIsMenuOpen(false);
              closeUtilityPanels();
              setProfileNotice("");
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
          <a href="#footer" onClick={() => setIsMenuOpen(false)}>
            Contact
          </a>
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
                  <button
                    type="button"
                    onClick={() => {
                      setIsCartOpen(false);
                      setIsProfileOpen(true);
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
      ) : null}

      {isProfileOpen ? (
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
      ) : null}

      {isSupplierOpen ? (
        <div className="cart-layer">
          <button
            className="cart-backdrop"
            type="button"
            aria-label="Close supplier panel"
            onClick={() => setIsSupplierOpen(false)}
          />
          <aside className="cart-drawer utility-drawer" role="dialog" aria-modal="true" aria-label="Become a supplier">
            <div className="cart-drawer-header">
              <div>
                <p className="eyebrow">Sell with Pubesto</p>
                <h2>Become a Supplier</h2>
              </div>
              <button type="button" onClick={() => setIsSupplierOpen(false)} aria-label="Close supplier panel">
                Close
              </button>
            </div>

            <div className="utility-panel-body">
              <div className="supplier-steps" role="list">
                <div role="listitem">
                  <strong>1</strong>
                  <span>Share your product range</span>
                </div>
                <div role="listitem">
                  <strong>2</strong>
                  <span>Get quality and pricing review</span>
                </div>
                <div role="listitem">
                  <strong>3</strong>
                  <span>Start listing on Pubesto</span>
                </div>
              </div>

              <form
                className="utility-form"
                onSubmit={(event) => {
                  event.preventDefault();
                  setSupplierNotice("Thanks. Your supplier request is ready for review.");
                }}
              >
                <label htmlFor="supplier-brand">Business name</label>
                <input id="supplier-brand" type="text" placeholder="Your store or brand name" />
                <label htmlFor="supplier-contact">Contact number</label>
                <input id="supplier-contact" type="tel" placeholder="Mobile number" />
                <label htmlFor="supplier-category">Product category</label>
                <select id="supplier-category" defaultValue="">
                  <option value="" disabled>
                    Select category
                  </option>
                  {categories
                    .filter((category) => category.name !== "Sale")
                    .map((category) => (
                      <option value={category.name} key={category.name}>
                        {category.name}
                      </option>
                    ))}
                </select>
                <button type="submit">Register interest</button>
              </form>
              {supplierNotice ? <p className="utility-notice">{supplierNotice}</p> : null}
            </div>
          </aside>
        </div>
      ) : null}

      <main>
        <section className="hero-carousel" aria-label="Featured offers">
          <div className="hero-marquee">
            <div className="hero-track">
              {[...heroSlides, heroSlides[0]].map((slide, index) => {
                const isDuplicateSlide = index === heroSlides.length;

                return (
                  <article
                    className="hero-slide"
                    aria-hidden={isDuplicateSlide}
                    key={`${slide.title}-${index}`}
                  >
                    <img className="hero-bg" src={slide.image} alt="" />
                    <div className="hero-slide-shade" />
                    <div className="hero-slide-content">
                      <p className="eyebrow hero-eyebrow">{slide.eyebrow}</p>
                      {index === 0 ? <h1>{slide.title}</h1> : <h2>{slide.title}</h2>}
                      <p>{slide.copy}</p>
                      <a
                        className="primary-button hero-cta"
                        href="#featured"
                        tabIndex={isDuplicateSlide ? -1 : undefined}
                      >
                        {slide.cta}
                      </a>
                    </div>
                    <aside className="hero-product-showcase" aria-label={slide.productName}>
                      <div className="hero-product-image">
                        <img src={slide.productImage} alt="" />
                      </div>
                      <div className="hero-product-info">
                        <strong>{slide.productName}</strong>
                        <span>{slide.productDetail}</span>
                        <p>
                          <b>{slide.price}</b>
                          <s>{slide.oldPrice}</s>
                        </p>
                      </div>
                    </aside>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        <section className="video-choice-section" aria-labelledby="people-choice-title">
          <div className="video-choice-heading">
            <p>Shop from videos</p>
            <h2 id="people-choice-title">People&apos;s choice</h2>
          </div>
          <div className="video-choice-scroll" role="list">
            {peopleChoiceVideos.slice(0, 4).map((item) => (
              <a
                className="video-choice-card"
                href="#featured"
                role="listitem"
                aria-label={`Shop ${item.title}`}
                key={item.title}
              >
                <video
                  className="video-choice-video"
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload="metadata"
                  poster={item.image}
                  aria-hidden="true"
                >
                  <source src={item.video} type="video/mp4" />
                </video>
                <span className="video-choice-gradient" aria-hidden="true" />
                <span className="video-choice-product">
                  <span className="video-choice-thumb">
                    <img src={item.thumb} alt="" />
                  </span>
                  <span className="video-choice-copy">
                    <strong>{item.title}</strong>
                    <span>
                      {item.price} <s>{item.oldPrice}</s>
                    </span>
                  </span>
                </span>
              </a>
            ))}
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
              <p className="eyebrow">{productEyebrow}</p>
              <h2>{productHeading}</h2>
            </div>
            <div className="section-actions">
              {selectedCategory || normalizedSearchQuery ? (
                <button
                  className="view-all"
                  type="button"
                  onClick={() => {
                    setSelectedCategory(null);
                    setSearchQuery("");
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
              <h3>{normalizedSearchQuery ? "No products found" : "No products available yet"}</h3>
              <p>
                {normalizedSearchQuery
                  ? "Try a different product name, category, or material."
                  : `${selectedCategory?.name} products can appear here after they are added to the catalog.`}
              </p>
            </div>
          )}
        </section>

        <section className="why-pubesto-section" aria-labelledby="why-pubesto-title">
          <span className="why-pubesto-wave" aria-hidden="true" />
          <div className="why-pubesto-heading">
            <p>Useful. Reliable. Everyday.</p>
            <h2 id="why-pubesto-title">Why Choose Pubesto</h2>
          </div>
          <div className="why-pubesto-card" role="list">
            {pubestoTrustFeatures.map((feature) => (
              <div className="why-pubesto-feature" role="listitem" key={feature.label}>
                <span className="why-pubesto-icon" aria-hidden="true">
                  {feature.mark ? <span className="why-pubesto-mark">{feature.mark}</span> : <feature.Icon />}
                </span>
                <span>{feature.label}</span>
              </div>
            ))}
          </div>
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

        <section className="social-circle-section" aria-labelledby="social-circle-title">
          <span className="social-circle-wave" aria-hidden="true" />
          <span className="social-circle-object" aria-hidden="true">
            <img src="/images/products/new-products/b-07-premium-nice-glass-bottle.svg" alt="" />
          </span>
          <div className="social-circle-heading">
            <h2 id="social-circle-title">Join the Pubesto Home Circle</h2>
            <p>Follow Us</p>
          </div>
          <div className="social-gallery" role="list">
            {socialGalleryItems.map((item) => (
              <a className="social-gallery-card" href="#featured" role="listitem" key={item.title}>
                <img src={item.image} alt="" />
                <span className="social-gallery-shade" aria-hidden="true" />
                <span className="social-gallery-copy">
                  <strong>{item.title}</strong>
                  <span>{item.caption}</span>
                </span>
              </a>
            ))}
          </div>
        </section>
      </main>

      <footer id="footer" className="site-footer">
        <div className="footer-mail-visual" aria-hidden="true">
          <span className="footer-envelope">
            <span className="footer-seal">P</span>
          </span>
        </div>

        <div className="footer-grid">
          <nav className="footer-column" aria-label="Fine print">
            <h2>Fine Print</h2>
            <a href="#">Privacy Policy</a>
            <a href="#">Shipping Policy</a>
            <a href="#">Terms of Service</a>
            <a href="#">Refund Policy</a>
          </nav>

          <nav className="footer-column" aria-label="Learn more">
            <h2>Learn More</h2>
            <a href="#">About Us</a>
            <a href="#">Contact Us</a>
            <a href="#">FAQ</a>
            <a href="#journal">Blogs</a>
          </nav>

          <div className="footer-column footer-offers">
            <h2>Subscribe for Offers</h2>
            <p>Be the first to know about new drops, useful home finds, and exclusive Pubesto deals.</p>
            <form className="footer-form" onSubmit={(event) => event.preventDefault()}>
              <label className="sr-only" htmlFor="footer-email">
                Email address
              </label>
              <input id="footer-email" type="email" placeholder="Email" />
              <button type="submit" aria-label="Subscribe">
                <span>Join</span>
                <ArrowRight size={16} aria-hidden="true" />
              </button>
            </form>

            <nav className="footer-socials" aria-label="Social links">
              <a href="#" aria-label="Instagram">
                <Camera size={18} />
              </a>
              <a href="#" aria-label="Facebook">
                <AtSign size={18} />
              </a>
              <a href="#" aria-label="YouTube">
                <Play size={17} />
              </a>
            </nav>
          </div>
        </div>

        <div className="footer-brand-endcap" aria-label="Pubesto">
          <span aria-hidden="true">PUBESTO</span>
        </div>
        <div className="footer-copyright">
          &copy; 2026 PUBESTO . ALL RIGHTS RESERVED.
        </div>
      </footer>
    </>
  );
}
