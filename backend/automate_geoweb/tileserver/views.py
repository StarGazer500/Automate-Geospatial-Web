import logging
from django.http import JsonResponse, HttpResponse, Http404
from django.views.decorators.http import require_GET
from pathlib import Path
import sqlite3
from django.conf import settings
import mercantile
import os

logger = logging.getLogger(__name__)
TILES_BASE_DIR = getattr(settings, 'MBTILES_BASE_DIR', os.path.join(settings.MEDIA_ROOT, 'tiles'))

# def get_mbtiles_bounds(mbtiles_path, zoom=None):
#     conn = None
#     try:
#         conn = sqlite3.connect(str(mbtiles_path))
#         cursor = conn.cursor()
        
#         # If zoom not specified, find the highest zoom level with tiles
#         if zoom is None:
#             cursor.execute("SELECT MAX(zoom_level) FROM tiles")
#             max_zoom = cursor.fetchone()[0]
#             if max_zoom is None:
#                 logger.warning(f"No tiles found in {mbtiles_path}")
#                 conn.close()
#                 return None
#             zoom = max_zoom
        
#         # Query tile range at the chosen zoom level
#         cursor.execute(
#             "SELECT MIN(tile_column), MAX(tile_column), MIN(tile_row), MAX(tile_row) "
#             "FROM tiles WHERE zoom_level=?",
#             (zoom,)
#         )
#         result = cursor.fetchone()
        
        
        
#         if not result or result[0] is None:
#             logger.warning(f"No tiles found at zoom {zoom} in {mbtiles_path}")
#             conn.close()
#             return None
        
#         min_x, max_x, min_y, max_y = result
#         logger.info(f"Tile bounds at zoom {zoom}: {result}")
        
#         # Convert to geographic bounds
#         sw = mercantile.ul(min_x, min_y, zoom)
#         ne = mercantile.ul(max_x + 1, max_y + 1, zoom)
#         bounds = [sw.lng, sw.lat, ne.lng, ne.lat]
       
        
#         conn.close()
     
#         return bounds
    
#     except sqlite3.Error as e:
#         logger.error(f"Error querying MBTiles bounds: {str(e)}", exc_info=True)
#     except Exception as e:
#         logger.error(f"Unexpected error in get_mbtiles_bounds: {str(e)}", exc_info=True)
#     finally:
#         if conn:
#             conn.close()
#     return None

@require_GET
def tilejson(request, user_id):
    mbtiles_path = Path(TILES_BASE_DIR) / str(user_id) / "tiles.mbtiles"
    if not mbtiles_path.exists():
        return JsonResponse({"error": "MBTiles not found"}, status=404)

    conn = sqlite3.connect(str(mbtiles_path))
    cursor = conn.cursor()

    # Get metadata
    cursor.execute("SELECT name, value FROM metadata")
    metadata = dict(cursor.fetchall())
    print("bounds",metadata.get('bounds'))

    # Get zoom levels
    cursor.execute("SELECT MIN(zoom_level), MAX(zoom_level) FROM tiles")
    min_zoom, max_zoom = cursor.fetchone()
    print("min_max",min_zoom,max_zoom)


    tilejson = {
        "tilejson": "2.2.0",
        "name": metadata.get("name", f"tiles{user_id}"),
        "version": metadata.get("version", "1.0.0"),
        "tiles": [f"http://127.0.0.1:8000/tileserver/{user_id}/tiles/{{z}}/{{x}}/{{y}}.pbf"],
        "minzoom": min_zoom or 6,
        "maxzoom": max_zoom or 18,
        "bounds": metadata.get("bounds", "-180,-85.0511,180,85.0511").split(","),
        "center": metadata.get("center", "0,0,6").split(","),
    }
    conn.close()
    return JsonResponse(tilejson)

import gzip
from io import BytesIO

@require_GET
def get_tile(request, user_id, z, x, y):
    file_format = y.split('.')[-1]
    y = y.split('.')[0]
    z, x, y = int(z), int(x), int(y)
    y_tms = (1 << z) - 1 - y
    mbtiles_path = Path(TILES_BASE_DIR) / str(user_id) / "tiles.mbtiles"
    print(mbtiles_path, user_id, x, y, z)

    if not mbtiles_path.exists():
        raise Http404(f"MBTiles file not found for user {user_id}")

    conn = sqlite3.connect(str(mbtiles_path))
    cursor = conn.cursor()

    cursor.execute(
        "SELECT tile_data FROM tiles WHERE zoom_level=? AND tile_column=? AND tile_row=?",
        (z, x, y_tms)
    )
    tile_data = cursor.fetchone()
    print("tile_data:", tile_data)

    if tile_data and tile_data[0]:
        # Decompress gzip-compressed tile data
        if tile_data[0].startswith(b'\x1f\x8b'):
            with BytesIO(tile_data[0]) as compressed:
                tile_data_decompressed = gzip.GzipFile(fileobj=compressed).read()
        else:
            tile_data_decompressed = tile_data[0]
       
        logger.info(f"Tile found for user {user_id} at z={z}, x={x}, y={y}, size={len(tile_data_decompressed)} bytes")
        response = HttpResponse(tile_data_decompressed, content_type='application/x-protobuf')
        response['Cache-Control'] = 'public, max-age=86400'
    else:
        logger.warning(f"Tile not found for user {user_id} at z={z}, x={x}, y={y}")
        raise Http404(f"Tile not found at z={z}, x={x}, y={y}")

    conn.close()
    return response