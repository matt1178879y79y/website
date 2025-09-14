"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { ShoppingCart, User, Menu, X, Hammer, Bitcoin, LogOut, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { state: cartState } = useCart();
  const { state: authState, logout } = useAuth();

  const navigation = [
    { name: 'Home', href: '/' },
    { name: 'Order Now', href: '/order' },
    { name: 'Bulk Orders', href: '/bulk' },
    { name: 'Reseller Program', href: '/reseller' },
    { name: 'My Orders', href: '/orders' },
  ];

  // Only show admin link for admin users
  const adminNavigation = authState.user?.isAdmin ? [
    ...navigation,
    { name: 'Admin Dashboard', href: '/admin' },
  ] : navigation;

  const currentNavigation = pathname.startsWith('/admin') ? adminNavigation : navigation;

  const isActive = (href: string) => {
    return pathname === href;
  };

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  return (
    <header className="bg-white shadow-lg border-b-2 border-green-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3">
            <div className="bg-gradient-to-br from-green-600 to-green-700 rounded-xl p-2.5 shadow-lg">
              <Hammer className="h-7 w-7 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold text-gray-900">IDForge</span>
              <span className="text-xs text-green-600 font-medium">Professional IDs</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-1">
            {currentNavigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive(item.href)
                    ? 'bg-green-100 text-green-700 shadow-sm'
                    : 'text-gray-700 hover:bg-green-50 hover:text-green-600'
                } ${item.href === '/admin' ? 'text-purple-600 hover:text-purple-700 hover:bg-purple-50' : ''}`}
              >
                {item.name}
                {item.href === '/admin' && (
                  <Badge className="ml-2 bg-purple-600 text-white text-xs">Admin</Badge>
                )}
              </Link>
            ))}
          </nav>

          {/* Right side buttons */}
          <div className="flex items-center space-x-3">
            {/* Payment Methods */}
            <div className="hidden lg:flex items-center space-x-2 text-xs text-gray-600">
              <Bitcoin className="h-4 w-4 text-orange-500" />
              <span>Bitcoin & Venmo</span>
            </div>

            {/* Cart */}
            <Link href="/cart">
              <Button variant="ghost" size="sm" className="relative hover:bg-green-50">
                <ShoppingCart className="h-5 w-5" />
                {cartState.itemCount > 0 && (
                  <Badge
                    className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs bg-green-600 hover:bg-green-700"
                  >
                    {cartState.itemCount}
                  </Badge>
                )}
              </Button>
            </Link>

            {/* Auth section */}
            <div className="hidden md:flex items-center space-x-2">
              {authState.isAuthenticated ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="hover:bg-green-50">
                      <User className="h-4 w-4 mr-2" />
                      {authState.user?.firstName}
                      {authState.user?.isAdmin && (
                        <Badge className="ml-2 bg-purple-600 text-white text-xs">Admin</Badge>
                      )}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel>
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">
                          {authState.user?.firstName} {authState.user?.lastName}
                        </p>
                        <p className="text-xs leading-none text-muted-foreground">
                          {authState.user?.email}
                        </p>
                        {authState.user?.isAdmin && (
                          <Badge className="bg-purple-600 text-white text-xs w-fit">Admin</Badge>
                        )}
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href="/orders">My Orders</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/order">New Order</Link>
                    </DropdownMenuItem>
                    {authState.user?.isAdmin && (
                      <>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild>
                          <Link href="/admin" className="text-purple-600">
                            <Settings className="h-4 w-4 mr-2" />
                            Admin Dashboard
                          </Link>
                        </DropdownMenuItem>
                      </>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                      <LogOut className="h-4 w-4 mr-2" />
                      Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <>
                  <Link href="/auth/signin">
                    <Button variant="ghost" size="sm" className="hover:bg-green-50">
                      <User className="h-4 w-4 mr-2" />
                      Sign In
                    </Button>
                  </Link>
                  <Link href="/auth/signup">
                    <Button size="sm" className="bg-green-600 hover:bg-green-700">Sign Up</Button>
                  </Link>
                </>
              )}
            </div>

            {/* Mobile menu button */}
            <button
              type="button"
              className="md:hidden p-2 rounded-lg hover:bg-green-50"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-green-100 bg-white">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {currentNavigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`block px-3 py-2 rounded-lg text-base font-medium transition-colors ${
                    isActive(item.href)
                      ? 'text-green-700 bg-green-100'
                      : 'text-gray-700 hover:text-green-600 hover:bg-green-50'
                  } ${item.href === '/admin' ? 'text-purple-600 hover:text-purple-700 hover:bg-purple-50' : ''}`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                  {item.href === '/admin' && (
                    <Badge className="ml-2 bg-purple-600 text-white text-xs">Admin</Badge>
                  )}
                </Link>
              ))}
              <div className="border-t border-green-100 pt-4 pb-3">
                {authState.isAuthenticated ? (
                  <div className="space-y-2">
                    <div className="px-3 py-2">
                      <p className="text-sm font-medium text-gray-900">
                        {authState.user?.firstName} {authState.user?.lastName}
                      </p>
                      <p className="text-xs text-gray-500">{authState.user?.email}</p>
                      {authState.user?.isAdmin && (
                        <Badge className="mt-1 bg-purple-600 text-white text-xs">Admin</Badge>
                      )}
                    </div>
                    <Button
                      variant="ghost"
                      className="w-full justify-start text-red-600 hover:bg-red-50"
                      onClick={handleLogout}
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Sign Out
                    </Button>
                  </div>
                ) : (
                  <div className="flex items-center space-x-3">
                    <Link href="/auth/signin" className="flex-1">
                      <Button variant="ghost" className="w-full justify-start hover:bg-green-50">
                        <User className="h-4 w-4 mr-2" />
                        Sign In
                      </Button>
                    </Link>
                    <Link href="/auth/signup" className="flex-1">
                      <Button className="w-full bg-green-600 hover:bg-green-700">Sign Up</Button>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;