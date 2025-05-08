from .views import *
from django.urls import path

urlpatterns = [

    
    ##Get All Compartments
    path('retrieve-all-compt/', RetrieveAllCompartments.as_view(), name='retrieve-all-compt'),

    ## Get The QC Points within the components
     path('rerieve-qcpnts-in-comptment/',  RetrieveQCPointWithinCompartment.as_view(), name='rerieve-qcpnts-in-comptment'),

]