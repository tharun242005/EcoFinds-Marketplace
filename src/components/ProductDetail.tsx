import React, { useState } from 'react';
import { ArrowLeft, ShoppingCart, Calendar, User, Tag } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { toast } from 'sonner@2.0.3';
import { projectId, publicAnonKey } from '../utils/supabase/info';

interface ProductDetailProps {
  product: any;
  onAddToCart: () => void;
  session: any;
}

export function ProductDetail({ product, onAddToCart, session }: ProductDetailProps) {
  const [addingToCart, setAddingToCart] = useState(false);

  const handleAddToCart = async () => {
    setAddingToCart(true);
    try {
      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-213a9f17/cart`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`
        },
        body: JSON.stringify({ productId: product.id })
      });

      const data = await response.json();

      if (response.ok) {
        onAddToCart();
      } else {
        throw new Error(data.error || 'Failed to add to cart');
      }
    } catch (error: any) {
      console.error('Error adding to cart:', error);
      toast.error(error.message || 'Failed to add to cart');
    }
    setAddingToCart(false);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (!product) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold text-gray-900">Product not found</h2>
        <p className="text-gray-600 mt-2">The product you're looking for doesn't exist.</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl">
      <div className="mb-6">
        <Button 
          variant="ghost" 
          onClick={() => window.history.back()}
          className="mb-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Products
        </Button>
        
        <div className="grid md:grid-cols-2 gap-8">
          {/* Product Image */}
          <div className="space-y-4">
            <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden shadow-lg">
              {product.image_url ? (
                <img
                  src={product.image_url}
                  alt={product.title}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-8xl">
                  {product.image_placeholder}
                </div>
              )}
            </div>
            {!product.image_url && (
              <p className="text-sm text-gray-500 text-center">
                High-quality photos coming soon!
              </p>
            )}
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                {product.title}
              </h1>
              <div className="flex items-center gap-4 mb-6">
                <span className="text-4xl font-bold text-green-600">
                  {formatPrice(product.price)}
                </span>
                <Badge variant="secondary" className="text-sm">
                  <Tag className="mr-1 h-3 w-3" />
                  {product.category}
                </Badge>
              </div>
            </div>

            <Separator />

            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Description</h3>
              <p className="text-gray-700 leading-relaxed">
                {product.description}
              </p>
            </div>

            <Separator />

            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <Calendar className="h-4 w-4" />
                <span>Listed on {formatDate(product.created_at)}</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <User className="h-4 w-4" />
                <span>Sold by verified seller</span>
              </div>
            </div>

            <Separator />

            <div className="space-y-4">
              <Button
                onClick={handleAddToCart}
                disabled={addingToCart}
                className="w-full bg-green-600 hover:bg-green-700 text-lg py-6"
              >
                {addingToCart ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                    Adding to Cart...
                  </div>
                ) : (
                  <>
                    <ShoppingCart className="mr-2 h-5 w-5" />
                    Add to Cart
                  </>
                )}
              </Button>
              
              <div className="text-center">
                <p className="text-sm text-gray-600">
                  🌱 By purchasing this item, you're supporting sustainable consumption
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Information Card */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="text-lg">Why Choose Second-Hand?</CardTitle>
            <CardDescription>
              Every purchase makes a difference for our planet
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-2xl mb-2">♻️</div>
                <h4 className="font-semibold mb-1">Reduce Waste</h4>
                <p className="text-sm text-gray-600">
                  Give products a second life instead of buying new
                </p>
              </div>
              <div className="text-center">
                <div className="text-2xl mb-2">💰</div>
                <h4 className="font-semibold mb-1">Save Money</h4>
                <p className="text-sm text-gray-600">
                  Get quality items at a fraction of retail price
                </p>
              </div>
              <div className="text-center">
                <div className="text-2xl mb-2">🌍</div>
                <h4 className="font-semibold mb-1">Help Environment</h4>
                <p className="text-sm text-gray-600">
                  Reduce carbon footprint and support circular economy
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}