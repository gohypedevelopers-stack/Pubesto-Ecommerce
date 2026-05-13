"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { getShopifyProducts, createShopifyCart, addToShopifyCart } from "../lib/shopify";

const StoreContext = createContext();

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

  useEffect(() => {
    async function syncShopify() {
      if (process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN && process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN !== 'your_token') {
        const shopifyProducts = await getShopifyProducts();
        if (shopifyProducts && shopifyProducts.length > 0) {
          // Merge logic: Combine Shopify products with local initialProducts, avoiding duplicates by slug
          setProducts((prevLocal) => {
            const merged = [...shopifyProducts];
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

    const savedCart = localStorage.getItem("shopify_cart");
    if (savedCart) {
      try {
        setShopifyCart(JSON.parse(savedCart));
      } catch (e) {
        console.error("Error parsing saved cart", e);
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

  function addToCart(product, options = {}) {
    const productId = getProductId(product);
    const shouldOpenCart = options.openCart !== false;

    const addQuantity = options.quantity || 1;

    setCartItems((items) => {
      const existingItem = items.find((item) => item.id === productId);
      if (existingItem) {
        return items.map((item) =>
          item.id === productId ? { ...item, quantity: item.quantity + addQuantity } : item
        );
      }
      return [...items, { id: productId, product, quantity: addQuantity }];
    });
    setCartPulseKey((key) => key + 1);
    setIsProfileOpen(false);
    
    // Shopify Sync
    if (process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN && product.sku?.includes('gid://shopify/')) {
      handleShopifyAddToCart(product);
    }

    if (shouldOpenCart) {
      setIsCartOpen(true);
    }
  }

  async function handleShopifyAddToCart(product) {
    try {
      let currentCart = shopifyCart;
      if (!currentCart) {
        currentCart = await createShopifyCart();
        setShopifyCart(currentCart);
        localStorage.setItem("shopify_cart", JSON.stringify(currentCart));
      }
      const updatedCart = await addToShopifyCart(currentCart.id, product.sku);
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

  async function checkout() {
    if (cartItems.length === 0) return;

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
        body: JSON.stringify({ amount: cartTotal }),
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
    getProductId, getProductPrice,
    closeUtilityPanels, addToCart, updateCartQuantity, removeFromCart, checkout,
    categories, products,
    footerPanel, setFooterPanel
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
