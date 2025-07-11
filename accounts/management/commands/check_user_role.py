from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model

User = get_user_model()

class Command(BaseCommand):
    help = 'Check and display user roles'

    def handle(self, *args, **kwargs):
        users = User.objects.all()
        self.stdout.write('Users and their roles:')
        for user in users:
            self.stdout.write(f'Email: {user.email}, Role: {user.role}')
