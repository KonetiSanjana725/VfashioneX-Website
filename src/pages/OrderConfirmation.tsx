import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Package } from "lucide-react";
import confetti from "canvas-confetti";

export const OrderConfirmation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { orderId, amount, paymentMethod, customDesign } = location.state || {};

  useEffect(() => {
    // Trigger confetti animation
    const duration = 3000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 2,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#EC4899', '#8B5CF6', '#F59E0B']
      });
      confetti({
        particleCount: 2,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#EC4899', '#8B5CF6', '#F59E0B']
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };
    frame();
  }, []);

  if (!orderId) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="max-w-md">
          <CardContent className="pt-6 text-center">
            <Package className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <h2 className="text-xl font-bold mb-2">No Order Found</h2>
            <Button onClick={() => navigate("/")}>
              Back to Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-20 px-4 bg-secondary/30">
      <div className="container mx-auto max-w-2xl">
        <Card className="text-center">
          <CardContent className="pt-12 pb-12 space-y-6">
            {/* Success Icon */}
            <div className="flex justify-center">
              <div className="w-24 h-24 bg-accent/10 rounded-full flex items-center justify-center">
                <CheckCircle2 className="w-16 h-16 text-accent" />
              </div>
            </div>

            {/* Success Message */}
            <div className="space-y-2">
              <h1 className="text-4xl font-bold">Order Placed Successfully!</h1>
              <p className="text-lg text-muted-foreground">
                Thank you for your purchase
              </p>
            </div>

            {/* Order Details */}
            <div className="bg-secondary/50 p-6 rounded-lg space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Order ID:</span>
                <span className="font-mono font-semibold">{orderId.slice(0, 8).toUpperCase()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Amount Paid:</span>
                <span className="font-bold text-accent">₹{amount?.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Payment Method:</span>
                <span className="font-semibold capitalize">{paymentMethod}</span>
              </div>
            </div>

            {/* Order Image */}
            {customDesign && (
              <div className="relative w-64 h-64 mx-auto rounded-lg overflow-hidden">
                <img 
                  src={customDesign} 
                  alt="Ordered design" 
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            {/* Information */}
            <div className="text-sm text-muted-foreground space-y-1">
              <p>A confirmation email has been sent to your registered email address.</p>
              <p>You can track your order status in the Orders section.</p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button
                variant="gradient"
                size="lg"
                onClick={() => navigate("/orders")}
              >
                View My Orders
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={() => navigate("/")}
              >
                Continue Shopping
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default OrderConfirmation;