from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .views import (
    CategoryListAPIView, CategoryDetailAPIView,
    ProductListAPIView, ProductDetailAPIView,
    CartListCreateAPIView, CartRetrieveUpdateDestroyAPIView,
    WishlistListCreateAPIView, WishlistDestroyAPIView,
    OrderListCreateAPIView, UserProfileAPIView
)

urlpatterns = [
    # Auth APIs
    path('auth/login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('auth/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('user/profile/', UserProfileAPIView.as_view(), name='user_profile'),

    # Category APIs
    path('categories/', CategoryListAPIView.as_view(), name='category_list'),
    path('categories/<int:pk>/', CategoryDetailAPIView.as_view(), name='category_detail'),

    # Product APIs
    path('products/', ProductListAPIView.as_view(), name='product_list'),
    path('products/<int:pk>/', ProductDetailAPIView.as_view(), name='product_detail'),

    # Cart APIs
    path('cart/', CartListCreateAPIView.as_view(), name='cart_list_create'),
    path('cart/<int:pk>/', CartRetrieveUpdateDestroyAPIView.as_view(), name='cart_update_delete'),

    # Wishlist APIs
    path('wishlist/', WishlistListCreateAPIView.as_view(), name='wishlist_list_create'),
    path('wishlist/<int:pk>/', WishlistDestroyAPIView.as_view(), name='wishlist_delete'),

    # Order APIs
    path('orders/', OrderListCreateAPIView.as_view(), name='order_list_create'),
]
