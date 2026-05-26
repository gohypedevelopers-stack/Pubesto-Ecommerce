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

const REVIEW_NAME_MAX_LENGTH = 50;
const REVIEW_TEXT_MIN_LENGTH = 20;
const REVIEW_TEXT_MAX_LENGTH = 500;
const REVIEW_RATING_COPY = ["Poor", "Fair", "Good", "Very good", "Excellent"];

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
  const [quantity, setQuantity] = useState(1);
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
  const [popupBundleSize, setPopupBundleSize] = useState(1);
  const [popupColors, setPopupColors] = useState([]);
  const [popupQuantity, setPopupQuantity] = useState(1);
  const [bundleColorSelections, setBundleColorSelections] = useState({});
  const [bundlePopupError, setBundlePopupError] = useState("");
  const [bundlePopupNotice, setBundlePopupNotice] = useState("");
  const [isAddingBundleToCart, setIsAddingBundleToCart] = useState(false);

  // Review Submission State
  const [isReviewFormOpen, setIsReviewFormOpen] = useState(false);
  const [formRating, setFormRating] = useState(5);
  const [formHoverRating, setFormHoverRating] = useState(0);
  const [formName, setFormName] = useState("");
  const [formText, setFormText] = useState("");
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [reviewSubmitSuccess, setReviewSubmitSuccess] = useState(false);
  const [reviewSubmitError, setReviewSubmitError] = useState("");
  const reviewAutoCloseTimeoutRef = useRef(null);

  // Dynamic ticker states
  const [unitsSold, setUnitsSold] = useState(1100);
  const [stockCount, setStockCount] = useState(8);
  const [activeViewers, setActiveViewers] = useState(24);
  const [tickerIndex, setTickerIndex] = useState(0);
  const [lastBuyer, setLastBuyer] = useState({ name: "Rahul", city: "Mumbai", qty: 2 });

  const [liveLovedCount, setLiveLovedCount] = useState(1000);
  const trimmedFormName = formName.trim();
  const trimmedFormText = formText.trim();
  const reviewTextLength = formText.length;
  const reviewTextRemaining = Math.max(0, REVIEW_TEXT_MAX_LENGTH - reviewTextLength);
  const activeReviewRating = formHoverRating || formRating;
  const reviewRatingLabel = REVIEW_RATING_COPY[(activeReviewRating || 1) - 1] || REVIEW_RATING_COPY[0];
  const isReviewTextTooShort = trimmedFormText.length > 0 && trimmedFormText.length < REVIEW_TEXT_MIN_LENGTH;
  const isReviewFormValid = trimmedFormName.length >= 2 && trimmedFormText.length >= REVIEW_TEXT_MIN_LENGTH;

  const clearReviewAutoCloseTimer = () => {
    if (reviewAutoCloseTimeoutRef.current) {
      clearTimeout(reviewAutoCloseTimeoutRef.current);
      reviewAutoCloseTimeoutRef.current = null;
    }
  };

  const resetReviewFormFields = () => {
    setFormRating(5);
    setFormHoverRating(0);
    setFormName("");
    setFormText("");
  };

  const closeReviewForm = () => {
    clearReviewAutoCloseTimer();
    resetReviewFormFields();
    setIsReviewFormOpen(false);
    setReviewSubmitError("");
    setReviewSubmitSuccess(false);
  };

  const toggleReviewForm = () => {
    clearReviewAutoCloseTimer();
    setReviewSubmitError("");
    setReviewSubmitSuccess(false);
    setIsReviewFormOpen((prev) => {
      if (prev) resetReviewFormFields();
      return !prev;
    });
  };

  const openReviewForm = () => {
    clearReviewAutoCloseTimer();
    setReviewSubmitError("");
    setReviewSubmitSuccess(false);
    setIsReviewFormOpen(true);
  };

  const handleReviewNameChange = (event) => {
    setReviewSubmitError("");
    setReviewSubmitSuccess(false);
    setFormName(event.target.value.slice(0, REVIEW_NAME_MAX_LENGTH));
  };

  const handleReviewTextChange = (event) => {
    setReviewSubmitError("");
    setReviewSubmitSuccess(false);
    setFormText(event.target.value.slice(0, REVIEW_TEXT_MAX_LENGTH));
  };

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
    return () => {
      clearReviewAutoCloseTimer();
    };
  }, []);

  useEffect(() => {
    // Force scroll to top with a slight delay to ensure content is ready
    const timer = setTimeout(() => {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    }, 10);
    
    // Initialize product states
    const product = products.find((p) => productMatchesRouteSlug(p, slug));
    if (product) {
      if (product.colors && product.colors.length > 0) {
        // If current selectedColor is not in new product.colors, reset to first color
        const isCurrentColorValid = selectedColor && product.colors.some(
          (c) => c.name.toLowerCase() === selectedColor.name.toLowerCase()
        );
        
        if (!isCurrentColorValid) {
          setSelectedColor(product.colors[0]);
          if (product.colors[0].image) {
            setActiveImage(product.colors[0].image);
          } else {
            setActiveImage(product.image);
          }
        } else {
          // Keep existing color but update its reference from the new list
          const matched = product.colors.find(
            (c) => c.name.toLowerCase() === selectedColor.name.toLowerCase()
          );
          setSelectedColor(matched);
        }
      } else {
        setSelectedColor(null);
        setActiveImage(product.image);
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

    if (productColors.length > 0 && quantity > 1) {
      openCustomizationPopup(quantity);
      return;
    }
    

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

    if (productColors.length > 0 && quantity > 1) {
      openCustomizationPopup(quantity);
      return;
    }

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
    if (!trimmedFormName || !trimmedFormText) {
      setReviewSubmitError("Please enter your name and review message.");
      return;
    }
    if (trimmedFormName.length < 2) {
      setReviewSubmitError("Please enter a valid name.");
      return;
    }
    if (trimmedFormText.length < REVIEW_TEXT_MIN_LENGTH) {
      setReviewSubmitError(`Please write at least ${REVIEW_TEXT_MIN_LENGTH} characters.`);
      return;
    }

    setIsSubmittingReview(true);
    clearReviewAutoCloseTimer();
    setReviewSubmitError("");
    setReviewSubmitSuccess(false);

    try {
      const response = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName: trimmedFormName,
          text: trimmedFormText,
          rating: formRating,
          productSlug: product?.slug || slug,
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
        resetReviewFormFields();

        // Auto close after 3s
        reviewAutoCloseTimeoutRef.current = setTimeout(() => {
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
    const nextColors = normalizeBundleColors(bundleColorSelections[size], size);
    setPopupBundleSize(size);
    setPopupColors(nextColors);
    setPopupQuantity(1);
    setBundlePopupError("");
    setBundlePopupNotice("");
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
      badge: `${Math.round(((baseOldPrice - basePrice) / baseOldPrice) * 100)}% OFF`,
      badgeLabel: `Save ₹${Math.round(baseOldPrice - basePrice)}`,
      subtext: getShippingSubtext(basePrice, 'Priority Dispatch'), 
      price: basePrice, 
      oldPrice: baseOldPrice 
    },
    { 
      id: 2, 
      title: 'Pack of 2', 
      badge: '30% OFF',
      badgeLabel: `Save ₹${Math.round(baseOldPrice * 2 * 0.3)}`,
      subtext: getShippingSubtext(Math.round(baseOldPrice * 2 * 0.7)), 
      price: Math.round(baseOldPrice * 2 * 0.7), 
      oldPrice: baseOldPrice * 2,
      topBadge: 'MOST POPULAR'
    },
    { 
      id: 4, 
      title: 'Pack of 4', 
      badge: '40% OFF',
      badgeLabel: `Save ₹${Math.round(baseOldPrice * 4 * 0.4)}`,
      subtext: getShippingSubtext(Math.round(baseOldPrice * 4 * 0.6)), 
      price: Math.round(baseOldPrice * 4 * 0.6), 
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
  const popupBundle = bundles.find((b) => b.id === popupBundleSize) || bundles[0];
  const popupCurrentPrice = (popupBundle?.price || basePrice * popupBundleSize) * popupQuantity;
  const popupOldPrice = (popupBundle?.oldPrice || baseOldPrice * popupBundleSize) * popupQuantity;
  const popupUnitCount = popupBundleSize * popupQuantity;
  const popupSelectedSummary = popupColors.filter(Boolean).join(" + ");
  const isBundlePopupValid = (
    popupColors.length === popupBundleSize &&
    popupColors.every((colorName) => productColors.some((color) => color.name === colorName && color.available !== false))
  );

  function getDefaultBundleColors(size) {
    const availableColors = productColors.filter((color) => color.available !== false);
    if (availableColors.length === 0) return [];

    return Array.from({ length: size }, (_, index) => availableColors[index % availableColors.length].name);
  }

  function normalizeBundleColors(colors, size) {
    const defaults = getDefaultBundleColors(size);
    return Array.from({ length: size }, (_, index) => {
      const requested = Array.isArray(colors) ? colors[index] : "";
      const requestedColor = productColors.find((color) => color.name === requested && color.available !== false);
      return requestedColor?.name || defaults[index] || "";
    });
  }

  function persistBundleSelection(colors = popupColors, size = popupBundleSize) {
    const normalizedColors = normalizeBundleColors(colors, size);
    setBundleColorSelections((current) => ({ ...current, [size]: normalizedColors }));
    setQuantity(size);

    if (size === 1) {
      const colorObject = productColors.find((color) => color.name === normalizedColors[0]);
      if (colorObject) handleColorSelect(colorObject);
    }

    return normalizedColors;
  }

  function updatePopupColor(index, colorName) {
    const colorObject = productColors.find((color) => color.name === colorName && color.available !== false);
    if (!colorObject) return;

    setBundlePopupError("");
    setBundlePopupNotice("");
    const updated = normalizeBundleColors(popupColors, popupBundleSize);
    updated[index] = colorObject.name;
    setPopupColors(updated);
    setBundleColorSelections((current) => ({ ...current, [popupBundleSize]: updated }));
  }

  function closeBundlePopup() {
    setBundlePopupError("");
    setBundlePopupNotice("");
    setIsBundlePopupOpen(false);
  }

  async function handleCustomizedBundleAction(action) {
    if (isBuyingNow || isAddingBundleToCart) return;

    const selectedColors = persistBundleSelection();
    if (!selectedColors.length || !selectedColors.every(Boolean)) {
      setBundlePopupError("Please select a color for every item in this bundle.");
      return;
    }

    const bundleProduct = {
      ...product,
      selectedColors,
      selectedBundleSize: popupBundleSize,
      selectedBundleTitle: popupBundle?.title || `Pack of ${popupBundleSize}`,
    };

    if (action === "cart") {
      setIsAddingBundleToCart(true);
      try {
        await addToCart(bundleProduct, {
          quantity: popupQuantity,
          selectedColors,
          openCart: true,
        });
        setBundlePopupNotice("Customized bundle added to cart.");
        window.setTimeout(() => {
          setIsBundlePopupOpen(false);
          setBundlePopupNotice("");
        }, 650);
      } catch (error) {
        console.error("Bundle add to cart failed:", error);
        setBundlePopupError("Could not add this bundle to cart. Please try again.");
      } finally {
        setIsAddingBundleToCart(false);
      }
      return;
    }

    setIsBuyingNow(true);
    try {
      await addToCart(bundleProduct, {
        quantity: popupQuantity,
        selectedColors,
        openCart: false,
      });
      await checkout({
        items: [{ product: bundleProduct, quantity: popupQuantity }],
        amount: popupCurrentPrice,
      });
    } catch (error) {
      console.error("Popup checkout redirection failed:", error);
      setBundlePopupError("Checkout could not start. Please try again.");
    } finally {
      setIsBuyingNow(false);
      setIsBundlePopupOpen(false);
    }
  }

  function handleColorSelect(color) {
    if (!color || color.available === false) return;

    setSelectedColor(color);
    setActiveImage(color.image || product.image);
  }

  function handleThumbnailClick(img) {
    setActiveImage(img);
    if (productColors && productColors.length > 0) {
      const matchedColor = productColors.find(c => c.image === img);
      if (matchedColor) {
        setSelectedColor(matchedColor);
      }
    }
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

  const renderBundleWidget = (isGallery = false) => {
    return (
      <div className={`bundle-widget-wrap ${isGallery ? 'in-gallery' : ''}`} style={isGallery ? { padding: '24px 16px', background: 'var(--panel)', borderRadius: '12px', width: '100%', boxSizing: 'border-box' } : {}}>
        <div className="bundle-separator" style={isGallery ? { marginTop: 0 } : {}}>
          <span>BUNDLE & SAVE</span>
        </div>

        <div className="bundle-options" style={isGallery ? { display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' } : {}}>
          {bundles.map((b) => (
            <div 
              key={b.id} 
              className={`bundle-option ${quantity === b.id ? 'selected' : ''}`}
              onClick={() => {
                setQuantity(b.id);
                openCustomizationPopup(b.id);
              }}
              style={isGallery ? { padding: '10px 12px' } : {}}
            >
              {b.topBadge && <div className="bundle-top-badge">{b.topBadge}</div>}
              <div className="bundle-radio">
                <div className={`radio-outer ${quantity === b.id ? 'active' : ''}`}>
                  {quantity === b.id && <div className="radio-inner" />}
                </div>
              </div>
              <div className="bundle-details">
                <div className="bundle-title-row">
                  <span className="bundle-title" style={{ color: '#000000', fontSize: '14px', fontWeight: '600' }}>{b.title}</span>
                  {b.badge && <span className="bundle-badge">{b.badge}</span>}
                  {b.badgeLabel && <span className="bundle-badge">{b.badgeLabel}</span>}
                </div>
                <div className="bundle-subtext" style={{ fontSize: '11px', color: '#666' }}>{b.subtext}</div>
                {productColors.length > 0 && (
                  <div className="bundle-color-summary" aria-label={`${b.title} selected colors`}>
                    {normalizeBundleColors(bundleColorSelections[b.id], b.id).map((colorName, index) => {
                      const color = productColors.find((item) => item.name === colorName);
                      return (
                        <span
                          key={`${b.id}-${index}-${colorName}`}
                          className="bundle-color-dot"
                          style={{ "--swatch-color": color?.hex || "#f5f5f5" }}
                          title={colorName}
                        />
                      );
                    })}
                    <button
                      className="bundle-customize-link"
                      type="button"
                      onClick={(event) => {
                        event.stopPropagation();
                        setQuantity(b.id);
                        openCustomizationPopup(b.id);
                      }}
                    >
                      Customize
                    </button>
                  </div>
                )}
              </div>
              <div className="bundle-pricing">
                <div className="bundle-price">Rs. {b.price}</div>
                {b.id > 1 && (
                  <span className="bundle-unit-price" style={{ fontSize: '11px', color: 'var(--muted)', display: 'block', margin: '2px 0 1px', fontWeight: '500' }}>
                    (Rs. {Math.round(b.price / b.id)} / item)
                  </span>
                )}
                <div className="bundle-old-price">Rs. {b.oldPrice}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="purchase-actions-v2 product-buy-actions" style={isGallery ? { margin: '8px 0 0', display: 'flex', flexDirection: 'column', gap: '8px' } : {}}>
          <button 
            className="block-btn"
            type="button"
            onClick={() => handleAddToCart()}
            style={isGallery ? { width: '100%', minHeight: '44px' } : {}}
          >
            <ShoppingBag size={18} strokeWidth={2.2} />
            <span>Add to cart</span>
          </button>

          <button 
            className={`buy-now-btn ${isBuyingNow ? 'loading' : ''}`} 
            type="button"
            onClick={() => handleBuyNow()}
            disabled={isBuyingNow}
            style={isGallery ? { width: '100%', minHeight: '44px' } : {}}
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
      </div>
    );
  };

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
              className={`main-image ${activeImage === product.gallery?.[2] ? 'has-bundle-widget' : ''}`}
              key={activeImage}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="image-glow" />
              {activeImage === product.gallery?.[2] ? (
                renderBundleWidget(true)
              ) : (
                <>
                  <img
                    src={activeImage || product.image}
                    alt={product.name}
                    loading="eager"
                    decoding="async"
                  />
                  {displayBadge && <span className={`product-status-badge ${displayBadgeClass}`}>{displayBadge}</span>}
                </>
              )}
            </motion.div>
          </div>
          
          {product.gallery && product.gallery.length > 1 && (
            <div className="thumbnail-strip">
              {product.gallery.map((img, idx) => (
                <div 
                  key={idx} 
                  className={`thumb-item ${activeImage === img ? 'active' : ''}`}
                  onClick={() => handleThumbnailClick(img)}
                  style={{ position: 'relative' }}
                >
                  <img src={img} alt="thumbnail" loading="lazy" decoding="async" />
                  {idx === 2 && (
                    <span className="thumb-bundle-overlay">BUNDLE</span>
                  )}
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
              <div className="banner-green">
                <ShieldCheck size={14} className="banner-icon-secure" strokeWidth={2.5} />
                <span>100% Secure Payments — UPI, NetBanking & Cards!</span>
              </div>
              <div className="banner-text">
                <Sparkles size={14} className="banner-icon-sparkles" strokeWidth={2.5} />
                <span>SUMMER SALE — BEST PRICE GUARANTEED!</span>
              </div>
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

            {activeImage !== product.gallery?.[2] && renderBundleWidget(false)}


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

      <div className="write-review-toggle-wrap">
        <button
          onClick={toggleReviewForm}
          type="button"
          className={`write-review-toggle-btn ${isReviewFormOpen ? "is-open" : ""}`}
          aria-expanded={isReviewFormOpen}
          aria-controls="customer-review-form"
        >
          <Star size={16} />
          <span>{isReviewFormOpen ? "Close Form" : "Write a Review"}</span>
        </button>
      </div>

      <AnimatePresence>
        {isReviewFormOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0, marginBottom: 0 }}
            animate={{ height: 'auto', opacity: 1, marginBottom: 40 }}
            exit={{ height: 0, opacity: 0, marginBottom: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="review-form-shell"
          >
            <form
              id="customer-review-form"
              onSubmit={handleSubmitReview}
              className="review-form-card"
            >
              <div className="review-form-title-wrap">
                <h3 className="review-form-title">Share Your Experience</h3>
                <p className="review-form-subtitle">Your feedback helps other shoppers choose better.</p>
              </div>

              {/* Star Selection */}
              <div className="review-rating-wrap">
                <span className="review-form-label">
                  Your Rating
                </span>
                <div className="review-star-picker" role="radiogroup" aria-label="Choose your rating">
                  {[1, 2, 3, 4, 5].map((starIdx) => {
                    const isFilled = starIdx <= activeReviewRating;
                    return (
                      <button
                        key={starIdx}
                        type="button"
                        role="radio"
                        aria-checked={formRating === starIdx}
                        aria-label={`${starIdx} star${starIdx === 1 ? "" : "s"}`}
                        className={`interactive-form-star ${isFilled ? "is-filled" : ""}`}
                        onMouseEnter={() => setFormHoverRating(starIdx)}
                        onMouseLeave={() => setFormHoverRating(0)}
                        onFocus={() => setFormHoverRating(starIdx)}
                        onBlur={() => setFormHoverRating(0)}
                        onClick={() => {
                          setFormRating(starIdx);
                          setReviewSubmitError("");
                          setReviewSubmitSuccess(false);
                        }}
                      >
                        <Star
                          size={28}
                          fill={isFilled ? "currentColor" : "none"}
                          strokeWidth={1.8}
                        />
                      </button>
                    );
                  })}
                </div>
                <p className="review-rating-copy">{activeReviewRating}/5 - {reviewRatingLabel}</p>
              </div>

              {/* Name Input */}
              <div className="review-form-field">
                <label htmlFor="review-form-name" className="review-form-label">
                  Your Name
                </label>
                <input
                  id="review-form-name"
                  type="text"
                  placeholder="Enter your name (e.g. Rahul S.)"
                  value={formName}
                  onChange={handleReviewNameChange}
                  maxLength={REVIEW_NAME_MAX_LENGTH}
                  required
                  className="review-form-input"
                />
                <p className="review-field-meta">{formName.length}/{REVIEW_NAME_MAX_LENGTH}</p>
              </div>

              {/* Textarea */}
              <div className="review-form-field">
                <label htmlFor="review-form-text" className="review-form-label">
                  Review Comments
                </label>
                <textarea
                  id="review-form-text"
                  placeholder="What did you like about this product? Tell us your experience..."
                  value={formText}
                  onChange={handleReviewTextChange}
                  required
                  rows={5}
                  maxLength={REVIEW_TEXT_MAX_LENGTH}
                  className="review-form-input"
                />
                <p className={`review-field-meta ${isReviewTextTooShort ? "is-warning" : ""}`}>
                  {isReviewTextTooShort
                    ? `Please add at least ${REVIEW_TEXT_MIN_LENGTH} characters.`
                    : `${reviewTextRemaining} characters remaining.`}
                </p>
              </div>

              {/* Submission Notice */}
              {reviewSubmitSuccess && (
                <div className="review-form-alert is-success" role="status">
                  Review submitted successfully. Thank you for sharing your feedback.
                </div>
              )}
              {reviewSubmitError && (
                <div className="review-form-alert is-error" role="alert">
                  {reviewSubmitError}
                </div>
              )}

              {/* Buttons */}
              <div className="review-form-actions">
                <button
                  type="submit"
                  disabled={isSubmittingReview || reviewSubmitSuccess || !isReviewFormValid}
                  className="review-submit-btn"
                >
                  {isSubmittingReview ? 'Submitting...' : 'Submit Review'}
                </button>
                <button
                  type="button"
                  onClick={closeReviewForm}
                  className="review-cancel-btn"
                >
                  Cancel
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {!reviewsLoading && productReviews.length === 0 ? (
        <div className="no-reviews-box">
          <div className="no-reviews-icon" aria-hidden="true">+</div>
          <h3 className="no-reviews-title">Be the First to Review</h3>
          <p className="no-reviews-copy">
            No reviews yet for this product. Share your experience with other shoppers by leaving a detailed rating and review.
          </p>
          <button
            onClick={openReviewForm}
            className="no-reviews-cta"
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
            onClick={closeBundlePopup}
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
                onClick={closeBundlePopup}
                aria-label="Close customization popup"
              >
                <X size={18} />
              </button>

              <div className="bundle-popup-header">
                <h2>Customize Your Bundle</h2>
                <p>Select your preferred color combination below</p>
                <div className="bundle-popup-meta">
                  <span>{popupBundle?.title || `Pack of ${popupBundleSize}`}</span>
                  <span>{popupUnitCount} total {popupUnitCount === 1 ? "item" : "items"}</span>
                </div>
              </div>

              <div className="bundle-popup-grid">
                <div className="bundle-popup-slots">
                  {Array.from({ length: popupBundleSize }).map((_, index) => {
                    const chosenColorName = popupColors[index] || "";
                    const chosenColorObj = productColors.find(c => c.name === chosenColorName) || productColors.find(c => c.available !== false) || productColors[0];
                    const slotImg = chosenColorObj?.image || product.image;

                    return (
                      <div key={index} className="bundle-slot-card">
                        <span className="slot-title">Item #{index + 1} Color</span>
                        <div className="slot-body">
                          <div className="slot-preview">
                            <img src={slotImg} alt={chosenColorName} />
                          </div>
                          <div className="slot-colors">
                            <p className="color-name-label">{chosenColorName || "Select Color"}</p>
                            <div className="color-options-row" role="radiogroup" aria-label={`Choose color for item ${index + 1}`}>
                              {productColors.map((color) => {
                                const isSelected = chosenColorName === color.name;
                                const isUnavailable = color.available === false;
                                return (
                                  <button
                                    key={color.name}
                                    className={`color-chip ${isSelected ? 'active' : ''} ${isUnavailable ? 'is-disabled' : ''}`}
                                    style={{ "--swatch-color": color.hex }}
                                    title={isUnavailable ? `${color.name} unavailable` : color.name}
                                    type="button"
                                    role="radio"
                                    aria-checked={isSelected}
                                    aria-label={`${color.name}${isUnavailable ? " unavailable" : ""}`}
                                    disabled={isUnavailable}
                                    onClick={() => updatePopupColor(index, color.name)}
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

              <div className="bundle-popup-summary">
                <div>
                  <span className="summary-label">Selected combination</span>
                  <strong>{popupSelectedSummary || "Choose colors"}</strong>
                </div>
                <span className="summary-count">{popupQuantity} bundle{popupQuantity > 1 ? "s" : ""}</span>
              </div>

              {bundlePopupNotice && (
                <div className="bundle-popup-alert success" role="status">
                  {bundlePopupNotice}
                </div>
              )}
              {bundlePopupError && (
                <div className="bundle-popup-alert error" role="alert">
                  {bundlePopupError}
                </div>
              )}

              <div className="bundle-popup-footer">
                <div className="footer-left">
                  <div className="bundle-quantity-control">
                    <span className="qty-label">Quantity:</span>
                    <div className="qty-selector">
                      <button 
                        type="button" 
                        onClick={() => {
                          setBundlePopupNotice("");
                          setBundlePopupError("");
                          setPopupQuantity(q => Math.max(1, q - 1));
                        }}
                        aria-label="Decrease bundle quantity"
                        disabled={popupQuantity <= 1}
                      >
                        <Minus size={14} strokeWidth={2.5} />
                      </button>
                      <span className="qty-count">{popupQuantity}</span>
                      <button 
                        type="button" 
                        onClick={() => {
                          setBundlePopupNotice("");
                          setBundlePopupError("");
                          setPopupQuantity(q => Math.min(9, q + 1));
                        }}
                        aria-label="Increase bundle quantity"
                        disabled={popupQuantity >= 9}
                      >
                        <Plus size={14} strokeWidth={2.5} />
                      </button>
                    </div>
                  </div>

                  <div className="bundle-popup-price">
                    <div className="popup-price-row">
                      <span className="current-price">Rs. {popupCurrentPrice}</span>
                      {popupOldPrice > popupCurrentPrice && (
                        <span className="old-price">Rs. {popupOldPrice}</span>
                      )}
                    </div>
                    {popupOldPrice > popupCurrentPrice && (
                      <span className="popup-save-label">Save Rs. {popupOldPrice - popupCurrentPrice}</span>
                    )}
                  </div>
                </div>

                <div className="bundle-popup-actions">
                  <button
                    className="bundle-popup-cart"
                    type="button"
                    onClick={() => handleCustomizedBundleAction("cart")}
                    disabled={!isBundlePopupValid || isBuyingNow || isAddingBundleToCart}
                  >
                    <ShoppingBag size={17} strokeWidth={2.2} />
                    <span>{isAddingBundleToCart ? "Adding..." : "Add to Cart"}</span>
                  </button>
                  <button 
                    className="bundle-popup-next"
                    type="button"
                    onClick={() => handleCustomizedBundleAction("checkout")}
                    disabled={!isBundlePopupValid || isBuyingNow || isAddingBundleToCart}
                  >
                    <span>{isBuyingNow ? "Redirecting..." : "Next"}</span>
                    {!isBuyingNow && <ArrowRight size={18} strokeWidth={2.2} />}
                  </button>
                </div>
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
