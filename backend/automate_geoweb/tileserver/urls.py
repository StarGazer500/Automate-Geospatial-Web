from django.urls import path
from .views import *

urlpatterns = [
    path('<str:tile_path>/<int:user_id>/tiles', VectorTileJsonView.as_view(), name='mbtiles_tilejson'),
    path('<str:tile_path>/<int:user_id>/tiles/<int:z>/<int:x>/<str:y>', VectorTileView.as_view(), name='mbtiles_tile'),
    path('tiles/<int:z>/<int:x>/<int:y>.png', RasterTileView.as_view(), name='serve_tile'),
]