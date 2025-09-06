import React, { useState, useEffect } from 'react';
import { Leaf, Home, Plus, List, ShoppingCart, History, User, LogOut } from 'lucide-react';
import { Button } from './ui/button';
import { ProductFeed } from './ProductFeed';
import { AddProduct } from './AddProduct';
import { MyListings } from './MyListings';
import { Cart } from './Cart';
import { PurchaseHistory } from './PurchaseHistory';
import { UserDashboard } from './UserDashboard';
import { ProductDetail } from './ProductDetail';
import { toast } from 'sonner@2.0.3';
import { projectId, publicAnonKey } from '../utils/supabase/info';

interface MainAppProps {
  supabase: any;
  session: any;
}

export function MainApp({ supabase, session }: MainAppProps) {
  const [currentView, setCurrentView] = useState('feed');
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    fetchUserProfile();
    fetchCartCount();
  }, [session]);

  const fetchUserProfile = async () => {
    try {
      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-213a9f17/profile`, {
        headers: {
          'Authorization': `Bearer ${session.access_token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setUserProfile(data.profile);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const fetchCartCount = async () => {
    try {
      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-213a9f17/cart`, {
        headers: {
          'Authorization': `Bearer ${session.access_token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setCartCount(data.cartItems.length);
      }
    } catch (error) {
      console.error('Error fetching cart count:', error);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    toast.success('Signed out successfully');
  };

  const handleViewProduct = (product: any) => {
    setSelectedProduct(product);
    setCurrentView('product-detail');
  };

  const handleEditProduct = (product: any) => {
    setEditingProduct(product);
    setCurrentView('add-product');
  };

  const handleProductAdded = () => {
    setCurrentView('my-listings');
    setEditingProduct(null);
    toast.success('Product saved successfully!');
  };

  const handleAddToCart = () => {
    fetchCartCount();
    toast.success('Added to cart!');
  };

  const handleCartUpdated = () => {
    fetchCartCount();
  };

  const handleProfileUpdated = () => {
    fetchUserProfile();
  };

  const renderContent = () => {
    switch (currentView) {
      case 'feed':
        return <ProductFeed onViewProduct={handleViewProduct} onAddToCart={handleAddToCart} session={session} />;
      case 'add-product':
        return <AddProduct onProductAdded={handleProductAdded} session={session} editingProduct={editingProduct} />;
      case 'my-listings':
        return <MyListings onViewProduct={handleViewProduct} onEditProduct={handleEditProduct} session={session} />;
      case 'cart':
        return <Cart onCartUpdated={handleCartUpdated} session={session} />;
      case 'history':
        return <PurchaseHistory session={session} />;
      case 'profile':
        return <UserDashboard userProfile={userProfile} onProfileUpdated={handleProfileUpdated} session={session} />;
      case 'product-detail':
        return <ProductDetail product={selectedProduct} onAddToCart={handleAddToCart} session={session} />;
      default:
        return <ProductFeed onViewProduct={handleViewProduct} onAddToCart={handleAddToCart} session={session} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <div className="flex items-center">
                <div className="bg-green-600 rounded-full p-2">
                  <Leaf className="h-6 w-6 text-white" />
                </div>
                <span className="ml-2 text-xl font-bold text-green-800">EcoFinds</span>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                Welcome, {userProfile?.username || 'User'}!
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={handleSignOut}
                className="text-red-600 border-red-600 hover:bg-red-50"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar Navigation */}
        <nav className="w-64 bg-white shadow-sm min-h-screen">
          <div className="p-4">
            <div className="space-y-2">
              <Button
                variant={currentView === 'feed' ? 'default' : 'ghost'}
                className={`w-full justify-start ${currentView === 'feed' ? 'bg-green-600 hover:bg-green-700' : ''}`}
                onClick={() => setCurrentView('feed')}
              >
                <Home className="mr-2 h-4 w-4" />
                Browse Products
              </Button>

              <Button
                variant={currentView === 'add-product' ? 'default' : 'ghost'}
                className={`w-full justify-start ${currentView === 'add-product' ? 'bg-green-600 hover:bg-green-700' : ''}`}
                onClick={() => {
                  setEditingProduct(null);
                  setCurrentView('add-product');
                }}
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Product
              </Button>

              <Button
                variant={currentView === 'my-listings' ? 'default' : 'ghost'}
                className={`w-full justify-start ${currentView === 'my-listings' ? 'bg-green-600 hover:bg-green-700' : ''}`}
                onClick={() => setCurrentView('my-listings')}
              >
                <List className="mr-2 h-4 w-4" />
                My Listings
              </Button>

              <Button
                variant={currentView === 'cart' ? 'default' : 'ghost'}
                className={`w-full justify-start ${currentView === 'cart' ? 'bg-green-600 hover:bg-green-700' : ''}`}
                onClick={() => setCurrentView('cart')}
              >
                <ShoppingCart className="mr-2 h-4 w-4" />
                Cart {cartCount > 0 && <span className="ml-2 bg-green-500 text-white rounded-full px-2 py-1 text-xs">{cartCount}</span>}
              </Button>

              <Button
                variant={currentView === 'history' ? 'default' : 'ghost'}
                className={`w-full justify-start ${currentView === 'history' ? 'bg-green-600 hover:bg-green-700' : ''}`}
                onClick={() => setCurrentView('history')}
              >
                <History className="mr-2 h-4 w-4" />
                Purchase History
              </Button>

              <Button
                variant={currentView === 'profile' ? 'default' : 'ghost'}
                className={`w-full justify-start ${currentView === 'profile' ? 'bg-green-600 hover:bg-green-700' : ''}`}
                onClick={() => setCurrentView('profile')}
              >
                <User className="mr-2 h-4 w-4" />
                Profile
              </Button>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <main className="flex-1 p-6">
          {renderContent()}
        </main>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t mt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <div className="bg-green-600 rounded-full p-1">
                <Leaf className="h-4 w-4 text-white" />
              </div>
              <span className="text-lg font-bold text-green-800">EcoFinds</span>
            </div>
            <div className="text-center md:text-right">
              <p className="text-gray-600 text-sm">
                © 2025 EcoFinds. All rights reserved.
              </p>
              <p className="text-gray-500 text-xs mt-1">
                Owned by <span className="font-medium text-green-600">Tharun P</span>
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}