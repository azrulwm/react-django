from django.urls import path
from . import views

urlpatterns = [
    path('posts/', views.ListCreatePost.as_view(), name='posts-list'),
    path('posts/delete/<int:pk>/', views.DeletePost.as_view(), name='delete-post')
]
