# Generated by Django 5.1.7 on 2025-03-29 13:03

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('upload', '0006_alter_documentdata_file_alter_geospatialdata_file_and_more'),
    ]

    operations = [
        migrations.CreateModel(
            name='AnalysispData',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('file', models.FileField(upload_to='analysisuploads/%Y/%m/%d/')),
                ('description', models.TextField()),
                ('date_captured', models.DateField()),
                ('uploaded_at', models.DateTimeField(auto_now_add=True)),
                ('document_data', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='upload.documentdata')),
                ('input_data', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='input_analysis_data', to='upload.geospatialdata')),
                ('map_data', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='upload.mapdata')),
                ('output_data', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='output_analysis_data', to='upload.geospatialdata')),
            ],
        ),
    ]
