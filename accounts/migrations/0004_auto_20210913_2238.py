# Generated by Django 3.1.2 on 2021-09-13 22:38

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('accounts', '0003_auto_20210913_2236'),
    ]

    operations = [
        migrations.AlterField(
            model_name='siteconfiguration',
            name='shop_logo',
            field=models.ImageField(blank=True, default='images/default_logo.png', null=True, upload_to='images/'),
        ),
    ]
