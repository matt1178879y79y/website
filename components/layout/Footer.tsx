import React from 'react';
import Link from 'next/link';
import { Hammer, Mail, Phone, MapPin, Bitcoin, Smartphone } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gradient-to-br from-gray-900 to-gray-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-br from-green-600 to-green-700 rounded-xl p-2.5 shadow-lg">
                <Hammer className="h-6 w-6 text-white" />
              </div>
              <div>
                <span className="text-xl font-bold">IDForge</span>
                <p className="text-xs text-green-400">Professional IDs</p>
              </div>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Professional identification solutions with blacklight-reactive features and 
              real polycarbonate materials. Fast, secure shipping worldwide.
            </p>
            <div className="flex space-x-3">
              <div className="bg-gray-800 p-2 rounded-lg hover:bg-gray-700 transition-colors">
                <Bitcoin className="h-4 w-4 text-orange-400" />
              </div>
              <div className="bg-gray-800 p-2 rounded-lg hover:bg-gray-700 transition-colors">
                <Smartphone className="h-4 w-4 text-blue-400" />
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-green-400">Quick Links</h3>
            <ul className="space-y-2">
              {['Order Now', 'Bulk Orders', 'Reseller Program', 'My Orders', 'FAQ'].map((item) => (
                <li key={item}>
                  <Link
                    href={`/${item.toLowerCase().replace(' ', '-')}`}
                    className="text-gray-400 hover:text-white transition-colors text-sm hover:translate-x-1 transform duration-200 inline-block"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ID Types */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-green-400">ID Types</h3>
            <ul className="space-y-2">
              {['Regular IDs ($100)', 'Polycards ($175)', 'NY v4 Polycard ($195)', 'Bulk Discounts', 'Custom Orders'].map((item) => (
                <li key={item}>
                  <Link
                    href="/order"
                    className="text-gray-400 hover:text-white transition-colors text-sm hover:translate-x-1 transform duration-200 inline-block"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact & Payment */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-green-400">Payment & Contact</h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-center space-x-3">
                <Bitcoin className="h-4 w-4 text-orange-400" />
                <span className="text-gray-400">Bitcoin Accepted</span>
              </div>
              <div className="flex items-center space-x-3">
                <Smartphone className="h-4 w-4 text-blue-400" />
                <span className="text-gray-400">Venmo Payments</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="h-4 w-4 text-gray-400" />
                <span className="text-gray-400">support@idforge.com</span>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin className="h-4 w-4 text-gray-400" />
                <span className="text-gray-400">
                  Worldwide Shipping<br />
                  2-3 Weeks Delivery
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © 2024 IDForge. Professional ID solutions worldwide.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link href="/privacy" className="text-gray-400 hover:text-white text-sm transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-gray-400 hover:text-white text-sm transition-colors">
                Terms of Service
              </Link>
              <Link href="/security" className="text-gray-400 hover:text-white text-sm transition-colors">
                Security
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;