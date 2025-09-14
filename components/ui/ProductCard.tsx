"use client";

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useCart } from '@/contexts/CartContext';
import { ShoppingCart, Star } from 'lucide-react';
import { toast } from 'sonner';

interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
  description: string;
  isPopular?: boolean;
}

const ProductCard: React.FC<ProductCardProps> = ({
  id,
  name,
  price,
  image,
  category,
  description,
  isPopular = false,
}) => {
  const { dispatch } = useCart();

  const addToCart = () => {
    dispatch({
      type: 'ADD_ITEM',
      payload: {
        id,
        name,
        price,
        image,
        category,
      },
    });
    toast.success('Added to cart!');
  };

  return (
    <Card className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-green-100 relative overflow-hidden">
      {isPopular && (
        <Badge className="absolute top-3 left-3 z-10 bg-green-600 hover:bg-green-700">
          Popular
        </Badge>
      )}
      
      <div className="relative h-48 overflow-hidden">
        <Image
          src={image}
          alt={name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300" />
      </div>

      <CardContent className="p-6 space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Badge variant="outline" className="text-xs text-green-600 border-green-200">
              {category}
            </Badge>
            <div className="flex items-center space-x-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-3 w-3 fill-yellow-400 text-yellow-400" />
              ))}
            </div>
          </div>
          
          <h3 className="font-semibold text-lg text-gray-900 group-hover:text-green-600 transition-colors">
            {name}
          </h3>
          
          <p className="text-sm text-gray-600 line-clamp-2">
            {description}
          </p>
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-2xl font-bold text-green-600">
              ${price.toFixed(2)}
            </p>
            <p className="text-xs text-gray-500">per ID</p>
          </div>
          
          <Button
            onClick={addToCart}
            size="sm"
            className="bg-green-600 hover:bg-green-700"
          >
            <ShoppingCart className="h-4 w-4 mr-2" />
            Add to Cart
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductCard;