import logging
import os
import gzip
from io import BytesIO
from pathlib import Path

import mercantile
from django.conf import settings
from django.http import JsonResponse, HttpResponse, Http404
from django.views import View
import aiosqlite

logger = logging.getLogger(__name__)
TILES_BASE_DIR = getattr(settings, 'MBTILES_BASE_DIR', os.path.join(settings.MEDIA_ROOT, 'tiles'))


class TileJsonView(View):
    """Class-based async view for TileJSON metadata."""
    
    async def get(self, request, tile_path, user_id):
        mbtiles_path = Path(os.path.join(settings.MEDIA_ROOT, 'tiles', str(user_id), tile_path))
        if not mbtiles_path.exists():
            return JsonResponse({"error": "MBTiles not found"}, status=404)
        
        try:
            async with aiosqlite.connect(str(mbtiles_path)) as db:
                # Get metadata
                cursor = await db.execute("SELECT name, value FROM metadata")
                metadata_rows = await cursor.fetchall()
                metadata = dict(metadata_rows)
                
                # Get zoom levels
                cursor = await db.execute("SELECT MIN(zoom_level), MAX(zoom_level) FROM tiles")
                zoom_levels = await cursor.fetchone()
                min_zoom, max_zoom = zoom_levels
                
                tilejson = {
                    "tilejson": "2.2.0",
                    "name": metadata.get("name", f"tiles{user_id}"),
                    "version": metadata.get("version", "1.0.0"),
                    "tiles": [f"http://127.0.0.1:8000/tileserver/{tile_path}/{user_id}/tiles/{{z}}/{{x}}/{{y}}.pbf"],
                    "minzoom": min_zoom or 6,
                    "maxzoom": max_zoom or 18,
                    "bounds": metadata.get("bounds", "-180,-85.0511,180,85.0511").split(","),
                    "center": metadata.get("center", "0,0,6").split(","),
                }
                
                return JsonResponse(tilejson)
        except Exception as e:
            logger.error(f"Error generating TileJSON: {str(e)}", exc_info=True)
            return JsonResponse({"error": f"Failed to generate TileJSON: {str(e)}"}, status=500)


class TileView(View):
    """Class-based async view for serving MBTiles."""
    
    async def get(self, request, tile_path, user_id, z, x, y):
        file_format = y.split('.')[-1]
        y = y.split('.')[0]
        z, x, y = int(z), int(x), int(y)
        y_tms = (1 << z) - 1 - y  # Convert from TMS to XYZ coordinates
        
        mbtiles_path = Path(os.path.join(settings.MEDIA_ROOT, 'tiles', str(user_id), tile_path))
        
        if not mbtiles_path.exists():
            raise Http404(f"MBTiles file not found for user {tile_path}")
        
        try:
            # Using aiosqlite for async database operations
            async with aiosqlite.connect(str(mbtiles_path)) as db:
                cursor = await db.execute(
                    "SELECT tile_data FROM tiles WHERE zoom_level=? AND tile_column=? AND tile_row=?",
                    (z, x, y_tms)
                )
                result = await cursor.fetchone()
                
                if not result:
                    logger.warning(f"Tile not found for user {tile_path} at z={z}, x={x}, y={y}")
                    raise Http404(f"Tile not found at z={z}, x={x}, y={y}")
                
                tile_data = result[0]
                
                # Process the tile data
                if tile_data.startswith(b'\x1f\x8b'):
                    # Handle gzip-compressed data
                    with BytesIO(tile_data) as compressed:
                        tile_data_decompressed = gzip.GzipFile(fileobj=compressed).read()
                else:
                    tile_data_decompressed = tile_data
                
                logger.info(f"Tile found for user {tile_path} at z={z}, x={x}, y={y}, size={len(tile_data_decompressed)} bytes")
                response = HttpResponse(tile_data_decompressed, content_type='application/x-protobuf')
                response['Cache-Control'] = 'public, max-age=86400'
                
                return response
        except Exception as e:
            logger.error(f"Error serving tile: {str(e)}", exc_info=True)
            raise Http404(f"Error serving tile: {str(e)}")


# Optional method for getting bounds that could be added to either class
async def get_mbtiles_bounds(mbtiles_path, zoom=None):
    try:
        async with aiosqlite.connect(str(mbtiles_path)) as db:
            # If zoom not specified, find the highest zoom level with tiles
            if zoom is None:
                cursor = await db.execute("SELECT MAX(zoom_level) FROM tiles")
                result = await cursor.fetchone()
                max_zoom = result[0]
                if max_zoom is None:
                    logger.warning(f"No tiles found in {mbtiles_path}")
                    return None
                zoom = max_zoom
            
            # Query tile range at the chosen zoom level
            cursor = await db.execute(
                "SELECT MIN(tile_column), MAX(tile_column), MIN(tile_row), MAX(tile_row) "
                "FROM tiles WHERE zoom_level=?",
                (zoom,)
            )
            result = await cursor.fetchone()
            
            if not result or result[0] is None:
                logger.warning(f"No tiles found at zoom {zoom} in {mbtiles_path}")
                return None
            
            min_x, max_x, min_y, max_y = result
            logger.info(f"Tile bounds at zoom {zoom}: {result}")
            
            # Convert to geographic bounds
            sw = mercantile.ul(min_x, min_y, zoom)
            ne = mercantile.ul(max_x + 1, max_y + 1, zoom)
            bounds = [sw.lng, sw.lat, ne.lng, ne.lat]
            
            return bounds
            
    except Exception as e:
        logger.error(f"Error querying MBTiles bounds: {str(e)}", exc_info=True)
        return None