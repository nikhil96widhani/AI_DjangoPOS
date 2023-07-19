# Generated by Django 3.1.2 on 2022-02-26 23:34

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('inventory', '0003_auto_20210912_1349'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='product',
            name='description',
        ),
        migrations.AddField(
            model_name='productvariation',
            name='description',
            field=models.TextField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='productvariation',
            name='image',
            field=models.ImageField(blank=True, default='images/default.jpg', null=True, upload_to='images/'),
        ),
        migrations.AddField(
            model_name='productvariation',
            name='variation_name',
            field=models.CharField(max_length=30, null=True),
        ),
    ]
