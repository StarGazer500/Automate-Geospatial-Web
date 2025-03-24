# from celery import shared_task
# import subprocess
# import os
# from django.conf import settings
# from django.apps import apps
# from osgeo import gdal
# import logging
# import tempfile

# logger = logging.getLogger(__name__)

# @shared_task
# def generate_tiles_task(input_path, output_dir, instance_id):
#     try:
#         logger.info(f"Starting task for file: {input_path}, size: {os.path.getsize(input_path) / (1024 * 1024)}MB")
        
#         # Get the model instance
#         GeospatialData = apps.get_model('upload', 'GeospatialData')
#         instance = GeospatialData.objects.get(id=instance_id)

#         # Open the GeoTIFF to check its data type
#         ds = gdal.Open(input_path)
#         if ds is None:
#             raise ValueError(f"Failed to open GeoTIFF: {input_path}")
#         band = ds.GetRasterBand(1)
#         data_type = gdal.GetDataTypeName(band.DataType)
#         logger.info(f"Input file data type: {data_type}")

#         # Check if conversion to 8-bit is needed (Byte = 8-bit)
#         processed_input = input_path
#         temp_file = None
#         if data_type != 'Byte':
#             logger.info("Converting GeoTIFF to 8-bit format")
#             temp_file = tempfile.NamedTemporaryFile(suffix='.tif', delete=False)
#             cmd_convert = [
#                 'gdal_translate',
#                 '-of', 'GTiff',
#                 '-ot', 'Byte',
#                 '-scale',
#                 input_path,
#                 temp_file.name
#             ]
#             logger.info(f"Running conversion: {' '.join(cmd_convert)}")
#             subprocess.run(cmd_convert, check=True)
#             processed_input = temp_file.name
#             logger.info("Conversion to 8-bit completed")

#         # Generate tiles
#         cmd = ['gdal2tiles.py', '-p', 'mercator', '-z', '0-18', processed_input, output_dir]
#         logger.info(f"Generating tiles with command: {' '.join(cmd)}")
#         subprocess.run(cmd, check=True)
#         logger.info("Tiles generated successfully")

#         # Update instance with tile path and status
#         instance.tiles_generated = True
#         instance.tile_path = os.path.relpath(output_dir, settings.MEDIA_ROOT)  # Store relative path
#         instance.save(update_fields=['tiles_generated', 'tile_path'])
#         logger.info(f"Task completed successfully, tile path saved: {instance.tile_path}")

#     except subprocess.CalledProcessError as e:
#         logger.error(f"Error generating tiles: {e}")
#         raise
#     except Exception as e:
#         logger.error(f"Error in task execution: {e}")
#         raise
#     finally:
#         if temp_file and os.path.exists(temp_file.name):
#             os.unlink(temp_file.name)
#             logger.info(f"Cleaned up temporary file: {temp_file.name}")

from celery import shared_task
import subprocess
import os
from django.conf import settings
from django.apps import apps
from osgeo import gdal
from osgeo import ogr
import logging
import tempfile
import filelock
import uuid

logger = logging.getLogger(__name__)

@shared_task
def generate_tiles_task(input_path, output_dir, instance_id):
    # Create a unique output directory for each task
    unique_output_dir = os.path.join(output_dir, f'instance_{instance_id}')
    os.makedirs(unique_output_dir, exist_ok=True)
    
    # Create a lock file path based on output directory
    lock_file = os.path.join(os.path.dirname(output_dir), f"{os.path.basename(output_dir)}.lock")
    
    try:
        logger.info(f"Starting task for file: {input_path}, size: {os.path.getsize(input_path) / (1024 * 1024)}MB")
        
        # Enable GDAL/OGR exceptions
        gdal.UseExceptions()
        ogr.UseExceptions()

        # Get the model instance
        GeospatialData = apps.get_model('upload', 'GeospatialData')
        instance = GeospatialData.objects.get(id=instance_id)

        # Determine if raster or vector using exception handling
        is_vector = False
        try:
            ds = gdal.Open(input_path)
            logger.info("Detected raster input")
        except Exception as e:
            logger.info(f"gdal.Open failed: {e}, trying as vector")
            try:
                ds_vector = ogr.Open(input_path)
                if ds_vector is None:
                    raise ValueError(f"File not recognized as raster or vector: {input_path}")
                is_vector = True
                logger.info("Detected vector input")
            except Exception as e:
                raise ValueError(f"Failed to open file as raster or vector: {e}")

        if is_vector:
            # Create a unique temporary file for this task
            temp_file_name = f"geojson_{uuid.uuid4().hex}.geojson"
            temp_path = os.path.join(tempfile.gettempdir(), temp_file_name)
            
            # Make sure temp file doesn't exist
            if os.path.exists(temp_path):
                os.unlink(temp_path)
                
            cmd_convert = [
                'ogr2ogr',
                '-f', 'GeoJSON',
                '-overwrite',
                temp_path,
                input_path
            ]
            logger.info(f"Converting to GeoJSON: {' '.join(cmd_convert)}")
            result = subprocess.run(cmd_convert, check=True, capture_output=True, text=True)
            if result.stderr:
                logger.warning(f"ogr2ogr stderr: {result.stderr}")
            logger.info("Conversion to GeoJSON completed")

            # Use a unique output filename for each task
            vector_output = os.path.join(unique_output_dir, f'tiles_{instance_id}.mbtiles')
            
            # Acquire a file lock for tippecanoe
            # This prevents multiple processes from trying to use tippecanoe simultaneously
            # which can cause issues with SQLite database locking
            lock = filelock.FileLock(lock_file, timeout=300)  # 5 minute timeout
            
            try:
                with lock:
                    logger.info(f"Acquired lock for tippecanoe processing")
                    cmd_vector = [
                        'tippecanoe',
                        '-o', vector_output,
                        '-z', '18', '-Z', '0',
                        '--extend-zooms-if-still-dropping',
                        '--force',
                        temp_path
                    ]
                    logger.info(f"Generating vector tiles: {' '.join(cmd_vector)}")
                    result = subprocess.run(cmd_vector, check=True, capture_output=True, text=True)
                    if result.stderr:
                        logger.warning(f"tippecanoe stderr: {result.stderr}")
                    logger.info("Vector tiles generated successfully")
            except filelock.Timeout:
                logger.error(f"Could not acquire lock after timeout. Another process may be using tippecanoe.")
                raise RuntimeError("Tilemaking process timed out waiting for lock")
            
            processed_input = None
            temp_files = [temp_path]
        else:
            # Raster tile generation
            band = ds.GetRasterBand(1)
            data_type = gdal.GetDataTypeName(band.DataType)
            logger.info(f"Input file data type: {data_type}")

            processed_input = input_path
            temp_file_8bit = None
            if data_type != 'Byte':
                logger.info("Converting GeoTIFF to 8-bit format")
                temp_file_name = f"raster_{uuid.uuid4().hex}.tif"
                temp_path = os.path.join(tempfile.gettempdir(), temp_file_name)
                
                cmd_convert = [
                    'gdal_translate',
                    '-of', 'GTiff',
                    '-ot', 'Byte',
                    '-scale',
                    input_path,
                    temp_path
                ]
                logger.info(f"Running conversion: {' '.join(cmd_convert)}")
                subprocess.run(cmd_convert, check=True)
                processed_input = temp_path
                logger.info("Conversion to 8-bit completed")
                temp_files = [temp_path]
            else:
                temp_files = []

            cmd = ['gdal2tiles.py', '-p', 'mercator', '-z', '0-18', processed_input, unique_output_dir]
            logger.info(f"Generating raster tiles with command: {' '.join(cmd)}")
            subprocess.run(cmd, check=True)
            logger.info("Raster tiles generated successfully")

        instance.tiles_generated = True
        instance.tile_path = os.path.relpath(unique_output_dir, settings.MEDIA_ROOT)
        instance.save(update_fields=['tiles_generated', 'tile_path'])
        logger.info(f"Task completed successfully, tile path saved: {instance.tile_path}")

    except subprocess.CalledProcessError as e:
        logger.error(f"Error generating tiles: {e}")
        if hasattr(e, 'stderr') and e.stderr:
            logger.error(f"Subprocess stderr: {e.stderr}")
        raise
    except Exception as e:
        logger.error(f"Error in task execution: {e}")
        raise
    finally:
        # Clean up temporary files
        if 'temp_files' in locals():
            for temp_file in temp_files:
                if temp_file and os.path.exists(temp_file):
                    os.unlink(temp_file)
                    logger.info(f"Cleaned up temporary file: {temp_file}")

# from celery import shared_task
# import subprocess
# import os
# from django.conf import settings
# from django.apps import apps
# from osgeo import gdal
# from osgeo import osr
# import logging
# import tempfile

# logger = logging.getLogger(__name__)

# @shared_task
# def generate_tiles_task(input_path, output_dir, instance_id):
#     try:
#         logger.info(f"Starting task for file: {input_path}, size: {os.path.getsize(input_path) / (1024 * 1024)}MB")
        
#         # Get the model instance
#         GeospatialData = apps.get_model('upload', 'GeospatialData')
#         instance = GeospatialData.objects.get(id=instance_id)

#         # Open the GeoTIFF to inspect
#         ds = gdal.Open(input_path)
#         if ds is None:
#             raise ValueError(f"Failed to open GeoTIFF: {input_path}")
#         band = ds.GetRasterBand(1)
#         data_type = gdal.GetDataTypeName(band.DataType)
#         width, height = ds.RasterXSize, ds.RasterYSize
#         logger.info(f"Input file: data type={data_type}, width={width}px, height={height}px")

#         # Extract source CRS automatically
#         proj = ds.GetProjection()
#         if not proj:
#             logger.warning("No CRS found in GeoTIFF; assuming EPSG:4326")
#             source_srs = 'EPSG:4326'
#         else:
#             srs = osr.SpatialReference()
#             srs.ImportFromWkt(proj)
#             srs.AutoIdentifyEPSG()
#             source_srs = f"EPSG:{srs.GetAuthorityCode(None)}" if srs.GetAuthorityCode(None) else proj
#             logger.info(f"Detected source CRS: {source_srs}")

#         # Resample to increase resolution (e.g., 0.0001 degrees per pixel)
#         temp_file_resample = tempfile.NamedTemporaryFile(suffix='.tif', delete=False)
#         cmd_resample = [
#             'gdalwarp',
#             '-tr', '0.0001', '0.0001',  # Target resolution (adjust as needed)
#             '-r', 'bilinear',
#             input_path,
#             temp_file_resample.name
#         ]
#         logger.info(f"Running resampling: {' '.join(cmd_resample)}")
#         subprocess.run(cmd_resample, check=True)
#         logger.info("Resampling completed")

#         # Reproject to EPSG:3857
#         temp_file_reproj = tempfile.NamedTemporaryFile(suffix='.tif', delete=False)
#         cmd_reproj = [
#             'gdalwarp',
#             '-s_srs', source_srs,
#             '-t_srs', 'EPSG:3857',
#             '-r', 'bilinear',
#             temp_file_resample.name,
#             temp_file_reproj.name
#         ]
#         logger.info(f"Running reprojection: {' '.join(cmd_reproj)}")
#         subprocess.run(cmd_reproj, check=True)
#         logger.info("Reprojection to EPSG:3857 completed")

#         # Log reprojected size
#         ds_reproj = gdal.Open(temp_file_reproj.name)
#         if ds_reproj is None:
#             raise ValueError(f"Failed to open reprojected GeoTIFF: {temp_file_reproj.name}")
#         width_reproj, height_reproj = ds_reproj.RasterXSize, ds_reproj.RasterYSize
#         logger.info(f"Reprojected file: width={width_reproj}px, height={height_reproj}px")

#         # Convert to 8-bit if needed
#         processed_input = temp_file_reproj.name
#         temp_file_8bit = None
#         if data_type != 'Byte':
#             logger.info("Converting GeoTIFF to 8-bit format")
#             temp_file_8bit = tempfile.NamedTemporaryFile(suffix='.tif', delete=False)
#             cmd_convert = [
#                 'gdal_translate',
#                 '-of', 'GTiff',
#                 '-ot', 'Byte',
#                 '-scale',
#                 processed_input,
#                 temp_file_8bit.name
#             ]
#             logger.info(f"Running conversion: {' '.join(cmd_convert)}")
#             subprocess.run(cmd_convert, check=True)
#             processed_input = temp_file_8bit.name
#             logger.info("Conversion to 8-bit completed")

#         # Generate tiles
#         cmd = [
#             'gdal2tiles.py',
#             '-p', 'mercator',
#             '-z', '0-18',  # Extend zoom for more tiles
#             '-e',          # Extend tiles beyond data extent
#             '-w', 'none',
#             processed_input,
#             output_dir
#         ]
#         logger.info(f"Generating tiles with command: {' '.join(cmd)}")
#         subprocess.run(cmd, check=True)
#         logger.info("Tiles generated successfully")

#         # Update instance with tile path
#         instance.tiles_generated = True
#         instance.tile_path = os.path.relpath(output_dir, settings.MEDIA_ROOT)
#         instance.save(update_fields=['tiles_generated', 'tile_path'])
#         logger.info(f"Task completed successfully, tile path saved: {instance.tile_path}")

#     except subprocess.CalledProcessError as e:
#         logger.error(f"Error generating tiles: {e}")
#         raise
#     except Exception as e:
#         logger.error(f"Error in task execution: {e}")
#         raise
#     finally:
#         for temp_file in [temp_file_resample, temp_file_reproj, temp_file_8bit]:
#             if temp_file and os.path.exists(temp_file.name):
#                 os.unlink(temp_file.name)
#                 logger.info(f"Cleaned up temporary file: {temp_file.name}")