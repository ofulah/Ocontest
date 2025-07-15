from django.contrib import admin
from django.contrib.admin import StackedInline
from django.contrib.auth.admin import UserAdmin
from django.urls import reverse
from django.utils.html import format_html
from django.contrib.auth.forms import UserCreationForm
from django.db import models
from django.db.models import Count
from django import forms
from .models import User, Creator, Brand, CreatorProfile, BrandProfile, Product

class CreatorProfileInline(StackedInline):
    model = CreatorProfile
    can_delete = False
    max_num = 1
    verbose_name = 'Profile'
    verbose_name_plural = 'Profile'
    formfield_overrides = {
        models.ImageField: {'widget': forms.ClearableFileInput(attrs={'accept': 'image/*', 'is_checkcard': True})},
    }
    
    def get_formset(self, request, obj=None, **kwargs):
        formset = super().get_formset(request, obj, **kwargs)
        # Ensure all fields have is_checkcard attribute set to False
        for field in formset.form.base_fields.values():
            if not hasattr(field, 'is_checkcard'):
                field.is_checkcard = False
        return formset
    
    fieldsets = [
        ('Profile Picture', {
            'fields': [('profile_picture', 'profile_picture_preview')],
            'classes': ('wide', 'extrapretty'),
        }),
        ('Personal Information', {
            'fields': [
                'bio',
                'experience_level',
                'portfolio_url',
            ],
            'classes': ('wide',),
        }),
        ('Social Media', {
            'fields': [
                'facebook_url',
                'instagram_url',
                'twitter_url',                
            ],
            'classes': ('collapse', 'wide'),
        }),
        ('Shipping Address', {
            'fields': [
                'shipping_address_line1',
                'shipping_address_line2',
                ('shipping_city', 'shipping_state'),
                ('shipping_postal_code', 'shipping_country')
            ],
            'classes': ['collapse']
        }),
        ('Statistics', {
            'fields': [
                'contest_wins',
                'contest_participations',
                'total_earnings',
                'receive_sms_notifications'
            ],
            'classes': ['collapse']
        })
    ]
    readonly_fields = [
        'profile_picture_preview',
        'contest_wins',
        'contest_participations',
        'total_earnings',
        'social_links_display'
    ]
    
    def profile_picture_preview(self, obj):
        if obj and obj.profile_picture:
            try:
                return format_html(
                    '<div style="margin-bottom: 10px;">'
                    '<img src="{}" style="max-width: 200px; max-height: 200px; border-radius: 50%;" />'
                    '<p>{}</p>'
                    '</div>',
                    obj.profile_picture.url,
                    str(obj.profile_picture)  # Show the file path for debugging
                )
            except Exception as e:
                return f'Error loading image: {str(e)}'
        return 'No profile picture uploaded'
    def social_links_display(self, obj):
        """Display social media links in a user-friendly format"""
        links = []
        if obj.facebook_url:
            links.append(f'<a href="{obj.facebook_url}" target="_blank">Facebook</a>')
        if obj.instagram_url:
            links.append(f'<a href="{obj.instagram_url}" target="_blank">Instagram</a>')
        if obj.twitter_url:
            links.append(f'<a href="{obj.twitter_url}" target="_blank">Twitter/X</a>')
        if obj.tiktok_url:
            links.append(f'<a href="{obj.tiktok_url}" target="_blank">TikTok</a>')
        if obj.youtube_url:
            links.append(f'<a href="{obj.youtube_url}" target="_blank">YouTube</a>')
        if obj.portfolio_url:
            links.append(f'<a href="{obj.portfolio_url}" target="_blank">Portfolio</a>')
        
        if not links:
            return 'No social media links added'
            
        return format_html(' | '.join(links))
    social_links_display.short_description = 'Social Media Links'
    social_links_display.allow_tags = True
    
    profile_picture_preview.short_description = 'Current Profile Preview'
    profile_picture_preview.allow_tags = True

class BrandProfileInline(StackedInline):
    model = BrandProfile
    can_delete = False
    max_num = 1
    min_num = 1
    verbose_name = 'Brand Profile'
    verbose_name_plural = 'Brand Profile'
    
    fieldsets = [
        ('Company Information', {
            'fields': ['company_type', 'bio']
        }),
        ('Contact Details', {
            'fields': ['contact_person', 'contact_email', 'contact_phone', 'physical_address', 'country']
        }),
        ('Online Presence', {
            'fields': ['website_url', 'social_media_links', ('company_logo', 'logo_preview')]
        }),
        ('Statistics', {
            'fields': ['contests_created', 'total_prize_money'],
            'classes': ['collapse']
        })
    ]
    readonly_fields = ['logo_preview', 'contests_created', 'total_prize_money']
    
    def logo_preview(self, obj):
        if obj.company_logo:
            return format_html('<img src="{}" width="150" />', obj.company_logo.url)
        return ''
    logo_preview.short_description = 'Logo Preview'

class BrandCreationForm(UserCreationForm):
    company_name = forms.CharField(
        max_length=100, 
        required=True, 
        label='Brand Name',
        help_text='Name of the brand or company'
    )
    website = forms.URLField(required=False, help_text='Brand website URL')
    industry = forms.CharField(max_length=100, required=False, help_text='Industry or sector (optional)')

    class Meta(UserCreationForm.Meta):
        model = User
        fields = ('email', 'company_name', 'website', 'industry', 'phone_number')

    def save(self, commit=True):
        user = super().save(commit=False)
        user.role = 'brand'
        if commit:
            user.save()
            # Update or create brand profile with company name
            brand_profile, created = BrandProfile.objects.get_or_create(user=user)
            brand_profile.company_name = self.cleaned_data['company_name']
            brand_profile.save()
        return user

@admin.register(Brand)
class BrandAdmin(UserAdmin):
    add_form = BrandCreationForm
    inlines = [BrandProfileInline]

    def get_inline_instances(self, request, obj=None):
        """Hide inline on the add form to avoid creating a second BrandProfile."""
        if obj is None:
            return []
        return super().get_inline_instances(request, obj)
    add_fieldsets = [
        (None, {
            'classes': ['wide'],
            'fields': ['email', 'company_name', 'industry', 'password1', 'password2', 'phone_number']
        }),
    ]
    fieldsets = [
        (None, {
            'fields': ['email', 'password']
        }),
        ('Status', {
            'fields': ['is_verified', 'is_active']
        }),
        ('Important dates', {
            'fields': ['last_login', 'date_joined'],
            'classes': ['collapse']
        }),
    ]
    list_display = ['email', 'get_brand_name', 'is_verified', 'is_active', 'date_joined', 'contest_count']
    list_display_links = ['email', 'get_brand_name']
    list_filter = ['is_verified', 'is_active', 'date_joined']
    search_fields = ['email', 'company_name']
    ordering = ['-date_joined']
    
    def get_brand_name(self, obj):
        # Extract company name from first_name field (format: "Company Name (Industry)")
        if obj.first_name:
            return obj.first_name.split('(')[0].strip()
        return 'No Brand Name'
    get_brand_name.short_description = 'Brand Name'

    def get_queryset(self, request):
        return super().get_queryset(request).filter(role='brand')

    def contest_count(self, obj):
        return obj.created_contests.count()
    contest_count.short_description = 'Contests'

    def has_add_permission(self, request):
        return True

    def save_model(self, request, obj, form, change):
        if not change:  # Only for new brands
            obj.role = 'brand'
        super().save_model(request, obj, form, change)

@admin.register(Creator)
class CreatorAdmin(admin.ModelAdmin):
    filter_horizontal = ('groups', 'user_permissions')
    filter_input_length = 20
    inlines = [CreatorProfileInline]
    
    def get_form(self, request, obj=None, **kwargs):
        form = super().get_form(request, obj, **kwargs)
        # Ensure all fields have is_checkcard attribute set to False
        for field in form.base_fields.values():
            if not hasattr(field, 'is_checkcard'):
                field.is_checkcard = False
        return form
        
    def get_fieldsets(self, request, obj=None):
        if not obj:
            return (
                (None, {
                    'classes': ('wide',),
                    'fields': ('email', 'first_name', 'last_name', 'password1', 'password2')
                }),
            )
        return (
            (None, {
                'fields': ('email', 'password')
            }),
            ('Personal Info', {
                'fields': (
                    ('first_name', 'last_name'),
                    'gender',
                    'phone_number'
                )
            }),
            ('Status', {
                'fields': ('is_verified', 'is_active')
            }),
            ('Important dates', {
                'fields': ('last_login', 'date_joined'),
                'classes': ('collapse',)
            })
        )
    list_display = [
        'email',
        'get_full_name',
        'experience_level',
        'contest_count',
        'win_count',
        'is_verified',
        'date_joined'
    ]
    list_filter = [
        'creator_profile__experience_level',
        'is_verified',
        'is_active',
        'date_joined'
    ]
    search_fields = [
        'email',
        'first_name',
        'last_name',
        'creator_profile__bio'
    ]
    ordering = ['-date_joined']
    
    def get_queryset(self, request):
        qs = super().get_queryset(request)
        return qs.filter(role=User.Role.CREATOR).select_related('creator_profile')
    
    def experience_level(self, obj):
        return obj.creator_profile.experience_level if hasattr(obj, 'creator_profile') else 'N/A'
    experience_level.admin_order_field = 'creator_profile__experience_level'
    
    def contest_count(self, obj):
        return obj.creator_profile.contest_participations if hasattr(obj, 'creator_profile') else 0
    contest_count.short_description = 'Contests'
    
    def win_count(self, obj):
        return obj.creator_profile.contest_wins if hasattr(obj, 'creator_profile') else 0
    win_count.short_description = 'Wins'

    def save_model(self, request, obj, form, change):
        if not change:  # Only for new creators
            obj.role = 'creator'
        super().save_model(request, obj, form, change)
        
    def change_view(self, request, object_id, form_url='', extra_context=None):
        extra_context = extra_context or {}
        extra_context.update({
            'show_save': True,
            'show_save_and_continue': True,
            'show_save_and_add_another': False,
            'show_delete': True,
            'card': False,  # Add this line to fix the template error
            'is_popup': False,  # Ensure popup status is set
            'has_view_permission': self.has_view_permission(request, None),  # Add view permission
            'has_add_permission': self.has_add_permission(request),  # Add add permission
            'has_change_permission': self.has_change_permission(request, None),  # Add change permission
            'has_delete_permission': self.has_delete_permission(request, None),  # Add delete permission
        })
        return super().change_view(
            request, object_id, form_url, extra_context=extra_context,
        )

class BrandProfileChoiceField(forms.ModelChoiceField):
    def label_from_instance(self, obj):
        if obj.company_name:
            return obj.company_name
        # Fallback to user's first_name (legacy storage: "Company (Industry)")
        if obj.user.first_name:
            return obj.user.first_name.split('(')[0].strip()
        return obj.user.email

@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    # Display product ID explicitly
    def product_id(self, obj):
        return obj.id
    product_id.short_description = 'ID'
    product_id.admin_order_field = 'id'
    list_display = ['product_id', 'name', 'sku', 'get_brand_name', 'contest_link', 'price', 'stock_quantity', 'status', 'created_at']
    list_filter = ['status', 'contest__title', 'brand__company_name', 'created_at']
    search_fields = [
        'name', 
        'sku', 
        'description', 
        'brand__company_name',
        'contest__title'
    ]
    list_editable = ['price', 'stock_quantity', 'status']
    readonly_fields = ['created_at', 'updated_at', 'get_brand_name', 'contest_link']
    autocomplete_fields = ['contest']
    raw_id_fields = ['brand']
    
    fieldsets = [
        ('Product Information', {
            'fields': [
                'name', 
                'sku', 
                'brand',
                'get_brand_name', 
                'contest',
                'contest_link',
                'description', 
                'price', 
                'image'
            ]
        }),
        ('Inventory', {
            'fields': [
                'stock_quantity', 
                'status'
            ]
        }),
        ('Metadata', {
            'fields': ['created_at', 'updated_at'],
            'classes': ['collapse']
        })
    ]

    def get_queryset(self, request):
        qs = super().get_queryset(request).select_related('brand', 'brand__user')
        if request.user.is_superuser:
            return qs
        # For brand users, only show their own products
        return qs.filter(brand__user=request.user)
    
    def get_brand_name(self, obj):
        return obj.brand.company_name if obj.brand else '-'
        
    def contest_link(self, obj):
        if obj.contest:
            url = reverse('admin:contests_contest_change', args=[obj.contest.id])
            return format_html('<a href="{}">{}</a>', url, obj.contest.title)
        return 'No contest'
    contest_link.short_description = 'Contest (Link)'
    contest_link.admin_order_field = 'contest__title'

    get_brand_name.short_description = 'Brand Owner'
    get_brand_name.admin_order_field = 'brand__company_name'
    
    def formfield_for_foreignkey(self, db_field, request, **kwargs):
        if db_field.name == 'brand':
            field = forms.ModelChoiceField(
                queryset=BrandProfile.objects.all().order_by('company_name'),
                required=True,
                label='Brand',
                empty_label='Select a brand'
            )
            field.label_from_instance = lambda obj: obj.company_name if obj.company_name else (
                obj.user.first_name.split('(')[0].strip() if obj.user.first_name else obj.user.email
            )
            return field
        return super().formfield_for_foreignkey(db_field, request, **kwargs)


@admin.register(User)
class CustomUserAdmin(UserAdmin):
    def get_queryset(self, request):
        # Include both admin users and creators in the User admin
        # This allows creator popups to work correctly when accessed via User admin URLs
        return super().get_queryset(request).filter(role__in=['admin', 'creator'])

    list_display = ['email', 'get_full_name', 'role', 'is_verified', 'is_active', 'date_joined']
    list_filter = ['is_verified', 'is_active', 'is_staff', 'date_joined']
    search_fields = ['email', 'first_name', 'last_name']
    ordering = ['-date_joined']
    
    def get_fieldsets(self, request, obj=None):
        if not obj:
            return self.add_fieldsets

        if obj.role == 'creator':
            try:
                creator_profile = obj.creator_profile
                return [
                    ('Creator Information', {
                        'fields': ['email', ('first_name', 'last_name'), 'phone_number'],
                        'description': 'Basic creator information'
                    }),
                    ('Profile Details', {
                        'fields': ['profile_preview', 'experience_preview', 'stats_preview', 'profile_picture_preview'],
                        'description': 'Creator profile details'
                    }),
                    ('Account Status', {
                        'fields': ['role', 'is_verified', 'is_active', 'date_joined'],
                        'description': 'Account status and verification'
                    })
                ]
            except CreatorProfile.DoesNotExist:
                pass

        # For all other roles (including admin, brand etc.)
        return  (
            (None, {
                'fields': ('email', 'password')
            }),
            ('Personal Info', {
                'fields': (
                    ('first_name', 'last_name'),
                    'gender',
                    'phone_number'
                )
            }),
            ('Permissions', {
                'fields': ('role', 'is_verified', 'is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions')
            }),
            ('Important dates', {
                'fields': ('last_login', 'date_joined')
            })
        )
    
    def profile_preview(self, obj):
        try:
            profile = obj.creator_profile
            return format_html('<div style="margin-bottom: 10px;"><strong>Bio:</strong><br>{}<br><br><strong>Country:</strong> {}<br><strong>Portfolio:</strong> <a href="{}" target="_blank">{}</a></div>', profile.bio or 'No bio provided', profile.country or 'Not specified', profile.portfolio_url or '#', profile.portfolio_url or 'No portfolio link')
        except CreatorProfile.DoesNotExist:
            return 'No profile information available'
    profile_preview.short_description = 'Profile Information'
    
    def experience_preview(self, obj):
        try:
            profile = obj.creator_profile
            specialties = ', '.join(profile.specialties) if profile.specialties else 'None specified'
            return format_html('<div style="margin-bottom: 10px;"><strong>Experience Level:</strong> {}<br><strong>Specialties:</strong><br>{}</div>', profile.get_experience_level_display(), specialties)
        except CreatorProfile.DoesNotExist:
            return 'No experience information available'
    experience_preview.short_description = 'Experience & Skills'
    
    def stats_preview(self, obj):
        try:
            profile = obj.creator_profile
            return format_html('<div style="margin-bottom: 10px;"><strong>Contest Wins:</strong> {}<br><strong>Contest Participations:</strong> {}<br><strong>Total Earnings:</strong> ${:,.2f}</div>', profile.contest_wins, profile.contest_participations, profile.total_earnings)
        except CreatorProfile.DoesNotExist:
            return 'No statistics available'
    stats_preview.short_description = 'Creator Statistics'
    
    def profile_picture_preview(self, obj):
        try:
            profile = obj.creator_profile
            if profile.profile_picture:
                return format_html('<img src="{}" style="max-width: 200px; border-radius: 5px;" />', profile.profile_picture.url)
            return 'No profile picture uploaded'
        except CreatorProfile.DoesNotExist:
            return 'No profile picture available'
    profile_picture_preview.short_description = 'Profile Picture'
    
    readonly_fields = ['profile_preview', 'experience_preview', 'stats_preview', 'profile_picture_preview']
    
    add_fieldsets = [
        (None, {
            'classes': ['wide'],
            'fields': ['email', 'password1', 'password2', 'role', 'is_staff', 'is_active']
        })
    ]
