from .views import *
from django.urls import path

urlpatterns = [

    
    # Authentication

    path('login-user/',LoginUserView.as_view(),name="login-user"),
    path('is_user_authenticated/',ProtectedView.as_view(),name="is_user_authenticated"),

    path('semantic-search-geospatial/',SemanticSearchGeospatialView.as_view(),name="semantic-search-geospatial"),
    path('semantic-search-document/',SemanticSearchDocumentView.as_view(),name="semantic-search-document"),
    path('semantic-search-map/',SemanticSearchMapView.as_view(),name="semantic-search-map"),
    path('semantic-search-analysis/',SemanticSearchAnalysisView.as_view(),name="semantic-search-analysis"),
    path('semantic-search-all/',SemanticSearchAllDataView.as_view(),name="semantic-search-all"),

    ##Get All Dataset
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

    # path('create-department', CreateDepartmentView.as_view(),name='create-department'),
    # path('create-compartment', CompactmentIdentifier.as_view(),name='create-comartment')
]