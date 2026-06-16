import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Store } from "lucide-react";
import { motion } from "motion/react";

const Login = () => {
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleGoogleLogin = async () => {
    try {
      await login();
      navigate("/");
    } catch (err: any) {
      console.error("Login error:", err);
      setError("Error signing in with Google.");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="min-h-[80vh] flex items-center justify-center bg-slate-50 px-4 py-12 sm:px-6 lg:px-8"
    >
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-3xl shadow-sm border border-slate-100">
        <div className="text-center">
          <div className="mx-auto bg-slate-900 text-white w-12 h-12 rounded-xl flex items-center justify-center mb-4">
            <Store size={24} />
          </div>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Welcome back
          </h2>
        </div>
        
        <div className="mt-8 space-y-6">
          {error && (
            <div className="bg-red-50 text-red-600 text-sm p-4 rounded-xl border border-red-100 flex items-center justify-center">
              <p className="font-medium">{error}</p>
            </div>
          )}
          
          <div>
            <button
              onClick={handleGoogleLogin}
              className="group relative w-full flex justify-center py-3 px-4 border border-slate-300 text-sm font-bold rounded-xl text-slate-700 bg-white hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-900 transition-colors shadow-sm"
            >
              Sign in with Google
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Login;
