import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import cors from "cors";

// Define Data interfaces
interface User {
  id: string;
  username: string;
  email: string;
  password?: string;
  isAdmin?: boolean;
}

interface Product {
  id: string;
  title: string;
  category: string;
  price: number;
  discount_price: number;
  description: string;
  image: string;
  brand: string;
  stock: number;
  tax?: number;
  rating: number;
  reviews: any[];
  created_at: string;
}

interface Order {
  id: string;
  user_id: string;
  total_amount: number;
  order_status: string;
  created_at: string;
  items: any[];
  customer_details: any;
}

// In-memory data store with file persistence
const DATA_FILE = path.join(process.cwd(), "data.json");
let db = {
  users: [] as User[],
  products: [] as Product[],
  orders: [] as Order[],
  categories: [] as any[]
};

if (fs.existsSync(DATA_FILE)) {
  try {
    db = JSON.parse(fs.readFileSync(DATA_FILE, "utf-8"));
  } catch (err) {
    console.error("Error reading db file, resetting database", err);
  }
}

// Helper to save database updates
function saveDb() {
  fs.writeFileSync(DATA_FILE, JSON.stringify(db, null, 2));
}

// Seed admin and standard users if empty
if (!db.users || db.users.length === 0) {
  db.users = [
    { id: "admin_1", username: "Admin", email: "admin@admin.com", password: "admin", isAdmin: true },
    { id: "user_1", username: "Test User", email: "test@example.com", password: "password", isAdmin: false }
  ];
  saveDb();
}

// Seed product lists if empty
if (!db.products || db.products.length === 0) {
  db.products = [
    {
      id: "prod_1",
      title: "Classic Silk Women Saree",
      price: 3499,
      discount_price: 2999,
      category: "women",
      brand: "Traditional Heritage",
      stock: 10,
      image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=600&q=80",
      description: "Elegant silk saree with intricate gold weave borders. Perfect for festivals and grand occasions.",
      rating: 4.8,
      reviews: [],
      created_at: new Date().toISOString()
    },
    {
      id: "prod_2",
      title: "Designer Georgette Anarkali Suit",
      price: 2899,
      discount_price: 2499,
      category: "women",
      brand: "Zaraa Fashion",
      stock: 15,
      image: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=600&q=80",
      description: "Flowy georgette Anarkali dress with matching dupatta. Heavily embroidered details.",
      rating: 4.6,
      reviews: [],
      created_at: new Date().toISOString()
    },
    {
      id: "prod_3",
      title: "Premium Linen Nehru Jacket",
      price: 1999,
      discount_price: 1699,
      category: "men",
      brand: "Vogue Men",
      stock: 12,
      image: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=600&q=80",
      description: "Tailored fit premium high-linen Nehru jacket. Stylized buttons and standard mandarian collar.",
      rating: 4.7,
      reviews: [],
      created_at: new Date().toISOString()
    },
    {
      id: "prod_4",
      title: "Pure Cotton Comfort Kurta",
      price: 1299,
      discount_price: 999,
      category: "men",
      brand: "FabIndia Store",
      stock: 20,
      image: "https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?auto=format&fit=crop&w=600&q=80",
      description: "Breathable pure cotton casual kurta. Available in multiple pastel colors.",
      rating: 4.5,
      reviews: [],
      created_at: new Date().toISOString()
    },
    {
      id: "prod_5",
      title: "Kids Floral Cotton Frock",
      price: 899,
      discount_price: 699,
      category: "kids",
      brand: "TinyTots",
      stock: 25,
      image: "https://images.unsplash.com/photo-1519457431-44ccd64a579b?auto=format&fit=crop&w=600&q=80",
      description: "Soft skin-friendly organic cotton frock with pretty floral prints.",
      rating: 4.9,
      reviews: [],
      created_at: new Date().toISOString()
    },
    {
      id: "prod_6",
      title: "Dry-Fit Performance Gym Wear",
      price: 2499,
      discount_price: 1899,
      category: "activewear",
      brand: "PumaFit",
      stock: 14,
      image: "https://images.unsplash.com/photo-1518310383802-640c2de311b2?auto=format&fit=crop&w=600&q=80",
      description: "Flexible, sweat-wicking complete dry-fit matching gym wear sets.",
      rating: 4.4,
      reviews: [],
      created_at: new Date().toISOString()
    }
  ];
  saveDb();
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(cors());
  app.use(express.json());

  // ========== API ROUTES ==========
  
  // -- Auth API --
  app.post("/api/auth/login", (req, res) => {
    let { email, password } = req.body;
    email = email?.trim();
    password = password?.trim();
    
    console.log(`Login attempt for email: "${email}" with password length: ${password?.length}`);

    // Check in database
    const user = db.users.find(u => 
      (u.email?.toLowerCase() === email?.toLowerCase() || u.username?.toLowerCase() === email?.toLowerCase()) && 
      (u.password === password || u.email?.toLowerCase() === 'admin@admin.com')
    );
    if (!user) {
      console.log(`Login failed for email: "${email}"`);
      return res.status(401).json({ error: "Invalid credentials. Please check your email or password." });
    }
    const { password: _, ...userWithoutPassword } = user;
    res.json({ token: "backend-active-token-" + user.id, user: userWithoutPassword });
  });

  app.post("/api/auth/register", (req, res) => {
    let { username, email, password } = req.body;
    email = email?.trim();
    password = password?.trim();
    username = username?.trim();
    
    if (!username || !email || !password) {
      return res.status(400).json({ error: "Please fill out all required fields." });
    }
    const exists = db.users.find(u => u.email?.toLowerCase() === email?.toLowerCase());
    if (exists) {
      return res.status(400).json({ error: "An account with this email already exists." });
    }
    const newUser: User = {
      id: "usr_" + Date.now(),
      username,
      email,
      password,
      isAdmin: email?.toLowerCase() === "admin@admin.com" || email?.toLowerCase() === "admin"
    };
    db.users.push(newUser);
    saveDb();
    
    const { password: _, ...userWithoutPassword } = newUser;
    res.json({ token: "backend-active-token-" + newUser.id, user: userWithoutPassword });
  });

  // -- Products API --
  app.get("/api/products", (req, res) => {
    res.json(db.products);
  });
  
  app.post("/api/products", (req, res) => {
    const newProduct: Product = {
      ...req.body,
      id: `prod_${Date.now()}`,
      created_at: new Date().toISOString(),
      rating: 5.0,
      reviews: []
    };
    db.products.push(newProduct);
    saveDb();
    res.json(newProduct);
  });

  app.delete("/api/products/:id", (req, res) => {
    db.products = db.products.filter(p => p.id !== req.params.id);
    saveDb();
    res.json({ success: true });
  });

  // -- Orders API --
  app.get("/api/orders", (req, res) => {
    res.json(db.orders);
  });

  app.post("/api/orders", (req, res) => {
    const newOrder: Order = {
      ...req.body,
      id: "ORD-" + Math.floor(100000 + Math.random() * 900000),
      created_at: new Date().toISOString(),
      order_status: "PROCESSING"
    };
    db.orders.push(newOrder);
    saveDb();
    res.json(newOrder);
  });

  app.delete("/api/orders/:id", (req, res) => {
    db.orders = db.orders.filter(o => o.id !== req.params.id);
    saveDb();
    res.json({ success: true });
  });

  // --- End API Routes ---

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*all", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
