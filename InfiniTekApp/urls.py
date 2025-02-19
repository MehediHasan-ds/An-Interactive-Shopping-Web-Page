from django.urls import path
from . import views

urlpatterns = [
    path('', views.index, name='index'),
    path('checkout/', views.checkout, name='checkout'),
    path('manage-specifications/', views.manage_specifications, name='manage-specifications'),
    path('save-order/', views.save_order, name='save-order'),
]