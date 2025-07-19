from django.core.management.base import BaseCommand
from django.core.mail import send_mail
from django.conf import settings

class Command(BaseCommand):
    help = 'Sends a test email to verify email settings'

    def add_arguments(self, parser):
        parser.add_argument('email', type=str, help='Email address to send the test email to')

    def handle(self, *args, **options):
        recipient_email = options['email']
        subject = 'Test Email from OContest'
        message = 'This is a test email to verify that email settings are working correctly.'
        from_email = settings.DEFAULT_FROM_EMAIL
        
        self.stdout.write(f"Sending test email to {recipient_email}...")
        
        try:
            send_mail(
                subject,
                message,
                from_email,
                [recipient_email],
                fail_silently=False,
            )
            self.stdout.write(self.style.SUCCESS(f'Successfully sent test email to {recipient_email}'))
        except Exception as e:
            self.stderr.write(self.style.ERROR(f'Error sending email: {str(e)}'))
