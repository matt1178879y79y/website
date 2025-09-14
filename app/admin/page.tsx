"use client";

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Users, 
  Package, 
  DollarSign, 
  TrendingUp, 
  Search, 
  Filter,
  Eye,
  Edit,
  CheckCircle,
  Clock,
  Truck,
  XCircle,
  AlertTriangle,
  Shield
} from 'lucide-react';
import { db, Order } from '@/lib/database';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

const AdminDashboard = () => {
  const { state: authState } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    processing: 0,
    shipped: 0,
    delivered: 0,
    cancelled: 0,
    totalRevenue: 0,
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check admin access
  useEffect(() => {
    if (!authState.isLoading) {
      if (!authState.isAuthenticated || !authState.user?.isAdmin) {
        toast.error('Access denied. Admin privileges required.');
        router.push('/');
        return;
      }
    }
  }, [authState, router]);

  useEffect(() => {
    if (authState.user?.isAdmin) {
      loadData();
    }
  }, [authState.user?.isAdmin]);

  useEffect(() => {
    filterOrders();
  }, [orders, searchTerm, statusFilter]);

  const loadData = async () => {
    try {
      const [ordersData, statsData] = await Promise.all([
        db.getAllOrders(),
        db.getOrderStats(),
      ]);
      
      setOrders(ordersData);
      setStats(statsData);
    } catch (error) {
      toast.error('Failed to load data');
    } finally {
      setIsLoading(false);
    }
  };

  const filterOrders = () => {
    let filtered = orders;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(order => 
        order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.shippingAddress.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.shippingAddress.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.shippingAddress.city.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(order => order.status === statusFilter);
    }

    setFilteredOrders(filtered);
  };

  const updateOrderStatus = async (orderId: string, newStatus: Order['status']) => {
    try {
      await db.updateOrderStatus(orderId, newStatus);
      await loadData(); // Reload data
      toast.success(`Order status updated to ${newStatus}`);
    } catch (error) {
      toast.error('Failed to update order status');
    }
  };

  const updatePaymentStatus = async (orderId: string, newStatus: Order['paymentStatus']) => {
    try {
      await db.updatePaymentStatus(orderId, newStatus);
      await loadData(); // Reload data
      toast.success(`Payment status updated to ${newStatus}`);
    } catch (error) {
      toast.error('Failed to update payment status');
    }
  };

  const getStatusIcon = (status: Order['status']) => {
    switch (status) {
      case 'pending': return <Clock className="h-4 w-4 text-yellow-600" />;
      case 'processing': return <AlertTriangle className="h-4 w-4 text-blue-600" />;
      case 'shipped': return <Truck className="h-4 w-4 text-purple-600" />;
      case 'delivered': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'cancelled': return <XCircle className="h-4 w-4 text-red-600" />;
      default: return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'processing': return 'bg-blue-100 text-blue-800';
      case 'shipped': return 'bg-purple-100 text-purple-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Show loading or access denied
  if (authState.isLoading || isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  // Access denied
  if (!authState.isAuthenticated || !authState.user?.isAdmin) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="p-8 text-center">
            <Shield className="h-16 w-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-4 text-red-900">Access Denied</h2>
            <p className="text-gray-600 mb-6">
              You don't have permission to access the admin dashboard. Only authorized administrators can view this page.
            </p>
            <Button onClick={() => router.push('/')} className="bg-green-600 hover:bg-green-700">
              Return to Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-gray-600">Manage orders and view analytics</p>
            </div>
            <div className="flex items-center space-x-2">
              <Badge className="bg-purple-600">Admin Access</Badge>
              <Badge variant="outline">{authState.user?.email}</Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Orders</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                </div>
                <Package className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Pending Orders</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.pending}</p>
                </div>
                <Clock className="h-8 w-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Delivered</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.delivered}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                  <p className="text-2xl font-bold text-gray-900">${stats.totalRevenue.toFixed(2)}</p>
                </div>
                <DollarSign className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search by order number, customer name, or city..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="w-full sm:w-48">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Orders</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="processing">Processing</SelectItem>
                    <SelectItem value="shipped">Shipped</SelectItem>
                    <SelectItem value="delivered">Delivered</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Orders Table */}
        <Card>
          <CardHeader>
            <CardTitle>Orders ({filteredOrders.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Order</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Customer</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Items</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Total</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Status</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Payment</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Date</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.map((order) => (
                    <tr key={order.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <div>
                          <p className="font-medium text-gray-900">{order.orderNumber}</p>
                          <p className="text-sm text-gray-600">{order.id}</p>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div>
                          <p className="font-medium text-gray-900">
                            {order.shippingAddress.firstName} {order.shippingAddress.lastName}
                          </p>
                          <p className="text-sm text-gray-600">
                            {order.shippingAddress.city}, {order.shippingAddress.state}
                          </p>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <p className="text-sm text-gray-900">{order.items.length} item(s)</p>
                        <p className="text-xs text-gray-600">
                          {order.items.reduce((sum, item) => sum + item.quantity, 0)} total IDs
                        </p>
                      </td>
                      <td className="py-3 px-4">
                        <p className="font-medium text-gray-900">${order.totalAmount.toFixed(2)}</p>
                        <p className="text-xs text-gray-600">{order.paymentMethod.toUpperCase()}</p>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center space-x-2">
                          {getStatusIcon(order.status)}
                          <Badge className={getStatusColor(order.status)}>
                            {order.status}
                          </Badge>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <Badge 
                          className={
                            order.paymentStatus === 'confirmed' ? 'bg-green-100 text-green-800' :
                            order.paymentStatus === 'failed' ? 'bg-red-100 text-red-800' :
                            'bg-yellow-100 text-yellow-800'
                          }
                        >
                          {order.paymentStatus}
                        </Badge>
                      </td>
                      <td className="py-3 px-4">
                        <p className="text-sm text-gray-900">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </p>
                        <p className="text-xs text-gray-600">
                          {new Date(order.createdAt).toLocaleTimeString()}
                        </p>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setSelectedOrder(order)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Select
                            value={order.status}
                            onValueChange={(value) => updateOrderStatus(order.id, value as Order['status'])}
                          >
                            <SelectTrigger className="w-32">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="pending">Pending</SelectItem>
                              <SelectItem value="processing">Processing</SelectItem>
                              <SelectItem value="shipped">Shipped</SelectItem>
                              <SelectItem value="delivered">Delivered</SelectItem>
                              <SelectItem value="cancelled">Cancelled</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              
              {filteredOrders.length === 0 && (
                <div className="text-center py-8">
                  <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No orders found</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Order Detail Modal */}
        {selectedOrder && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold">Order Details</h2>
                  <Button variant="outline" onClick={() => setSelectedOrder(null)}>
                    Close
                  </Button>
                </div>
              </div>
              
              <div className="p-6 space-y-6">
                {/* Order Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Order Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <p><strong>Order Number:</strong> {selectedOrder.orderNumber}</p>
                      <p><strong>Status:</strong> {selectedOrder.status}</p>
                      <p><strong>Payment Status:</strong> {selectedOrder.paymentStatus}</p>
                      <p><strong>Payment Method:</strong> {selectedOrder.paymentMethod.toUpperCase()}</p>
                      <p><strong>Total Amount:</strong> ${selectedOrder.totalAmount.toFixed(2)}</p>
                      <p><strong>Created:</strong> {new Date(selectedOrder.createdAt).toLocaleString()}</p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Shipping Address</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <p><strong>Name:</strong> {selectedOrder.shippingAddress.firstName} {selectedOrder.shippingAddress.lastName}</p>
                      <p><strong>Address:</strong> {selectedOrder.shippingAddress.street}</p>
                      <p><strong>City:</strong> {selectedOrder.shippingAddress.city}</p>
                      <p><strong>State:</strong> {selectedOrder.shippingAddress.state}</p>
                      <p><strong>ZIP:</strong> {selectedOrder.shippingAddress.zipCode}</p>
                      <p><strong>Country:</strong> {selectedOrder.shippingAddress.country}</p>
                    </CardContent>
                  </Card>
                </div>

                {/* Order Items */}
                <Card>
                  <CardHeader>
                    <CardTitle>Order Items</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {selectedOrder.items.map((item, index) => (
                        <div key={index} className="border rounded-lg p-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <h4 className="font-semibold">ID Information</h4>
                              <p><strong>Type:</strong> {item.idType === 'regular' ? 'Regular ID' : item.idType === 'polycard' ? 'Polycard' : 'NY v4 Polycard'}</p>
                              <p><strong>State:</strong> {item.state}</p>
                              <p><strong>Country:</strong> {item.country}</p>
                              <p><strong>Quantity:</strong> {item.quantity} IDs</p>
                              <p><strong>Additional Duplicates:</strong> {item.additionalDuplicates}</p>
                              <p><strong>Price:</strong> ${item.price.toFixed(2)}</p>
                            </div>
                            <div>
                              <h4 className="font-semibold">Personal Information</h4>
                              <p><strong>Name:</strong> {item.personalInfo.firstName} {item.personalInfo.middleName} {item.personalInfo.lastName}</p>
                              <p><strong>DOB:</strong> {item.personalInfo.dateOfBirth}</p>
                              <p><strong>Sex:</strong> {item.personalInfo.sex}</p>
                              <p><strong>Height:</strong> {item.personalInfo.height}</p>
                              <p><strong>Weight:</strong> {item.personalInfo.weight}</p>
                              <p><strong>Eye Color:</strong> {item.personalInfo.eyeColor}</p>
                              <p><strong>Hair Color:</strong> {item.personalInfo.hairColor}</p>
                              <p><strong>Address:</strong> {item.personalInfo.streetAddress}, {item.personalInfo.city}, {item.personalInfo.zipCode}</p>
                              <p><strong>Issue Date:</strong> {item.personalInfo.issueDate}</p>
                              <p><strong>Glasses:</strong> {item.personalInfo.wearsGlasses ? 'Yes' : 'No'}</p>
                              <p><strong>Organ Donor:</strong> {item.personalInfo.organDonor ? 'Yes' : 'No'}</p>
                            </div>
                          </div>
                          {item.uploads && (
                            <div className="mt-4">
                              <h4 className="font-semibold">Uploads</h4>
                              <p><strong>Photo:</strong> {item.uploads.photo || 'Not uploaded'}</p>
                              <p><strong>Signature:</strong> {item.uploads.signature || 'Not uploaded'}</p>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Admin Actions */}
                <Card>
                  <CardHeader>
                    <CardTitle>Admin Actions</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Update Order Status</label>
                        <Select
                          value={selectedOrder.status}
                          onValueChange={(value) => updateOrderStatus(selectedOrder.id, value as Order['status'])}
                        >
                          <SelectTrigger className="w-48">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="processing">Processing</SelectItem>
                            <SelectItem value="shipped">Shipped</SelectItem>
                            <SelectItem value="delivered">Delivered</SelectItem>
                            <SelectItem value="cancelled">Cancelled</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium mb-2">Update Payment Status</label>
                        <Select
                          value={selectedOrder.paymentStatus}
                          onValueChange={(value) => updatePaymentStatus(selectedOrder.id, value as Order['paymentStatus'])}
                        >
                          <SelectTrigger className="w-48">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="confirmed">Confirmed</SelectItem>
                            <SelectItem value="failed">Failed</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;