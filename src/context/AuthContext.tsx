import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import { auth, signInWithGoogle, signOut as fbSignOut, db } from '../utils/firebase';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: () => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // User is signed in
        const token = await firebaseUser.getIdToken();
        setToken(token);
        localStorage.setItem('token', token);

        // Fetch user from Firestore or create if doesn't exist
        const userDocRef = doc(db, 'users', firebaseUser.uid);
        try {
          const userDoc = await getDoc(userDocRef);
          if (userDoc.exists()) {
            const userData = userDoc.data() as User;
            setUser(userData);
            localStorage.setItem('user', JSON.stringify(userData));
          } else {
            // Create user
            const newUser: User = {
              username: firebaseUser.displayName || 'User',
              email: firebaseUser.email || '',
              id: firebaseUser.uid,
              isAdmin: false,
            };
            const firestoreUser = {
              uid: firebaseUser.uid,
              email: firebaseUser.email || '',
              username: firebaseUser.displayName || 'User',
              isAdmin: false,
              createdAt: new Date().toISOString()
            };
            await setDoc(userDocRef, firestoreUser);
            setUser(newUser);
            localStorage.setItem('user', JSON.stringify(newUser));
          }
        } catch (error) {
          console.error("Error fetching/creating user doc:", error);
          // Fallback to local user
          const savedUser = localStorage.getItem('user');
          if (savedUser) setUser(JSON.parse(savedUser));
        }
      } else {
        // User is signed out
        setUser(null);
        setToken(null);
        localStorage.removeItem('user');
        localStorage.removeItem('token');
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async () => {
    await signInWithGoogle();
  };

  const logout = async () => {
    await fbSignOut();
  };

  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isAuthenticated, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
