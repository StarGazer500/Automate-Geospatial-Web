from django.shortcuts import render
from .models import MapData, DocumentData, GeospatialData, AnalysispData
from django.core.paginator import Paginator
from django.http import JsonResponse
from asgiref.sync import sync_to_async
from django.views import View
from datetime import datetime
from django.utils import timezone

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
                'id', 'file', 'description', 'date_captured'
            )[start:end]
            print("Queryset executed")
            
            data_list = list(queryset)
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
                'id', 'file', 'description', 'date_captured'
            )[start:end]
            print("Queryset executed")
            
            data_list = list(queryset)
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
                'id', 'file', 'description', 'date_captured'
            )[start:end]
            print("Queryset executed")
            
            data_list = list(queryset)
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
            'map_data__file',
            'map_data__description',
            'document_data__file',
            'document_data__description',
            'input_data__file',
            'input_data__description',
            'output_data__file',
            'output_data__description'
        )[start:end]
        
        data_list = list(queryset)
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
                'id', 'file', 'description', 'date_captured'
            ))
            doc_data = list(DocumentData.objects.all().order_by('-date_captured').values(
                'id', 'file', 'description', 'date_captured'
            ))
            map_data = list(MapData.objects.all().order_by('-date_captured').values(
                'id', 'file', 'description', 'date_captured'
            ))
            analysis_data = list(AnalysispData.objects.select_related(
                'map_data', 'document_data', 'input_data', 'output_data'
            ).order_by('-uploaded_at').values(
                'id', 'file', 'description', 'date_captured', 'uploaded_at',
                'map_data__file', 'map_data__description',
                'document_data__file', 'document_data__description',
                'input_data__file', 'input_data__description',
                'output_data__file', 'output_data__description'
            ))

            # Add type field to distinguish models
            for item in geo_data:
                item['type'] = 'geospatial'
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