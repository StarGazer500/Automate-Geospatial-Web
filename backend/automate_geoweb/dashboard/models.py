# This is an auto-generated Django model module.
# You'll have to do the following manually to clean this up:
#   * Rearrange models' order
#   * Make sure each model has one field with primary_key=True
#   * Make sure each ForeignKey and OneToOneField has `on_delete` set to the desired behavior
#   * Remove `managed = False` lines if you wish to allow Django to create, modify, and delete the table
# Feel free to rename the models, but don't rename db_table values or field names.
from django.contrib.gis.db import models




class MaintenanceQc(models.Model):
    start = models.DateTimeField(blank=True, null=True)
    end = models.DateTimeField(blank=True, null=True)
    what_type_of_qc_are_you_performing_field = models.TextField(db_column='What type of QC are you performing?', blank=True, null=True)  # Field name made lowercase. Field renamed to remove unsuitable characters. Field renamed because it ended with '_'.
    qc_attempt = models.FloatField(db_column='QC Attempt', blank=True, null=True)  # Field name made lowercase. Field renamed to remove unsuitable characters.
    date_of_qc = models.DateField(db_column='Date of QC', blank=True, null=True)  # Field name made lowercase. Field renamed to remove unsuitable characters.
    works_order_number = models.FloatField(db_column='Works Order Number', blank=True, null=True)  # Field name made lowercase. Field renamed to remove unsuitable characters.
    calculation = models.TextField(blank=True, null=True)
    forester = models.TextField(db_column='Forester', blank=True, null=True)  # Field name made lowercase.
    supervisor = models.TextField(db_column='Supervisor', blank=True, null=True)  # Field name made lowercase.
    team_name = models.TextField(db_column='Team Name', blank=True, null=True)  # Field name made lowercase. Field renamed to remove unsuitable characters.
    team_leader = models.TextField(db_column='Team Leader', blank=True, null=True)  # Field name made lowercase. Field renamed to remove unsuitable characters.
    team_type = models.TextField(db_column='Team Type', blank=True, null=True)  # Field name made lowercase. Field renamed to remove unsuitable characters.
    forest_reserve = models.TextField(db_column='Forest Reserve', blank=True, null=True)  # Field name made lowercase. Field renamed to remove unsuitable characters.
    compartment_id = models.TextField(db_column='Compartment ID', blank=True, null=True)  # Field name made lowercase. Field renamed to remove unsuitable characters.
    activity = models.TextField(db_column='Activity', blank=True, null=True)  # Field name made lowercase.
    start_date_of_activity = models.DateField(db_column='Start Date of Activity', blank=True, null=True)  # Field name made lowercase. Field renamed to remove unsuitable characters.
    end_date_of_activity = models.DateField(db_column='End Date of Activity', blank=True, null=True)  # Field name made lowercase. Field renamed to remove unsuitable characters.
    work_quantity_ha = models.FloatField(db_column='Work Quantity, Ha', blank=True, null=True)  # Field name made lowercase. Field renamed to remove unsuitable characters.
    land_cover = models.TextField(db_column='Land Cover', blank=True, null=True)  # Field name made lowercase. Field renamed to remove unsuitable characters.
    spacing_sph_width = models.FloatField(db_column='Spacing (SPH) - Width', blank=True, null=True)  # Field name made lowercase. Field renamed to remove unsuitable characters.
    spacing_sph_length = models.FloatField(db_column='Spacing (SPH) - Length', blank=True, null=True)  # Field name made lowercase. Field renamed to remove unsuitable characters.
    qc_reporter = models.TextField(db_column='QC Reporter', blank=True, null=True)  # Field name made lowercase. Field renamed to remove unsuitable characters.
    qc_plot_id = models.TextField(db_column='QC Plot ID', blank=True, null=True)  # Field name made lowercase. Field renamed to remove unsuitable characters.
    calculation_001 = models.TextField(blank=True, null=True)
    coordinate = models.TextField(db_column='Coordinate', blank=True, null=True)  # Field name made lowercase.
    field_coordinate_latitude = models.FloatField(db_column='_Coordinate_latitude', blank=True, null=True)  # Field name made lowercase. Field renamed because it started with '_'.
    field_coordinate_longitude = models.FloatField(db_column='_Coordinate_longitude', blank=True, null=True)  # Field name made lowercase. Field renamed because it started with '_'.
    field_coordinate_altitude = models.FloatField(db_column='_Coordinate_altitude', blank=True, null=True)  # Field name made lowercase. Field renamed because it started with '_'.
    field_coordinate_precision = models.FloatField(db_column='_Coordinate_precision', blank=True, null=True)  # Field name made lowercase. Field renamed because it started with '_'.
    slash_height_of_weeds_15cm = models.TextField(db_column='Slash height of weeds < 15cm', blank=True, null=True)  # Field name made lowercase. Field renamed to remove unsuitable characters.
    number_of_planted_trees = models.BigIntegerField(db_column='Number of planted trees', blank=True, null=True)  # Field name made lowercase. Field renamed to remove unsuitable characters.
    number_of_alive_planted_trees = models.FloatField(db_column='Number of alive planted trees', blank=True, null=True)  # Field name made lowercase. Field renamed to remove unsuitable characters.
    number_of_dead_planted_trees = models.FloatField(db_column='Number of dead planted trees', blank=True, null=True)  # Field name made lowercase. Field renamed to remove unsuitable characters.
    number_of_missing_trees = models.FloatField(db_column='Number of missing trees', blank=True, null=True)  # Field name made lowercase. Field renamed to remove unsuitable characters.
    planted_trees_slashed = models.FloatField(db_column='Planted trees - Slashed', blank=True, null=True)  # Field name made lowercase. Field renamed to remove unsuitable characters.
    planted_trees_damaged = models.FloatField(db_column='Planted trees - Damaged', blank=True, null=True)  # Field name made lowercase. Field renamed to remove unsuitable characters.
    circles_not_meeting_0_5m_radius = models.FloatField(db_column='Circles not meeting 0.5m radius', blank=True, null=True)  # Field name made lowercase. Field renamed to remove unsuitable characters.
    soil_disturbance_planted_trees = models.FloatField(db_column='Soil disturbance - Planted trees', blank=True, null=True)  # Field name made lowercase. Field renamed to remove unsuitable characters.
    weeds_within_0_5m_radius_circle = models.FloatField(db_column='Weeds within 0.5m radius circle', blank=True, null=True)  # Field name made lowercase. Field renamed to remove unsuitable characters.
    trees_not_planted_with_dbh_5cm = models.FloatField(db_column='Trees (not planted) with DBH > 5cm', blank=True, null=True)  # Field name made lowercase. Field renamed to remove unsuitable characters.
    slashed_trees_not_planted_with_dbh_5cm = models.FloatField(db_column='Slashed trees (not planted) with DBH > 5cm', blank=True, null=True)  # Field name made lowercase. Field renamed to remove unsuitable characters.
    line_clearing_2m_width_conformance = models.TextField(db_column='Line Clearing 2m width Conformance', blank=True, null=True)  # Field name made lowercase. Field renamed to remove unsuitable characters.
    native_trees_dbh_15cm_with_vines_climbers_fully_cleared = models.FloatField(db_column='Native trees (DBH > 15cm) with vines/climbers fully cleared', blank=True, null=True)  # Field name made lowercase. Field renamed to remove unsuitable characters.
    native_trees_dbh_15cm_with_incomplete_vine_climbers_clearan = models.FloatField(db_column='Native trees (DBH > 15cm) with incomplete vine/climbers clearan', blank=True, null=True)  # Field name made lowercase. Field renamed to remove unsuitable characters.
    invasive_species_unslashed_stems_dbh_15cm_field = models.FloatField(db_column='Invasive Species - Unslashed stems (DBH<15cm)', blank=True, null=True)  # Field name made lowercase. Field renamed to remove unsuitable characters. Field renamed because it ended with '_'.
    spot_spray_completeness = models.TextField(db_column='Spot Spray Completeness', blank=True, null=True)  # Field name made lowercase. Field renamed to remove unsuitable characters.
    number_of_circle_sprayed_trees = models.FloatField(db_column='Number of circle sprayed trees', blank=True, null=True)  # Field name made lowercase. Field renamed to remove unsuitable characters.
    number_of_circle_sprayed_trees_with_green_patches_or_weed_growt = models.FloatField(db_column='Number of circle sprayed trees with green patches or weed growt', blank=True, null=True)  # Field name made lowercase. Field renamed to remove unsuitable characters.
    number_of_planted_trees_dead_due_to_chemical = models.FloatField(db_column='Number of planted trees dead due to chemical', blank=True, null=True)  # Field name made lowercase. Field renamed to remove unsuitable characters.
    number_of_chemical_stressed_trees = models.FloatField(db_column='Number of chemical stressed trees', blank=True, null=True)  # Field name made lowercase. Field renamed to remove unsuitable characters.
    number_of_invasive_woody_species = models.FloatField(db_column='Number of invasive woody species', blank=True, null=True)  # Field name made lowercase. Field renamed to remove unsuitable characters.
    number_of_spot_sprayed_woody_species = models.FloatField(db_column='Number of spot sprayed woody species', blank=True, null=True)  # Field name made lowercase. Field renamed to remove unsuitable characters.
    damage_to_non_target_species_number_of_unplanted_trees_dead_du = models.FloatField(db_column='Damage to Non-Target Species (Number of unplanted trees dead du', blank=True, null=True)  # Field name made lowercase. Field renamed to remove unsuitable characters.
    planted_species_1 = models.TextField(db_column='Planted Species 1', blank=True, null=True)  # Field name made lowercase. Field renamed to remove unsuitable characters.
    species_1_count = models.FloatField(db_column='Species 1 Count', blank=True, null=True)  # Field name made lowercase. Field renamed to remove unsuitable characters.
    planted_species_2 = models.TextField(db_column='Planted Species 2', blank=True, null=True)  # Field name made lowercase. Field renamed to remove unsuitable characters.
    species_2_count = models.FloatField(db_column='Species 2 Count', blank=True, null=True)  # Field name made lowercase. Field renamed to remove unsuitable characters.
    planted_species_3 = models.TextField(db_column='Planted Species 3', blank=True, null=True)  # Field name made lowercase. Field renamed to remove unsuitable characters.
    species_3_count = models.FloatField(db_column='Species 3 Count', blank=True, null=True)  # Field name made lowercase. Field renamed to remove unsuitable characters.
    planted_species_4 = models.TextField(db_column='Planted Species 4', blank=True, null=True)  # Field name made lowercase. Field renamed to remove unsuitable characters.
    species_4_count = models.FloatField(db_column='Species 4 Count', blank=True, null=True)  # Field name made lowercase. Field renamed to remove unsuitable characters.
    planted_species_5 = models.TextField(db_column='Planted Species 5', blank=True, null=True)  # Field name made lowercase. Field renamed to remove unsuitable characters.
    species_5_count = models.FloatField(db_column='Species 5 Count', blank=True, null=True)  # Field name made lowercase. Field renamed to remove unsuitable characters.
    planted_species_6 = models.TextField(db_column='Planted Species 6', blank=True, null=True)  # Field name made lowercase. Field renamed to remove unsuitable characters.
    species_6_count = models.FloatField(db_column='Species 6 Count', blank=True, null=True)  # Field name made lowercase. Field renamed to remove unsuitable characters.
    planted_species_7 = models.TextField(db_column='Planted Species 7', blank=True, null=True)  # Field name made lowercase. Field renamed to remove unsuitable characters.
    species_7_count = models.FloatField(db_column='Species 7 Count', blank=True, null=True)  # Field name made lowercase. Field renamed to remove unsuitable characters.
    planted_species_8 = models.TextField(db_column='Planted Species 8', blank=True, null=True)  # Field name made lowercase. Field renamed to remove unsuitable characters.
    species_8_count = models.FloatField(db_column='Species 8 Count', blank=True, null=True)  # Field name made lowercase. Field renamed to remove unsuitable characters.
    planted_species_9 = models.TextField(db_column='Planted Species 9', blank=True, null=True)  # Field name made lowercase. Field renamed to remove unsuitable characters.
    species_9_count = models.FloatField(db_column='Species 9 Count', blank=True, null=True)  # Field name made lowercase. Field renamed to remove unsuitable characters.
    planted_species_10 = models.TextField(db_column='Planted Species 10', blank=True, null=True)  # Field name made lowercase. Field renamed to remove unsuitable characters.
    species_count_10 = models.FloatField(db_column='Species Count 10', blank=True, null=True)  # Field name made lowercase. Field renamed to remove unsuitable characters.
    correct_species_mix = models.TextField(db_column='Correct species mix', blank=True, null=True)  # Field name made lowercase. Field renamed to remove unsuitable characters.
    comments = models.TextField(db_column='Comments', blank=True, null=True)  # Field name made lowercase.
    photo_east = models.TextField(db_column='Photo East', blank=True, null=True)  # Field name made lowercase. Field renamed to remove unsuitable characters.
    photo_east_url = models.TextField(db_column='Photo East_URL', blank=True, null=True)  # Field name made lowercase. Field renamed to remove unsuitable characters.
    photo_west = models.TextField(db_column='Photo West', blank=True, null=True)  # Field name made lowercase. Field renamed to remove unsuitable characters.
    photo_west_url = models.TextField(db_column='Photo West_URL', blank=True, null=True)  # Field name made lowercase. Field renamed to remove unsuitable characters.
    photo_south = models.TextField(db_column='Photo South', blank=True, null=True)  # Field name made lowercase. Field renamed to remove unsuitable characters.
    photo_south_url = models.TextField(db_column='Photo South_URL', blank=True, null=True)  # Field name made lowercase. Field renamed to remove unsuitable characters.
    photo_north = models.TextField(db_column='Photo North', blank=True, null=True)  # Field name made lowercase. Field renamed to remove unsuitable characters.
    photo_north_url = models.TextField(db_column='Photo North_URL', blank=True, null=True)  # Field name made lowercase. Field renamed to remove unsuitable characters.
    start_date_of_maintenance = models.DateTimeField(db_column='Start Date of Maintenance', blank=True, null=True)  # Field name made lowercase. Field renamed to remove unsuitable characters.
    date_of_maintenance = models.DateField(db_column='Date of Maintenance', blank=True, null=True)  # Field name made lowercase. Field renamed to remove unsuitable characters.
    date_of_planting = models.DateTimeField(db_column='Date of Planting', blank=True, null=True)  # Field name made lowercase. Field renamed to remove unsuitable characters.
    end_date_of_maintenance = models.DateTimeField(db_column='End Date of Maintenance', blank=True, null=True)  # Field name made lowercase. Field renamed to remove unsuitable characters.
    area_qced_ha = models.FloatField(db_column='Area QCed, Ha', blank=True, null=True)  # Field name made lowercase. Field renamed to remove unsuitable characters.
    spacing_sph_field = models.TextField(db_column='Spacing (SPH)', blank=True, null=True)  # Field name made lowercase. Field renamed to remove unsuitable characters. Field renamed because it ended with '_'.
    spacing_sph_1 = models.TextField(db_column='Spacing (SPH).1', blank=True, null=True)  # Field name made lowercase. Field renamed to remove unsuitable characters.
    date_planted = models.TextField(db_column='Date Planted', blank=True, null=True)  # Field name made lowercase. Field renamed to remove unsuitable characters.
    all_weeds_treated = models.FloatField(db_column='All Weeds Treated', blank=True, null=True)  # Field name made lowercase. Field renamed to remove unsuitable characters.
    herbicide_effectivity = models.FloatField(db_column='Herbicide Effectivity', blank=True, null=True)  # Field name made lowercase. Field renamed to remove unsuitable characters.
    number_of_planted_trees_with_fertilizer_applied = models.FloatField(db_column='Number of Planted trees with fertilizer applied', blank=True, null=True)  # Field name made lowercase. Field renamed to remove unsuitable characters.
    number_of_planted_trees_with_fertilizer_applied_15cm_from_tree = models.FloatField(db_column='Number of Planted trees with fertilizer applied 15cm from tree', blank=True, null=True)  # Field name made lowercase. Field renamed to remove unsuitable characters.
    number_of_planted_trees_with_fertilizer_scorched_leaves = models.FloatField(db_column='Number of Planted trees with fertilizer scorched leaves', blank=True, null=True)  # Field name made lowercase. Field renamed to remove unsuitable characters.
    number_of_planted_trees_with_covered_fertilizers = models.FloatField(db_column='Number of Planted trees with covered fertilizers', blank=True, null=True)  # Field name made lowercase. Field renamed to remove unsuitable characters.
    general_slots_placement = models.TextField(db_column='General Slots Placement', blank=True, null=True)  # Field name made lowercase. Field renamed to remove unsuitable characters.
    field_id = models.BigIntegerField(db_column='_id', blank=True, null=True)  # Field renamed because it started with '_'.
    field_uuid = models.TextField(db_column='_uuid', blank=True, null=True)  # Field renamed because it started with '_'.
    field_submission_time = models.DateTimeField(db_column='_submission_time', blank=True, null=True)  # Field renamed because it started with '_'.
    field_validation_status = models.TextField(db_column='_validation_status', blank=True, null=True)  # Field renamed because it started with '_'.
    field_notes = models.FloatField(db_column='_notes', blank=True, null=True)  # Field renamed because it started with '_'.
    field_status = models.TextField(db_column='_status', blank=True, null=True)  # Field renamed because it started with '_'.
    field_submitted_by = models.TextField(db_column='_submitted_by', blank=True, null=True)  # Field renamed because it started with '_'.
    field_version_field = models.TextField(db_column='__version__', blank=True, null=True)  # Field renamed because it contained more than one '_' in a row. Field renamed because it started with '_'. Field renamed because it ended with '_'.
    field_tags = models.FloatField(db_column='_tags', blank=True, null=True)  # Field renamed because it started with '_'.
    field_index = models.BigIntegerField(db_column='_index', blank=True, null=True)  # Field renamed because it started with '_'.
    surviving_trees = models.FloatField(db_column='Surviving Trees', blank=True, null=True)  # Field name made lowercase. Field renamed to remove unsuitable characters.
    vine_clearance_completeness = models.FloatField(blank=True, null=True)
    percentage_spraying_completeness = models.FloatField(blank=True, null=True)
    circle_sprayed_trees_with_green_patches_or_weed_growth_quality = models.FloatField(blank=True, null=True)
    damage_to_non_target_species_quality = models.FloatField(blank=True, null=True)
    chemical_weeding_accuracy = models.FloatField(blank=True, null=True)
    chemical_weeding_accuracy_pass_or_fail = models.TextField(blank=True, null=True)
    slashed_tree_preservation_accuracy_planted_trees_field = models.FloatField(db_column='Slashed Tree Preservation Accuracy - Planted Trees (%)', blank=True, null=True)  # Field name made lowercase. Field renamed to remove unsuitable characters. Field renamed because it ended with '_'.
    slash_height_accuracy_field = models.FloatField(db_column='Slash Height Accuracy (%)', blank=True, null=True)  # Field name made lowercase. Field renamed to remove unsuitable characters. Field renamed because it ended with '_'.
    maintenance_slashing_accuracy_field = models.FloatField(db_column='Maintenance Slashing Accuracy (%)', blank=True, null=True)  # Field name made lowercase. Field renamed to remove unsuitable characters. Field renamed because it ended with '_'.
    maintenance_slashing_accuracy_pass_fail_field = models.TextField(db_column='Maintenance Slashing Accuracy (Pass/Fail)', blank=True, null=True)  # Field name made lowercase. Field renamed to remove unsuitable characters. Field renamed because it ended with '_'.
    ring_weeded_tree_preservation_accuracy_planted_trees_field = models.FloatField(db_column='Ring weeded Tree Preservation Accuracy - Planted Trees (%)', blank=True, null=True)  # Field name made lowercase. Field renamed to remove unsuitable characters. Field renamed because it ended with '_'.
    number_0_5m_radius_accuracy_field = models.FloatField(db_column='0.5m radius Accuracy (%)', blank=True, null=True)  # Field name made lowercase. Field renamed to remove unsuitable characters. Field renamed because it ended with '_'. Field renamed because it wasn't a valid Python identifier.
    soil_disturbance_accuracy_field = models.FloatField(db_column='Soil Disturbance Accuracy (%)', blank=True, null=True)  # Field name made lowercase. Field renamed to remove unsuitable characters. Field renamed because it ended with '_'.
    weeds_control_accuracy_field = models.FloatField(db_column='Weeds Control Accuracy (%)', blank=True, null=True)  # Field name made lowercase. Field renamed to remove unsuitable characters. Field renamed because it ended with '_'.
    ring_weeding_accuracy_field = models.FloatField(db_column='Ring Weeding Accuracy (%)', blank=True, null=True)  # Field name made lowercase. Field renamed to remove unsuitable characters. Field renamed because it ended with '_'.
    ring_weeding_pass_fail_field = models.TextField(db_column='Ring Weeding (Pass/Fail)', blank=True, null=True)  # Field name made lowercase. Field renamed to remove unsuitable characters. Field renamed because it ended with '_'.
    maintenance_qc_result_field = models.FloatField(db_column='Maintenance QC Result (%)', blank=True, null=True)  # Field name made lowercase. Field renamed to remove unsuitable characters. Field renamed because it ended with '_'.
    maintenance_qc_result_pass_or_fail = models.TextField(db_column='Maintenance QC Result (%) Pass or Fail', blank=True, null=True)  # Field name made lowercase. Field renamed to remove unsuitable characters.
    survival_field = models.FloatField(db_column='Survival %', blank=True, null=True)  # Field name made lowercase. Field renamed to remove unsuitable characters. Field renamed because it ended with '_'.
    geometry = models.PointField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'maintenance_qc'


class LandPreparation(models.Model):
    date_of_qc = models.DateTimeField(blank=True, null=True)
    works_order_number = models.FloatField(blank=True, null=True)
    start_date_of_activity = models.DateTimeField(blank=True, null=True)
    end_date_of_activity = models.DateTimeField(blank=True, null=True)
    qc_attempt = models.FloatField(blank=True, null=True)
    compartment_id = models.TextField(blank=True, null=True)
    qc_plot_id = models.TextField(blank=True, null=True)
    number_of_planted_trees = models.FloatField(blank=True, null=True)
    number_of_pits = models.FloatField(blank=True, null=True)
    number_of_pits_unfirmed_tilth = models.FloatField(blank=True, null=True)
    number_of_pits_opened_to_1m = models.FloatField(blank=True, null=True)
    number_of_pits_niche_depth_ge_25cm = models.FloatField(blank=True, null=True)
    number_of_pits_niche_width_ge_30cm = models.FloatField(blank=True, null=True)
    number_of_invasive_trees_felled = models.FloatField(blank=True, null=True)
    number_of_standing_invasive_trees = models.FloatField(blank=True, null=True)
    number_of_invasive_trees_stump_height_le_15cm = models.FloatField(blank=True, null=True)
    number_of_stumps = models.FloatField(blank=True, null=True)
    number_of_stumps_affected_by_poison = models.FloatField(blank=True, null=True)
    number_of_stumps_not_affected_by_poison = models.FloatField(blank=True, null=True)
    work_quantity_ha = models.FloatField(blank=True, null=True)
    work_quantity_m = models.FloatField(blank=True, null=True)
    area_qced_ha = models.FloatField(blank=True, null=True)
    spacing_width = models.FloatField(blank=True, null=True)
    spacing_length = models.FloatField(blank=True, null=True)
    marking_and_pitting_correct_spacing = models.TextField(blank=True, null=True)
    weeds_treated_percentage = models.TextField(blank=True, null=True)
    herbicide_effectivity = models.TextField(blank=True, null=True)
    coordinate_latitude = models.FloatField(blank=True, null=True)
    coordinate_longitude = models.FloatField(blank=True, null=True)
    coordinate_altitude = models.FloatField(blank=True, null=True)
    coordinate_precision = models.FloatField(blank=True, null=True)
    forester = models.TextField(blank=True, null=True)
    supervisor = models.TextField(blank=True, null=True)
    team_leader = models.TextField(blank=True, null=True)
    team_type = models.TextField(blank=True, null=True)
    team = models.TextField(blank=True, null=True)
    activity = models.TextField(blank=True, null=True)
    land_cover = models.TextField(blank=True, null=True)
    qc_reporter = models.TextField(blank=True, null=True)
    coordinate = models.TextField(blank=True, null=True)
    slashing_bush_clearing_completeness = models.TextField(blank=True, null=True)
    slash_bush_clearance_height = models.TextField(blank=True, null=True)
    rows_at_90_degrees_to_road = models.TextField(blank=True, null=True)
    large_debris_stones_removed = models.TextField(blank=True, null=True)
    invasive_trees_lopped_correctly = models.TextField(blank=True, null=True)
    slashed_trees_removed_from_smz_asi = models.TextField(blank=True, null=True)
    circles_not_meeting_05m_radius = models.FloatField(blank=True, null=True)
    weeds_within_05m_radius_circle = models.FloatField(blank=True, null=True)
    line_clearing_2m_width_conformance = models.TextField(blank=True, null=True)
    unslashed_indigenous_trees_dbh_gt_5cm = models.FloatField(blank=True, null=True)
    slashed_trees_dbh_gt_5cm = models.FloatField(blank=True, null=True)
    native_trees_vines_cleared = models.FloatField(blank=True, null=True)
    native_trees_vines_incomplete_clearance = models.FloatField(blank=True, null=True)
    invasive_species_unslashed_stems = models.FloatField(blank=True, null=True)
    comments = models.TextField(blank=True, null=True)
    photo_east = models.TextField(blank=True, null=True)
    photo_west = models.TextField(blank=True, null=True)
    photo_south = models.TextField(blank=True, null=True)
    photo_north = models.TextField(blank=True, null=True)
    field_id = models.BigIntegerField(db_column='_id', blank=True, null=True)  # Field renamed because it started with '_'.
    field_uuid = models.TextField(db_column='_uuid', blank=True, null=True)  # Field renamed because it started with '_'.
    field_submission_time = models.DateTimeField(db_column='_submission_time', blank=True, null=True)  # Field renamed because it started with '_'.
    field_validation_status = models.TextField(db_column='_validation_status', blank=True, null=True)  # Field renamed because it started with '_'.
    field_submitted_by = models.TextField(db_column='_submitted_by', blank=True, null=True)  # Field renamed because it started with '_'.
    slashing_accuracy = models.FloatField(blank=True, null=True)
    bush_clearing_accuracy = models.FloatField(blank=True, null=True)
    slashing_height_accuracy = models.FloatField(blank=True, null=True)
    bush_clearing_height_accuracy = models.FloatField(blank=True, null=True)
    slashed_weeds_control_accuracy = models.TextField(blank=True, null=True)
    bush_clearing_weeds_control_accuracy = models.TextField(blank=True, null=True)
    average_slashing_accuracy = models.FloatField(blank=True, null=True)
    average_bush_clearing_accuracy = models.FloatField(blank=True, null=True)
    firm_soil_tilth = models.FloatField(blank=True, null=True)
    niche_depth_accuracy = models.FloatField(blank=True, null=True)
    percentage_correct_spacing = models.FloatField(blank=True, null=True)
    pegging_accuracy = models.FloatField(blank=True, null=True)
    circle_weeding_accuracy = models.TextField(blank=True, null=True)
    stump_poisoning_effectively = models.FloatField(blank=True, null=True)
    vine_clearance_completeness = models.FloatField(blank=True, null=True)
    tree_preservation = models.FloatField(blank=True, null=True)
    liana_cutting_maintenance_accuracy = models.FloatField(blank=True, null=True)
    liana_cutting_establishment_accuracy = models.FloatField(blank=True, null=True)
    weeds_control_accuracy = models.TextField(blank=True, null=True)
    ring_weeding_accuracy = models.TextField(blank=True, null=True)
    felling = models.FloatField(blank=True, null=True)
    stump_height_conformance = models.FloatField(blank=True, null=True)
    felling_and_lopping_accuracy = models.FloatField(blank=True, null=True)
    pre_plant_spraying = models.FloatField(blank=True, null=True)
    soil_covered_quality = models.TextField(blank=True, null=True)
    slots_quality = models.TextField(blank=True, null=True)
    slot_slope_quality = models.TextField(blank=True, null=True)
    fertilizer_accuracy = models.TextField(blank=True, null=True)
    qc_result = models.FloatField(blank=True, null=True)
    qc_result_pass_or_fail = models.TextField(blank=True, null=True)
    geometry = models.PointField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'land_preparation'


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
        db_table = 'RBGH_Compartment_Tracker'
