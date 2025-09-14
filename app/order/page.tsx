"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import { 
  Calculator, 
  Hammer, 
  LogIn,
  Camera,
  FileText,
  Upload,
  ShoppingCart,
  Plus,
  AlertTriangle,
  Info,
  Bitcoin,
  Smartphone
} from 'lucide-react';
import { toast } from 'sonner';

const OrderForm = () => {
  // ... [rest of the component code remains exactly the same]
};

export default OrderForm;