from django.test import TestCase
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from .models import User

class UserRegistrationTests(APITestCase):
    def test_create_creator_account(self):
        """Test creating a new creator account"""
        url = reverse('accounts:register')
        data = {
            'email': 'test@example.com',
            'password': 'testpass123',
            'confirm_password': 'testpass123',
            'role': 'creator',
            'phone_number': ''
        }
        response = self.client.post(url, data, format='json')
        print(f'Response: {response.content.decode()}')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(User.objects.count(), 1)
        self.assertEqual(User.objects.get().email, 'test@example.com')
        self.assertEqual(User.objects.get().role, 'creator')
