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
        if (shopifyProducts.length > 0) {
          setProducts(shopifyProducts);
          // Optionally extract categories from shopifyProducts if they are different from local ones
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

  function checkout() {
    if (shopifyCart?.checkoutUrl) {
      window.location.href = shopifyCart.checkoutUrl;
    } else {
      // Fallback or generic checkout notice
      setIsCartOpen(false);
      setProfileNotice("Checkout is currently being processed through Shopify.");
      setIsProfileOpen(true);
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
    categories, products
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
