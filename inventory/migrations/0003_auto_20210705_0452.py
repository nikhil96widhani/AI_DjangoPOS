# Generated by Django 3.1.2 on 2021-07-05 04:52

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('inventory', '0002_auto_20210407_0656'),
    ]

    operations = [
        migrations.AlterField(
            model_name='productvariation',
            name='quantity',
            field=models.IntegerField(blank=True, default=0, null=True),
        ),
    ]