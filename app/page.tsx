"use client";

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Hammer, 
  Zap, 
  Eye, 
  Award, 
  ArrowRight, 
  CheckCircle,
  Star,
  Bitcoin,
  Smartphone,
  Truck,
  Globe,
  Users,
  CreditCard,
  Gift
} from 'lucide-react';

const Home = () => {
  const features = [
    {
      icon: Eye,
      title: 'Blacklight Reactive',
      description: 'Advanced security features including blacklight-reactive designs and barcode scanning capabilities.',
    },
    {
      icon: Hammer,
      title: 'Polycarbonate Material',
      description: 'Premium "Polycards" made from durable polycarbonate - the same material used in government IDs.',
    },
    {
      icon: Zap,
      title: 'Fast Worldwide Shipping',
      description: 'Secure shipping worldwide in 2-3 weeks. Express options available for urgent orders.',
    },
    {
      icon: Award,
      title: 'Professional Quality',
      description: 'Industry-leading printing technology and materials for superior, long-lasting results.',
    },
  ];

  const pricingTiers = [
    {
      quantity: '1-9 IDs',
      discount: 'Base Price',
      shipping: '$30',
      bonus: 'None',
      popular: false,
    },
    {
      quantity: '10-19 IDs',
      discount: '5% Off',
      shipping: 'FREE',
      bonus: '1 Free Polycard',
      popular: true,
    },
    {
      quantity: '20-39 IDs',
      discount: '10% Off',
      shipping: 'FREE',
      bonus: '2 Free Polycards',
      popular: false,
    },
    {
      quantity: '40+ IDs',
      discount: '20% Off',
      shipping: 'FREE',
      bonus: '4 Free Polycards',
      popular: false,
    },
  ];

  const testimonials = [
    {
      name: 'Alex Thompson',
      company: 'Security Consultant',
      rating: 5,
      comment: 'Outstanding quality and attention to detail. The blacklight features work perfectly.',
    },
    {
      name: 'Maria Rodriguez',
      company: 'Event Coordinator',
      rating: 5,
      comment: 'Fast shipping and professional results. The polycards are incredibly durable.',
    },
    {
      name: 'David Chen',
      company: 'Business Owner',
      rating: 5,
      comment: 'Excellent customer service and secure payment options. Highly recommended.',
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-green-900 via-green-800 to-emerald-700 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black bg-opacity-20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <Badge className="bg-orange-500 hover:bg-orange-600 text-white pulse-green">
                  ✓ Trusted Worldwide • Secure Payment
                </Badge>
                <h1 className="text-4xl lg:text-6xl font-bold leading-tight">
                  Professional ID Cards
                  <span className="block text-orange-400">Fast, Secure Shipping</span>
                </h1>
                <p className="text-xl text-green-100 leading-relaxed">
                  Premium identification cards with blacklight-reactive designs and barcode scanning. 
                  Polycards made from real polycarbonate material. Worldwide shipping in 2-3 weeks.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/order">
                  <Button size="lg" className="bg-orange-500 hover:bg-orange-600 text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all">
                    Order Now
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link href="/bulk">
                  <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-green-900">
                    Bulk Discounts
                  </Button>
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-5 w-5 text-green-400" />
                  <span className="text-sm">Blacklight Reactive</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-5 w-5 text-green-400" />
                  <span className="text-sm">Barcode Scanning</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-5 w-5 text-green-400" />
                  <span className="text-sm">Polycarbonate Material</span>
                </div>
              </div>

              {/* Special Offer */}
              <div className="bg-green-800 bg-opacity-50 border border-green-600 rounded-lg p-4">
                <div className="flex items-center space-x-2">
                  <Gift className="h-5 w-5 text-orange-400" />
                  <span className="text-sm font-medium text-orange-300">Special Offer:</span>
                </div>
                <p className="text-sm text-green-100 mt-1">
                  Get 1 duplicate ID automatically included with every order! Perfect for backup or replacement.
                </p>
              </div>

              {/* Payment Methods */}
              <div className="flex items-center space-x-6 pt-4 border-t border-green-600">
                <span className="text-sm text-green-200">Secure Payment:</span>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <Bitcoin className="h-5 w-5 text-orange-400" />
                    <span className="text-sm">Bitcoin</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Smartphone className="h-5 w-5 text-blue-400" />
                    <span className="text-sm">Venmo</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="bg-white rounded-2xl p-8 shadow-2xl transform rotate-3 hover:rotate-0 transition-transform duration-500 float-animation">
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="bg-gradient-to-br from-green-600 to-green-700 rounded-lg p-2">
                      <CreditCard className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Professional ID Sample</h3>
                      <p className="text-sm text-gray-600">Polycarbonate Material</p>
                    </div>
                  </div>
                  <div className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg p-4 space-y-3">
                    <div className="h-3 bg-gray-300 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-300 rounded w-1/2"></div>
                    <div className="h-16 bg-gradient-to-r from-green-400 to-green-600 rounded shadow-inner"></div>
                    <div className="flex justify-between items-center">
                      <div className="h-2 bg-gray-300 rounded w-1/3"></div>
                      <Eye className="h-4 w-4 text-purple-600" title="Blacklight Reactive" />
                    </div>
                  </div>
                  <div className="text-center">
                    <Badge className="bg-green-600 text-white">Blacklight Reactive</Badge>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-16">
            <Badge variant="outline" className="text-green-600 border-green-200">
              Advanced Security Features
            </Badge>
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">
              Professional ID Solutions
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our IDs include cutting-edge security features like blacklight-reactive designs, 
              barcode scanning, and premium polycarbonate materials used in government IDs.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-all duration-300 hover:transform hover:scale-105">
                <CardContent className="p-6 space-y-4">
                  <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto">
                    <feature.icon className="h-8 w-8 text-green-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Tiers */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-16">
            <Badge variant="outline" className="text-green-600 border-green-200">
              Bulk Discounts Available
            </Badge>
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">
              Dynamic Pricing & Bonuses
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Save more with bulk orders. Automatic discounts, free shipping, and bonus polycards included.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {pricingTiers.map((tier, index) => (
              <Card key={index} className={`relative hover:shadow-lg transition-all duration-300 ${
                tier.popular ? 'ring-2 ring-green-500 transform scale-105' : ''
              }`}>
                {tier.popular && (
                  <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-green-600">
                    Most Popular
                  </Badge>
                )}
                <CardContent className="p-6 text-center space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">{tier.quantity}</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Discount:</span>
                      <span className="font-medium text-green-600">{tier.discount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Shipping:</span>
                      <span className={`font-medium ${tier.shipping === 'FREE' ? 'text-green-600' : 'text-gray-900'}`}>
                        {tier.shipping}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Bonus:</span>
                      <span className="font-medium text-orange-600">{tier.bonus}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link href="/bulk">
              <Button size="lg" className="bg-green-600 hover:bg-green-700">
                View Bulk Pricing
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ID Types */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-16">
            <Badge variant="outline" className="text-green-600 border-green-200">
              ID Card Options
            </Badge>
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">
              Choose Your ID Type
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="hover:shadow-lg transition-all duration-300">
              <CardContent className="p-6 text-center space-y-4">
                <h3 className="text-xl font-semibold text-gray-900">Regular ID</h3>
                <p className="text-3xl font-bold text-green-600">$90</p>
                <p className="text-gray-600">Available for all states</p>
                <Badge variant="outline">Most Popular</Badge>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• High-quality printing</li>
                  <li>• Barcode scanning</li>
                  <li>• Durable materials</li>
                  <li>• 1 duplicate included</li>
                </ul>
                <div className="text-xs text-red-600 mt-2">
                  <p>Small order pricing:</p>
                  <p>Under 3 IDs: $180 each</p>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-all duration-300 ring-2 ring-green-500">
              <CardContent className="p-6 text-center space-y-4">
                <h3 className="text-xl font-semibold text-gray-900">Polycard</h3>
                <p className="text-3xl font-bold text-green-600">$160</p>
                <p className="text-gray-600">Real polycarbonate material</p>
                <Badge className="bg-green-600">Premium</Badge>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Polycarbonate material</li>
                  <li>• Blacklight reactive</li>
                  <li>• Government-grade quality</li>
                  <li>• 1 duplicate included</li>
                </ul>
                <div className="text-xs text-red-600 mt-2">
                  <p>Small order pricing:</p>
                  <p>Under 3: $245 • Under 6: $210</p>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-all duration-300">
              <CardContent className="p-6 text-center space-y-4">
                <h3 className="text-xl font-semibold text-gray-900">NY v4 Polycard</h3>
                <p className="text-3xl font-bold text-green-600">$200</p>
                <p className="text-gray-600">Latest NY edition</p>
                <Badge className="bg-blue-600">Latest</Badge>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Latest NY v4 design</li>
                  <li>• Enhanced security</li>
                  <li>• Premium features</li>
                  <li>• 1 duplicate included</li>
                </ul>
                <div className="text-xs text-red-600 mt-2">
                  <p>Small order pricing:</p>
                  <p>Under 3: $305 • Under 6: $270</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Reseller Program */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-2xl p-8 lg:p-12 text-white">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div className="space-y-6">
                <h2 className="text-3xl lg:text-4xl font-bold">
                  Join Our Reseller Program
                </h2>
                <p className="text-xl text-green-100">
                  Complete 10+ orders to unlock exclusive reseller perks including free shipping and custom discount codes.
                </p>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-300" />
                    <span>Free shipping on all orders</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-300" />
                    <span>Custom discount codes</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-300" />
                    <span>Priority customer support</span>
                  </div>
                </div>
                <Link href="/reseller">
                  <Button size="lg" className="bg-white text-green-700 hover:bg-gray-100">
                    Learn More
                    <Users className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
              </div>
              <div className="text-center">
                <div className="bg-white bg-opacity-20 rounded-xl p-6">
                  <Users className="h-16 w-16 text-white mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Exclusive Benefits</h3>
                  <p className="text-green-100">Unlock special pricing and perks</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-16">
            <Badge variant="outline" className="text-green-600 border-green-200">
              Customer Reviews
            </Badge>
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">
              What Our Customers Say
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow duration-300">
                <CardContent className="p-6 space-y-4">
                  <div className="flex items-center space-x-1">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-gray-600 italic">"{testimonial.comment}"</p>
                  <div>
                    <p className="font-semibold text-gray-900">{testimonial.name}</p>
                    <p className="text-sm text-gray-500">{testimonial.company}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-green-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="space-y-8">
            <h2 className="text-3xl lg:text-4xl font-bold">
              Ready to Order Your Professional ID?
            </h2>
            <p className="text-xl text-green-100 max-w-2xl mx-auto">
              Join thousands of satisfied customers worldwide. Secure payment via Bitcoin or Venmo. 
              Fast shipping in 2-3 weeks globally.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/order">
                <Button size="lg" className="bg-orange-500 hover:bg-orange-600 shadow-lg">
                  {authState.isAuthenticated ? 'Order Now' : 'Sign In to Order'}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/bulk">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-green-900">
                  View Bulk Pricing
                </Button>
              </Link>
            </div>
            <div className="flex items-center justify-center space-x-8 pt-4">
              <div className="flex items-center space-x-2">
                <Globe className="h-5 w-5 text-green-400" />
                <span className="text-sm">Worldwide Shipping</span>
              </div>
              <div className="flex items-center space-x-2">
                <Truck className="h-5 w-5 text-green-400" />
                <span className="text-sm">2-3 Weeks Delivery</span>
              </div>
              <div className="flex items-center space-x-2">
                <Hammer className="h-5 w-5 text-green-400" />
                <span className="text-sm">Secure Payment</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;