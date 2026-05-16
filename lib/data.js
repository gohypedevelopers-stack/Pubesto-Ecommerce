import { MapPinned, PackageCheck, Clock8, ShieldCheck, Feather } from "lucide-react";

export const categories = [
  {
    name: "Home Decor",
    image: "/images/products/portable-ac.jpg",
  },
  {
    name: "Bottles",
    image: "/images/products/temp-bottle.jpg",
  },
  {
    name: "Fans",
    image: "/images/products/neck-fan.png",
  },
  {
    name: "Lunch Box",
    image: "/images/products/lunch-box.jpg",
  },
  {
    name: "Storage",
    image: "/images/products/speaker-tumbler.jpg",
  },
  {
    name: "Sale",
    image: "/images/products/arctic-air-ultra.png",
  },
];

export const products = [
  {
    name: "Arctic Air Ultra Cooler",
    slug: "arctic-air-ultra-cooler-imported",
    price: "Rs. 320",
    oldPrice: "Rs. 495",
    salePrice: 320,
    originalPrice: 495,
    sku: "JA-CC1164",
    badge: "35% Off",
    badgeClass: "badge-discount",
    detail: "Fast & Efficient Cooling",
    description: "Enjoy cool, clean, moist air anywhere! Features an easy-fill water tank, 3 fan speeds, 90° wide-angle air vent, and ultra-quiet technology.",
    categories: ["Fans"],
    rating: "4.8",
    reviews: "45",
    inStock: true,
    image: "/images/products/arctic-air-ultra.png",
    moq: 2,
    highlights: ["Fast & Efficient Cooling", "Eco-Friendly Design", "Compact & Portable", "Ultra-Quiet Operation"],
    reviewsList: [
      { text: "Cools down my study corner in minutes. Very quiet and effective!", name: "Anish Kumar" },
      { text: "Perfect for the current heatwave. The water tank lasts a long time.", name: "Suman Devi" },
      { text: "Compact enough to keep on my desk. Definitely worth the price.", name: "Rajiv Shah" },
      { text: "Simple to use and the air feels very fresh. Highly recommend.", name: "Meera J." }
    ]
  },
  {
    name: "B-65 Notebook Bottle",
    slug: "b-65-do-your-best-notebook-bottle-imported",
    price: "Rs. 130",
    oldPrice: "Rs. 180",
    salePrice: 130,
    originalPrice: 180,
    sku: "JA-CC2671",
    badge: "28% Off",
    badgeClass: "badge-discount",
    detail: "Imported | Slim Notebook Shape",
    description: "Ultra-slim notebook shaped water bottle with 'Do Your Best!!!' print. Fits perfectly in bags like a book. Leak-proof and stylish.",
    categories: ["Bottles", "Daily Carry"],
    rating: "4.8",
    reviews: "34",
    inStock: true,
    image: "/images/products/notebook-bottle.png",
    moq: 3,
    highlights: ["Ultra-Slim Notebook Shape", "Leak-Proof & Stylish", "Fits Perfectly in Bags", "Food-Grade Material"],
    reviewsList: [
      { text: "Fits in my laptop bag like a book! Never seen anything like it.", name: "Kavya Reddy" },
      { text: "Love the matte finish and the slim profile. No leaks at all.", name: "Vivek Gulati" },
      { text: "Perfect for college. Easy to carry around and looks very stylish.", name: "Sunita Patil" },
      { text: "Great quality plastic. Doesn't have any smell. Very happy.", name: "Srinivas Murthy" }
    ]
  },
  {
    name: "Printed Temperature Bottle",
    slug: "printed-temperature-bottle-imported",
    price: "Rs. 675",
    oldPrice: "Rs. 844",
    salePrice: 675,
    originalPrice: 844,
    sku: "JA-CC3078",
    badge: "20% Off",
    badgeClass: "badge-discount",
    detail: "Smart Drinkware | Temperature Display",
    description: "Printed temperature bottle with LED display. Smart thermos cup that shows the real-time temperature of your drink.",
    categories: ["Bottles"],
    rating: "4.8",
    reviews: "14",
    inStock: true,
    image: "/images/products/temp-bottle.jpg",
    highlights: ["Real-time LED Temp Display", "Double Wall Vacuum Insulation", "12h Hot / 24h Cold", "Premium Matte Finish"],
    reviewsList: [
      { text: "The temperature display is very accurate. Helps avoid burning my tongue!", name: "Pooja V." },
      { text: "Keeps my coffee hot for nearly 10 hours. The design is sleek.", name: "Arjun M." },
      { text: "Solid build quality. The battery for the display seems to last long.", name: "Nisha R." },
      { text: "Every time I use it at work, people ask about the LED screen. Cool tech!", name: "Karan S." }
    ]
  },
  {
    name: "Adjustable Bladeless Neck Fan",
    slug: "adjustable-bladeless-neck-fan-imported",
    price: "Rs. 800",
    oldPrice: "Rs. 1000",
    salePrice: 800,
    originalPrice: 1000,
    sku: "JA-CC2709",
    badge: "Best Seller",
    badgeClass: "badge-hot",
    detail: "Personal Cooling | Hands-Free",
    description: "The ultimate hands-free cooling solution. This bladeless neck fan features 360° airflow, ultra-quiet operation, and a lightweight ergonomic design. Perfect for commuting, workouts, and outdoor activities.",
    categories: ["Fans", "Daily Carry"],
    rating: "4.9",
    reviews: "156",
    inStock: true,
    image: "/images/products/neck-fan.png",
    gallery: [
      "/images/products/neck-fan.png",
      "/images/hero/neck-fan-multi.png",
      "/images/neck-fan-hero.jpg"
    ],
    highlights: [
      "360° Surround Airflow for instant cooling",
      "Bladeless Design - Safe for long hair",
      "3 Speed Settings: Low, Medium, High",
      "USB Rechargeable: Up to 8 hours battery life",
      "Ergonomic & Lightweight: Only 250g"
    ],
    specifications: {
      "Material": "Skin-friendly ABS + Silicone",
      "Battery": "4000mAh Lithium Ion",
      "Charging": "Type-C (Fast Charging)",
      "Runtime": "4-16 Hours depending on speed",
      "Noise Level": "< 25dB (Ultra Quiet)"
    },
    colors: [
      { name: "Forest Green", hex: "#2D4B3F", image: "/images/hero/neck-fan-multi.png" },
      { name: "Blush Pink", hex: "#E8C2C2", image: "/images/hero/neck-fan-multi.png" },
      { name: "Arctic White", hex: "#F5F5F5", image: "/images/hero/neck-fan-multi.png" }
    ],
    reviewsList: [
      { text: "Saved me during the daily metro commute. Hands-free and powerful.", name: "Rahul S." },
      { text: "Safe for long hair as promised. No blades, just cool air.", name: "Ananya B." },
      { text: "Three speed modes are great. Battery lasts almost the whole day.", name: "Vikram P." },
      { text: "Ergonomic design, doesn't feel heavy on the neck at all.", name: "Sneha G." }
    ]
  },
  {
    name: "Mini Portable Wall Mounted AC",
    slug: "mini-portable-wall-mounted-ac-imported",
    price: "Rs. 3475",
    oldPrice: "Rs. 4344",
    salePrice: 3475,
    originalPrice: 4344,
    sku: "JA-CC3220",
    badge: "20% Off",
    badgeClass: "badge-discount",
    detail: "Home Cooling | Heating & Cooling",
    description: "Compact wall-mounted AC unit for personal cooling and heating. Imported quality with remote control.",
    categories: ["Fans", "Home Decor"],
    rating: "4.7",
    reviews: "8",
    inStock: true,
    image: "/images/products/portable-ac.jpg",
    gallery: [
      "/images/products/portable-ac.jpg",
      "/images/products/portable-ac-feature-1.jpg",
      "/images/products/portable-ac-feature-2.jpg"
    ],
    highlights: [
      "Dual Function: Cooling & Heating",
      "Remote Control for easy operation",
      "Compact Wall-Mounted Design",
      "Energy Efficient Technology",
      "Quiet Operation (< 35dB)"
    ],
    specifications: {
      "Power": "2000W",
      "Voltage": "220V",
      "Coverage": "Up to 150 sq. ft.",
      "Modes": "Cool / Heat / Fan",
      "Timer": "Up to 12 Hours"
    },
    reviewsList: [
      { text: "Heats up my small bedroom very quickly. Remote is super handy.", name: "Gaurav T." },
      { text: "Compact and easy to mount. The fan mode is also very powerful.", name: "Ishita M." },
      { text: "Best purchase for my home office. Quiet and efficient cooling.", name: "Amit K." },
      { text: "The display and remote work perfectly. Very premium feel.", name: "Deepak R." }
    ]
  },
  {
    name: "Mist Double Headed LED Fan",
    slug: "mist-double-headed-led-fan-imported",
    price: "Rs. 2250",
    oldPrice: "Rs. 2813",
    salePrice: 2250,
    originalPrice: 2813,
    sku: "JA-CC3221",
    badge: "20% Off",
    badgeClass: "badge-discount",
    detail: "Personal Cooling | Mist Fan",
    description: "Mist double headed LED fan with remote or battery operation. Circulates fresh air with 120 degree rotary mist.",
    categories: ["Fans"],
    rating: "4.8",
    reviews: "12",
    inStock: true,
    image: "/images/products/mist-fan.jpg",
    highlights: ["120° Rotary Mist Spray", "Built-in LED Lighting", "Remote & Battery Operated", "Dual Head Circulation"],
    reviewsList: [
      { text: "The mist feature is so refreshing. Dual heads cover a wide area.", name: "Priya L." },
      { text: "Love the LED light at night. Great for my bedside table.", name: "Siddharth B." },
      { text: "Mist is fine and doesn't make things wet. Very relaxing.", name: "Tanya C." },
      { text: "Battery life is decent. The rotary function is a big plus.", name: "Mohit J." }
    ]
  },
  {
    name: "Hamburger Kids Lunch Box",
    slug: "hamburger-kids-lunch-box",
    price: "Rs. 285",
    oldPrice: "Rs. 356",
    salePrice: 285,
    originalPrice: 356,
    sku: "JA-CC2622",
    badge: "20% Off",
    badgeClass: "badge-discount",
    detail: "Lunch Box | Kids Essentials",
    description: "Fun hamburger shaped lunch box with multi-compartments and secure clip locks. Food grade material.",
    categories: ["Lunch Box", "Storage"],
    rating: "4.9",
    reviews: "25",
    inStock: true,
    image: "/images/products/lunch-box.jpg",
    highlights: ["Fun Hamburger Shaped Design", "Multiple Food Compartments", "Secure Clip-Lock System", "BPA-Free Food Grade"],
    gallery: [
      "/images/products/lunch-box-feature-3.jpg",
      "/images/products/lunch-box.jpg",
      "/images/products/lunch-box-feature-1.jpg",
      "/images/products/lunch-box-feature-2.jpg"
    ],
    reviewsList: [
      { text: "My kid loves the hamburger shape! He finishes all his food now.", name: "Swati P." },
      { text: "Sturdy locks and good partitions. Fits well in the school bag.", name: "Abhishek G." },
      { text: "BPA free and easy to clean. Very satisfied with the quality.", name: "Kiran W." },
      { text: "Fun design and practical. The size is perfect for a full meal.", name: "Neeta V." }
    ]
  },
  {
    name: "B-111 1200ml Bluetooth Speaker Tumbler",
    slug: "b-111-1200ml-bluetooth-speaker-tumbler-imported",
    price: "Rs. 3950",
    oldPrice: "Rs. 4938",
    salePrice: 3950,
    originalPrice: 4938,
    sku: "JA-CC2683",
    badge: "20% Off",
    badgeClass: "badge-discount",
    detail: "Drinkware | Bluetooth Speaker",
    description: "Stainless steel tumbler with built-in Bluetooth speaker. Keeps drinks hot or cold with 1200ml capacity.",
    categories: ["Bottles", "Storage"],
    rating: "4.8",
    reviews: "30",
    inStock: true,
    image: "/images/products/speaker-tumbler.jpg",
    material: "Premium Stainless Steel",
    capacity: "1200ml / Extra Large",
    gallery: [
      "/images/products/speaker-tumbler.jpg",
      "/images/products/speaker-tumbler-2.jpg"
    ],
    highlights: [
      "Detachable Bluetooth Speaker base",
      "IPX6 Water Resistant Speaker",
      "Double-walled Vacuum Insulation",
      "12 Hours Hot / 24 Hours Cold",
      "Large 1200ml Capacity"
    ],
    specifications: {
      "Material": "18/8 Stainless Steel",
      "Bluetooth": "Version 5.0",
      "Battery": "1000mAh (6 Hours Playtime)",
      "Charging": "Micro-USB",
      "Lid Type": "Leak-proof Slider"
    },
    reviewsList: [
      { text: "Surprised by the speaker quality! Great for outdoor picnics.", name: "Rohan D." },
      { text: "Keeps my drinks icy cold all day. The speaker is a nice bonus.", name: "Aditi F." },
      { text: "Detachable base is clever. Easy to wash the bottle.", name: "Prateek H." },
      { text: "Good volume and clear sound. Perfect for beach trips.", name: "Jaya K." }
    ]
  },
  {
    name: "Hammered Copper Bottle",
    slug: "hammered-copper-bottle",
    price: "Rs. 4495",
    oldPrice: "Rs. 5619",
    salePrice: 4495,
    originalPrice: 5619,
    badge: "New",
    detail: "Insulated daily carry",
    categories: ["Bottles", "Daily Carry"],
    rating: "4.8",
    reviews: "1,248",
    image: "/images/products/copper-bottle.png",
    highlights: ["Authentic Hammered Texture", "100% Pure Copper Material", "Ayurvedic Health Benefits", "Leak-Proof Brass Cap"]
  },
  {
    name: "Mini 300ML Stainless Steel Bottle",
    slug: "mini-stainless-steel-bottle-imported",
    price: "Rs. 1060",
    oldPrice: "Rs. 1325",
    salePrice: 1060,
    originalPrice: 1325,
    sku: "JA-CC2762",
    badge: "20% Off",
    badgeClass: "badge-discount",
    detail: "304 Stainless Steel | 7 Color Stock",
    description: "Compact and durable 300ML stainless steel thermos bottle. 304 food-grade material with vacuum insulation to keep drinks hot or cold.",
    categories: ["Bottles", "Daily Carry"],
    rating: "4.9",
    reviews: "15",
    inStock: true,
    image: "/images/products/mini-steel-bottle.jpg",
    material: "304 Food-Grade Stainless Steel",
    capacity: "300ml / Compact",
    gallery: [
      "/images/products/mini-steel-bottle.jpg",
      "/images/products/mini-steel-bottle-2.jpg",
      "/images/products/mini-steel-bottle-3.jpg"
    ],
    highlights: [
      "Ultra-compact pocket friendly size",
      "304 Food-Grade Stainless Steel",
      "Leak-proof screw cap with seal",
      "Matte Finish - Scratch Resistant",
      "Keeps drinks at temp for 6+ hours"
    ],
    specifications: {
      "Height": "15cm",
      "Diameter": "6cm",
      "Weight": "180g",
      "Insulation": "Double Wall Vacuum",
      "Finish": "Powder Coated"
    },
    reviewsList: [
      { text: "Perfect size for my handbag. The matte colors are beautiful.", name: "Shikha B." },
      { text: "Truly leak-proof and keeps water cold. Very high quality steel.", name: "Manish P." },
      { text: "Bought this for my daughter. She loves the compact size.", name: "Renu L." },
      { text: "Small but mighty. Keeps temperature for a long time.", name: "Varun T." }
    ]
  },
];

export const heroSlides = [
  {
    eyebrow: "Summer Essentials",
    title: "Super cool Portable air conditioner",
    copy: "",
    cta: "Shop Now",
    image: "/images/hero/neck-fan-multi.png",
    link: "/product/adjustable-bladeless-neck-fan-imported",
    price: "Rs. 800",
    oldPrice: "Rs. 1000",
  },
  {
    eyebrow: "Daily Essential",
    title: "Mini 300ML Stainless Steel Bottle",
    copy: "",
    cta: "Shop Now",
    image: "/images/hero/thermos-bottle.png",
    link: "/product/mini-stainless-steel-bottle-imported",
    price: "Rs. 450",
    oldPrice: "Rs. 600",
  },
];

export const peopleChoiceVideos = [
  {
    title: "Adjustable Bladeless Neck Fan",
    price: "Rs. 800",
    oldPrice: "Rs. 1000",
    image: "/images/products/neck-fan.png",
    video: "https://v1.pinimg.com/videos/iht/720p/b8/02/81/b802816d72a4ea574e0941e4895c6538.mp4",
    thumb: "/images/products/neck-fan.png",
    slug: "adjustable-bladeless-neck-fan-imported",
  },
  {
    title: "Mist Double Headed LED Fan",
    price: "Rs. 2450",
    oldPrice: "Rs. 3060",
    image: "/images/products/desktop-mist-fan.png",
    video: "https://v1.pinimg.com/videos/iht/expMp4/bf/ac/87/bfac87b9b08135f0e35ad6dc2d01b7b9_720w.mp4",
    thumb: "/images/products/desktop-mist-fan.png",
    slug: "mist-double-headed-led-fan-imported",
  },
  {
    title: "Mini Portable Wall Mounted AC",
    price: "Rs. 3475",
    oldPrice: "Rs. 4344",
    image: "/images/products/portable-ac.jpg",
    video: "/videos/mini-portable-wall-mounted-ac.mp4",
    thumb: "/images/products/portable-ac.jpg",
    slug: "mini-portable-wall-mounted-ac-imported",
  },
  {
    title: "Arctic Air Ultra Cooler",
    price: "Rs. 1450",
    oldPrice: "Rs. 1800",
    image: "/images/products/mini-ac-cooler.png",
    video: "https://v1.pinimg.com/videos/mc/720p/35/9f/4d/359f4d2e515e47cbd79cf332b3fd54b6.mp4",
    thumb: "/images/products/mini-ac-cooler.png",
    slug: "arctic-air-ultra-cooler-imported",
  },
];

export const pubestoTrustFeatures = [
  { label: "Quality-checked products", mark: "QC" },
  { label: "Made for Indian homes", Icon: MapPinned },
  { label: "Secure packaging", Icon: PackageCheck },
  { label: "Fast dispatch on most orders", Icon: Clock8 },
  { label: "Easy returns and support", Icon: ShieldCheck },
  { label: "Useful daily essentials", Icon: Feather },
  { label: "Value pricing on trusted picks", mark: "Rs" },
];

export const socialGalleryItems = [
  {
    title: "Carry it clean",
    caption: "Bottles for desk, school, and daily errands.",
    image: "/images/products/temp-bottle.jpg",
  },
  {
    title: "Pack the day",
    caption: "Lunch storage that keeps workdays simple.",
    image: "/images/products/lunch-box.jpg",
  },
  {
    title: "Cool corners",
    caption: "Compact fans and comfort picks for home.",
    image: "/images/products/mist-fan.jpg",
  },
  {
    title: "Everyday edits",
    caption: "Useful finds styled for Indian homes.",
    image: "/images/products/portable-ac.jpg",
  },
];

export const fragranceProducts = [
  {
    name: "Silken Ember",
    price: "",
    numericPrice: 210,
    detail: "Eau de Parfum",
    notes: ["Sandalwood", "White Pepper", "Iris"],
    family: "Woody",
    image: "https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=800&q=85",
  },
  {
    name: "Veridant Vault",
    price: "",
    numericPrice: 185,
    detail: "Eau de Parfum",
    notes: ["Vetiver", "Oakmoss", "Bergamot"],
    family: "Citrus",
    image: "https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=800&q=85",
  },
  {
    name: "Oud Architecture",
    price: "",
    numericPrice: 320,
    detail: "Eau de Parfum",
    notes: ["Agarwood", "Saffron", "Rose"],
    family: "Spicy",
    image: "https://images.unsplash.com/photo-1585232351009-aa87416fca90?auto=format&fit=crop&w=800&q=85",
  },
  {
    name: "Concrete Petal",
    price: "",
    numericPrice: 195,
    detail: "Eau de Parfum",
    notes: ["Jasmine", "Patchouli", "Musk"],
    family: "Floral",
    image: "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=800&q=85",
  },
];

export const customerReviews = [
  {
    name: "Kavya Reddy",
    initials: "KR",
    text: "Absolutely love the quality! It fits perfectly in my bag and doesn't leak at all. Highly recommend.",
    rating: 5,
    verified: true
  },
  {
    name: "Vivek Gulati",
    initials: "VG",
    text: "Perfect for daily use. The design is so unique and I get compliments every time I use it.",
    rating: 5,
    verified: true
  },
  {
    name: "Sunita Patil",
    initials: "SP",
    text: "The finish is premium and durable. Even after months of use, it still looks brand new.",
    rating: 5,
    verified: true
  },
  {
    name: "Srinivas Murthy",
    initials: "SM",
    text: "Exceeded my expectations! Shipping was fast and the packaging was very secure.",
    rating: 5,
    verified: true
  }
];
