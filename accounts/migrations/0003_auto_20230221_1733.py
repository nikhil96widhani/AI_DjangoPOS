# Generated by Django 3.1.2 on 2023-02-21 17:33

import ckeditor.fields
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('accounts', '0002_siteconfiguration_shop_logo'),
    ]

    operations = [
        migrations.AddField(
            model_name='siteconfiguration',
            name='about_us',
            field=ckeditor.fields.RichTextField(blank=True, default='<li>Welcome to our website.</li>', null=True),
        ),
        migrations.AddField(
            model_name='siteconfiguration',
            name='facebook',
            field=models.URLField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='siteconfiguration',
            name='instagram',
            field=models.URLField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='siteconfiguration',
            name='twitter',
            field=models.URLField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='siteconfiguration',
            name='youtube',
            field=models.URLField(blank=True, null=True),
        ),
    ]
