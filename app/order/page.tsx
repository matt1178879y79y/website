"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import { 
  LogIn,
  User,
  CreditCard,
  MapPin,
  Calendar,
  Eye,
  Palette,
  Ruler,
  Weight,
  Home,
  ShoppingCart,
  AlertTriangle,
  Info
} from 'lucide-react';
import { toast } from 'sonner';

const OrderForm = () => {
  const { state: authState } = useAuth();
  const { dispatch } = useCart();
  const router = useRouter();

  // Order data state
  const [orderData, setOrderData] = useState({
    idType: '',
    state: '',
    country: 'USA',
    quantity: 1,
    additionalDuplicates: 0,
  });

  // Personal info state (from OrderItem interface)
  const [personalInfo, setPersonalInfo] = useState({
    firstName: '',
    middleName: '',
    lastName: '',
    sex: '',
    eyeColor: '',
    hairColor: '',
    height: '',
    dateOfBirth: '',
    weight: '',
    streetAddress: '',
    city: '',
    zipCode: '',
    issueDate: '',
    wearsGlasses: false,
    organDonor: false,
  });

  // File uploads state
  const [uploads, setUploads] = useState({
    photo: null as File | null,
    signature: null as File | null,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  // US States list
  const states = [
    'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware',
    'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky',
    'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi',
    'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico',
    'New York', 'North Carolina', 'North Dakota', 'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania',
    'Rhode Island', 'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont',
    'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'
  ];

  // Eye colors
  const eyeColors = ['Brown', 'Blue', 'Green', 'Hazel', 'Gray', 'Amber'];
  
  // Hair colors
  const hairColors = ['Black', 'Brown', 'Blonde', 'Red', 'Gray', 'White', 'Bald'];

  // Sex options
  const sexOptions = ['Male', 'Female'];

  // Calculate pricing based on type and quantity
  const calculatePrice = () => {
    const totalQuantity = orderData.quantity + orderData.additionalDuplicates;
    let basePrice = 0;

    if (orderData.idType === 'regular') {
      basePrice = totalQuantity < 3 ? 180 : 90;
    } else if (orderData.idType === 'polycard') {
      if (totalQuantity < 3) {
        basePrice = 245;
      } else if (totalQuantity < 6) {
        basePrice = 210;
      } else {
        basePrice = 160;
      }
    }

    return {
      pricePerItem: basePrice,
      totalPrice: basePrice * totalQuantity,
      totalQuantity,
    };
  };

  const pricing = calculatePrice();

  // Redirect to sign in if not authenticated
  useEffect(() => {
    if (!authState.isLoading && !authState.isAuthenticated) {
      router.push('/auth/signin?redirect=/order');
    }
  }, [authState.isLoading, authState.isAuthenticated, router]);

  const handleOrderDataChange = (field: string, value: any) => {
    setOrderData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handlePersonalInfoChange = (field: string, value: any) => {
    setPersonalInfo(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleFileUpload = (field: 'photo' | 'signature', file: File | null) => {
    setUploads(prev => ({
      ...prev,
      [field]: file,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!orderData.idType || !orderData.state) {
      toast.error('Please select ID type and state');
      return;
    }

    if (!personalInfo.firstName || !personalInfo.lastName || !personalInfo.dateOfBirth) {
      toast.error('Please fill in required personal information');
      return;
    }

    setIsSubmitting(true);

    try {
      // Create cart item
      const cartItem = {
        id: 'order_' + Date.now(),
        name: `${orderData.idType === 'regular' ? 'Regular ID' : 'Polycard'} - ${orderData.state}`,
        price: pricing.totalPrice,
        image: '/placeholder-id.jpg',
        category: 'ID Card',
        details: {
          idType: orderData.idType,
          state: orderData.state,
          country: orderData.country,
          totalQuantity: pricing.totalQuantity,
          personalInfo,
          uploads: {
            photo: uploads.photo?.name || null,
            signature: uploads.signature?.name || null,
          },
          additionalDuplicates: orderData.additionalDuplicates,
          pricing,
        },
      };

      // Add to cart
      dispatch({ type: 'ADD_ITEM', payload: cartItem });
      
      toast.success('ID added to cart successfully!');
      
      // Redirect to cart
      setTimeout(() => {
        router.push('/cart');
      }, 1000);

    } catch (error) {
      toast.error('Failed to add item to cart');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Show loading while checking authentication
  if (authState.isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Show sign in prompt if not authenticated
  if (!authState.isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="p-8 text-center">
            <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
              <LogIn className="h-8 w-8 text-green-600" />
            </div>
            <h2 className="text-xl font-semibold mb-4">Sign In Required</h2>
            <p className="text-gray-600 mb-6">
              Please sign in to your account to place an order.
            </p>
            <div className="flex flex-col gap-4">
              <Link href="/auth/signin?redirect=/order">
                <Button className="w-full bg-green-600 hover:bg-green-700">
                  <LogIn className="mr-2 h-4 w-4" />
                  Sign In
                </Button>
              </Link>
              <Link href="/auth/signup?redirect=/order">
                <Button variant="outline" className="w-full">
                  Create Account
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900">Create Your ID</h1>
            <p className="text-gray-600 mt-2">Fill out the form below to order your professional ID</p>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* ID Type Selection */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <CreditCard className="h-5 w-5 text-green-600" />
                <span>ID Type & Location</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* ID Type */}
              <div className="space-y-3">
                <Label>ID Type *</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div
                    className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                      orderData.idType === 'regular' ? 'border-green-500 bg-green-50' : 'border-gray-200 hover:border-green-300'
                    }`}
                    onClick={() => handleOrderDataChange('idType', 'regular')}
                  >
                    <div className="text-center">
                      <h3 className="font-semibold">Regular ID</h3>
                      <p className="text-2xl font-bold text-green-600 mt-2">$90</p>
                      <p className="text-sm text-gray-600 mt-1">Base price (includes 1 duplicate)</p>
                      <Badge variant="outline" className="mt-2">Most Popular</Badge>
                    </div>
                  </div>

                  <div
                    className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                      orderData.idType === 'polycard' ? 'border-green-500 bg-green-50' : 'border-gray-200 hover:border-green-300'
                    }`}
                    onClick={() => handleOrderDataChange('idType', 'polycard')}
                  >
                    <div className="text-center">
                      <h3 className="font-semibold">Polycard</h3>
                      <p className="text-2xl font-bold text-green-600 mt-2">$160</p>
                      <p className="text-sm text-gray-600 mt-1">Premium polycarbonate (includes 1 duplicate)</p>
                      <Badge className="bg-green-600 mt-2">Premium</Badge>
                    </div>
                  </div>
                </div>
              </div>

              {/* State Selection */}
              <div className="space-y-3">
                <Label htmlFor="state">State *</Label>
                <Select value={orderData.state} onValueChange={(value) => handleOrderDataChange('state', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a state" />
                  </SelectTrigger>
                  <SelectContent>
                    {states.map((state) => (
                      <SelectItem key={state} value={state}>
                        {state}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Country */}
              <div className="space-y-3">
                <Label htmlFor="country">Country</Label>
                <Input
                  id="country"
                  value={orderData.country}
                  onChange={(e) => handleOrderDataChange('country', e.target.value)}
                  readOnly
                  className="bg-gray-50"
                />
              </div>

              {/* Quantity */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <Label htmlFor="quantity">Base Quantity (includes 1 duplicate)</Label>
                  <Input
                    id="quantity"
                    type="number"
                    min="1"
                    value={orderData.quantity}
                    onChange={(e) => handleOrderDataChange('quantity', parseInt(e.target.value) || 1)}
                  />
                </div>
                <div className="space-y-3">
                  <Label htmlFor="additionalDuplicates">Additional Duplicates</Label>
                  <Input
                    id="additionalDuplicates"
                    type="number"
                    min="0"
                    value={orderData.additionalDuplicates}
                    onChange={(e) => handleOrderDataChange('additionalDuplicates', parseInt(e.target.value) || 0)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Personal Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <User className="h-5 w-5 text-green-600" />
                <span>Personal Information</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Name */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name *</Label>
                  <Input
                    id="firstName"
                    value={personalInfo.firstName}
                    onChange={(e) => handlePersonalInfoChange('firstName', e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="middleName">Middle Name</Label>
                  <Input
                    id="middleName"
                    value={personalInfo.middleName}
                    onChange={(e) => handlePersonalInfoChange('middleName', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name *</Label>
                  <Input
                    id="lastName"
                    value={personalInfo.lastName}
                    onChange={(e) => handlePersonalInfoChange('lastName', e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Basic Info */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="sex">Sex *</Label>
                  <Select value={personalInfo.sex} onValueChange={(value) => handlePersonalInfoChange('sex', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select sex" />
                    </SelectTrigger>
                    <SelectContent>
                      {sexOptions.map((sex) => (
                        <SelectItem key={sex} value={sex}>
                          {sex}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dateOfBirth">Date of Birth *</Label>
                  <Input
                    id="dateOfBirth"
                    type="date"
                    value={personalInfo.dateOfBirth}
                    onChange={(e) => handlePersonalInfoChange('dateOfBirth', e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="issueDate">Issue Date</Label>
                  <Input
                    id="issueDate"
                    type="date"
                    value={personalInfo.issueDate}
                    onChange={(e) => handlePersonalInfoChange('issueDate', e.target.value)}
                  />
                </div>
              </div>

              {/* Physical Characteristics */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="height">Height</Label>
                  <Input
                    id="height"
                    placeholder="5'10&quot;"
                    value={personalInfo.height}
                    onChange={(e) => handlePersonalInfoChange('height', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="weight">Weight</Label>
                  <Input
                    id="weight"
                    placeholder="150 lbs"
                    value={personalInfo.weight}
                    onChange={(e) => handlePersonalInfoChange('weight', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="eyeColor">Eye Color</Label>
                  <Select value={personalInfo.eyeColor} onValueChange={(value) => handlePersonalInfoChange('eyeColor', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select eye color" />
                    </SelectTrigger>
                    <SelectContent>
                      {eyeColors.map((color) => (
                        <SelectItem key={color} value={color}>
                          {color}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="hairColor">Hair Color</Label>
                  <Select value={personalInfo.hairColor} onValueChange={(value) => handlePersonalInfoChange('hairColor', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select hair color" />
                    </SelectTrigger>
                    <SelectContent>
                      {hairColors.map((color) => (
                        <SelectItem key={color} value={color}>
                          {color}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Address */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="streetAddress">Street Address</Label>
                  <Input
                    id="streetAddress"
                    value={personalInfo.streetAddress}
                    onChange={(e) => handlePersonalInfoChange('streetAddress', e.target.value)}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city">City</Label>
                    <Input
                      id="city"
                      value={personalInfo.city}
                      onChange={(e) => handlePersonalInfoChange('city', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="zipCode">ZIP Code</Label>
                    <Input
                      id="zipCode"
                      value={personalInfo.zipCode}
                      onChange={(e) => handlePersonalInfoChange('zipCode', e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* Checkboxes */}
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="wearsGlasses"
                    checked={personalInfo.wearsGlasses}
                    onCheckedChange={(checked) => handlePersonalInfoChange('wearsGlasses', checked)}
                  />
                  <Label htmlFor="wearsGlasses">Wears Glasses</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="organDonor"
                    checked={personalInfo.organDonor}
                    onCheckedChange={(checked) => handlePersonalInfoChange('organDonor', checked)}
                  />
                  <Label htmlFor="organDonor">Organ Donor</Label>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* File Uploads */}
          <Card>
            <CardHeader>
              <CardTitle>File Uploads</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="photo">Photo</Label>
                  <Input
                    id="photo"
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileUpload('photo', e.target.files?.[0] || null)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signature">Signature</Label>
                  <Input
                    id="signature"
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileUpload('signature', e.target.files?.[0] || null)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Pricing Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span>ID Type:</span>
                  <span className="font-medium">
                    {orderData.idType === 'regular' ? 'Regular ID' : 'Polycard'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>State:</span>
                  <span className="font-medium">{orderData.state || 'Not selected'}</span>
                </div>
                <div className="flex justify-between">
                  <span>Total Quantity:</span>
                  <span className="font-medium">{pricing.totalQuantity} IDs</span>
                </div>
                <div className="flex justify-between">
                  <span>Price per ID:</span>
                  <span className="font-medium">${pricing.pricePerItem}</span>
                </div>
                <div className="border-t pt-3">
                  <div className="flex justify-between text-lg font-semibold">
                    <span>Total:</span>
                    <span>${pricing.totalPrice}</span>
                  </div>
                </div>
              </div>

              {/* Small order warning */}
              {pricing.totalQuantity < 3 && orderData.idType === 'regular' && (
                <Alert className="mt-4 border-yellow-200 bg-yellow-50">
                  <AlertTriangle className="h-4 w-4 text-yellow-600" />
                  <AlertDescription className="text-yellow-800">
                    Small order fee applied: Regular IDs under 3 have doubled pricing ($180 each).
                  </AlertDescription>
                </Alert>
              )}

              {pricing.totalQuantity < 6 && orderData.idType === 'polycard' && (
                <Alert className="mt-4 border-yellow-200 bg-yellow-50">
                  <AlertTriangle className="h-4 w-4 text-yellow-600" />
                  <AlertDescription className="text-yellow-800">
                    Small order pricing: Polycards under 3 are $245 each, under 6 are $210 each.
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>

          {/* Submit Button */}
          <div className="flex justify-center">
            <Button
              type="submit"
              size="lg"
              className="bg-green-600 hover:bg-green-700 px-8"
              disabled={isSubmitting || !orderData.idType || !orderData.state}
            >
              {isSubmitting ? 'Adding to Cart...' : 'Add to Cart'}
              <ShoppingCart className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default OrderForm;