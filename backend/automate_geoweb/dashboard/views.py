from django.http import JsonResponse
from django.views import View
from asgiref.sync import sync_to_async
from django.contrib.gis.serializers.geojson import Serializer as GeoJSONSerializer
from django.contrib.gis.geos import GEOSGeometry
from .models import RbghCompartmentTracker,MaintenanceQc
import json
import logging
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from datetime import datetime, date

logger = logging.getLogger(__name__)




async def maintenance_compute_qc_analytics(query_obj):


    #overral qc asesssment
    overral_maintenance_assessment={" total_qc":len(query_obj),"passed_maintrnance_qc":0,"failed_maintenance_qc":0}

    #qc activity assessment
    activity_assessment={
        "maintenance_slashing": 0,
        "maintenance_ring_weeding": 0,
        "post_emergent_grass_regeneration_spray":0,
        "spot_Spray_woody_species":0,
        "liana_cutting_and__line_clearing_for_enrichment_planting":0,
      
       
        "bush_clearing_maintenace":0,
      
    }

    land_cover_assessment={
        "natural_forest":0,
        "degraded_forest":0,
        "farmland_active":0,
        "farmbush":0,
        "deserted_farm":0,
        "grassland":0,
        "waterlogged":0,
        "rockyarea":0
    }

    qc_reporter_assessments={
        "Felix_Zagdong":0,
        "Henry_Ameyaw":0,
        "Isaac_Boateng":0,
        "Gregory_Febiri_Hareking":0,
        "Anthony_Adu":0,
        "Brandford_Anane_Acquah":0,
        "Emmanuel_Gyapong":0,
        "Sombi_Richard":0,
        "Boateng_Japhet_Obeng":0,
        "Okyere_Duku_Festus":0,
        "Cecilia_Kyeremateng":0,
        "Nicholas_Opoku":0,
        "Prince_Baidoo":0

    }

    species_assessment={
        "Terminalia_ivorensis":0,
        "Terminalia_superba":0,
        "Tetrapleura_tetraptera":0,
        "Milicia_excelsa":0,
        "Nesogordonia_papaverifera":0,
        "Pycnanthus_angolensis":0,
        "Albizia_adianthifolia":0,
        "Entandrophragma_angolense":0,
        "Cola_lateritia":0,
        "Ficus_exasperata":0,
        "Bombax_buonopozense":0,
        "Ceiba_pentandra":0,
        "Khaya_anthotheca":0,
        "Cola_gigantea":0,
        "Mansonia_altissima":0,
        "Pericopsis_elata":0,
        "Celtics_mildbraedii":0,
        "Unknown":0
    }




    for obj in query_obj:
       
    #total count of qc passed and total qc failed
        if obj.maintenance_qc_result_pass_or_fail:
            if obj.maintenance_qc_result_pass_or_fail=="Passed":
                overral_maintenance_assessment["passed_maintrnance_qc"]+=1
            elif obj.maintenance_qc_result_pass_or_fail=="Failed":
                overral_maintenance_assessment["failed_maintenance_qc"]+=1


        #total count of each qc activities
        print(obj.activity)
        if obj.activity:
            if obj.activity=="M004 - Maintenance Slashing":
                activity_assessment["maintenance_slashing"]+=1
            elif obj.activity=="M001 - Maintenance Ring Weeding":
                activity_assessment["maintenance_ring_weeding"]+=1
            elif obj.activity=="M005 - Post-emergent - Grass regeneration Spray":
                activity_assessment["post_emergent_grass_regeneration_spray"]+=1
            elif obj.activity=="M007 - Spot Spray for woody  species":
                    activity_assessment["spot_Spray_woody_species"]+=1
            
            elif obj.activity=="M008 - Liana Cutting & Line Clearing for Enrichment Planting":
                activity_assessment["liana_cutting_and__line_clearing_for_enrichment_planting"]+=1

          
            elif obj.activity=="M009 - Bush Clearing - Maintenance":
                activity_assessment["bush_clearing_maintenace"]+=1

        #Total Count for Land Cover
        if obj.land_cover:
            if obj.land_cover=="Natural Forest":
                land_cover_assessment["natural_forest"]=+1
            elif obj.land_cover=="Degraded Forest":
                land_cover_assessment["degraded_forest"]+=1
            elif obj.land_cover=="Farmland (Active)":
                land_cover_assessment["farmland_active"]+=1
            elif obj.land_cover=="Farmbush":
                land_cover_assessment["farmbush"]+=1
            elif obj.land_cover=="Deserted Farm":
                land_cover_assessment["deserted_farm"]+=1
            elif obj.land_cover=="Grassland":
                land_cover_assessment["grassland"]+=1
            elif obj.land_cover=="Waterlogged":
                land_cover_assessment["waterlogged"]+=1
            elif obj.land_cover=="Rocky Area":
                land_cover_assessment["rockyarea"]+=1

        #Supervisors Assessent
        if obj.qc_reporter:
            if obj.qc_reporter=="Felix Zagdong":
                qc_reporter_assessments["Felix_Zagdong"]+=1
            elif obj.qc_reporter=="Henry Ameyaw":
                qc_reporter_assessments["Henry_Ameyaw"]+=1
            elif obj.qc_reporter=="Isaac Boateng":
                qc_reporter_assessments["Isaac_Boateng"]+=1
            elif obj.qc_reporter=="Gregory Febiri Hareking":
                qc_reporter_assessments["Gregory_Febiri_Hareking"]+=1
            elif obj.qc_reporter=="Anthony Adu":
                qc_reporter_assessments["Anthony_Adu"]+=1
            elif obj.qc_reporter=="Brandford Anane Acquah":
                qc_reporter_assessments["Boateng_Japhet_Obeng"]+=1
            elif  obj.qc_reporter=="Prince Baidoo":
                qc_reporter_assessments["Prince_Baidoo"]+=1
            elif obj.qc_reporter=="Emmanuel Gyapong":
                qc_reporter_assessments["Emmanuel_Gyapong"]+=1
            elif obj.qc_reporter=="Sombi Richard":
                qc_reporter_assessments["Sombi_Richard"]+=1
            elif obj.qc_reporter=="Boateng Japhet Obeng":
                qc_reporter_assessments["Boateng_Japhet_Obeng"]+=1
            elif obj.qc_reporter=="Okyere Duku Festus":
               qc_reporter_assessments["Okyere_Duku_Festus"]+1
            elif obj.qc_reporter=="Cecilia Kyeremateng":
               qc_reporter_assessments["Cecilia_Kyeremateng"]+1
            elif obj.qc_reporter=="Nicholas Opoku":
                qc_reporter_assessments["Nicholas_Opoku"]+=1

        #Species Count
        if obj.planted_species_1 and obj.species_1_count:
            if  obj.planted_species_1=="Terminalia ivorensis" and obj.species_1_count :
                species_assessment["Terminalia_ivorensis"]+=obj.species_1_count
            elif  obj.planted_species_1=="Terminalia superba" and obj.species_1_count :
                species_assessment["Terminalia_superba"]+=obj.species_1_count
            elif  obj.planted_species_1=="Tetrapleura tetraptera" and obj.species_1_count :
                species_assessment["Tetrapleura_tetraptera"]+=obj.species_1_count
            elif  obj.planted_species_1=="Milicia excelsa" and obj.species_1_count :
                species_assessment["Milicia_excelsa"]+=obj.species_1_count
            elif  obj.planted_species_1=="Nesogordonia papaverifera" and obj.species_1_count :
                species_assessment["Nesogordonia_papaverifera"]+=obj.species_1_count
            elif  obj.planted_species_1=="Pycnanthus angolensis" and obj.species_1_count :
                species_assessment["Pycnanthus_angolensis"]+=obj.species_1_count
            elif  obj.planted_species_1=="Albizia adianthifolia" and obj.species_1_count :
                species_assessment["Albizia_adianthifolia"]+=obj.species_1_count
            elif  obj.planted_species_1=="Entandrophragma angolense" and obj.species_1_count :
                species_assessment["Entandrophragma_angolense"]+=obj.species_1_count
            elif  obj.planted_species_1=="Cola lateritia" and obj.species_1_count :
                species_assessment["Cola_lateritia"]+=obj.species_1_count
            elif  obj.planted_species_1=="Ficus exasperata" and obj.species_1_count :
                species_assessment["Ficus_exasperata"]+=obj.species_1_count
            elif  obj.planted_species_1=="Bombax buonopozense" and obj.species_1_count :
                species_assessment["Bombax_buonopozense"]+=obj.species_1_count
            elif  obj.planted_species_1=="Ceiba pentandra" and obj.species_1_count :
                species_assessment["Ceiba_pentandra"]+=obj.species_1_count
            elif  obj.planted_species_1=="Khaya anthotheca" and obj.species_1_count :
                species_assessment["Khaya_anthotheca"]+=obj.species_1_count
            elif  obj.planted_species_1=="Cola gigantea" and obj.species_1_count :
                species_assessment["Cola_gigantea"]+=obj.species_1_count
            elif  obj.planted_species_1=="Mansonia altissima" and obj.species_1_count :
                species_assessment["Mansonia_altissima"]+=obj.species_1_count
            elif  obj.planted_species_1=="Pericopsis elata" and obj.species_1_count :
                species_assessment["Pericopsis_elata"]+=obj.species_1_count
            elif  obj.planted_species_1=="Celtics mildbraedii" and obj.species_1_count :
                species_assessment["Celtics_mildbraedii"]+=obj.species_1_count
            elif  obj.planted_species_1=="Unknown" and obj.species_1_count :
                species_assessment["Unknown"]+=obj.species_1_count

        if obj.planted_species_2  and obj.species_2_count:
            if  obj.planted_species_2=="Terminalia ivorensis" and obj.species_2_count :
                species_assessment["Terminalia_ivorensis"]+=obj.species_2_count
            elif  obj.planted_species_2 =="Terminalia superba" and obj.species_2_count :
                species_assessment["Terminalia_superba"]+=obj.species_2_count
            elif  obj.planted_species_2 =="Tetrapleura tetraptera" and obj.species_2_count :
                species_assessment["Tetrapleura_tetraptera"]+=obj.species_2_count
            elif  obj.planted_species_2 =="Milicia excelsa" and obj.species_2_count :
                species_assessment["Milicia_excelsa"]+=obj.species_2_count
            elif  obj.planted_species_2 =="Nesogordonia papaverifera" and obj.species_2_count :
                species_assessment["Nesogordonia_papaverifera"]+=obj.species_2_count
            elif  obj.planted_species_2 =="Pycnanthus angolensis" and obj.species_2_count :
                species_assessment["Pycnanthus_angolensis"]+=obj.species_2_count
            elif  obj.planted_species_2 =="Albizia adianthifolia" and obj.species_2_count :
                species_assessment["Albizia_adianthifolia"]+=obj.species_2_count
            elif  obj.planted_species_2 =="Entandrophragma angolense" and obj.species_2_count :
                species_assessment["Entandrophragma_angolense"]+=obj.species_2_count
            elif  obj.planted_species_2 =="Cola lateritia" and obj.species_2_count :
                species_assessment["Cola_lateritia"]+=obj.species_2_count
            elif  obj.planted_species_2 =="Ficus exasperata" and obj.species_2_count :
                species_assessment["Ficus_exasperata"]+=obj.species_2_count
            elif  obj.planted_species_2 =="Bombax buonopozense" and obj.species_2_count :
                species_assessment["Bombax_buonopozense"]+=obj.species_2_count
            elif  obj.planted_species_2 =="Ceiba pentandra" and obj.species_2_count :
                species_assessment["Ceiba_pentandra"]+=obj.species_2_count
            elif  obj.planted_species_2 =="Khaya anthotheca" and obj.species_2_count :
                species_assessment["Khaya_anthotheca"]+=obj.species_2_count
            elif  obj.planted_species_2 =="Cola gigantea" and obj.species_2_count :
                species_assessment["Cola_gigantea"]+=obj.species_2_count
            elif  obj.planted_species_2 =="Mansonia altissima" and obj.species_2_count :
                species_assessment["Mansonia_altissima"]+=obj.species_2_count
            elif  obj.planted_species_2 =="Pericopsis elata" and obj.species_2_count :
                species_assessment["Pericopsis_elata"]+=obj.species_2_count
            elif  obj.planted_species_2 =="Celtics mildbraedii" and obj.species_2_count :
                species_assessment["Celtics_mildbraedii"]+=obj.species_2_count
            elif  obj.planted_species_2 =="Unknown" and obj.species_2_count :
                species_assessment["Unknown"]+=obj.species_2_count

        if obj.planted_species_3  and obj.planted_species_3:
            if  obj.planted_species_3 =="Terminalia ivorensis" and obj.species_3_count :
                species_assessment["Terminalia_ivorensis"]+=obj.species_3_count
            elif  obj.planted_species_3 =="Terminalia superba" and obj.species_3_count :
                species_assessment["Terminalia_superba"]+=obj.species_3_count
            elif  obj.planted_species_3 =="Tetrapleura tetraptera" and obj.species_3_count :
                species_assessment["Tetrapleura_tetraptera"]+=obj.species_3_count
            elif  obj.planted_species_3 =="Milicia excelsa" and obj.species_3_count :
                species_assessment["Milicia_excelsa"]+=obj.species_3_count
            elif  obj.planted_species_3 =="Nesogordonia papaverifera" and obj.species_3_count :
                species_assessment["Nesogordonia_papaverifera"]+=obj.species_3_count
            elif  obj.planted_species_3 =="Pycnanthus angolensis" and obj.species_3_count :
                species_assessment["Pycnanthus_angolensis"]+=obj.species_3_count
            elif  obj.planted_species_3 =="Albizia_adianthifolia" and obj.species_3_count :
                species_assessment["Albizia_adianthifolia"]+=obj.species_3_count
            elif  obj.planted_species_3 =="Entandrophragma angolense" and obj.species_3_count :
                species_assessment["Entandrophragma_angolense"]+=obj.species_3_count
            elif  obj.planted_species_3 =="Cola lateritia" and obj.species_3_count :
                species_assessment["Cola_lateritia"]+=obj.species_3_count
            elif  obj.planted_species_3 =="Ficus exasperata" and obj.species_3_count :
                species_assessment["Ficus_exasperata"]+=obj.species_3_count
            elif  obj.planted_species_3 =="Bombax buonopozense" and obj.species_3_count :
                species_assessment["Bombax_buonopozense"]+=obj.species_3_count
            elif  obj.planted_species_3 =="Ceiba pentandra" and obj.species_3_count :
                species_assessment["Ceiba_pentandra"]+=obj.species_3_count
            elif  obj.planted_species_3 =="Khaya anthotheca" and obj.species_3_count :
                species_assessment["Khaya_anthotheca"]+=obj.species_3_count
            elif  obj.planted_species_3 =="Cola gigantea" and obj.species_3_count :
                species_assessment["Cola_gigantea"]+=obj.species_3_count
            elif  obj.planted_species_3 =="Mansonia altissima" and obj.species_3_count :
                species_assessment["Mansonia_altissima"]+=obj.species_3_count
            elif  obj.planted_species_3 =="Pericopsis elata" and obj.species_3_count :
                species_assessment["Pericopsis_elata"]+=obj.species_3_count
            elif  obj.planted_species_3 =="Celtics mildbraedii" and obj.species_3_count :
                species_assessment["Celtics_mildbraedii"]+=obj.species_3_count
            elif  obj.planted_species_3 =="Unknown" and obj.species_3_count :
                species_assessment["Unknown"]+=obj.species_3_count

        if obj.planted_species_4 and obj.species_4_count:
            if  obj.planted_species_4=="Terminalia ivorensis" and obj.species_4_count :
                species_assessment["Terminalia_ivorensis"]+=obj.species_4_count
            elif  obj.planted_species_4=="Terminalia superba" and obj.species_4_count :
                species_assessment["Terminalia_superba"]+=obj.species_4_count
            elif  obj.planted_species_4=="Tetrapleura tetraptera" and obj.species_4_count :
                species_assessment["Tetrapleura_tetraptera"]+=obj.species_4_count
            elif  obj.planted_species_4=="Milicia excelsa" and obj.species_4_count :
                species_assessment["Milicia_excelsa"]+=obj.species_4_count
            elif  obj.planted_species_4=="Nesogordonia papaverifera" and obj.species_4_count :
                species_assessment["Nesogordonia_papaverifera"]+=obj.species_4_count
            elif  obj.planted_species_4=="Pycnanthus_angolensis" and obj.species_4_count :
                species_assessment["Pycnanthus_angolensis"]+=obj.species_4_count
            elif  obj.planted_species_4=="Albizia adianthifolia" and obj.species_4_count :
                species_assessment["Albizia_adianthifolia"]+=obj.species_4_count
            elif  obj.planted_species_4=="Entandrophragma angolense" and obj.species_4_count :
                species_assessment["Entandrophragma_angolense"]+=obj.species_4_count
            elif  obj.planted_species_4=="Cola lateritia" and obj.species_4_count :
                species_assessment["Cola_lateritia"]+=obj.species_4_count
            elif  obj.planted_species_4=="Ficus exasperata" and obj.species_4_count :
                species_assessment["Ficus_exasperata"]+=obj.species_4_count
            elif  obj.planted_species_4=="Bombax buonopozense" and obj.species_4_count :
                species_assessment["Bombax_buonopozense"]+=obj.species_4_count
            elif  obj.planted_species_4=="Ceiba pentandra" and obj.species_4_count :
                species_assessment["Ceiba_pentandra"]+=obj.species_4_count
            elif  obj.planted_species_4=="Khaya anthotheca" and obj.species_4_count:
                species_assessment["Khaya_anthotheca"]+=obj.species_4_count
            elif  obj.planted_species_4=="Cola gigantea" and obj.species_4_count :
                species_assessment["Cola_gigantea"]+=obj.species_4_count
            elif  obj.planted_species_4=="Mansonia altissima" and obj.species_4_count :
                species_assessment["Mansonia_altissima"]+=obj.species_4_count
            elif  obj.planted_species_4=="Pericopsis elata" and obj.species_4_count :
                species_assessment["Pericopsis_elata"]+=obj.species_4_count
            elif  obj.planted_species_4=="Celtics mildbraedii" and obj.species_4_count:
                species_assessment["Celtics_mildbraedii"]+=obj.species_4_count
            elif  obj.planted_species_4=="Unknown" and obj.species_4_count :
                species_assessment["Unknown"]+=obj.species_4_count

        if obj.planted_species_5 and obj.species_5_count :
            if  obj.planted_species_5=="Terminalia ivorensis" and obj.species_5_count  :
                species_assessment["Terminalia_ivorensis"]+=obj.species_5_count 
            elif  obj.planted_species_5=="Terminalia superba" and obj.species_5_count  :
                species_assessment["Terminalia_superba"]+=obj.species_5_count 
            elif  obj.planted_species_5=="Tetrapleura tetraptera" and obj.species_5_count :
                species_assessment["Tetrapleura_tetraptera"]+=obj.species_5_count 
            elif  obj.planted_species_5=="Milicia excelsa" and obj.species_5_count :
                species_assessment["Milicia_excelsa"]+=obj.species_5_count 
            elif  obj.planted_species_5=="Nesogordonia papaverifera" and obj.species_5_count  :
                species_assessment["Nesogordonia_papaverifera"]+=obj.species_5_count 
            elif  obj.planted_species_5=="Pycnanthus angolensis" and obj.species_5_count :
                species_assessment["Pycnanthus_angolensis"]+=obj.species_5_count 
            elif  obj.planted_species_5=="Albizia adianthifolia" and obj.species_5_count  :
                species_assessment["Albizia_adianthifolia"]+=obj.species_5_count 
            elif  obj.planted_species_5=="Entandrophragma angolense" and obj.species_5_count  :
                species_assessment["Entandrophragma_angolense"]+=obj.species_5_count 
            elif  obj.planted_species_5=="Cola lateritia" and obj.species_5_count :
                species_assessment["Cola_lateritia"]+=obj.species_5_count 
            elif  obj.planted_species_5=="Ficus exasperata" and obj.species_5_count  :
                species_assessment["Ficus_exasperata"]+=obj.species_5_count 
            elif  obj.planted_species_5=="Bombax buonopozense" and obj.species_5_count :
                species_assessment["Bombax_buonopozense"]+=obj.species_5_count 
            elif  obj.planted_species_5=="Ceiba pentandra" and obj.species_5_count :
                species_assessment["Ceiba_pentandra"]+=obj.species_5_count 
            elif  obj.planted_species_1=="Khaya anthotheca" and obj.species_5_count :
                species_assessment["Khaya_anthotheca"]+=obj.species_5_count 
            elif  obj.planted_species_5=="Cola gigantea" and obj.species_5_count :
                species_assessment["Cola_gigantea"]+=obj.species_5_count 
            elif  obj.planted_species_5=="Mansonia altissima" and obj.species_5_count :
                species_assessment["Mansonia_altissima"]+=obj.species_5_count 
            elif  obj.planted_species_5=="Pericopsis elata" and obj.species_5_count  :
                species_assessment["Pericopsis_elata"]+=obj.species_5_count 
            elif  obj.planted_species_5=="Celtics mildbraedii" and obj.species_5_count  :
                species_assessment["Celtics_mildbraedii"]+=obj.species_5_count 
            elif  obj.planted_species_5=="Unknown" and obj.species_5_count :
                species_assessment["Unknown"]+=obj.species_5_count 

        if obj.planted_species_6 and obj.species_6_count:
            if  obj.planted_species_6=="Terminalia ivorensis" and obj.species_6_count :
                species_assessment["Terminalia_ivorensis"]+=obj.species_6_count
            elif  obj.planted_species_6=="Terminalia superba" and obj.species_6_count :
                species_assessment["Terminalia_superba"]+=obj.species_6_count
            elif  obj.planted_species_6=="Tetrapleura tetraptera" and obj.species_6_count:
                species_assessment["Tetrapleura_tetraptera"]+=obj.species_6_count
            elif  obj.planted_species_6=="Milicia excelsa" and obj.species_6_count :
                species_assessment["Milicia_excelsa"]+=obj.species_6_count
            elif  obj.planted_species_6=="Nesogordonia papaverifera" and obj.species_6_count :
                species_assessment["Nesogordonia_papaverifera"]+=obj.species_6_count
            elif  obj.planted_species_6=="Pycnanthus angolensis" and obj.species_6_count :
                species_assessment["Pycnanthus_angolensis"]+=obj.species_6_count
            elif  obj.planted_species_6=="Albizia adianthifolia" and obj.species_6_count :
                species_assessment["Albizia_adianthifolia"]+=obj.species_6_count
            elif  obj.planted_species_6=="Entandrophragma angolense" and obj.species_6_count :
                species_assessment["Entandrophragma_angolense"]+=obj.species_6_count
            elif  obj.planted_species_6=="Cola lateritia" and obj.species_6_count:
                species_assessment["Cola_lateritia"]+=obj.species_6_count
            elif  obj.planted_species_6=="Ficus exasperata" and obj.species_6_count:
                species_assessment["Ficus_exasperata"]+=obj.species_6_count
            elif  obj.planted_species_6=="Bombax buonopozense" and obj.species_6_count :
                species_assessment["Bombax_buonopozense"]+=obj.species_6_count
            elif  obj.planted_species_6=="Ceiba pentandra" and obj.species_6_count:
                species_assessment["Ceiba_pentandra"]+=obj.species_6_count
            elif  obj.planted_species_6=="Khaya anthotheca" and obj.species_6_count :
                species_assessment["Khaya_anthotheca"]+=obj.species_6_count
            elif  obj.planted_species_6=="Cola gigantea" and obj.species_6_count:
                species_assessment["Cola_gigantea"]+=obj.species_6_count
            elif  obj.planted_species_6=="Mansonia altissima" and obj.species_6_count :
                species_assessment["Mansonia_altissima"]+=obj.species_6_count
            elif  obj.planted_species_6=="Pericopsis elata" and obj.species_6_count:
                species_assessment["Pericopsis_elata"]+=obj.species_6_count
            elif  obj.planted_species_6=="Celtics mildbraedii" and obj.species_6_count :
                species_assessment["Celtics_mildbraedii"]+=obj.species_6_count
            elif  obj.planted_species_6=="Unknown" and obj.species_6_count :
                species_assessment["Unknown"]+=obj.species_6_count

        if obj.planted_species_7 and obj.species_7_count:
            if  obj.planted_species_7 =="Terminalia ivorensis" and obj.species_7_count :
                species_assessment["Terminalia_ivorensis"]+=obj.species_7_count
            elif  obj.planted_species_7 =="Terminalia superba" and obj.species_7_count :
                species_assessment["Terminalia_superba"]+=obj.sspecies_7_count
            elif  obj.planted_species_7 =="Tetrapleura tetraptera" and obj.species_7_count:
                species_assessment["Tetrapleura_tetraptera"]+=obj.species_7_count
            elif  obj.planted_species_7 =="Milicia excelsa" and obj.species_7_count :
                species_assessment["Milicia_excelsa"]+=obj.species_7_count
            elif  obj.planted_species_7 =="Nesogordonia papaverifera" and obj.species_7_count :
                species_assessment["Nesogordonia_papaverifera"]+=obj.species_7_count
            elif  obj.planted_species_7 =="Pycnanthus angolensis" and obj.species_7_count:
                species_assessment["Pycnanthus_angolensis"]+=obj.species_7_count
            elif  obj.planted_species_7 =="Albizia adianthifolia" and obj.species_7_count :
                species_assessment["Albizia_adianthifolia"]+=obj.species_7_count
            elif  obj.planted_species_7 =="Entandrophragma angolense" and obj.species_7_count :
                species_assessment["Entandrophragma_angolense"]+=obj.species_7_count
            elif  obj.planted_species_7 =="Cola lateritia" and obj.species_7_count:
                species_assessment["Cola_lateritia"]+=obj.species_7_count
            elif  obj.planted_species_7 =="Ficus exasperata" and obj.species_7_count:
                species_assessment["Ficus_exasperata"]+=obj.species_7_count
            elif  obj.planted_species_7 =="Bombax buonopozense" and obj.species_7_count :
                species_assessment["Bombax_buonopozense"]+=obj.species_7_count
            elif  obj.planted_species_7 =="Ceiba pentandra" and obj.species_7_count:
                species_assessment["Ceiba_pentandra"]+=obj.species_7_count
            elif  obj.planted_species_7 =="Khaya anthotheca" and obj.species_7_count:
                species_assessment["Khaya_anthotheca"]+=obj.species_7_count
            elif  obj.planted_species_7 =="Cola gigantea" and obj.species_7_count:
                species_assessment["Cola_gigantea"]+=obj.species_7_count
            elif  obj.planted_species_7 =="Mansonia altissima" and obj.species_7_count :
                species_assessment["Mansonia_altissima"]+=obj.species_7_count
            elif  obj.planted_species_7 =="Pericopsis elata" and obj.species_7_count :
                species_assessment["Pericopsis_elata"]+=obj.species_7_count
            elif  obj.planted_species_7 =="Celtics mildbraedii" and obj.species_7_count :
                species_assessment["Celtics_mildbraedii"]+=obj.species_7_count
            elif  obj.planted_species_7 =="Unknown" and obj.species_7_count :
                species_assessment["Unknown"]+=obj.species_7_count

        if obj.planted_species_8 and obj.species_8_count:
            if  obj.planted_species_8=="Terminalia ivorensis" and obj.species_8_count :
                species_assessment["Terminalia_ivorensis"]+=obj.species_8_count
            elif  obj.planted_species_8=="Terminalia superba" and obj.species_8_count :
                species_assessment["Terminalia_superba"]+=obj.species_8_count
            elif  obj.planted_species_8=="Tetrapleura tetraptera" and obj.species_8_count :
                species_assessment["Tetrapleura_tetraptera"]+=obj.species_8_count
            elif  obj.planted_species_8=="Milicia excelsa" and obj.species_8_count :
                species_assessment["Milicia_excelsa"]+=obj.species_8_count
            elif  obj.planted_species_8=="Nesogordonia papaverifera" and obj.species_8_count :
                species_assessment["Nesogordonia_papaverifera"]+=obj.species_8_count
            elif  obj.planted_species_8=="Pycnanthus angolensis" and obj.species_8_count :
                species_assessment["Pycnanthus_angolensis"]+=obj.species_8_count
            elif  obj.planted_species_8=="Albizia adianthifolia" and obj.species_8_count:
                species_assessment["Albizia_adianthifolia"]+=obj.species_8_count
            elif  obj.planted_species_8=="Entandrophragma angolense" and obj.species_8_count :
                species_assessment["Entandrophragma_angolense"]+=obj.species_8_count
            elif  obj.planted_species_8=="Cola lateritia" and obj.species_8_count :
                species_assessment["Cola_lateritia"]+=obj.species_8_count
            elif  obj.planted_species_8=="Ficus exasperata" and obj.species_8_count :
                species_assessment["Ficus_exasperata"]+=obj.species_8_count
            elif  obj.planted_species_8=="Bombax buonopozense" and obj.species_8_count :
                species_assessment["Bombax_buonopozense"]+=obj.species_8_count
            elif  obj.planted_species_8=="Ceiba pentandra" and obj.species_8_count :
                species_assessment["Ceiba_pentandra"]+=obj.species_8_count
            elif  obj.planted_species_8=="Khaya anthotheca" and obj.species_8_count :
                species_assessment["Khaya_anthotheca"]+=obj.species_8_count
            elif  obj.planted_species_8=="Cola gigantea" and obj.species_8_count :
                species_assessment["Cola_gigantea"]+=obj.species_8_count
            elif  obj.planted_species_8=="Mansonia altissima" and obj.species_8_count :
                species_assessment["Mansonia_altissima"]+=obj.species_8_count
            elif  obj.planted_species_8=="Pericopsis elata" and obj.species_8_count :
                species_assessment["Pericopsis_elata"]+=obj.species_8_count
            elif  obj.planted_species_8=="Celtics mildbraedii" and obj.species_8_count :
                species_assessment["Celtics_mildbraedii"]+=obj.species_8_count
            elif  obj.planted_species_8=="Unknown" and obj.species_8_count :
                species_assessment["Unknown"]+=obj.species_8_count

        if obj.planted_species_9 and obj.species_9_count:
            if  obj.planted_species_9=="Terminalia ivorensis" and obj.species_9_count :
                species_assessment["Terminalia_ivorensis"]+=obj.species_9_count
            elif  obj.planted_species_9=="Terminalia superba" and obj.species_9_count :
                species_assessment["Terminalia_superba"]+=obj.species_9_count
            elif  obj.planted_species_9=="Tetrapleura tetraptera" and obj.species_9_count :
                species_assessment["Tetrapleura_tetraptera"]+=obj.species_9_count
            elif  obj.planted_species_9=="Milicia excelsa" and obj.species_9_count:
                species_assessment["Milicia_excelsa"]+=obj.species_9_count
            elif  obj.planted_species_9=="Nesogordonia papaverifera" and obj.species_9_count :
                species_assessment["Nesogordonia_papaverifera"]+=obj.species_9_count
            elif  obj.planted_species_9=="Pycnanthus angolensis" and obj.species_9_count :
                species_assessment["Pycnanthus_angolensis"]+=obj.species_9_count
            elif  obj.planted_species_9=="Albizia adianthifolia" and obj.species_9_count :
                species_assessment["Albizia_adianthifolia"]+=obj.species_9_count
            elif  obj.planted_species_9=="Entandrophragma angolense" and obj.species_9_count :
                species_assessment["Entandrophragma_angolense"]+=obj.species_9_count
            elif  obj.planted_species_9=="Cola lateritia" and obj.species_9_count:
                species_assessment["Cola_lateritia"]+=obj.species_9_count
            elif  obj.planted_species_9=="Ficus exasperata" and obj.species_9_count :
                species_assessment["Ficus_exasperata"]+=obj.species_9_count
            elif  obj.planted_species_9=="Bombax buonopozense" and obj.species_9_count :
                species_assessment["Bombax_buonopozense"]+=obj.species_9_count
            elif  obj.planted_species_9=="Ceiba pentandra" and obj.species_9_count:
                species_assessment["Ceiba_pentandra"]+=obj.species_9_count
            elif  obj.planted_species_9=="Khaya anthotheca" and obj.species_9_count:
                species_assessment["Khaya_anthotheca"]+=obj.species_9_count
            elif  obj.planted_species_9=="Cola gigantea" and obj.species_9_count :
                species_assessment["Cola_gigantea"]+=obj.species_9_count
            elif  obj.planted_species_9=="Mansonia altissima" and obj.species_9_count:
                species_assessment["Mansonia_altissima"]+=obj.species_9_count
            elif  obj.planted_species_9=="Pericopsis elata" and obj.species_9_count:
                species_assessment["Pericopsis_elata"]+=obj.species_9_count
            elif  obj.planted_species_9=="Celtics mildbraedii" and obj.species_9_count:
                species_assessment["Celtics_mildbraedii"]+=obj.species_9_count
            elif  obj.planted_species_9=="Unknown" and obj.species_9_count:
                species_assessment["Unknown"]+=obj.species_9_count

        if obj.planted_species_10  and obj.species_count_10:
            if  obj.planted_species_10 =="Terminalia ivorensis" and obj.species_count_10 :
                species_assessment["Terminalia_ivorensis"]+=obj.species_count_10
            elif  obj.planted_species_10 =="Terminalia superba" and obj.species_count_10 :
                species_assessment["Terminalia_superba"]+=obj.species_count_10
            elif  obj.planted_species_10 =="Tetrapleura tetraptera" and obj.species_count_10 :
                species_assessment["Tetrapleura_tetraptera"]+=obj.species_count_10
            elif  obj.planted_species_10 =="Milicia excelsa" and obj.species_count_10:
                species_assessment["Milicia_excelsa"]+=obj.species_count_10
            elif  obj.planted_species_10 =="Nesogordonia papaverifera" and obj.species_count_10 :
                species_assessment["Nesogordonia_papaverifera"]+=obj.species_count_10
            elif  obj.planted_species_10 =="Pycnanthus angolensis" and obj.species_count_10 :
                species_assessment["Pycnanthus_angolensis"]+=obj.species_count_10
            elif  obj.planted_species_10 =="Albizia adianthifolia" and obj.species_count_10 :
                species_assessment["Albizia_adianthifolia"]+=obj.species_count_10
            elif  obj.planted_species_10 =="Entandrophragma angolense" and obj.species_count_10 :
                species_assessment["Entandrophragma_angolense"]+=obj.species_count_10
            elif  obj.planted_species_10 =="Cola lateritia" and obj.species_count_10:
                species_assessment["Cola_lateritia"]+=obj.species_count_10
            elif  obj.planted_species_10 =="Ficus exasperata" and obj.species_count_10 :
                species_assessment["Ficus_exasperata"]+=obj.species_count_10
            elif  obj.planted_species_10=="Bombax buonopozense" and obj.species_count_10 :
                species_assessment["Bombax_buonopozense"]+=obj.species_count_10
            elif  obj.planted_species_10=="Ceiba pentandra" and obj.species_count_10:
                species_assessment["Ceiba_pentandra"]+=obj.species_count_10
            elif  obj.planted_species_10=="Khaya anthotheca" and obj.species_count_10:
                species_assessment["Khaya_anthotheca"]+=obj.species_count_10
            elif  obj.planted_species_10=="Cola gigantea" and obj.species_count_10 :
                species_assessment["Cola_gigantea"]+=obj.species_count_10
            elif  obj.planted_species_10=="Mansonia altissima" and obj.species_count_10:
                species_assessment["Mansonia_altissima"]+=obj.species_count_10
            elif  obj.planted_species_10=="Pericopsis elata" and obj.species_count_10:
                species_assessment["Pericopsis_elata"]+=obj.species_count_10
            elif  obj.planted_species_10=="Celtics mildbraedii" and obj.species_count_10:
                species_assessment["Celtics_mildbraedii"]+=obj.species_count_10
            elif  obj.planted_species_10=="Unknown" and obj.species_count_10:
                species_assessment["Unknown"]+=obj.species_count_10
    return {
        "overral_maintenance_assessment":overral_maintenance_assessment,
        "activity_assessment":activity_assessment,
        "land_cover_assessment":land_cover_assessment,
        "supervisors_assessments":qc_reporter_assessments,
        "species_assessment":species_assessment,
        "qc_reporter_assessments":qc_reporter_assessments
        }



class RetrieveAllCompartments(View):
    async def get(self, request, *args, **kwargs):
        print("Entering get method")
        try:
            # Wrap synchronous database query in sync_to_async
            compartments = await sync_to_async(list)(RbghCompartmentTracker.objects.all())
            
            # mainqc = await sync_to_async(list)(MaintenanceQc.objects.all())
            # print("maintenance qc",mainqc)
            
            # Wrap serialization in sync_to_async
            geojson_data = await sync_to_async(self.serialize_to_geojson)(compartments)
            
            
            # # Parse and properly structure the GeoJSON
            parsed_data = json.loads(geojson_data)
           
            
            # # Check if we need to extract features from a nested structure
            if isinstance(parsed_data, dict) and 'features' in parsed_data:
                features = parsed_data['features']
            else:
                features = parsed_data
            
            # Return properly structured GeoJSON response
            return JsonResponse({
                'type': 'FeatureCollection',
                'features': features
            })
        except Exception as e:
            print(f"Error in get: {str(e)}")
            return JsonResponse({'error': str(e)}, status=500)

    def serialize_to_geojson(self, compartments):
        # Synchronous serialization function
        serializer = GeoJSONSerializer()
        return serializer.serialize(
            compartments,
            geometry_field='geom'
            # No 'fields' parameter to include all model fields
        )
    

@method_decorator(csrf_exempt, name='dispatch')
class RetrieveQCPointWithinCompartment(View):
    async def post(self, request, *args, **kwargs):
        try:
            # Parse the incoming JSON data asynchronously
            data = await sync_to_async(json.loads)(request.body)
          
            # Extract the geometry data
            geometry = data.get('compartment').get('geometry')
            compartment_id = data.get('compartment').get('id')
            comptname = data.get('compartment').get('comptname')
            start_date=data.get('startDate')
            end_date=data.get('endDate')
          
            
            
            logger.info(f"Processing compartment: {comptname} (ID: {compartment_id}) (geometry: {geometry})")
         
            # Convert GeoJSON geometry to a Django GEOSGeometry object
            if geometry:
                geom = await sync_to_async(GEOSGeometry)(json.dumps(geometry))
                
          
                # Find points within this geometry synchronously, wrapped in sync_to_async
                if start_date and end_date:

                    try:
               
                    # Parse YYYY-MM-DD strings into date objects
                        start_date = datetime.strptime(start_date, '%Y-%m-%d').date()
                        end_date = datetime.strptime(end_date, '%Y-%m-%d').date()
                        logger.info(f"Parsed dates: {start_date} to {end_date}")
                
                    except ValueError as e:
                        logger.error(f"Invalid date format: {str(e)}")
                        return JsonResponse({
                            'success': False,
                            'message': 'Invalid date format. Use YYYY-MM-DD (e.g., 2025-05-21)'
                        }, status=400)
                    
                    print("used date")
                    points_within = await sync_to_async(
                        lambda: list(MaintenanceQc.objects.filter(
                            geometry__within=geom,
                            date_of_qc__range=(start_date, end_date)
                        ))
                    )()
                    print(points_within)
                else:
                    print("No date")
                    points_within = await sync_to_async(
                        lambda: list(MaintenanceQc.objects.filter(geometry__within=geom))
                    )() 
                    
                
               
                analytics = await maintenance_compute_qc_analytics(points_within)
               
                
                # Serialize the points to GeoJSON
                points_geojson = await sync_to_async(self.serialize_points_to_geojson)(points_within)
                
                # Parse the GeoJSON for proper structure
                parsed_points = json.loads(points_geojson)
                
                # Extract features if needed
                if isinstance(parsed_points, dict) and 'features' in parsed_points:
                    point_features = parsed_points['features']
                else:
                    point_features = parsed_points

               
                # print("parsed points",parsed_points)
                # print("geosjson points",points_geojson)
                # print("points within",points_within)
                # Return the results including the serialized points
                return JsonResponse({
                    'success': True,
                    'message': f'Successfully processed compartment {comptname}',
                    'compartment_id': compartment_id,
                    "analytics_data": analytics,
                    'points_within': {
                        'type': 'FeatureCollection',
                        'features': point_features
                    },
                    'center': {
                        'lat': geom.centroid.y,
                        'lng': geom.centroid.x
                    }
                })
            else:
                return JsonResponse({
                    'success': False,
                    'message': 'No geometry data provided'
                }, status=404)
            
        except Exception as e:
            logger.error(f"Error processing compartment: {str(e)}")
            return JsonResponse({
                'success': False,
                'message': str(e)
            }, status=500)
    
    def serialize_points_to_geojson(self, points):
        # Synchronous serialization function for MaintenanceQc points
        serializer = GeoJSONSerializer()
        return serializer.serialize(
            points,
            geometry_field='geometry'
            # No 'fields' parameter to include all model fields
        )
    
    







    
            
            



                    


    # async def land_preparation_compute_qc_analytics(self,query_obj):

    #     # passed_maintrnance_qc = 0
    #     # failed_maintenance_qc = 0
    #     compartment_demarcation = 0
    #     compartment_sub_demarcation=0
    #     manual_site_clearing=0
    #     establishment_slashing=0
    #     liana_cutting_and_for_enrichment_planting=0
    #     manual_preplanting_spray=0
    #     establishment_ring_weeding=0
    #     marking_and_pitting=0
    #     pitting_and_blanking=0
    #     felling_and_looping_of_invasive_manual=0
    #     felling_and_looping_of_invasive_mechanical=0
    #     stump_treatnent_chemical_spray=0
        
        
    #     for obj in query_obj:
    #         #total count of qc passed and total qc failed
    #         # if obj.maintenance_qc_result_pass_or_fail:
    #         #     if obj.maintenance_qc_result_pass_or_fail=="Passed":
    #         #         passed_maintrnance_qc+=1
    #         #     elif obj.maintenance_qc_result_pass_or_fail=="Failed":
    #         #         failed_maintenance_qc+=1
    #         #total count of each qc activities
    #         if obj.activity:
    #             if obj.activity=="LP001 - Compartment Demarcation and Mapping":
    #                 compartment_demarcation+=1
    #             elif obj.activity=="LP002 - Subcompartment Demarcation":
    #                 compartment_sub_demarcation+=1
    #             elif obj.activity=="LP003 - Manual Site Clearing / Bush Clearing":
    #                manual_site_clearing +=1
    #             elif obj.activity=="LP004 - Establishment Slashing":
    #                 establishment_slashing+=1
    #             elif obj.activity=="LP005 - Liana Cutting & Line Clearing for Enrichment Planting (10 x10)":
    #                 liana_cutting_and_for_enrichment_planting+=1
    #             elif obj.activity=="LP006 - Manual Pre-Plant Spray":
    #                 manual_preplanting_spray+=1
    #             elif obj.activity=="LP007 - Establishment Ring Weeding":
    #                 establishment_ring_weeding+=1
    #             elif obj.activity=="LP013 - Marking and Pitting":
    #                 marking_and_pitting+=1
    #             elif obj.activity=="LP013 - Pitting for Blanking 4 x 4":
    #                 pitting_and_blanking+=1
    #             elif obj.activity=="LP016 - Felling and Lopping of Invasive Species - Manual":
    #                 felling_and_looping_of_invasive_manual+=1
    #             elif obj.activity=="LP017 - Felling and Lopping of Invasive Species - Mechanical":
    #                 felling_and_looping_of_invasive_mechanical+=1
    #             elif obj.activity=="LP018 - Stump Treatment/Chemical Application":
    #                 stump_treatnent_chemical_spray+=1

                
        
        



    





            


            
