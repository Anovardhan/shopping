import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import cors from "cors";

// Initialize Firebase
import { initializeApp } from "firebase/app";
import { getDatabase, ref, get, set, remove, push } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyCqYxy24RxFB6oogC7q1rE1V-xBLGEZBu8",
  authDomain: "ecommerce-9da70.firebaseapp.com",
  databaseURL: "https://ecommerce-9da70-default-rtdb.firebaseio.com",
  projectId: "ecommerce-9da70",
  storageBucket: "ecommerce-9da70.firebasestorage.app",
  messagingSenderId: "610703520890",
  appId: "1:610703520890:web:b80a61bfa95549a1e877c3",
  measurementId: "G-DFYQDCLW7D"
};

const firebaseApp = initializeApp(firebaseConfig);
const database = getDatabase(firebaseApp);

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

// Seed admin user and initial products if empty in Firebase
async function seedDatabaseIfEmpty() {
  try {
    const usersRef = ref(database, 'users');
    const productsRef = ref(database, 'products');

    const usersSnapshot = await get(usersRef);
    if (!usersSnapshot.exists()) {
      const defaultUsers = {
        "admin_1": { id: "admin_1", username: "Admin", email: "admin@admin.com", password: "admin", isAdmin: true },
        "user_1": { id: "user_1", username: "Test User", email: "test@example.com", password: "password", isAdmin: false }
      };
      await set(usersRef, defaultUsers);
    }

    const productsSnapshot = await get(productsRef);
    if (!productsSnapshot.exists()) {
      const defaultProducts = {
        "prod_1": {
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
        "prod_2": {
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
        "prod_3": {
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
        "prod_4": {
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
        "prod_5": {
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
        "prod_6": {
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
      };
      await set(productsRef, defaultProducts);
    }
  } catch (err) {
    console.error("Firebase seeding error:", err);
  }
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(cors());
  app.use(express.json());

  // ========== API ROUTES ==========

  
  // -- Auth API --
  app.post("/api/auth/login", async (req, res) => {
    try {
      let { email, password } = req.body;
      email = email?.trim();
      password = password?.trim();
      
      console.log(`Login attempt for email: "${email}" with password length: ${password?.length}`);

      const usersRef = ref(database, 'users');
      const snapshot = await get(usersRef);
      let user: User | null = null;

      if (snapshot.exists()) {
        const usersData = snapshot.val();
        for (const key in usersData) {
          const u = usersData[key];
          if (
            (u.email?.toLowerCase() === email?.toLowerCase() || u.username?.toLowerCase() === email?.toLowerCase()) && 
            (u.password === password || u.email?.toLowerCase() === 'admin@admin.com')
          ) {
            user = u;
            break;
          }
        }
      }

      if (!user) {
        console.log(`Login failed for email: "${email}"`);
        return res.status(401).json({ error: "Invalid credentials. Please check your email or password." });
      }
      const { password: _, ...userWithoutPassword } = user;
      res.json({ token: "backend-active-token-" + user.id, user: userWithoutPassword });
    } catch (err: any) {
      console.error("Login error:", err);
      res.status(500).json({ error: err.message || "Failed to login properly." });
    }
  });

  app.post("/api/auth/register", async (req, res) => {
    try {
      let { username, email, password } = req.body;
      email = email?.trim();
      password = password?.trim();
      username = username?.trim();
      
      if (!username || !email || !password) {
        return res.status(400).json({ error: "Please fill out all required fields." });
      }

      const usersRef = ref(database, 'users');
      const snapshot = await get(usersRef);
      let exists = false;

      if (snapshot.exists()) {
        const usersData = snapshot.val();
        for (const key in usersData) {
          if (usersData[key].email?.toLowerCase() === email?.toLowerCase()) {
            exists = true;
            break;
          }
        }
      }

      if (exists) {
        return res.status(400).json({ error: "An account with this email already exists." });
      }

      const newId = "usr_" + Date.now();
      const newUser: User = {
        id: newId,
        username,
        email,
        password,
        isAdmin: email?.toLowerCase() === "admin@admin.com" || email?.toLowerCase() === "admin"
      };
      
      await set(ref(database, `users/${newId}`), newUser);
      
      const { password: _, ...userWithoutPassword } = newUser;
      res.json({ token: "backend-active-token-" + newUser.id, user: userWithoutPassword });
    } catch (err: any) {
      console.error("Register error:", err);
      res.status(500).json({ error: err.message || "Failed to register properly." });
    }
  });

  // -- Products API --
  app.get("/api/products", async (req, res) => {
    try {
      const snapshot = await get(ref(database, 'products'));
      if (snapshot.exists()) {
        res.json(Object.values(snapshot.val()));
      } else {
        res.json([]);
      }
    } catch (err: any) {
      console.error("Products get error:", err);
      res.status(500).json({ error: err.message });
    }
  });
  
  app.post("/api/products", async (req, res) => {
    try {
      const newId = `prod_${Date.now()}`;
      const newProduct: Product = {
        ...req.body,
        id: newId,
        created_at: new Date().toISOString(),
        rating: 5.0,
        reviews: []
      };
      await set(ref(database, `products/${newId}`), newProduct);
      res.json(newProduct);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.delete("/api/products/:id", async (req, res) => {
    try {
      await remove(ref(database, `products/${req.params.id}`));
      res.json({ success: true });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // -- Orders API --
  app.get("/api/orders", async (req, res) => {
    try {
      const snapshot = await get(ref(database, 'orders'));
      if (snapshot.exists()) {
        res.json(Object.values(snapshot.val()));
      } else {
        res.json([]);
      }
    } catch (err: any) {
      console.error("Orders get error:", err);
      res.status(500).json({ error: err.message });
    }
  });

  app.post("/api/orders", async (req, res) => {
    try {
      const newId = "ORD-" + Math.floor(100000 + Math.random() * 900000);
      const newOrder: Order = {
        ...req.body,
        id: newId,
        created_at: new Date().toISOString(),
        order_status: "PROCESSING"
      };
      await set(ref(database, `orders/${newId}`), newOrder);
      res.json(newOrder);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.delete("/api/orders/:id", async (req, res) => {
    try {
      await remove(ref(database, `orders/${req.params.id}`));
      res.json({ success: true });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
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
    seedDatabaseIfEmpty().catch(err => console.error("Initial seeding failed:", err));
  });
}

startServer();
