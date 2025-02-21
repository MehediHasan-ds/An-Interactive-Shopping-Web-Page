from django.shortcuts import render
import json
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from pathlib import Path
import os

# Helper function to save uploaded images
def save_uploaded_image(image_file):
    # Define the path to the static/images directory
    images_dir = Path(__file__).resolve().parent.parent / 'static/images'
    if not images_dir.exists():
        os.makedirs(images_dir)  # Create the directory if it doesn't exist

    # Save the image file
    image_path = images_dir / image_file.name
    with open(image_path, 'wb+') as destination:
        for chunk in image_file.chunks():
            destination.write(chunk)

    # Return the relative path to the image
    return f"{image_file.name}"

@csrf_exempt
def upload_image(request):
    if request.method == 'POST' and request.FILES.get('image'):
        image_file = request.FILES['image']
        try:
            # Save the image to static/images
            image_path = save_uploaded_image(image_file)
            return JsonResponse({'status': 'success', 'imageUrl': image_path})
        except Exception as e:
            return JsonResponse({'status': 'error', 'message': str(e)}, status=500)
    return JsonResponse({'status': 'error', 'message': 'Invalid request'}, status=400)

@csrf_exempt
def save_product(request):
    if request.method == 'POST':
        try:
            # Parse the product data from the request
            product_data = json.loads(request.body)
            
            # Define the path to products.json
            products_json_path = Path(__file__).resolve().parent.parent / 'static/json/products.json'
            
            # Load existing products
            if products_json_path.exists():
                with open(products_json_path, 'r') as file:
                    products = json.load(file)
            else:
                products = []
            
            # Add the new product
            products.append(product_data)
            
            # Save the updated products back to products.json
            with open(products_json_path, 'w') as file:
                json.dump(products, file, indent=4)
            
            return JsonResponse({'status': 'success'})
        except Exception as e:
            return JsonResponse({'status': 'error', 'message': str(e)}, status=500)
    return JsonResponse({'status': 'error', 'message': 'Invalid request method'}, status=400)

@csrf_exempt
def save_order(request):
    if request.method == 'POST':
        try:
            # Parse the order data from the request
            order_data = json.loads(request.body)
            
            # Define the path to orders.json
            orders_json_path = Path(__file__).resolve().parent.parent / 'static/json/orders.json'
            
            # Load existing orders
            if orders_json_path.exists():
                with open(orders_json_path, 'r') as file:
                    orders = json.load(file)
            else:
                orders = []
            
            # Add the new order
            orders.append(order_data)
            
            # Save the updated orders back to orders.json
            with open(orders_json_path, 'w') as file:
                json.dump(orders, file, indent=4)
            
            return JsonResponse({'status': 'success'})
        except Exception as e:
            return JsonResponse({'status': 'error', 'message': str(e)}, status=500)
    return JsonResponse({'status': 'error', 'message': 'Invalid request method'}, status=400)

def index(request):
    return render(request, 'index.html')

def checkout(request):
    return render(request, 'checkout.html')

def manage_specifications(request):
    return render(request, 'manage-specifications.html')