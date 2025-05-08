# This is an auto-generated Django model module.
# You'll have to do the following manually to clean this up:
#   * Rearrange models' order
#   * Make sure each model has one field with primary_key=True
#   * Make sure each ForeignKey and OneToOneField has `on_delete` set to the desired behavior
#   * Remove `managed = False` lines if you wish to allow Django to create, modify, and delete the table
# Feel free to rename the models, but don't rename db_table values or field names.
from django.contrib.gis.db import models



class MaintenanceQc(models.Model):
    id = models.BigIntegerField(db_column='_id', primary_key=True)
    start = models.DateTimeField(blank=True, null=True)
    end = models.DateTimeField(blank=True, null=True)
    what_type_of_qc_are_you_performing = models.TextField(blank=True, null=True)
    qc_attempt = models.FloatField(blank=True, null=True)
    date_of_qc = models.DateField(blank=True, null=True)
    works_order_number = models.FloatField(blank=True, null=True)
    calculation = models.TextField(blank=True, null=True)
    forester = models.TextField(blank=True, null=True)
    supervisor = models.TextField(blank=True, null=True)
    team_name = models.TextField(blank=True, null=True)
    team_leader = models.TextField(blank=True, null=True)
    team_type = models.TextField(blank=True, null=True)
    forest_reserve = models.TextField(blank=True, null=True)
    compartment_id = models.TextField(blank=True, null=True)
    activity = models.TextField(blank=True, null=True)
    start_date_of_activity = models.DateField(blank=True, null=True)
    end_date_of_activity = models.DateField(blank=True, null=True)
    work_quantity_ha = models.FloatField(blank=True, null=True)
    land_cover = models.TextField(blank=True, null=True)
    spacing_sph_width = models.FloatField(db_column='spacing_sph__width', blank=True, null=True)  # Field renamed because it contained more than one '_' in a row.
    spacing_sph_length = models.FloatField(db_column='spacing_sph__length', blank=True, null=True)  # Field renamed because it contained more than one '_' in a row.
    qc_reporter = models.TextField(blank=True, null=True)
    qc_plot_id = models.TextField(blank=True, null=True)
    calculation_001 = models.TextField(blank=True, null=True)
    coordinate = models.TextField(blank=True, null=True)
    field_coordinate_latitude = models.FloatField(db_column='_coordinate_latitude', blank=True, null=True)  # Field renamed because it started with '_'.
    field_coordinate_longitude = models.FloatField(db_column='_coordinate_longitude', blank=True, null=True)  # Field renamed because it started with '_'.
    field_coordinate_altitude = models.FloatField(db_column='_coordinate_altitude', blank=True, null=True)  # Field renamed because it started with '_'.
    field_coordinate_precision = models.FloatField(db_column='_coordinate_precision', blank=True, null=True)  # Field renamed because it started with '_'.
    slash_height_of_weeds_15cm = models.TextField(db_column='slash_height_of_weeds__15cm', blank=True, null=True)  # Field renamed because it contained more than one '_' in a row.
    number_of_planted_trees = models.BigIntegerField(blank=True, null=True)
    number_of_alive_planted_trees = models.FloatField(blank=True, null=True)
    number_of_dead_planted_trees = models.FloatField(blank=True, null=True)
    number_of_missing_trees = models.FloatField(blank=True, null=True)
    planted_trees_slashed = models.FloatField(db_column='planted_trees__slashed', blank=True, null=True)  # Field renamed because it contained more than one '_' in a row.
    planted_trees_damaged = models.FloatField(db_column='planted_trees__damaged', blank=True, null=True)  # Field renamed because it contained more than one '_' in a row.
    circles_not_meeting_05m_radius = models.FloatField(blank=True, null=True)
    soil_disturbance_planted_trees = models.FloatField(db_column='soil_disturbance__planted_trees', blank=True, null=True)  # Field renamed because it contained more than one '_' in a row.
    weeds_within_05m_radius_circle = models.FloatField(blank=True, null=True)
    trees_not_planted_with_dbh_5cm = models.FloatField(db_column='trees_not_planted_with_dbh__5cm', blank=True, null=True)  # Field renamed because it contained more than one '_' in a row.
    slashed_trees_not_planted_with_dbh_5cm = models.FloatField(db_column='slashed_trees_not_planted_with_dbh__5cm', blank=True, null=True)  # Field renamed because it contained more than one '_' in a row.
    line_clearing_2m_width_conformance = models.TextField(blank=True, null=True)
    native_trees_dbh_15cm_with_vinesclimbers_fully_cleared = models.FloatField(db_column='native_trees_dbh__15cm_with_vinesclimbers_fully_cleared', blank=True, null=True)  # Field renamed because it contained more than one '_' in a row.
    native_trees_dbh_15cm_with_incomplete_vineclimbers_clearan = models.FloatField(db_column='native_trees_dbh__15cm_with_incomplete_vineclimbers_clearan', blank=True, null=True)  # Field renamed because it contained more than one '_' in a row.
    invasive_species_unslashed_stems_dbh15cm = models.FloatField(db_column='invasive_species__unslashed_stems_dbh15cm', blank=True, null=True)  # Field renamed because it contained more than one '_' in a row.
    spot_spray_completeness = models.TextField(blank=True, null=True)
    number_of_circle_sprayed_trees = models.FloatField(blank=True, null=True)
    number_of_circle_sprayed_trees_with_green_patches_or_weed_growt = models.FloatField(blank=True, null=True)
    number_of_planted_trees_dead_due_to_chemical = models.FloatField(blank=True, null=True)
    number_of_chemical_stressed_trees = models.FloatField(blank=True, null=True)
    number_of_invasive_woody_species = models.FloatField(blank=True, null=True)
    number_of_spot_sprayed_woody_species = models.FloatField(blank=True, null=True)
    damage_to_nontarget_species_number_of_unplanted_trees_dead_du = models.FloatField(blank=True, null=True)
    planted_species_1 = models.TextField(blank=True, null=True)
    species_1_count = models.FloatField(blank=True, null=True)
    planted_species_2 = models.TextField(blank=True, null=True)
    species_2_count = models.FloatField(blank=True, null=True)
    planted_species_3 = models.TextField(blank=True, null=True)
    species_3_count = models.FloatField(blank=True, null=True)
    planted_species_4 = models.TextField(blank=True, null=True)
    species_4_count = models.FloatField(blank=True, null=True)
    planted_species_5 = models.TextField(blank=True, null=True)
    species_5_count = models.FloatField(blank=True, null=True)
    planted_species_6 = models.TextField(blank=True, null=True)
    species_6_count = models.FloatField(blank=True, null=True)
    planted_species_7 = models.TextField(blank=True, null=True)
    species_7_count = models.FloatField(blank=True, null=True)
    planted_species_8 = models.TextField(blank=True, null=True)
    species_8_count = models.FloatField(blank=True, null=True)
    planted_species_9 = models.TextField(blank=True, null=True)
    species_9_count = models.FloatField(blank=True, null=True)
    planted_species_10 = models.TextField(blank=True, null=True)
    species_count_10 = models.FloatField(blank=True, null=True)
    correct_species_mix = models.TextField(blank=True, null=True)
    comments = models.TextField(blank=True, null=True)
    photo_east = models.TextField(blank=True, null=True)
    photo_east_url = models.TextField(blank=True, null=True)
    photo_west = models.TextField(blank=True, null=True)
    photo_west_url = models.TextField(blank=True, null=True)
    photo_south = models.TextField(blank=True, null=True)
    photo_south_url = models.TextField(blank=True, null=True)
    photo_north = models.TextField(blank=True, null=True)
    photo_north_url = models.TextField(blank=True, null=True)
    start_date_of_maintenance = models.DateTimeField(blank=True, null=True)
    date_of_maintenance = models.DateField(blank=True, null=True)
    date_of_planting = models.DateTimeField(blank=True, null=True)
    end_date_of_maintenance = models.DateTimeField(blank=True, null=True)
    area_qced_ha = models.FloatField(blank=True, null=True)
    spacing_sph = models.TextField(blank=True, null=True)
    spacing_sph1 = models.TextField(blank=True, null=True)
    date_planted = models.TextField(blank=True, null=True)
    all_weeds_treated = models.FloatField(blank=True, null=True)
    herbicide_effectivity = models.FloatField(blank=True, null=True)
    number_of_planted_trees_with_fertilizer_applied = models.FloatField(blank=True, null=True)
    number_of_planted_trees_with_fertilizer_applied_15cm_from_tree = models.FloatField(blank=True, null=True)
    number_of_planted_trees_with_fertilizer_scorched_leaves = models.FloatField(blank=True, null=True)
    number_of_planted_trees_with_covered_fertilizers = models.FloatField(blank=True, null=True)
    general_slots_placement = models.TextField(blank=True, null=True)
    # field_id = models.BigIntegerField(db_column='_id', blank=True, null=True)  # Field renamed because it started with '_'.
    field_uuid = models.TextField(db_column='_uuid', blank=True, null=True)  # Field renamed because it started with '_'.
    field_submission_time = models.DateTimeField(db_column='_submission_time', blank=True, null=True)  # Field renamed because it started with '_'.
    field_validation_status = models.TextField(db_column='_validation_status', blank=True, null=True)  # Field renamed because it started with '_'.
    field_notes = models.FloatField(db_column='_notes', blank=True, null=True)  # Field renamed because it started with '_'.
    field_status = models.TextField(db_column='_status', blank=True, null=True)  # Field renamed because it started with '_'.
    field_submitted_by = models.TextField(db_column='_submitted_by', blank=True, null=True)  # Field renamed because it started with '_'.
    field_version = models.TextField(db_column='__version', blank=True, null=True)  # Field renamed because it contained more than one '_' in a row. Field renamed because it started with '_'.
    field_tags = models.FloatField(db_column='_tags', blank=True, null=True)  # Field renamed because it started with '_'.
    field_index = models.BigIntegerField(db_column='_index', blank=True, null=True)  # Field renamed because it started with '_'.
    surviving_trees = models.FloatField(blank=True, null=True)
    vine_clearance_completeness = models.FloatField(blank=True, null=True)
    percentage_spraying_completeness = models.FloatField(blank=True, null=True)
    circle_sprayed_trees_with_green_patches_or_weed_growth_quality = models.FloatField(blank=True, null=True)
    damage_to_non_target_species_quality = models.FloatField(blank=True, null=True)
    chemical_weeding_accuracy = models.FloatField(blank=True, null=True)
    chemical_weeding_accuracy_pass_or_fail = models.TextField(blank=True, null=True)
    slashed_tree_preservation_accuracy_planted_trees = models.FloatField(db_column='slashed_tree_preservation_accuracy__planted_trees', blank=True, null=True)  # Field renamed because it contained more than one '_' in a row.
    slash_height_accuracy = models.FloatField(blank=True, null=True)
    maintenance_slashing_accuracy = models.FloatField(blank=True, null=True)
    maintenance_slashing_accuracy_passfail = models.TextField(blank=True, null=True)
    ring_weeded_tree_preservation_accuracy_planted_trees = models.FloatField(db_column='ring_weeded_tree_preservation_accuracy__planted_trees', blank=True, null=True)  # Field renamed because it contained more than one '_' in a row.
    c_05m_radius_accuracy = models.FloatField(blank=True, null=True)
    soil_disturbance_accuracy = models.FloatField(blank=True, null=True)
    weeds_control_accuracy = models.FloatField(blank=True, null=True)
    ring_weeding_accuracy = models.FloatField(blank=True, null=True)
    ring_weeding_passfail = models.TextField(blank=True, null=True)
    maintenance_qc_result = models.FloatField(blank=True, null=True)
    maintenance_qc_result_pass_or_fail = models.TextField(db_column='maintenance_qc_result__pass_or_fail', blank=True, null=True)  # Field renamed because it contained more than one '_' in a row.
    survival = models.FloatField(blank=True, null=True)
    geometry = models.PointField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'maintenance_qc'

   


class RbghCompartmentTracker(models.Model):
    geom = models.MultiPolygonField(blank=True, null=True)
    fid = models.BigIntegerField(blank=True, null=True)
    objectid = models.IntegerField(blank=True, null=True)
    region = models.CharField(max_length=255, blank=True, null=True)
    forester = models.CharField(max_length=255, blank=True, null=True)
    municipality_district = models.CharField(db_column='municipality/district', max_length=255, blank=True, null=True)  # Field renamed to remove unsuitable characters.
    iso = models.CharField(max_length=255, blank=True, null=True)
    lease_no_field = models.CharField(db_column='lease_no.', max_length=255, blank=True, null=True)  # Field renamed to remove unsuitable characters. Field renamed because it ended with '_'.
    blockid = models.CharField(max_length=255, blank=True, null=True)
    compartment = models.CharField(max_length=255, blank=True, null=True)
    subcompt = models.CharField(max_length=255, blank=True, null=True)
    comptname = models.CharField(max_length=255, blank=True, null=True)
    mgmtstatus = models.CharField(max_length=255, blank=True, null=True)
    comptlocal = models.CharField(max_length=255, blank=True, null=True)
    totalcomptareaha = models.FloatField(blank=True, null=True)
    plantedareaha = models.FloatField(blank=True, null=True)
    updatedby = models.CharField(max_length=255, blank=True, null=True)
    updatedate = models.DateField(blank=True, null=True)
    sph = models.IntegerField(blank=True, null=True)
    sph2 = models.IntegerField(blank=True, null=True)
    treatment_type = models.CharField(max_length=255, blank=True, null=True)
    pre_clearing_status = models.CharField(db_column='pre-clearing_status', max_length=255, blank=True, null=True)  # Field renamed to remove unsuitable characters.
    plant_prep_date = models.DateField(blank=True, null=True)
    plant_start_date = models.DateField(blank=True, null=True)
    planting_completion_date = models.DateField(blank=True, null=True)
    status = models.CharField(max_length=255, blank=True, null=True)
    age = models.FloatField(blank=True, null=True)
    fertilizer_g = models.FloatField(blank=True, null=True)
    man_days = models.FloatField(db_column='man-days', blank=True, null=True)  # Field renamed to remove unsuitable characters.
    equipment = models.CharField(max_length=255, blank=True, null=True)
    equipment_days = models.FloatField(db_column='equipment-days', blank=True, null=True)  # Field renamed to remove unsuitable characters.
    qc_date = models.DateField(blank=True, null=True)
    qc_rep = models.CharField(max_length=255, blank=True, null=True)
    qc_report = models.CharField(max_length=255, blank=True, null=True)
    survival_pre_blanking = models.FloatField(db_column='survival_pre-blanking', blank=True, null=True)  # Field renamed to remove unsuitable characters.
    blankingstems = models.CharField(max_length=255, blank=True, null=True)
    survival_post_blanking = models.FloatField(db_column='survival_post-blanking', blank=True, null=True)  # Field renamed to remove unsuitable characters.
    nextqcdate = models.DateField(blank=True, null=True)
    nextmaintenance = models.DateField(blank=True, null=True)
    regime = models.CharField(max_length=255, blank=True, null=True)
    dom_species = models.CharField(max_length=255, blank=True, null=True)
    soiltype = models.CharField(max_length=255, blank=True, null=True)
    roadarea = models.FloatField(blank=True, null=True)
    arealost = models.FloatField(blank=True, null=True)
    areareclaimed = models.FloatField(blank=True, null=True)
    odkuuid = models.CharField(max_length=300, blank=True, null=True)

    class Meta:
        managed = False
        db_table = ' RBGH_Compartment_Tracker'
    # class Meta:
    #     indexes = [
    #         models.Index(fields=['geom'], name='geom_gist_idx_roads', opclasses=['gist'])
    #     ]

