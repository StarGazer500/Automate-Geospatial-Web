from .views import *
from django.urls import path

urlpatterns = [

    
    ##Get All Datasett
    path('geospatial-data/', GeospatialDataView.as_view(), name='geospatial-data'),
    path('document-data/', RetrieveAllDocumentDataset.as_view(), name='document-data'),
    path('map-data/', RetrieveAllMapDataset.as_view(), name='map-data'),
    path('analysis-data/', RetrieveAllAnalysisDataset.as_view(), name='analysis-data'),
    path('all-data/', RetrieveAllDataset.as_view(), name='all-data'),

    ##Handle Get,Delete,Update by Id
    path('get-update-delete-document/<int:document_id>/',GetUpdateDeleteDocumentView.as_view(),name="get-update-delete-document"),
    path('get-update-delete-map/<int:map_id>/',GetUpdateDeleteMapView.as_view(),name="get-update-delete-map"),
    path('get-update-delete-geospatial/<int:geo_id>/',GetUpdateDeleteGeospatialView.as_view(),name="get-update-delete-geospatial"),
    path('get-update-delete-analysis/<int:analysis_id>/',GetUpdateDeleteAnalysisView.as_view(),name="get-update-delete-analysis"),
]