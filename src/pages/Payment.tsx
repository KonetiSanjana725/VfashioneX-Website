import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, CreditCard, Smartphone, Building2, Wallet } from "lucide-react";

export const Payment = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { orderId, amount, customDesign } = location.state || {};

  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("");

  const paymentOptions = [
    { id: "card", label: "Credit/Debit Card", icon: CreditCard },
    { id: "upi", label: "UPI", icon: Smartphone },
    { id: "netbanking", label: "Net Banking", icon: Building2 },
    { id: "wallet", label: "Digital Wallet", icon: Wallet },
  ];

  const handlePayment = async () => {
    if (!paymentMethod) {
      toast.error("Please select a payment method");
      return;
    }

    setLoading(true);
    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Update order status
      const { error } = await supabase
        .from('orders')
        .update({ status: 'confirmed' })
        .eq('id', orderId);

      if (error) throw error;

      // Navigate to confirmation
      navigate("/order-confirmation", {
        state: {
          orderId,
          amount,
          paymentMethod,
          customDesign
        }
      });
    } catch (error: any) {
      console.error("Payment error:", error);
      toast.error(error.message || "Payment failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!orderId || !amount) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="max-w-md">
          <CardContent className="pt-6 text-center">
            <h2 className="text-xl font-bold mb-2">Invalid Payment Request</h2>
            <p className="text-muted-foreground mb-4">
              Please complete the order details first
            </p>
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
        <h1 className="text-4xl font-bold mb-8 text-center">Payment</h1>
        
        <Card>
          <CardHeader>
            <CardTitle>Select Payment Method</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Amount Display */}
            <div className="bg-secondary/50 p-4 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Amount to Pay:</span>
                <span className="text-2xl font-bold text-accent">
                  ₹{amount?.toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            {/* Payment Methods */}
            <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
              <div className="space-y-3">
                {paymentOptions.map((option) => {
                  const Icon = option.icon;
                  return (
                    <div
                      key={option.id}
                      className={`flex items-center space-x-3 p-4 rounded-lg border-2 cursor-pointer transition-all ${
                        paymentMethod === option.id
                          ? 'border-accent bg-accent/5'
                          : 'border-border hover:border-accent/50'
                      }`}
                      onClick={() => setPaymentMethod(option.id)}
                    >
                      <RadioGroupItem value={option.id} id={option.id} />
                      <Icon className="w-5 h-5 text-accent" />
                      <Label htmlFor={option.id} className="flex-1 cursor-pointer">
                        {option.label}
                      </Label>
                    </div>
                  );
                })}
              </div>
            </RadioGroup>

            {/* Pay Button */}
            <Button
              onClick={handlePayment}
              variant="gradient"
              className="w-full"
              disabled={loading || !paymentMethod}
              size="lg"
            >
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {loading ? "Processing Payment..." : `Pay ₹${amount?.toLocaleString('en-IN')}`}
            </Button>

            <p className="text-xs text-muted-foreground text-center">
              Your payment is secure and encrypted
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Payment;