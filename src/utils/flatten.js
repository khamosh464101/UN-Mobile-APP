import defaultSubmission from "./defaultSubmission";
// Handle nested objects
  const nestedMappings = {
    source_information: [
      "id",
      "survey_province",
      "district_name",
      "surveyors_code",
      "surveyors_name",
      "nahya_number",
      "kbl_guzar_number",
      "village_name",
      "province_code",
      "city_name",
      "city_code",
      "district_code",
      "block_number",
      "house_number",
      "area_representative_name",
      "area_representative_phone",
    ],
    family_information: [
      "id",
      "number_families",
      "household_size",
      "hoh_disable",
      "hof_or_interviewee",
      "hof_ethnicity",
      "province_origin",
      "district_origin",
    ],
    head_family: [
      "id",
      "hoh_name",
      "hoh_father_name",
      "hoh_grandfather_name",
      "hoh_phone_number",
      "does_hoh_have_nic",
      "hoh_nic_number",
      "hoh_nic_photo",
      "hoh_sex",
      "hoh_age",
    ],
    interviewwee: [
      "id",
      "interviewee_hof_relation",
      "inter_name",
      "inter_father_name",
      "inter_grandfather_name",
      "inter_phone_number",
      "does_inter_have_nic",
      "inter_nic_number",
      "inter_nic_photo",
      "inter_sex",
      "inter_age",
    ],
    composition: [
      "id",
      "female_0_1",
      "male_0_1",
      "female_1_5",
      "male_1_5",
      "female_6_12",
      "male_6_12",
      "female_13_17",
      "male_13_17",
      "female_18_30",
      "male_18_30",
      "female_30_60",
      "male_30_60",
      "female_60_above",
      "male_60_above",
    ],
    idp: [
      "id",
      "year_idp",
      "idp_reason",
      "idp_securtiy_reason",
      "natural_disaster_reason",
      "other_reason",
    ],
    returnee: [
      "id",
      "year_returnee",
      "migrate_country",
      "migrate_country_other",
      "migration_reason",
      "migration_reason_security",
      "migration_reason_natural_disaster",
      "migration_reason_other",
      "duration_Household_living_there",
      "date_return_home_country",
      "entry_borders",
      "return_document_have",
      "type_return_document",
      "type_return_document_number",
      "type_return_document_date",
      "household_get_support_no",
      "household_get_support",
      "household_get_support_yes",
      "organization_support",
      "reason_return",
      "return_reason_force",
      "return_reason_voluntair",
    ],
    extremely_vulnerable_member: [
      "id",
      "large_Household",
      "disable_member",
      "physical_disable",
      "mental_disable",
      "chronic_disable",
      "drug_addicted",
      "conditional_women",
      "conditional_women_pregnant",
      "conditional_women_breastfeeding_mother",
      "conditional_women_widow",
    ],
    access_civil_document_male: [
      "id",
      "access_civil_documentation_male_tazkira",
      "access_civil_documentation_male_birthcertificate",
      "access_civil_documentation_male_marriagecertificate",
      "access_civil_documentation_male_departationcard",
      "access_civil_documentation_male_drivinglicense",
    ],
    access_civil_document_female: [
      "id",
      "access_civil_documentation_female_tazkira",
      "access_civil_documentation_female_birthcertificate",
      "access_civil_documentation_female_marriagecertificate",
      "access_civil_documentation_female_departationcard",
      "access_civil_documentation_female_drivinglicense",
    ],
    house_land_ownership: [
      "id",
      "house_owner",
      "inter_name_owner",
      "inter_father_name_owner",
      "inter_phone_number_owner",
      "does_inter_have_nic_owner",
      "inter_nic_number_owner",
      "inter_nic_photo_owner",
      "type_tenure_document",
      "house_owner_myself",
      "house_document_number",
      "house_document_date",
      "duration_lived_thishouse",
    ],
    house_condition: [
      "id",
      "materials_house_constructed",
      "issues_current_house",
      "house_adequate_family_size",
      "house_adequate_family_size_no",
      "house_adequate_family_size_no_other",
      "made_housing_improvement",
      "made_housing_improvement_yes",
      "received_humanitarian_assistance",
      "received_humanitarian_assistance_type",
      "received_humanitarian_assistance_org",
      "shelter_support_received",
      "shelter_support_received_yes",
      "shelter_support_received_yes_other",
      "rate_need_shelter_repair",
      "surveyor_observation_current_house",
    ],
    access_basic_service: [
      "id",
      "drinkingwater_main_source",
      "type_water_source",
      "water_source_distance",
      "water_source_route_safe",
      "water_source_route_safe_no",
      "water_collect_person",
      "water_quality",
      "water_point_photo",
      "type_toilet_facilities",
      "access_sanitation_photo",
      "access_education",
      "access_school",
      "type_school",
      "nearest_school",
      "access_school_university",
      "access_school_madrasa",
      "Household_members_attend_school_present",
      "members_attend_school_no",
      "members_attend_school_yes_boys",
      "members_attend_school_yes_girls",
      "Household_members_attend_madrasa_present_howmany",
      "members_attend_madrasa_no",
      "members_attend_madrasa_yes_boys",
      "members_attend_madrasa_yes_girls",
      "Household_members_attend_university_present",
      "litrate_Household_member",
      "number_male_child_Household",
      "number_female_child_Household",
      "access_education_photo",
      "access_education_no",
      "access_health_services",
      "health_facilities_type",
      "health_service_distance",
      "health_service_distance_no",
      "health_facility_have_female_staff",
      "health_challanges",
      "health_challanges_other",
      "access_health_photo",
      "type_access_road",
      "access_road_photo",
      "how_access_electricity",
      "energy_cooking",
    ],
    food_consumption_score: [
      "id",
      "days_inweek_eaten_cereal",
      "days_inweek_eaten_pulse",
      "days_inweek_eaten_vegetables",
      "days_inweek_eaten_fruits",
      "days_inweek_eaten_animal",
      "days_inweek_eaten_dairy",
      "days_inweek_eaten_oil",
      "days_inweek_eaten_sugar",
      "days_inweek_eaten_bread",
      "food_cerel_source",
    ],
    household_strategy_food: [
      "id",
      "number_days_nothave_enough_food_less_expensive",
      "number_days_nothave_enough_food_barrow",
      "number_days_nothave_enough_food_limit_portion",
      "number_days_nothave_enough_food_restrict_sonsumption",
      "number_days_nothave_enough_food_reduce_meals",
      "household_stocks_cereals",
      "market_place",
      "marketplace_distance",
    ],
    community_availability: [
      "id",
      "community_avalibility",
      "community_center_photo",
      "community_org_female",
      "community_org_male",
      "Household_member_participate",
      "Household_member_participate_yes",
    ],
    livelihood: [
      "id",
      "Household_main_source_income",
      "women_engagement_income",
      "average_Household_monthly_income",
      "improve_livelihoods",
      "improve_livelihoods_other",
      "debt",
      "repaying_load_yes",
    ],
    durable_solution: [
      "id",
      "future_families_preference",
      "local_integration_details",
      "local_integration_other",
      "do_you_have_land",
      "do_you_have_land_yes",
    ],
    skill_idea: [
      "id",
      "members_have_skills",
      "type_skills",
      "type_skills_other",
      "skills_want_learn",
    ],
    resettlement: [
      "id",
      "relocate_another_place_by_government",
      "reason_notwantto_relocate",
      "relocate_minimum_condition",
    ],
    recent_assistance: [
      "id",
      "receive_assistance",
      "type_assistance",
      "assistance_provided_by",
    ],
    photo_section: [
      "id",
      "field_name",
      "latitude",
      "longitude",
      "altitude",
      "accuracy",
      "photo_interviewee",
      "photo_house_building",
      "photo_house_door",
      "photo_enovirment",
      "photo_other",
      "remarks",
    ],
  };
function toFlatten(apiData) {
  // Start with a fresh copy of the default structure
  const result = JSON.parse(JSON.stringify(defaultSubmission));

  // Direct top-level properties
  const topLevelProps = [
    "id",
    "_id",
    "_uuid",
    "today",
    "start",
    "end",
    "__version__",
    "_submission_time",
    "consent",
    "status",
    "dm_form_id",
    "submission_status_id",
    "created_at",
    "updated_at",
    "map_image",
  ];

  // Copy top-level properties
  topLevelProps.forEach((prop) => {
    if (apiData[prop] !== undefined) {
      result[prop] = apiData[prop];
    }
  });

  




  // Process each nested object mapping
  for (const [nestedKey, props] of Object.entries(nestedMappings)) {
    if (apiData[nestedKey]) {
      props.forEach((prop) => {
        if (apiData[nestedKey][prop] !== undefined) {
          if (prop == "id") {
            result[nestedKey + "__" + prop] = apiData[nestedKey][prop];
            return;
          }
          result[prop] = apiData[nestedKey][prop];
        }
      });
    }
  }


  // Handle special cases (arrays)
  if (apiData.house_condition?.issues_current_house) {
    result.issues_current_house = apiData.house_condition.issues_current_house;
  }

  if (apiData.house_condition.house_problem_area_photo) {
    result.house_problems_area_photos = apiData.house_condition.house_problem_area_photo;
  }

  if (apiData.returnee.type_return_document_photo) {
    result.type_return_document_photo = apiData.returnee.type_return_document_photo.map((row) => {return row['type_return_document_photo']});
  }
  if (apiData.house_land_ownership.land_ownership_document) {
    result.house_document_photo = apiData.house_land_ownership.land_ownership_document.map((row) => {return row['house_document_photo']});
  }

  if (apiData.infrasttructure_service) {
    result.infrastructure_services_settlement = apiData.infrasttructure_service.infrastructure_services_settlement.split(' ');
      ;
  }

  result.issues_current_house = result.issues_current_house.split(' ');

  return result;
}

export const getErrorMessage = (error) => {
  return error.response?.data?.message ||
      error.message ||
      "An unexpected error occurred.";
}

export const handleValidationErrors = (error, setError) => {
  const errors = error.response.data.errors;
  Object.keys(errors).forEach((field) => {
    setError(field, {
      type: "server",
      message: errors[field][0],
    });
  });
  
}

export const getIdAndTable = (apiData, field) => {
  for (const [tableName, fields] of Object.entries(nestedMappings)) {
    if (fields.includes(field) && apiData[tableName]?.id) {
      return {
        table: tableName,
        id: apiData[tableName].id // Get the ID from the nested object
      };
    }
  }
  return null; // Explicitly return null if field not found
};


export default toFlatten;
