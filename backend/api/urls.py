from django.urls import path
from . import views

urlpatterns = [
    path('posts/', views.ListCreatePostView.as_view(), name='posts-list'),
    path('posts/<int:pk>/', views.PostDetailView.as_view(), name='post-detail'),
    path('posts/delete/<int:pk>/', views.DeletePostView.as_view(), name='delete-post'),
    path('posts/update/<int:pk>/', views.UpdatePostView.as_view(), name='update-post'),
    path('comments/', views.CommentListCreateView.as_view(), name='comment-list-create'),
    path('comments/<int:pk>/', views.CommentDetailView.as_view(), name='comment-detail'),
]
