import React, { useEffect, useRef } from 'react';
import { Leaf, ArrowRight, Recycle, Heart, Globe, ShoppingBag, Star, CheckCircle } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';

interface HomePageProps {
  onGetStarted: () => void;
}

export function HomePage({ onGetStarted }: HomePageProps) {
  const floatingRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = floatingRef.current;
    if (!element) return;

    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      const { innerWidth, innerHeight } = window;
      
      const xPercent = (clientX / innerWidth - 0.5) * 20;
      const yPercent = (clientY / innerHeight - 0.5) * 20;
      
      element.style.transform = `translate3d(${xPercent}px, ${yPercent}px, 0)`;
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 overflow-hidden">
      {/* Dynamic 3D Floating Models */}
      <div ref={floatingRef} className="fixed inset-0 pointer-events-none transition-transform duration-300 ease-out">
        {/* 3D Cube Model */}
        <div className="absolute top-20 left-10 animate-float" style={{animationDuration: '4s'}}>
          <div className="relative w-16 h-16">
            <div className="absolute inset-0 bg-gradient-to-br from-green-400 to-emerald-500 rounded-lg shadow-2xl transform rotate-12 skew-x-3 skew-y-3 opacity-70"></div>
            <div className="absolute inset-0 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg shadow-xl transform rotate-6 translate-x-1 translate-y-1 opacity-60"></div>
          </div>
        </div>

        {/* 3D Pyramid Model */}
        <div className="absolute top-40 right-20 animate-float" style={{animationDuration: '5s', animationDelay: '1s'}}>
          <div className="relative w-14 h-14">
            <div className="absolute inset-0 bg-gradient-to-b from-emerald-400 to-teal-500 transform rotate-45 skew-y-12 shadow-2xl opacity-65"></div>
            <div className="absolute top-1 left-1 w-12 h-12 bg-gradient-to-b from-emerald-300 to-teal-400 transform rotate-45 skew-y-12 shadow-xl opacity-80"></div>
          </div>
        </div>

        {/* 3D Sphere Model */}
        <div className="absolute bottom-40 left-20 animate-float" style={{animationDuration: '6s', animationDelay: '2s'}}>
          <div className="relative w-20 h-20">
            <div className="absolute inset-0 bg-gradient-radial from-teal-300 to-green-500 rounded-full shadow-2xl opacity-50"></div>
            <div className="absolute top-1 left-1 w-16 h-16 bg-gradient-radial from-teal-200 to-green-400 rounded-full shadow-xl opacity-70"></div>
            <div className="absolute top-3 left-3 w-8 h-8 bg-white/40 rounded-full shadow-lg"></div>
          </div>
        </div>

        {/* 3D Crystal Model */}
        <div className="absolute bottom-20 right-40 animate-float" style={{animationDuration: '3.5s', animationDelay: '0.5s'}}>
          <div className="relative w-16 h-16">
            <div className="absolute inset-0 bg-gradient-to-tr from-green-400 via-emerald-500 to-teal-400 transform rotate-30 skew-x-6 shadow-2xl opacity-60"></div>
            <div className="absolute top-1 right-1 w-12 h-12 bg-gradient-to-tr from-green-300 via-emerald-400 to-teal-300 transform rotate-30 skew-x-6 shadow-xl opacity-80"></div>
            <div className="absolute top-2 right-2 w-6 h-6 bg-white/50 transform rotate-30 skew-x-6 shadow-lg"></div>
          </div>
        </div>

        {/* Additional Floating Elements */}
        <div className="absolute top-60 left-1/3 animate-float" style={{animationDuration: '7s', animationDelay: '3s'}}>
          <div className="relative w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full shadow-xl opacity-40 transform hover:scale-110 transition-transform"></div>
        </div>

        <div className="absolute top-32 right-1/3 animate-float" style={{animationDuration: '4.5s', animationDelay: '1.5s'}}>
          <div className="w-10 h-10 bg-gradient-to-br from-pink-400 to-purple-500 rounded-lg transform rotate-45 shadow-xl opacity-35"></div>
        </div>
      </div>

      {/* Animated Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-emerald-400 animate-pulse"></div>
        <div className="absolute top-0 left-0 w-full h-full">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-float"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${3 + Math.random() * 4}s`
              }}
            >
              <Leaf className="h-4 w-4 text-green-300 opacity-30" />
            </div>
          ))}
        </div>
      </div>

      <div className="relative z-10">
        {/* Navigation */}
        <nav className="flex items-center justify-between p-6 lg:px-8">
          <div className="flex items-center">
            <div className="bg-green-600 rounded-full p-3 transform hover:scale-110 transition-transform duration-300 shadow-lg">
              <Leaf className="h-8 w-8 text-white" />
            </div>
            <span className="ml-3 text-2xl font-bold text-green-800">EcoFinds</span>
          </div>
          <Button
            onClick={onGetStarted}
            variant="outline"
            className="border-green-600 text-green-600 hover:bg-green-600 hover:text-white transition-all duration-300"
          >
            Sign In
          </Button>
        </nav>

        {/* Hero Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
          <div className="text-center">
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold text-gray-900 mb-8">
              <span className="block">Discover</span>
              <span className="block text-green-600 transform hover:scale-105 transition-transform duration-300">
                Sustainable
              </span>
              <span className="block">Treasures</span>
            </h1>
            <p className="max-w-3xl mx-auto text-lg sm:text-xl text-gray-600 mb-12 leading-relaxed">
              Join thousands of conscious consumers in the world's most trusted 
              second-hand marketplace. Give products a second life while saving money 
              and protecting our planet.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button
                onClick={onGetStarted}
                className="bg-green-600 hover:bg-green-700 text-white px-8 py-6 text-lg transform hover:scale-105 transition-all duration-300 shadow-xl hover:shadow-2xl"
              >
                Start Shopping Sustainably
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span>Free to join • No hidden fees</span>
              </div>
            </div>
          </div>

          {/* Floating Product Cards */}
          <div className="mt-20 relative">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {[
                { icon: '👕', title: 'Fashion', desc: 'Vintage & Modern Clothing', transform: 'hover:rotate-3' },
                { icon: '📱', title: 'Electronics', desc: 'Certified Pre-owned Tech', transform: 'hover:-rotate-3' },
                { icon: '🪴', title: 'Home & Garden', desc: 'Sustainable Living Items', transform: 'hover:rotate-2' }
              ].map((item, index) => (
                <Card 
                  key={index}
                  className={`bg-white/80 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:scale-105 hover:-translate-y-2 ${item.transform}`}
                >
                  <CardContent className="p-8 text-center">
                    <div className="text-4xl mb-4">{item.icon}</div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">{item.title}</h3>
                    <p className="text-gray-600">{item.desc}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="bg-white/50 backdrop-blur-sm py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                Why Choose EcoFinds?
              </h2>
              <p className="max-w-2xl mx-auto text-lg text-gray-600">
                More than just a marketplace - we're building a sustainable future together
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                {
                  icon: Recycle,
                  title: 'Reduce Waste',
                  description: 'Give products a second life and keep them out of landfills',
                  color: 'text-green-600'
                },
                {
                  icon: Heart,
                  title: 'Save Money',
                  description: 'Get quality items at up to 70% off retail prices',
                  color: 'text-red-500'
                },
                {
                  icon: Globe,
                  title: 'Help Planet',
                  description: 'Reduce carbon footprint through circular economy',
                  color: 'text-blue-600'
                },
                {
                  icon: ShoppingBag,
                  title: 'Trusted Community',
                  description: 'Verified sellers and buyers in a safe marketplace',
                  color: 'text-purple-600'
                }
              ].map((feature, index) => (
                <div 
                  key={index}
                  className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-1"
                >
                  <div className="mb-6">
                    <feature.icon className={`h-12 w-12 ${feature.color}`} />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Statistics Section */}
        <div className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                Our Impact So Far
              </h2>
              <p className="max-w-2xl mx-auto text-lg text-gray-600">
                Together, we're making a real difference for our planet
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {[
                { number: '50K+', label: 'Products Saved', icon: '♻️' },
                { number: '25K+', label: 'Happy Users', icon: '😊' },
                { number: '75%', label: 'Average Savings', icon: '💰' },
                { number: '100T+', label: 'CO₂ Reduced', icon: '🌱' }
              ].map((stat, index) => (
                <div 
                  key={index}
                  className="text-center bg-white/60 backdrop-blur-sm rounded-xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                >
                  <div className="text-4xl mb-4">{stat.icon}</div>
                  <div className="text-3xl font-bold text-green-600 mb-2">{stat.number}</div>
                  <div className="text-gray-600">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-green-600 to-emerald-600 py-20">
          <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
              Ready to Start Your Sustainable Journey?
            </h2>
            <p className="text-xl text-green-100 mb-8 leading-relaxed">
              Join our community of conscious consumers and start making a positive impact today.
              Every purchase helps create a more sustainable future.
            </p>
            <Button
              onClick={onGetStarted}
              className="bg-white text-green-600 hover:bg-gray-50 px-8 py-6 text-lg font-semibold transform hover:scale-105 transition-all duration-300 shadow-xl hover:shadow-2xl"
            >
              <Star className="mr-2 h-5 w-5" />
              Join EcoFinds Today
            </Button>
          </div>
        </div>

        {/* Footer */}
        <footer className="bg-gray-900 text-white py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div className="flex items-center mb-4 md:mb-0">
                <div className="bg-green-600 rounded-full p-2">
                  <Leaf className="h-6 w-6 text-white" />
                </div>
                <span className="ml-2 text-xl font-bold">EcoFinds</span>
              </div>
              <div className="text-center md:text-right">
                <p className="text-gray-400">
                  © 2025 EcoFinds. All rights reserved.
                </p>
                <p className="text-gray-500 text-sm mt-1">
                  Owned by <span className="text-green-400 font-medium">Tharun P</span>
                </p>
              </div>
            </div>
          </div>
        </footer>
      </div>


    </div>
  );
}