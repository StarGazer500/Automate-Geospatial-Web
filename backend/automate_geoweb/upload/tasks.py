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

# from celery import shared_task
# import subprocess
# import os
# from django.conf import settings
# from django.apps import apps
# from osgeo import gdal
# from osgeo import ogr
# import logging
# import tempfile
# import filelock
# import uuid

# logger = logging.getLogger(__name__)

# @shared_task
# def generate_tiles_task(input_path, output_dir, instance_id):
#     # Create a unique output directory for each task
#     unique_output_dir = os.path.join(output_dir, f'instance_{instance_id}')
#     os.makedirs(unique_output_dir, exist_ok=True)
    
#     # Create a lock file path based on output directory
#     lock_file = os.path.join(os.path.dirname(output_dir), f"{os.path.basename(output_dir)}.lock")
    
#     try:
#         logger.info(f"Starting task for file: {input_path}, size: {os.path.getsize(input_path) / (1024 * 1024)}MB")
        
#         # Enable GDAL/OGR exceptions
#         gdal.UseExceptions()
#         ogr.UseExceptions()

#         # Get the model instance
#         GeospatialData = apps.get_model('upload', 'GeospatialData')
#         instance = GeospatialData.objects.get(id=instance_id)

#         # Determine if raster or vector using exception handling
#         is_vector = False
#         try:
#             ds = gdal.Open(input_path)
#             logger.info("Detected raster input")
#         except Exception as e:
#             logger.info(f"gdal.Open failed: {e}, trying as vector")
#             try:
#                 ds_vector = ogr.Open(input_path)
#                 if ds_vector is None:
#                     raise ValueError(f"File not recognized as raster or vector: {input_path}")
#                 is_vector = True
#                 logger.info("Detected vector input")
#             except Exception as e:
#                 raise ValueError(f"Failed to open file as raster or vector: {e}")

#         if is_vector:
#             # Create a unique temporary file for this task
#             temp_file_name = f"geojson_{uuid.uuid4().hex}.geojson"
#             temp_path = os.path.join(tempfile.gettempdir(), temp_file_name)
            
#             # Make sure temp file doesn't exist
#             if os.path.exists(temp_path):
#                 os.unlink(temp_path)
                
#             cmd_convert = [
#                 'ogr2ogr',
#                 '-f', 'GeoJSON',
#                 '-overwrite',
#                 temp_path,
#                 input_path
#             ]
#             logger.info(f"Converting to GeoJSON: {' '.join(cmd_convert)}")
#             result = subprocess.run(cmd_convert, check=True, capture_output=True, text=True)
#             if result.stderr:
#                 logger.warning(f"ogr2ogr stderr: {result.stderr}")
#             logger.info("Conversion to GeoJSON completed")

#             # Use a unique output filename for each task
#             vector_output = os.path.join(unique_output_dir, f'tiles_{instance_id}.mbtiles')
            
#             # Acquire a file lock for tippecanoe
#             # This prevents multiple processes from trying to use tippecanoe simultaneously
#             # which can cause issues with SQLite database locking
#             lock = filelock.FileLock(lock_file, timeout=300)  # 5 minute timeout
            
#             try:
#                 with lock:
#                     logger.info(f"Acquired lock for tippecanoe processing")
#                     cmd_vector = [
#                         'tippecanoe',
#                         '-o', vector_output,
#                         '-z', '18', '-Z', '0',
#                         '--extend-zooms-if-still-dropping',
#                         '--force',
#                         temp_path
#                     ]
#                     logger.info(f"Generating vector tiles: {' '.join(cmd_vector)}")
#                     result = subprocess.run(cmd_vector, check=True, capture_output=True, text=True)
#                     if result.stderr:
#                         logger.warning(f"tippecanoe stderr: {result.stderr}")
#                     logger.info("Vector tiles generated successfully")
#             except filelock.Timeout:
#                 logger.error(f"Could not acquire lock after timeout. Another process may be using tippecanoe.")
#                 raise RuntimeError("Tilemaking process timed out waiting for lock")
            
#             processed_input = None
#             temp_files = [temp_path]
#         else:
#             # Raster tile generation
#             band = ds.GetRasterBand(1)
#             data_type = gdal.GetDataTypeName(band.DataType)
#             logger.info(f"Input file data type: {data_type}")

#             processed_input = input_path
#             temp_file_8bit = None
#             if data_type != 'Byte':
#                 logger.info("Converting GeoTIFF to 8-bit format")
#                 temp_file_name = f"raster_{uuid.uuid4().hex}.tif"
#                 temp_path = os.path.join(tempfile.gettempdir(), temp_file_name)
                
#                 cmd_convert = [
#                     'gdal_translate',
#                     '-of', 'GTiff',
#                     '-ot', 'Byte',
#                     '-scale',
#                     input_path,
#                     temp_path
#                 ]
#                 logger.info(f"Running conversion: {' '.join(cmd_convert)}")
#                 subprocess.run(cmd_convert, check=True)
#                 processed_input = temp_path
#                 logger.info("Conversion to 8-bit completed")
#                 temp_files = [temp_path]
#             else:
#                 temp_files = []

#             cmd = ['gdal2tiles.py', '-p', 'mercator', '-z', '0-18', processed_input, unique_output_dir]
#             logger.info(f"Generating raster tiles with command: {' '.join(cmd)}")
#             subprocess.run(cmd, check=True)
#             logger.info("Raster tiles generated successfully")

#         instance.tiles_generated = True
#         instance.tile_path = os.path.relpath(unique_output_dir, settings.MEDIA_ROOT)
#         instance.save(update_fields=['tiles_generated', 'tile_path'])
#         logger.info(f"Task completed successfully, tile path saved: {instance.tile_path}")

#     except subprocess.CalledProcessError as e:
#         logger.error(f"Error generating tiles: {e}")
#         if hasattr(e, 'stderr') and e.stderr:
#             logger.error(f"Subprocess stderr: {e.stderr}")
#         raise
#     except Exception as e:
#         logger.error(f"Error in task execution: {e}")
#         raise
#     finally:
#         # Clean up temporary files
#         if 'temp_files' in locals():
#             for temp_file in temp_files:
#                 if temp_file and os.path.exists(temp_file):
#                     os.unlink(temp_file)
#                     logger.info(f"Cleaned up temporary file: {temp_file}")


from celery import shared_task
from django.core.cache import cache
import subprocess
import os
from django.conf import settings
from django.apps import apps
from osgeo import gdal
from osgeo import ogr
import logging
import tempfile
from django.core.files import File
from datetime import datetime


import sqlite3
from PIL import Image
from pdf2image import convert_from_path
import mimetypes
import io
import mapbox_vector_tile
import cairocffi as cairo  # Use cairocffi instead of pycairo for broader compatibility
import gzip
from io import BytesIO
from PIL import Image, ImageDraw,ImageEnhance
from .utils import get_sentence_transformer_model_sync
# from sentence_transformers import SentenceTransformer



logger = logging.getLogger(__name__)

@shared_task(bind=True, max_retries=3)
def generate_tiles_task(self, input_path, output_dir, instance_id):
    lock_key = f"tile_task_{instance_id}"
    lock_timeout = 300

    if not cache.add(lock_key, "locked", lock_timeout):
        logger.info(f"Task for instance {instance_id} already running, retrying...")
        raise self.retry(countdown=10)

    try:
        logger.info(f"Starting task for file: {input_path}, size: {os.path.getsize(input_path) / (1024 * 1024)}MB")
        
        gdal.UseExceptions()
        ogr.UseExceptions()

        GeospatialData = apps.get_model('upload', 'GeospatialData')
        try:
            instance = GeospatialData.objects.get(id=instance_id)
        except GeospatialData.DoesNotExist:
            logger.error(f"GeospatialData with id {instance_id} does not exist")
            raise
        
        # Initialize is_vector
        is_vector = False

        # Validate input file
        logger.info(f"Validating input file: {input_path}")
        try:
            ds = gdal.Open(input_path)
            if ds is None:
                raise ValueError("GDAL could not open the input file")
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
            temp_file_geojson = tempfile.NamedTemporaryFile(suffix='.geojson', delete=False)
            temp_file_geojson.close()
            if os.path.exists(temp_file_geojson.name):
                os.unlink(temp_file_geojson.name)
            cmd_convert = [
                'ogr2ogr',
                '-f', 'GeoJSON',
                '-overwrite',
                temp_file_geojson.name,
                input_path
            ]
            logger.info(f"Converting to GeoJSON: {' '.join(cmd_convert)}")
            result = subprocess.run(cmd_convert, check=True, capture_output=True, text=True)
            logger.info(f"ogr2ogr output: {result.stdout}")
            if result.stderr:
                logger.warning(f"ogr2ogr stderr: {result.stderr}")
            logger.info("Conversion to GeoJSON completed")

            vector_output = os.path.join(output_dir, f'{os.path.basename(input_path)}.mbtiles')
            cmd_vector = [
                'tippecanoe',
                '-o', vector_output,
                '-z', '18', '-Z', '0',
                '--extend-zooms-if-still-dropping',
                '--force',
                '--name', os.path.splitext(os.path.basename(input_path))[0],
                temp_file_geojson.name
            ]
            logger.info(f"Generating vector tiles: {' '.join(cmd_vector)}")
            result = subprocess.run(cmd_vector, check=True, capture_output=True, text=True)
            logger.info(f"tippecanoe output: {result.stdout}")
            if result.stderr:
                logger.warning(f"tippecanoe stderr: {result.stderr}")
            logger.info("Vector tiles generated successfully")

            processed_input = None
            temp_files = [temp_file_geojson]

            return vector_output
        else:
            # Raster COG generation
            band = ds.GetRasterBand(1)
            data_type = gdal.GetDataTypeName(band.DataType)
            logger.info(f"Input file data type: {data_type}")

            processed_input = input_path
            temp_file_8bit = None
            temp_file_tiled = None
            if data_type != 'Byte':
                logger.info("Converting GeoTIFF to 8-bit format")
                temp_file_8bit = tempfile.NamedTemporaryFile(suffix='.tif', delete=False)
                cmd_convert = [
                    'gdal_translate',
                    '-of', 'GTiff',
                    '-ot', 'Byte',
                    '-scale',
                    input_path,
                    temp_file_8bit.name
                ]
                logger.info(f"Running conversion: {' '.join(cmd_convert)}")
                result = subprocess.run(cmd_convert, check=True, capture_output=True, text=True)
                logger.info(f"gdal_translate output: {result.stdout}")
                if result.stderr:
                    logger.warning(f"gdal_translate stderr: {result.stderr}")
                processed_input = temp_file_8bit.name
                logger.info("Conversion to 8-bit completed")

            # Pre-tile the input to avoid strip issues
            temp_file_tiled = tempfile.NamedTemporaryFile(suffix='.tif', delete=False)
            cmd_tile = [
                'gdal_translate',
                '-of', 'GTiff',
                '-co', 'TILED=YES',
                '-co', 'BLOCKXSIZE=256',
                '-co', 'BLOCKYSIZE=256',
                processed_input,
                temp_file_tiled.name
            ]
            logger.info(f"Pre-tiling input: {' '.join(cmd_tile)}")
            result = subprocess.run(cmd_tile, check=True, capture_output=True, text=True)
            logger.info(f"gdal_translate output: {result.stdout}")
            if result.stderr:
                logger.warning(f"gdal_translate stderr: {result.stderr}")
            processed_input = temp_file_tiled.name
            logger.info("Pre-tiling completed")

            # Generate COG with internal overviews
            cog_output = os.path.join(output_dir, f'{os.path.basename(input_path)}.cog.tif')
            compression_methods = ["LZW", "DEFLATE", "NONE"]
            for compression_method in compression_methods:
                try:
                    cmd_cog = [
                        'gdal_translate',
                        '-of', 'COG',
                        '-co', f'COMPRESS={compression_method}',
                        '-co', 'BLOCKSIZE=256',
                        '-co', 'BIGTIFF=IF_SAFER',
                        processed_input,
                        cog_output
                    ]
                    logger.info(f"Generating COG with {compression_method} compression: {' '.join(cmd_cog)}")
                    result = subprocess.run(cmd_cog, check=True, capture_output=True, text=True)
                    logger.info(f"gdal_translate output: {result.stdout}")
                    if result.stderr:
                        logger.warning(f"gdal_translate stderr: {result.stderr}")
                    break  # Success, no need for gdaladdo since overviews are internal
                except subprocess.CalledProcessError as e:
                    logger.warning(f"{compression_method} compression failed: {e.stderr}")
                    if compression_method == "NONE":
                        raise Exception(f"All compression methods failed: {e.stderr}")
                    continue

            logger.info("COG generation with internal overviews completed")

            temp_files = [temp_file_8bit, temp_file_tiled] if temp_file_8bit else [temp_file_tiled]

            # Delete original raster file
            if os.path.exists(input_path):
                try:
                    os.unlink(input_path)
                    logger.info(f"Deleted original raster file: {input_path}")
                except PermissionError as e:
                    logger.warning(f"Failed to delete original raster file {input_path}: {e}")

        instance.tiles_generated = True
        instance.tiles_path = os.path.relpath(output_dir, settings.MEDIA_ROOT)  # Update tiles_path
        instance.save(update_fields=['tiles_generated', 'tiles_path'])
        logger.info(f"Task completed successfully, tile_path: {instance.tiles_path}")
        return cog_output if not is_vector else vector_output

    except subprocess.CalledProcessError as e:
        logger.error(f"Error generating tiles: {e}")
        if e.stderr:
            logger.error(f"Subprocess stderr: {e.stderr}")
        raise
    except Exception as e:
        logger.error(f"Error in task execution: {e}")
        raise
    finally:
        if 'temp_files' in locals():
            for temp_file in temp_files:
                if temp_file and os.path.exists(temp_file.name):
                    try:
                        os.unlink(temp_file.name)
                        logger.info(f"Cleaned up temporary file: {temp_file.name}")
                    except PermissionError as e:
                        logger.warning(f"Failed to clean up temporary file {temp_file.name}: {e}")
        cache.delete(lock_key)

@shared_task(bind=True, max_retries=3)
def save_analysis_files(self, temp_file_paths, metadata):
    try:
        GeospatialData = apps.get_model('upload', 'GeospatialData')
        DocumentData = apps.get_model('upload', 'DocumentData')
        MapData = apps.get_model('upload', 'MapData')
        AnalysispData = apps.get_model('upload', 'AnalysispData')

        def parse_date(date_str):
            if not date_str:
                return datetime.now().date()
            try:
                return datetime.strptime(date_str, '%Y-%m-%d').date()
            except ValueError as e:
                logger.warning(f"Invalid date format: {date_str}, using today: {e}")
                return datetime.now().date()

        # Save Document
        with open(temp_file_paths['document'], 'rb') as f:
            doc_file = File(f, name=metadata['document_meta_data']['file_name'])
            document_instance = DocumentData.objects.create(
                file=doc_file,
                description=metadata['document_meta_data']['description'],
                date_captured=parse_date(metadata['document_meta_data']['date_captured'])
            )
        generate_thumbnail.delay("upload.DocumentData", document_instance.id)

        # Save Map
        with open(temp_file_paths['map'], 'rb') as f:
            map_file = File(f, name=metadata['map_meta_data']['file_name'])
            map_instance = MapData.objects.create(
                file=map_file,
                description=metadata['map_meta_data']['description'],
                date_captured=parse_date(metadata['map_meta_data']['date_captured'])
            )
         
        generate_thumbnail.delay("upload.MapData", map_instance.id)
        # Save Input Geospatial
        input_file_paths = {}
        
        
        
        input_geo_instance = GeospatialData.objects.create(
            files_dir='',
            data_type=metadata['input_meta_data']['data_type'],
            type_of_data=metadata['input_meta_data']['type_of_data'],
            description=metadata['input_meta_data']['description'],
            date_captured=parse_date(metadata['input_meta_data']['date_captured'])
        )

        input_geo_upload_dir = os.path.join(settings.MEDIA_ROOT, 'geospatial', str(input_geo_instance.id))
        os.makedirs(input_geo_upload_dir, exist_ok=True)

        for filename, file_path in temp_file_paths['input_geo'].items():
            with open(file_path, 'rb') as f:
                file_obj = File(f, name=filename)
                input_file_paths[filename] = os.path.join(input_geo_upload_dir,filename)
                dest_path = os.path.join(settings.MEDIA_ROOT, input_file_paths[filename])
                # os.makedirs(os.path.dirname(dest_path), exist_ok=True)
                with open(dest_path, 'wb') as dest:
                    dest.write(file_obj.read())

        if not input_file_paths:
                raise ValueError("No files were uploaded successfully")

            # Determine the primary file (e.g., .shp file or the first file)
            
            
            # Update the instance with the relative path to the primary file
        input_relative_path = os.path.relpath(input_geo_upload_dir, settings.MEDIA_ROOT)
        input_geo_instance.files_dir = input_relative_path
        input_geo_instance.save(update_fields=['files_dir'])  # Save the updated instance with the file path






        # Save Output Geospatial
        output_file_paths = {}
        
        
        # output_primary_file = next((f for f in output_file_paths.keys() if f.lower().endswith('.shp')), list(output_file_paths.keys())[0])
        output_geo_instance = GeospatialData.objects.create(
            # file=output_file_paths[output_primary_file],
            files_dir='',
            data_type=metadata['output_meta_data']['data_type'],
            type_of_data=metadata['output_meta_data']['type_of_data'],
            description=metadata['output_meta_data']['description'],
            date_captured=parse_date(metadata['output_meta_data']['date_captured'])
        )

        output_geo_upload_dir = os.path.join(settings.MEDIA_ROOT, 'geospatial', str(output_geo_instance.id))
        os.makedirs(output_geo_upload_dir, exist_ok=True)

        for filename, file_path in temp_file_paths['output_geo'].items():
            with open(file_path, 'rb') as f:
                file_obj = File(f, name=filename)
                output_file_paths[filename] = os.path.join(output_geo_upload_dir,filename)
                dest_path = os.path.join(settings.MEDIA_ROOT, output_file_paths[filename])
                # os.makedirs(os.path.dirname(dest_path), exist_ok=True)
                with open(dest_path, 'wb') as dest:
                    dest.write(file_obj.read())

        if not output_file_paths:
                raise ValueError("No files were uploaded successfully")

            # Determine the primary file (e.g., .shp file or the first file)
            
            
            # Update the instance with the relative path to the primary file
        # relative_path = os.path.relpath(output_file_paths[output_primary_file], settings.MEDIA_ROOT)
        output_relative_path = os.path.relpath(output_geo_upload_dir, settings.MEDIA_ROOT)
        output_geo_instance.files_dir = output_relative_path
        output_geo_instance.save(update_fields=['files_dir'])  # Save the updated instance with the file path


        # relative_path = os.path.relpath(upload_dir, settings.MEDIA_ROOT)
        #     instance.files_dir = relative_path
                        
        #     # Explicitly specify that we want to update the files_dir field
        #     await instance.asave(update_fields=['files_dir'])


        # Save Analysis Asset
        with open(temp_file_paths['analysis'], 'rb') as f:
            analysis_file = File(f, name=metadata['analysis_meta_data']['file_name'])
            analysis_instance = AnalysispData.objects.create(
                file=analysis_file,
                map_data=map_instance,
                document_data=document_instance,
                input_data=input_geo_instance,
                output_data=output_geo_instance,
                description=metadata['analysis_meta_data']['description'],
                date_captured=parse_date(metadata['analysis_meta_data']['date_captured'])
            )
        # generate_thumbnail.delay(AnalysispData, analysis_instance.id)
        
            
        return True, "Files saved successfully"
    except Exception as e:
        logger.error(f"Celery task failed: {str(e)}")
        return False, f"Save failed: {str(e)}"
    finally:
        try:
            for file_type, files in temp_file_paths.items():
                if isinstance(files, dict):
                    for filename, file_path in files.items():
                        if os.path.exists(file_path):
                            os.unlink(file_path)
                elif files and os.path.exists(files):
                    os.unlink(files)
        except Exception as cleanup_error:
            logger.error(f"Failed to cleanup temp files: {str(cleanup_error)}")


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

@shared_task(bind=True, max_retries=3)
def generate_thumbnail(self, model_name, file_instance_id):
    logger.info(f"Starting thumbnail generation for file ID: {file_instance_id}")
    try:
        logger.info("Fetching file instance")
        instance = apps.get_model(model_name)
        file_instance = instance.objects.get(id=file_instance_id)
        file_path = file_instance.file.path
        filename = os.path.basename(file_path)
        file_ext = os.path.splitext(filename)[1].lower()
        logger.info(f"File extension: {file_ext}")

        thumbnail_dir = os.path.join(settings.MEDIA_ROOT, 'thumbnails')
        os.makedirs(thumbnail_dir, exist_ok=True)

        mime_type, _ = mimetypes.guess_type(file_path)
        thumbnail_size = (304, 192)

        if mime_type and mime_type.startswith('image/'):
            logger.info("Processing as image")
            with Image.open(file_path) as img:
                # Convert to RGB if the image has an alpha channel (e.g., RGBA)
                if img.mode in ('RGBA', 'LA'):  # LA is luminance + alpha
                    logger.info(f"Converting {img.mode} to RGB")
                    img = img.convert('RGB')
                img.thumbnail(thumbnail_size, Image.Resampling.LANCZOS)
                thumb_path = os.path.join(thumbnail_dir, f"{filename}_thumb.jpg")
                img.save(thumb_path, 'JPEG', quality=80)
                file_instance.thumbnail.save(
                    f"{filename}_thumb.jpg",
                    File(open(thumb_path, 'rb')),
                    save=False
                )
        elif file_ext == '.pdf':
            logger.info("Processing as PDF")
            images = convert_from_path(file_path, first_page=1, last_page=1)
            if images:
                img = images[0]
                # Convert to RGB if necessary (PDFs might also have transparency)
                if img.mode in ('RGBA', 'LA'):
                    logger.info(f"Converting {img.mode} to RGB")
                    img = img.convert('RGB')
                img.thumbnail(thumbnail_size, Image.Resampling.LANCZOS)
                thumb_path = os.path.join(thumbnail_dir, f"{filename}_thumb.jpg")
                img.save(thumb_path, 'JPEG', quality=80)
                file_instance.thumbnail.save(
                    f"{filename}_thumb.jpg",
                    File(open(thumb_path, 'rb')),
                    save=False
                )
            else:
                logger.warning("No images extracted from PDF")
                file_instance.thumbnail = None
        else:
            logger.info("File type not supported for thumbnail generation")
            file_instance.thumbnail = None

        logger.info("Saving file instance with thumbnail")
        file_instance.save()
        logger.info("Thumbnail generation completed successfully")

    except Exception as e:
        logger.error(f"Error generating thumbnail for file {file_instance_id}: {str(e)}")
        raise self.retry(exc=e, countdown=5)

# @shared_task(bind=True, max_retries=3)
# def generate_geo_thumbnail(self,instance, file_instance_id):
#     """
#     Generate a thumbnail for images, PDFs, MBTiles (vector tiles), or assign a default icon.
#     Runs as a background task with retries.
#     """
#     # from .models import UploadedFile  # Import here to avoid circular imports

#     try:
#         # Fetch the instance by ID (since we're in a task)
#         file_instance =instance.objects.get(id=file_instance_id)
#         file_path = file_instance.file.path
#         if file_path.split('.')[-1]=="tif":
#             file_instance.thumbnail = None
#             file_instance.save()
#             return
#         else:
#             file_path=f"{settings.MEDIA_ROOT}/tiles/{file_instance_id}/tiles.mbtiles"
        

#         filename = os.path.basename(file_path)
#         file_ext = os.path.splitext(filename)[1].lower()
#         thumbnail_dir = os.path.join(settings.MEDIA_ROOT, 'thumbnails')
#         os.makedirs(thumbnail_dir, exist_ok=True)

#         # mime_type, _ = mimetypes.guess_type(file_path)
#         thumbnail_size = (100, 100)

      

#         # Handle MBTiles (Vector Tiles)
#         if file_ext == '.mbtiles':
#             conn = sqlite3.connect(file_path)
#             cursor = conn.cursor()
#             cursor.execute("SELECT DISTINCT zoom_level FROM tiles ORDER BY zoom_level")
#             zoom_levels = [row[0] for row in cursor.fetchall()]
#             if not zoom_levels:
#                 raise ValueError("No tiles found in MBTiles file")

#             target_zoom = zoom_levels[len(zoom_levels) // 2]
#             cursor.execute("""
#                 SELECT tile_data 
#                 FROM tiles 
#                 WHERE zoom_level = ? 
#                 ORDER BY tile_column, tile_row 
#                 LIMIT 1 OFFSET (SELECT COUNT(*) / 2 FROM tiles WHERE zoom_level = ?)
#             """, (target_zoom, target_zoom))
#             tile_data = cursor.fetchone()

#             if tile_data:
#                 tile = mapbox_vector_tile.decode(tile_data[0])
#                 img = render_vector_tile_to_image(tile, thumbnail_size)
#                 thumb_path = os.path.join(thumbnail_dir, f"{filename}_thumb.jpg")
#                 img.save(thumb_path, 'JPEG', quality=80)
#                 file_instance.thumbnail.save(
#                     f"{filename}_thumb.jpg",
#                     File(open(thumb_path, 'rb')),
#                     save=False
#                 )
#             else:
#                 raise ValueError("No tile data available at selected zoom level")
#             conn.close()

#         # Handle Other File Types
#         else:
#             file_instance.thumbnail = None  # Or assign_default_icon if you reinstate icons

#         file_instance.save()

#     except Exception as e:
#         logger.error(f"Error generating thumbnail for file {file_instance_id}: {e}")
#         # Retry on failure
#         raise self.retry(exc=e, countdown=5)  # Wait 5 seconds before retrying

# def render_vector_tile_to_image(tile, size=(100, 100)):
#     """
#     Render a decoded MVT tile into a raster image using Cairo.
#     """
#     surface = cairo.ImageSurface(cairo.FORMAT_ARGB32, size[0], size[1])
#     context = cairo.Context(surface)
#     context.scale(size[0] / 4096.0, size[1] / 4096.0)  # MVT tiles are 4096x4096 units

#     for layer_name, layer in tile.items():
#         for feature in layer['features']:
#             geom_type = feature['geometry']['type']
#             coords = feature['geometry']['coordinates']

#             context.set_line_width(50)
#             context.set_source_rgb(0, 0, 0)

#             if geom_type == 'Point':
#                 x, y = coords
#                 context.arc(x, y, 100, 0, 2 * 3.14159)
#                 context.fill()
#             elif geom_type == 'LineString':
#                 context.move_to(coords[0][0], coords[0][1])
#                 for x, y in coords[1:]:
#                     context.line_to(x, y)
#                 context.stroke()
#             elif geom_type == 'Polygon':
#                 for ring in coords:
#                     context.move_to(ring[0][0], ring[0][1])
#                     for x, y in ring[1:]:
#                         context.line_to(x, y)
#                     context.close_path()
#                 context.fill()

#     buf = io.BytesIO(surface.get_data())
#     img = Image.frombytes('RGBA', size, buf.getvalue(), 'raw', 'BGRA')
#     return img.convert('RGB')

# def assign_default_icon(file_instance, file_type):
#     icon_path = f"icons/{file_type}.png"
#     default_icon_full_path = os.path.join(settings.STATIC_ROOT, icon_path)
#     if not os.path.exists(default_icon_full_path):
#         icon_path = 'icons/generic.png'
#     file_instance.thumbnail = icon_path

# def get_mbtiles_thumbnail(mbtiles_path, output_path, size=(256, 256), max_features=100):
#     """
#     Extract a tile from an MBTiles file and generate a high-quality thumbnail.
#     Supports both raster and vector tiles with optimized vector rendering.
#     """
#     conn = sqlite3.connect(mbtiles_path)
#     cursor = conn.cursor()
    
#     # Get a tile from a middle zoom level
#     cursor.execute("SELECT MIN(zoom_level), MAX(zoom_level) FROM tiles")
#     min_zoom, max_zoom = cursor.fetchone()
    
#     if min_zoom is None or max_zoom is None:
#         conn.close()
#         return False
    
#     # Choose a reasonable zoom level for thumbnail
#     target_zoom = min(14, max(min_zoom, min_zoom + (max_zoom - min_zoom) // 3))
    
#     # Find a tile with actual data (not empty)
#     cursor.execute("""
#         SELECT tile_data 
#         FROM tiles 
#         WHERE zoom_level = ? 
#         AND LENGTH(tile_data) > 100
#         LIMIT 1
#     """, (target_zoom,))
    
#     tile_data = cursor.fetchone()
    
#     # Fallback to any tile if none found at target zoom
#     if not tile_data:
#         cursor.execute("""
#             SELECT tile_data 
#             FROM tiles 
#             WHERE LENGTH(tile_data) > 100
#             LIMIT 1
#         """)
#         tile_data = cursor.fetchone()
    
#     conn.close()
    
#     if not tile_data or not tile_data[0]:
#         return False
    
#     tile_bytes = tile_data[0]
    
#     # Handle gzip compression
#     if tile_bytes.startswith(b'\x1f\x8b'):
#         with BytesIO(tile_bytes) as compressed:
#             tile_bytes = gzip.GzipFile(fileobj=compressed).read()
    
#     # For vector tiles (PBF format)
#     if tile_bytes.startswith(b'\x1a') or b'GeomType' in tile_bytes:
#         try:
#             tile = mapbox_vector_tile.decode(tile_bytes)
            
#             # Create a blank image
#             img = Image.new('RGB', size, (240, 240, 240))  # Light gray background
#             draw = ImageDraw.Draw(img)
            
#             # Scale factor: MVT tiles use a 4096x4096 coordinate space
#             scale_x = size[0] / 4096.0
#             scale_y = size[1] / 4096.0
            
#             # Colors for different geometry types
#             point_color = (255, 0, 0)  # Red for points
#             line_color = (0, 0, 255)   # Blue for lines
#             poly_color = (0, 255, 0)   # Green for polygons
            
#             feature_count = 0
#             for layer_name, layer in tile.items():
#                 for feature in layer['features']:
#                     if feature_count >= max_features:  # Limit features for performance
#                         break
#                     geom_type = feature['geometry']['type']
#                     coords = feature['geometry']['coordinates']
                    
#                     # Scale coordinates to thumbnail size
#                     if geom_type == 'Point':
#                         x, y = coords
#                         x, y = x * scale_x, y * scale_y
#                         draw.ellipse([(x-3, y-3), (x+3, y+3)], fill=point_color)
#                     elif geom_type == 'LineString':
#                         scaled_coords = [(x * scale_x, y * scale_y) for x, y in coords]
#                         draw.line(scaled_coords, fill=line_color, width=1)
#                     elif geom_type == 'Polygon':
#                         for ring in coords:  # Handle multiple rings
#                             scaled_coords = [(x * scale_x, y * scale_y) for x, y in ring]
#                             draw.polygon(scaled_coords, fill=poly_color, outline=(0, 0, 0))
                    
#                     feature_count += 1
            
#             img.save(output_path, format='PNG')
#             return True
#         except Exception as e:
#             print(f"Error creating vector tile thumbnail: {e}")
#             return False
    
#     # For raster tiles (PNG/JPEG)
#     else:
#         try:
#             img = Image.open(BytesIO(tile_bytes))
#             img = img.resize(size)
#             img.save(output_path, format='PNG')
#             return True
#         except Exception as e:
#             print(f"Error creating raster tile thumbnail: {e}")
#             return False
        
 #This displays labels professionally instead of tiles or images 
# @shared_task(bind=True, max_retries=3)
# def generate_geo_thumbnail(self, model_name, file_instance_id, previous_result=None):
#     logger.info(f"Starting geo thumbnail generation with model_name: {model_name}, ID: {file_instance_id}, previous_result: {previous_result}")
#     try:
#         if not model_name:
#             raise ValueError("model_name cannot be None")
#         instance = apps.get_model(model_name)
#         file_instance = instance.objects.get(id=file_instance_id)
#         file_path = file_instance.file.path 
#         if file_path.split('.')[-1] == "tif":
#             file_instance.thumbnail = None
#             file_instance.save()
#             logger.info(f"Set thumbnail to None for TIFF file ID: {file_instance_id}")
#             return
#         else:
#             file_path = f"{settings.MEDIA_ROOT}/tiles/{file_instance_id}/tiles.mbtiles"

#         filename = os.path.basename(file_path)
#         thumbnail_dir = os.path.join(settings.MEDIA_ROOT, 'thumbnails')
#         os.makedirs(thumbnail_dir, exist_ok=True)
        
#         thumbnail_size = (100, 100)
#         thumb_path = os.path.join(thumbnail_dir, f"{filename}_thumb.jpg")
        
#         # Extract metadata from MBTiles for use in visualization
#         conn = sqlite3.connect(file_path)
#         cursor = conn.cursor()
#         metadata = {}
#         try:
#             cursor.execute("SELECT name, value FROM metadata")
#             for name, value in cursor.fetchall():
#                 metadata[name] = value
#         except Exception as e:
#             logger.info(f"No metadata table found in MBTiles or error: {e}")
        
#         # Get some statistics about the MBTiles content
#         tile_count = 0
#         min_zoom = 0
#         max_zoom = 0
#         bounds = None
        
#         try:
#             cursor.execute("SELECT COUNT(*) FROM tiles")
#             tile_count = cursor.fetchone()[0]
            
#             cursor.execute("SELECT MIN(zoom_level), MAX(zoom_level) FROM tiles")
#             min_zoom, max_zoom = cursor.fetchone()
            
#             # Try to get bounds from metadata
#             if 'bounds' in metadata:
#                 bounds = metadata['bounds']
#         except Exception as e:
#             logger.warning(f"Error getting MBTiles statistics: {e}")
        
#         # Create a visually informative thumbnail based on gathered information
#         img = Image.new('RGB', thumbnail_size, (240, 240, 245))  # Light blue-gray background
#         draw = ImageDraw.Draw(img)
        
#         # Try to load a system font - fallback gracefully if needed
#         try:
#             from PIL import ImageFont
#             try:
#                 font = ImageFont.truetype("Arial.ttf", 11)
#                 small_font = ImageFont.truetype("Arial.ttf", 9)
#             except:
#                 try:
#                     font = ImageFont.truetype("DejaVuSans.ttf", 11)
#                     small_font = ImageFont.truetype("DejaVuSans.ttf", 9)
#                 except:
#                     font = ImageFont.load_default()
#                     small_font = font
#         except:
#             font = None
#             small_font = None
        
#         # Draw a border
#         draw.rectangle([(0, 0), (99, 99)], outline=(70, 130, 180), width=2)
        
#         # Get name for display
#         display_name = metadata.get('name', os.path.splitext(filename)[0])
#         if len(display_name) > 10:
#             display_name = display_name[:9] + '…'
        
#         # Draw a small globe/map icon in the center top
#         center_x = thumbnail_size[0] // 2
#         # Draw a circle for the globe
#         draw.ellipse([(center_x-15, 10), (center_x+15, 40)], outline=(70, 130, 180), width=2)
#         # Draw "longitude lines"
#         draw.line([(center_x, 10), (center_x, 40)], fill=(70, 130, 180), width=1)
#         draw.arc([(center_x-15, 15), (center_x+15, 35)], 0, 180, fill=(70, 130, 180), width=1)
#         draw.arc([(center_x-15, 15), (center_x+15, 35)], 180, 360, fill=(70, 130, 180), width=1)
#         # Draw "latitude lines"
#         draw.line([(center_x-15, 25), (center_x+15, 25)], fill=(70, 130, 180), width=1)
        
#         # Add text
#         if font:
#             # Title at top
#             draw.text((center_x, 45), display_name, fill=(50, 50, 50), anchor="mt", font=font)
            
#             # Info at bottom
#             zoom_text = f"Zoom: {min_zoom}-{max_zoom}" if min_zoom is not None else "GEO Data"
#             draw.text((center_x, 65), zoom_text, fill=(50, 50, 50), anchor="mt", font=small_font)
            
#             # Add tile count at bottom
#             if tile_count:
#                 tiles_text = f"Tiles: {tile_count:,}"
#                 draw.text((center_x, 80), tiles_text, fill=(50, 50, 50), anchor="mt", font=small_font)
#         else:
#             # Fallback without font
#             draw.text((10, 50), display_name, fill=(50, 50, 50))
#             draw.text((10, 65), "GEO Data", fill=(50, 50, 50))
        
#         # Save the generated image
#         img.save(thumb_path, 'JPEG', quality=90)
        
#         # Close the database connection
#         conn.close()
        
#         # Save the thumbnail to the model
#         with open(thumb_path, 'rb') as f:
#             file_instance.thumbnail.save(f"{filename}_thumb.jpg", File(f), save=False)
        
#         file_instance.save()
#         logger.info(f"Geo thumbnail generation completed for ID: {file_instance_id}")

#     except Exception as e:
#         logger.error(f"Error generating geo thumbnail for file {file_instance_id}: {e}")
#         raise self.retry(exc=e, countdown=5)
    

@shared_task(bind=True, max_retries=3)
def generate_geo_thumbnail(self, previous_result, model_name, file_instance_id, file_path, thumbnail_dir):
    logger.info(f"Starting geo thumbnail generation with model_name: {model_name}, ID: {file_instance_id}, file_path: {file_path}, thumbnail_dir: {thumbnail_dir}, previous_result: {previous_result}")
    try:
        if not model_name == 'upload.GeospatialData':
            logger.error(f"Invalid model_name: {model_name}, expected 'upload.GeospatialData'")
            raise ValueError("model_name must be 'upload.GeospatialData'")
                
        instance_model = apps.get_model(model_name)
        file_instance = instance_model.objects.get(id=file_instance_id)

        if previous_result:
            file_path = previous_result
            logger.info(f"Using file_path from previous task: {file_path}")
        elif not file_path:
            logger.warning(f"No file_path provided for ID: {file_instance_id}")
            return
        
        if file_path.split('.')[-1] == "tif":
            logger.info(f"Set thumbnail to None for TIFF file ID: {file_instance_id}")
            return
        
        filename = os.path.basename(file_path)
        file_ext = os.path.splitext(filename)[1].lower()
        
        thumbnail_size = (304, 192)
        thumb_path = os.path.join(settings.MEDIA_ROOT, thumbnail_dir, f"{filename}_thumb.jpg")

        if file_ext == '.mbtiles':
            conn = sqlite3.connect(file_path)
            cursor = conn.cursor()
            cursor.execute("SELECT MIN(zoom_level), MAX(zoom_level) FROM tiles")
            min_zoom, max_zoom = cursor.fetchone()

            if min_zoom is None or max_zoom is None:
                raise ValueError("No tiles found in MBTiles file")

            target_zoom = min(12, max(min_zoom, (min_zoom + max_zoom) // 2))
            
            cursor.execute("""
                SELECT tile_data, tile_column, tile_row
                FROM tiles 
                WHERE zoom_level = ? 
                AND LENGTH(tile_data) > 500
                ORDER BY LENGTH(tile_data) DESC
                LIMIT 1
            """, (target_zoom,))
            tile_data = cursor.fetchone()

            if not tile_data:
                cursor.execute("""
                    SELECT tile_data, tile_column, tile_row, zoom_level
                    FROM tiles 
                    WHERE LENGTH(tile_data) > 500
                    ORDER BY LENGTH(tile_data) DESC
                    LIMIT 1
                """)
                tile_data = cursor.fetchone()

            conn.close()

            if not tile_data or not tile_data[0]:
                raise ValueError("No valid tile data found")

            tile_bytes = tile_data[0]
            if tile_bytes.startswith(b'\x1f\x8b'):
                with BytesIO(tile_bytes) as compressed:
                    tile_bytes = gzip.GzipFile(fileobj=compressed).read()

            # Vector tile processing
            if tile_bytes.startswith(b'\x1a') or b'GeomType' in tile_bytes:
                tile = mapbox_vector_tile.decode(tile_bytes)
                
                # Calculate the bounding box of all features
                min_x, min_y, max_x, max_y = float('inf'), float('inf'), float('-inf'), float('-inf')
                for layer_name, layer in tile.items():
                    for feature in layer['features']:
                        geom_type = feature['geometry']['type']
                        coords = feature['geometry']['coordinates']
                        
                        if geom_type == 'Point':
                            x, y = coords
                            min_x = min(min_x, x)
                            max_x = max(max_x, x)
                            min_y = min(min_y, y)
                            max_y = max(max_y, y)
                        elif geom_type == 'LineString':
                            for x, y in coords:
                                min_x = min(min_x, x)
                                max_x = max(max_x, x)
                                min_y = min(min_y, y)
                                max_y = max(max_y, y)
                        elif geom_type == 'Polygon':
                            for ring in coords:
                                for x, y in ring:
                                    min_x = min(min_x, x)
                                    max_x = max(max_x, x)
                                    min_y = min(min_y, y)
                                    max_y = max(max_y, y)

                # Ensure bounding box is valid
                if min_x == float('inf') or max_x == float('-inf') or min_y == float('inf') or max_y == float('-inf'):
                    raise ValueError("Invalid bounding box coordinates")

                # Calculate the bounding box dimensions
                box_width = max_x - min_x
                box_height = max_y - min_y

                # Determine the scaling factor to fit the entire content within thumbnail_size
                scale = max(thumbnail_size[0] / box_width if box_width > 0 else 1.0,
                            thumbnail_size[1] / box_height if box_height > 0 else 1.0)
                scale_factor = min(1.0, scale)  # Cap scale at 1.0 to avoid upscaling

                # Calculate the scaled dimensions
                scaled_width = box_width * scale_factor
                scaled_height = box_height * scale_factor

                # Calculate the center of the bounding box
                center_x = (min_x + max_x) / 2
                center_y = (min_y + max_y) / 2

                # Create an image for drawing
                img = Image.new('RGB', thumbnail_size, (240, 240, 240))
                draw = ImageDraw.Draw(img)
                
                # Draw features with scaling and centering
                max_features = 200
                feature_count = 0

                for layer_name, layer in tile.items():
                    for feature in layer['features']:
                        if feature_count >= max_features:
                            break
                        geom_type = feature['geometry']['type']
                        coords = feature['geometry']['coordinates']
                        
                        if geom_type == 'Point':
                            x, y = coords
                            x, y = (x - center_x) * scale_factor + thumbnail_size[0] / 2, \
                                   (y - center_y) * scale_factor + thumbnail_size[1] / 2
                            radius = 4
                            draw.ellipse([(x-radius, y-radius), (x+radius, y+radius)], 
                                         fill=(220, 20, 60), outline=(0,0,0))
                        
                        elif geom_type == 'LineString':
                            scaled_coords = [( (x - center_x) * scale_factor + thumbnail_size[0] / 2,
                                             (y - center_y) * scale_factor + thumbnail_size[1] / 2) for x, y in coords]
                            draw.line(scaled_coords, fill=(30, 144, 255), width=2)
                        
                        elif geom_type == 'Polygon':
                            for ring in coords:
                                scaled_coords = [( (x - center_x) * scale_factor + thumbnail_size[0] / 2,
                                                 (y - center_y) * scale_factor + thumbnail_size[1] / 2) for x, y in ring]
                                draw.polygon(scaled_coords, fill=(144, 238, 144, 180), outline=(0, 0, 0))
                        
                        feature_count += 1
                
                # Apply image enhancements
                img = img.resize(thumbnail_size, Image.LANCZOS)
                enhancer = ImageEnhance.Sharpness(img)
                img = enhancer.enhance(1.5)
                contrast = ImageEnhance.Contrast(img)
                img = contrast.enhance(1.2)
                img.save(thumb_path, 'JPEG', quality=90)

            # Raster tile processing
            else:
                img = Image.open(BytesIO(tile_bytes))

                # Calculate the scaling factor to fit the image within thumbnail_size
                img_width, img_height = img.size
                scale_x = thumbnail_size[0] / img_width if img_width > 0 else 1.0
                scale_y = thumbnail_size[1] / img_height if img_height > 0 else 1.0
                scale_factor = min(scale_x, scale_y)

                # Resize the image with the calculated scale
                new_width = int(img_width * scale_factor)
                new_height = int(img_height * scale_factor)
                img = img.resize((new_width, new_height), Image.LANCZOS)

                # Calculate offsets to center the resized image
                offset_x = (thumbnail_size[0] - new_width) / 2
                offset_y = (thumbnail_size[1] - new_height) / 2

                # Create a new image with the target size and paste the resized image
                centered_img = Image.new('RGB', thumbnail_size, (240, 240, 240))
                centered_img.paste(img, (int(offset_x), int(offset_y)))

                # Enhance contrast
                enhancer = ImageEnhance.Contrast(centered_img)
                centered_img = enhancer.enhance(1.2)

                centered_img.save(thumb_path, 'JPEG', quality=90)

            logger.info(f"Geo thumbnail generation completed for ID: {file_instance_id}")

    except Exception as e:
        logger.error(f"Error generating geo thumbnail for file {file_instance_id}: {e}")
        raise self.retry(exc=e, countdown=5)
    
@shared_task(bind=True, max_retries=3)
def generate_embedding_task(self, instance_id, model_name):
    try:
        instance_model = apps.get_model(model_name)
        instance = instance_model.objects.get(id=instance_id)
        if instance.description:
            model = get_sentence_transformer_model_sync()
            embedding = model.encode(instance.description)
            instance.desc_embedding = embedding
            instance.save(update_fields=['desc_embedding'])  # Fixed field name
            logger.info(f"Generated embedding for {model_name} ID: {instance_id} encoding:{embedding} enc_field{ instance.desc_embedding}")
        else:
            logger.warning(f"No description found for {model_name} ID: {instance_id}")
    except instance_model.DoesNotExist:
        logger.error(f"{model_name} ID: {instance_id} does not exist")
    except Exception as e:
        logger.error(f"Error generating embedding for {model_name} ID: {instance_id}: {e}")
        raise self.retry(exc=e, countdown=5)