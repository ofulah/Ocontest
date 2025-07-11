from django.contrib.auth.models import AbstractUser
from django.db import models
from django.core.validators import RegexValidator

class User(AbstractUser):
    CREATOR = 'CREATOR'
    CLIENT = 'CLIENT'
    ADMIN = 'ADMIN'
    
    ROLE_CHOICES = [
        (CREATOR, 'Creator'),
        (CLIENT, 'Client'),
        (ADMIN, 'Admin'),
    ]

    role = models.CharField(max_length=10, choices=ROLE_CHOICES, default=CREATOR)
    phone_regex = RegexValidator(
        regex=r'^\+?1?\d{9,15}$',
        message="Phone number must be entered in the format: '+999999999'. Up to 15 digits allowed."
    )
    phone_number = models.CharField(validators=[phone_regex], max_length=17, blank=True, null=True)
    notification_preferences = models.JSONField(default=dict)

    def save(self, *args, **kwargs):
        if not self.notification_preferences:
            self.notification_preferences = {
                'sms_enabled': True,
                'email_enabled': True
            }
        super().save(*args, **kwargs)

    class Meta:
        db_table = 'auth_user'
        
class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    bio = models.TextField(max_length=500, blank=True)
    portfolio_url = models.URLField(max_length=200, blank=True)
    avatar = models.ImageField(upload_to='avatars/', null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
