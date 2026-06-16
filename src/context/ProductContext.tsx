import React, { createContext, useContext, useState, useEffect } from "react";
import { Product, Review } from "../types";
import { db } from "../utils/firebase";
import { collection, onSnapshot, addDoc, deleteDoc, doc, updateDoc, query, orderBy } from 'firebase/firestore';

interface ProductContextType {
  products: Product[];
  addReview: (
    productId: string,
    review: Omit<Review, "id" | "createdAt">,
  ) => void;
  deleteReview: (productId: string, reviewId: string) => void;
  addProduct: (
    product: Omit<Product, "id" | "created_at" | "rating" | "reviews">,
  ) => void;
  deleteProduct: (productId: string) => void;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

const calculateAverageRating = (
  reviews: Review[] | undefined,
  defaultRating: number,
): number => {
  if (!reviews || reviews.length === 0) return defaultRating;
  const totalRatingSum = reviews.reduce((sum, r) => sum + r.rating, 0);
  return totalRatingSum / reviews.length;
};

export const ProductProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const q = query(collection(db, "products"), orderBy("created_at", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const productsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Product[];
      setProducts(productsData);
      localStorage.setItem("products", JSON.stringify(productsData));
    }, (error) => {
      console.error("Firestore Error fetching products: ", error);
      const savedProducts = localStorage.getItem("products");
      if (savedProducts) {
        setProducts(JSON.parse(savedProducts));
      }
    });

    return () => unsubscribe();
  }, []);

  const addProduct = async (
    productData: Omit<Product, "id" | "created_at" | "rating" | "reviews">,
  ) => {
    try {
      const newProduct = {
        ...productData,
        created_at: new Date().toISOString(),
        rating: 5,
        reviews: [],
      };
      await addDoc(collection(db, "products"), newProduct);
    } catch (err) {
      console.error("Error adding product:", err);
    }
  };

  const deleteProduct = async (productId: string) => {
    try {
      await deleteDoc(doc(db, "products", productId));
    } catch (err) {
      console.error("Error deleting product:", err);
    }
  };

  const addReview = async (
    productId: string,
    reviewData: Omit<Review, "id" | "createdAt">,
  ) => {
    try {
      const product = products.find(p => p.id === productId);
      if (!product) return;

      const newReview: Review = {
        ...reviewData,
        id: Math.random().toString(36).substring(2, 9),
        createdAt: new Date().toISOString(),
      };
      const existingReviews = product.reviews || [];
      const updatedReviews = [newReview, ...existingReviews];
      const newRating = calculateAverageRating(updatedReviews, product.rating);
      
      await updateDoc(doc(db, "products", productId), {
        reviews: updatedReviews,
        rating: newRating
      });
    } catch (err) {
      console.error("Error adding review", err);
    }
  };

  const deleteReview = async (productId: string, reviewId: string) => {
    try {
      const product = products.find(p => p.id === productId);
      if (!product || !product.reviews) return;

      const updatedReviews = product.reviews.filter((r) => r.id !== reviewId);
      const newRating = calculateAverageRating(updatedReviews, product.rating);
      
      await updateDoc(doc(db, "products", productId), {
        reviews: updatedReviews,
        rating: newRating
      });
    } catch (err) {
      console.error("Error deleting review", err);
    }
  };

  return (
    <ProductContext.Provider
      value={{ products, addReview, deleteReview, addProduct, deleteProduct }}
    >
      {children}
    </ProductContext.Provider>
  );
};

export const useProducts = () => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error("useProducts must be used within a ProductProvider");
  }
  return context;
};
