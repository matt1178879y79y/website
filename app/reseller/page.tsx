"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Users, Crown, Gift, Truck, Percent, ArrowRight, CheckCircle, Star } from 'lucide-react';
import { toast } from 'sonner';

const ResellerProgram = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    company: '',
    website: '',
    experience: '',
    expectedVolume: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      toast.success('Application submitted! We\'ll review and contact you within 24 hours.');
      setIsSubmitting(false);
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        company: '',
        website: '',
        experience: '',
        expectedVolume: '',
      });
    }, 2000);
  };

  const benefits = [
    {
      icon: Truck,
      title: 'Free Shipping',
      description: 'Complimentary shipping on all orders, regardless of quantity.',
      color: 'green',
    },
    {
      icon: Percent,
      title: 'Custom Discount Codes',
      description: 'Personalized discount codes for your customers with competitive rates.',
      color: 'blue',
    },
    {
      icon: Crown,
      title: 'Priority Support',
      description: 'Dedicated customer service line with faster response times.',
      color: 'purple',
    },
    {
      icon: Gift,
      title: 'Exclusive Bonuses',
      description: 'Additional bonus cards and special promotions for resellers.',
      color: 'orange',
    },
  ];

  const requirements = [
    'Complete 10+ successful orders',
    'Maintain good standing with payments',
    'Provide business information',
    'Agree to reseller terms',
  ];

  const tiers = [
    {
      name: 'Bronze Reseller',
      orders: '10-24 Orders',
      discount: '5% Commission',
      shipping: 'Free Shipping',
      support: 'Email Support',
      bonuses: '1 Bonus Card per 10 orders',
    },
    {
      name: 'Silver Reseller',
      orders: '25-49 Orders',
      discount: '8% Commission',
      shipping: 'Free Express Shipping',
      support: 'Priority Email Support',
      bonuses: '2 Bonus Cards per 10 orders',
      popular: true,
    },
    {
      name: 'Gold Reseller',
      orders: '50+ Orders',
      discount: '12% Commission',
      shipping: 'Free Express Shipping',
      support: 'Phone & Email Support',
      bonuses: '3 Bonus Cards per 10 orders',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-green-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center space-y-4">
            <Badge className="bg-orange-500 hover:bg-orange-600 text-white">
              Exclusive Program
            </Badge>
            <h1 className="text-4xl font-bold">Reseller Program</h1>
            <p className="text-xl text-green-100 max-w-3xl mx-auto">
              Join our exclusive reseller network and unlock special benefits. Complete 10+ orders 
              to access free shipping, custom discount codes, and priority support.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Benefits Section */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Reseller Benefits</h2>
            <p className="text-xl text-gray-600">
              Unlock exclusive perks and grow your business with our reseller program
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-all duration-300">
                <CardContent className="p-6 space-y-4">
                  <div className={`bg-${benefit.color}-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto`}>
                    <benefit.icon className={`h-8 w-8 text-${benefit.color}-600`} />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900">{benefit.title}</h3>
                  <p className="text-gray-600">{benefit.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Reseller Tiers */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Reseller Tiers</h2>
            <p className="text-xl text-gray-600">
              Advance through tiers based on your order volume and unlock better benefits
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {tiers.map((tier, index) => (
              <Card key={index} className={`relative hover:shadow-lg transition-all duration-300 ${
                tier.popular ? 'ring-2 ring-green-500 transform scale-105' : ''
              }`}>
                {tier.popular && (
                  <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-green-600">
                    Most Popular
                  </Badge>
                )}
                <CardHeader className="text-center">
                  <CardTitle className="text-xl">{tier.name}</CardTitle>
                  <p className="text-gray-600">{tier.orders}</p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Commission:</span>
                      <span className="font-medium text-green-600">{tier.discount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Shipping:</span>
                      <span className="font-medium">{tier.shipping}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Support:</span>
                      <span className="font-medium">{tier.support}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Bonuses:</span>
                      <span className="font-medium text-orange-600">{tier.bonuses}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Application Form */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Users className="h-5 w-5 text-green-600" />
                  <span>Apply for Reseller Program</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input
                        id="firstName"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input
                        id="lastName"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="company">Company Name</Label>
                    <Input
                      id="company"
                      name="company"
                      value={formData.company}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="website">Website (Optional)</Label>
                    <Input
                      id="website"
                      name="website"
                      type="url"
                      value={formData.website}
                      onChange={handleInputChange}
                      placeholder="https://yourwebsite.com"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="experience">Experience with ID Cards</Label>
                    <select
                      id="experience"
                      name="experience"
                      value={formData.experience}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                      required
                    >
                      <option value="">Select experience level</option>
                      <option value="none">No experience</option>
                      <option value="some">Some experience</option>
                      <option value="experienced">Very experienced</option>
                      <option value="expert">Expert level</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="expectedVolume">Expected Monthly Volume</Label>
                    <select
                      id="expectedVolume"
                      name="expectedVolume"
                      value={formData.expectedVolume}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                      required
                    >
                      <option value="">Select expected volume</option>
                      <option value="10-25">10-25 orders</option>
                      <option value="25-50">25-50 orders</option>
                      <option value="50-100">50-100 orders</option>
                      <option value="100+">100+ orders</option>
                    </select>
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full bg-green-600 hover:bg-green-700" 
                    size="lg"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Submitting Application...' : 'Submit Application'}
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Requirements & Info */}
          <div className="space-y-8">
            {/* Requirements */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span>Requirements</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {requirements.map((requirement, index) => (
                    <li key={index} className="flex items-center space-x-3">
                      <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                      <span className="text-gray-700">{requirement}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* How It Works */}
            <Card>
              <CardHeader>
                <CardTitle>How It Works</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="bg-green-100 rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0">
                      <span className="text-green-600 font-semibold text-sm">1</span>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">Submit Application</h4>
                      <p className="text-sm text-gray-600">Fill out the application form with your business details.</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <div className="bg-green-100 rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0">
                      <span className="text-green-600 font-semibold text-sm">2</span>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">Complete 10 Orders</h4>
                      <p className="text-sm text-gray-600">Place and complete 10 successful orders to qualify.</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <div className="bg-green-100 rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0">
                      <span className="text-green-600 font-semibold text-sm">3</span>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">Unlock Benefits</h4>
                      <p className="text-sm text-gray-600">Access free shipping, custom codes, and priority support.</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Contact Info */}
            <Card>
              <CardHeader>
                <CardTitle>Questions?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Have questions about our reseller program? We're here to help!
                </p>
                <div className="space-y-2">
                  <p className="text-sm">
                    <span className="font-medium">Email:</span> resellers@idpro.com
                  </p>
                  <p className="text-sm">
                    <span className="font-medium">Response Time:</span> Within 24 hours
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

export default ResellerProgram;