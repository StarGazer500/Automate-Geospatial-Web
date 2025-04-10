from django.shortcuts import render
from .models import MapData, DocumentData, GeospatialData, AnalysispData
from django.core.paginator import Paginator
from django.http import JsonResponse
from asgiref.sync import sync_to_async
from django.views import View
from datetime import datetime
from django.utils import timezone
from pathlib import Path
import os

from django.conf import settings

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
            
            queryset = GeospatialData.objects.all().order_by('-date_captured').values(
                'id', 'files_dir','tiles_path', 'description', 'date_captured','thumbnails_dir','tiles_path'
            )[start:end]
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
            
            queryset = DocumentData.objects.all().order_by('-date_captured').values(
                'id', 'file', 'description', 'date_captured','thumbnail'
            )[start:end]
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
            
            queryset = MapData.objects.all().order_by('-date_captured').values(
                'id', 'file', 'description', 'date_captured','thumbnail'
            )[start:end]
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
        ).order_by('-uploaded_at').values(
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

        )[start:end]
        
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
            geo_data = list(GeospatialData.objects.all().order_by('-date_captured').values(
                'id', 'description', 'date_captured','thumbnails_dir','tiles_path'
            ))
            doc_data = list(DocumentData.objects.all().order_by('-date_captured').values(
                'id', 'file', 'description', 'date_captured','thumbnail'
            ))
            map_data = list(MapData.objects.all().order_by('-date_captured').values(
                'id', 'file', 'description', 'date_captured','thumbnail'
            ))
            analysis_data = list(AnalysispData.objects.select_related(
                'map_data', 'document_data', 'input_data', 'output_data'
            ).order_by('-uploaded_at').values(
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
            for item in all_data:
                if 'uploaded_at' in item and item['uploaded_at']:
                    item['sort_date'] = item['uploaded_at']  # Already aware if USE_TZ=True
                elif 'date_captured' in item and item['date_captured']:
                    # Convert date_captured to an aware datetime
                    naive_dt = datetime.combine(item['date_captured'], datetime.min.time())
                    item['sort_date'] = timezone.make_aware(naive_dt)
                else:
                    # Fallback to an aware minimum datetime
                    item['sort_date'] = timezone.make_aware(datetime.min)

            # Sort by the normalized sort_date
            all_data.sort(key=lambda x: x['sort_date'], reverse=True)

            # Paginate the combined data
            data_list = all_data[start:end]
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