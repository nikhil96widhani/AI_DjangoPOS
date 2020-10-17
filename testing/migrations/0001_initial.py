# Generated by Django 3.1.2 on 2020-10-17 01:56

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('inventory', '0006_auto_20201012_0603'),
    ]

    operations = [
        migrations.CreateModel(
            name='testProductVariations',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('quantity', models.IntegerField(blank=True, default=0, null=True)),
                ('date_added', models.DateField(auto_now_add=True)),
                ('cost', models.FloatField()),
                ('mrp', models.FloatField()),
                ('discount_price', models.FloatField(blank=True, null=True)),
                ('weight', models.CharField(blank=True, max_length=100, null=True)),
            ],
        ),
        migrations.CreateModel(
            name='testProduct',
            fields=[
                ('product_code', models.CharField(max_length=20, primary_key=True, serialize=False)),
                ('name', models.CharField(max_length=100)),
                ('description', models.TextField(blank=True, null=True)),
                ('category', models.ManyToManyField(blank=True, to='inventory.ProductCategories')),
                ('variation', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, to='testing.testproductvariations')),
            ],
        ),
    ]