from django.shortcuts import render
from .models import MapData, DocumentData, GeospatialData, AnalysispData,Departments,DepartmentStaff
from django.core.paginator import Paginator
from django.http import JsonResponse
from asgiref.sync import sync_to_async
from django.views import View
from datetime import datetime,timezone

# from django.utils import timezone

from pathlib import Path
import os
import json
from django.conf import settings
from django.db import IntegrityError
from .utils import compare_password, create_access_token, create_refresh_token,set_session_data,save_to_cache,get_from_cache,get_sentence_transformer_model
from .custom_jwt_auth import CustomJWTAuthentication

from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator


from pgvector.django import CosineDistance
from django.db.models import F
from django.forms.models import model_to_dict
import asyncio
  

import logging

logger = logging.getLogger(__name__)
from django.db import connection


### full pagaination solution to be used instead
# from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger

# @sync_to_async
# def get_paginated_data(self, page_number, page_size):
#     try:
#         queryset = GeospatialData.objects.all().order_by('-date_captured').values(
#             'id', 'files_dir', 'tiles_path', 'description', 'date_captured', 'thumbnails_dir'
#         )
#         paginator = Paginator(queryset, page_size)
#         try:
#             page = paginator.page(page_number)
#         except (EmptyPage, PageNotAnInteger):
#             page = paginator.page(1)
        
#         data_list = list(page.object_list)
#         for item in data_list:
#             item['type'] = 'geospatial'
#             item['thumbnail_paths'] = os.listdir(os.path.join(settings.MEDIA_ROOT, item['thumbnails_dir']))
#             item['tile_paths'] = os.listdir(os.path.join(settings.MEDIA_ROOT, item['tiles_path']))
        
#         total_items = paginator.count
#         return {
#             'data': data_list,
#             'has_next': page.has_next(),
#             'total_pages': paginator.num_pages,
#             'current_page': page.number,
#         }
#     except Exception as e:
#         print(f"Error in get_paginated_data: {str(e)}")
#         raise


# Get All Dataset
class GeospatialDataView(View):
    async def get(self, request, *args, **kwargs):
        print("Entering get method")
        try:
            page_number = int(request.GET.get('page', 1))
            page_size = int(request.GET.get('page_size', 20))
            print(f"Page: {page_number}, Size: {page_size}")
            
            result = await self.get_paginated_data(page_number, page_size)
            print("Result fetched successfully")
            
            return JsonResponse(result)
        except Exception as e:
            print(f"Error in get: {str(e)}")
            return JsonResponse({'error': str(e)}, status=500)
    
    @sync_to_async
    def get_paginated_data(self, page_number, page_size):
        print("Entering get_paginated_data")
        try:
            start = (page_number - 1) * page_size
            end = start + page_size
            print(f"Querying with start={start}, end={end}")
            
            queryset = GeospatialData.objects.all()[start:end].values(
                'id', 'files_dir', 'description', 'date_captured','thumbnails_dir','tiles_path'
            )
            print("Queryset executed")
            
            data_list = list(queryset)
            for item in data_list:
                item['type'] = 'geospatial'
                item['thumbnail_paths'] = os.listdir(os.path.join(settings.MEDIA_ROOT,item['thumbnails_dir']))
                item['tile_paths'] = os.listdir(os.path.join(settings.MEDIA_ROOT,item['tiles_path']))
                
           
            total_items = GeospatialData.objects.count()
            print(f"Total items: {total_items}")
            print(f"data: {data_list}")
            
            paginator = Paginator(range(total_items), page_size)
            has_next = page_number < paginator.num_pages
            total_pages = paginator.num_pages
            
            return {
                'data': data_list,
                'has_next': has_next,
                'total_pages': total_pages,
                'current_page': page_number,
            }
        except Exception as e:
            print(f"Error in get_paginated_data: {str(e)}")
            raise



class RetrieveAllDocumentDataset(View):  # Added View base class
    async def get(self, request, *args, **kwargs):
        print("Entering get method")
        try:
            page_number = int(request.GET.get('page', 1))
            page_size = int(request.GET.get('page_size', 20))
            print(f"Page: {page_number}, Size: {page_size}")
            
            result = await self.get_paginated_data(page_number, page_size)
            print("Result fetched successfully")
            
            return JsonResponse(result)
        except Exception as e:
            print(f"Error in get: {str(e)}")
            return JsonResponse({'error': str(e)}, status=500)
    
    @sync_to_async
    def get_paginated_data(self, page_number, page_size):
        print("Entering get_paginated_data")
        try:
            start = (page_number - 1) * page_size
            end = start + page_size
            print(f"Querying with start={start}, end={end}")
            
            queryset = DocumentData.objects.all()[start:end].values(
                'id', 'file', 'description', 'date_captured','thumbnail'
            )
            print("Queryset executed")
            
            data_list = list(queryset)
             
            for item in data_list:
                item['type'] = 'document'
          
            total_items = DocumentData.objects.count()
            print(f"Total items: {total_items}")
            print(f"data: {data_list}")
            
            paginator = Paginator(range(total_items), page_size)
            has_next = page_number < paginator.num_pages
            total_pages = paginator.num_pages
            
            return {
                'data': data_list,
                'has_next': has_next,
                'total_pages': total_pages,
                'current_page': page_number,
            }
        except Exception as e:
            print(f"Error in get_paginated_data: {str(e)}")
            raise

class RetrieveAllMapDataset(View):  # Added View base class
    async def get(self, request, *args, **kwargs):
        print("Entering get method")
        try:
            page_number = int(request.GET.get('page', 1))
            page_size = int(request.GET.get('page_size', 20))
            print(f"Page: {page_number}, Size: {page_size}")
            
            result = await self.get_paginated_data(page_number, page_size)
            print("Result fetched successfully")
            
            return JsonResponse(result)
        except Exception as e:
            print(f"Error in get: {str(e)}")
            return JsonResponse({'error': str(e)}, status=500)
    
    @sync_to_async
    def get_paginated_data(self, page_number, page_size):
        print("Entering get_paginated_data")
        try:
            start = (page_number - 1) * page_size
            end = start + page_size
            print(f"Querying with start={start}, end={end}")
            
            queryset = MapData.objects.all()[start:end].values(
                'id', 'file', 'description', 'date_captured','thumbnail'
            )
            print("Queryset executed")
            
            data_list = list(queryset)
            
            for item in data_list:
                item['type'] = 'map'
           
            total_items = MapData.objects.count()
            print(f"Total items: {total_items}")
            print(f"data: {data_list}")
            
            paginator = Paginator(range(total_items), page_size)
            has_next = page_number < paginator.num_pages
            total_pages = paginator.num_pages
            
            return {
                'data': data_list,
                'has_next': has_next,
                'total_pages': total_pages,
                'current_page': page_number,
            }
        except Exception as e:
            print(f"Error in get_paginated_data: {str(e)}")
            raise

class RetrieveAllAnalysisDataset(View):
    async def get(self, request, *args, **kwargs):
        try:
            page_number = int(request.GET.get('page', 1))
            page_size = int(request.GET.get('page_size', 20))
            
            result = await self.get_paginated_data(page_number, page_size)
            
            return JsonResponse(result)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)
    
    @sync_to_async
    def get_paginated_data(self, page_number, page_size):
        start = (page_number - 1) * page_size
        end = start + page_size

        queryset = AnalysispData.objects.select_related(
            'map_data', 'document_data', 'input_data', 'output_data'
        )[start:end].values(
            'id',
            'file',
            'description',
            'date_captured',
            'uploaded_at',
            # 'map_data__file',
            # 'map_data__description',
            # 'document_data__file',
            # 'document_data__description',
            # 'input_data__file',
            # 'input_data__description',
            # 'output_data__file',
            # 'output_data__description',
            'thumbnail'

        )
        
        data_list = list(queryset)
         
        
        for item in data_list:
            item['type'] = 'analysis'
            
        total_items = AnalysispData.objects.count()
        paginator = Paginator(range(total_items), page_size)
        has_next = page_number < paginator.num_pages
        total_pages = paginator.num_pages
        print(f"data: {data_list}")
            

        return {
            'data': data_list,
            'has_next': has_next,
            'total_pages': total_pages,
            'current_page': page_number,
        }

class RetrieveAllDataset(View):
    async def get(self, request, *args, **kwargs):
        try:
            page_number = int(request.GET.get('page', 1))
            page_size = int(request.GET.get('page_size', 20))
            print(f"Page: {page_number}, Size: {page_size}")
            
            result = await self.get_paginated_data(page_number, page_size)
            print("Result fetched successfully")
            
            return JsonResponse(result)
        except Exception as e:
            print(f"Error in get: {str(e)}")
            return JsonResponse({'error': str(e)}, status=500)
    
    @sync_to_async
    def get_paginated_data(self, page_number, page_size):
        print("Entering get_paginated_data")
        try:
            start = (page_number - 1) * page_size
            end = start + page_size
            print(f"Querying with start={start}, end={end}")

            # Fetch data from all models
            geo_data = list(GeospatialData.objects.all()[start:end].values(
                'id', 'description', 'date_captured','thumbnails_dir','tiles_path'
            ))
            doc_data = list(DocumentData.objects.all()[start:end].values(
                'id', 'file', 'description', 'date_captured','thumbnail'
            ))
            map_data = list(MapData.objects.all()[start:end].values(
                'id', 'file', 'description', 'date_captured','thumbnail'
            ))
            analysis_data = list(AnalysispData.objects.select_related(
                'map_data', 'document_data', 'input_data', 'output_data'
            )[start:end].values(
                'id', 'file', 'description', 'date_captured', 'uploaded_at','thumbnail'
                # 'map_data__file', 'map_data__description',
                # 'document_data__file', 'document_data__description',
                # 'input_data__file', 'input_data__description',
                
            ))

            # Add type field to distinguish models
            for item in geo_data:
                item['type'] = 'geospatial'
                item['thumbnail_paths'] = os.listdir(os.path.join(settings.MEDIA_ROOT,item['thumbnails_dir']))
                item['tile_paths'] = os.listdir(os.path.join(settings.MEDIA_ROOT,item['tiles_path']))
            for item in doc_data:
                item['type'] = 'document'
            for item in map_data:
                item['type'] = 'map'
            for item in analysis_data:
                item['type'] = 'analysis'

            # Combine all data and normalize dates to timezone-aware datetime
            all_data = geo_data + doc_data + map_data + analysis_data
            # for item in all_data:
            #     if 'uploaded_at' in item and item['uploaded_at']:
            #         item['sort_date'] = item['uploaded_at']  # Already aware if USE_TZ=True
            #     elif 'date_captured' in item and item['date_captured']:
            #         # Convert date_captured to an aware datetime
            #         naive_dt = datetime.combine(item['date_captured'], datetime.min.time())
            #         item['sort_date'] = timezone.make_aware(naive_dt)
            #     else:
            #         # Fallback to an aware minimum datetime
            #         item['sort_date'] = timezone.make_aware(datetime.min)

            # # Sort by the normalized sort_date
            # all_data.sort(key=lambda x: x['sort_date'], reverse=True)

            # Paginate the combined data
            data_list = all_data
            total_items = len(all_data)
            print(f"Total items: {total_items}")
            print(f"data: {data_list}")

            paginator = Paginator(range(total_items), page_size)
            has_next = page_number < paginator.num_pages
            total_pages = paginator.num_pages

            # Remove sort_date from the response
            for item in data_list:
                item.pop('sort_date', None)

            return {
                'data': data_list,
                'has_next': has_next,
                'total_pages': total_pages,
                'current_page': page_number,
            }
        except Exception as e:
            print(f"Error in get_paginated_data: {str(e)}")
            raise




# Get Dataset by ID

class GetUpdateDeleteDocumentView(View):
    async def get(self, request, *args, **kwargs):
        document_id = kwargs.get('document_id')
        try:
            document = await DocumentData.objects.aget(id=document_id)
            
            
            response_data = {
                "id": document.id,
                "file": document.file.url if document.file else None,
                "description": document.description,
                "date_captured": document.date_captured.isoformat(),
                "uploaded_at":document.uploaded_at.isoformat(),
                'thumbnail':document.thumbnail.url if document.thumbnail else None
                
            }
            return JsonResponse(response_data)
        except Exception as e:
            if e=="DocumentData matching query does not exist":
                print("Exception data  not found ",e)
                return JsonResponse({"error": "Document not found"}, status=404)
            else:
                print("Unknown Error ",e)
                return JsonResponse({"error": "Unknown Error"}, status=500)

            
            

    # async def put(self, request, *args, **kwargs):
    #     patient_id = kwargs.get('patient_id')
    #     try:
    #         patient = await Patient.objects.aget(id=patient_id)
    #         # Parse the incoming JSON data
    #         data = json.loads(request.body)
            
    #         # Update patient fields if they are provided in the request
    #         patient.first_name = data.get('first_name', patient.first_name)
    #         patient.last_name = data.get('last_name', patient.last_name)
    #         patient.date_of_birth = data.get('date_of_birth', patient.date_of_birth)
    #         patient.gender = data.get('gender', patient.gender)
    #         patient.contact_number = data.get('contact_number', patient.contact_number)
    #         patient.email = data.get('email', patient.email)
            
    #         # Save the updated patient
    #         await patient.asave()
            
    #         # Prepare response with updated data
    #         response_data = {
    #             "id": patient.id,
    #             "first_name": patient.first_name,
    #             "last_name": patient.last_name,
    #             "date_of_birth": patient.date_of_birth,
    #             "gender": patient.gender,
    #             "contact_number": patient.contact_number,
    #             "email": patient.email,
    #         }
    #         return JsonResponse(response_data)
    #     except Patient.DoesNotExist:
    #         return JsonResponse({"error": "Patient not found"}, status=404)
    #     except json.JSONDecodeError:
    #         return JsonResponse({"error": "Invalid JSON data"}, status=400)
    #     except Exception as e:
    #         return JsonResponse({"error": str(e)}, status=500)

    # async def delete(self, request, *args, **kwargs):
    #     patient_id = kwargs.get('patient_id')
    #     try:
    #         # Try to get the patient object to delete
    #         patient = await Patient.objects.aget(id=patient_id)
            
    #         # Delete the patient
    #         await patient.adelete()
            
    #         # Return success response
    #         return JsonResponse({"message": "Patient deleted successfully"}, status=200)
    #     except Patient.DoesNotExist:
    #         return JsonResponse({"error": "Patient not found"}, status=404)
    #     except Exception as e:
    #         return JsonResponse({"error": str(e)}, status=500)


class GetUpdateDeleteMapView(View):
    async def get(self, request, *args, **kwargs):
        map_id = kwargs.get('map_id')
        try:
            map = await MapData.objects.aget(id=map_id)
            
            response_data = {
                "id": map.id,
                "file": map.file.url if map.file else None,
                "description": map.description,
                "date_captured": map.date_captured.isoformat(),
                "uploaded_at":map.uploaded_at.isoformat(),
                "thumbnail":map.thumbnail.url if map.thumbnail else None
                
            }
            return JsonResponse(response_data)
        except Exception as e:
            if e=="MapData matching query does not exist":
                print("Exception data  not found ",e)
                return JsonResponse({"error": "Map not found"}, status=404)
            else:
                print("Unknown Error ",e)
                return JsonResponse({"error": "Unknown Error"}, status=500)


        # async def put(self, request, *args, **kwargs):
        #     patient_id = kwargs.get('patient_id')
        #     try:
        #         patient = await Patient.objects.aget(id=patient_id)
        #         # Parse the incoming JSON data
        #         data = json.loads(request.body)
                
        #         # Update patient fields if they are provided in the request
        #         patient.first_name = data.get('first_name', patient.first_name)
        #         patient.last_name = data.get('last_name', patient.last_name)
        #         patient.date_of_birth = data.get('date_of_birth', patient.date_of_birth)
        #         patient.gender = data.get('gender', patient.gender)
        #         patient.contact_number = data.get('contact_number', patient.contact_number)
        #         patient.email = data.get('email', patient.email)
                
        #         # Save the updated patient
        #         await patient.asave()
                
        #         # Prepare response with updated data
        #         response_data = {
        #             "id": patient.id,
        #             "first_name": patient.first_name,
        #             "last_name": patient.last_name,
        #             "date_of_birth": patient.date_of_birth,
        #             "gender": patient.gender,
        #             "contact_number": patient.contact_number,
        #             "email": patient.email,
        #         }
        #         return JsonResponse(response_data)
        #     except Patient.DoesNotExist:
        #         return JsonResponse({"error": "Patient not found"}, status=404)
        #     except json.JSONDecodeError:
        #         return JsonResponse({"error": "Invalid JSON data"}, status=400)
        #     except Exception as e:
        #         return JsonResponse({"error": str(e)}, status=500)

        # async def delete(self, request, *args, **kwargs):
        #     patient_id = kwargs.get('patient_id')
        #     try:
        #         # Try to get the patient object to delete
        #         patient = await Patient.objects.aget(id=patient_id)
                
        #         # Delete the patient
        #         await patient.adelete()
                
        #         # Return success response
        #         return JsonResponse({"message": "Patient deleted successfully"}, status=200)
        #     except Patient.DoesNotExist:
        #         return JsonResponse({"error": "Patient not found"}, status=404)
        #     except Exception as e:
        #         return JsonResponse({"error": str(e)}, status=500)

class GetUpdateDeleteGeospatialView(View):
    async def get(self, request, *args, **kwargs):
        geo_id = kwargs.get('geo_id')
        try:
            geospatial = await GeospatialData.objects.aget(id=geo_id)
            # check_file_type = geospatial.file.url if geospatial.file.url.split('.')[-1]=="tif" else f"/media/tiles/{geospatial.id}/tiles.mbtiles"
            # print("file type",check_file_type)
            
            response_data = {
                "id": geospatial.id,
                "file_paths": os.listdir(os.path.join(settings.MEDIA_ROOT, geospatial.files_dir)),
                "data_type":geospatial.data_type,
                "type_of_data":geospatial. type_of_data,
                "description": geospatial.description,
                "date_captured": geospatial.date_captured.isoformat(),
                "tile_paths": os.listdir(os.path.join(settings.MEDIA_ROOT, geospatial.tiles_path)),
                "thumbnail_paths":os.listdir(os.path.join(settings.MEDIA_ROOT,geospatial.thumbnails_dir))
                
            }
            print(response_data)
            return JsonResponse(response_data)
        except Exception as e:
            if e=="GeospartialpData matching query does not exist":
                print("Exception data  not found ",e)
                return JsonResponse({"error": "Geospatial not found"}, status=404)
            else:
                print("Unknown Error ",e)
                return JsonResponse({"error": "Unknown Error"}, status=500)

    # async def put(self, request, *args, **kwargs):
    #     patient_id = kwargs.get('patient_id')
    #     try:
    #         patient = await Patient.objects.aget(id=patient_id)
    #         # Parse the incoming JSON data
    #         data = json.loads(request.body)
            
    #         # Update patient fields if they are provided in the request
    #         patient.first_name = data.get('first_name', patient.first_name)
    #         patient.last_name = data.get('last_name', patient.last_name)
    #         patient.date_of_birth = data.get('date_of_birth', patient.date_of_birth)
    #         patient.gender = data.get('gender', patient.gender)
    #         patient.contact_number = data.get('contact_number', patient.contact_number)
    #         patient.email = data.get('email', patient.email)
            
    #         # Save the updated patient
    #         await patient.asave()
            
    #         # Prepare response with updated data
    #         response_data = {
    #             "id": patient.id,
    #             "first_name": patient.first_name,
    #             "last_name": patient.last_name,
    #             "date_of_birth": patient.date_of_birth,
    #             "gender": patient.gender,
    #             "contact_number": patient.contact_number,
    #             "email": patient.email,
    #         }
    #         return JsonResponse(response_data)
    #     except Patient.DoesNotExist:
    #         return JsonResponse({"error": "Patient not found"}, status=404)
    #     except json.JSONDecodeError:
    #         return JsonResponse({"error": "Invalid JSON data"}, status=400)
    #     except Exception as e:
    #         return JsonResponse({"error": str(e)}, status=500)

    # async def delete(self, request, *args, **kwargs):
    #     patient_id = kwargs.get('patient_id')
    #     try:
    #         # Try to get the patient object to delete
    #         patient = await Patient.objects.aget(id=patient_id)
            
    #         # Delete the patient
    #         await patient.adelete()
            
    #         # Return success response
    #         return JsonResponse({"message": "Patient deleted successfully"}, status=200)
    #     except Patient.DoesNotExist:
    #         return JsonResponse({"error": "Patient not found"}, status=404)
    #     except Exception as e:
    #         return JsonResponse({"error": str(e)}, status=500)


class GetUpdateDeleteAnalysisView(View):
    async def get(self, request, *args, **kwargs):
        analysis_id = kwargs.get('analysis_id')
        try:
            analysis = await AnalysispData.objects.select_related('input_data','output_data','map_data','document_data').aget(id=analysis_id)
            # check_input_file_type =analysis.input_data.file.url if analysis.input_data.file.url.split('.')[-1]=="tif" else f"/media/tiles/{analysis.input_data.id}/tiles.mbtiles"
            # check_output_file_type = analysis.output_data.file.url if analysis.output_data.file.url.split('.')[-1]=="tif" else f"/media/tiles/{analysis.output_data.id}/tiles.mbtiles"
            
            response_data = {
                "id": analysis.id,
                "file": analysis.file.url if analysis.file else None,
                "input_tile_paths": os.listdir(os.path.join(settings.MEDIA_ROOT, analysis.input_data.tiles_path)),
                "output_tile_paths": os.listdir(os.path.join(settings.MEDIA_ROOT, analysis.output_data.tiles_path)),
                "input_id":analysis.input_data.id,
                "output_id":analysis.output_data.id,
                "map_data": analysis.map_data.id,
                "document_data": analysis.document_data.id,
                "description": analysis.description,
                "date_captured": analysis.date_captured.isoformat(),
                "uploaded_at":analysis.uploaded_at.isoformat(),
                "thumbnail":analysis.thumbnail.url if analysis.thumbnail else None
                
                
            }
            return JsonResponse(response_data)
        except Exception as e:
            if e=="AnalysisData matching query does not exist":
                print("Exception data  not found ",e)
                return JsonResponse({"error": "Analysis not found"}, status=404)
            else:
                print("Unknown Error ",e)
                return JsonResponse({"error": "Unknown Error"}, status=500)

    # async def put(self, request, *args, **kwargs):
    #     patient_id = kwargs.get('patient_id')
    #     try:
    #         patient = await Patient.objects.aget(id=patient_id)
    #         # Parse the incoming JSON data
    #         data = json.loads(request.body)
            
    #         # Update patient fields if they are provided in the request
    #         patient.first_name = data.get('first_name', patient.first_name)
    #         patient.last_name = data.get('last_name', patient.last_name)
    #         patient.date_of_birth = data.get('date_of_birth', patient.date_of_birth)
    #         patient.gender = data.get('gender', patient.gender)
    #         patient.contact_number = data.get('contact_number', patient.contact_number)
    #         patient.email = data.get('email', patient.email)
            
    #         # Save the updated patient
    #         await patient.asave()
            
    #         # Prepare response with updated data
    #         response_data = {
    #             "id": patient.id,
    #             "first_name": patient.first_name,
    #             "last_name": patient.last_name,
    #             "date_of_birth": patient.date_of_birth,
    #             "gender": patient.gender,
    #             "contact_number": patient.contact_number,
    #             "email": patient.email,
    #         }
    #         return JsonResponse(response_data)
    #     except Patient.DoesNotExist:
    #         return JsonResponse({"error": "Patient not found"}, status=404)
    #     except json.JSONDecodeError:
    #         return JsonResponse({"error": "Invalid JSON data"}, status=400)
    #     except Exception as e:
    #         return JsonResponse({"error": str(e)}, status=500)

    # async def delete(self, request, *args, **kwargs):
    #     patient_id = kwargs.get('patient_id')
    #     try:
    #         # Try to get the patient object to delete
    #         patient = await Patient.objects.aget(id=patient_id)
            
    #         # Delete the patient
    #         await patient.adelete()
            
    #         # Return success response
    #         return JsonResponse({"message": "Patient deleted successfully"}, status=200)
    #     except Patient.DoesNotExist:
    #         return JsonResponse({"error": "Patient not found"}, status=404)
    #     except Exception as e:
    #         return JsonResponse({"error": str(e)}, status=500)


class CreateDepartmentView(View):
    async def post(self, request, *args, **kwargs):
        try:
            data = json.loads(request.body)
            name = data.get('name')
            description = data.get('description')
            

            # Create a new patient
            department_model = await Departments.objects.acreate(
                name=name,
                description=description,
                
            )

            response_data = {
                "id": department_model.id,
                "name": department_model.name,
                "description":department_model.description,
                "date_created": department_model.date_created.isoformat()
                
            }
            return JsonResponse(response_data, status=201)
        
        except IntegrityError as e:
            print("intergrity")
            # Handle unique constraint errors or other integrity errors
            if 'UNIQUE constraint failed' in str(e):
                return JsonResponse({"message": "The department is already created. Please provide a unique department name."}, status=400)
            else:
                print("different int")
                # If it's another integrity error, log the error and return a generic message
                return JsonResponse({"message": "An error occurred while processing your request. Please try again."}, status=400)

        except Exception as e:

            # Log the exception for debugging (use logging in production)
            print(str(e))  # In production, use a proper logging mechanism
            
            # Return a generic error message
    
            return JsonResponse({"message": "An unexpected error occurred. Please try again later."}, status=500)
        

# class CreateCompartIdentifiertView(View):
#         async def post(self, request, *args, **kwargs):
#             try:
#                 data = json.loads(request.body)
#                 name = data.get('name')
#                 description = data.get('description')
               

#                 # Create a new patient
#                 compartmentIdfier_model = await CompactmentIdentifier.objects.acreate(
#                     name=name,
#                     description=description,
                   
#                 )

#                 response_data = {
#                     "id": compartmentIdfier_model.id,
#                     "name": compartmentIdfier_model.name,
#                     "description":compartmentIdfier_model.description,
#                     "date_created": compartmentIdfier_model.date_created.isoformat()
                   
#                 }
#                 return JsonResponse(response_data, status=201)
            
#             except IntegrityError as e:
#                 print("intergrity")
#                 # Handle unique constraint errors or other integrity errors
#                 if 'UNIQUE constraint failed' in str(e):
#                     return JsonResponse({"message": "The compartment Identifier is already created. Please provide a unique compartment name."}, status=400)
#                 else:
#                     print("different int")
#                     # If it's another integrity error, log the error and return a generic message
#                     return JsonResponse({"message": "An error occurred while processing your request. Please try again."}, status=400)

#             except Exception as e:

#                 # Log the exception for debugging (use logging in production)
#                 print(str(e))  # In production, use a proper logging mechanism
                
#                 # Return a generic error message
        
#                 return JsonResponse({"message": "An unexpected error occurred. Please try again later."}, status=500)



@method_decorator(csrf_exempt, name='dispatch')
class LoginUserView(View):
    async def post(self, request, *args, **kwargs):
        print(request.body)

        try:
            # Parse JSON body
            data = json.loads(request.body)
            email = data.get('email')
            password = data.get('password')

            if not email or not password:
                return JsonResponse({"error": "Email and password are required"}, status=400)

            staff = None
            try:
                staff = await DepartmentStaff.objects.aget(email=email)
            except DepartmentStaff.DoesNotExist:
                print("User not found for email:", email)
                return JsonResponse({"error": "User not found"}, status=404)
            except Exception as e:
                print("Unexpected error during user lookup:", str(e))
                return JsonResponse({"error": "Server error"}, status=500)

            if staff and await compare_password(password, staff.password):
                # Create JWT payload
                start_time = datetime.now(timezone.utc)
                payload = {
                    'user_id': staff.id,
                    'username': staff.email,
                    'start_time': start_time.isoformat(),
                }
                # Sign tokens
                access_token = await create_access_token(payload, "This is a secret")
                refresh_token = await create_refresh_token(payload, "This is a secret")
                # Save session data
                await set_session_data(request.session, access_token, refresh_token)
                return JsonResponse({'message': "Login successful"}, status=200)
            else:
                return JsonResponse({'error': 'Invalid credentials'}, status=401)

        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid JSON'}, status=400)
        except Exception as e:
            print(f"Error in login: {str(e)}")
            return JsonResponse({'error': 'Server error'}, status=500)
        




    
class ProtectedView(View):
    async def get(self, request):
        auth = CustomJWTAuthentication()
        user, _ = await auth.authenticate(request.session)
        if user:
            return JsonResponse({'message': f'Welcome {user.email}'})
        return JsonResponse({'error': 'Unauthorized'}, status=401)



# class SemanticSearchGeospatialView(View):
#     async def get(self, request):
#         data = json.loads(request.body)
#         query = data.get('search_sentence')  # Sanitize input
#         if not query:
#             return JsonResponse({'results': []})

#         try:
#             # Get model asynchronously
#             model = await get_sentence_transformer_model()

#             # Encode query in a thread pool (synchronous operation)
#             loop = asyncio.get_event_loop()
#             query_embedding = await loop.run_in_executor(
#                 None, lambda: model.encode(query)
#             )

#             # Perform similarity search asynchronously
#             results = await (
#                 GeospatialData.objects
#                 .annotate(distance=CosineDistance('description_embedding', query_embedding))
#                 .aorder_by('distance')
#             )[:10].afetch()

#             # Serialize results
#             results_data = [
#                 {
#                     'id': r.id,
#                     'description': r.description,
#                     'distance': float(r.distance),
#                     'files_dir': r.files_dir,
#                     'date_captured': r.date_captured.isoformat()
#                 }
#                 async for r in results
#             ]

#             return JsonResponse({'results': results_data})
#         except Exception as e:
#             logger.error(f"Error in semantic search: {e}")
#             return JsonResponse({'error': 'Internal server error'}, status=500)
        

# class SemanticSearchGeospatialView(View):
#     async def get(self, request, *args, **kwargs):
#         print("Entering get method")
#         try:
#             data = json.loads(request.body)
#             query = data.get('search_sentence')  
#             page_number = int(request.GET.get('page', 1))
#             page_size = int(request.GET.get('page_size', 20))
#             print(f"Query: {query}, Page: {page_number}, Size: {page_size}")

#             if not query:
#                 return JsonResponse({'data': [], 'has_next': False, 'total_pages': 0, 'current_page': page_number})

#             result = await self.get_paginated_data(query, page_number, page_size)
#             print("Result fetched successfully")

#             return JsonResponse(result)
#         except Exception as e:
#             print(f"Error in get: {str(e)}")
#             logger.error(f"Error in semantic search: {e}")
#             return JsonResponse({'error': str(e)}, status=500)

#     async def get_paginated_data(self, query, page_number, page_size):
#         print("Entering get_paginated_data")
#         try:
#             start = (page_number - 1) * page_size
#             end = start + page_size
#             print(f"Querying with start={start}, end={end}")

#             # Check for cached query embedding
#             query_cache_key = f"query_embedding:{hash(query)}"
#             query_embedding = await get_from_cache(query_cache_key)
#             if query_embedding is None:
#                 model = await get_sentence_transformer_model()
#                 loop = asyncio.get_event_loop()
#                 query_embedding = await loop.run_in_executor(
#                     None, lambda: model.encode(query)
#                 )
#                 await save_to_cache(query_cache_key, query_embedding, timeout=300)  # 5 minutes

#             queryset = (
#                 GeospatialData.objects
#                 .annotate(distance=CosineDistance('desc_embedding', query_embedding))
#                 .aorder_by('distance')
#             )[start:end]

#             results = await queryset.afetch()
#             print("Queryset executed")

#             data_list = [
#                 {
#                     'id': r.id,
#                     'files_dir': r.files_dir,
#                     'description': r.description,
#                     'date_captured': r.date_captured.isoformat(),
#                     'thumbnails_dir': r.thumbnails_dir,
#                     'tiles_path': r.tiles_path,
#                     'type': 'geospatial',
#                     'distance': float(r.distance),
#                     'thumbnail_paths': await loop.run_in_executor(
#                         None, lambda: os.listdir(os.path.join(settings.MEDIA_ROOT, r.thumbnails_dir))
#                     ) if r.thumbnails_dir and os.path.exists(os.path.join(settings.MEDIA_ROOT, r.thumbnails_dir)) else [],
#                     'tile_paths': await loop.run_in_executor(
#                         None, lambda: os.listdir(os.path.join(settings.MEDIA_ROOT, r.tiles_path))
#                     ) if r.tiles_path and os.path.exists(os.path.join(settings.MEDIA_ROOT, r.tiles_path)) else []
#                 }
#                 async for r in results
#             ]

#             total_items = await GeospatialData.objects.filter(description_embedding__isnull=False).acount()
#             print(f"Total items: {total_items}")

#             paginator = Paginator(range(total_items), page_size)
#             has_next = page_number < paginator.num_pages
#             total_pages = paginator.num_pages

#             print(f"data: {data_list}")
#             return {
#                 'data': data_list,
#                 'has_next': has_next,
#                 'total_pages': total_pages,
#                 'current_page': page_number,
#             }
#         except Exception as e:
#             print(f"Error in get_paginated_data: {str(e)}")
#             logger.error(f"Error in get_paginated_data: {e}")
#             raise


@method_decorator(csrf_exempt, name='dispatch')
class SemanticSearchGeospatialView(View):
    async def get(self, request, *args, **kwargs):
        print("Entering get method")
        try:
            data = json.loads(request.body)
            query = data.get('search_query')
            page_number = max(1, int(request.GET.get('page', 1)))
            page_size = max(1, min(100, int(request.GET.get('page_size', 20))))
            print(f"Query: {query}, Page: {page_number}, Size: {page_size}")

            if not query:
                return JsonResponse({'data': [], 'has_next': False, 'total_pages': 0, 'current_page': page_number})

            result = await self.get_paginated_data(query, page_number, page_size)
            print("Result fetched successfully")

            return JsonResponse(result, status=200)
        except Exception as e:
            print(f"Error in get: {str(e)}")
            logger.error(f"Error in semantic search: {e}", exc_info=True)
            return JsonResponse({'error': str(e)}, status=500)

    async def post(self, request, *args, **kwargs):
        print("Entering post method")
        try:
            data = json.loads(request.body)
            query = data.get('search_query')
            page_number = max(1, int(request.GET.get('page', 1)))
            page_size = max(1, min(100, int(request.GET.get('page_size', 20))))
            print(f"Query: {query}, Page: {page_number}, Size: {page_size}")

            if not query:
                return JsonResponse({'data': [], 'has_next': False, 'total_pages': 0, 'current_page': page_number})

            result = await self.get_paginated_data(query, page_number, page_size)
            print("Result fetched successfully")

            return JsonResponse(result, status=200)
        except Exception as e:
            print(f"Error in post: {str(e)}")
            logger.error(f"Error in semantic search: {e}", exc_info=True)
            return JsonResponse({'error': str(e)}, status=500)

    async def get_paginated_data(self, query, page_number, page_size):
        print("Entering get_paginated_data")
        try:
            start = (page_number - 1) * page_size
            end = start + page_size
            print(f"Querying with start={start}, end={end}")

            @sync_to_async
            def set_hnsw_ef_search():
                with connection.cursor() as cursor:
                    cursor.execute('SET hnsw.ef_search = 100;')

            await set_hnsw_ef_search()

            query_cache_key = f"query_embedding:{hash(query)}"
            query_embedding = await get_from_cache(query_cache_key)
            if query_embedding is None:
                model = await get_sentence_transformer_model()
                loop = asyncio.get_event_loop()
                query_embedding = await loop.run_in_executor(
                    None, lambda: model.encode(query)
                )
                await save_to_cache(query_cache_key, query_embedding, timeout=300)

            count_cache_key = f"total_items:{hash(query)}"
            total_items = await get_from_cache(count_cache_key)
            if total_items is None:
                total_items = await sync_to_async(
                    GeospatialData.objects.filter(desc_embedding__isnull=False).count
                )()
                await save_to_cache(count_cache_key, total_items, timeout=300)

            @sync_to_async
            def get_queryset_results(model_name):
                results = model_name.objects \
                    .filter(desc_embedding__isnull=False) \
                    .annotate(distance=CosineDistance('desc_embedding', query_embedding)) \
                    .order_by('distance')[:100]

                return [
                    {
                        **model_to_dict(obj, exclude=['desc_embedding']),
                        'distance': obj.distance
                    }
                    for obj in results
                ]


            results = await get_queryset_results(GeospatialData)
            print("Queryset executed", results)

            data_list = []
            loop = asyncio.get_event_loop()
            for r in results:
                print(r.get('thumbnails_dir'))
                thumbnail_cache_key = f"thumbnails:{r.get('thumbnails_dir')}" if r.get('thumbnails_dir') else None
                thumbnail_paths = None
                if thumbnail_cache_key:
                    thumbnail_paths = await get_from_cache(thumbnail_cache_key)
                    if thumbnail_paths is None and r.get('thumbnails_dir') and os.path.exists(os.path.join(settings.MEDIA_ROOT, r.get('thumbnails_dir'))):
                        thumbnail_paths = await loop.run_in_executor(
                            None, lambda: os.listdir(os.path.join(settings.MEDIA_ROOT, r.get('thumbnails_dir')))
                        )
                        await save_to_cache(thumbnail_cache_key, thumbnail_paths, timeout=86400)

                tile_cache_key = f"tiles:{r.get('tiles_path')}" if r.get('tiles_path') else None
                tile_paths = None
                if tile_cache_key:
                    tile_paths = await get_from_cache(tile_cache_key)
                    if tile_paths is None and r.get('tiles_path') and os.path.exists(os.path.join(settings.MEDIA_ROOT, r.get('tiles_path'))):
                        tile_paths = await loop.run_in_executor(
                            None, lambda: os.listdir(os.path.join(settings.MEDIA_ROOT, r.get('tiles_path')))
                        )
                        await save_to_cache(tile_cache_key, tile_paths, timeout=86400)

                data_list.append({
                    'id': r.get('id'),
                    'files_dir': r.get('files_dir'),
                    'description': r.get('description'),
                    'date_captured': r.get('date_captured').isoformat(),
                    'thumbnails_dir': r.get('thumbnails_dir'),
                    'tiles_path': r.get('tiles_path'),
                    'type': 'geospatial',
                    'thumbnail_paths': thumbnail_paths or [],
                    'tile_paths': tile_paths or []
                })

            paginator = Paginator(range(total_items), page_size)
            has_next = page_number < paginator.num_pages
            total_pages = paginator.num_pages

            print(f"data: {data_list}")
            return {
                'data': data_list,
                'has_next': has_next,
                'total_pages': total_pages,
                'current_page': page_number,
            }
        except Exception as e:
            print(f"Error in get_paginated_data: {str(e)}")
            logger.error(f"Error in get_paginated_data: {e}", exc_info=True)
            raise


@method_decorator(csrf_exempt, name='dispatch')
class SemanticSearchDocumentView(View):
    async def get(self, request, *args, **kwargs):
        print("Entering get method")
        try:
            data = json.loads(request.body)
            query = data.get('search_query')
            page_number = max(1, int(request.GET.get('page', 1)))
            page_size = max(1, min(100, int(request.GET.get('page_size', 20))))
            print(f"Query: {query}, Page: {page_number}, Size: {page_size}")

            if not query:
                return JsonResponse({'data': [], 'has_next': False, 'total_pages': 0, 'current_page': page_number})

            result = await self.get_paginated_data(query, page_number, page_size)
            print("Result fetched successfully")

            return JsonResponse(result, status=200)
        except Exception as e:
            print(f"Error in get: {str(e)}")
            logger.error(f"Error in semantic search: {e}", exc_info=True)
            return JsonResponse({'error': str(e)}, status=500)

    async def post(self, request, *args, **kwargs):
        print("Entering post method")
        try:
            data = json.loads(request.body)
            query = data.get('search_query')
            page_number = max(1, int(request.GET.get('page', 1)))
            page_size = max(1, min(100, int(request.GET.get('page_size', 20))))
            print(f"Query: {query}, Page: {page_number}, Size: {page_size}")

            if not query:
                return JsonResponse({'data': [], 'has_next': False, 'total_pages': 0, 'current_page': page_number})

            result = await self.get_paginated_data(query, page_number, page_size)
            print("Result fetched successfully")

            return JsonResponse(result, status=200)
        except Exception as e:
            print(f"Error in post: {str(e)}")
            logger.error(f"Error in semantic search: {e}", exc_info=True)
            return JsonResponse({'error': str(e)}, status=500)

    async def get_paginated_data(self, query, page_number, page_size):
        print("Entering get_paginated_data")
        try:
            start = (page_number - 1) * page_size
            end = start + page_size
            print(f"Querying with start={start}, end={end}")

            @sync_to_async
            def set_hnsw_ef_search():
                with connection.cursor() as cursor:
                    cursor.execute('SET hnsw.ef_search = 100;')

            await set_hnsw_ef_search()

            query_cache_key = f"query_embedding:{hash(query)}"
            query_embedding = await get_from_cache(query_cache_key)
            if query_embedding is None:
                model = await get_sentence_transformer_model()
                loop = asyncio.get_event_loop()
                query_embedding = await loop.run_in_executor(
                    None, lambda: model.encode(query)
                )
                await save_to_cache(query_cache_key, query_embedding, timeout=300)

            count_cache_key = f"total_items:{hash(query)}"
            total_items = await get_from_cache(count_cache_key)
            if total_items is None:
                total_items = await sync_to_async(
                    DocumentData.objects.filter(desc_embedding__isnull=False).count
                )()
                await save_to_cache(count_cache_key, total_items, timeout=300)

            @sync_to_async
            def get_queryset_results(model_name):
                results = model_name.objects \
                    .filter(desc_embedding__isnull=False) \
                    .annotate(distance=CosineDistance('desc_embedding', query_embedding)) \
                    .order_by('distance')[:100]

                return [
                    {
                        **model_to_dict(obj, exclude=['desc_embedding']),
                        'distance': obj.distance
                    }
                    for obj in results
                ]


            results = await get_queryset_results(DocumentData)
            print("Queryset executed", results)
            for item in results:
                item['file'] = item.get('file').url if item.get('file') else None
                item['thumbnail'] = item.get('thumbnail').url if item.get('thumbnail') else None
               
                print("document object",item)
                item['type'] = 'document'

           

            paginator = Paginator(range(total_items), page_size)
            has_next = page_number < paginator.num_pages
            total_pages = paginator.num_pages

            print(f"data: { results}")
            return {
                'data':  results,
                'has_next': has_next,
                'total_pages': total_pages,
                'current_page': page_number,
            }
        except Exception as e:
            print(f"Error in get_paginated_data: {str(e)}")
            logger.error(f"Error in get_paginated_data: {e}", exc_info=True)
            raise

@method_decorator(csrf_exempt, name='dispatch')
class SemanticSearchMapView(View):
    async def get(self, request, *args, **kwargs):
        print("Entering get method")
        try:
            data = json.loads(request.body)
            query = data.get('search_query')
            page_number = max(1, int(request.GET.get('page', 1)))
            page_size = max(1, min(100, int(request.GET.get('page_size', 20))))
            print(f"Query: {query}, Page: {page_number}, Size: {page_size}")

            if not query:
                return JsonResponse({'data': [], 'has_next': False, 'total_pages': 0, 'current_page': page_number})

            result = await self.get_paginated_data(query, page_number, page_size)
            print("Result fetched successfully")

            return JsonResponse(result, status=200)
        except Exception as e:
            print(f"Error in get: {str(e)}")
            logger.error(f"Error in semantic search: {e}", exc_info=True)
            return JsonResponse({'error': str(e)}, status=500)

    async def post(self, request, *args, **kwargs):
        print("Entering post method")
        try:
            data = json.loads(request.body)
            query = data.get('search_query')
            page_number = max(1, int(request.GET.get('page', 1)))
            page_size = max(1, min(100, int(request.GET.get('page_size', 20))))
            print(f"Query: {query}, Page: {page_number}, Size: {page_size}")

            if not query:
                return JsonResponse({'data': [], 'has_next': False, 'total_pages': 0, 'current_page': page_number})

            result = await self.get_paginated_data(query, page_number, page_size)
            print("Result fetched successfully")

            return JsonResponse(result, status=200)
        except Exception as e:
            print(f"Error in post: {str(e)}")
            logger.error(f"Error in semantic search: {e}", exc_info=True)
            return JsonResponse({'error': str(e)}, status=500)

    async def get_paginated_data(self, query, page_number, page_size):
        print("Entering get_paginated_data")
        try:
            start = (page_number - 1) * page_size
            end = start + page_size
            print(f"Querying with start={start}, end={end}")

            @sync_to_async
            def set_hnsw_ef_search():
                with connection.cursor() as cursor:
                    cursor.execute('SET hnsw.ef_search = 100;')

            await set_hnsw_ef_search()

            query_cache_key = f"query_embedding:{hash(query)}"
            query_embedding = await get_from_cache(query_cache_key)
            if query_embedding is None:
                model = await get_sentence_transformer_model()
                loop = asyncio.get_event_loop()
                query_embedding = await loop.run_in_executor(
                    None, lambda: model.encode(query)
                )
                await save_to_cache(query_cache_key, query_embedding, timeout=300)

            count_cache_key = f"total_items:{hash(query)}"
            total_items = await get_from_cache(count_cache_key)
            if total_items is None:
                total_items = await sync_to_async(
                    MapData.objects.filter(desc_embedding__isnull=False).count
                )()
                await save_to_cache(count_cache_key, total_items, timeout=300)

            @sync_to_async
            def get_queryset_results(model_name):
                results = model_name.objects \
                    .filter(desc_embedding__isnull=False) \
                    .annotate(distance=CosineDistance('desc_embedding', query_embedding)) \
                    .order_by('distance')[:100]

                return [
                    {
                        **model_to_dict(obj, exclude=['desc_embedding']),
                        'distance': obj.distance
                    }
                    for obj in results
                ]


            results = await get_queryset_results(MapData)
            print("Queryset executed", results)
            for item in results:
                item['file'] = item.get('file').url if item.get('file') else None
                item['thumbnail'] = item.get('thumbnail').url if item.get('thumbnail') else None
                item['type'] = 'map'

           

            paginator = Paginator(range(total_items), page_size)
            has_next = page_number < paginator.num_pages
            total_pages = paginator.num_pages

            print(f"data: { results}")
            return {
                'data':  results,
                'has_next': has_next,
                'total_pages': total_pages,
                'current_page': page_number,
            }
        except Exception as e:
            print(f"Error in get_paginated_data: {str(e)}")
            logger.error(f"Error in get_paginated_data: {e}", exc_info=True)
            raise

@method_decorator(csrf_exempt, name='dispatch')
class SemanticSearchAnalysisView(View):
    async def get(self, request, *args, **kwargs):
        print("Entering get method")
        try:
            data = json.loads(request.body)
            query = data.get('search_query')
            page_number = max(1, int(request.GET.get('page', 1)))
            page_size = max(1, min(100, int(request.GET.get('page_size', 20))))
            print(f"Query: {query}, Page: {page_number}, Size: {page_size}")

            if not query:
                return JsonResponse({'data': [], 'has_next': False, 'total_pages': 0, 'current_page': page_number})

            result = await self.get_paginated_data(query, page_number, page_size)
            print("Result fetched successfully")

            return JsonResponse(result, status=200)
        except Exception as e:
            print(f"Error in get: {str(e)}")
            logger.error(f"Error in semantic search: {e}", exc_info=True)
            return JsonResponse({'error': str(e)}, status=500)

    async def post(self, request, *args, **kwargs):
        print("Entering post method")
        try:
            data = json.loads(request.body)
            query = data.get('search_query')
            page_number = max(1, int(request.GET.get('page', 1)))
            page_size = max(1, min(100, int(request.GET.get('page_size', 20))))
            print(f"Query: {query}, Page: {page_number}, Size: {page_size}")

            if not query:
                return JsonResponse({'data': [], 'has_next': False, 'total_pages': 0, 'current_page': page_number})

            result = await self.get_paginated_data(query, page_number, page_size)
            print("Result fetched successfully")

            return JsonResponse(result, status=200)
        except Exception as e:
            print(f"Error in post: {str(e)}")
            logger.error(f"Error in semantic search: {e}", exc_info=True)
            return JsonResponse({'error': str(e)}, status=500)

    async def get_paginated_data(self, query, page_number, page_size):
        print("Entering get_paginated_data")
        try:
            start = (page_number - 1) * page_size
            end = start + page_size
            print(f"Querying with start={start}, end={end}")

            @sync_to_async
            def set_hnsw_ef_search():
                with connection.cursor() as cursor:
                    cursor.execute('SET hnsw.ef_search = 100;')

            await set_hnsw_ef_search()

            query_cache_key = f"query_embedding:{hash(query)}"
            query_embedding = await get_from_cache(query_cache_key)
            if query_embedding is None:
                model = await get_sentence_transformer_model()
                loop = asyncio.get_event_loop()
                query_embedding = await loop.run_in_executor(
                    None, lambda: model.encode(query)
                )
                await save_to_cache(query_cache_key, query_embedding, timeout=300)

            count_cache_key = f"total_items:{hash(query)}"
            total_items = await get_from_cache(count_cache_key)
            if total_items is None:
                total_items = await sync_to_async(
                    AnalysispData.objects.filter(desc_embedding__isnull=False).count
                )()
                await save_to_cache(count_cache_key, total_items, timeout=300)

            @sync_to_async
            def get_queryset_results(model_name):
                results = model_name.objects \
                    .filter(desc_embedding__isnull=False) \
                    .annotate(distance=CosineDistance('desc_embedding', query_embedding)) \
                    .order_by('distance')[:100]

                return [
                    {
                        **model_to_dict(obj, exclude=['desc_embedding']),
                        'distance': obj.distance
                    }
                    for obj in results
                ]


            results = await get_queryset_results(AnalysispData)
            print("Queryset executed", results)
            for item in results:
                item['file'] = item.get('file').url if item.get('file') else None
                item['thumbnail'] = item.get('thumbnail').url if item.get('thumbnail') else None
                item['type'] = 'analysis'

           

            paginator = Paginator(range(total_items), page_size)
            has_next = page_number < paginator.num_pages
            total_pages = paginator.num_pages

            print(f"data: { results}")
            return {
                'data':  results,
                'has_next': has_next,
                'total_pages': total_pages,
                'current_page': page_number,
            }
        except Exception as e:
            print(f"Error in get_paginated_data: {str(e)}")
            logger.error(f"Error in get_paginated_data: {e}", exc_info=True)
            raise

@method_decorator(csrf_exempt, name='dispatch')
class SemanticSearchAllDataView(View):
    async def get(self, request, *args, **kwargs):
        print("Entering get method")
        try:
            data = json.loads(request.body)
            query = data.get('search_query')
            page_number = max(1, int(request.GET.get('page', 1)))
            page_size = max(1, min(100, int(request.GET.get('page_size', 20))))
            print(f"Query: {query}, Page: {page_number}, Size: {page_size}")

            if not query:
                return JsonResponse({'data': [], 'has_next': False, 'total_pages': 0, 'current_page': page_number})

            result = await self.get_paginated_data(query, page_number, page_size)
            print("Result fetched successfully")

            return JsonResponse(result, status=200)
        except Exception as e:
            print(f"Error in get: {str(e)}")
            logger.error(f"Error in semantic search: {e}", exc_info=True)
            return JsonResponse({'error': str(e)}, status=500)

    async def post(self, request, *args, **kwargs):
        print("Entering post method")
        try:
            data = json.loads(request.body)
            query = data.get('search_query')
            page_number = max(1, int(request.GET.get('page', 1)))
            page_size = max(1, min(100, int(request.GET.get('page_size', 20))))
            print(f"Query: {query}, Page: {page_number}, Size: {page_size}")

            if not query:
                return JsonResponse({'data': [], 'has_next': False, 'total_pages': 0, 'current_page': page_number})

            result = await self.get_paginated_data(query, page_number, page_size)
            print("Result fetched successfully")

            return JsonResponse(result, status=200)
        except Exception as e:
            print(f"Error in post: {str(e)}")
            logger.error(f"Error in semantic search: {e}", exc_info=True)
            return JsonResponse({'error': str(e)}, status=500)

    async def get_paginated_data(self, query, page_number, page_size):
        print("Entering get_paginated_data")
        try:
            start = (page_number - 1) * page_size
            end = start + page_size
            print(f"Querying with start={start}, end={end}")

            @sync_to_async
            def set_hnsw_ef_search():
                with connection.cursor() as cursor:
                    cursor.execute('SET hnsw.ef_search = 100;')

            await set_hnsw_ef_search()

            query_cache_key = f"query_embedding:{hash(query)}"
            query_embedding = await get_from_cache(query_cache_key)
            if query_embedding is None:
                model = await get_sentence_transformer_model()
                loop = asyncio.get_event_loop()
                query_embedding = await loop.run_in_executor(
                    None, lambda: model.encode(query)
                )
                await save_to_cache(query_cache_key, query_embedding, timeout=300)

            

            @sync_to_async
            # def get_queryset_results(model_name):
            #     return list(
            #         model_name.objects
            #         .filter(desc_embedding__isnull=False)
            #         .annotate(distance=CosineDistance('desc_embedding', query_embedding))
            #         .order_by('distance')[:100][start:end]
            #     )

            

            def get_queryset_results(model_name):
                results = model_name.objects \
                    .filter(desc_embedding__isnull=False) \
                    .annotate(distance=CosineDistance('desc_embedding', query_embedding)) \
                    .order_by('distance')[:100]

                return [
                    {
                        **model_to_dict(obj, exclude=['desc_embedding']),
                        'distance': obj.distance
                    }
                    for obj in results
                ]

               

            analysis_results = await get_queryset_results(AnalysispData)
            map_results = await get_queryset_results(MapData)
            geospatial_results = await get_queryset_results(GeospatialData)
            document_results= await get_queryset_results(DocumentData)
            
            for item in geospatial_results:
                print("objects",item)
                item['type'] = 'geospatial'
                item['file'] = item.get('file').url if item.get('file') else None
                item['thumbnail'] = item.get('thumbnail').url if item.get('thumbnail') else None
                item['thumbnail_paths'] = os.listdir(os.path.join(settings.MEDIA_ROOT,item['thumbnails_dir']))
                item['tile_paths'] = os.listdir(os.path.join(settings.MEDIA_ROOT,item['tiles_path']))
            for item in document_results:
                item['file'] = item.get('file').url if item.get('file') else None
                item['thumbnail'] = item.get('thumbnail').url if item.get('thumbnail') else None
                item['type'] = 'document'
            for item in map_results:
                item['file'] = item.get('file').url if item.get('file') else None
                item['thumbnail'] = item.get('thumbnail').url if item.get('thumbnail') else None
                item['type'] = 'map'
            for item in analysis_results:
                item['file'] = item.get('file').url if item.get('file') else None
                item['thumbnail'] = item.get('thumbnail').url if item.get('thumbnail') else None
                item['type'] = 'analysis'

            all_data = analysis_results + map_results + geospatial_results+ document_results
            print("Queryset executed", all_data)
            all_data=all_data[start:end]

            count_cache_key = f"total_items:{hash(query)}"
            total_items = await get_from_cache(count_cache_key)
            if total_items is None:
                total_items = len(all_data)
                await save_to_cache(count_cache_key, total_items, timeout=300)

           

           

            paginator = Paginator(range(total_items), page_size)
            has_next = page_number < paginator.num_pages
            total_pages = paginator.num_pages

            print(f"data: { all_data}")
            return {
                'data':  all_data,
                'has_next': has_next,
                'total_pages': total_pages,
                'current_page': page_number,
            }
        except Exception as e:
            print(f"Error in get_paginated_data: {str(e)}")
            logger.error(f"Error in get_paginated_data: {e}", exc_info=True)
            raise