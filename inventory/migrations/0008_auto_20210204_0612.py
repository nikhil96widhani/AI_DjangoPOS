# Generated by Django 3.1.2 on 2021-02-04 06:12

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('inventory', '0007_auto_20210204_0550'),
    ]

    operations = [
        migrations.AlterField(
            model_name='stockbillitems',
            name='name',
            field=models.CharField(blank=True, max_length=100, null=True),
        ),
        migrations.AlterField(
            model_name='stockbillitems',
            name='product_code',
            field=models.CharField(blank=True, max_length=30, null=True),
        ),
        migrations.AlterField(
            model_name='stockbillitems',
            name='stock',
            field=models.IntegerField(blank=True, default=0, null=True),
        ),
    ]