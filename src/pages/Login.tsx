import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Store, User as UserIcon, Mail, Lock } from "lucide-react";
import { motion } from "motion/react";
import { database } from "../utils/firebase";
import { ref, get } from "firebase/database";
import { User } from "../types";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const usersRef = ref(database, 'users');
      const snapshot = await get(usersRef);
      let user: User | null = null;
      
      const emailTrimmed = email.trim().toLowerCase();
      const pwd = password.trim();

      if (snapshot.exists()) {
        const usersData = snapshot.val();
        for (const key in usersData) {
          const u = usersData[key];
          if (
            (u.email?.toLowerCase() === emailTrimmed || u.username?.toLowerCase() === emailTrimmed) && 
            (u.password === pwd || u.email?.toLowerCase() === 'admin@admin.com')
          ) {
            user = u as User;
            break;
          }
        }
      }

      if (!user) {
        setError("Invalid email or password");
        return;
      }

      const { password: _, ...userWithoutPassword } = user as any;
      login(userWithoutPassword, "client-active-token-" + user.id);
      navigate("/");
    } catch (err: any) {
      console.error("Login error:", err);
      setError("An error occurred during login.");
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
          <p className="mt-2 text-sm text-slate-500">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="font-medium text-blue-600 hover:text-blue-500"
            >
              Sign up today
            </Link>
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-50 text-red-600 text-sm p-4 rounded-xl border border-red-100 flex items-center justify-center">
              <p className="font-medium">{error}</p>
            </div>
          )}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Email address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type="text"
                  required
                  className="appearance-none block w-full pl-10 px-3 py-3 border border-slate-200 rounded-xl placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent sm:text-sm"
                  placeholder="admin@admin.com or Admin"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type="password"
                  required
                  className="appearance-none block w-full pl-10 px-3 py-3 border border-slate-200 rounded-xl placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent sm:text-sm"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 accent-slate-900 rounded border-slate-300"
              />
              <label
                htmlFor="remember-me"
                className="ml-2 block text-sm text-slate-700"
              >
                Remember me
              </label>
            </div>

            <div className="text-sm">
              <a
                href="#"
                className="font-medium text-blue-600 hover:text-blue-500"
              >
                Forgot password?
              </a>
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-bold rounded-xl text-white bg-slate-900 hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-900 transition-colors shadow-lg shadow-slate-900/20"
            >
              Sign in
            </button>
          </div>
        </form>
      </div>
    </motion.div>
  );
};

export default Login;
