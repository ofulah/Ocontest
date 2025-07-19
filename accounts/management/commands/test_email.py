from django.core.management.base import BaseCommand
from django.core.mail import send_mail
from django.conf import settings

class Command(BaseCommand):
    help = 'Send a test email to verify email configuration'

    def handle(self, *args, **options):
        subject = 'Test Email from OContest'
        message = 'This is a test email to verify the email configuration.'
        from_email = settings.DEFAULT_FROM_EMAIL
        recipient_list = [settings.DEFAULT_FROM_EMAIL]  # Send to self for testing

        try:
            send_mail(
                subject=subject,
                message=message,
                from_email=from_email,
                recipient_list=recipient_list,
                fail_silently=False,
            )
            self.stdout.write(self.style.SUCCESS('Test email sent successfully!'))
            self.stdout.write(self.style.SUCCESS(f'From: {from_email}'))
            self.stdout.write(self.style.SUCCESS(f'To: {recipient_list}'))
        except Exception as e:
            self.stderr.write(self.style.ERROR(f'Error sending test email: {str(e)}'))
