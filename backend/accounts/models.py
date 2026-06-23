from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    phone = models.CharField(max_length=20, blank=True)
    address = models.TextField(blank=True)
    
    class Meta:
        db_table = 'users'
    
    def __str__(self):
        return self.email or self.username
