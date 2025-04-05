# Generated by Django 5.1.7 on 2025-04-05 00:06

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('upload', '0007_analysispdata'),
    ]

    operations = [
        migrations.AddField(
            model_name='analysispdata',
            name='thumbnail',
            field=models.ImageField(blank=True, null=True, upload_to='thumbnails/'),
        ),
        migrations.AddField(
            model_name='documentdata',
            name='thumbnail',
            field=models.ImageField(blank=True, null=True, upload_to='thumbnails/'),
        ),
        migrations.AddField(
            model_name='geospatialdata',
            name='thumbnail',
            field=models.ImageField(blank=True, null=True, upload_to='thumbnails/'),
        ),
        migrations.AddField(
            model_name='mapdata',
            name='thumbnail',
            field=models.ImageField(blank=True, null=True, upload_to='thumbnails/'),
        ),
    ]
