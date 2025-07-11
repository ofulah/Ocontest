from django.db import migrations, models

class Migration(migrations.Migration):
    dependencies = [
        ('accounts', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='creatorprofile',
            name='address',
            field=models.TextField(blank=True, help_text='Your physical address', max_length=500),
        ),
    ]
