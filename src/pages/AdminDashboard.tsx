import React, { useEffect, useState } from 'react';
import { Package, Search, X } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { ShippingRequest } from '../types';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

export default function AdminDashboard() {
  const [requests, setRequests] = useState<ShippingRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<string>('all');

  useEffect(() => {
    fetchRequests();
  }, []);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      console.log('Current session:', session);
      console.log('Is admin email:', session?.user?.email === 'saatviktiwari@gmail.com');
    };
    
    checkAuth();
  }, []);

  const fetchRequests = async () => {
    try {
      const { data, error } = await supabase
        .from('shipping_requests')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setRequests(data || []);
    } catch (error) {
      toast.error('Failed to fetch requests');
    } finally {
      setLoading(false);
    }
  };

  const handleQuotation = async (requestId: string, amount: number) => {
    try {
      // Get current session
      const { data: { session } } = await supabase.auth.getSession();
      
      // Debug log
      console.log('Current session:', {
        email: session?.user?.email,
        isAdmin: session?.user?.email === 'saatviktiwari@gmail.com'
      });

      if (!session?.user?.email || session.user.email !== 'saatviktiwari@gmail.com') {
        throw new Error('Unauthorized: Admin access required');
      }

      // Proceed with update
      const { data, error } = await supabase
        .from('shipping_requests')
        .update({
          status: 'QUOTATION_RECEIVED',
          quotation_amount: amount,
          quotation_date: new Date().toISOString()
        })
        .eq('id', requestId)
        .select();

      if (error) {
        console.error('Update error:', error);
        throw error;
      }

      toast.success('Quotation provided successfully');
      fetchRequests();
    } catch (error) {
      console.error('Failed to provide quotation:', error);
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error('Failed to update quotation');
      }
    }
  };

  const handleDeleteRequest = async (requestId: string) => {
    try {
      if (!confirm('Are you sure you want to delete this request?')) return;

      // Debug log
      console.log('Attempting to delete request:', requestId);

      const { error } = await supabase
        .from('shipping_requests')
        .delete()
        .eq('id', requestId);

      if (error) {
        console.error('Delete error:', error);
        throw error;
      }

      toast.success('Request deleted successfully');
      fetchRequests();
    } catch (error) {
      console.error('Failed to delete request:', error);
      toast.error('Failed to delete request');
    }
  };

  const filteredRequests = requests.filter((request) => {
    const matchesSearch =
      request.pickup_address.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.delivery_address.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.package_details.description.toLowerCase().includes(searchTerm.toLowerCase());

    if (filter === 'all') return matchesSearch;
    return matchesSearch && request.status === filter;
  });

  useEffect(() => {
    const checkAdminStatus = async () => {
      const { data: adminCheck, error } = await supabase
        .from('admin_users')
        .select('*')
        .single();
      
      console.log('Admin check:', {
        isAdmin: !!adminCheck,
        error,
        adminData: adminCheck
      });
    };
    
    checkAdminStatus();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search requests..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="border border-gray-300 rounded-md px-4 py-2 focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="all">All Requests</option>
            <option value="WAITING_FOR_QUOTATION">Waiting for Quotation</option>
            <option value="QUOTATION_RECEIVED">Quotation Provided</option>
            <option value="ACCEPTED">Accepted</option>
            <option value="REJECTED">Rejected</option>
          </select>
        </div>
      </div>

      {filteredRequests.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm p-6 text-center">
          <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No requests found</h3>
          <p className="text-gray-500">Try adjusting your search or filter criteria</p>
        </div>
      ) : (
        <div className="bg-white shadow-sm rounded-lg divide-y divide-gray-200">
          {filteredRequests.map((request) => (
            <div key={request.id} className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                        ${
                          request.status === 'WAITING_FOR_QUOTATION'
                            ? 'bg-yellow-100 text-yellow-800'
                            : request.status === 'QUOTATION_RECEIVED'
                            ? 'bg-blue-100 text-blue-800'
                            : request.status === 'ACCEPTED'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                    >
                      {request.status.replace(/_/g, ' ')}
                    </span>
                    <button
                      onClick={() => handleDeleteRequest(request.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                  <p className="text-sm text-gray-500">
                    Created on {format(new Date(request.created_at), 'MMM d, yyyy')}
                  </p>
                </div>
                {request.status === 'WAITING_FOR_QUOTATION' && (
                  <div className="flex items-center space-x-2">
                    <input
                      type="number"
                      id={`quotation-${request.id}`}
                      placeholder="Amount"
                      className="w-32 px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                      min="0"
                      step="0.01"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          const input = e.target as HTMLInputElement;
                          const amount = parseFloat(input.value);
                          if (amount > 0) {
                            handleQuotation(request.id, amount);
                            input.value = '';
                          }
                        }
                      }}
                    />
                    <button
                      onClick={() => {
                        const input = document.getElementById(`quotation-${request.id}`) as HTMLInputElement;
                        const amount = parseFloat(input.value);
                        if (amount > 0) {
                          handleQuotation(request.id, amount);
                          input.value = '';
                        } else {
                          toast.error('Please enter a valid amount');
                        }
                      }}
                      className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      Provide Quote
                    </button>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">Pickup Address</p>
                  <p className="mt-1 text-sm text-gray-900">{request.pickup_address}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Delivery Address</p>
                  <p className="mt-1 text-sm text-gray-900">{request.delivery_address}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">Package Details</p>
                  <p className="mt-1 text-sm text-gray-900">
                    {request.package_details.weight}kg, {request.package_details.dimensions.length}x
                    {request.package_details.dimensions.width}x{request.package_details.dimensions.height}
                    cm
                  </p>
                  <p className="mt-1 text-sm text-gray-900">{request.package_details.description}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Preferred Dates</p>
                  <p className="mt-1 text-sm text-gray-900">
                    Pickup: {format(new Date(request.preferred_pickup_date), 'MMM d, yyyy')}
                  </p>
                  <p className="mt-1 text-sm text-gray-900">
                    Delivery: {format(new Date(request.preferred_delivery_date), 'MMM d, yyyy')}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}