from .views import *
from django.urls import path

urlpatterns = [

    #Template Views
    ##Patient Lab Request Template Views
    path('geospatial-data/', GeospatialDataView.as_view(), name='geospatial-data'),
    path('document-data/', RetrieveAllDocumentDataset.as_view(), name='document-data'),
    path('map-data/', RetrieveAllMapDataset.as_view(), name='map-data'),
    path('analysis-data/', RetrieveAllAnalysisDataset.as_view(), name='analysis-data'),
    path('all-data/', RetrieveAllDataset.as_view(), name='all-data'),
]