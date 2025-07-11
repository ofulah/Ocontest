import os
from sib_api_v3_sdk import Configuration, ApiClient, TransactionalSMSApi, SendTransacSms

class SMSNotificationService:
    def __init__(self):
        self.configuration = Configuration()
        self.configuration.api_key['api-key'] = os.getenv('BREVO_API_KEY')
        self.api_client = ApiClient(self.configuration)
        self.api_instance = TransactionalSMSApi(self.api_client)

    def send_sms(self, phone_number, message, sender="OContest"):
        """
        Send SMS using Brevo API
        """
        sms = SendTransacSms(
            sender=sender,
            recipient=phone_number,
            content=message
        )
        try:
            api_response = self.api_instance.send_transac_sms(sms)
            return True, api_response
        except Exception as e:
            return False, str(e)

    def notify_new_contest(self, creator, contest):
        """
        Notify creator about a new contest
        """
        message = f"New contest alert! '{contest.title}' is now open for submissions. Prize: ${contest.prize}. Check it out!"
        return self.send_sms(creator.phone_number, message)

    def notify_submission_selected(self, creator, contest):
        """
        Notify creator that their submission was selected
        """
        message = f"Congratulations! Your submission for '{contest.title}' has been selected. Stay tuned for the final results!"
        return self.send_sms(creator.phone_number, message)

    def notify_submission_rejected(self, creator, contest):
        """
        Notify creator that their submission was rejected
        """
        message = f"Update on '{contest.title}': Unfortunately, your submission wasn't selected this time. Keep creating!"
        return self.send_sms(creator.phone_number, message)

    def notify_contest_won(self, creator, contest):
        """
        Notify creator that they won the contest
        """
        message = f"🎉 Congratulations! You've won the contest '{contest.title}'! Prize: ${contest.prize}. We'll contact you soon with details."
        return self.send_sms(creator.phone_number, message)
