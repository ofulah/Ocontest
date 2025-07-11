from django.db import models
from django.contrib.auth.models import AbstractUser, BaseUserManager
from django.utils.translation import gettext_lazy as _
from django.core.validators import MinValueValidator

class CustomUserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError('The Email field must be set')
        email = self.normalize_email(email)
        
        # Set is_active to False by default for email verification
        if 'is_active' not in extra_fields:
            extra_fields['is_active'] = False
            
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('role', 'admin')
        return self.create_user(email, password, **extra_fields)

class User(AbstractUser):
    """Base user model for all users in the system."""

    class Role(models.TextChoices):
        CREATOR = 'creator', _('Content Creator')
        BRAND = 'brand', _('Brand/Company')
        ADMIN = 'admin', _('Admin')

    class Gender(models.TextChoices):
        MALE = 'M', _('Male')
        FEMALE = 'F', _('Female')
        OTHER = 'O', _('Other')
        PREFER_NOT_TO_SAY = 'N', _('Prefer not to say')

    username = None
    email = models.EmailField(_('email address'), unique=True)
    role = models.CharField(
        max_length=20,
        choices=Role.choices,
        default=Role.CREATOR,
    )
    gender = models.CharField(
        max_length=1,
        choices=Gender.choices,
        blank=True,
        null=True,
        verbose_name=_('Gender')
    )
    phone_number = models.CharField(max_length=20, blank=True)
    is_verified = models.BooleanField(default=False)

    objects = CustomUserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []

    def __str__(self):
        return self.email

    def save(self, *args, **kwargs):
        is_new = self.pk is None
        super().save(*args, **kwargs)
        
        if is_new:
            if self.role == self.Role.CREATOR:
                CreatorProfile.objects.get_or_create(user=self)
            elif self.role == self.Role.BRAND:
                BrandProfile.objects.get_or_create(user=self)

class Creator(User):
    """Proxy model for Creator users."""
    
    class Meta:
        proxy = True
        verbose_name = 'Creator'
        verbose_name_plural = 'Creators'

    def save(self, *args, **kwargs):
        if not self.pk:  # Only for new instances
            self.role = 'creator'
        super().save(*args, **kwargs)

class Brand(User):
    """Proxy model for Brand users."""

    def __str__(self):
        # Show company name if BrandProfile exists; fallback to first_name or email
        if hasattr(self, 'brand_profile') and self.brand_profile.company_name:
            return self.brand_profile.company_name
        return self.first_name or self.email

    class Meta:
        proxy = True
        verbose_name = 'Brand'
        verbose_name_plural = 'Brands'

    def save(self, *args, **kwargs):
        if not self.pk:  # Only for new instances
            self.role = 'brand'
        super().save(*args, **kwargs)

class BrandProfile(models.Model):
    COMPANY_TYPES = [
        ('Media Company', 'Media Company'),
        ('Modeling Agency', 'Modeling Agency'),
        ('Production Company', 'Production Company'),
        ('Non-Profit Organization', 'Non-Profit Organization'),
        ('Other', 'Other')
    ]

    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='brand_profile')
    company_name = models.CharField(max_length=200)
    company_logo = models.ImageField(upload_to='brand_logos/', blank=True, help_text='Company logo')
    bio = models.TextField(max_length=1000, blank=True, help_text='Company description')
    country = models.CharField(max_length=100, blank=True)
    physical_address = models.TextField(max_length=500, blank=True, help_text='Complete physical address')
    contact_email = models.EmailField(blank=True, help_text='Primary contact email')
    contact_person = models.CharField(max_length=100, blank=True, help_text='Name of primary contact person')
    contact_phone = models.CharField(max_length=20, blank=True, help_text='Contact phone number')
    company_type = models.CharField(
        max_length=50,
        choices=COMPANY_TYPES,
        default='corporation',
        help_text='Type of company'
    )
    industry_type = models.CharField(max_length=100, blank=True, help_text='Industry sector')
    website_url = models.URLField(blank=True, help_text='Company website')
    social_media_links = models.JSONField(
        default=dict,
        blank=True,
        help_text='Social media links (e.g., LinkedIn, Twitter, Facebook)'
    )
    contests_created = models.PositiveIntegerField(default=0)
    total_prize_money = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        default=0,
        help_text='Total prize money awarded'
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = 'Brand Profile'
        verbose_name_plural = 'Brand Profiles'

    def __str__(self):
        return f"{self.company_name} ({self.user.email})"

class CreatorProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='creator_profile')
    profile_picture = models.ImageField(upload_to='creator_profiles/', blank=True, null=True, help_text='Profile picture')
    bio = models.TextField(max_length=500, blank=True, help_text='Tell us about yourself and your creative style')
    
    # Shipping Address Fields
    shipping_address_line1 = models.CharField(
        max_length=255, 
        verbose_name='Address Line 1',
        help_text='Street address, P.O. box, company name, c/o'
    )
    shipping_address_line2 = models.CharField(
        max_length=255, 
        null=True,
        blank=True,
        verbose_name='Address Line 2 (Optional)',
        help_text='Apartment, suite, unit, building, floor, etc.'
    )
    shipping_city = models.CharField(
        max_length=100, 
        verbose_name='City',
        help_text='City or town'
    )
    shipping_state = models.CharField(
        max_length=100, 
        verbose_name='State/Province/Region',
        help_text='State, province, or region'
    )
    shipping_postal_code = models.CharField(
        max_length=20, 
        verbose_name='ZIP/Postal Code',
        help_text='Postal code or ZIP code'
    )
    shipping_country = models.CharField(
        max_length=100, 
        verbose_name='Country',
        help_text='Country'
    )
    
    # Legacy field kept for data migration purposes
    address = models.TextField(max_length=500, blank=True, help_text='Legacy address field (deprecated)')
    
    # Social Media Links
    facebook_url = models.URLField(blank=True, help_text='Facebook profile URL', verbose_name='Facebook')
    instagram_url = models.URLField(blank=True, help_text='Instagram profile URL', verbose_name='Instagram')
    twitter_url = models.URLField(blank=True, help_text='Twitter/X profile URL', verbose_name='Twitter/X')
    tiktok_url = models.URLField(blank=True, help_text='TikTok profile URL', verbose_name='TikTok')
    youtube_url = models.URLField(blank=True, help_text='YouTube channel URL', verbose_name='YouTube')
    
    receive_sms_notifications = models.BooleanField(default=False, help_text='Receive SMS notifications for new contests and updates')
    experience_level = models.CharField(
        max_length=20,
        choices=[
            ('beginner', 'Beginner'),
            ('intermediate', 'Intermediate'),
            ('expert', 'Expert'),
            ('professional', 'Professional')
        ],
        default='beginner'
    )
    banner_image = models.ImageField(upload_to='creator_banners/', blank=True, help_text='Profile banner image')
    portfolio_url = models.URLField(blank=True, help_text='Link to your portfolio or showreel')
    social_media_links = models.JSONField(
        default=dict,
        blank=True,
        help_text='Social media links (e.g., YouTube, Vimeo, Instagram)'
    )
    total_earnings = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        default=0,
        help_text='Total earnings from contest wins'
    )
    contest_wins = models.PositiveIntegerField(default=0)
    contest_participations = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = 'Creator Profile'
        verbose_name_plural = 'Creator Profiles'

    @property
    def social_links(self):
        """Backward compatibility for social_media_links"""
        return {
            'facebook': self.facebook_url or '',
            'instagram': self.instagram_url or '',
            'twitter': self.twitter_url or '',
            'tiktok': self.tiktok_url or '',
            'youtube': self.youtube_url or '',
            'portfolio': self.portfolio_url or ''
        }

    def __str__(self):
        name = f"{self.user.first_name} {self.user.last_name}".strip()
        return f"{name or self.user.email}'s Creator Profile"


class Product(models.Model):
    class Status(models.TextChoices):
        AVAILABLE = 'available', _('Available')
        ALL_PICKED = 'all_picked', _('All Picked')
        ARCHIVED = 'archived', _('Archived')

    brand = models.ForeignKey(
        'BrandProfile',
        on_delete=models.CASCADE,
        related_name='products',
        verbose_name=_('Brand Owner')
    )
    contest = models.ForeignKey(
        'contests.Contest',
        on_delete=models.SET_NULL,
        related_name='products',
        null=True,
        blank=True,
        verbose_name=_('Contest')
    )
    name = models.CharField(
        max_length=255,
        verbose_name=_('Product Name')
    )
    sku = models.CharField(
        max_length=100,
        unique=True,
        verbose_name=_('SKU'),
        help_text=_('Stock Keeping Unit')
    )
    description = models.TextField(
        blank=True,
        verbose_name=_('Description')
    )
    price = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        validators=[MinValueValidator(0)],
        verbose_name=_('Price')
    )
    stock_quantity = models.PositiveIntegerField(
        default=0,
        verbose_name=_('Stock Quantity')
    )
    status = models.CharField(
        max_length=20,
        choices=Status.choices,
        default=Status.AVAILABLE,
        verbose_name=_('Status')
    )
    image = models.ImageField(
        upload_to='products/',
        blank=True,
        null=True,
        verbose_name=_('Product Image')
    )
    created_at = models.DateTimeField(
        auto_now_add=True,
        verbose_name=_('Created At')
    )
    updated_at = models.DateTimeField(
        auto_now=True,
        verbose_name=_('Last Updated')
    )

    class Meta:
        verbose_name = _('Product')
        verbose_name_plural = _('Products')
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['sku']),
            models.Index(fields=['status']),
            models.Index(fields=['created_at']),
        ]

    def __str__(self):
        return f"{self.name} ({self.sku})"

    @property
    def is_available(self):
        """Check if the product is available (in stock and active)"""
        return self.status == self.Status.AVAILABLE and self.stock_quantity > 0

    def save(self, *args, **kwargs):
        """Override save to automatically update status based on stock"""
        # Update status based on stock quantity
        if self.stock_quantity <= 0:
            self.status = self.Status.ALL_PICKED
        elif self.status == self.Status.ALL_PICKED and self.stock_quantity > 0:
            self.status = self.Status.AVAILABLE
            
        super().save(*args, **kwargs)

    def reduce_stock(self, quantity=1):
        """
        Reduce the stock quantity by the given amount
        
        Args:
            quantity (int): The quantity to reduce from stock
            
        Returns:
            Product: The updated product instance
            
        Raises:
            ValueError: If quantity is invalid or insufficient stock
        """
        if quantity <= 0:
            raise ValueError("Quantity must be greater than 0")
            
        if self.stock_quantity < quantity:
            raise ValueError(
                f"Insufficient stock. Available: {self.stock_quantity}, "
                f"Requested: {quantity}"
            )
            
        self.stock_quantity -= quantity
        # Save will handle status update
        self.save()
        return self

    def increase_stock(self, quantity=1):
        """
        Increase the stock quantity by the given amount
        
        Args:
            quantity (int): The quantity to add to stock
            
        Returns:
            Product: The updated product instance
            
        Raises:
            ValueError: If quantity is invalid
        """
        if quantity <= 0:
            raise ValueError("Quantity must be greater than 0")
            
        self.stock_quantity += quantity
        # Save will handle status update
        self.save()
        return self
