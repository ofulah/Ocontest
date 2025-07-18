# Generated by Django 5.2.3 on 2025-06-27 15:12

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('accounts', '0003_creatorprofile_banner_image'),
    ]

    operations = [
        migrations.AddField(
            model_name='brandprofile',
            name='bio',
            field=models.TextField(blank=True, max_length=1000),
        ),
        migrations.AddField(
            model_name='brandprofile',
            name='country',
            field=models.CharField(blank=True, max_length=100),
        ),
        migrations.AddField(
            model_name='brandprofile',
            name='industry_type',
            field=models.CharField(blank=True, max_length=100),
        ),
        migrations.AddField(
            model_name='brandprofile',
            name='profile_picture',
            field=models.ImageField(blank=True, upload_to='brand_logos/'),
        ),
        migrations.AddField(
            model_name='brandprofile',
            name='website_url',
            field=models.URLField(blank=True),
        ),
    ]
