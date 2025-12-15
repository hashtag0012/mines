import { sql } from "drizzle-orm";
import { sqliteTable, text, integer, real } from "drizzle-orm/sqlite-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users (Customers & Admins)
export const users = sqliteTable("users", {
  id: text("id").primaryKey().default(sql`(lower(hex(randomblob(4))) || '-' || lower(hex(randomblob(2))) || '-4' || substr(lower(hex(randomblob(2))),2) || '-' || substr('89ab',abs(random()) % 4 + 1, 1) || substr(lower(hex(randomblob(2))),2) || '-' || lower(hex(randomblob(6))))`),
  email: text("email", { length: 255 }).notNull().unique(),
  name: text("name").notNull(),
  phoneNumber: text("phone_number"),
  passwordHash: text("password_hash"),
  role: text("role", { enum: ["admin", "user"] }).default("user"),
  createdAt: integer("created_at", { mode: "timestamp" }).default(sql`CURRENT_TIMESTAMP`),
});

export const insertUserSchema = createInsertSchema(users).pick({
  email: true,
  name: true,
  phoneNumber: true,
  passwordHash: true,
  role: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Products
export const products = sqliteTable("products", {
  id: text("id").primaryKey().default(sql`(lower(hex(randomblob(4))) || '-' || lower(hex(randomblob(2))) || '-4' || substr(lower(hex(randomblob(2))),2) || '-' || substr('89ab',abs(random()) % 4 + 1, 1) || substr(lower(hex(randomblob(2))),2) || '-' || lower(hex(randomblob(6))))`),
  name: text("name").notNull(),
  description: text("description"),
  price: real("price").notNull(),
  category: text("category"),
  status: text("status").default("draft"), // 'active' | 'archived' | 'draft'
  createdAt: integer("created_at", { mode: "timestamp" }).default(sql`CURRENT_TIMESTAMP`),
});

export const insertProductSchema = createInsertSchema(products).pick({
  name: true,
  description: true,
  price: true,
  category: true,
  status: true,
});

export type InsertProduct = z.infer<typeof insertProductSchema>;
export type Product = typeof products.$inferSelect;

// Product Sizes (Inventory Unit)
export const productSizes = sqliteTable("product_sizes", {
  id: text("id").primaryKey().default(sql`(lower(hex(randomblob(4))) || '-' || lower(hex(randomblob(2))) || '-4' || substr(lower(hex(randomblob(2))),2) || '-' || substr('89ab',abs(random()) % 4 + 1, 1) || substr(lower(hex(randomblob(2))),2) || '-' || lower(hex(randomblob(6))))`),
  productId: text("product_id").references(() => products.id, { onDelete: "cascade" }),
  sizeLabel: text("size_label").notNull(),
  inventoryCount: integer("inventory_count").default(0),
});

export const insertProductSizeSchema = createInsertSchema(productSizes).pick({
  productId: true,
  sizeLabel: true,
  inventoryCount: true,
});

export type InsertProductSize = z.infer<typeof insertProductSizeSchema>;
export type ProductSize = typeof productSizes.$inferSelect;

// Product Images
export const productImages = sqliteTable("product_images", {
  id: text("id").primaryKey().default(sql`(lower(hex(randomblob(4))) || '-' || lower(hex(randomblob(2))) || '-4' || substr(lower(hex(randomblob(2))),2) || '-' || substr('89ab',abs(random()) % 4 + 1, 1) || substr(lower(hex(randomblob(2))),2) || '-' || lower(hex(randomblob(6))))`),
  productId: text("product_id").references(() => products.id, { onDelete: "cascade" }),
  imageUrl: text("image_url").notNull(),
  displayOrder: integer("display_order").default(0),
});

export const insertProductImageSchema = createInsertSchema(productImages).pick({
  productId: true,
  imageUrl: true,
  displayOrder: true,
});

export type InsertProductImage = z.infer<typeof insertProductImageSchema>;
export type ProductImage = typeof productImages.$inferSelect;

// Orders
export const orders = sqliteTable("orders", {
  id: text("id").primaryKey().default(sql`(lower(hex(randomblob(4))) || '-' || lower(hex(randomblob(2))) || '-4' || substr(lower(hex(randomblob(2))),2) || '-' || substr('89ab',abs(random()) % 4 + 1, 1) || substr(lower(hex(randomblob(2))),2) || '-' || lower(hex(randomblob(6))))`),
  userId: text("user_id").references(() => users.id, { onDelete: "set null" }),
  customerName: text("customer_name").notNull(),
  customerEmail: text("customer_email").notNull(),
  customerPhone: text("customer_phone").notNull(),
  customerAddress: text("customer_address").notNull(),
  status: text("status").default("pending"), // 'pending' | 'paid' | 'shipped' | 'delivered' | 'cancelled'
  totalAmount: real("total_amount").notNull(),
  stripePaymentId: text("stripe_payment_id"),
  createdAt: integer("created_at", { mode: "timestamp" }).default(sql`CURRENT_TIMESTAMP`),
});

export const insertOrderSchema = createInsertSchema(orders).pick({
  userId: true,
  customerName: true,
  customerEmail: true,
  customerPhone: true,
  customerAddress: true,
  status: true,
  totalAmount: true,
  stripePaymentId: true,
});

export type InsertOrder = z.infer<typeof insertOrderSchema>;
export type Order = typeof orders.$inferSelect;

// Order Items
export const orderItems = sqliteTable("order_items", {
  id: text("id").primaryKey().default(sql`(lower(hex(randomblob(4))) || '-' || lower(hex(randomblob(2))) || '-4' || substr(lower(hex(randomblob(2))),2) || '-' || substr('89ab',abs(random()) % 4 + 1, 1) || substr(lower(hex(randomblob(2))),2) || '-' || lower(hex(randomblob(6))))`),
  orderId: text("order_id").references(() => orders.id, { onDelete: "cascade" }),
  productId: text("product_id"),
  sizeLabel: text("size_label"),
  quantity: integer("quantity").notNull(),
  priceAtPurchase: real("price_at_purchase").notNull(),
});

export const insertOrderItemSchema = createInsertSchema(orderItems).pick({
  orderId: true,
  productId: true,
  sizeLabel: true,
  quantity: true,
  priceAtPurchase: true,
});

export type InsertOrderItem = z.infer<typeof insertOrderItemSchema>;
export type OrderItem = typeof orderItems.$inferSelect;

// Drop Signups (Phone Numbers)
export const dropSignups = sqliteTable("drop_signups", {
  id: text("id").primaryKey().default(sql`(lower(hex(randomblob(4))) || '-' || lower(hex(randomblob(2))) || '-4' || substr(lower(hex(randomblob(2))),2) || '-' || substr('89ab',abs(random()) % 4 + 1, 1) || substr(lower(hex(randomblob(2))),2) || '-' || lower(hex(randomblob(6))))`),
  phoneNumber: text("phone_number", { length: 20 }).notNull().unique(),
  createdAt: integer("created_at", { mode: "timestamp" }).default(sql`CURRENT_TIMESTAMP`),
});

export const insertDropSignupSchema = createInsertSchema(dropSignups).pick({
  phoneNumber: true,
});

export type InsertDropSignup = z.infer<typeof insertDropSignupSchema>;
export type DropSignup = typeof dropSignups.$inferSelect;
