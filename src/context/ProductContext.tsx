import React, { createContext, useContext, useState, useEffect } from "react";
import { Product, Review } from "../types";
import api from "../utils/api";

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
    // Fetch products from backend
    api.get<Product[]>("/products")
      .then(res => {
        setProducts(res.data);
        // Sync to local storage for offline fallback if desired
        localStorage.setItem("products", JSON.stringify(res.data));
      })
      .catch(err => {
        console.error("Error fetching products:", err);
        const savedProducts = localStorage.getItem("products");
        if (savedProducts) {
          setProducts(JSON.parse(savedProducts));
        }
      });
  }, []);

  const addProduct = async (
    productData: Omit<Product, "id" | "created_at" | "rating" | "reviews">,
  ) => {
    try {
      const res = await api.post<Product>("/products", productData);
      setProducts(prev => {
        const updated = [res.data, ...prev];
        localStorage.setItem("products", JSON.stringify(updated));
        return updated;
      });
    } catch (err) {
      console.error("Error adding product:", err);
    }
  };

  const deleteProduct = async (productId: string) => {
    try {
      await api.delete(`/products/${productId}`);
      setProducts(prev => {
        const updated = prev.filter(p => p.id !== productId);
        localStorage.setItem("products", JSON.stringify(updated));
        return updated;
      });
    } catch (err) {
      console.error("Error deleting product:", err);
    }
  };

  const addReview = (
    productId: string,
    reviewData: Omit<Review, "id" | "createdAt">,
  ) => {
    // Simplistic local state update (in a full app, this would be an API call)
    setProducts((prevProducts) => {
      const updatedProducts = prevProducts.map((p) => {
        if (p.id === productId) {
          const newReview: Review = {
            ...reviewData,
            id: Math.random().toString(36).substring(2, 9),
            createdAt: new Date().toISOString(),
          };
          const existingReviews = p.reviews || [];
          const updatedReviews = [newReview, ...existingReviews];
          const newRating = calculateAverageRating(updatedReviews, p.rating);
          return {
            ...p,
            rating: newRating,
            reviews: updatedReviews,
          };
        }
        return p;
      });
      localStorage.setItem("products", JSON.stringify(updatedProducts));
      return updatedProducts;
    });
  };

  const deleteReview = (productId: string, reviewId: string) => {
    setProducts((prevProducts) => {
      const updatedProducts = prevProducts.map((p) => {
        if (p.id === productId && p.reviews) {
          const updatedReviews = p.reviews.filter((r) => r.id !== reviewId);
          const newRating = calculateAverageRating(updatedReviews, p.rating);
          return {
            ...p,
            rating: newRating,
            reviews: updatedReviews,
          };
        }
        return p;
      });
      localStorage.setItem("products", JSON.stringify(updatedProducts));
      return updatedProducts;
    });
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
