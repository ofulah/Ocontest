from rest_framework import viewsets, status
from rest_framework.response import Response
from django.core.mail import send_mail
from django.conf import settings
from .models import Contact
from .serializers import ContactSerializer

class ContactViewSet(viewsets.ModelViewSet):
    queryset = Contact.objects.all()
    serializer_class = ContactSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            contact = serializer.save()

            # Send email notification
            subject = f'New Contact Form Submission: {contact.subject}'
            message = f'''New contact form submission from {contact.name}\n
Email: {contact.email}
Subject: {contact.subject}
Message:\n{contact.message}'''
            try:
                send_mail(
                    subject,
                    message,
                    settings.DEFAULT_FROM_EMAIL,
                    ['contact@ocontest.net'],
                    fail_silently=False,
                )
            except Exception as e:
                print(f'Failed to send email: {str(e)}')

            return Response(
                {'message': 'Message sent successfully'},
                status=status.HTTP_201_CREATED
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
