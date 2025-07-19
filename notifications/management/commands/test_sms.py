from django.core.management.base import BaseCommand
from notifications.sms_service import send_sms_notification

class Command(BaseCommand):
    help = 'Send a test SMS message using the Brevo API'

    def add_arguments(self, parser):
        parser.add_argument('phone_number', type=str, help='Phone number to send the test SMS to (e.g., +254720530331)')
        parser.add_argument('--message', type=str, default='This is a test message from OContest', 
                          help='Custom message to send (default: "This is a test message from OContest")')

    def handle(self, *args, **options):
        phone_number = options['phone_number']
        message = options['message']
        
        self.stdout.write(f"Sending SMS to {phone_number}...")
        self.stdout.write(f"Message: {message}")
        
        response = send_sms_notification(phone_number, message)
        
        if response['success']:
            self.stdout.write(
                self.style.SUCCESS(
                    f"SMS sent successfully!\n"
                    f"Message ID: {response['message_id']}\n"
                    f"SMS Count: {response['sms_count']}\n"
                    f"Remaining Credits: {response['remaining_credits']}"
                )
            )
        else:
            self.stderr.write(
                self.style.ERROR(
                    f"Failed to send SMS: {response['error']}"
                )
            )
