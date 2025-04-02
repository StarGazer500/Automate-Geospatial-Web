from django.urls import path
from . import views

urlpatterns = [
    path('<int:user_id>/tiles', views.tilejson, name='mbtiles_tilejson'),
    path('<int:user_id>/tiles/<int:z>/<int:x>/<str:y>', views.get_tile, name='mbtiles_tile'),
]