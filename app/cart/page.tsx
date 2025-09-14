"use client";

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { useCart } from '@/contexts/CartContext';
import { Minus, Plus, Trash2, ShoppingBag, ArrowLeft, ArrowRight, CreditCard, Gift, Truck } from 'lucide-react';
import { toast } from 'sonner';

const Cart = () => {
  const { state, dispatch } = useCart();

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity < 1) return;
    dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity } });
  };

  const removeItem = (id: string) => {
    dispatch({ type: 'REMOVE_ITEM', payload: id });
    toast.success('Item removed from cart');
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
    toast.success('Cart cleared');
  };

  // Calculate bulk discounts for cart total
  const calculateCartTotals = () => {
    let subtotal = 0;
    let totalQuantity = 0;
    let bulkDiscount = 0;
    let shipping = 30;
    let freePolycards = 0;

    // Sum up all items
    state.items.forEach(item => {
      if (item.details?.pricing) {
        subtotal += item.details.pricing.subtotal + item.details.pricing.upcharge;
        totalQuantity += item.details.pricing.totalQuantity;
      } else {
        subtotal += item.price * item.quantity;
        totalQuantity += item.quantity;
      }
    });

    // Apply bulk discounts based on total quantity
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

    const afterDiscount = subtotal - bulkDiscount;
    const tax = afterDiscount * 0.08;
    const total = afterDiscount + shipping + tax;

    return {
      subtotal,
      bulkDiscount,
      shipping,
      freePolycards,
      tax,
      total,
      totalQuantity
    };
  };

  const cartTotals = calculateCartTotals();

  if (state.items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center space-y-8">
            <div className="bg-white rounded-full w-24 h-24 flex items-center justify-center mx-auto shadow-lg">
              <ShoppingBag className="h-12 w-12 text-gray-400" />
            </div>
            <div className="space-y-4">
              <h1 className="text-3xl font-bold text-gray-900">Your cart is empty</h1>
              <p className="text-xl text-gray-600 max-w-md mx-auto">
                Start shopping to add items to your cart and create your perfect ID solution.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/order">
                <Button size="lg" className="bg-green-600 hover:bg-green-700">
                  <ArrowLeft className="mr-2 h-5 w-5" />
                  Start Order
                </Button>
              </Link>
              <Link href="/">
                <Button size="lg" variant="outline">
                  Back to Home
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-2 text-sm text-gray-600 mb-4">
            <Link href="/" className="hover:text-blue-600">Home</Link>
            <span>/</span>
            <span className="text-gray-900">Shopping Cart</span>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
            <Button variant="outline" onClick={clearCart} className="self-start">
              <Trash2 className="mr-2 h-4 w-4" />
              Clear Cart
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {state.items.map((item) => (
              <Card key={item.id} className="overflow-hidden">
                <CardContent className="p-6">
                  <div className="flex flex-col sm:flex-row gap-4">
                    {/* ID Card Icon instead of image */}
                    <div className="relative w-full sm:w-24 h-32 sm:h-24 bg-gradient-to-br from-green-100 to-green-200 rounded-lg overflow-hidden flex-shrink-0 flex items-center justify-center">
                      <CreditCard className="h-12 w-12 text-green-600" />
                    </div>

                    {/* Product Details */}
                    <div className="flex-1 space-y-3">
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                        <div>
                          <h3 className="font-semibold text-lg text-gray-900">{item.name}</h3>
                          <Badge variant="outline" className="text-xs mt-1">
                            {item.category}
                          </Badge>
                          {/* Show ID details if available */}
                          {item.details && (
                            <div className="text-sm text-gray-600 mt-2 space-y-1">
                              <p>Type: {item.details.idType === 'regular' ? 'Regular ID' : 
                                       item.details.idType === 'polycard' ? 'Polycard' : 'NY v4 Polycard'}</p>
                              <p>Quantity: {item.details.totalQuantity || item.quantity} IDs</p>
                              {item.details.paymentMethod && (
                                <p>Payment: {item.details.paymentMethod === 'btc' ? 'Bitcoin (18% discount)' : 'Venmo (+5% fee)'}</p>
                              )}
                              {/* Show bulk benefits if applicable */}
                              {item.details.pricing?.freePolycards > 0 && (
                                <p className="text-orange-600">Includes: {item.details.pricing.freePolycards} free polycards</p>
                              )}
                              {item.details.pricing?.shipping === 0 && (
                                <p className="text-green-600">Includes: Free shipping</p>
                              )}
                            </div>
                          )}
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-blue-600">
                            ${(item.price * item.quantity).toFixed(2)}
                          </p>
                          <p className="text-sm text-gray-500">
                            ${item.price.toFixed(2)} each
                          </p>
                        </div>
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <span className="text-sm font-medium text-gray-700">Quantity:</span>
                          <div className="flex items-center border rounded-md">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              disabled={item.quantity <= 1}
                              className="px-2 h-8"
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <Input
                              type="number"
                              value={item.quantity}
                              onChange={(e) => updateQuantity(item.id, parseInt(e.target.value) || 1)}
                              className="w-16 h-8 text-center border-0 focus:ring-0"
                              min="1"
                            />
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="px-2 h-8"
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>

                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeItem(item.id)}
                          className="text-red-600 hover:text-red-800 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4 mr-1" />
                          Remove
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Order Summary */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal ({cartTotals.totalQuantity} IDs)</span>
                    <span>${cartTotals.subtotal.toFixed(2)}</span>
                  </div>
                  
                  {cartTotals.bulkDiscount > 0 && (
                    <div className="flex justify-between text-sm text-green-600">
                      <span>Bulk Discount ({cartTotals.totalQuantity >= 40 ? '25%' : cartTotals.totalQuantity >= 20 ? '10%' : '5%'})</span>
                      <span>-${cartTotals.bulkDiscount.toFixed(2)}</span>
                    </div>
                  )}
                  
                  <div className="flex justify-between text-sm">
                    <span>Shipping</span>
                    <span className={cartTotals.shipping === 0 ? 'text-green-600' : ''}>
                      {cartTotals.shipping === 0 ? 'FREE' : `$${cartTotals.shipping}`}
                    </span>
                  </div>
                  
                  {cartTotals.freePolycards > 0 && (
                    <div className="flex justify-between text-sm text-orange-600">
                      <span>Free Polycards</span>
                      <span>+{cartTotals.freePolycards} FREE</span>
                    </div>
                  )}
                  
                  <div className="flex justify-between text-sm">
                    <span>Tax (estimated)</span>
                    <span>${cartTotals.tax.toFixed(2)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between text-lg font-semibold">
                    <span>Total</span>
                    <span>${cartTotals.total.toFixed(2)}</span>
                  </div>
                </div>

                {/* Bulk Benefits Display */}
                {cartTotals.totalQuantity >= 10 && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <Gift className="h-4 w-4 text-green-600" />
                      <span className="font-medium text-green-900">Bulk Benefits Applied!</span>
                    </div>
                    <div className="space-y-1 text-sm text-green-700">
                      <p>✓ {cartTotals.totalQuantity >= 40 ? '25%' : cartTotals.totalQuantity >= 20 ? '10%' : '5%'} discount</p>
                      <p>✓ Free shipping</p>
                      <p>✓ {cartTotals.freePolycards} free polycard{cartTotals.freePolycards > 1 ? 's' : ''}</p>
                    </div>
                  </div>
                )}

                <div className="space-y-3 pt-4">
                  <Link href="/checkout">
                    <Button className="w-full bg-green-600 hover:bg-green-700" size="lg">
                      Proceed to Checkout
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </Link>
                  <Link href="/order">
                    <Button variant="outline" className="w-full">
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      Continue Shopping
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            {/* Shipping Info */}
            <Card>
              <CardContent className="p-4">
                <div className="text-center space-y-2">
                  <div className={`rounded-full w-12 h-12 flex items-center justify-center mx-auto ${
                    cartTotals.shipping === 0 ? 'bg-green-100' : 'bg-blue-100'
                  }`}>
                    {cartTotals.shipping === 0 ? (
                      <span className="text-green-600 font-semibold text-sm">FREE</span>
                    ) : (
                      <Truck className="h-6 w-6 text-blue-600" />
                    )}
                  </div>
                  <h3 className="font-semibold text-gray-900">
                    {cartTotals.shipping === 0 ? 'Free Shipping' : 'Standard Shipping'}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {cartTotals.shipping === 0 
                      ? 'Your order qualifies for free shipping!'
                      : `$${cartTotals.shipping} shipping fee. Order 10+ IDs for free shipping!`
                    }
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;