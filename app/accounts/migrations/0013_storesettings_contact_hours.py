# Generated by Django 3.1.2 on 2023-04-05 22:32

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('accounts', '0012_auto_20230404_2309'),
    ]

    operations = [
        migrations.AddField(
            model_name='storesettings',
            name='contact_hours',
            field=models.CharField(blank=True, default='(9-13 and 14-18 ; Mon-Fri)', max_length=255, null=True),
        ),
    ]
