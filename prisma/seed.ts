import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const categories = [
  "Electronics",
  "Fashion",
  "Home & Kitchen",
  "Books",
  "Sports",
  "Beauty",
  "Toys",
  "Grocery",
];

const products = [
  {
    title: "Samsung Galaxy S24 Ultra 5G",
    description:
      "The Samsung Galaxy S24 Ultra features a 6.8-inch Dynamic AMOLED display, 200MP camera system, and the powerful Snapdragon 8 Gen 3 processor. Built-in S Pen, 5000mAh battery with 45W fast charging.",
    price: 134999,
    discount: 10,
    category: "Electronics",
    stock: 50,
    images: [
      "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=600&q=80",
      "https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=600&q=80",
    ],
    rating: 4.7,
    ratingCount: 2345,
    brand: "Samsung",
    featured: true,
    trending: true,
    tags: ["smartphone", "5g", "android", "samsung"],
  },
  {
    title: "Apple iPhone 15 Pro Max 256GB",
    description:
      "iPhone 15 Pro Max features the A17 Pro chip, titanium design, 48MP main camera with 5x optical zoom, and USB-C connectivity. Available in Natural Titanium, Blue Titanium, White Titanium, and Black Titanium.",
    price: 159900,
    discount: 5,
    category: "Electronics",
    stock: 35,
    images: [
      "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=600&q=80",
      "https://images.unsplash.com/photo-1632661674596-df8be070a5c5?w=600&q=80",
    ],
    rating: 4.9,
    ratingCount: 5678,
    brand: "Apple",
    featured: true,
    trending: true,
    tags: ["iphone", "apple", "5g", "ios"],
  },
  {
    title: 'Sony 55" OLED 4K Smart TV',
    description:
      "Experience stunning picture quality with Sony's OLED 4K TV. Features XR Cognitive Processor, Acoustic Surface Audio+, Google TV, and HDMI 2.1 ports for next-gen gaming.",
    price: 149990,
    discount: 15,
    category: "Electronics",
    stock: 20,
    images: [
      "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=600&q=80",
      "https://images.unsplash.com/photo-1567690187548-f07b1d7bf5a9?w=600&q=80",
    ],
    rating: 4.6,
    ratingCount: 892,
    brand: "Sony",
    featured: true,
    trending: false,
    tags: ["tv", "4k", "oled", "smart-tv"],
  },
  {
    title: "Apple MacBook Air M2 13-inch",
    description:
      "Supercharged by the next-generation M2 chip, MacBook Air is strikingly thin and incredibly capable. With up to 18 hours battery life, 8-core CPU, 10-core GPU, and a stunning Liquid Retina display.",
    price: 114900,
    discount: 8,
    category: "Electronics",
    stock: 45,
    images: [
      "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=600&q=80",
      "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=600&q=80",
    ],
    rating: 4.8,
    ratingCount: 3421,
    brand: "Apple",
    featured: true,
    trending: true,
    tags: ["laptop", "macbook", "apple", "m2"],
  },
  {
    title: "Sony WH-1000XM5 Wireless Headphones",
    description:
      "Industry-leading noise canceling with two processors and eight microphones. Crystal clear hands-free calling and Alexa voice control. Up to 30-hour battery with quick charge.",
    price: 29990,
    discount: 20,
    category: "Electronics",
    stock: 80,
    images: [
      "https://images.unsplash.com/photo-1545127398-14699f92334b?w=600&q=80",
      "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=600&q=80",
    ],
    rating: 4.7,
    ratingCount: 7823,
    brand: "Sony",
    featured: false,
    trending: true,
    tags: ["headphones", "wireless", "noise-canceling"],
  },
  {
    title: "Nike Air Max 270 Running Shoes",
    description:
      "The Nike Air Max 270 delivers unrivaled comfort with its extra-large Air unit that provides maximum cushioning. Breathable mesh upper with dynamic foam midsole.",
    price: 12995,
    discount: 25,
    category: "Fashion",
    stock: 120,
    images: [
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80",
      "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=600&q=80",
    ],
    rating: 4.5,
    ratingCount: 4521,
    brand: "Nike",
    featured: false,
    trending: true,
    tags: ["shoes", "running", "nike", "sportswear"],
  },
  {
    title: "Levi's 511 Slim Fit Jeans",
    description:
      "The Levi's 511 Slim Fit jeans are designed for a modern look. Made with stretch denim for all-day comfort. Available in multiple washes and sizes.",
    price: 3499,
    discount: 30,
    category: "Fashion",
    stock: 200,
    images: [
      "https://images.unsplash.com/photo-1542272604-787c3835535d?w=600&q=80",
      "https://images.unsplash.com/photo-1555689502-c4b22d76c56f?w=600&q=80",
    ],
    rating: 4.3,
    ratingCount: 2341,
    brand: "Levi's",
    featured: false,
    trending: false,
    tags: ["jeans", "fashion", "levi's", "denim"],
  },
  {
    title: "Ray-Ban Aviator Sunglasses",
    description:
      "Classic Ray-Ban Aviator sunglasses with polarized lenses. UV400 protection, metal frame, spring-loaded hinges. Iconic style that never goes out of fashion.",
    price: 8990,
    discount: 15,
    category: "Fashion",
    stock: 75,
    images: [
      "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=600&q=80",
      "https://images.unsplash.com/photo-1508296695146-257a814070b4?w=600&q=80",
    ],
    rating: 4.6,
    ratingCount: 1823,
    brand: "Ray-Ban",
    featured: false,
    trending: false,
    tags: ["sunglasses", "fashion", "ray-ban", "accessories"],
  },
  {
    title: "Instant Pot Duo 7-in-1 Electric Pressure Cooker",
    description:
      "The Instant Pot Duo is a 7-in-1 multi-use programmable cooker: Pressure Cooker, Slow Cooker, Rice Cooker, Steamer, Sauté, Yogurt Maker and Warmer. 6 quart capacity.",
    price: 8999,
    discount: 20,
    category: "Home & Kitchen",
    stock: 60,
    images: [
      "https://images.unsplash.com/photo-1585515320310-259814833e62?w=600&q=80",
      "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&q=80",
    ],
    rating: 4.7,
    ratingCount: 6234,
    brand: "Instant Pot",
    featured: false,
    trending: true,
    tags: ["kitchen", "pressure-cooker", "appliance"],
  },
  {
    title: "Dyson V15 Detect Vacuum Cleaner",
    description:
      "The Dyson V15 Detect reveals microscopic dust with a precisely-angled laser. 230 AW suction. LCD screen shows battery life and filter maintenance. Up to 60 minutes run time.",
    price: 64900,
    discount: 10,
    category: "Home & Kitchen",
    stock: 25,
    images: [
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80",
      "https://images.unsplash.com/photo-1527515637462-cff94ece14f6?w=600&q=80",
    ],
    rating: 4.8,
    ratingCount: 1234,
    brand: "Dyson",
    featured: true,
    trending: false,
    tags: ["vacuum", "dyson", "home-appliance"],
  },
  {
    title: "IKEA KALLAX Shelving Unit",
    description:
      "A simple shelving unit that becomes the perfect storage solution when you add drawers and doors. Can be used as a room divider. Durable pressed wood construction.",
    price: 7999,
    discount: 0,
    category: "Home & Kitchen",
    stock: 100,
    images: [
      "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&q=80",
      "https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=600&q=80",
    ],
    rating: 4.4,
    ratingCount: 3456,
    brand: "IKEA",
    featured: false,
    trending: false,
    tags: ["furniture", "storage", "shelf", "home"],
  },
  {
    title: "Atomic Habits by James Clear",
    description:
      "An Easy & Proven Way to Build Good Habits & Break Bad Ones. In Atomic Habits, world-renowned habits expert James Clear reveals a simple set of rules for creating good habits, breaking bad ones, and mastering the tiny behaviors that lead to remarkable results.",
    price: 499,
    discount: 35,
    category: "Books",
    stock: 500,
    images: [
      "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=600&q=80",
      "https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=600&q=80",
    ],
    rating: 4.9,
    ratingCount: 15678,
    brand: "Random House",
    featured: false,
    trending: true,
    tags: ["book", "self-help", "habits", "productivity"],
  },
  {
    title: "The Psychology of Money",
    description:
      "Timeless lessons on wealth, greed, and happiness doing well with money isn't necessarily about what you know. It's about how you behave. And behavior is hard to teach, even to really smart people.",
    price: 399,
    discount: 40,
    category: "Books",
    stock: 350,
    images: [
      "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=600&q=80",
      "https://images.unsplash.com/photo-1532012197267-da84d127e765?w=600&q=80",
    ],
    rating: 4.8,
    ratingCount: 9823,
    brand: "Harriman House",
    featured: false,
    trending: false,
    tags: ["book", "finance", "money", "psychology"],
  },
  {
    title: "Yoga Mat Premium Non-Slip",
    description:
      "Premium eco-friendly yoga mat with superior grip and cushioning. 6mm thickness for joint support. Moisture-resistant surface, alignment lines, and carrying strap included.",
    price: 1999,
    discount: 25,
    category: "Sports",
    stock: 150,
    images: [
      "https://images.unsplash.com/photo-1601925228591-9e1d11c88cf5?w=600&q=80",
      "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=600&q=80",
    ],
    rating: 4.5,
    ratingCount: 2341,
    brand: "Manduka",
    featured: false,
    trending: false,
    tags: ["yoga", "fitness", "mat", "sports"],
  },
  {
    title: "Adjustable Dumbbell Set 5-52.5 lbs",
    description:
      "Replaces 15 sets of weights with a single compact design. Fast and easy weight adjustment in 2.5-5 lb increments. Durable and safe molding process ensures consistent quality.",
    price: 24999,
    discount: 15,
    category: "Sports",
    stock: 40,
    images: [
      "https://images.unsplash.com/photo-1517963879433-6ad2b056d712?w=600&q=80",
      "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&q=80",
    ],
    rating: 4.7,
    ratingCount: 3456,
    brand: "Bowflex",
    featured: false,
    trending: true,
    tags: ["dumbbell", "fitness", "gym", "weights"],
  },
  {
    title: "L'Oréal Paris Revitalift Anti-Aging Face Serum",
    description:
      "Pro-Retinol + Hyaluronic Acid + Vitamin C serum. Visibly reduces wrinkles and firms skin. Boosts skin radiance and luminosity. Dermatologist tested. Suitable for all skin types.",
    price: 1299,
    discount: 20,
    category: "Beauty",
    stock: 200,
    images: [
      "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=600&q=80",
      "https://images.unsplash.com/photo-1570194065650-d99fb4afd8c8?w=600&q=80",
    ],
    rating: 4.3,
    ratingCount: 4521,
    brand: "L'Oréal Paris",
    featured: false,
    trending: false,
    tags: ["skincare", "serum", "anti-aging", "beauty"],
  },
  {
    title: "Maybelline Fit Me Matte + Poreless Foundation",
    description:
      "Maybelline Fit Me Matte + Poreless Foundation gives natural-looking coverage and a shine-free finish. Oil-free formula with micro-powders to help control excess shine. Available in 40 shades.",
    price: 699,
    discount: 30,
    category: "Beauty",
    stock: 300,
    images: [
      "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=600&q=80",
      "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=600&q=80",
    ],
    rating: 4.4,
    ratingCount: 6789,
    brand: "Maybelline",
    featured: false,
    trending: false,
    tags: ["makeup", "foundation", "beauty", "cosmetics"],
  },
  {
    title: "LEGO Technic 4x4 X-treme Off-Roader",
    description:
      "Control this tough off-roader using the LEGO Technic Control+ app. Features 4-wheel drive, 4-wheel steering, front and rear suspension, V6 engine with moving pistons. 2,000+ pieces.",
    price: 14999,
    discount: 10,
    category: "Toys",
    stock: 30,
    images: [
      "https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=600&q=80",
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80",
    ],
    rating: 4.8,
    ratingCount: 1234,
    brand: "LEGO",
    featured: false,
    trending: false,
    tags: ["lego", "toy", "building", "kids"],
  },
  {
    title: "Barbie Dreamhouse Playset",
    description:
      "The Barbie Dreamhouse is a 3-story house with 8 rooms, a pool and slide, elevator, and more. 70+ accessories included. Lights and sounds bring the house to life.",
    price: 7999,
    discount: 20,
    category: "Toys",
    stock: 45,
    images: [
      "https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?w=600&q=80",
      "https://images.unsplash.com/photo-1580477667995-2b94f01c9516?w=600&q=80",
    ],
    rating: 4.5,
    ratingCount: 2341,
    brand: "Mattel",
    featured: false,
    trending: false,
    tags: ["barbie", "doll", "toy", "kids"],
  },
  {
    title: "Organic Green Tea 100 Tea Bags",
    description:
      "USDA Certified Organic green tea. Rich in antioxidants, helps boost metabolism and promotes relaxation. Sourced from the finest tea gardens. Each bag individually wrapped for freshness.",
    price: 599,
    discount: 10,
    category: "Grocery",
    stock: 500,
    images: [
      "https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=600&q=80",
      "https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9?w=600&q=80",
    ],
    rating: 4.6,
    ratingCount: 8923,
    brand: "Organic India",
    featured: false,
    trending: false,
    tags: ["tea", "organic", "health", "grocery"],
  },
  {
    title: "Basmati Rice Premium 5kg",
    description:
      "Extra Long Grain Aged Basmati Rice. Naturally aged for superior taste and aroma. Elongates more than twice on cooking. No artificial color, flavor, or preservatives.",
    price: 799,
    discount: 5,
    category: "Grocery",
    stock: 1000,
    images: [
      "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600&q=80",
      "https://images.unsplash.com/photo-1603833665858-e61d17a86224?w=600&q=80",
    ],
    rating: 4.5,
    ratingCount: 3456,
    brand: "India Gate",
    featured: false,
    trending: false,
    tags: ["rice", "grocery", "food", "staple"],
  },
  {
    title: "boAt Rockerz 450 Bluetooth Headphones",
    description:
      "Enjoy 15 hours of playtime with super bass. Foldable design for easy portability. 40mm dynamic drivers for powerful sound. Padded ear cushions for comfortable wear.",
    price: 2499,
    discount: 50,
    category: "Electronics",
    stock: 200,
    images: [
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&q=80",
      "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=600&q=80",
    ],
    rating: 4.2,
    ratingCount: 18234,
    brand: "boAt",
    featured: false,
    trending: true,
    tags: ["headphones", "bluetooth", "boat", "audio"],
  },
  {
    title: "Canon EOS R50 Mirrorless Camera",
    description:
      "24.2MP APS-C CMOS sensor with DIGIC X image processor. 4K 30p and Full HD 120p video recording. Subject Detection AF with Eye, Face, and Body Tracking. Dual Pixel CMOS AF II.",
    price: 74995,
    discount: 12,
    category: "Electronics",
    stock: 15,
    images: [
      "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=600&q=80",
      "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=600&q=80",
    ],
    rating: 4.7,
    ratingCount: 567,
    brand: "Canon",
    featured: true,
    trending: false,
    tags: ["camera", "mirrorless", "photography", "canon"],
  },
  {
    title: "Fitbit Charge 6 Fitness Tracker",
    description:
      "Built-in Google Maps, YouTube Music controls, and Google Wallet on your wrist. Heart rate tracking, sleep analysis, Stress Management Score. Up to 7 days battery. Water resistant.",
    price: 14999,
    discount: 18,
    category: "Electronics",
    stock: 90,
    images: [
      "https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=600&q=80",
      "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=600&q=80",
    ],
    rating: 4.4,
    ratingCount: 3456,
    brand: "Fitbit",
    featured: false,
    trending: true,
    tags: ["fitness", "tracker", "smartwatch", "health"],
  },
  {
    title: "Adidas Ultraboost 23 Running Shoes",
    description:
      "Experience incredible energy return with the adidas Ultraboost 23. Boost midsole returns energy with every step. Primeknit+ upper adapts to your foot's movement.",
    price: 17999,
    discount: 20,
    category: "Sports",
    stock: 85,
    images: [
      "https://images.unsplash.com/photo-1587563871167-1ee9c731aefb?w=600&q=80",
      "https://images.unsplash.com/photo-1556906781-9a412961a6ba?w=600&q=80",
    ],
    rating: 4.6,
    ratingCount: 4521,
    brand: "Adidas",
    featured: false,
    trending: true,
    tags: ["shoes", "running", "adidas", "sportswear"],
  },
  {
    title: "The Alchemist by Paulo Coelho",
    description:
      "Paulo Coelho's masterpiece tells the mystical story of Santiago, an Andalusian shepherd boy who yearns to travel in search of a worldly treasure. A story about listening to your heart and chasing dreams.",
    price: 299,
    discount: 20,
    category: "Books",
    stock: 600,
    images: [
      "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=600&q=80",
      "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=600&q=80",
    ],
    rating: 4.8,
    ratingCount: 22345,
    brand: "HarperCollins",
    featured: false,
    trending: false,
    tags: ["book", "fiction", "coelho", "classic"],
  },
  {
    title: "Nivea Men Face Wash 3-in-1",
    description:
      "3-in-1 face wash for men that cleanses, shaves, and cares for your skin. With cooling menthol and vitamin E. Gentle on skin, leaves face feeling refreshed and hydrated.",
    price: 349,
    discount: 15,
    category: "Beauty",
    stock: 500,
    images: [
      "https://images.unsplash.com/photo-1556228720-da8d9aac0cb5?w=600&q=80",
      "https://images.unsplash.com/photo-1571781565036-d3f759be73e4?w=600&q=80",
    ],
    rating: 4.3,
    ratingCount: 7823,
    brand: "Nivea",
    featured: false,
    trending: false,
    tags: ["skincare", "men", "face-wash", "grooming"],
  },
  {
    title: "PlayStation 5 DualSense Controller",
    description:
      "Experience a new era of gaming with the DualSense wireless controller. Haptic feedback, adaptive triggers, built-in microphone, and Create button for next-gen immersion.",
    price: 6490,
    discount: 5,
    category: "Electronics",
    stock: 60,
    images: [
      "https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=600&q=80",
      "https://images.unsplash.com/photo-1622297845775-5ff3fef71d13?w=600&q=80",
    ],
    rating: 4.8,
    ratingCount: 9234,
    brand: "Sony PlayStation",
    featured: true,
    trending: true,
    tags: ["gaming", "controller", "ps5", "playstation"],
  },
  {
    title: "Xiaomi Smart Band 8 Pro",
    description:
      "1.74-inch AMOLED display, GPS built-in, 14-day battery life. 150+ workout modes, blood oxygen monitoring, sleep tracking, heart rate monitoring. Water resistant up to 5ATM.",
    price: 4999,
    discount: 25,
    category: "Electronics",
    stock: 150,
    images: [
      "https://images.unsplash.com/photo-1434494878577-86c23bcb06b9?w=600&q=80",
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=80",
    ],
    rating: 4.3,
    ratingCount: 5432,
    brand: "Xiaomi",
    featured: false,
    trending: true,
    tags: ["smartband", "fitness", "xiaomi", "wearable"],
  },
];

const sampleReviews = [
  {
    rating: 5,
    comment:
      "Absolutely love this product! Exactly as described and shipped quickly.",
  },
  {
    rating: 4,
    comment:
      "Great quality for the price. Would recommend to friends and family.",
  },
  {
    rating: 5,
    comment: "Exceeded my expectations! The build quality is top-notch.",
  },
  {
    rating: 3,
    comment: "Decent product but took a while to arrive. Works as expected.",
  },
  {
    rating: 4,
    comment: "Good value for money. Happy with my purchase.",
  },
];

async function main() {
  console.log("🌱 Starting database seed...");

  // Clean up existing data
  await prisma.review.deleteMany();
  await prisma.cart.deleteMany();
  await prisma.wishlist.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.address.deleteMany();
  await prisma.user.deleteMany();
  await prisma.product.deleteMany();

  console.log("🧹 Cleaned existing data");

  // Create admin user
  const adminPassword = await bcrypt.hash("Admin@123456", 12);
  const admin = await prisma.user.create({
    data: {
      name: "Admin User",
      email: "admin@shopkart.com",
      passwordHash: adminPassword,
      phone: "9876543210",
      role: "ADMIN",
    },
  });
  console.log("👤 Created admin user:", admin.email);

  // Create regular users
  const userPassword = await bcrypt.hash("User@123456", 12);
  const user1 = await prisma.user.create({
    data: {
      name: "Rahul Sharma",
      email: "rahul@example.com",
      passwordHash: userPassword,
      phone: "9876543211",
      role: "USER",
      addresses: {
        create: {
          name: "Rahul Sharma",
          line1: "123, MG Road",
          line2: "Apartment 4B",
          city: "Bengaluru",
          state: "Karnataka",
          pincode: "560001",
          phone: "9876543211",
          isDefault: true,
        },
      },
    },
  });

  const user2 = await prisma.user.create({
    data: {
      name: "Priya Singh",
      email: "priya@example.com",
      passwordHash: userPassword,
      phone: "9876543212",
      role: "USER",
    },
  });

  const user3 = await prisma.user.create({
    data: {
      name: "Amit Kumar",
      email: "amit@example.com",
      passwordHash: userPassword,
      phone: "9876543213",
      role: "USER",
    },
  });

  console.log("👥 Created sample users");

  // Create products
  const createdProducts = [];
  for (const product of products) {
    const created = await prisma.product.create({ data: product });
    createdProducts.push(created);
  }
  console.log(`📦 Created ${createdProducts.length} products`);

  // Add reviews to the first 10 products
  const usersForReviews = [user1, user2, user3, admin];
  for (let i = 0; i < Math.min(15, createdProducts.length); i++) {
    const product = createdProducts[i];
    const reviewCount = Math.floor(Math.random() * 2) + 1;
    for (let j = 0; j < reviewCount; j++) {
      const user = usersForReviews[j % usersForReviews.length];
      try {
        await prisma.review.create({
          data: {
            userId: user.id,
            productId: product.id,
            rating: sampleReviews[j % sampleReviews.length].rating,
            comment: sampleReviews[j % sampleReviews.length].comment,
          },
        });
      } catch {
        // Skip duplicate reviews
      }
    }
  }
  console.log("⭐ Created sample reviews");

  // Create sample cart items for user1
  await prisma.cart.create({
    data: {
      userId: user1.id,
      productId: createdProducts[0].id,
      quantity: 1,
    },
  });
  await prisma.cart.create({
    data: {
      userId: user1.id,
      productId: createdProducts[4].id,
      quantity: 2,
    },
  });

  // Create sample wishlist items
  await prisma.wishlist.create({
    data: { userId: user1.id, productId: createdProducts[1].id },
  });
  await prisma.wishlist.create({
    data: { userId: user1.id, productId: createdProducts[3].id },
  });

  // Create sample orders
  await prisma.order.create({
    data: {
      userId: user1.id,
      totalAmount: 134999,
      status: "DELIVERED",
      paymentMethod: "CARD",
      shippingAddress: {
        name: "Rahul Sharma",
        line1: "123, MG Road",
        line2: "Apartment 4B",
        city: "Bengaluru",
        state: "Karnataka",
        pincode: "560001",
        phone: "9876543211",
      },
      items: {
        create: {
          productId: createdProducts[0].id,
          quantity: 1,
          price: createdProducts[0].price,
        },
      },
    },
  });

  await prisma.order.create({
    data: {
      userId: user1.id,
      totalAmount: 12995,
      status: "SHIPPED",
      paymentMethod: "COD",
      shippingAddress: {
        name: "Rahul Sharma",
        line1: "123, MG Road",
        line2: "Apartment 4B",
        city: "Bengaluru",
        state: "Karnataka",
        pincode: "560001",
        phone: "9876543211",
      },
      items: {
        create: {
          productId: createdProducts[5].id,
          quantity: 1,
          price: createdProducts[5].price,
        },
      },
    },
  });

  console.log("🛍️ Created sample orders");

  console.log("✅ Database seeded successfully!");
  console.log("\n📋 Test Credentials:");
  console.log("  Admin: admin@shopkart.com / Admin@123456");
  console.log("  User:  rahul@example.com / User@123456");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
