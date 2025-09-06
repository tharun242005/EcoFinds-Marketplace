import React, { useState, useEffect } from 'react';
import { History, Calendar, ShoppingBag } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { toast } from 'sonner@2.0.3';
import { projectId, publicAnonKey } from '../utils/supabase/info';

interface PurchaseHistoryProps {
  session: any;
}

export function PurchaseHistory({ session }: PurchaseHistoryProps) {
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPurchaseHistory();
  }, []);

  const fetchPurchaseHistory = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-213a9f17/purchases`,
        {
          headers: {
            'Authorization': `Bearer ${session.access_token}`
          }
        }
      );

      if (response.ok) {
        const data = await response.json();
        setPurchases(data.purchases);
      } else {
        throw new Error('Failed to fetch purchase history');
      }
    } catch (error) {
      console.error('Error fetching purchase history:', error);
      toast.error('Failed to load purchase history');
    }
    setLoading(false);
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
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const calculateTotalSpent = () => {
    return purchases.reduce((total: number, purchase: any) => total + purchase.price, 0);
  };

  const calculateItemsSaved = () => {
    return purchases.length;
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Purchase History</h1>
        </div>
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="bg-gray-200 h-24 rounded-lg"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Purchase History</h1>
          <p className="text-gray-600 mt-1">Track your sustainable shopping journey</p>
        </div>
        <p className="text-gray-600">{purchases.length} purchase{purchases.length !== 1 ? 's' : ''}</p>
      </div>

      {purchases.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📋</div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No purchases yet</h3>
          <p className="text-gray-600">
            Start your sustainable shopping journey by adding items to your cart
          </p>
        </div>
      ) : (
        <>
          {/* Impact Summary */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center">
                  <ShoppingBag className="mr-2 h-5 w-5 text-green-600" />
                  Total Spent
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  {formatPrice(calculateTotalSpent())}
                </div>
                <p className="text-sm text-gray-600 mt-1">
                  Saved vs. buying new
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center">
                  <History className="mr-2 h-5 w-5 text-green-600" />
                  Items Rescued
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  {calculateItemsSaved()}
                </div>
                <p className="text-sm text-gray-600 mt-1">
                  Products given new life
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center">
                  🌱
                  Environmental Impact
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  Positive
                </div>
                <p className="text-sm text-gray-600 mt-1">
                  Reduced waste & carbon footprint
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Purchase List */}
          <div className="space-y-4">
            {purchases.map((purchase: any, index: number) => (
              <Card key={purchase.id}>
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden">
                      {purchase.product?.image_url ? (
                        <img
                          src={purchase.product.image_url}
                          alt={purchase.product?.title || purchase.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-2xl">
                          {purchase.product?.image_placeholder || '📦'}
                        </div>
                      )}
                    </div>
                    
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">
                        {purchase.product?.title || purchase.title}
                      </h3>
                      {purchase.product?.description && (
                        <p className="text-sm text-gray-600 line-clamp-1 mt-1">
                          {purchase.product.description}
                        </p>
                      )}
                      <div className="flex items-center gap-4 mt-3">
                        <div className="flex items-center gap-1 text-sm text-gray-500">
                          <Calendar className="h-4 w-4" />
                          <span>Purchased {formatDate(purchase.purchased_at)}</span>
                        </div>
                        {purchase.product?.category && (
                          <Badge variant="secondary" className="text-xs">
                            {purchase.product.category}
                          </Badge>
                        )}
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="text-lg font-bold text-green-600">
                        {formatPrice(purchase.price)}
                      </div>
                      <p className="text-sm text-gray-500">
                        Order #{index + 1}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Sustainability Message */}
          <Card className="mt-8 bg-green-50 border-green-200">
            <CardHeader>
              <CardTitle className="text-green-800">🎉 Thank you for choosing sustainable!</CardTitle>
              <CardDescription className="text-green-700">
                Every purchase you make helps reduce waste and supports the circular economy.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-2xl mb-2">♻️</div>
                  <p className="text-sm font-medium text-green-800">Waste Reduced</p>
                  <p className="text-xs text-green-600">Items kept from landfills</p>
                </div>
                <div>
                  <div className="text-2xl mb-2">💚</div>
                  <p className="text-sm font-medium text-green-800">Community Impact</p>
                  <p className="text-xs text-green-600">Supporting local sellers</p>
                </div>
                <div>
                  <div className="text-2xl mb-2">🌍</div>
                  <p className="text-sm font-medium text-green-800">Planet Friendly</p>
                  <p className="text-xs text-green-600">Lower carbon footprint</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}