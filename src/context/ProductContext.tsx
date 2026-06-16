import React, { createContext, useContext, useState, useEffect } from "react";
import { Product, Review } from "../types";
import { database } from "../utils/firebase";
import { ref, get, set, remove, push } from "firebase/database";

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
    // Fetch products from Firebase
    const fetchProducts = async () => {
      try {
        const snapshot = await get(ref(database, 'products'));
        if (snapshot.exists()) {
          const productsData = Object.values(snapshot.val()) as Product[];
          setProducts(productsData);
        } else {
          setProducts([]);
        }
      } catch (err) {
        console.error("Error fetching products:", err);
      }
    };
    fetchProducts();
  }, []);

  const addProduct = async (
    productData: Omit<Product, "id" | "created_at" | "rating" | "reviews">,
  ) => {
    try {
      const newId = `prod_${Date.now()}`;
      const newProduct: Product = {
        ...productData,
        id: newId,
        created_at: new Date().toISOString(),
        rating: 5.0,
        reviews: []
      };
      await set(ref(database, `products/${newId}`), newProduct);
      setProducts(prev => [newProduct, ...prev]);
    } catch (err) {
      console.error("Error adding product:", err);
    }
  };

  const deleteProduct = async (productId: string) => {
    try {
      await remove(ref(database, `products/${productId}`));
      setProducts(prev => prev.filter(p => p.id !== productId));
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
      
      const updatedReviews = [newReview, ...(product.reviews || [])];
      const newRating = calculateAverageRating(updatedReviews, product.rating);
      
      await set(ref(database, `products/${productId}/reviews`), updatedReviews);
      await set(ref(database, `products/${productId}/rating`), newRating);

      setProducts((prevProducts) => 
        prevProducts.map((p) => 
          p.id === productId 
            ? { ...p, rating: newRating, reviews: updatedReviews }
            : p
        )
      );
    } catch (err) {
      console.error("Error adding review:", err);
    }
  };

  const deleteReview = async (productId: string, reviewId: string) => {
    try {
      const product = products.find(p => p.id === productId);
      if (!product || !product.reviews) return;

      const updatedReviews = product.reviews.filter(r => r.id !== reviewId);
      const newRating = calculateAverageRating(updatedReviews, product.rating);

      await set(ref(database, `products/${productId}/reviews`), updatedReviews);
      await set(ref(database, `products/${productId}/rating`), newRating);

      setProducts((prevProducts) => 
        prevProducts.map((p) => 
          p.id === productId 
            ? { ...p, rating: newRating, reviews: updatedReviews }
            : p
        )
      );
    } catch (err) {
      console.error("Error deleting review:", err);
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
