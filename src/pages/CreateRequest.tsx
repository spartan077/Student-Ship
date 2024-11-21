import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Package } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

export default function CreateRequest() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    pickup_address: '',
    delivery_address: '',
    weight: '',
    length: '',
    width: '',
    height: '',
    description: '',
    preferred_pickup_date: '',
    preferred_delivery_date: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.from('shipping_requests').insert({
        user_id: user?.id,
        pickup_address: formData.pickup_address,
        delivery_address: formData.delivery_address,
        package_details: {
          weight: parseFloat(formData.weight),
          dimensions: {
            length: parseFloat(formData.length),
            width: parseFloat(formData.width),
            height: parseFloat(formData.height),
          },
          description: formData.description,
        },
        preferred_pickup_date: formData.preferred_pickup_date,
        preferred_delivery_date: formData.preferred_delivery_date,
      });

      if (error) throw error;

      toast.success('Shipping request created successfully!');
      navigate('/requests');
    } catch (error) {
      toast.error('Failed to create shipping request. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white p-8 rounded-lg shadow-sm">
        <div className="flex items-center mb-6">
          <Package className="h-8 w-8 text-indigo-600 mr-3" />
          <h1 className="text-2xl font-bold text-gray-900">Create Shipping Request</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 gap-6">
            <div>
              <label htmlFor="pickup_address" className="block text-sm font-medium text-gray-700">
                Pickup Address
              </label>
              <textarea
                id="pickup_address"
                name="pickup_address"
                required
                value={formData.pickup_address}
                onChange={handleChange}
                rows={3}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
              />
            </div>

            <div>
              <label htmlFor="delivery_address" className="block text-sm font-medium text-gray-700">
                Delivery Address
              </label>
              <textarea
                id="delivery_address"
                name="delivery_address"
                required
                value={formData.delivery_address}
                onChange={handleChange}
                rows={3}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="weight" className="block text-sm font-medium text-gray-700">
                  Weight (kg)
                </label>
                <input
                  type="number"
                  id="weight"
                  name="weight"
                  required
                  min="0"
                  step="0.1"
                  value={formData.weight}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
                />
              </div>

              <div>
                <label htmlFor="dimensions" className="block text-sm font-medium text-gray-700">
                  Dimensions (cm)
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <input
                    type="number"
                    name="length"
                    placeholder="L"
                    required
                    min="0"
                    value={formData.length}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
                  />
                  <input
                    type="number"
                    name="width"
                    placeholder="W"
                    required
                    min="0"
                    value={formData.width}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
                  />
                  <input
                    type="number"
                    name="height"
                    placeholder="H"
                    required
                    min="0"
                    value={formData.height}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
                  />
                </div>
              </div>
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                Package Description
              </label>
              <textarea
                id="description"
                name="description"
                required
                value={formData.description}
                onChange={handleChange}
                rows={3}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="preferred_pickup_date" className="block text-sm font-medium text-gray-700">
                  Preferred Pickup Date
                </label>
                <input
                  type="date"
                  id="preferred_pickup_date"
                  name="preferred_pickup_date"
                  required
                  value={formData.preferred_pickup_date}
                  onChange={handleChange}
                  min={new Date().toISOString().split('T')[0]}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
                />
              </div>

              <div>
                <label htmlFor="preferred_delivery_date" className="block text-sm font-medium text-gray-700">
                  Preferred Delivery Date
                </label>
                <input
                  type="date"
                  id="preferred_delivery_date"
                  name="preferred_delivery_date"
                  required
                  value={formData.preferred_delivery_date}
                  onChange={handleChange}
                  min={formData.preferred_pickup_date || new Date().toISOString().split('T')[0]}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            {loading ? 'Creating Request...' : 'Create Request'}
          </button>
        </form>
      </div>
    </div>
  );
}