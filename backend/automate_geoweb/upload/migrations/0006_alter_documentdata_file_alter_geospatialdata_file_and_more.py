# Generated by Django 5.1.7 on 2025-03-25 17:40

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('upload', '0005_mapdata'),
    ]

    operations = [
        migrations.AlterField(
            model_name='documentdata',
            name='file',
            field=models.FileField(upload_to='documentuploads/%Y/%m/%d/'),
        ),
        migrations.AlterField(
            model_name='geospatialdata',
            name='file',
            field=models.FileField(upload_to='geotiffs/%Y/%m/%d/'),
        ),
        migrations.AlterField(
            model_name='mapdata',
            name='file',
            field=models.FileField(upload_to='mapuploads/%Y/%m/%d/'),
        ),
    ]
