"use client";

import { useParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag, ChevronDown, Check, Plus, Minus, ArrowRight, ShieldCheck, Sparkles, ChevronRight, CheckSquare, Tag, Undo2, Volume2, VolumeX, X, Star } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useStore } from "../../../components/StoreContext";
import { peopleChoiceVideos } from "../../../lib/data";
import { getShopifyCheckoutUrl } from "../../../lib/shopify";

const INDIAN_NAMES = [
  "Rahul", "Kavya", "Vivek", "Sunita", "Srinivas", "Priya", "Amit", "Riya", 
  "Deepa", "Harish", "Ananya", "Vikram", "Sneha", "Rohan", "Pooja", "Arjun", 
  "Karan", "Neha", "Aditya", "Manish", "Shikha", "Aman", "Rajesh", "Meera", 
  "Suresh", "Divya", "Sanjay", "Komal", "Abhishek", "Preeti"
];

const INDIAN_CITIES = [
  "Mumbai", "Delhi", "Bangalore", "Pune", "Hyderabad", "Chennai", "Kolkata", 
  "Ahmedabad", "Gurgaon", "Noida", "Jaipur", "Lucknow", "Chandigarh", "Surat", 
  "Kochi", "Indore", "Patna", "Bhopal", "Visakhapatnam", "Coimbatore"
];

const getDeterministicSales = (prod) => {
  if (!prod) return 1100;
  const hash = (prod.slug || prod.name || "").split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return 850 + (hash % 650); // Generates between 850 and 1500
};

const getDeterministicStock = (prod, colorName) => {
  if (!prod) return 8;
  const key = (prod.slug || "") + (colorName || "");
  const hash = key.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return 5 + (hash % 10); // Generates between 5 and 14
};

function productMatchesRouteSlug(product, routeSlug) {
  const target = String(routeSlug || "").toLowerCase();
  if (!product || !target) return false;

  const candidates = [
    product.slug,
    product.shopifyHandle,
    product.handle,
    ...(product.slugAliases || []),
  ]
    .filter(Boolean)
    .map((value) => String(value).toLowerCase());

  return candidates.includes(target) || candidates.some((candidate) => candidate.includes(target));
}

const getReviewAvatar = (name) => {
  if (!name) return "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&h=150&q=80";
  
  const cleanName = name.trim();
  const firstName = cleanName.split(/\s+/)[0].toLowerCase();
  
  // High quality Unsplash profile pictures
  const femaleAvatars = [
    "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&h=150&q=80",
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&h=150&q=80",
    "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&h=150&q=80",
    "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&h=150&q=80",
    "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=150&h=150&q=80",
    "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=150&h=150&q=80",
    "https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?auto=format&fit=crop&w=150&h=150&q=80",
    "https://images.unsplash.com/photo-1554151228-14d9def656e4?auto=format&fit=crop&w=150&h=150&q=80"
  ];
  
  const maleAvatars = [
    "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&h=150&q=80",
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&h=150&q=80",
    "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&h=150&q=80",
    "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=150&h=150&q=80",
    "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=150&h=150&q=80",
    "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=150&h=150&q=80",
    "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=150&h=150&q=80",
    "https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?auto=format&fit=crop&w=150&h=150&q=80"
  ];
  
  const femaleNames = [
    "ananya", "sneha", "kavya", "sunita", "suman", "pooja", "nisha", "priya", 
    "riya", "deepa", "komal", "preeti", "meera", "divya", "shikha", "ishita", 
    "swati", "kiran", "neeta", "tanya", "aditi", "jaya", "renu", "kavita", 
    "radhika", "shreya", "aishwarya", "neha", "amrita", "arpita", "anamika", 
    "archana", "bharti", "chaitali", "deepali", "ekta", "garima", "hema", 
    "indu", "jyoti", "kajal", "lalita", "madhu", "monika", "namrata", "pallavi", 
    "rashmi", "sapna", "tanvi", "uma", "veena", "yamini", "aditi", "kavya", 
    "priya", "sneha", "tanya", "swati", "neeta", "ishita", "renu", "shikha", 
    "meera", "suman", "nisha", "pooja", "ananya", "jaya", "ishita", "swati",
    "kiran", "neeta", "tanya", "aditi", "jaya", "renu"
  ];
  
  const isFemale = femaleNames.includes(firstName) || 
                   (firstName.endsWith('a') && !["aditya", "krishna", "shiva", "rana", "abhimanyu", "russia"].includes(firstName)) || 
                   firstName.endsWith('i') || 
                   firstName.endsWith('ee') ||
                   (firstName.endsWith('u') && !["ashutosh", "himanshu", "shantanu", "raghu", "vasu"].includes(firstName));
  
  let charSum = 0;
  for (let i = 0; i < cleanName.length; i++) {
    charSum += cleanName.charCodeAt(i);
  }
  
  if (isFemale) {
    return femaleAvatars[charSum % femaleAvatars.length];
  } else {
    return maleAvatars[charSum % maleAvatars.length];
  }
};

function ProductPageContent() {
  const { slug } = useParams();
  const { 
    addToCart, cartItems, getProductId, getProductPrice, products, updateCartQuantity, checkout, setIsCartOpen
  } = useStore();
  const [activeTab, setActiveTab] = useState("specs");
  const [addEffectKey, setAddEffectKey] = useState(null);
  const [quantity, setQuantity] = useState(2);
  const [selectedColor, setSelectedColor] = useState(null);
  const [activeImage, setActiveImage] = useState(null);
  const [videoSoundOn, setVideoSoundOn] = useState(false);
  const [isBuyingNow, setIsBuyingNow] = useState(false);
  const [selectedBundleItems, setSelectedBundleItems] = useState({});
  const [bundleInitialized, setBundleInitialized] = useState(false);
  const [productReviews, setProductReviews] = useState([]);
  const [reviewSummary, setReviewSummary] = useState({ averageRating: 0, count: 0 });
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const reviewTrackRef = useRef(null);

  // Bundle Customization Popup State
  const [isBundlePopupOpen, setIsBundlePopupOpen] = useState(false);
  const [popupBundleSize, setPopupBundleSize] = useState(2);
  const [popupColors, setPopupColors] = useState([]);
  const [popupQuantity, setPopupQuantity] = useState(1);

  // Review Submission State
  const [isReviewFormOpen, setIsReviewFormOpen] = useState(false);
  const [formRating, setFormRating] = useState(5);
  const [formHoverRating, setFormHoverRating] = useState(0);
  const [formName, setFormName] = useState("");
  const [formText, setFormText] = useState("");
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [reviewSubmitSuccess, setReviewSubmitSuccess] = useState(false);
  const [reviewSubmitError, setReviewSubmitError] = useState("");

  // Dynamic ticker states
  const [unitsSold, setUnitsSold] = useState(1100);
  const [stockCount, setStockCount] = useState(8);
  const [activeViewers, setActiveViewers] = useState(24);
  const [tickerIndex, setTickerIndex] = useState(0);
  const [lastBuyer, setLastBuyer] = useState({ name: "Rahul", city: "Mumbai", qty: 2 });

  const [liveLovedCount, setLiveLovedCount] = useState(1000);

  useEffect(() => {
    const displayProductReviewCount = reviewSummary.count || productReviews.length;
    const initialLoved = displayProductReviewCount > 0
      ? Math.max(1000, displayProductReviewCount * 127)
      : 1000;
    setLiveLovedCount(initialLoved);
  }, [reviewSummary.count, productReviews.length]);

  useEffect(() => {
    const timer = setInterval(() => {
      setLiveLovedCount((prev) => prev + Math.floor(Math.random() * 2) + 1);
    }, 6000 + Math.random() * 4000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    // Force scroll to top with a slight delay to ensure content is ready
    const timer = setTimeout(() => {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    }, 10);
    
    // Initialize product states
    const product = products.find((p) => productMatchesRouteSlug(p, slug));
    if (product) {
      setActiveImage(product.image);
      if (product.colors && product.colors.length > 0) {
        setSelectedColor(product.colors[0]);
        if (product.colors[0].image) {
          setActiveImage(product.colors[0].image);
        }
      } else {
        setSelectedColor(null);
      }
    }
    
    return () => clearTimeout(timer);
  }, [slug, products]);

  const product = products.find((p) => productMatchesRouteSlug(p, slug));

  useEffect(() => {
    if (!product?.slug) {
      setProductReviews([]);
      setReviewSummary({ averageRating: 0, count: 0 });
      return;
    }

    let ignore = false;
    setReviewsLoading(true);

    async function loadProductReviews() {
      try {
        const response = await fetch(`/api/reviews?productSlug=${encodeURIComponent(product.slug)}`, {
          cache: "no-store",
        });
        const data = await response.json();

        if (!ignore && response.ok) {
          setProductReviews(data.reviews || []);
          setReviewSummary(data.summary || { averageRating: 0, count: 0 });
        }
      } catch (error) {
        console.error("Failed to load product reviews:", error);
        if (!ignore) {
          setProductReviews([]);
          setReviewSummary({ averageRating: 0, count: 0 });
        }
      } finally {
        if (!ignore) setReviewsLoading(false);
      }
    }

    loadProductReviews();
    return () => {
      ignore = true;
    };
  }, [product?.slug]);

  // Initialize bundle selections when product loads
  useEffect(() => {
    if (product && product.bundleProducts && product.bundleProducts.length > 0 && !bundleInitialized) {
      const initialSelections = {};
      // Current product is always selected
      initialSelections['__current__'] = true;
      product.bundleProducts.forEach((bp) => {
        initialSelections[bp.id] = true;
      });
      setSelectedBundleItems(initialSelections);
      setBundleInitialized(true);
    }
  }, [product, bundleInitialized]);

  // Initialize and update ticker data based on product
  useEffect(() => {
    if (product) {
      const sales = getDeterministicSales(product);
      setUnitsSold(sales);
      
      const hash = (product.slug || "").split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
      setActiveViewers(12 + (hash % 20));
      
      const initialColor = product.colors && product.colors.length > 0 ? product.colors[0].name : "";
      setStockCount(getDeterministicStock(product, initialColor));
    }
  }, [product]);

  // Update variant stock levels when color is changed
  useEffect(() => {
    if (product && selectedColor) {
      setStockCount(getDeterministicStock(product, selectedColor.name));
    }
  }, [selectedColor, product]);

  // Periodically increment sales and toggle viewer count / stock levels
  useEffect(() => {
    if (!product) return;
    
    const interval = setInterval(() => {
      // Randomly increment units sold
      const increment = Math.random() > 0.5 ? 2 : 1;
      setUnitsSold(prev => prev + increment);
      
      // Select new buyer details
      const randomName = INDIAN_NAMES[Math.floor(Math.random() * INDIAN_NAMES.length)];
      const randomCity = INDIAN_CITIES[Math.floor(Math.random() * INDIAN_CITIES.length)];
      const randomQty = Math.random() > 0.7 ? 4 : (Math.random() > 0.4 ? 2 : 1);
      
      setLastBuyer({
        name: randomName,
        city: randomCity,
        qty: randomQty
      });
      
      // Randomly toggle viewers slightly
      setActiveViewers(prev => {
        const change = Math.floor(Math.random() * 5) - 2; // -2 to +2
        return Math.max(8, prev + change);
      });
      
      // Randomly decrement stock count occasionally
      if (Math.random() > 0.75) {
        setStockCount(prev => Math.max(2, prev - 1));
      }
    }, 12000 + Math.random() * 6000); // 12-18s
    
    return () => clearInterval(interval);
  }, [product]);

  // Cycle through ticker messages
  useEffect(() => {
    const interval = setInterval(() => {
      setTickerIndex(prev => (prev + 1) % 4);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  if (!product) {
    return (
      <div className="error-page">
        <h1>Product not found</h1>
        <Link href="/">Return to Home</Link>
      </div>
    );
  }

  const cartQuantity = cartItems.find((item) => item.id === getProductId(product))?.quantity || 0;

  function handleAddToCart() {
    if (product.inStock === false) return;
    

    const nextKey = Date.now();
    setAddEffectKey(nextKey);
    window.setTimeout(() => {
      setAddEffectKey((currentKey) => (currentKey === nextKey ? null : currentKey));
    }, 1050);

    // Pass the selected options and quantity
    addToCart(product, {
      color: selectedColorName,
      quantity: quantity 
    });
  }

  async function handleBuyNow() {
    if (product.inStock === false || isBuyingNow) return;

    const shopifyHandle = product.shopifyHandle || product.slug;
    setIsBuyingNow(true);

    try {
      const variantId = product.shopifyVariantId || product.variantId || product.sku;
      const name = getSelectedProductName();
      const totalPrice = selectedBundle?.price || getProductPrice(product);
      const discountedUnitPrice = quantity > 0 ? totalPrice / quantity : totalPrice;

      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: [{
            variantId,
            quantity,
            name,
            discountedUnitPrice
          }]
        }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.checkoutUrl) {
          window.location.href = data.checkoutUrl;
          return;
        }
      }

      // Fallback to standard checkout if dynamic endpoint fails
      const checkoutUrl = await getShopifyCheckoutUrl(shopifyHandle, quantity);
      window.location.href = checkoutUrl;
    } catch (err) {
      console.warn("Shopify checkout unavailable, falling back to Razorpay:", err.message);
      
      addToCart(product, {
        color: selectedColorName,
        quantity: quantity,
        openCart: false
      });
      const fallbackProduct = selectedColorName
        ? { ...product, selectedColor: selectedColorName }
        : product;
      checkout({
        items: [{ id: getProductId(fallbackProduct), product: fallbackProduct, quantity }],
        amount: selectedBundle?.price || getProductPrice(product)
      });
    } finally {
      setIsBuyingNow(false);
    }
  }

  function adjustQuantity(amount) {
    setQuantity(prev => Math.max(1, prev + amount));
  }

  async function handleSubmitReview(e) {
    e.preventDefault();
    if (!formName.trim() || !formText.trim()) {
      setReviewSubmitError("Please enter your name and review message.");
      return;
    }

    setIsSubmittingReview(true);
    setReviewSubmitError("");
    setReviewSubmitSuccess(false);

    try {
      const response = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName: formName,
          text: formText,
          rating: formRating,
          productSlug: slug,
          productName: product?.name || ""
        })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setReviewSubmitSuccess(true);
        // Append new review locally
        setProductReviews((prev) => [data.review, ...prev]);
        setReviewSummary(data.summary || reviewSummary);

        // Reset fields
        setFormName("");
        setFormText("");
        setFormRating(5);

        // Auto close after 3s
        setTimeout(() => {
          setIsReviewFormOpen(false);
          setReviewSubmitSuccess(false);
        }, 3000);
      } else {
        setReviewSubmitError(data.error || "Failed to submit review.");
      }
    } catch (err) {
      console.error(err);
      setReviewSubmitError("An error occurred. Please try again.");
    } finally {
      setIsSubmittingReview(false);
    }
  }

  function openCustomizationPopup(bundleId) {
    const colors = Array.isArray(product.colors) ? product.colors.filter(c => c && c.name && c.hex) : [];
    if (colors.length === 0) {
      return; // Bypass popup entirely if product has no color options
    }
    const size = bundleId === 1 ? 1 : bundleId; // bundleId is 1, 2, or 4
    setPopupBundleSize(size);
    const defaultColor = colors[0].name;
    setPopupColors(Array(size).fill(defaultColor));
    setPopupQuantity(1);
    setIsBundlePopupOpen(true);
  }

  // Related products (Curated Companions) - prioritizing same category
  const relatedProducts = products
    .filter((p) => p.slug !== product.slug && p.image)
    .sort((a, b) => {
      const aSameCat = a.categories?.some(cat => product.categories?.includes(cat));
      const bSameCat = b.categories?.some(cat => product.categories?.includes(cat));
      if (aSameCat && !bSameCat) return -1;
      if (!aSameCat && bSameCat) return 1;
      return 0;
    })
    .slice(0, 4);

  const parsePrice = (priceStr) => {
    const num = Number((priceStr || '').replace(/[^\d.]/g, ''));
    return isNaN(num) || num === 0 ? null : num;
  };

  const getCompanionDealLabel = (item) => {
    const sale = item.salePrice || parsePrice(item.price);
    const original = item.originalPrice || parsePrice(item.oldPrice);
    if (sale && original && original > sale) {
      return `${Math.round(((original - sale) / original) * 100)}% OFF`;
    }
    return item.badge || "Handpicked";
  };

  const getCompanionMeta = (item) => {
    if (Array.isArray(item.highlights) && item.highlights[0]) return item.highlights[0];
    if (item.detail) return item.detail;
    return "Premium daily essential";
  };

  const basePrice = product.salePrice || parsePrice(product.price) || 599;
  const baseOldPrice = product.originalPrice || parsePrice(product.oldPrice) || Math.round(basePrice * 1.35);
  const productHighlights = Array.isArray(product.highlights) && product.highlights.filter(Boolean).length > 0
    ? product.highlights.filter(Boolean)
    : ["Premium Quality", "Artisanal Design", "Durability Guaranteed"];

  const FREE_SHIPPING_THRESHOLD = 500;
  const SHIPPING_FEE = 70;

  const getShippingSubtext = (price, label = "") => {
    const shippingText = price >= FREE_SHIPPING_THRESHOLD
      ? "Free Priority Shipping"
      : `+ ₹${SHIPPING_FEE} Shipping (Free above ₹${FREE_SHIPPING_THRESHOLD})`;
    return label ? `${label} | ${shippingText}` : shippingText;
  };

  const bundles = [
    { 
      id: 1, 
      title: 'Single', 
      badge: null,
      subtext: getShippingSubtext(basePrice, 'Priority Dispatch'), 
      price: basePrice, 
      oldPrice: baseOldPrice 
    },
    { 
      id: 2, 
      title: 'Pack of 2', 
      badge: null,
      badgeLabel: `Save ₹${(baseOldPrice * 2) - (basePrice * 2)}`,
      subtext: getShippingSubtext(basePrice * 2), 
      price: basePrice * 2, 
      oldPrice: baseOldPrice * 2,
      topBadge: 'MOST POPULAR'
    },
    { 
      id: 4, 
      title: 'Pack of 4', 
      badge: null,
      badgeLabel: `Save ₹${(baseOldPrice * 4) - (basePrice * 4)}`,
      subtext: getShippingSubtext(basePrice * 4), 
      price: basePrice * 4, 
      oldPrice: baseOldPrice * 4,
      topBadge: 'LOWEST PRICE EVER!'
    }
  ];

  const selectedBundle = bundles.find(b => b.id === quantity) || bundles[0];

  const displayBadge = (() => {
    if (quantity === 1) {
      return product.badge;
    }
    return selectedBundle.badge;
  })();

  const displayBadgeClass = (() => {
    if (quantity === 1) {
      return product.badgeClass || 'badge-discount';
    }
    return 'badge-discount';
  })();

  const productColors = Array.isArray(product.colors)
    ? product.colors.filter((color) => color && color.name && color.hex)
    : [];
  const selectedColorName = selectedColor?.name || productColors[0]?.name || "";

  function handleColorSelect(color) {
    if (!color || color.available === false) return;

    setSelectedColor(color);
    setActiveImage(color.image || product.image);
  }

  function getSelectedProductName() {
    return selectedColorName ? `${product.name} - ${selectedColorName}` : product.name;
  }

  function renderReviewStars(rating, size = 14) {
    const rounded = Math.round(Number(rating || 0));
    return [0, 1, 2, 3, 4].map((index) => (
      <Star
        key={index}
        size={size}
        fill={index < rounded ? "currentColor" : "none"}
        strokeWidth={2}
      />
    ));
  }

  const tickerMessages = [
    {
      id: "sales",
      content: (
        <span>
          <strong>
            <motion.span
              key={unitsSold}
              initial={{ scale: 1.25, color: "#ef4444" }}
              animate={{ scale: 1, color: "#1f2937" }}
              style={{ display: "inline-block" }}
              transition={{ duration: 0.4, type: "spring", stiffness: 200 }}
            >
              {unitsSold}+ units sold
            </motion.span>
          </strong> in the last 24 hours
        </span>
      )
    },
    {
      id: "live",
      content: (
        <span>
          🔥 <strong>{lastBuyer.name}</strong> from <strong>{lastBuyer.city}</strong> just bought <strong>{lastBuyer.qty} {lastBuyer.qty > 1 ? "units" : "unit"}</strong>!
        </span>
      )
    },
    {
      id: "stock",
      content: (
        <span>
          ⚡ <strong>High Demand:</strong> Only <strong>{stockCount}</strong> left in stock {selectedColorName ? `for ${selectedColorName}` : ""}!
        </span>
      )
    },
    {
      id: "viewers",
      content: (
        <span>
          ✨ <strong>{activeViewers} people</strong> are viewing this product right now
        </span>
      )
    }
  ];

  const displayProductRating = reviewSummary.averageRating || Number(product.rating || 5) || 5;
  const displayProductReviewCount = reviewSummary.count || productReviews.length;
  const lovedCustomerCount = liveLovedCount.toLocaleString("en-IN");

  return (
    <motion.main 
      className="product-details-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="product-hero-container">
        <div className="product-gallery">
          <div className="main-image-wrapper">
            <motion.div 
              className="main-image"
              key={activeImage}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="image-glow" />
              <img
                src={activeImage || product.image}
                alt={product.name}
                loading="eager"
                decoding="async"
              />
              {displayBadge && <span className={`product-status-badge ${displayBadgeClass}`}>{displayBadge}</span>}
            </motion.div>
          </div>
          
          {product.gallery && product.gallery.length > 1 && (
            <div className="thumbnail-strip">
              {product.gallery.map((img, idx) => (
                <div 
                  key={idx} 
                  className={`thumb-item ${activeImage === img ? 'active' : ''}`}
                  onClick={() => setActiveImage(img)}
                >
                  <img src={img} alt="thumbnail" loading="lazy" decoding="async" />
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="product-info-panel">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >


            <h1 className="product-title bold-title">{product.name}</h1>


            
            <div className="price-display-v2">
              <span className="current-price">Rs. {selectedBundle.price}</span>
              <span className="old-price">Rs. {selectedBundle.oldPrice}</span>
              {selectedBundle.oldPrice - selectedBundle.price > 0 && (
                <span className="discount-tag">SAVE Rs. {selectedBundle.oldPrice - selectedBundle.price}</span>
              )}
            </div>

            <div className="shipping-dynamic-notice" style={{ fontSize: "14px", fontWeight: "600", marginTop: "8px", display: "flex", alignItems: "center", gap: "6px" }}>
              {selectedBundle.price >= FREE_SHIPPING_THRESHOLD ? (
                <span style={{ color: "var(--brand-color)", display: "inline-flex", alignItems: "center", gap: "4px" }}>
                  <Check size={16} strokeWidth={3} /> Free Priority Shipping Eligible
                </span>
              ) : (
                <span style={{ color: "#c27803", display: "inline-flex", alignItems: "center", gap: "4px" }}>
                  🚚 Add Rs. {FREE_SHIPPING_THRESHOLD - selectedBundle.price} more for Free Shipping (Current: +₹{SHIPPING_FEE} Shipping)
                </span>
              )}
            </div>

            <p className="product-short-desc">
              {product.description}
            </p>

            {productColors.length > 0 && (
              <div className="variant-selector">
                <p className="variant-label">
                  Select Color: <span>{selectedColorName}</span>
                </p>
                <div className="color-options" role="radiogroup" aria-label="Select product color">
                  {productColors.map((color, i) => {
                    const isActive = selectedColor ? selectedColor.name === color.name : i === 0;
                    const isUnavailable = color.available === false;
                    return (
                      <button 
                        key={color.name} 
                        className={`color-bubble ${isActive ? 'active' : ''} ${isUnavailable ? 'is-disabled' : ''}`}
                        style={{ "--swatch-color": color.hex }}
                        title={isUnavailable ? `${color.name} unavailable` : color.name}
                        type="button"
                        role="radio"
                        aria-label={`${color.name}${isUnavailable ? " unavailable" : ""}`}
                        aria-checked={isActive}
                        disabled={isUnavailable}
                        onClick={() => handleColorSelect(color)}
                      >
                        {isActive ? <Check size={14} strokeWidth={3} /> : null}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            <div className="product-highlights-v2">
              <h4>Key Highlights</h4>
              <div className="highlights-chips">
                {productHighlights.map((h, i) => (
                  <span key={i} className="highlight-chip">{h}</span>
                ))}
              </div>
            </div>

            <div className="marketing-banners">
              <div className="banner-green">💳 100% Secure Payments — UPI, NetBanking & Cards!</div>
              <div className="banner-text">🎇 SUMMER SALE — BEST PRICE GUARANTEED!</div>
            </div>

            <div className="units-sold-ticker" style={{ overflow: "hidden", display: "inline-flex", alignItems: "center", width: "100%", minHeight: "42px" }}>
              <div className="pulsing-dot" style={{ flexShrink: 0 }}></div>
              <div style={{ flex: 1, overflow: "hidden", position: "relative", minHeight: "20px", display: "flex", alignItems: "center" }}>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={tickerIndex}
                    initial={{ y: 15, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -15, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                  >
                    {tickerMessages[tickerIndex].content}
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>

            <div className="bundle-separator">
              <span>BUNDLE & SAVE</span>
            </div>

            <div className="bundle-options">
              {bundles.map((b) => (
                <div 
                  key={b.id} 
                  className={`bundle-option ${quantity === b.id ? 'selected' : ''}`}
                  onClick={() => {
                    setQuantity(b.id);
                    openCustomizationPopup(b.id);
                  }}
                >
                  {b.topBadge && <div className="bundle-top-badge">{b.topBadge}</div>}
                  <div className="bundle-radio">
                    <div className={`radio-outer ${quantity === b.id ? 'active' : ''}`}>
                      {quantity === b.id && <div className="radio-inner" />}
                    </div>
                  </div>
                  <div className="bundle-details">
                    <div className="bundle-title-row">
                      <span className="bundle-title">{b.title}</span>
                      {b.badge && <span className="bundle-badge">{b.badge}</span>}
                      {b.badgeLabel && <span className="bundle-badge">{b.badgeLabel}</span>}
                    </div>
                    <div className="bundle-subtext">{b.subtext}</div>
                  </div>
                  <div className="bundle-pricing">
                    <div className="bundle-price">Rs. {b.price}</div>
                    <div className="bundle-old-price">Rs. {b.oldPrice}</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="purchase-actions-v2 product-buy-actions">
              <button 
                className="block-btn"
                type="button"
                onClick={() => handleAddToCart()}
              >
                <ShoppingBag size={18} strokeWidth={2.2} />
                <span>Add to cart</span>
              </button>

              <button 
                className={`buy-now-btn ${isBuyingNow ? 'loading' : ''}`} 
                type="button"
                onClick={() => handleBuyNow()}
                disabled={isBuyingNow}
              >
                <span className="buy-text">{isBuyingNow ? 'Redirecting...' : 'BUY NOW'}</span>
                {!isBuyingNow && (
                  <div className="buy-icons-pill">
                     <span className="payment-badge gpay">GPay</span>
                     <span className="payment-badge phonepe">Pe</span>
                     <span className="payment-badge paytm">Paytm</span>
                  </div>
                )}
                {isBuyingNow ? (
                  <div className="buy-now-spinner" />
                ) : (
                  <ChevronRight size={20} />
                )}
              </button>
            </div>


            <div className="trust-features-grid">
              <div className="trust-feature secure-pay">
                <div className="tf-icon"><ShieldCheck size={28} strokeWidth={1.6} /></div>
                <span>100% Secure<br/>Payments</span>
              </div>
              <div className="trust-feature priority-ship">
                <div className="tf-icon"><Tag size={28} strokeWidth={1.6} /></div>
                <span>Priority<br/>Dispatch</span>
              </div>
              <div className="trust-feature returns-policy">
                <div className="tf-icon"><Undo2 size={28} strokeWidth={1.6} /></div>
                <span>7-Day Worry<br/>Free Returns</span>
              </div>
            </div>

            {product.specifications && Object.keys(product.specifications).length > 0 && (
            <div className="details-accordion-v2">
              <div className="acc-item">
                <button className="acc-trigger" onClick={() => setActiveTab(activeTab === 'specs' ? '' : 'specs')}>
                  Technical Specifications
                  <Plus size={18} className={activeTab === 'specs' ? 'rotate' : ''} />
                </button>
                <AnimatePresence>
                  {activeTab === 'specs' && (
                    <motion.div 
                      className="acc-body"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                    >
                      <div className="specs-table">
                        {Object.entries(product.specifications).map(([k, v], i) => (
                          <div key={i} className="spec-row-v2">
                            <span className="spec-key">{k}</span>
                            <span className="spec-val">{v}</span>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
            )}
          </motion.div>
      </div>
    </div>

    {/* Product Video Section */}
    {(() => {
      const productVideo = peopleChoiceVideos.find(v => v.slug === slug);
      if (!productVideo || !productVideo.video) return null;

      return (
        <section className="product-video-section">
          <div className="section-heading centered">
            <p className="eyebrow">Product in action</p>
            <h2>See it for yourself</h2>
          </div>
          <div className="product-video-container">
            <video 
              className="product-detail-video" 
              autoPlay 
              muted={!videoSoundOn} 
              loop 
              playsInline 
              preload="auto"
            >
              <source src={productVideo.video} type="video/mp4" />
            </video>
            <button
              className={`product-video-sound ${videoSoundOn ? "is-active" : ""}`}
              type="button"
              onClick={() => setVideoSoundOn(!videoSoundOn)}
              title={videoSoundOn ? "Mute video" : "Unmute video"}
            >
              {videoSoundOn ? <Volume2 size={24} /> : <VolumeX size={24} />}
            </button>
            <div className="video-overlay-gradient" />
          </div>
        </section>
      );
    })()}

    {/* Customer Reviews Section */}
    <section className="customer-reviews-section">
      <div className="reviews-header">
        <p className="eyebrow" style={{ textAlign: 'center', marginBottom: '8px' }}>Trusted by thousands</p>
        <div className="loved-badge">
          <div className="avatar-stack">
            <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&h=150&q=80" alt="Customer avatar" />
            <img src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&h=150&q=80" alt="Customer avatar" />
            <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&h=150&q=80" alt="Customer avatar" />
            <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&h=150&q=80" alt="Customer avatar" />
          </div>
          <span className="heart-icon">❤️</span>
          <span>Loved by {lovedCustomerCount}+ Customers</span>
        </div>
        <h2>What Our Customers Say</h2>
        <div className="reviews-meta">
          <span className="stars-display">{renderReviewStars(displayProductRating, 15)}</span>
          <span className="rating-text">
            {displayProductRating.toFixed(1)} out of 5 ({displayProductReviewCount})
          </span>
          <span className="verified-badge">
             <Check size={14} strokeWidth={3} /> Verified
          </span>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '32px' }}>
        <button
          onClick={() => setIsReviewFormOpen(!isReviewFormOpen)}
          style={{
            background: 'transparent',
            color: 'var(--brand-color)',
            border: '2px solid var(--brand-color)',
            borderRadius: '100px',
            padding: '10px 28px',
            fontWeight: 700,
            fontSize: '14px',
            cursor: 'pointer',
            transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            boxShadow: '0 4px 12px rgba(63, 100, 105, 0.05)'
          }}
          type="button"
          className="write-review-toggle-btn"
        >
          ✍️ {isReviewFormOpen ? 'Close Form' : 'Write a Review'}
        </button>
      </div>

      <AnimatePresence>
        {isReviewFormOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0, marginBottom: 0 }}
            animate={{ height: 'auto', opacity: 1, marginBottom: 40 }}
            exit={{ height: 0, opacity: 0, marginBottom: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            style={{ overflow: 'hidden', width: '100%', maxWidth: '580px', margin: '0 auto' }}
          >
            <form
              onSubmit={handleSubmitReview}
              style={{
                background: 'var(--white-color)',
                border: '1.5px solid rgba(63, 100, 105, 0.12)',
                borderRadius: '20px',
                padding: '28px 24px',
                boxShadow: '0 20px 50px rgba(63, 100, 105, 0.08)',
                display: 'flex',
                flexDirection: 'column',
                gap: '18px'
              }}
            >
              <h3 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--ink)', textAlign: 'center', margin: '0 0 4px' }}>
                Share Your Experience
              </h3>

              {/* Star Selection */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
                <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Your Rating
                </span>
                <div style={{ display: 'flex', gap: '6px', color: '#fbbf24', cursor: 'pointer' }}>
                  {[1, 2, 3, 4, 5].map((starIdx) => {
                    const isFilled = starIdx <= (formHoverRating || formRating);
                    return (
                      <Star
                        key={starIdx}
                        size={28}
                        fill={isFilled ? "currentColor" : "none"}
                        strokeWidth={1.8}
                        onMouseEnter={() => setFormHoverRating(starIdx)}
                        onMouseLeave={() => setFormHoverRating(0)}
                        onClick={() => setFormRating(starIdx)}
                        style={{ transition: 'transform 0.2s ease' }}
                        className="interactive-form-star"
                      />
                    );
                  })}
                </div>
              </div>

              {/* Name Input */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label htmlFor="review-form-name" style={{ fontSize: '12px', fontWeight: 700, color: 'var(--brand-color)', textTransform: 'uppercase', letterSpacing: '0.03em' }}>
                  Your Name
                </label>
                <input
                  id="review-form-name"
                  type="text"
                  placeholder="Enter your name (e.g. Rahul S.)"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  required
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    borderRadius: '10px',
                    border: '1.5px solid rgba(63, 100, 105, 0.16)',
                    outline: 'none',
                    fontSize: '14px',
                    background: 'var(--cream)',
                    color: 'var(--ink)',
                    transition: 'border-color 0.25s'
                  }}
                  className="review-form-input"
                />
              </div>

              {/* Textarea */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label htmlFor="review-form-text" style={{ fontSize: '12px', fontWeight: 700, color: 'var(--brand-color)', textTransform: 'uppercase', letterSpacing: '0.03em' }}>
                  Review Comments
                </label>
                <textarea
                  id="review-form-text"
                  placeholder="What did you like about this product? Tell us your experience..."
                  value={formText}
                  onChange={(e) => setFormText(e.target.value)}
                  required
                  rows={4}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    borderRadius: '10px',
                    border: '1.5px solid rgba(63, 100, 105, 0.16)',
                    outline: 'none',
                    fontSize: '14px',
                    background: 'var(--cream)',
                    color: 'var(--ink)',
                    resize: 'none',
                    lineHeight: 1.5,
                    transition: 'border-color 0.25s'
                  }}
                  className="review-form-input"
                />
              </div>

              {/* Submission Notice */}
              {reviewSubmitSuccess && (
                <div style={{ color: '#059669', background: '#ecfdf5', border: '1px solid #a7f3d0', borderRadius: '10px', padding: '10px 14px', fontSize: '13px', fontWeight: 600 }}>
                  🎉 Review submitted successfully! Thank you for sharing your feedback.
                </div>
              )}
              {reviewSubmitError && (
                <div style={{ color: '#dc2626', background: '#fef2f2', border: '1px solid #fca5a5', borderRadius: '10px', padding: '10px 14px', fontSize: '13px', fontWeight: 600 }}>
                  ❌ {reviewSubmitError}
                </div>
              )}

              {/* Buttons */}
              <div style={{ display: 'flex', gap: '12px', marginTop: '4px' }}>
                <button
                  type="submit"
                  disabled={isSubmittingReview || reviewSubmitSuccess}
                  style={{
                    flex: 1,
                    background: 'var(--brand-color)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '10px',
                    padding: '14px',
                    fontWeight: 700,
                    fontSize: '14px',
                    cursor: (isSubmittingReview || reviewSubmitSuccess) ? 'not-allowed' : 'pointer',
                    opacity: (isSubmittingReview || reviewSubmitSuccess) ? 0.7 : 1,
                    transition: 'opacity 0.25s',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px'
                  }}
                >
                  {isSubmittingReview ? 'Submitting...' : 'Submit Review'}
                </button>
                <button
                  type="button"
                  onClick={() => setIsReviewFormOpen(false)}
                  style={{
                    background: 'transparent',
                    color: 'var(--muted)',
                    border: '1.5px solid rgba(63, 100, 105, 0.2)',
                    borderRadius: '10px',
                    padding: '14px 20px',
                    fontWeight: 600,
                    fontSize: '14px',
                    cursor: 'pointer',
                    transition: 'all 0.25s'
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {!reviewsLoading && productReviews.length === 0 ? (
        <div 
          className="no-reviews-box"
          style={{
            background: 'var(--cream)',
            border: '2px dashed rgba(63, 100, 105, 0.15)',
            borderRadius: '24px',
            padding: '48px 24px',
            textAlign: 'center',
            maxWidth: '580px',
            margin: '20px auto 0',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '16px',
            boxShadow: '0 8px 30px rgba(63, 100, 105, 0.03)'
          }}
        >
          <div style={{ fontSize: '48px' }}>✨</div>
          <h3 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--brand-color)', margin: 0 }}>Be the First to Review!</h3>
          <p style={{ fontSize: '15px', color: 'var(--muted)', lineHeight: 1.6, maxWidth: '420px', margin: 0 }}>
            No reviews yet for this product. Share your experience with other shoppers by leaving a detailed rating and review.
          </p>
          <button
            onClick={() => setIsReviewFormOpen(true)}
            style={{
              background: 'var(--brand-color)',
              color: 'white',
              border: 'none',
              borderRadius: '100px',
              padding: '12px 32px',
              fontWeight: 700,
              fontSize: '14px',
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(63, 100, 105, 0.15)',
              transition: 'all 0.25s'
            }}
            type="button"
          >
            Leave a Review
          </button>
        </div>
      ) : (
        <div className="reviews-carousel">
          <button className="review-nav review-prev" onClick={() => { if (reviewTrackRef.current) reviewTrackRef.current.scrollBy({ left: -344, behavior: 'smooth' }); }}>‹</button>
          <div className="reviews-track" ref={reviewTrackRef}>
            {(reviewsLoading
              ? [{ id: "loading", text: "Loading customer reviews...", customerName: "Pubesto", rating: 5, customerImage: "" }]
              : productReviews
            ).map((review, i) => (
              <div className="review-card" key={review.id || i}>
                <div className="review-stars">{renderReviewStars(review.rating || displayProductRating)}</div>
                <p className="review-text">"{review.text}"</p>
                <div className="reviewer-info">
                  <div className="reviewer-avatar">
                    <img src={review.customerImage || getReviewAvatar(review.customerName)}
                      alt={review.customerName}
                      loading="lazy"
                      fetchPriority="low"
                      decoding="async"
                    />
                  </div>
                  <div className="reviewer-details">
                    <h4>{review.customerName}</h4>
                    <p>Verified Buyer</p>
                  </div>
                  <div className="verified-tag">
                    <ShieldCheck size={18} fill="rgba(27, 98, 75, 0.1)" />
                  </div>
                </div>
              </div>
            ))}
          </div>
          <button className="review-nav review-next" onClick={() => { if (reviewTrackRef.current) reviewTrackRef.current.scrollBy({ left: 344, behavior: 'smooth' }); }}>›</button>
        </div>
      )}
    </section>

    <motion.section
      className="curated-companions curated-companions-premium"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1 }}
      >
        <div className="curated-shell">
          <div className="curated-header">
            <div className="section-heading">
              <p className="eyebrow">Complete your setup</p>
              <h2>Curated Companions</h2>
              <p className="curated-subtitle">Smart add-ons customers usually buy with this product.</p>
            </div>
            <div className="curated-proof">
              <span><Sparkles size={15} /> Staff picks</span>
              <span><ShieldCheck size={15} /> Verified quality</span>
            </div>
          </div>
          <div className="companions-grid curated-grid">
            {relatedProducts.map((p, i) => {
              const pCartQty = cartItems.find((item) => item.id === getProductId(p))?.quantity || 0;
              const companionRating = p.rating || "4.8";
              const companionReviews = p.reviews || "24";
              return (
                <motion.article
                  className="curated-product-card"
                  key={p.slug}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                >
                  <Link className="curated-media" href={`/product/${p.slug}`} aria-label={`View ${p.name}`}>
                    <img src={p.image} alt={p.name} loading="lazy" fetchPriority="low" decoding="async" />
                    <span className="curated-deal">{getCompanionDealLabel(p)}</span>
                    <span className="curated-view">View details <ArrowRight size={14} /></span>
                  </Link>
                  <div className="curated-product-body">
                    <div className="curated-rating-row">
                      <span className="curated-stars" aria-label={`${companionRating} out of 5`}>
                        {renderReviewStars(companionRating, 13)}
                      </span>
                      <span>{companionRating} ({companionReviews})</span>
                    </div>
                    <Link className="curated-title-link" href={`/product/${p.slug}`}>
                      <h3>{p.name}</h3>
                    </Link>
                    <p className="curated-meta">{getCompanionMeta(p)}</p>
                    <div className="curated-price-row">
                      <p className="price">
                        {p.price}
                        {p.oldPrice ? <span>{p.oldPrice}</span> : null}
                      </p>
                      <span className="curated-stock">{p.inStock === false ? "Sold out" : "In stock"}</span>
                    </div>
                    {p.inStock === false ? (
                      <button className="quick-add disabled" disabled>Out of Stock</button>
                    ) : pCartQty > 0 ? (
                      <div className="product-quantity-selector curated-quantity-selector">
                        <button 
                          type="button" 
                          onClick={() => updateCartQuantity(getProductId(p), pCartQty - 1)}
                          aria-label="Decrease quantity"
                        >
                          <Minus size={16} />
                        </button>
                        <span>{pCartQty}</span>
                        <button 
                          type="button" 
                          onClick={() => updateCartQuantity(getProductId(p), pCartQty + 1)}
                          aria-label="Increase quantity"
                        >
                          <Plus size={16} />
                        </button>
                      </div>
                    ) : (
                      <button
                        className="quick-add curated-quick-add"
                        type="button"
                        onClick={() => addToCart(p)}
                      >
                        <ShoppingBag size={16} />
                        Add to Cart
                      </button>
                    )}
                  </div>
                </motion.article>
              );
            })}
          </div>
        </div>
      </motion.section>

      <AnimatePresence>
        {isBundlePopupOpen && (
          <motion.div 
            className="bundle-popup-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsBundlePopupOpen(false)}
          >
            <motion.div 
              className="bundle-popup-content"
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: "spring", duration: 0.5 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button 
                className="bundle-popup-close"
                onClick={() => setIsBundlePopupOpen(false)}
                aria-label="Close customization popup"
              >
                <X size={18} />
              </button>

              <div className="bundle-popup-header">
                <h2>Customize Your Bundle</h2>
                <p>Select your preferred color combination below</p>
              </div>

              <div className="bundle-popup-grid">
                <div className="bundle-popup-slots">
                  {Array.from({ length: popupBundleSize }).map((_, index) => {
                    const chosenColorName = popupColors[index] || "";
                    const chosenColorObj = productColors.find(c => c.name === chosenColorName) || productColors[0];
                    const slotImg = chosenColorObj?.image || product.image;

                    return (
                      <div key={index} className="bundle-slot-card">
                        <span className="slot-title">Fan #{index + 1} Color</span>
                        <div className="slot-body">
                          <div className="slot-preview">
                            <img src={slotImg} alt={chosenColorName} />
                          </div>
                          <div className="slot-colors">
                            <p className="color-name-label">{chosenColorName || "Select Color"}</p>
                            <div className="color-options-row">
                              {productColors.map((color) => {
                                const isSelected = chosenColorName === color.name;
                                return (
                                  <button
                                    key={color.name}
                                    className={`color-chip ${isSelected ? 'active' : ''}`}
                                    style={{ "--swatch-color": color.hex }}
                                    title={color.name}
                                    type="button"
                                    onClick={() => {
                                      const updated = [...popupColors];
                                      updated[index] = color.name;
                                      setPopupColors(updated);
                                    }}
                                  >
                                    {isSelected && <Check size={14} strokeWidth={3} />}
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="bundle-popup-footer">
                <div className="footer-left">
                  <div className="bundle-quantity-control">
                    <span className="qty-label">Quantity:</span>
                    <div className="qty-selector">
                      <button 
                        type="button" 
                        onClick={() => setPopupQuantity(q => Math.max(1, q - 1))}
                        aria-label="Decrease bundle quantity"
                      >
                        <Minus size={14} strokeWidth={2.5} />
                      </button>
                      <span className="qty-count">{popupQuantity}</span>
                      <button 
                        type="button" 
                        onClick={() => setPopupQuantity(q => q + 1)}
                        aria-label="Increase bundle quantity"
                      >
                        <Plus size={14} strokeWidth={2.5} />
                      </button>
                    </div>
                  </div>

                  {(() => {
                    const bundleObj = bundles.find(b => b.id === popupBundleSize) || bundles[0];
                    const currentPrice = bundleObj.price * popupQuantity;
                    const oldPrice = bundleObj.oldPrice * popupQuantity;

                    return (
                      <div className="bundle-popup-price">
                        <div className="popup-price-row">
                          <span className="current-price">Rs. {currentPrice}</span>
                          {oldPrice > currentPrice && (
                            <span className="old-price">Rs. {oldPrice}</span>
                          )}
                        </div>
                      </div>
                    );
                  })()}
                </div>

                <button 
                  className="bundle-popup-next"
                  type="button"
                  onClick={async () => {
                    if (isBuyingNow) return;
                    setIsBuyingNow(true);
                    try {
                      // 1. Add customized bundle to cart
                      await addToCart(product, {
                        quantity: popupQuantity,
                        selectedColors: popupColors,
                        openCart: false
                      });
                      // 2. Direct storefront checkout redirect
                      await checkout({
                        items: [{
                          product: {
                            ...product,
                            selectedColors: popupColors
                          },
                          quantity: popupQuantity
                        }]
                      });
                    } catch (error) {
                      console.error("Popup checkout redirection failed:", error);
                    } finally {
                      setIsBuyingNow(false);
                      setIsBundlePopupOpen(false);
                    }
                  }}
                  disabled={isBuyingNow}
                >
                  <span>{isBuyingNow ? "Redirecting..." : "Next"}</span>
                  {!isBuyingNow && <ArrowRight size={18} strokeWidth={2.2} />}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.main>
  );
}

export default function ProductPage() {
  return <ProductPageContent />;
}
