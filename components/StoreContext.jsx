"use client";

import { createContext, useContext, useState, useEffect, useRef } from "react";
import {
  createShopifyCart,
  addToShopifyCart,
  getShopifyCartPermalink,
  getShopifyVariantIdByHandle,
  getShopifyVariantIdForColor,
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
  if (!shopifyProduct) return null;
  const localProduct = findLocalProductFallback(shopifyProduct, localProducts || []);
  if (!localProduct) return shopifyProduct;

  return {
    ...localProduct,
    ...shopifyProduct,
    inStock: localProduct.inStock === true ? true : shopifyProduct.inStock,
    highlights: hasHighlights(shopifyProduct) ? shopifyProduct.highlights : localProduct.highlights,
    specifications: shopifyProduct.specifications || localProduct.specifications,
    rating: shopifyProduct.rating || localProduct.rating,
    reviews: shopifyProduct.reviews || localProduct.reviews,
    badge: shopifyProduct.badge || localProduct.badge,
    badgeClass: shopifyProduct.badgeClass || localProduct.badgeClass,
    detail: shopifyProduct.detail || localProduct.detail,
    bundleProducts: shopifyProduct.bundleProducts || localProduct.bundleProducts || [],
    categories: Array.from(new Set([
      ...(localProduct.categories || []),
      ...(shopifyProduct.categories || [])
    ]))
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
  const shopifyCartQueueRef = useRef(Promise.resolve());

  useEffect(() => {
    async function syncShopify() {
      try {
        const [prodRes, colRes] = await Promise.all([
          fetch("/api/products"),
          fetch("/api/collections")
        ]);

        if (prodRes.ok) {
          const shopifyProducts = await prodRes.json();
          if (shopifyProducts && shopifyProducts.length > 0) {
            // Only show products that exist in Shopify, enriched with local fallback data.
            setProducts(() => {
              const localProducts = initialProducts || [];
              const merged = shopifyProducts
                .map((shopifyProduct) => mergeShopifyProductWithLocalFallback(shopifyProduct, localProducts))
                .filter(Boolean);

              return merged;
            });
          }
        }

        if (colRes.ok) {
          const shopifyCollections = await colRes.json();
          if (shopifyCollections && shopifyCollections.length > 0) {
            setCategories(shopifyCollections);
          }
        }
      } catch (error) {
        console.error("Error syncing with Shopify API proxy:", error);
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
    const baseId = product.sku || product.slug || product.name;
    if (product.selectedColors && product.selectedColors.length > 0) {
      const sorted = [...product.selectedColors].sort();
      return `${baseId}::${sorted.join(",")}`;
    }
    return product.selectedColor ? `${baseId}::${product.selectedColor}` : baseId;
  }

  function getProductPrice(product) {
    if (typeof product.salePrice === "number") {
      return product.salePrice;
    }
    const rawPrice = String(product.price || "0").replace(/[^\d.]/g, "");
    return Number(rawPrice) || 0;
  }

  function getProductBasePrice(product) {
    const original = products.find(p => p.slug === product.slug || p.sku === product.sku);
    const target = original || product;
    if (typeof target.salePrice === "number") {
      return target.salePrice;
    }
    const rawPrice = String(target.price || "0").replace(/[^\d.]/g, "");
    return Number(rawPrice) || 0;
  }

  function getProductBaseOldPrice(product) {
    const original = products.find(p => p.slug === product.slug || p.sku === product.sku);
    const target = original || product;
    if (typeof target.originalPrice === "number") {
      return target.originalPrice;
    }
    const rawPrice = String(target.oldPrice || "0").replace(/[^\d.]/g, "");
    return Number(rawPrice) || 0;
  }

  function getCartItemTotalPrice(product, quantity) {
    const basePrice = getProductBasePrice(product);
    
    if (product.selectedColors && product.selectedColors.length > 0) {
      const bundleSize = product.selectedColors.length;
      if (bundleSize === 2) {
        const pack2UnitPrice = Math.round(Math.floor(basePrice * 2 * 0.90) / 2);
        return pack2UnitPrice * 2 * quantity;
      } else if (bundleSize === 4) {
        const pack4UnitPrice = Math.round(Math.floor(basePrice * 4 * 0.80) / 4);
        return pack4UnitPrice * 4 * quantity;
      } else {
        return basePrice * quantity;
      }
    }

    const pack2UnitPrice = Math.round(Math.floor(basePrice * 2 * 0.90) / 2);
    const pack4UnitPrice = Math.round(Math.floor(basePrice * 4 * 0.80) / 4);
    
    const pack4Price = pack4UnitPrice * 4;
    const pack2Price = pack2UnitPrice * 2;
    const singlePrice = basePrice;
    
    const num4 = Math.floor(quantity / 4);
    const remainder = quantity % 4;
    const num2 = Math.floor(remainder / 2);
    const num1 = remainder % 2;
    
    return (num4 * pack4Price) + (num2 * pack2Price) + (num1 * singlePrice);
  }

  function getCartItemTotalOldPrice(product, quantity) {
    const baseOldPrice = getProductBaseOldPrice(product) || Math.round(getProductBasePrice(product) * 1.35);
    if (product.selectedColors && product.selectedColors.length > 0) {
      return baseOldPrice * product.selectedColors.length * quantity;
    }
    return baseOldPrice * quantity;
  }

  function getCartItemDisplayName(product, quantity) {
    const original = products.find(p => p.slug === product.slug || p.sku === product.sku);
    const baseName = original ? original.name : product.name.replace(/\s*\([^)]+\)/g, "").trim();
    
    if (product.selectedColors && product.selectedColors.length > 0) {
      const displayBaseName = `${baseName} - ${product.selectedColors.join(" & ")}`;
      if (quantity === 1) return `${displayBaseName} (Pack of ${product.selectedColors.length})`;
      return `${displayBaseName} (Pack of ${product.selectedColors.length}) x ${quantity}`;
    }
    
    const displayBaseName = product.selectedColor ? `${baseName} - ${product.selectedColor}` : baseName;
    
    if (quantity === 1) return displayBaseName;
    if (quantity === 2) return `${displayBaseName} (Pack of 2)`;
    if (quantity === 4) return `${displayBaseName} (Pack of 4)`;
    
    const num4 = Math.floor(quantity / 4);
    const remainder = quantity % 4;
    const num2 = Math.floor(remainder / 2);
    const num1 = remainder % 2;
    
    const parts = [];
    if (num4 > 0) parts.push(`Pack of 4${num4 > 1 ? ` x ${num4}` : ""}`);
    if (num2 > 0) parts.push("Pack of 2");
    if (num1 > 0) parts.push("Single");
    
    return `${displayBaseName} (${parts.join(" + ")})`;
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
    const selectedColor = options.color || product.selectedColor || "";
    const selectedColors = options.selectedColors || product.selectedColors || null;
    const resolvedProduct = await resolveShopifyCartProduct(product);
    let cartProduct = selectedColor
      ? { ...resolvedProduct, selectedColor }
      : resolvedProduct;
      
    if (selectedColors && selectedColors.length > 0) {
      cartProduct = { ...cartProduct, selectedColors };
    }
    
    const nextCartItems = getNextCartItems(cartItems, cartProduct, addQuantity);

    setCartItems(nextCartItems);
    setCartPulseKey((key) => key + 1);
    setIsProfileOpen(false);
    setIsCartOpen(false);
    
    // Shopify Sync
    if (!selectedColors || selectedColors.length === 0) {
      const shopifyVariantId = cartProduct.shopifyVariantId || cartProduct.variantId || cartProduct.sku;
      if (process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN && shopifyVariantId?.includes('gid://shopify/')) {
        handleShopifyAddToCart({ ...cartProduct, sku: shopifyVariantId }, addQuantity);
      }
    }

    if (shouldOpenCart) {
      openShopifyCart(nextCartItems);
    }
  }

  async function handleShopifyAddToCart(product, quantity = 1) {
    // Queue ensures Shopify cart mutations run sequentially, preventing CONFLICT errors
    shopifyCartQueueRef.current = shopifyCartQueueRef.current.then(async () => {
      try {
        let currentCart = shopifyCart;
        if (!currentCart) {
          currentCart = await createShopifyCart();
          setShopifyCart(currentCart);
          localStorage.setItem("shopify_cart", JSON.stringify(currentCart));
        }
        try {
          const updatedCart = await addToShopifyCart(currentCart.id, product.sku, quantity);
          setShopifyCart(updatedCart);
          localStorage.setItem("shopify_cart", JSON.stringify(updatedCart));
        } catch (conflictError) {
          // On CONFLICT, create a fresh cart and retry once
          if (String(conflictError).includes('CONFLICT') || String(conflictError).includes('conflicted')) {
            console.warn("Shopify cart conflict, creating fresh cart and retrying...");
            const freshCart = await createShopifyCart();
            const retryCart = await addToShopifyCart(freshCart.id, product.sku, quantity);
            setShopifyCart(retryCart);
            localStorage.setItem("shopify_cart", JSON.stringify(retryCart));
          } else {
            throw conflictError;
          }
        }
      } catch (error) {
        console.error("Shopify Add to Cart Error:", error);
      }
    });
    return shopifyCartQueueRef.current;
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

    // Try dynamic Shopify checkout creation first
    try {
      const payloadItems = [];
      let totalQty = 0;
      let hasBundles = false;

      for (const item of activeItems) {
        const qty = Math.max(1, Number(item.quantity) || 1);
        const colors = item.product?.selectedColors || [];
        
        if (colors.length > 0) {
          hasBundles = true;
          const bundleTotal = getCartItemTotalPrice(item.product, qty);
          const bundleUnitCount = colors.length * qty;
          const unitPrice = bundleUnitCount > 0 ? (bundleTotal / bundleUnitCount) : 0;

          for (const color of colors) {
            const variantId = getShopifyVariantIdForColor(item.product.slug, color) || 
                              item.product.shopifyVariantId || item.product.variantId || item.product.sku;
            
            const existing = payloadItems.find(e => e.variantId === variantId);
            if (existing) {
              existing.quantity += qty;
            } else {
              payloadItems.push({
                variantId,
                quantity: qty,
                name: `${item.product.name} - ${color}`,
                discountedUnitPrice: unitPrice
              });
            }
            totalQty += qty;
          }
        } else {
          const variantId = item.product?.shopifyVariantId || item.product?.variantId || item.product?.sku || item.variantId;
          const existing = payloadItems.find(e => e.variantId === variantId);
          if (existing) {
            existing.quantity += qty;
          } else {
            payloadItems.push({
              variantId,
              quantity: qty,
              name: getCartItemDisplayName(item.product, qty),
              discountedUnitPrice: qty > 0 ? getCartItemTotalPrice(item.product, qty) / qty : 0
            });
          }
          totalQty += qty;
        }
      }

      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: payloadItems }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.checkoutUrl) {
          let finalUrl = data.checkoutUrl;
          if (hasBundles) {
            const separator = finalUrl.includes("?") ? "&" : "?";
            if (totalQty === 2) {
              finalUrl = `${finalUrl}${separator}discount=PACKOF2`;
            } else if (totalQty === 4) {
              finalUrl = `${finalUrl}${separator}discount=PACKOF4`;
            }
          }
          window.location.href = finalUrl;
          return;
        }
      }
    } catch (error) {
      console.error("Dynamic Shopify checkout failed:", error);
    }

    // Fallback 1: Build a Shopify cart permalink from variant IDs
    const permalinkUrl = getShopifyCartPermalink(activeItems);
    const hasVariants = activeItems.some(item => {
      const variantId = item.product?.shopifyVariantId || item.product?.variantId || item.product?.sku || item.variantId;
      return variantId && String(variantId).includes('gid://shopify/');
    });

    if (hasVariants && permalinkUrl) {
      window.location.href = permalinkUrl;
      return;
    }

    // Fallback 2: Fallback to Razorpay for local-only items
    const res = await loadRazorpay();
    if (!res) {
      alert("Razorpay SDK failed to load. Are you online?");
      return;
    }

    try {
      const finalAmount = activeAmount + (activeAmount >= 999 ? 0 : 99);
      const response = await fetch("/api/razorpay/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: finalAmount }),
      });

      const order = await response.json();
      if (order.error) throw new Error(order.error);

      const rzpOptions = {
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

      const paymentObject = new window.Razorpay(rzpOptions);
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
  const cartTotal = cartItems.reduce((total, item) => total + getCartItemTotalPrice(item.product, item.quantity), 0);
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
    getCartItemTotalPrice, getCartItemTotalOldPrice, getCartItemDisplayName,
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
