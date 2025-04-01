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
        instance = GeospatialData.objects.get(id=instance_id)

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

            vector_output = os.path.join(output_dir, 'tiles.mbtiles')
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
            cog_output = os.path.join(output_dir, 'raster.cog.tif')
            compression_methods = ["LZW", "DEFLATE", "NONE"]
            for compression_method in compression_methods:
                try:
                    cmd_cog = [
                        'gdal_translate',
                        '-of', 'COG',
                        '-co', f'COMPRESS={compression_method}',
                        '-co', 'BLOCKSIZE=256',
                        '-co', 'BIGTIFF=IF_SAFER',
                        # '-co', 'NUM_THREADS=ALL_CPUS',
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

            # Update the file field with the COG path
            cog_relative_path = os.path.relpath(cog_output, settings.MEDIA_ROOT)
            instance.file = cog_relative_path

            # Delete original raster file
            if os.path.exists(input_path):
                try:
                    os.unlink(input_path)
                    logger.info(f"Deleted original raster file: {input_path}")
                except PermissionError as e:
                    logger.warning(f"Failed to delete original raster file {input_path}: {e}")

        instance.tiles_generated = True
        instance.tile_path = os.path.relpath(output_dir, settings.MEDIA_ROOT)
        instance.save(update_fields=['file', 'tiles_generated', 'tile_path'])
        logger.info(f"Task completed successfully, file updated to: {instance.file}, tile_path: {instance.tile_path}")

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

        # Save Map
        with open(temp_file_paths['map'], 'rb') as f:
            map_file = File(f, name=metadata['map_meta_data']['file_name'])
            map_instance = MapData.objects.create(
                file=map_file,
                description=metadata['map_meta_data']['description'],
                date_captured=parse_date(metadata['map_meta_data']['date_captured'])
            )

        # Save Input Geospatial
        input_file_paths = {}
        for filename, file_path in temp_file_paths['input_geo'].items():
            with open(file_path, 'rb') as f:
                file_obj = File(f, name=filename)
                input_file_paths[filename] = os.path.join('geotiffs', datetime.now().strftime('%Y/%m/%d'), filename)
                dest_path = os.path.join(settings.MEDIA_ROOT, input_file_paths[filename])
                os.makedirs(os.path.dirname(dest_path), exist_ok=True)
                with open(dest_path, 'wb') as dest:
                    dest.write(file_obj.read())
        
        input_primary_file = next((f for f in input_file_paths.keys() if f.lower().endswith('.shp')), list(input_file_paths.keys())[0])
        input_geo_instance = GeospatialData.objects.create(
            file=input_file_paths[input_primary_file],
            data_type=metadata['input_meta_data']['data_type'],
            type_of_data=metadata['input_meta_data']['type_of_data'],
            description=metadata['input_meta_data']['description'],
            date_captured=parse_date(metadata['input_meta_data']['date_captured'])
        )

        # Save Output Geospatial
        output_file_paths = {}
        for filename, file_path in temp_file_paths['output_geo'].items():
            with open(file_path, 'rb') as f:
                file_obj = File(f, name=filename)
                output_file_paths[filename] = os.path.join('geotiffs', datetime.now().strftime('%Y/%m/%d'), filename)
                dest_path = os.path.join(settings.MEDIA_ROOT, output_file_paths[filename])
                os.makedirs(os.path.dirname(dest_path), exist_ok=True)
                with open(dest_path, 'wb') as dest:
                    dest.write(file_obj.read())
        
        output_primary_file = next((f for f in output_file_paths.keys() if f.lower().endswith('.shp')), list(output_file_paths.keys())[0])
        output_geo_instance = GeospatialData.objects.create(
            file=output_file_paths[output_primary_file],
            data_type=metadata['output_meta_data']['data_type'],
            type_of_data=metadata['output_meta_data']['type_of_data'],
            description=metadata['output_meta_data']['description'],
            date_captured=parse_date(metadata['output_meta_data']['date_captured'])
        )

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