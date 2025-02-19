from django.shortcuts import render
import json
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from pathlib import Path

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
