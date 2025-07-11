from django.contrib import admin
from django.utils import timezone
from .models import Video

@admin.register(Video)
class VideoAdmin(admin.ModelAdmin):
    list_display = ['title', 'creator', 'category', 'approval_status', 'created_at']
    list_filter = ['approval_status', 'category', 'created_at']
    search_fields = ['title', 'description', 'creator__username']
    readonly_fields = ['created_at', 'updated_at', 'views', 'likes']
    actions = ['approve_videos', 'reject_videos']

    fieldsets = [
        ('Basic Information', {
            'fields': ['title', 'description', 'creator', 'category']
        }),
        ('Media', {
            'fields': ['url', 'thumbnail', 'duration']
        }),
        ('Approval', {
            'fields': ['approval_status', 'approval_date', 'approval_notes']
        }),
        ('Statistics', {
            'fields': ['views', 'likes', 'is_featured']
        }),
        ('Relations', {
            'fields': ['contest', 'submission']
        }),
        ('Timestamps', {
            'fields': ['created_at', 'updated_at'],
            'classes': ['collapse']
        })
    ]

    def approve_videos(self, request, queryset):
        queryset.update(
            approval_status=Video.ApprovalStatus.APPROVED,
            approval_date=timezone.now(),
            # Video is approved
        )
    approve_videos.short_description = 'Approve selected videos'

    def reject_videos(self, request, queryset):
        queryset.update(
            approval_status=Video.ApprovalStatus.REJECTED,
            approval_date=timezone.now()
        )
    reject_videos.short_description = 'Reject selected videos'


