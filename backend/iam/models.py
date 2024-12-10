from django.db import models

class User(models.Model):
    ROLE_CHOICES = [
        ('ADMIN', 'Admin'),
        ('USER', 'User'),
        ('GUEST', 'Guest'),
    ]

    name = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    password = models.CharField(max_length=255)
    role = models.CharField(max_length=10, choices=ROLE_CHOICES, default='USER')
    is_mfa_enabled = models.BooleanField(default=False)

    def __str__(self):
        return self.email
