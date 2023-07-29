from rest_framework import generics, viewsets
from rest_framework.response import Response
from accounts.models import Expense
from inventory.models import Order
from .serializers import ExpenseSerializer, OrderSerializer, OrderItemSerializer
from django.utils.dateparse import parse_date
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.core.mail import send_mail
from django.template.loader import render_to_string
from django.core.mail import get_connection, EmailMultiAlternatives
from django.core.mail.backends.smtp import EmailBackend
from accounts.models import StoreSettings, User
from xhtml2pdf import pisa
from io import BytesIO

from .serializers import UserRegistrationSerializer
from django.conf import settings
from email.mime.image import MIMEImage
import base64


@api_view(['POST', 'GET'])
def manage_customer_user(request):
    if request.method == 'POST':
        print(request.data)
        serializer = UserRegistrationSerializer(data=request.data)
        if serializer.is_valid():
            print("valid")
            instance = serializer.save()
            response_data = serializer.data
            response_data['id'] = instance.id
            return Response(response_data, status=201)
        return Response(serializer.errors, status=400)

    elif request.method == 'GET':
        query_params = request.GET
        customers = User.objects.filter(is_customer=True)

        if 'search_term' in query_params:
            search_term = request.GET.get("search_term")

            customers_email = customers.filter(email__icontains=search_term)[:5]
            customers_firstname = customers.filter(firstname__icontains=search_term)[:5]
            customers_lastname = customers.filter(lastname__icontains=search_term)[:5]
            customers_phone = customers.filter(phone__icontains=search_term)[:5]
            customers = (customers_email | customers_firstname | customers_lastname | customers_phone)[:8]

            serializer = UserRegistrationSerializer(customers, many=True)
            return Response(serializer.data)

class ExpenseListView(generics.ListCreateAPIView):
    serializer_class = ExpenseSerializer

    def get_queryset(self):
        queryset = Expense.objects.all()
        start_date = self.request.query_params.get('start_date')
        end_date = self.request.query_params.get('end_date')

        # If both start_date and end_date are provided, filter expenses by the date range
        if start_date and end_date:
            try:
                start_date = parse_date(start_date)
                end_date = parse_date(end_date)
                # Use __range lookup to filter expenses between start_date and end_date
                queryset = queryset.filter(date__range=[start_date, end_date])
            except ValueError:
                # Handle invalid date format gracefully
                pass

        return queryset


class ExpenseDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Expense.objects.all()
    serializer_class = ExpenseSerializer


@api_view(['POST'])
def send_receipt_email(request, order_id):
    def render_to_pdf(template_path, context_dict):
        template_string = render_to_string(template_path, context_dict)
        response = BytesIO()
        pdf = pisa.pisaDocument(BytesIO(template_string.encode("UTF-8")), response)
        if not pdf.err:
            return response.getvalue()
        else:
            return None
    #Get Config
    config = StoreSettings.get_solo()

    order = Order.objects.get(pk=order_id)
    cart_items = order.orderitem_set.all()


    context = {
        'order': order,
        'cart_items': cart_items,
        'discount_savings': "{:.2f}".format(order.get_cart_revenue_NoDiscount - order.get_cart_revenue),
        'savings': order.get_cart_mrp - order.get_cart_revenue,
    }

    # Render the email template with the context data
    email_body = render_to_string('pos/receipt_email.html', context)
    # pdf_receipt = render_to_pdf('pos/receipt_email_table.html', context)

    backend = EmailBackend(host=config.email_host, port=config.email_port, username=config.email_username,
                           password=config.email_password, use_tls=config.email_use_tls, fail_silently=False)


    # Send the email
    if order.payment_mode == 'Unpaid':
        recipt_or_invoice = 'Invoice'
    else:
        recipt_or_invoice = 'Receipt'

    subject = f'Your Order {recipt_or_invoice}'
    to_email = [f'{order.customer.email}']  # Replace with the customer's email address
    email = EmailMultiAlternatives(
        subject, f"Thank you for your purchase. This is your order {recipt_or_invoice}.", from_email=f"{config.site_name} <{config.email}>", to=to_email, bcc=[config.email], connection=backend
    )
    email.attach_alternative(email_body, "text/html")
    # email.attach('receipt.pdf', pdf_receipt, 'application/pdf')

    # SITE LOGO
    with open(f'{settings.BASE_DIR}{config.site_logo.url}', 'rb') as image_file:
        image_data = image_file.read()
    # Attach the inline image to the email
    image_mime = MIMEImage(image_data)
    image_mime.add_header('Content-ID', '<site_logo>')  # Set the Content-ID for referencing in the template
    image_mime.add_header('Content-Disposition', 'inline', filename='site_logo.png')
    email.attach(image_mime)

    email.send()

    # Return a success response
    return Response({'message': 'Receipt email sent successfully.'})
