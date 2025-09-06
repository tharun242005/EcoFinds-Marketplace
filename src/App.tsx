import React, { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import {
  projectId,
  publicAnonKey,
} from "./utils/supabase/info";
import { HomePage } from "./components/HomePage";
import { AuthScreen } from "./components/AuthScreen";
import { MainApp } from "./components/MainApp";

const supabase = createClient(
  `https://${projectId}.supabase.co`,
  publicAnonKey,
);

export default function App() {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showAuth, setShowAuth] = useState(false);

  useEffect(() => {
    // Check for existing session with faster loading
    const initializeAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        setSession(session);
        if (session) {
          setShowAuth(true); // Skip home page if already logged in
        }
      } catch (error) {
        console.log('Auth initialization error:', error);
      } finally {
        // Quick loading for better UX
        setTimeout(() => setLoading(false), 500);
      }
    };

    initializeAuth();

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 overflow-hidden">
        {/* Dynamic 3D Loading Animation */}
        <div className="relative">
          {/* Floating 3D Elements */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute -top-10 -left-10 w-20 h-20 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full opacity-60 animate-bounce transform rotate-12"></div>
            <div className="absolute -top-5 -right-8 w-16 h-16 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-lg opacity-50 animate-pulse transform -rotate-12"></div>
            <div className="absolute -bottom-8 -left-6 w-14 h-14 bg-gradient-to-br from-teal-400 to-green-500 rounded-full opacity-40 animate-bounce delay-500"></div>
            <div className="absolute -bottom-5 -right-10 w-18 h-18 bg-gradient-to-br from-green-500 to-emerald-400 rounded-lg opacity-55 animate-pulse delay-1000"></div>
          </div>
          
          <div className="text-center relative z-10 bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-2xl border border-green-200/50">
            <div className="relative">
              <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl mx-auto mb-4 animate-pulse transform hover:scale-110 transition-transform duration-300 shadow-lg"></div>
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-400 rounded-full animate-bounce"></div>
            </div>
            <h2 className="text-2xl font-bold text-green-800 mb-2">EcoFinds</h2>
            <p className="text-green-600 animate-pulse">Launching your sustainable journey...</p>
            <div className="mt-4 flex justify-center space-x-1">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce delay-100"></div>
              <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce delay-200"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!showAuth && !session) {
    return <HomePage onGetStarted={() => setShowAuth(true)} />;
  }

  if (!session) {
    return (
      <AuthScreen
        supabase={supabase}
        onBack={() => setShowAuth(false)}
      />
    );
  }

  return <MainApp supabase={supabase} session={session} />;
}