from django.urls import path
from .views import *

urlpatterns = [
    path('<str:tile_path>/<int:user_id>/tiles', TileJsonView.as_view(), name='mbtiles_tilejson'),
    path('<str:tile_path>/<int:user_id>/tiles/<int:z>/<int:x>/<str:y>', TileView.as_view(), name='mbtiles_tile'),
]