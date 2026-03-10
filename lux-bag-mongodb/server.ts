import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { MongoClient, ObjectId } from "mongodb";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import multer from "multer";
import cors from "cors";
import dotenv from "dotenv";
import { v2 as cloudinary } from "cloudinary";
import { Readable } from "stream";

dotenv.config({ path: ".env.local" });
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const upload = multer({ storage: multer.memoryStorage() });

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

function uploadToCloudinary(buffer: Buffer, filename: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder: "luxbag", public_id: `${Date.now()}-${filename}`, resource_type: "image" },
      (error, result) => {
        if (error || !result) return reject(error);
        resolve(result.secure_url);
      }
    );
    Readable.from(buffer).pipe(uploadStream);
  });
}

async function startServer() {
  const mongoUri = process.env.MONGODB_URI;
  if (!mongoUri) { console.error("MONGODB_URI is not set!"); process.exit(1); }

  const client = new MongoClient(mongoUri);
  await client.connect();
  console.log("✅ Connected to MongoDB Atlas");

  const database = client.db("luxbag");
  const productsCol = database.collection("products");
  const settingsCol = database.collection("settings");
  const adminsCol = database.collection("admins");

  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
  console.log("✅ Cloudinary configured");

  // ── Seed Admin (with email field) ─────────────────────────────
  const existingAdmin = await adminsCol.findOne({});
  if (!existingAdmin) {
    const hashedPassword = bcrypt.hashSync("password123", 10);
    await adminsCol.insertOne({
      email: process.env.ADMIN_EMAIL || "admin@luxbagbysl.site",
      password: hashedPassword,
      resetToken: null,
      resetTokenExpiry: null,
    });
    console.log("✅ Admin created with email login");
  } else if (!existingAdmin.email) {
    // Migrate existing admin — add email field
    await adminsCol.updateOne(
      { _id: existingAdmin._id },
      { $set: { email: process.env.ADMIN_EMAIL || "admin@luxbagbysl.site", resetToken: null, resetTokenExpiry: null } }
    );
    console.log("✅ Admin migrated to email login");
  }

  // ── Seed Settings ─────────────────────────────────────────────
  const settingsCount = await settingsCol.countDocuments();
  if (settingsCount === 0) {
    await settingsCol.insertMany([
      { key: "store_name", value: "Lux Bag by S and L" },
      { key: "whatsapp_number", value: "+971505876447" },
      { key: "email", value: "shanejusteene@gmail.com" },
      { key: "location", value: "Port Saeed, Dubai, United Arab Emirates" },
    ]);
  }

  // ── Seed Sample Products ──────────────────────────────────────
  const productCount = await productsCol.countDocuments();
  if (productCount === 0) {
    await productsCol.insertMany([
      { product_name: "Hermes Birkin 25 Gold Togo", price: 85000, condition: "New", category: "Bags", size: "25cm", is_curated: 1, description: "The epitome of luxury.", product_id: "H-B25-GLD", images: ["https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&q=80&w=800"], is_active: 1, created_at: new Date() },
      { product_name: "Chanel Classic Flap Medium", price: 32000, condition: "Preloved", category: "Bags", size: "26cm", is_curated: 1, description: "Black caviar leather with gold-tone hardware.", product_id: "CH-CF-BLK", images: ["https://images.unsplash.com/photo-1591348278863-a8fb3887e2aa?auto=format&fit=crop&q=80&w=800"], is_active: 1, created_at: new Date() },
    ]);
    console.log("✅ Sample products seeded");
  }

  const fmt = (p: any) => ({ ...p, id: p._id.toString(), _id: undefined });

  // ── LOGIN (email + password) ───────────────────────────────────
  app.post("/api/admin/login", async (req, res) => {
    const { email, password } = req.body;
    const admin = await adminsCol.findOne({ email: email?.toLowerCase().trim() }) as any;
    if (admin && bcrypt.compareSync(password, admin.password)) {
      const token = jwt.sign({ id: admin._id.toString(), email: admin.email }, process.env.JWT_SECRET || "lux-bag-secret-key-2024", { expiresIn: "24h" });
      res.json({ token });
    } else {
      res.status(401).json({ message: "Invalid email or password" });
    }
  });

  // ── FORGOT PASSWORD — send reset email ────────────────────────

  // ── CHANGE PASSWORD (logged in) ────────────────────────────────
  app.put("/api/admin/change-password", authenticateToken, async (req: any, res) => {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) return res.status(400).json({ message: "Both fields required" });
    if (newPassword.length < 6) return res.status(400).json({ message: "New password must be at least 6 characters" });
    const admin = await adminsCol.findOne({ _id: new ObjectId(req.user.id) }) as any;
    if (!admin || !bcrypt.compareSync(currentPassword, admin.password)) return res.status(401).json({ message: "Current password is incorrect" });
    const hashed = bcrypt.hashSync(newPassword, 10);
    await adminsCol.updateOne({ _id: new ObjectId(req.user.id) }, { $set: { password: hashed } });
    res.json({ message: "Password changed successfully" });
  });

  // ── UPDATE ADMIN EMAIL ─────────────────────────────────────────
  app.put("/api/admin/update-email", authenticateToken, async (req: any, res) => {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: "Email and current password required" });
    const admin = await adminsCol.findOne({ _id: new ObjectId(req.user.id) }) as any;
    if (!admin || !bcrypt.compareSync(password, admin.password)) return res.status(401).json({ message: "Password is incorrect" });
    const existing = await adminsCol.findOne({ email: email.toLowerCase().trim(), _id: { $ne: admin._id } });
    if (existing) return res.status(400).json({ message: "That email is already in use" });
    await adminsCol.updateOne({ _id: admin._id }, { $set: { email: email.toLowerCase().trim() } });
    res.json({ message: "Email updated successfully" });
  });

  // ── PRODUCTS ───────────────────────────────────────────────────
  app.get("/api/products", async (req, res) => {
    const isAdmin = req.query.admin === "true";
    const query = isAdmin ? {} : { is_active: 1 };
    const all = await productsCol.find(query).sort({ created_at: -1 }).toArray();
    res.json(all.map(fmt));
  });

  app.get("/api/products/:id", async (req, res) => {
    try {
      const product = await productsCol.findOne({ _id: new ObjectId(req.params.id) });
      if (product) res.json(fmt(product));
      else res.status(404).json({ message: "Product not found" });
    } catch { res.status(400).json({ message: "Invalid product ID" }); }
  });

  app.post("/api/products", authenticateToken, upload.array("images"), async (req: any, res) => {
    const { product_name, price, condition, category, size, is_curated, description, product_id, is_active } = req.body;
    if (!product_name || !price || !product_id) return res.status(400).json({ message: "Product name, price, and product ID are required" });
    const existing = await productsCol.findOne({ product_id });
    if (existing) return res.status(400).json({ message: "Product ID already exists." });
    const imageUrls: string[] = [];
    for (const file of (req.files as any[] || [])) {
      const url = await uploadToCloudinary(file.buffer, file.originalname);
      imageUrls.push(url);
    }
    const result = await productsCol.insertOne({
      product_name, price: parseFloat(price), condition,
      category: category || "Bags", size,
      is_curated: parseInt(is_curated || 0), description, product_id,
      images: imageUrls,
      is_active: is_active === undefined ? 1 : parseInt(is_active),
      created_at: new Date(),
    });
    res.status(201).json({ id: result.insertedId.toString() });
  });

  app.put("/api/products/:id", authenticateToken, upload.array("images"), async (req: any, res) => {
    const { product_name, price, condition, category, size, is_curated, description, product_id, existing_images, is_active } = req.body;
    let imagesArr = JSON.parse(existing_images || "[]");

    // Find removed images and delete from Cloudinary
    try {
      const currentProduct = await productsCol.findOne({ _id: new ObjectId(req.params.id) }) as any;
      if (currentProduct && currentProduct.images) {
        const removedImages = currentProduct.images.filter((url: string) => !imagesArr.includes(url));
        for (const imageUrl of removedImages) {
          if (imageUrl.includes("res.cloudinary.com")) {
            const publicId = getCloudinaryPublicId(imageUrl);
            if (publicId) {
              try {
                await cloudinary.uploader.destroy(publicId);
                console.log("Deleted removed image from Cloudinary: " + publicId);
              } catch (err) {
                console.error("Failed to delete from Cloudinary: " + publicId, err);
              }
            }
          }
        }
      }
    } catch (err) {
      console.error("Error checking removed images:", err);
    }

    // Upload new images to Cloudinary
    for (const file of (req.files as any[] || [])) {
      const url = await uploadToCloudinary(file.buffer, file.originalname);
      imagesArr.push(url);
    }
    try {
      await productsCol.updateOne(
        { _id: new ObjectId(req.params.id) },
        { $set: { product_name, price: parseFloat(price), condition, category, size, is_curated: parseInt(is_curated || 0), description, product_id, images: imagesArr, is_active: parseInt(is_active) } }
      );
      res.json({ message: "Product updated" });
    } catch (error: any) { res.status(400).json({ message: error.message }); }
  });

  // Helper: extract Cloudinary public_id from URL
  function getCloudinaryPublicId(url: string): string | null {
    try {
      // URL format: .../upload/v1234567890/luxbag/filename.ext
      // We need everything after /upload/vXXXXXX/ and strip only the LAST extension
      const match = url.match(/\/upload\/(?:v\d+\/)?(.+)$/i);
      if (!match) return null;
      // Strip only the last extension (e.g. .png from filename.png.png → filename.png)
      const withoutLastExt = match[1].replace(/\.[^.]+$/, "");
      return withoutLastExt;
    } catch { return null; }
  }

  app.delete("/api/products/:id", authenticateToken, async (req, res) => {
    try {
      const product = await productsCol.findOne({ _id: new ObjectId(req.params.id) }) as any;
      if (!product) return res.status(404).json({ message: "Product not found" });

      // Delete images from Cloudinary
      if (product.images && product.images.length > 0) {
        for (const imageUrl of product.images) {
          if (imageUrl.includes("res.cloudinary.com")) {
            const publicId = getCloudinaryPublicId(imageUrl);
            if (publicId) {
              try {
                await cloudinary.uploader.destroy(publicId);
                console.log("Deleted from Cloudinary: " + publicId);
              } catch (err) {
                console.error("Failed to delete from Cloudinary: " + publicId, err);
              }
            }
          }
        }
      }

      await productsCol.deleteOne({ _id: new ObjectId(req.params.id) });
      res.json({ message: "Product deleted" });
    } catch { res.status(400).json({ message: "Invalid product ID" }); }
  });

  app.get("/api/settings", async (req, res) => {
    const all = await settingsCol.find({}).toArray();
    const obj = all.reduce((acc: any, s: any) => ({ ...acc, [s.key]: s.value }), {});
    res.json(obj);
  });

  app.put("/api/settings", authenticateToken, async (req, res) => {
    for (const [key, value] of Object.entries(req.body)) {
      await settingsCol.updateOne({ key }, { $set: { key, value } }, { upsert: true });
    }
    res.json({ message: "Settings updated" });
  });

  app.get("/api/stats", authenticateToken, async (req, res) => {
    const totalProducts = await productsCol.countDocuments();
    const recentProducts = await productsCol.find({}).sort({ created_at: -1 }).limit(5).toArray();
    res.json({ totalProducts, recentProducts: recentProducts.map(fmt) });
  });

  // Vite or Static
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({ server: { middlewareMode: true }, appType: "spa" });
    app.use(vite.middlewares);
  } else {
    app.use(express.static("dist"));
    app.get("*", (req, res) => res.sendFile(path.resolve("dist/index.html")));
  }

  app.listen(PORT, "0.0.0.0", () => console.log(`🚀 Server running on http://localhost:${PORT}`));
}

startServer().catch((err) => { console.error("Failed to start:", err); process.exit(1); });
