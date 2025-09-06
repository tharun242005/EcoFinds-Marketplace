import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Badge } from './ui/badge';
import { ImageUpload } from './ImageUpload';
import { User, Mail, MapPin, Phone, Calendar, Award, TrendingUp, Package, Heart, Star, Zap, Target, Gift, Crown, Sparkles, Edit2, Save, X } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { projectId, publicAnonKey } from '../utils/supabase/info';

interface UserDashboardProps {
  userProfile: any;
  onProfileUpdated: () => void;
  session: any;
}

export function UserDashboard({ userProfile, onProfileUpdated, session }: UserDashboardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    full_name: '',
    bio: '',
    location: '',
    phone: '',
    avatar_url: ''
  });
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({
    totalListings: 0,
    totalSales: 0,
    totalPurchases: 0,
    rating: 0,
    joinDate: '',
    ecoPoints: 0,
    itemsSaved: 0,
    carbonSaved: 0
  });

  useEffect(() => {
    if (userProfile) {
      setFormData({
        username: userProfile.username || '',
        full_name: userProfile.full_name || '',
        bio: userProfile.bio || '',
        location: userProfile.location || '',
        phone: userProfile.phone || '',
        avatar_url: userProfile.avatar_url || ''
      });
    }
    fetchUserStats();
  }, [userProfile]);

  const fetchUserStats = async () => {
    try {
      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-213a9f17/user-stats`, {
        headers: {
          'Authorization': `Bearer ${session.access_token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setStats({
          ...data.stats,
          ecoPoints: 1250, // Mock data for demo
          itemsSaved: 47,
          carbonSaved: 23.5
        });
      } else {
        // Fallback mock data
        setStats({
          totalListings: 8,
          totalSales: 15,
          totalPurchases: 23,
          rating: 4.8,
          joinDate: 'Jan 2024',
          ecoPoints: 1250,
          itemsSaved: 47,
          carbonSaved: 23.5
        });
      }
    } catch (error) {
      console.error('Error fetching user stats:', error);
      // Fallback mock data
      setStats({
        totalListings: 8,
        totalSales: 15,
        totalPurchases: 23,
        rating: 4.8,
        joinDate: 'Jan 2024',
        ecoPoints: 1250,
        itemsSaved: 47,
        carbonSaved: 23.5
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-213a9f17/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        setIsEditing(false);
        onProfileUpdated();
        toast.success('Profile updated successfully!');
      } else {
        const error = await response.text();
        toast.error(`Failed to update profile: ${error}`);
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = (imageUrl: string) => {
    setFormData(prev => ({ ...prev, avatar_url: imageUrl }));
  };

  const achievements = [
    { name: 'Eco Warrior', description: 'Saved 20+ items from waste', icon: '🌱', unlocked: stats.itemsSaved >= 20 },
    { name: 'Green Seller', description: 'Listed 10+ sustainable products', icon: '🌿', unlocked: stats.totalListings >= 10 },
    { name: 'Planet Hero', description: 'Reduced 10kg+ CO₂ emissions', icon: '🌍', unlocked: stats.carbonSaved >= 10 },
    { name: 'Community Star', description: 'Maintained 4.5+ rating', icon: '⭐', unlocked: stats.rating >= 4.5 }
  ];

  const formatDate = (dateString: string) => {
    if (!dateString) return 'Recently';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getInitials = (name: string) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  if (!userProfile) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="bg-gray-200 h-8 rounded mb-4"></div>
          <div className="bg-gray-200 h-64 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Floating 3D Elements for User Page */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-20 right-10 animate-float opacity-20" style={{animationDuration: '6s'}}>
          <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full shadow-xl"></div>
        </div>
        <div className="absolute bottom-40 left-10 animate-float opacity-15" style={{animationDuration: '8s', animationDelay: '2s'}}>
          <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-purple-500 rounded-lg transform rotate-45 shadow-xl"></div>
        </div>
        <div className="absolute top-1/2 right-20 animate-float opacity-10" style={{animationDuration: '7s', animationDelay: '4s'}}>
          <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full shadow-xl"></div>
        </div>
      </div>

      {/* Enhanced Profile Header with 3D Elements */}
      <Card className="relative bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 border-green-200 overflow-hidden">
        {/* Background 3D Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-4 left-4 w-20 h-20 bg-green-400 rounded-full transform rotate-12"></div>
          <div className="absolute bottom-4 right-4 w-16 h-16 bg-emerald-400 rounded-lg transform -rotate-12"></div>
          <div className="absolute top-1/2 left-1/4 w-12 h-12 bg-teal-400 rounded-full"></div>
        </div>
        
        <CardContent className="pt-6 relative z-10">
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="relative group">
              <div className="absolute -inset-2 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full opacity-75 group-hover:opacity-100 animate-pulse"></div>
              <Avatar className="h-24 w-24 relative border-4 border-white shadow-2xl">
                <AvatarImage src={userProfile?.avatar_url} alt="Profile" />
                <AvatarFallback className="text-2xl bg-green-100 text-green-700">
                  {getInitials(userProfile?.username || userProfile?.full_name || '')}
                </AvatarFallback>
              </Avatar>
              <Badge className="absolute -bottom-2 -right-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-lg">
                <Crown className="h-3 w-3 mr-1" />
                VIP
              </Badge>
            </div>
            <div className="text-center sm:text-left flex-1">
              <div className="flex items-center justify-center sm:justify-start gap-2 mb-2">
                <h2 className="text-3xl font-bold bg-gradient-to-r from-green-700 to-emerald-600 bg-clip-text text-transparent">
                  {userProfile?.full_name || userProfile?.username || 'Eco Hero'}
                </h2>
                <Sparkles className="h-6 w-6 text-yellow-500" />
              </div>
              <p className="text-gray-600 font-medium">@{userProfile?.username || 'username'}</p>
              <p className="text-sm text-gray-500 mt-2 max-w-md">{userProfile?.bio || 'Passionate about sustainable living and making the world a greener place! 🌱'}</p>
              <div className="flex items-center justify-center sm:justify-start gap-4 mt-4 text-sm text-gray-500">
                {userProfile?.location && (
                  <div className="flex items-center gap-1 bg-white/50 px-2 py-1 rounded-full">
                    <MapPin className="h-4 w-4" />
                    {userProfile.location}
                  </div>
                )}
                <div className="flex items-center gap-1 bg-white/50 px-2 py-1 rounded-full">
                  <Calendar className="h-4 w-4" />
                  Joined {formatDate(userProfile.created_at)}
                </div>
                <div className="flex items-center gap-1 bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full">
                  <Zap className="h-4 w-4" />
                  {stats.ecoPoints} EcoPoints
                </div>
              </div>
            </div>
            <Button
              onClick={() => setIsEditing(!isEditing)}
              variant={isEditing ? "outline" : "default"}
              className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-lg transform hover:scale-105 transition-all duration-200"
            >
              {isEditing ? (
                <>
                  <X className="mr-2 h-4 w-4" />
                  Cancel
                </>
              ) : (
                <>
                  <Edit2 className="mr-2 h-4 w-4" />
                  Edit Profile
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Enhanced Statistics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-green-50 to-emerald-100 border-green-200 hover:shadow-xl transition-all duration-300 transform hover:scale-105">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">{stats.totalListings}</p>
                <p className="text-sm text-gray-600 font-medium">Active Listings</p>
              </div>
              <div className="relative">
                <Package className="h-10 w-10 text-green-600 animate-bounce" />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-ping"></div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-indigo-100 border-blue-200 hover:shadow-xl transition-all duration-300 transform hover:scale-105">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">{stats.totalSales}</p>
                <p className="text-sm text-gray-600 font-medium">Items Sold</p>
              </div>
              <TrendingUp className="h-10 w-10 text-blue-600 animate-pulse" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-pink-100 border-purple-200 hover:shadow-xl transition-all duration-300 transform hover:scale-105">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">{stats.totalPurchases}</p>
                <p className="text-sm text-gray-600 font-medium">Items Bought</p>
              </div>
              <Heart className="h-10 w-10 text-purple-600 animate-bounce" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-yellow-50 to-orange-100 border-yellow-200 hover:shadow-xl transition-all duration-300 transform hover:scale-105">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-3xl font-bold bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent">{stats.rating}</p>
                <p className="text-sm text-gray-600 font-medium">Rating</p>
              </div>
              <div className="relative">
                <Star className="h-10 w-10 text-yellow-600 fill-yellow-600 animate-pulse" />
                <div className="absolute top-0 left-0 w-10 h-10 bg-yellow-400 opacity-20 rounded-full animate-ping"></div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Environmental Impact Section */}
      <Card className="bg-gradient-to-r from-green-600 to-emerald-600 text-white">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl">
            <Target className="h-6 w-6" />
            Your Environmental Impact
          </CardTitle>
          <CardDescription className="text-green-100">
            Making a real difference for our planet! 🌍
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <div className="text-4xl font-bold text-white">{stats.itemsSaved}</div>
              <div className="text-green-100">Items Saved from Waste</div>
            </div>
            <div className="text-center bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <div className="text-4xl font-bold text-white">{stats.carbonSaved}kg</div>
              <div className="text-green-100">CO₂ Emissions Reduced</div>
            </div>
            <div className="text-center bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <div className="text-4xl font-bold text-white">{stats.ecoPoints}</div>
              <div className="text-green-100">EcoPoints Earned</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Achievements Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5 text-yellow-600" />
            Achievements
          </CardTitle>
          <CardDescription>
            Your sustainability milestones and accomplishments
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {achievements.map((achievement, index) => (
              <div 
                key={index}
                className={`p-4 rounded-xl border-2 transition-all duration-300 ${
                  achievement.unlocked 
                    ? 'bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-200 shadow-lg' 
                    : 'bg-gray-50 border-gray-200 opacity-60'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`text-3xl ${achievement.unlocked ? 'animate-bounce' : 'grayscale'}`}>
                    {achievement.icon}
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800">{achievement.name}</h4>
                    <p className="text-sm text-gray-600">{achievement.description}</p>
                  </div>
                  {achievement.unlocked && (
                    <Badge className="ml-auto bg-yellow-500 text-yellow-900">
                      Unlocked!
                    </Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Profile Form */}
      {isEditing && (
        <Card className="border-green-200">
          <CardHeader>
            <CardTitle className="text-green-800">Edit Profile</CardTitle>
            <CardDescription>
              Update your profile information to help others connect with you.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label>Profile Picture</Label>
                <ImageUpload
                  onImageUpload={handleImageUpload}
                  currentImage={formData.avatar_url}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    value={formData.username}
                    onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))}
                    placeholder="Enter username"
                  />
                </div>
                <div>
                  <Label htmlFor="full_name">Full Name</Label>
                  <Input
                    id="full_name"
                    value={formData.full_name}
                    onChange={(e) => setFormData(prev => ({ ...prev, full_name: e.target.value }))}
                    placeholder="Enter full name"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="bio">Bio</Label>
                <textarea
                  id="bio"
                  value={formData.bio}
                  onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  rows={3}
                  placeholder="Tell others about yourself..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                    placeholder="City, Country"
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                    placeholder="Phone number"
                  />
                </div>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 transform hover:scale-105 transition-all duration-200"
              >
                {loading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Saving Changes...
                  </div>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Save Changes
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  );
}