import React from 'react';
import { Link } from 'react-router-dom';
import { Package, Truck, Clock, Shield } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export default function Home() {
  const { user } = useAuth();

  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <div className="relative bg-indigo-800 rounded-3xl overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1596276122653-ae4d3c2d4d2a?auto=format&fit=crop&q=80"
            alt="Students moving"
            className="w-full h-full object-cover opacity-20"
          />
        </div>
        <div className="relative px-8 py-16 sm:px-16 sm:py-24 lg:py-32">
          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
            Ship Your College Essentials
            <br />
            <span className="text-indigo-200">Hassle-Free</span>
          </h1>
          <p className="mt-6 max-w-lg text-xl text-indigo-100 sm:max-w-3xl">
            Easy, secure, and reliable shipping service designed specifically for college students.
            From dorm room to home and back again.
          </p>
          {user ? (
            <Link
              to="/create-request"
              className="mt-8 inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-indigo-700 bg-white hover:bg-indigo-50"
            >
              Create Shipping Request
            </Link>
          ) : (
            <Link
              to="/signup"
              className="mt-8 inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-indigo-700 bg-white hover:bg-indigo-50"
            >
              Get Started
            </Link>
          )}
        </div>
      </div>

      {/* Features */}
      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <Package className="h-12 w-12 text-indigo-600" />
          <h3 className="mt-4 text-lg font-medium text-gray-900">Door-to-Door Service</h3>
          <p className="mt-2 text-gray-500">
            We pick up from your current location and deliver directly to your destination.
          </p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <Truck className="h-12 w-12 text-indigo-600" />
          <h3 className="mt-4 text-lg font-medium text-gray-900">Nationwide Coverage</h3>
          <p className="mt-2 text-gray-500">
            Ship to and from any college campus across the country.
          </p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <Clock className="h-12 w-12 text-indigo-600" />
          <h3 className="mt-4 text-lg font-medium text-gray-900">Flexible Scheduling</h3>
          <p className="mt-2 text-gray-500">
            Choose pickup and delivery times that work best for your schedule.
          </p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <Shield className="h-12 w-12 text-indigo-600" />
          <h3 className="mt-4 text-lg font-medium text-gray-900">Secure Shipping</h3>
          <p className="mt-2 text-gray-500">
            Your belongings are fully insured and tracked throughout transit.
          </p>
        </div>
      </div>

      {/* How It Works */}
      <div className="bg-white rounded-2xl shadow-sm p-8">
        <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
          How It Works
        </h2>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <div className="text-center">
            <div className="bg-indigo-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto">
              <span className="text-2xl font-bold text-indigo-600">1</span>
            </div>
            <h3 className="mt-4 text-lg font-medium text-gray-900">Submit Request</h3>
            <p className="mt-2 text-gray-500">
              Fill out our simple form with your shipping details and requirements.
            </p>
          </div>
          <div className="text-center">
            <div className="bg-indigo-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto">
              <span className="text-2xl font-bold text-indigo-600">2</span>
            </div>
            <h3 className="mt-4 text-lg font-medium text-gray-900">Get Quote</h3>
            <p className="mt-2 text-gray-500">
              Receive a competitive quote based on your shipping needs.
            </p>
          </div>
          <div className="text-center">
            <div className="bg-indigo-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto">
              <span className="text-2xl font-bold text-indigo-600">3</span>
            </div>
            <h3 className="mt-4 text-lg font-medium text-gray-900">Ship & Track</h3>
            <p className="mt-2 text-gray-500">
              Accept the quote and track your shipment every step of the way.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}