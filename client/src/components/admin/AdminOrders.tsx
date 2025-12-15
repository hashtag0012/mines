import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { Trash2, Package } from "lucide-react";

// Simple date formatter for orders
const formatOrderDate = (createdAt: any) => {
  try {
    if (!createdAt) return 'No date';
    
    let date: Date;
    
    if (createdAt instanceof Date) {
      date = createdAt;
    } else if (typeof createdAt === 'string') {
      date = new Date(createdAt);
    } else if (typeof createdAt === 'number') {
      // Handle Unix timestamp
      date = new Date(createdAt < 10000000000 ? createdAt * 1000 : createdAt);
    } else {
      return 'Invalid';
    }
    
    if (isNaN(date.getTime())) {
      return 'Invalid';
    }
    
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch {
    return 'Error';
  }
};

const orderStatuses = ["pending", "paid", "shipped", "delivered", "cancelled"];

export default function AdminOrders() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: orders, isLoading } = useQuery({
    queryKey: ["/api/orders"],
    queryFn: async () => {
      const response = await apiRequest("GET", "/api/orders");
      return response.json();
    },
  });

  const { data: orderItems } = useQuery({
    queryKey: ["/api/order-items"],
    queryFn: async () => {
      const response = await apiRequest("GET", "/api/order-items");
      return response.json();
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      await apiRequest("PUT", `/api/orders/${id}/status`, { status });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/orders"] });
      toast({ title: "Order status updated" });
    },
    onError: () => {
      toast({ title: "Failed to update status", variant: "destructive" });
    },
  });

  const deleteOrderMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest("DELETE", `/api/orders/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/orders"] });
      toast({ title: "Order deleted successfully" });
    },
    onError: () => {
      toast({ title: "Failed to delete order", variant: "destructive" });
    },
  });

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Orders</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Orders</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order ID</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Products</TableHead>
              <TableHead>Address</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders?.map((order: any) => (
              <TableRow key={order.id}>
                <TableCell className="font-mono text-xs">{order.id.slice(0, 8)}</TableCell>
                <TableCell>{order.customerName || "Unknown"}</TableCell>
                <TableCell className="text-sm">{order.customerEmail}</TableCell>
                <TableCell className="text-sm font-mono">{order.customerPhone}</TableCell>
                <TableCell>
                  <div className="space-y-1">
                    {orderItems?.filter((item: any) => item.orderId === order.id).map((item: any, idx: number) => (
                      <div key={idx} className="flex items-center gap-2 text-sm">
                        <Package className="h-3 w-3" />
                        <span>Product {item.productId} ({item.sizeLabel}) x{item.quantity}</span>
                        <span className="text-muted-foreground">${item.priceAtPurchase}</span>
                      </div>
                    ))}
                  </div>
                </TableCell>
                <TableCell className="text-sm max-w-[200px] truncate">{order.customerAddress}</TableCell>
                <TableCell>${order.totalAmount}</TableCell>
                <TableCell>
                  <Badge
                    variant={
                      order.status === "delivered"
                        ? "default"
                        : order.status === "cancelled"
                        ? "destructive"
                        : "secondary"
                    }
                  >
                    {order.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-sm">{formatOrderDate(order.createdAt)}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Select
                      value={order.status}
                      onValueChange={(value) =>
                        updateStatusMutation.mutate({ id: order.id, status: value })
                      }
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {orderStatuses.map((status) => (
                          <SelectItem key={status} value={status}>
                            {status}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Button
                      variant="destructive"
                      size="icon"
                      onClick={() => deleteOrderMutation.mutate(order.id)}
                      className="h-8 w-8"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
