from celery import shared_task
import subprocess
import os
from django.conf import settings
from django.apps import apps
from osgeo import gdal
import logging
import tempfile

logger = logging.getLogger(__name__)

@shared_task
def generate_tiles_task(input_path, output_dir, instance_id):
    try:
        logger.info(f"Starting task for file: {input_path}, size: {os.path.getsize(input_path) / (1024 * 1024)}MB")
        
        # Get the model instance
        GeospatialData = apps.get_model('upload', 'GeospatialData')
        instance = GeospatialData.objects.get(id=instance_id)

        # Open the GeoTIFF to check its data type
        ds = gdal.Open(input_path)
        if ds is None:
            raise ValueError(f"Failed to open GeoTIFF: {input_path}")
        band = ds.GetRasterBand(1)
        data_type = gdal.GetDataTypeName(band.DataType)
        logger.info(f"Input file data type: {data_type}")

        # Check if conversion to 8-bit is needed (Byte = 8-bit)
        processed_input = input_path
        temp_file = None
        if data_type != 'Byte':
            logger.info("Converting GeoTIFF to 8-bit format")
            temp_file = tempfile.NamedTemporaryFile(suffix='.tif', delete=False)
            cmd_convert = [
                'gdal_translate',
                '-of', 'GTiff',
                '-ot', 'Byte',
                '-scale',
                input_path,
                temp_file.name
            ]
            logger.info(f"Running conversion: {' '.join(cmd_convert)}")
            subprocess.run(cmd_convert, check=True)
            processed_input = temp_file.name
            logger.info("Conversion to 8-bit completed")

        # Generate tiles
        cmd = ['gdal2tiles.py', '-p', 'mercator', '-z', '0-10', processed_input, output_dir]
        logger.info(f"Generating tiles with command: {' '.join(cmd)}")
        subprocess.run(cmd, check=True)
        logger.info("Tiles generated successfully")

        # Update instance with tile path and status
        instance.tiles_generated = True
        instance.tile_path = os.path.relpath(output_dir, settings.MEDIA_ROOT)  # Store relative path
        instance.save(update_fields=['tiles_generated', 'tile_path'])
        logger.info(f"Task completed successfully, tile path saved: {instance.tile_path}")

    except subprocess.CalledProcessError as e:
        logger.error(f"Error generating tiles: {e}")
        raise
    except Exception as e:
        logger.error(f"Error in task execution: {e}")
        raise
    finally:
        if temp_file and os.path.exists(temp_file.name):
            os.unlink(temp_file.name)
            logger.info(f"Cleaned up temporary file: {temp_file.name}")