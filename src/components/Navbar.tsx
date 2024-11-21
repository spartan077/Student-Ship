import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Package, LogOut } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

export default function Navbar() {
  const navigate = useNavigate();
  const { user, isAdmin } = useAuth();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  return (
    <nav className="bg-indigo-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <Package className="h-8 w-8 text-white" />
              <span className="ml-2 text-white text-xl font-bold">StudentShip</span>
            </Link>
          </div>
          
          {user ? (
            <div className="flex items-center space-x-4">
              <Link to="/requests" className="text-white hover:text-indigo-100">
                My Requests
              </Link>
              {isAdmin && (
                <Link to="/admin" className="text-white hover:text-indigo-100">
                  Admin Dashboard
                </Link>
              )}
              <button
                onClick={handleLogout}
                className="flex items-center text-white hover:text-indigo-100"
              >
                <LogOut className="h-5 w-5 mr-1" />
                Logout
              </button>
            </div>
          ) : (
            <div className="flex items-center space-x-4">
              <Link
                to="/login"
                className="text-white hover:text-indigo-100"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="bg-white text-indigo-600 px-4 py-2 rounded-md hover:bg-indigo-50"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}