from django.views.generic import TemplateView
from django.db.models import Count, Sum
from django.db.models.functions import TruncMonth
from django.utils import timezone
from datetime import timedelta
import json
from decimal import Decimal
from accounts.models import User, CreatorProfile
from contests.models import Contest, Submission

class DecimalEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, Decimal):
            return float(obj)
        return super().default(obj)

class StatsView(TemplateView):
    template_name = 'admin/stats.html'

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        
        # Get date range (last 12 months)
        end_date = timezone.now()
        start_date = end_date - timedelta(days=365)
        
        # Users by month
        users_by_month = (
            User.objects.filter(date_joined__range=(start_date, end_date))
            .annotate(month=TruncMonth('date_joined'))
            .values('month', 'role')
            .annotate(count=Count('id'))
            .order_by('month', 'role')
        )

        # Contests by month
        contests_by_month = (
            Contest.objects.filter(created_at__range=(start_date, end_date))
            .annotate(month=TruncMonth('created_at'))
            .values('month')
            .annotate(count=Count('id'), total_prize=Sum('prize'))
            .order_by('month')
        )

        # Submissions by month
        submissions_by_month = (
            Submission.objects.filter(created_at__range=(start_date, end_date))
            .annotate(month=TruncMonth('created_at'))
            .values('month')
            .annotate(count=Count('id'))
            .order_by('month')
        )

        # Top creators
        top_creators = (
            CreatorProfile.objects.all()
            .select_related('user')
            .order_by('-contest_wins')[:10]
            .values('user__email', 'contest_wins', 'total_earnings')
        )

        # Format data for charts
        months = []
        creators_data = []
        brands_data = []
        contests_data = []
        prize_data = []
        submissions_data = []

        for i in range(12):
            month = end_date - timedelta(days=30 * i)
            month_str = month.strftime('%Y-%m')
            months.insert(0, month.strftime('%b %Y'))
            creators_data.insert(0, 0)
            brands_data.insert(0, 0)
            contests_data.insert(0, 0)
            prize_data.insert(0, 0)
            submissions_data.insert(0, 0)

        for entry in users_by_month:
            month_str = entry['month'].strftime('%b %Y')
            if month_str in months:
                idx = months.index(month_str)
                if entry['role'] == 'creator':
                    creators_data[idx] = entry['count']
                elif entry['role'] == 'brand':
                    brands_data[idx] = entry['count']

        for entry in contests_by_month:
            month_str = entry['month'].strftime('%b %Y')
            if month_str in months:
                idx = months.index(month_str)
                contests_data[idx] = entry['count']
                prize_data[idx] = float(entry['total_prize'])

        for entry in submissions_by_month:
            month_str = entry['month'].strftime('%b %Y')
            if month_str in months:
                idx = months.index(month_str)
                submissions_data[idx] = entry['count']

        # Current totals
        # Prepare chart data as JSON
        chart_data = json.dumps({
            'months': months,
            'creators': creators_data,
            'brands': brands_data,
            'contests': contests_data,
            'prize_money': prize_data,
            'submissions': submissions_data
        }, cls=DecimalEncoder)

        # Update context with all data
        context.update({
            'total_creators': User.objects.filter(role='creator').count(),
            'total_brands': User.objects.filter(role='brand').count(),
            'total_contests': Contest.objects.count(),
            'total_submissions': Submission.objects.count(),
            'total_prize_money': Contest.objects.aggregate(Sum('prize'))['prize__sum'] or 0,
            'chart_data': chart_data,
            'top_creators': list(top_creators)
        })
        
        return context
