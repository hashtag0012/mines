import { type User, type InsertUser, type Product, type InsertProduct, type ProductSize, type InsertProductSize, type ProductImage, type InsertProductImage, type Order, type InsertOrder, type OrderItem, type InsertOrderItem, type DropSignup, type InsertDropSignup, users, products, productSizes, productImages, orders, orderItems, dropSignups } from "@shared/schema";
import { db } from "./db.js";
import { eq, desc } from "drizzle-orm";

export interface IStorage {
  // Users
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUserRole(id: string, role: "admin" | "user"): Promise<User>;
  listUsers(): Promise<User[]>;

  // Orders
  getOrder(id: string): Promise<Order | undefined>;
  listOrders(): Promise<Order[]>;
  createOrder(order: InsertOrder): Promise<Order>;
  deleteOrder(id: string): Promise<void>;
  updateOrderStatus(id: string, status: string): Promise<Order>;

  // Order Items
  getOrderItems(orderId: string): Promise<OrderItem[]>;
  getOrderItemsForAll(): Promise<OrderItem[]>;
  createOrderItem(item: InsertOrderItem): Promise<OrderItem>;

  // Drop Signups
  createDropSignup(signup: InsertDropSignup): Promise<DropSignup>;
}

export class DatabaseStorage implements IStorage {
  // Users
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  async updateUserRole(id: string, role: "admin" | "user"): Promise<User> {
    const [updated] = await db.update(users).set({ role }).where(eq(users.id, id)).returning();
    return updated;
  }

  async listUsers(): Promise<User[]> {
    return await db.select().from(users).orderBy(desc(users.createdAt));
  }

  // Orders
  async getOrder(id: string): Promise<Order | undefined> {
    const [order] = await db.select().from(orders).where(eq(orders.id, id));
    return order;
  }

  async listOrders(): Promise<Order[]> {
    return await db.select().from(orders).orderBy(desc(orders.createdAt));
  }

  async createOrder(insertOrder: InsertOrder): Promise<Order> {
    const [order] = await db.insert(orders).values(insertOrder).returning();
    return order;
  }

  async deleteOrder(id: string): Promise<void> {
    await db.delete(orders).where(eq(orders.id, id));
  }

  async updateOrderStatus(id: string, status: string): Promise<Order> {
    const [updated] = await db.update(orders).set({ status }).where(eq(orders.id, id)).returning();
    return updated;
  }

  // Order Items
  async getOrderItems(orderId: string): Promise<OrderItem[]> {
    return await db.select().from(orderItems).where(eq(orderItems.orderId, orderId));
  }

  async getOrderItemsForAll(): Promise<OrderItem[]> {
    return await db.select().from(orderItems);
  }

  async createOrderItem(insertOrderItem: InsertOrderItem): Promise<OrderItem> {
    const [orderItem] = await db.insert(orderItems).values(insertOrderItem).returning();
    return orderItem;
  }

  // Drop Signups
  async createDropSignup(signup: InsertDropSignup): Promise<DropSignup> {
    const [dropSignup] = await db.insert(dropSignups).values(signup).returning();
    return dropSignup;
  }
}

export const storage = new DatabaseStorage();
