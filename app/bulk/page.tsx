"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calculator, Gift, Truck, ArrowRight, CheckCircle } from 'lucide-react';

const BulkOrders = () => {
  const [quantity, setQuantity] = useState(10);
  const [idType, setIdType] = useState('regular');

  const calculatePricing = (qty: number, type: string) => {
    let basePrice = type === 'regular' ? 90 : type === 'polycard' ? 160 : 200; // Updated prices
    let discount = 0;
    let shipping = 30;
    let bonusCards = 0;

    // Quantity-based pricing adjustments
    if (qty < 3) {
      basePrice *= 2; // Double price
    } else if (qty < 6) {
      basePrice *= 1.5; // 50% increase
    } else if (qty >= 10 && qty < 20) {
      discount = 0.05; // 5% off
      shipping = 0; // Free shipping
      bonusCards = 1;
    } else if (qty >= 20 && qty < 40) {
      discount = 0.10; // 10% off
      shipping = 0; // Free shipping
      bonusCards = 2;
    } else if (qty >= 40) {
      discount = 0.20; // 20% off
      shipping = 0; // Free shipping
      bonusCards = 4;
    }

    const subtotal = basePrice * qty;
    const discountAmount = subtotal * discount;
    const total = subtotal - discountAmount + shipping;

    return {
      basePrice,
      subtotal,
      discount: discount * 100,
      discountAmount,
      shipping,
      total,
      bonusCards,
    };
  };

  const pricing = calculatePricing(quantity, idType);

  const pricingTiers = [
    {
      range: '1-2 IDs',
      multiplier: '2x Base Price',
      discount: 'None',
      shipping: '$30',
      bonus: 'None',
      description: 'Small orders have higher per-unit costs',
      color: 'red',
    },
    {
      range: '3-5 IDs',
      multiplier: '1.5x Base Price',
      discount: 'None',
      shipping: '$30',
      bonus: 'None',
      description: 'Reduced pricing for small batches',
      color: 'orange',
    },
    {
      range: '6-9 IDs',
      multiplier: 'Base Price',
      discount: 'None',
      shipping: '$30',
      bonus: 'None',
      description: 'Standard pricing applies',
      color: 'gray',
    },
    {
      range: '10-19 IDs',
      multiplier: 'Base Price',
      discount: '5% Off',
      shipping: 'FREE',
      bonus: '1 Free Polycard',
      description: 'First bulk discount tier',
      color: 'green',
      popular: true,
    },
    {
      range: '20-39 IDs',
      multiplier: 'Base Price',
      discount: '10% Off',
      shipping: 'FREE',
      bonus: '2 Free Polycards',
      description: 'Better savings for larger orders',
      color: 'blue',
    },
    {
      range: '40+ IDs',
      multiplier: 'Base Price',
      discount: '20% Off',
      shipping: 'FREE',
      bonus: '4 Free Polycards',
      description: 'Maximum savings for enterprise orders',
      color: 'purple',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center space-y-4">
            <Badge className="bg-green-100 text-green-800 hover:bg-green-200">
              Bulk Discounts Available
            </Badge>
            <h1 className="text-4xl font-bold text-gray-900">Bulk Order Pricing</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Save more with larger orders. Automatic discounts, free shipping, and bonus polycards included. 
              Perfect for organizations, events, and resellers.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Pricing Calculator */}
          <div className="lg:col-span-1">
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Calculator className="h-5 w-5 text-green-600" />
                  <span>Pricing Calculator</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-3">
                  <Label>Quantity</Label>
                  <Input
                    type="number"
                    min="1"
                    value={quantity}
                    onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                    className="text-lg font-semibold"
                  />
                </div>

                <div className="space-y-3">
                  <Label>ID Type</Label>
                  <div className="space-y-2">
                    {[
                      { value: 'regular', label: 'Regular ID', price: '$90' },
                      { value: 'polycard', label: 'Polycard', price: '$160' },
                      { value: 'ny-v4', label: 'NY v4 Polycard', price: '$200' },
                    ].map((type) => (
                      <div
                        key={type.value}
                        className={`border-2 rounded-lg p-3 cursor-pointer transition-all ${
                          idType === type.value ? 'border-green-500 bg-green-50' : 'border-gray-200 hover:border-green-300'
                        }`}
                        onClick={() => setIdType(type.value)}
                      >
                        <div className="flex justify-between items-center">
                          <span className="font-medium">{type.label}</span>
                          <span className="text-green-600 font-semibold">{type.price}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="border-t pt-4 space-y-3">
                  <div className="flex justify-between text-sm">
                    <span>Base Price ({quantity} × ${pricing.basePrice})</span>
                    <span>${pricing.subtotal.toFixed(2)}</span>
                  </div>
                  
                  {pricing.discount > 0 && (
                    <div className="flex justify-between text-sm text-green-600">
                      <span>Bulk Discount ({pricing.discount}%)</span>
                      <span>-${pricing.discountAmount.toFixed(2)}</span>
                    </div>
                  )}

                  <div className="flex justify-between text-sm">
                    <span>Shipping</span>
                    <span className={pricing.shipping === 0 ? 'text-green-600' : ''}>
                      {pricing.shipping === 0 ? 'FREE' : `$${pricing.shipping}`}
                    </span>
                  </div>

                  {pricing.bonusCards > 0 && (
                    <div className="flex justify-between text-sm text-orange-600">
                      <span>Bonus Polycards</span>
                      <span>+{pricing.bonusCards} FREE</span>
                    </div>
                  )}

                  <div className="border-t pt-2">
                    <div className="flex justify-between text-lg font-semibold">
                      <span>Total</span>
                      <span>${pricing.total.toFixed(2)}</span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                      ${(pricing.total / quantity).toFixed(2)} per ID
                    </p>
                  </div>
                </div>

                <Link href="/order">
                  <Button className="w-full bg-green-600 hover:bg-green-700" size="lg">
                    Start Order
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>

          {/* Pricing Tiers */}
          <div className="lg:col-span-2 space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Pricing Tiers</h2>
              <p className="text-gray-600">
                Automatic discounts and bonuses based on order quantity
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {pricingTiers.map((tier, index) => (
                <Card key={index} className={`relative hover:shadow-lg transition-all duration-300 ${
                  tier.popular ? 'ring-2 ring-green-500 transform scale-105' : ''
                }`}>
                  {tier.popular && (
                    <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-green-600">
                      Most Popular
                    </Badge>
                  )}
                  <CardContent className="p-6 space-y-4">
                    <div className="text-center">
                      <h3 className="text-lg font-semibold text-gray-900">{tier.range}</h3>
                      <p className="text-sm text-gray-600 mt-1">{tier.description}</p>
                    </div>

                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Pricing:</span>
                        <span className={`font-medium ${
                          tier.multiplier.includes('2x') ? 'text-red-600' :
                          tier.multiplier.includes('1.5x') ? 'text-orange-600' :
                          'text-gray-900'
                        }`}>
                          {tier.multiplier}
                        </span>
                      </div>

                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Discount:</span>
                        <span className={`font-medium ${
                          tier.discount === 'None' ? 'text-gray-500' : 'text-green-600'
                        }`}>
                          {tier.discount}
                        </span>
                      </div>

                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Shipping:</span>
                        <span className={`font-medium ${
                          tier.shipping === 'FREE' ? 'text-green-600' : 'text-gray-900'
                        }`}>
                          {tier.shipping}
                        </span>
                      </div>

                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Bonus:</span>
                        <span className={`font-medium ${
                          tier.bonus === 'None' ? 'text-gray-500' : 'text-orange-600'
                        }`}>
                          {tier.bonus}
                        </span>
                      </div>
                    </div>

                    {tier.bonus !== 'None' && (
                      <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
                        <div className="flex items-center space-x-2">
                          <Gift className="h-4 w-4 text-orange-600" />
                          <span className="text-sm font-medium text-orange-800">
                            Free Bonus Included!
                          </span>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Additional Benefits */}
            <Card className="mt-8">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span>Bulk Order Benefits</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="font-semibold text-gray-900">What's Included:</h4>
                    <ul className="space-y-2">
                      <li className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span className="text-sm">Automatic bulk discounts</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span className="text-sm">Free shipping on 10+ orders</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span className="text-sm">Bonus polycards included</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span className="text-sm">Priority processing</span>
                      </li>
                    </ul>
                  </div>
                  <div className="space-y-4">
                    <h4 className="font-semibold text-gray-900">Perfect For:</h4>
                    <ul className="space-y-2">
                      <li className="flex items-center space-x-2">
                        <Truck className="h-4 w-4 text-blue-600" />
                        <span className="text-sm">Organizations & companies</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <Truck className="h-4 w-4 text-blue-600" />
                        <span className="text-sm">Event coordinators</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <Truck className="h-4 w-4 text-blue-600" />
                        <span className="text-sm">Reseller programs</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <Truck className="h-4 w-4 text-blue-600" />
                        <span className="text-sm">Group orders</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BulkOrders;