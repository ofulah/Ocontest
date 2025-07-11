from django.contrib import admin
from django.utils.html import format_html
from django.db.models import Count, Sum, Avg
from django.urls import path, reverse
from django.shortcuts import render
from django.contrib import messages
from django.db.models import F
from django.templatetags.static import static
from .models import Contest, Submission, ContestApplication
from accounts.models import Product
from notifications.services import create_notification
from notifications.models import Notification

class SubmissionInline(admin.TabularInline):
    model = Submission
    extra = 0
    fields = ['title', 'creator', 'status', 'video_preview', 'thumbnail_preview']
    readonly_fields = ['video_preview', 'thumbnail_preview']
    show_change_link = True
    
    def video_preview(self, obj):
        if obj.video_file:
            return format_html('<video width="150" controls><source src="{}" type="video/mp4"></video>', obj.video_file.url)
        return ''
    video_preview.short_description = 'Video'

    def thumbnail_preview(self, obj):
        if obj.thumbnail:
            return format_html('<img src="{}" width="100" />', obj.thumbnail.url)
        return ''
    thumbnail_preview.short_description = 'Thumbnail'

@admin.register(Contest)
class ContestAdmin(admin.ModelAdmin):
    inlines = [SubmissionInline]
    list_display = ['id', 'title', 'brand', 'prize', 'deadline', 'status', 'is_featured', 'view_count', 'submission_count', 'days_until_deadline']
    list_display_links = ['id', 'title']  # Make both ID and title clickable
    list_filter = ['status', 'is_featured', 'deadline', 'region', 'language']
    search_fields = ['title', 'description', 'brand__email', 'brand__company_name']
    readonly_fields = ['id', 'view_count', 'submission_count', 'created_at', 'updated_at', 'thumbnail_preview', 'days_until_deadline']
    list_editable = ['status', 'is_featured']
    actions = ['make_featured', 'make_unfeatured', 'mark_as_live', 'mark_as_draft', 'mark_as_completed']
    ordering = ['-created_at']
    fieldsets = [
        ('Basic Information', {
            'fields': [('id',), 'title', 'description', 'brand', 'prize', 'deadline'],
            'description': 'Enter the basic details of the contest.'
        }),
        ('Contest Requirements', {
            'fields': ['brief', 'inspiration', 'rules'],
            'description': 'Specify what you want from creators, any inspiration, and contest rules.'
        }),
        ('Settings', {
            'fields': ['region', 'language', 'max_entries'],
            'description': 'Configure contest settings and limitations.'
        }),
        ('Status & Display', {
            'fields': ['status', 'is_featured', ('thumbnail', 'thumbnail_preview')],
            'description': 'Manage the contest status and visibility.'
        }),
        ('Statistics', {
            'fields': ['view_count', 'submission_count', 'created_at', 'updated_at'],
            'classes': ['collapse'],
            'description': 'View contest performance metrics.'
        })
    ]

    def get_urls(self):
        urls = super().get_urls()
        custom_urls = [
            path('analytics/', self.admin_site.admin_view(self.analytics_view), name='contest-analytics'),
        ]
        return custom_urls + urls

    def analytics_view(self, request):
        # Get contest statistics
        total_contests = Contest.objects.count()
        active_contests = Contest.objects.filter(status='live').count()
        total_prize_money = Contest.objects.aggregate(total=Sum('prize'))['total'] or 0
        avg_submissions = Contest.objects.annotate(sub_count=Count('submissions')).aggregate(avg=Avg('sub_count'))['avg'] or 0

        # Get top contests by submissions
        top_contests = Contest.objects.annotate(
            sub_count=Count('submissions')
        ).order_by('-sub_count')[:5]

        context = {
            'title': 'Contest Analytics',
            'total_contests': total_contests,
            'active_contests': active_contests,
            'total_prize_money': total_prize_money,
            'avg_submissions': round(avg_submissions, 2),
            'top_contests': top_contests,
            'opts': self.model._meta,
        }

        return render(request, 'admin/contest_analytics.html', context)

    def days_until_deadline(self, obj):
        if obj.deadline:
            from django.utils import timezone
            now = timezone.now()
            days = (obj.deadline - now).days
            if days > 0:
                return f'{days} days'
            elif days == 0:
                return 'Today'
            return 'Expired'
        return 'No deadline'
    days_until_deadline.short_description = 'Time Left'

    def make_featured(self, request, queryset):
        queryset.update(is_featured=True)
        self.message_user(request, f'{queryset.count()} contests were marked as featured.')
    make_featured.short_description = 'Mark selected contests as featured'

    def make_unfeatured(self, request, queryset):
        queryset.update(is_featured=False)
        self.message_user(request, f'{queryset.count()} contests were unmarked as featured.')
    make_unfeatured.short_description = 'Mark selected contests as not featured'

    def mark_as_live(self, request, queryset):
        queryset.update(status='live')
        self.message_user(request, f'{queryset.count()} contests were marked as live.')
    mark_as_live.short_description = 'Set status to Live'

    def mark_as_draft(self, request, queryset):
        queryset.update(status='draft')
        self.message_user(request, f'{queryset.count()} contests were marked as draft.')
    mark_as_draft.short_description = 'Set status to Draft'

    def mark_as_completed(self, request, queryset):
        queryset.update(status='completed')
        self.message_user(request, f'{queryset.count()} contests were marked as completed.')
    mark_as_completed.short_description = 'Set status to Completed'

    def thumbnail_preview(self, obj):
        if obj.thumbnail:
            return format_html('<img src="{}" width="150" />', obj.thumbnail.url)
        return ''
    thumbnail_preview.short_description = 'Thumbnail Preview'

    def submission_count(self, obj):
        return obj.submissions.count()
    submission_count.short_description = 'Submissions'

@admin.register(ContestApplication)
class ContestApplicationAdmin(admin.ModelAdmin):
    list_display = ['id', 'creator_with_popup', 'contest', 'status', 'shipping_address_display', 'product_display', 'terms_accepted', 'created_at']
    list_filter = ['status', 'terms_accepted', 'created_at', 'shipping_country']
    search_fields = [
        'creator__email', 
        'contest__title', 
        'notes',
        'shipping_address_line1',
        'shipping_city',
        'shipping_postal',
        'product__name',
        'full_name'
    ]
    readonly_fields = ['created_at', 'updated_at', 'shipping_address_display', 'product_display']
    actions = ['approve_applications', 'reject_applications']
    ordering = ['-created_at']
    
    def creator_with_popup(self, obj):
        if not obj.creator:
            return "No creator"
        url = reverse('admin:accounts_user_change', args=[obj.creator.id])
        return format_html('<a href="{}" target="_blank">{}</a>', url, obj.creator.email)
    creator_with_popup.short_description = 'Creator'
    creator_with_popup.admin_order_field = 'creator'
    
    def shipping_address_display(self, obj):
        if not obj.shipping_address_line1:
            return "No address provided"
        address_parts = [
            obj.shipping_address_line1,
            obj.shipping_city,
            obj.shipping_state,
            obj.shipping_postal,
            obj.shipping_country
        ]
        return ', '.join(filter(None, address_parts))
    shipping_address_display.short_description = 'Shipping Address'
    
    def product_display(self, obj):
        if not obj.product:
            return "No product selected"
        url = reverse('admin:accounts_product_change', args=[obj.product.id])
        return format_html('<a href="{}" target="_blank">{}</a>', url, obj.product.name)
    product_display.short_description = 'Product'
    
    def formfield_for_foreignkey(self, db_field, request, **kwargs):
        if db_field.name == 'product':
            # Get the contest_id from the URL or the current object
            contest_id = None
            if request.resolver_match:
                object_id = request.resolver_match.kwargs.get('object_id')
                if object_id:
                    try:
                        application = self.get_object(request, object_id)
                        if application and application.contest:
                            contest_id = application.contest.id
                    except:
                        pass
                
                # If no contest_id from the object, try to get it from the URL
                if not contest_id and 'contest_id' in request.GET:
                    contest_id = request.GET.get('contest_id')
            
            # Filter products by contest if we have a contest_id
            if contest_id:
                kwargs['queryset'] = Product.objects.filter(contest_id=contest_id)
            else:
                # If no contest_id, show no products to avoid confusion
                kwargs['queryset'] = Product.objects.none()
                
        return super().formfield_for_foreignkey(db_field, request, **kwargs)
    
    fieldsets = [
        ('Application Details', {
            'fields': [
                'contest', 
                'creator', 
                'status', 
                'terms_accepted',
                'full_name'
            ]
        }),
        ('Product Information', {
            'fields': ['product', 'product_display']
        }),
        ('Shipping Information', {
            'fields': [
                'shipping_address_display',
                'shipping_address_line1',
                'shipping_city',
                'shipping_state',
                'shipping_postal',
                'shipping_country'
            ]
        }),
        ('Notes & Feedback', {
            'fields': ['notes']
        }),
        ('Timestamps', {
            'fields': ['created_at', 'updated_at'],
            'classes': ('collapse',)
        })
    ]

    def approve_applications(self, request, queryset):
        # First, update the status
        updated = queryset.update(status='approved')
        
        # Then create notifications for each approved application
        for application in queryset:
            create_notification(
                recipient=application.creator,
                notification_type=Notification.NotificationType.APPLICATION_APPROVED,
                title=f'Application Approved: {application.contest.title}',
                message=f'Your application for the contest "{application.contest.title}" has been approved. You can now submit your video!',
                related_object=application.contest
            )

        self.message_user(
            request,
            f'{updated} application(s) were successfully approved.',
            messages.SUCCESS
        )
    approve_applications.short_description = 'Approve selected applications'

    def reject_applications(self, request, queryset):
        # First, update the status
        updated = queryset.update(status='rejected')
        
        # Then create notifications for each rejected application
        for application in queryset:
            create_notification(
                recipient=application.creator,
                notification_type=Notification.NotificationType.APPLICATION_REJECTED,
                title=f'Application Rejected: {application.contest.title}',
                message=f'Your application for the contest "{application.contest.title}" has been rejected.',
                related_object=application.contest
            )

        self.message_user(
            request,
            f'{updated} application(s) were rejected.',
            messages.WARNING
        )
    reject_applications.short_description = 'Reject selected applications'

@admin.register(Submission)
class SubmissionAdmin(admin.ModelAdmin):
    list_display = ['title', 'contest', 'creator', 'status', 'video_preview', 'thumbnail_preview', 'created_at']
    list_filter = ['status', 'contest', 'created_at']
    search_fields = ['title', 'description', 'creator__email', 'contest__title', 'tags']
    readonly_fields = ['created_at', 'updated_at', 'video_preview', 'thumbnail_preview']
    
    fieldsets = [
        ('Basic Information', {
            'fields': ['title', 'description', 'contest', 'creator']
        }),
        ('Media', {
            'fields': [('video_file', 'video_preview'), ('thumbnail', 'thumbnail_preview')]
        }),
        ('Status & Feedback', {
            'fields': ['status', 'feedback', 'tags']
        }),
        ('Timestamps', {
            'fields': ['created_at', 'updated_at']
        })
    ]

    def video_preview(self, obj):
        if obj.video_file:
            return format_html('<video width="200" controls><source src="{}" type="video/mp4"></video>', obj.video_file.url)
        return ''
    video_preview.short_description = 'Video'

    def thumbnail_preview(self, obj):
        if obj.thumbnail:
            return format_html('<img src="{}" width="100" />', obj.thumbnail.url)
        return ''
    thumbnail_preview.short_description = 'Thumbnail'
