import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import fs from "fs";
import { MongoClient, ObjectId } from "mongodb";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import multer from "multer";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));

if (!fs.existsSync("uploads")) {
  fs.mkdirSync("uploads");
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});
const upload = multer({ storage });

const authenticateToken = (req: any, res: any, next: any) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) return res.sendStatus(401);
  jwt.verify(token, process.env.JWT_SECRET || "lux-bag-secret-key-2024", (err: any, user: any) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

async function startServer() {
  const mongoUri = process.env.MONGODB_URI;
  if (!mongoUri) {
    console.error("MONGODB_URI is not set!");
    process.exit(1);
  }

  const client = new MongoClient(mongoUri);
  await client.connect();
  console.log("Connected to MongoDB Atlas");

  const database = client.db("luxbag");
  const productsCol = database.collection("products");
  const settingsCol = database.collection("settings");
  const adminsCol = database.collection("admins");

   // ── Seed Admin ────────────────────────────────────────────────
  const existingAdmin = await adminsCol.findOne({ username: "admin" });
  if (!existingAdmin) {
    const hashedPassword = bcrypt.hashSync("password123", 10);
    await adminsCol.insertOne({ username: "admin", password: hashedPassword });
    console.log("✅ Admin created: username=admin password=password123");
  }

  // Seed Settings
  const settingsCount = await settingsCol.countDocuments();
  if (settingsCount === 0) {
    await settingsCol.insertMany([
      { key: "store_name", value: "Lux Bag by S and L" },
      { key: "whatsapp_number", value: "+971505876447" },
      { key: "email", value: "shanejusteene@gmail.com" },
      { key: "location", value: "Port Saeed, Dubai, United Arab Emirates" },
    ]);
  }

  // Seed Sample Products
  const productCount = await productsCol.countDocuments();
  if (productCount === 0) {
    await productsCol.insertMany([
      { product_name: "Hermes Birkin 25 Gold Togo", price: 85000, condition: "New", category: "Bags", size: "25cm", product_id: "H-B25-GLD", description: "The epitome of luxury. Crafted from Togo leather in iconic Gold color with Palladium hardware. Includes box, dustbag, and original receipt.", images: ["https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&q=80&w=800"], is_curated: 1, is_active: 1, created_at: new Date() },
      { product_name: "Chanel Classic Flap Medium", price: 32000, condition: "Preloved", category: "Bags", size: "26cm", product_id: "CH-CF-BLK", description: "A timeless classic. Black caviar leather with gold-tone hardware. Excellent condition. Series 30.", images: ["https://images.unsplash.com/photo-1591348278863-a8fb3887e2aa?auto=format&fit=crop&q=80&w=800"], is_curated: 1, is_active: 1, created_at: new Date() },
      { product_name: "Louis Vuitton OnTheGo MM", price: 12500, condition: "New", category: "Bags", size: "35cm", product_id: "LV-OTG-MONO", description: "The OnTheGo MM tote in Monogram canvas. Brand new with full set.", images: ["https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&q=80&w=800"], is_curated: 0, is_active: 1, created_at: new Date() },
      { product_name: "Dior Lady Dior Small", price: 18000, condition: "Preloved", category: "Bags", size: "20cm", product_id: "DI-LD-PNK", description: "Blush pink Cannage lambskin with pale gold-finish metal charms. Very good condition.", images: ["https://images.unsplash.com/photo-1590739225287-bd2a5d0bb544?auto=format&fit=crop&q=80&w=800"], is_curated: 0, is_active: 1, created_at: new Date() },
      { product_name: "Hermes Oran Sandals Gold", price: 2800, condition: "New", category: "Footwear", size: "EU 38", product_id: "H-ORAN-GLD", description: "Iconic Hermes Oran sandals in Epsom calfskin. A summer essential.", images: ["https://images.unsplash.com/photo-1603191659812-ee978eeeef76?auto=format&fit=crop&q=80&w=800"], is_curated: 0, is_active: 1, created_at: new Date() },
      { product_name: "Chanel Slingback Pumps", price: 4500, condition: "New", category: "Footwear", size: "EU 37.5", product_id: "CH-SLING-BEG", description: "Classic Chanel slingbacks in beige and black lambskin. Timeless elegance.", images: ["https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&q=80&w=800"], is_curated: 0, is_active: 1, created_at: new Date() },
    ]);
    console.log("Sample products seeded");
  }

  // Admin Login
  app.post("/api/admin/login", async (req, res) => {
    const { username, password } = req.body;
    const admin = await adminsCol.findOne({ username }) as any;
    if (admin && bcrypt.compareSync(password, admin.password)) {
      const token = jwt.sign({ id: admin._id.toString(), username: admin.username }, process.env.JWT_SECRET || "lux-bag-secret-key-2024", { expiresIn: "24h" });
      res.json({ token });
    } else {
      res.status(401).json({ message: "Invalid credentials" });
    }
  });

  // Get all products
  app.get("/api/products", async (req, res) => {
    const isAdmin = req.query.admin === "true";
    const query = isAdmin ? {} : { is_active: 1 };
    const items = await productsCol.find(query).sort({ created_at: -1 }).toArray();
    res.json(items.map((p: any) => ({ ...p, id: p._id.toString() })));
  });

  // Get single product
  app.get("/api/products/:id", async (req, res) => {
    try {
      const product = await productsCol.findOne({ _id: new ObjectId(req.params.id) }) as any;
      if (product) {
        res.json({ ...product, id: product._id.toString() });
      } else {
        res.status(404).json({ message: "Product not found" });
      }
    } catch {
      res.status(400).json({ message: "Invalid product ID" });
    }
  });

  // Create product
  app.post("/api/products", authenticateToken, upload.array("images"), async (req: any, res) => {
    const { product_name, price, condition, category, size, is_curated, description, product_id, is_active } = req.body;
    if (!product_name || !price || !product_id) {
      return res.status(400).json({ message: "Product name, price, and product ID are required" });
    }
    const existing = await productsCol.findOne({ product_id });
    if (existing) {
      return res.status(400).json({ message: "Product ID already exists. Please use a unique ID." });
    }
    const imagesArr = (req.files as any[] || []).map((f: any) => `/uploads/${f.filename}`);
    const result = await productsCol.insertOne({
      product_name, price: parseFloat(price), condition,
      category: category || "Bags", size,
      is_curated: parseInt(is_curated || "0"),
      description, product_id, images: imagesArr,
      is_active: is_active === undefined ? 1 : parseInt(is_active),
      created_at: new Date(),
    });
    res.status(201).json({ id: result.insertedId.toString() });
  });

  // Update product
  app.put("/api/products/:id", authenticateToken, upload.array("images"), async (req: any, res) => {
    const { product_name, price, condition, category, size, is_curated, description, product_id, existing_images, is_active } = req.body;
    let imagesArr = JSON.parse(existing_images || "[]");
    if (req.files && (req.files as any[]).length > 0) {
      imagesArr = [...imagesArr, ...(req.files as any[]).map((f: any) => `/uploads/${f.filename}`)];
    }
    try {
      await productsCol.updateOne(
        { _id: new ObjectId(req.params.id) },
        { $set: { product_name, price: parseFloat(price), condition, category, size, is_curated: parseInt(is_curated || "0"), description, product_id, images: imagesArr, is_active: parseInt(is_active) } }
      );
      res.json({ message: "Product updated" });
    } catch {
      res.status(400).json({ message: "Invalid product ID" });
    }
  });

  // Delete product
  app.delete("/api/products/:id", authenticateToken, async (req, res) => {
    try {
      await productsCol.deleteOne({ _id: new ObjectId(req.params.id) });
      res.json({ message: "Product deleted" });
    } catch {
      res.status(400).json({ message: "Invalid product ID" });
    }
  });

  // Get settings
  app.get("/api/settings", async (req, res) => {
    const allSettings = await settingsCol.find({}).toArray() as any[];
    const settingsObj = allSettings.reduce((acc: any, s: any) => ({ ...acc, [s.key]: s.value }), {});
    res.json(settingsObj);
  });

  // Update settings
  app.put("/api/settings", authenticateToken, async (req, res) => {
    for (const [key, value] of Object.entries(req.body)) {
      await settingsCol.updateOne({ key }, { $set: { value } }, { upsert: true });
    }
    res.json({ message: "Settings updated" });
  });

  // Stats
  app.get("/api/stats", authenticateToken, async (req, res) => {
    const totalProducts = await productsCol.countDocuments();
    const recentProducts = await productsCol.find({}).sort({ created_at: -1 }).limit(5).toArray();
    res.json({ totalProducts, recentProducts: recentProducts.map((p: any) => ({ ...p, id: p._id.toString() })) });
  });

  // Serve frontend
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({ server: { middlewareMode: true }, appType: "spa" });
    app.use(vite.middlewares);
  } else {
    app.use(express.static("dist"));
    app.get("*", (req, res) => {
      res.sendFile(path.resolve("dist/index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer().catch(console.error);
