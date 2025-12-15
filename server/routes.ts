import express, { Express } from "express";
import session from "express-session";
import { createServer, Server } from "http";
import { z } from "zod";
import { fromZodError } from "zod-validation-error";
import { passport } from "./auth"; // make sure auth.ts exports passport configured
import { storage } from "./storage";
import {
  insertUserSchema,
  insertOrderSchema,
  insertOrderItemSchema
} from "@shared/schema";
import dotenv from "dotenv";

dotenv.config();

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // ----------------- Auth routes -----------------
  app.get(
    "/api/auth/google",
    passport.authenticate("google", { scope: ["profile", "email"] })
  );

  app.get(
    "/api/auth/google/callback",
    passport.authenticate("google", { failureRedirect: "/login" }),
    (req, res) => {
      res.redirect("/");
    }
  );

  app.post("/api/auth/logout", (req, res, next) => {
    req.logout((err) => {
      if (err) return next(err);
      res.json({ success: true });
    });
  });

  app.get("/api/auth/me", (req, res) => {
    if (!req.user) return res.status(401).json({ message: "Not authenticated" });
    res.json(req.user);
  });

  // ----------------- Users routes -----------------
  app.get("/api/users", async (req, res) => {
    if (!req.user || req.user.role !== "admin") return res.status(403).json({ message: "Admin access required" });

    try {
      const users = await storage.listUsers();
      res.json(users);
    } catch {
      res.status(500).json({ message: "Failed to fetch users" });
    }
  });

  // ----------------- Orders routes -----------------
  app.get("/api/orders", async (req, res) => {
    if (!req.user || req.user.role !== "admin") return res.status(403).json({ message: "Admin access required" });

    try {
      const orders = await storage.listOrders();
      res.json(orders);
    } catch {
      res.status(500).json({ message: "Failed to fetch orders" });
    }
  });

  app.get("/api/order-items", async (req, res) => {
    if (!req.user || req.user.role !== "admin") return res.status(403).json({ message: "Admin access required" });

    try {
      const orderItems = await storage.getOrderItemsForAll();
      res.json(orderItems);
    } catch {
      res.status(500).json({ message: "Failed to fetch order items" });
    }
  });

  app.post("/api/orders", async (req, res) => {
    // Require authentication for placing orders
    if (!req.user) return res.status(401).json({ message: "Authentication required to place orders" });

    try {
      console.log("=== ORDER CREATION STARTED ===");
      console.log("Order request received:", req.body);
      console.log("User:", req.user);
      console.log("User ID:", req.user.id);
      
      const { order, items } = req.body;
      console.log("Order data:", order);
      console.log("Order items:", items);
      
      if (!order || !items) {
        console.log("ERROR: Missing order or items data");
        return res.status(400).json({ message: "Order and items are required" });
      }
      
      // User must be authenticated
      const validatedOrder = insertOrderSchema.parse({ 
        ...order, 
        userId: req.user.id 
      });
      console.log("Validated order:", validatedOrder);
      
      const newOrder = await storage.createOrder(validatedOrder);
      console.log("Created order:", newOrder);

      // Create order items
      for (const item of items) {
        console.log("Creating order item:", item);
        const validatedItem = insertOrderItemSchema.parse({ ...item, orderId: newOrder.id });
        const createdItem = await storage.createOrderItem(validatedItem);
        console.log("Created order item:", createdItem);
      }

      console.log("=== ORDER CREATION COMPLETED SUCCESSFULLY ===");
      res.json(newOrder);
    } catch (err) {
      console.error("=== ORDER CREATION FAILED ===");
      console.error("Error details:", err);
      if (err instanceof z.ZodError) {
        console.error("Validation errors:", err.errors);
        return res.status(400).json({ message: fromZodError(err).message });
      }
      res.status(500).json({ message: "Failed to create order" });
    }
  });

  app.put("/api/orders/:id/status", async (req, res) => {
    if (!req.user || req.user.role !== "admin") return res.status(403).json({ message: "Admin access required" });

    try {
      const { status } = req.body;
      const updatedOrder = await storage.updateOrderStatus(req.params.id, status);
      res.json(updatedOrder);
    } catch {
      res.status(500).json({ message: "Failed to update order status" });
    }
  });

  app.delete("/api/orders/:id", async (req, res) => {
    if (!req.user || req.user.role !== "admin") return res.status(403).json({ message: "Admin access required" });

    try {
      await storage.deleteOrder(req.params.id);
      res.json({ message: "Order deleted successfully" });
    } catch {
      res.status(500).json({ message: "Failed to delete order" });
    }
  });

  return httpServer;
}
