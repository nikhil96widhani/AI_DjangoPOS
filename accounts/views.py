from django.shortcuts import render, redirect
from django.views.generic import CreateView
from django.http import HttpResponseRedirect
from .models import *
from .forms import *
from django.contrib.auth import login


def loginView(request):
    return render(request, 'accounts/login.html')


class registerView(CreateView):
    model = User
    form_class = CustomUserCreationForm
    template_name = 'accounts/register.html'

    def get_context_data(self, **kwargs):
        kwargs['user_type'] = 'user'
        return super().get_context_data(**kwargs)

    def form_valid(self, form):
        user = form.save()
        login(self.request, user)
        return redirect('user_redirect')


def user_redirect(request):
    """
    Redirects users based on whether they are in the admins group
    """
    if request.user.is_authenticated:
        if request.user.is_staff:
            # user is an admin
            return redirect("pos-home")
        else:
            return redirect("home")
    else:
        return redirect("login")


def settingsView(request):
    instance = SiteConfiguration.objects.get()
    form = SettingsForm(request.POST or None, request.FILES or None, instance=instance)
    if form.is_valid():
        form.save()
        return redirect('settings')
    return render(request, 'accounts/settings.html', {'form': form})