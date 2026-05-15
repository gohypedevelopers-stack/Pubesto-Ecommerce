"use client";

import { createContext, useContext, useState, useEffect } from "react";
import {
  getShopifyProducts,
  createShopifyCart,
  addToShopifyCart,
  getShopifyCartPermalink,
  getShopifyVariantIdByHandle,
} from "../lib/shopify";

const StoreContext = createContext();

function normalizeProductText(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/-imported$/, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function hasHighlights(product) {
  return Array.isArray(product?.highlights) && product.highlights.filter(Boolean).length > 0;
}

function findLocalProductFallback(shopifyProduct, localProducts) {
  const shopifySlug = normalizeProductText(shopifyProduct.slug);
  const shopifyName = normalizeProductText(shopifyProduct.name);

  return localProducts.find((localProduct) => (
    normalizeProductText(localProduct.slug) === shopifySlug ||
    normalizeProductText(localProduct.name) === shopifyName
  ));
}

function mergeShopifyProductWithLocalFallback(shopifyProduct, localProducts) {
  const localProduct = findLocalProductFallback(shopifyProduct, localProducts);
  if (!localProduct) return shopifyProduct;

  return {
    ...localProduct,
    ...shopifyProduct,
    highlights: hasHighlights(shopifyProduct) ? shopifyProduct.highlights : localProduct.highlights,
    specifications: shopifyProduct.specifications || localProduct.specifications,
    rating: shopifyProduct.rating || localProduct.rating,
    reviews: shopifyProduct.reviews || localProduct.reviews,
    badge: shopifyProduct.badge || localProduct.badge,
    badgeClass: shopifyProduct.badgeClass || localProduct.badgeClass,
    detail: shopifyProduct.detail || localProduct.detail,
  };
}

export function StoreProvider({ children, categories: initialCategories = [], products: initialProducts = [] }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [cartPulseKey, setCartPulseKey] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [profileNotice, setProfileNotice] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [showAllProducts, setShowAllProducts] = useState(false);
  const [shopifyCart, setShopifyCart] = useState(null);
  const [products, setProducts] = useState(initialProducts);
  const [categories, setCategories] = useState(initialCategories);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [wishlist, setWishlist] = useState([]);

  useEffect(() => {
    async function syncShopify() {
      if (process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN && process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN !== 'your_token') {
        const shopifyProducts = await getShopifyProducts();
        if (shopifyProducts && shopifyProducts.length > 0) {
          // Merge logic: Combine Shopify products with local initialProducts, avoiding duplicates by slug
          setProducts((prevLocal) => {
            const merged = shopifyProducts.map((shopifyProduct) =>
              mergeShopifyProductWithLocalFallback(shopifyProduct, prevLocal)
            );
            prevLocal.forEach(localProd => {
              if (!merged.find(sp => sp.slug === localProd.slug)) {
                merged.push(localProd);
              }
            });
            return merged;
          });
        }
      }
    }
    syncShopify();
    
    // Auth Persistence
    const savedUser = localStorage.getItem("pubesto_user");
    if (savedUser) {
      try {
        const parsed = JSON.parse(savedUser);
        setUser(parsed);
        setIsLoggedIn(true);
      } catch (e) {
        console.error("Error parsing saved user", e);
      }
    }

    // Wishlist Persistence
    const savedWishlist = localStorage.getItem("pubesto_wishlist");
    if (savedWishlist) {
      try {
        setWishlist(JSON.parse(savedWishlist));
      } catch (e) {
        console.error("Error parsing wishlist", e);
      }
    }

    const savedShopifyCart = localStorage.getItem("shopify_cart");
    if (savedShopifyCart) {
      try {
        setShopifyCart(JSON.parse(savedShopifyCart));
      } catch (e) {
        console.error("Error parsing Shopify cart", e);
      }
    }
  }, []);
  const [footerPanel, setFooterPanel] = useState(null);

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

  function closeUtilityPanels() {
    setIsCartOpen(false);
    setIsProfileOpen(false);
  }

  function getNextCartItems(items, product, quantity) {
    const productId = getProductId(product);
    const existingItem = items.find((item) => item.id === productId);

    if (existingItem) {
      return items.map((item) =>
        item.id === productId ? { ...item, quantity: item.quantity + quantity } : item
      );
    }

    return [...items, { id: productId, product, quantity }];
  }

  function openShopifyCart(items = cartItems) {
    setIsCartOpen(true);
  }

  async function resolveShopifyCartProduct(product) {
    if (product.shopifyVariantId || product.variantId || product.sku?.includes("gid://shopify/")) {
      return product;
    }

    const handle = product.shopifyHandle || product.slug;
    if (!handle) return product;

    try {
      const shopifyVariantId = await getShopifyVariantIdByHandle(handle);
      return shopifyVariantId ? { ...product, shopifyVariantId } : product;
    } catch (error) {
      console.error("Shopify variant lookup failed:", error);
      return product;
    }
  }

  function login(email) {
    const newUser = { email, name: "Artisanal Member", joinDate: new Date().toISOString() };
    setUser(newUser);
    setIsLoggedIn(true);
    localStorage.setItem("pubesto_user", JSON.stringify(newUser));
    setProfileNotice("Successfully signed in!");
  }

  function logout() {
    setUser(null);
    setIsLoggedIn(false);
    localStorage.removeItem("pubesto_user");
    setProfileNotice("Logged out successfully.");
  }

  function addToWishlist(product) {
    setWishlist((prev) => {
      if (prev.find((p) => p.slug === product.slug)) return prev;
      const next = [...prev, product];
      localStorage.setItem("pubesto_wishlist", JSON.stringify(next));
      return next;
    });
  }

  function removeFromWishlist(productSlug) {
    setWishlist((prev) => {
      const next = prev.filter((p) => p.slug !== productSlug);
      localStorage.setItem("pubesto_wishlist", JSON.stringify(next));
      return next;
    });
  }

  async function addToCart(product, options = {}) {
    const shouldOpenCart = options.openCart !== false;

    const addQuantity = options.quantity || 1;
    const cartProduct = await resolveShopifyCartProduct(product);
    const nextCartItems = getNextCartItems(cartItems, cartProduct, addQuantity);

    setCartItems(nextCartItems);
    setCartPulseKey((key) => key + 1);
    setIsProfileOpen(false);
    setIsCartOpen(false);
    
    // Shopify Sync
    const shopifyVariantId = cartProduct.shopifyVariantId || cartProduct.variantId || cartProduct.sku;
    if (process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN && shopifyVariantId?.includes('gid://shopify/')) {
      handleShopifyAddToCart({ ...cartProduct, sku: shopifyVariantId }, addQuantity);
    }

    if (shouldOpenCart) {
      openShopifyCart(nextCartItems);
    }
  }

  async function handleShopifyAddToCart(product, quantity = 1) {
    try {
      let currentCart = shopifyCart;
      if (!currentCart) {
        currentCart = await createShopifyCart();
        setShopifyCart(currentCart);
        localStorage.setItem("shopify_cart", JSON.stringify(currentCart));
      }
      const updatedCart = await addToShopifyCart(currentCart.id, product.sku, quantity);
      setShopifyCart(updatedCart);
      localStorage.setItem("shopify_cart", JSON.stringify(updatedCart));
    } catch (error) {
      console.error("Shopify Add to Cart Error:", error);
    }
  }

  const loadRazorpay = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  async function checkout(options = {}) {
    const activeItems = options.items || cartItems;
    const activeAmount = options.amount || cartTotal;

    if (activeItems.length === 0) return;

    // If there's a Shopify cart with a checkout URL, use it
    if (shopifyCart?.checkoutUrl) {
      window.location.href = shopifyCart.checkoutUrl;
      return;
    }

    // Otherwise, use Razorpay
    const res = await loadRazorpay();
    if (!res) {
      alert("Razorpay SDK failed to load. Are you online?");
      return;
    }

    try {
      const response = await fetch("/api/razorpay/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: activeAmount }),
      });

      const order = await response.json();
      if (order.error) throw new Error(order.error);

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_test_RwcLAPO7q0AESo",
        amount: order.amount,
        currency: order.currency,
        name: "Pubesto",
        description: "Artisanal Ecommerce",
        order_id: order.id,
        handler: function (response) {
          alert(`Payment Successful! ID: ${response.razorpay_payment_id}`);
          setCartItems([]);
          localStorage.removeItem("shopify_cart");
          setIsCartOpen(false);
          setProfileNotice("Thank you for your order! Payment successful.");
          setIsProfileOpen(true);
        },
        prefill: {
          name: "Customer",
          email: "customer@example.com",
          contact: "9999999999",
        },
        theme: { color: "#1b624b" },
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();
    } catch (error) {
      console.error("Checkout Error:", error);
      alert("Checkout failed. Please try again.");
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

  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);
  const cartTotal = cartItems.reduce((total, item) => total + getProductPrice(item.product) * item.quantity, 0);
  const shopifyCartUrl = getShopifyCartPermalink(cartItems);

  const value = {
    isMenuOpen, setIsMenuOpen,
    isCartOpen, setIsCartOpen,
    isProfileOpen, setIsProfileOpen,
    isSearchOpen, setIsSearchOpen,
    cartItems, setCartItems,
    cartPulseKey, setCartPulseKey,
    searchQuery, setSearchQuery,
    profileNotice, setProfileNotice,
    selectedCategory, setSelectedCategory,
    showAllProducts, setShowAllProducts,
    footerPanel, setFooterPanel,
    cartCount, cartTotal,
    shopifyCartUrl, openShopifyCart,
    getProductId, getProductPrice,
    closeUtilityPanels, addToCart, updateCartQuantity, removeFromCart, checkout,
    categories, products,
    footerPanel, setFooterPanel,
    isLoggedIn, setIsLoggedIn,
    user, setUser,
    wishlist, setWishlist,
    login, logout, addToWishlist, removeFromWishlist
  };

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error("useStore must be used within a StoreProvider");
  }
  return context;
}
