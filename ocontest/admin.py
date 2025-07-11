from django.contrib import admin
from django.contrib.admin import AdminSite
from django.contrib.admin.models import LogEntry
from django.urls import NoReverseMatch, reverse
from django.utils.text import capfirst
from django.db.models import Count, Sum
from django.utils.html import format_html
from accounts.models import User, CreatorProfile
from contests.models import Contest, Submission

class OContestAdminSite(AdminSite):
    site_header = 'OContest Administration'
    site_title = 'OContest Admin Portal'
    index_title = 'Platform Administration'

    def get_app_list(self, request):
        app_list = super().get_app_list(request)
        
        # Get statistics
        total_creators = User.objects.filter(role='creator').count()
        total_brands = User.objects.filter(role='brand').count()
        total_contests = Contest.objects.count()
        total_submissions = Submission.objects.count()
        active_contests = Contest.objects.filter(status='active').count()
        total_prize_money = Contest.objects.aggregate(Sum('prize'))['prize__sum'] or 0
        
        # Get top statistics
        top_creators = CreatorProfile.objects.order_by('-contest_wins')[:5]
        top_contests = Contest.objects.annotate(
            num_submissions=Count('submissions')
        ).order_by('-num_submissions')[:5]

        # Create custom HTML for the dashboard
        custom_dashboard = f'''
        <div style="padding: 20px;">
            <h2 style="color: #2c3e50;">Platform Overview</h2>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 20px; margin-top: 20px;">
                <div style="background: #3498db; color: white; padding: 20px; border-radius: 8px;">
                    <h3 style="margin: 0;">Creators</h3>
                    <p style="font-size: 24px; margin: 10px 0;">{total_creators}</p>
                </div>
                <div style="background: #2ecc71; color: white; padding: 20px; border-radius: 8px;">
                    <h3 style="margin: 0;">Brands</h3>
                    <p style="font-size: 24px; margin: 10px 0;">{total_brands}</p>
                </div>
                <div style="background: #e74c3c; color: white; padding: 20px; border-radius: 8px;">
                    <h3 style="margin: 0;">Total Contests</h3>
                    <p style="font-size: 24px; margin: 10px 0;">{total_contests}</p>
                </div>
                <div style="background: #9b59b6; color: white; padding: 20px; border-radius: 8px;">
                    <h3 style="margin: 0;">Active Contests</h3>
                    <p style="font-size: 24px; margin: 10px 0;">{active_contests}</p>
                </div>
                <div style="background: #f1c40f; color: white; padding: 20px; border-radius: 8px;">
                    <h3 style="margin: 0;">Total Submissions</h3>
                    <p style="font-size: 24px; margin: 10px 0;">{total_submissions}</p>
                </div>
                <div style="background: #e67e22; color: white; padding: 20px; border-radius: 8px;">
                    <h3 style="margin: 0;">Total Prize Money</h3>
                    <p style="font-size: 24px; margin: 10px 0;">${total_prize_money:,.2f}</p>
                </div>
            </div>

            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(400px, 1fr)); gap: 20px; margin-top: 40px;">
                <div style="background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                    <h3 style="color: #2c3e50; margin-top: 0;">Top Creators</h3>
                    <table style="width: 100%; border-collapse: collapse;">
                        <tr style="border-bottom: 1px solid #eee;">
                            <th style="text-align: left; padding: 10px;">Creator</th>
                            <th style="text-align: right; padding: 10px;">Wins</th>
                        </tr>
                        {''.join(f"""
                        <tr style="border-bottom: 1px solid #eee;">
                            <td style="padding: 10px;">{creator.user.email}</td>
                            <td style="text-align: right; padding: 10px;">{creator.contest_wins}</td>
                        </tr>
                        """ for creator in top_creators)}
                    </table>
                </div>

                <div style="background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                    <h3 style="color: #2c3e50; margin-top: 0;">Most Active Contests</h3>
                    <table style="width: 100%; border-collapse: collapse;">
                        <tr style="border-bottom: 1px solid #eee;">
                            <th style="text-align: left; padding: 10px;">Contest</th>
                            <th style="text-align: right; padding: 10px;">Submissions</th>
                        </tr>
                        {''.join(f"""
                        <tr style="border-bottom: 1px solid #eee;">
                            <td style="padding: 10px;">{contest.title}</td>
                            <td style="text-align: right; padding: 10px;">{contest.num_submissions}</td>
                        </tr>
                        """ for contest in top_contests)}
                    </table>
                </div>
            </div>
        </div>
        '''

        # Insert the dashboard at the beginning of the app_list
        if app_list:
            app_list[0]['models'].insert(0, {
                'name': 'Dashboard',
                'object_name': 'Dashboard',
                'admin_url': '#',
                'view_only': True,
                'custom_html': custom_dashboard,
            })

        return app_list

    def index(self, request, extra_context=None):
        extra_context = extra_context or {}
        return super().index(request, extra_context)

class LogEntryAdmin(admin.ModelAdmin):
    list_display = ('__str__', 'action_time', 'user', 'content_type', 'object_repr', 'change_message')
    list_filter = ['action_time', 'content_type']
    search_fields = ['user__username', 'object_repr', 'change_message']
    date_hierarchy = 'action_time'
    readonly_fields = ('action_time', 'user', 'content_type', 'object_id', 'object_repr', 'action_flag', 'change_message')
    
    def has_add_permission(self, request):
        return False
    
    def has_change_permission(self, request, obj=None):
        return False
    
    def has_delete_permission(self, request, obj=None):
        return request.user.is_superuser

admin_site = OContestAdminSite(name='admin')
admin_site.register(LogEntry, LogEntryAdmin)
