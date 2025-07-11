import os
import sib_api_v3_sdk
from sib_api_v3_sdk.rest import ApiException
from django.conf import settings

def send_sms_notification(phone_number, message):
    """
    Send an SMS notification using the Brevo API
    
    Args:
        phone_number (str): The recipient's phone number in international format (e.g., +1234567890)
        message (str): The SMS message content
        
    Returns:
        dict: Response from the Brevo API
    """
    # Configure API key authorization
    configuration = sib_api_v3_sdk.Configuration()
    configuration.api_key['api-key'] = os.getenv('BREVO_API_KEY')
    
    # Create an instance of the API class
    api_instance = sib_api_v3_sdk.TransactionalSMSApi(sib_api_v3_sdk.ApiClient(configuration))
    
    # Create the SMS object
    sms_request = sib_api_v3_sdk.SendTransacSms(
        sender="OContest",  # Sender name
        recipient=phone_number,
        content=message,
        type="transactional"
    )
    
    try:
        # Send the SMS
        api_response = api_instance.send_transac_sms(sms_request)
        return {
            'success': True,
            'message_id': api_response.message_id,
            'sms_count': api_response.sms_count,
            'remaining_credits': api_response.remaining_credits
        }
    except ApiException as e:
        return {
            'success': False,
            'error': f"Exception when calling TransactionalSMSApi->send_transac_sms: {e}"
        }
