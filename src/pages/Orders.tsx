import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Loader2, Package, ArrowLeft } from "lucide-react";
import { toast } from "sonner";

interface Order {
  id: string;
  created_at: string;
  status: string;
  total_amount: number;
  shipping_address: any;
  order_type: string;
}

export const Orders = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/auth");
      return;
    }
    fetchOrders();
  }, [isAuthenticated, navigate]);

  const fetchOrders = async () => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('user_id', user!.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setOrders(data || []);
    } catch (error: any) {
      console.error("Error fetching orders:", error);
      toast.error("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      pending: "secondary",
      confirmed: "default",
      shipped: "outline",
      delivered: "default",
      cancelled: "destructive",
    };
    return <Badge variant={variants[status] || "secondary"}>{status}</Badge>;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-accent" />
      </div>
    );
  }

  return (
    <div className="min-h-screen py-20 px-4 bg-secondary/30">
      <div className="container mx-auto max-w-4xl">
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" onClick={() => navigate("/")}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <h1 className="text-4xl font-bold">My Orders</h1>
        </div>

        {orders.length === 0 ? (
          <Card>
            <CardContent className="pt-12 pb-12 text-center">
              <Package className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
              <h2 className="text-2xl font-bold mb-2">No Orders Yet</h2>
              <p className="text-muted-foreground mb-6">
                Start shopping and your orders will appear here
              </p>
              <Button variant="gradient" onClick={() => navigate("/")}>
                Start Shopping
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <Card key={order.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">
                        Order #{order.id.slice(0, 8).toUpperCase()}
                      </CardTitle>
                      <p className="text-sm text-muted-foreground mt-1">
                        Placed on {new Date(order.created_at).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric'
                        })}
                      </p>
                    </div>
                    {getStatusBadge(order.status)}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Total Amount:</span>
                    <span className="text-xl font-bold text-accent">
                      ₹{order.total_amount?.toLocaleString('en-IN')}
                    </span>
                  </div>
                  
                  {order.shipping_address && (
                    <div className="text-sm">
                      <p className="font-semibold mb-1">Delivery Address:</p>
                      <p className="text-muted-foreground">
                        {order.shipping_address.address}, {order.shipping_address.city}<br />
                        {order.shipping_address.state} - {order.shipping_address.pincode}<br />
                        Phone: {order.shipping_address.phone}
                      </p>
                      {order.shipping_address.deliveryDate && (
                        <p className="text-muted-foreground mt-2">
                          Expected: {new Date(order.shipping_address.deliveryDate).toLocaleDateString('en-IN')}
                          {order.shipping_address.deliverySlot && ` (${order.shipping_address.deliverySlot})`}
                        </p>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;