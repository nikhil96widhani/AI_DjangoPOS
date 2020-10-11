from django.shortcuts import render
from api.serializers import ProductSerializer


# Create your views here.
def homeView(request):
    return render(request, 'home.html', {})


def productsView(request):
    serializer = ProductSerializer()
    return render(request, 'pos/products.html', {'serializer': serializer})
