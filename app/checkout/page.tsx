"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Bitcoin, Smartphone, Copy, Check, ArrowLeft, Hammer, Clock, MapPin, Gift, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { db, generateOrderNumber } from '@/lib/database';
import { useRouter } from 'next/navigation';

const Checkout = () => {
  const { state, dispatch } = useCart();
  const { state: authState } = useAuth();
  const router = useRouter();
  const [paymentMethod, setPaymentMethod] = useState('bitcoin');
  const [orderNumber, setOrderNumber] = useState('');
  const [shoeBrand, setShoeBrand] = useState('');
  const [copied, setCopied] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSmallOrderWarning, setShowSmallOrderWarning] = useState(false);
  
  // Shipping address state
  const [shippingAddress, setShippingAddress] = useState({
    firstName: '',
    lastName: '',
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'United States'
  });

  useEffect(() => {
    // Generate order number on component mount
    const newOrderNumber = generateOrderNumber();
    setOrderNumber(newOrderNumber);
  }, []);

  // Check for small order fees
  useEffect(() => {
    const totalQuantity = calculateCartTotals().totalQuantity;
    const hasSmallOrderFees = state.items.some(item => {
      const quantity = item.details?.totalQuantity || item.quantity;
      const idType = item.details?.idType || 'regular';
      
      if (idType === 'regular' && quantity < 3) return true;
      if ((idType === 'polycard' || idType === 'ny-v4') && quantity < 6) return true;
      
      return false;
    });
    
    setShowSmallOrderWarning(hasSmallOrderFees);
  }, [state.items]);

  const paymentAddresses = {
    bitcoin: 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh',
    venmo: '@IDForge-Official',
  };

  // Calculate pricing with new pricing structure
  const calculateCartTotals = () => {
    let subtotal = 0;
    let totalQuantity = 0;
    let bulkDiscount = 0;
    let shipping = 30;
    let freePolycards = 0;
    let upcharge = 0;

    // Sum up all items with new pricing logic
    state.items.forEach(item => {
      const quantity = item.details?.totalQuantity || item.quantity;
      const idType = item.details?.idType || 'regular';
      let itemPrice = 0;

      // Calculate price per item based on type and quantity
      if (idType === 'regular') {
        if (quantity < 3) {
          itemPrice = 180; // Doubled price
        } else {
          itemPrice = 90; // Base price
        }
      } else if (idType === 'polycard') {
        if (quantity < 3) {
          itemPrice = 245; // Specific price for <3
        } else if (quantity < 6) {
          itemPrice = 210; // Specific price for <6
        } else {
          itemPrice = 160; // Base price
        }
      } else if (idType === 'ny-v4') {
        if (quantity < 3) {
          itemPrice = 305; // Specific price for <3
        } else if (quantity < 6) {
          itemPrice = 270; // Specific price for <6
        } else {
          itemPrice = 200; // Base price
        }
      }

      subtotal += itemPrice * quantity;
      totalQuantity += quantity;
    });

    // Apply bulk discounts based on total quantity (only for 6+ IDs)
    if (totalQuantity >= 10 && totalQuantity < 20) {
      bulkDiscount = subtotal * 0.05; // 5% off
      shipping = 0; // Free shipping
      freePolycards = 1; // 1 free polycard
    } else if (totalQuantity >= 20 && totalQuantity < 40) {
      bulkDiscount = subtotal * 0.10; // 10% off
      shipping = 0; // Free shipping
      freePolycards = 2; // 2 free polycards
    } else if (totalQuantity >= 40) {
      bulkDiscount = subtotal * 0.25; // 25% off
      shipping = 0; // Free shipping
      freePolycards = 4; // 4 free polycards
    }

    // Deduct free polycard value (assuming $160 per polycard)
    const freePolycardValue = freePolycards * 160;

    const baseTotal = subtotal - bulkDiscount - freePolycardValue + shipping;
    
    // Apply payment method adjustments
    let paymentAdjustment = 0;
    if (paymentMethod === 'venmo') {
      paymentAdjustment = baseTotal * 0.05; // 5% fee
    } else if (paymentMethod === 'bitcoin') {
      paymentAdjustment = baseTotal * -0.18; // 18% discount
    }
    
    const finalTotal = baseTotal + paymentAdjustment;
    
    return {
      subtotal,
      upcharge,
      bulkDiscount,
      shipping,
      freePolycards,
      freePolycardValue,
      baseTotal,
      paymentAdjustment,
      total: Math.max(0, finalTotal),
      totalQuantity,
    };
  };

  const pricing = calculateCartTotals();

  const handleCopyAddress = () => {
    const address = paymentAddresses[paymentMethod as keyof typeof paymentAddresses];
    navigator.clipboard.writeText(address);
    setCopied(true);
    toast.success('Payment address copied!');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShippingChange = (field: string, value: string) => {
    setShippingAddress(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmitPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate shipping address
    if (!shippingAddress.firstName || !shippingAddress.lastName || !shippingAddress.street || 
        !shippingAddress.city || !shippingAddress.state || !shippingAddress.zipCode) {
      toast.error('Please complete the shipping address');
      return;
    }
    
    // Only require shoe brand for Venmo payments
    if (paymentMethod === 'venmo' && !shoeBrand.trim()) {
      toast.error('Please enter a shoe brand in the payment notes for Venmo payments');
      return;
    }

    setIsSubmitting(true);

    try {
      // Create order in database
      const orderData = {
        orderNumber,
        userId: authState.user?.id,
        status: 'pending' as const,
        totalAmount: pricing.total,
        paymentMethod: paymentMethod as 'btc' | 'venmo',
        paymentStatus: 'pending' as const,
        shippingAddress,
        items: state.items.map(item => ({
          id: item.id,
          idType: item.details?.idType || 'regular',
          state: item.details?.state || '',
          country: item.details?.country || 'USA',
          quantity: item.details?.totalQuantity || item.quantity,
          price: item.price,
          personalInfo: item.details?.personalInfo || {},
          uploads: item.details?.uploads || {},
          additionalDuplicates: item.details?.additionalDuplicates || 0,
          pricing: item.details?.pricing || {},
        })),
      };

      const order = await db.createOrder(orderData);
      
      // Clear cart
      dispatch({ type: 'CLEAR_CART' });
      if (authState.user?.id) {
        await db.clearCart(authState.user.id);
      }

      toast.success('Order placed successfully! Redirecting to your orders...');
      
      // Redirect to orders page
      setTimeout(() => {
        router.push('/orders');
      }, 2000);

    } catch (error) {
      toast.error('Failed to place order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Redirect if cart is empty
  if (state.items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="p-8 text-center">
            <h2 className="text-xl font-semibold mb-4">Cart is Empty</h2>
            <p className="text-gray-600 mb-6">Add some items to your cart before checking out.</p>
            <Link href="/order">
              <Button className="bg-green-600 hover:bg-green-700">
                Start Order
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-2 text-sm text-gray-600 mb-4">
            <Link href="/" className="hover:text-green-600">Home</Link>
            <span>/</span>
            <Link href="/cart" className="hover:text-green-600">Cart</Link>
            <span>/</span>
            <span className="text-gray-900">Checkout</span>
          </div>
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-gray-900">Secure Checkout</h1>
            <Link href="/cart">
              <Button variant="outline" size="sm">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Cart
              </Button>
            </Link>
          </div>
        </div>

        {/* Small Order Warning */}
        {showSmallOrderWarning && (
          <Alert className="mb-6 border-yellow-200 bg-yellow-50">
            <AlertTriangle className="h-4 w-4 text-yellow-600" />
            <AlertDescription className="text-yellow-800">
              <strong>Small Order Fees Applied:</strong> Some items in your cart have small order pricing. 
              Regular IDs under 3 have doubled pricing. Polycards and NY v4 under 3/6 have specific pricing tiers.
            </AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Payment Section */}
          <div className="space-y-8">
            {/* Shipping Address */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <MapPin className="h-5 w-5 text-green-600" />
                  <span>Shipping Address</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">First Name *</Label>
                    <Input
                      id="firstName"
                      value={shippingAddress.firstName}
                      onChange={(e) => handleShippingChange('firstName', e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Last Name *</Label>
                    <Input
                      id="lastName"
                      value={shippingAddress.lastName}
                      onChange={(e) => handleShippingChange('lastName', e.target.value)}
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="street">Street Address *</Label>
                  <Input
                    id="street"
                    value={shippingAddress.street}
                    onChange={(e) => handleShippingChange('street', e.target.value)}
                    required
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="city">City *</Label>
                    <Input
                      id="city"
                      value={shippingAddress.city}
                      onChange={(e) => handleShippingChange('city', e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="state">State *</Label>
                    <Input
                      id="state"
                      value={shippingAddress.state}
                      onChange={(e) => handleShippingChange('state', e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="zipCode">ZIP Code *</Label>
                    <Input
                      id="zipCode"
                      value={shippingAddress.zipCode}
                      onChange={(e) => handleShippingChange('zipCode', e.target.value)}
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="country">Country *</Label>
                  <Input
                    id="country"
                    value={shippingAddress.country}
                    onChange={(e) => handleShippingChange('country', e.target.value)}
                    required
                  />
                </div>
              </CardContent>
            </Card>

            {/* Order Number */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Hammer className="h-5 w-5 text-green-600" />
                  <span>Order Information</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-green-900">Order Number</p>
                      <p className="text-lg font-mono font-bold text-green-700">{orderNumber}</p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        navigator.clipboard.writeText(orderNumber);
                        toast.success('Order number copied!');
                      }}
                      className="text-green-600 border-green-300"
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                  <p className="text-xs text-green-700 mt-2">
                    ⚠️ Include this order number in your payment notes
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Payment Method Selection */}
            <Card>
              <CardHeader>
                <CardTitle>Payment Method</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div
                    className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                      paymentMethod === 'bitcoin' ? 'border-orange-500 bg-orange-50' : 'border-gray-200 hover:border-orange-300'
                    }`}
                    onClick={() => setPaymentMethod('bitcoin')}
                  >
                    <div className="flex items-center space-x-3">
                      <Bitcoin className="h-8 w-8 text-orange-500" />
                      <div>
                        <h3 className="font-semibold">Bitcoin</h3>
                        <p className="text-sm text-gray-600">18% discount applied</p>
                        <Badge className="bg-green-600 text-white mt-1">Best Value</Badge>
                      </div>
                    </div>
                  </div>

                  <div
                    className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                      paymentMethod === 'venmo' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-blue-300'
                    }`}
                    onClick={() => setPaymentMethod('venmo')}
                  >
                    <div className="flex items-center space-x-3">
                      <Smartphone className="h-8 w-8 text-blue-500" />
                      <div>
                        <h3 className="font-semibold">Venmo</h3>
                        <p className="text-sm text-gray-600">5% processing fee</p>
                        <Badge variant="outline" className="mt-1">Quick Payment</Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Payment Instructions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  {paymentMethod === 'bitcoin' ? (
                    <Bitcoin className="h-5 w-5 text-orange-500" />
                  ) : (
                    <Smartphone className="h-5 w-5 text-blue-500" />
                  )}
                  <span>{paymentMethod === 'bitcoin' ? 'Bitcoin' : 'Venmo'} Payment</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Payment Address */}
                <div className="space-y-3">
                  <Label>
                    {paymentMethod === 'bitcoin' ? 'Bitcoin Address' : 'Venmo Username'}
                  </Label>
                  <div className="flex items-center space-x-2">
                    <Input
                      value={paymentAddresses[paymentMethod as keyof typeof paymentAddresses]}
                      readOnly
                      className="font-mono text-sm"
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleCopyAddress}
                      className="flex-shrink-0"
                    >
                      {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>

                {/* Amount */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="text-center">
                    <p className="text-sm text-gray-600">Amount to Send</p>
                    <p className="text-2xl font-bold text-gray-900">${pricing.total.toFixed(2)}</p>
                    {pricing.paymentAdjustment !== 0 && (
                      <p className={`text-sm ${pricing.paymentAdjustment > 0 ? 'text-red-600' : 'text-green-600'}`}>
                        {paymentMethod === 'venmo' ? '+5% fee included' : '18% discount applied'}
                      </p>
                    )}
                  </div>
                </div>

                {/* Payment Notes Form */}
                <form onSubmit={handleSubmitPayment} className="space-y-4">
                  {paymentMethod === 'venmo' && (
                    <div className="space-y-2">
                      <Label htmlFor="shoeBrand">Shoe Brand (Required for Venmo)</Label>
                      <Input
                        id="shoeBrand"
                        value={shoeBrand}
                        onChange={(e) => setShoeBrand(e.target.value)}
                        placeholder="e.g., Nike, Adidas, Converse..."
                        required={paymentMethod === 'venmo'}
                      />
                      <p className="text-xs text-gray-600">
                        Include any shoe brand in your Venmo payment notes along with the order number
                      </p>
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="paymentInstructions">Payment Notes Preview</Label>
                    <Textarea
                      id="paymentInstructions"
                      value={paymentMethod === 'venmo' ? `Order: ${orderNumber} - ${shoeBrand}` : `Order: ${orderNumber}`}
                      readOnly
                      className="bg-gray-50"
                      rows={2}
                    />
                  </div>

                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <div className="flex items-start space-x-2">
                      <Clock className="h-5 w-5 text-yellow-600 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-yellow-900">Payment Instructions</h4>
                        <ol className="text-sm text-yellow-800 mt-2 space-y-1 list-decimal list-inside">
                          <li>Send ${pricing.total.toFixed(2)} to the {paymentMethod} address above</li>
                          <li>Include "{paymentMethod === 'venmo' ? `${orderNumber} - ${shoeBrand || '[shoe brand]'}` : orderNumber}" in payment notes</li>
                          <li>Click "Confirm Payment" below after sending</li>
                          <li>We'll verify and process your order within 24 hours</li>
                        </ol>
                      </div>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-green-600 hover:bg-green-700"
                    size="lg"
                    disabled={isSubmitting || (paymentMethod === 'venmo' && !shoeBrand.trim())}
                  >
                    {isSubmitting ? 'Processing Order...' : 'Place Order'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div className="space-y-6">
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Order Items */}
                <div className="space-y-3">
                  {state.items.map((item, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <div>
                        <span className="font-medium">{item.name}</span>
                        <span className="text-gray-600 ml-2">× {item.quantity}</span>
                      </div>
                      <span className="font-medium">${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>

                <Separator />

                {/* Pricing Breakdown */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal ({pricing.totalQuantity} IDs)</span>
                    <span>${pricing.subtotal.toFixed(2)}</span>
                  </div>

                  {pricing.bulkDiscount > 0 && (
                    <div className="flex justify-between text-sm text-green-600">
                      <span>Bulk Discount ({pricing.totalQuantity >= 40 ? '25%' : pricing.totalQuantity >= 20 ? '10%' : '5%'})</span>
                      <span>-${pricing.bulkDiscount.toFixed(2)}</span>
                    </div>
                  )}

                  <div className="flex justify-between text-sm">
                    <span>Shipping</span>
                    <span className={pricing.shipping === 0 ? 'text-green-600' : ''}>
                      {pricing.shipping === 0 ? 'FREE' : `$${pricing.shipping}`}
                    </span>
                  </div>

                  {pricing.freePolycards > 0 && (
                    <div className="flex justify-between text-sm text-orange-600">
                      <span>Free Polycards</span>
                      <span>+{pricing.freePolycards} FREE</span>
                    </div>
                  )}

                  <div className="flex justify-between text-sm">
                    <span>Subtotal</span>
                    <span>${pricing.baseTotal.toFixed(2)}</span>
                  </div>

                  {pricing.paymentAdjustment !== 0 && (
                    <div className={`flex justify-between text-sm ${pricing.paymentAdjustment > 0 ? 'text-red-600' : 'text-green-600'}`}>
                      <span>
                        {paymentMethod === 'venmo' ? 'Venmo Fee (5%)' : 'Bitcoin Discount (18%)'}
                      </span>
                      <span>
                        {pricing.paymentAdjustment > 0 ? '+' : ''}${pricing.paymentAdjustment.toFixed(2)}
                      </span>
                    </div>
                  )}

                  <Separator />

                  <div className="flex justify-between text-lg font-semibold">
                    <span>Total</span>
                    <span>${pricing.total.toFixed(2)}</span>
                  </div>
                </div>

                {/* Bulk Benefits Display */}
                {pricing.totalQuantity >= 10 && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <Gift className="h-4 w-4 text-green-600" />
                      <span className="font-medium text-green-900">Bulk Benefits Applied!</span>
                    </div>
                    <div className="space-y-1 text-sm text-green-700">
                      <p>✓ {pricing.totalQuantity >= 40 ? '25%' : pricing.totalQuantity >= 20 ? '10%' : '5%'} discount</p>
                      <p>✓ Free shipping</p>
                      <p>✓ {pricing.freePolycards} free polycard{pricing.freePolycards > 1 ? 's' : ''}</p>
                    </div>
                  </div>
                )}

                {/* Security Info */}
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center space-x-2">
                    <Hammer className="h-4 w-4 text-green-600" />
                    <span className="text-sm font-medium text-green-900">Secure Payment</span>
                  </div>
                  <p className="text-xs text-green-700 mt-1">
                    All payments are verified and processed securely. Your order will begin production after payment confirmation.
                  </p>
                </div>

                {/* Delivery Info */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-medium text-blue-900 mb-2">Delivery Information</h4>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• Worldwide shipping: 2-3 weeks</li>
                    <li>• Production time: 5-7 business days</li>
                    <li>• Tracking provided when shipped</li>
                    <li>• Secure packaging & discrete shipping</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;