from django.urls import path
from . import views

urlpatterns = [
    path('', views.index, name='index'),  # Homepage
    path('checkout/', views.checkout, name='checkout'),  # Checkout page
    path('manage-specifications/', views.manage_specifications, name='manage-specifications'),  # Manage specifications page
    path('save-order/', views.save_order, name='save-order'),  # Save order endpoint
    path('upload-image/', views.upload_image, name='upload-image'),  # Upload product image endpoint
    path('save-product/', views.save_product, name='save-product'),  # Save product endpoint
]