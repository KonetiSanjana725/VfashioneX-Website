import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Loader2, Package } from "lucide-react";

export const OrderCheckout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const { customDesign, price } = location.state || {};

  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [otp, setOtp] = useState("");
  
  const [formData, setFormData] = useState({
    address: "",
    city: "",
    state: "",
    pincode: "",
    phone: "",
    deliverySlot: "",
    deliveryDate: "",
  });

  const handleSendOTP = async () => {
    if (!formData.phone || formData.phone.length !== 10) {
      toast.error("Please enter a valid 10-digit mobile number");
      return;
    }
    
    // Simulate OTP sending
    setOtpSent(true);
    toast.success("OTP sent to your mobile number");
  };

  const handleVerifyOTP = () => {
    // In a real app, verify with backend
    if (otp.length === 6) {
      setOtpVerified(true);
      toast.success("Mobile number verified!");
    } else {
      toast.error("Please enter a valid 6-digit OTP");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!otpVerified) {
      toast.error("Please verify your mobile number first");
      return;
    }

    setLoading(true);
    try {
      // Create order record
      const { data: order, error } = await supabase
        .from('orders')
        .insert({
          user_id: user!.id,
          order_type: 'custom',
          shipping_address: {
            address: formData.address,
            city: formData.city,
            state: formData.state,
            pincode: formData.pincode,
            phone: formData.phone,
            deliverySlot: formData.deliverySlot,
            deliveryDate: formData.deliveryDate,
          },
          total_amount: price || 0,
          status: 'pending',
        })
        .select()
        .single();

      if (error) throw error;

      // Navigate to payment page
      navigate("/payment", { 
        state: { 
          orderId: order.id, 
          amount: price,
          customDesign 
        } 
      });
    } catch (error: any) {
      console.error("Order creation error:", error);
      toast.error(error.message || "Failed to create order");
    } finally {
      setLoading(false);
    }
  };

  if (!customDesign || !price) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="max-w-md">
          <CardContent className="pt-6 text-center">
            <Package className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <h2 className="text-xl font-bold mb-2">No Order Details</h2>
            <p className="text-muted-foreground mb-4">
              Please select a design first
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
      <div className="container mx-auto max-w-4xl">
        <h1 className="text-4xl font-bold mb-8 text-center">Complete Your Order</h1>
        
        <div className="grid md:grid-cols-2 gap-6">
          {/* Order Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="relative aspect-square rounded-lg overflow-hidden">
                <img 
                  src={customDesign} 
                  alt="Custom design" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex justify-between items-center text-lg font-semibold">
                <span>Total Amount:</span>
                <span className="text-accent">₹{price?.toLocaleString('en-IN')}</span>
              </div>
            </CardContent>
          </Card>

          {/* Delivery Details Form */}
          <Card>
            <CardHeader>
              <CardTitle>Delivery Details</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Textarea
                    id="address"
                    placeholder="Enter your full address"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    required
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city">City</Label>
                    <Input
                      id="city"
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="state">State</Label>
                    <Input
                      id="state"
                      value={formData.state}
                      onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="pincode">Pincode</Label>
                  <Input
                    id="pincode"
                    value={formData.pincode}
                    onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                    required
                    maxLength={6}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="deliveryDate">Delivery Date</Label>
                  <Input
                    id="deliveryDate"
                    type="date"
                    value={formData.deliveryDate}
                    onChange={(e) => setFormData({ ...formData, deliveryDate: e.target.value })}
                    required
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="deliverySlot">Delivery Time Slot</Label>
                  <Select 
                    value={formData.deliverySlot} 
                    onValueChange={(value) => setFormData({ ...formData, deliverySlot: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select time slot" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="9am-12pm">9 AM - 12 PM</SelectItem>
                      <SelectItem value="12pm-3pm">12 PM - 3 PM</SelectItem>
                      <SelectItem value="3pm-6pm">3 PM - 6 PM</SelectItem>
                      <SelectItem value="6pm-9pm">6 PM - 9 PM</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Mobile Number & OTP */}
                <div className="space-y-2">
                  <Label htmlFor="phone">Mobile Number</Label>
                  <div className="flex gap-2">
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value.replace(/\D/g, '').slice(0, 10) })}
                      required
                      maxLength={10}
                      placeholder="10-digit mobile number"
                      disabled={otpVerified}
                    />
                    <Button
                      type="button"
                      onClick={handleSendOTP}
                      disabled={otpSent || otpVerified || formData.phone.length !== 10}
                      variant="outline"
                    >
                      {otpVerified ? "Verified" : otpSent ? "Resend" : "Send OTP"}
                    </Button>
                  </div>
                </div>

                {otpSent && !otpVerified && (
                  <div className="space-y-2">
                    <Label htmlFor="otp">Enter OTP</Label>
                    <div className="flex gap-2">
                      <Input
                        id="otp"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                        maxLength={6}
                        placeholder="6-digit OTP"
                      />
                      <Button
                        type="button"
                        onClick={handleVerifyOTP}
                        disabled={otp.length !== 6}
                      >
                        Verify
                      </Button>
                    </div>
                  </div>
                )}

                <Button
                  type="submit"
                  variant="gradient"
                  className="w-full"
                  disabled={loading || !otpVerified}
                >
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Proceed to Payment
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default OrderCheckout;