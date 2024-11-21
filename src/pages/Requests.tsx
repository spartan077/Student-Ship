import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Package, Plus, Check, X } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { ShippingRequest } from '../types';
import { format } from 'date-fns';
import { toast } from 'react-hot-toast';

export default function Requests() {
  const { user } = useAuth();
  const [requests, setRequests] = useState<ShippingRequest[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchRequests = async () => {
    try {
      const { data, error } = await supabase
        .from('shipping_requests')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setRequests(data || []);
    } catch (error) {
      console.error('Error fetching requests:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, [user]);

  const handleQuotationResponse = async (requestId: string, accept: boolean) => {
    try {
      if (!user) {
        toast.error('Please log in to continue');
        return;
      }

      // Debug log
      console.log('Attempting update:', {
        requestId,
        userId: user.id,
        newStatus: accept ? 'ACCEPTED' : 'REJECTED'
      });

      const { data, error } = await supabase
        .from('shipping_requests')
        .update({
          status: accept ? 'ACCEPTED' : 'REJECTED'
        })
        .eq('id', requestId)
        .eq('user_id', user.id) // Ensure user owns the request
        .select()
        .single();

      if (error) {
        console.error('Update error:', error);
        throw error;
      }

      console.log('Update successful:', data);
      toast.success(`Quotation ${accept ? 'accepted' : 'rejected'} successfully`);
      fetchRequests();
    } catch (error) {
      console.error('Failed to update quotation status:', error);
      toast.error('Failed to update quotation status');
    }
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'WAITING_FOR_QUOTATION':
        return 'bg-yellow-100 text-yellow-800';
      case 'QUOTATION_RECEIVED':
        return 'bg-blue-100 text-blue-800';
      case 'ACCEPTED':
        return 'bg-green-100 text-green-800';
      case 'REJECTED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const renderQuotationActions = (request: ShippingRequest) => {
    if (request.status === 'QUOTATION_RECEIVED') {
      return (
        <div className="flex items-center space-x-2 mt-4">
          <button
            onClick={() => handleQuotationResponse(request.id, true)}
            className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            <Check className="h-4 w-4 mr-1" />
            Accept
          </button>
          <button
            onClick={() => handleQuotationResponse(request.id, false)}
            className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            <X className="h-4 w-4 mr-1" />
            Reject
          </button>
        </div>
      );
    }
    return null;
  };

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
        <h1 className="text-2xl font-bold text-gray-900">My Shipping Requests</h1>
        <Link
          to="/create-request"
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <Plus className="h-4 w-4 mr-2" />
          New Request
        </Link>
      </div>

      {requests.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm p-6 text-center">
          <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No shipping requests yet</h3>
          <p className="text-gray-500 mb-4">Create your first shipping request to get started.</p>
          <Link
            to="/create-request"
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <Plus className="h-4 w-4 mr-2" />
            Create Request
          </Link>
        </div>
      ) : (
        <div className="bg-white shadow-sm rounded-lg divide-y divide-gray-200">
          {requests.map((request) => (
            <div key={request.id} className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeColor(request.status)}`}>
                    {request.status.replace(/_/g, ' ')}
                  </span>
                  <p className="mt-1 text-sm text-gray-500">
                    Created on {format(new Date(request.created_at), 'MMM d, yyyy')}
                  </p>
                </div>
                {request.quotation_amount && (
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">Quotation Amount</p>
                    <p className="text-lg font-bold text-indigo-600">${request.quotation_amount}</p>
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
                    {request.package_details.dimensions.width}x{request.package_details.dimensions.height}cm
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
              {renderQuotationActions(request)}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}