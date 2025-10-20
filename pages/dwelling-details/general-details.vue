<script setup lang="ts">
import type { SchemaBuildType } from "~/schema/aliases";
import { isInteger } from "~/utils/validation";
import { getUrl } from "#imports";

const title = "General details";
const store = useEcaasStore();
const { autoSaveForm } = useForm();

const model = ref({
	...store.dwellingDetails.generalSpecifications.data,
});

const typeOfDwellingOptions: Record<SchemaBuildType, SnakeToSentenceCase<SchemaBuildType>> = {
	house: "House",
	flat: "Flat",
};

const saveForm = (fields: typeof model.value) => {
	store.$patch({
		dwellingDetails: {
			generalSpecifications: {
				data: {
					typeOfDwelling: fields.typeOfDwelling,
					storeysInDwelling: fields.storeysInDwelling,
					storeyOfFlat: fields.typeOfDwelling === "flat" ? fields.storeyOfFlat : undefined,
					buildingLength: fields.buildingLength,
					buildingWidth: fields.buildingWidth,
					numOfBedrooms: fields.numOfBedrooms,
					numOfUtilityRooms: fields.numOfUtilityRooms,
					numOfBathrooms: fields.numOfBathrooms,
					numOfWCs: fields.numOfWCs,
					numOfHabitableRooms: fields.numOfHabitableRooms,
					numOfRoomsWithTappingPoints: fields.numOfRoomsWithTappingPoints,
				},
				complete: true,
			},
		},
	});

	navigateTo("/dwelling-details");
};

autoSaveForm<GeneralDetailsData>(model, (state, newData) => {
	state.dwellingDetails.generalSpecifications = newData;
});

const { handleInvalidSubmit, errorMessages } = useErrorSummary();
</script>

<template>
	<Head>
		<Title>{{ title }}</Title>
	</Head>
	<h1 class="govuk-heading-l">{{ title }}</h1>
	<FormKit v-model="model" type="form" :actions="false" :incomplete-message="false" @submit="saveForm" @submit-invalid="handleInvalidSubmit">
		<GovErrorSummary :error-list="errorMessages" test-id="generalDetailsErrorSummary"/>
		<FormKit
			id="typeOfDwelling"
			type="govRadios"
			:options="typeOfDwellingOptions"
			label="Type of dwelling"
			name="typeOfDwelling"
			validation="required"
			help="Select the broad dwelling classification"
			data-field="General.build_type"
		/>
		<FormKit
			v-if="model.typeOfDwelling === 'flat'"
			id="storeyOfFlat"
			type="govInputInt"
			label="Storey of flat"
			name="storeyOfFlat"
			:validation-rules="{ isInteger }"
			validation="required | isInteger | min:-50 | max:199"
			:validation-messages="{
				isInteger: `Storey of flat must be an integer.`,
			}"
			help="The vertical position of the flat expressed by the storey it is on. 0 represents the ground floor."
			data-field="General.storey_of_dwelling"
		/>
		<FormKit
			id="storeysInDwelling"
			type="govInputInt"
			label="Number of storeys in building"
			name="storeysInDwelling"
			:validation-rules="{ isInteger }"
			validation="required | isInteger | min:1 | max:250"
			:validation-messages="{
				isInteger: `Number of storeys in building must be an integer.`,
			}"
			help="For houses this is the same as the number of storeys in the dwelling. For flats this is the total number of stories of the whole building the flat is in"
			data-field="General.storeys_in_building"
		/>
		<FormKit
			id="buildingLength"
			type="govInputWithSuffix"
			label="Building length"
			suffix-text="m"
			name="buildingLength"
			validation="required | number"
			help="Enter the maximum horizontal distance across the building footprint"
			data-field="BuildingLength"
		/>
		<FormKit
			id="buildingWidth"
			type="govInputWithSuffix"
			label="Building width"
			suffix-text="m"
			name="buildingWidth"
			validation="required | number"
			help="Enter the maximum horizontal distance perpendicular to the building length"
			data-field="BuildingWidth"
		/>
		<FormKit
			id="numOfBedrooms"
			type="govInputInt"
			label="Number of bedrooms"
			name="numOfBedrooms"
			:validation-rules="{ isInteger }"
			validation="required | isInteger | min:1"
			:validation-messages="{
				isInteger: `Number of bedrooms must be an integer.`,
			}"
			help="This affects the dwelling's predicted occupancy"
			data-field="NumberOfBedrooms"
		/>
		<FormKit
			id="numOfUtilityRooms"
			type="govInputInt"
			label="Number of utility rooms"
			name="numOfUtilityRooms"
			:validation-rules="{ isInteger }"
			validation="required | isInteger | min:1"
			:validation-messages="{
				isInteger: `Number of utility rooms must be an integer.`,
			}"
			help="A utility room is any that contains a sink or other feature or equipment that may reasonably be expected to produce significant quantities of water vapour"
			data-field="NumberOfUtilityRooms"
		/>
		<FormKit
			id="numOfBathrooms"
			type="govInputInt"
			label="Number of bathrooms"
			name="numOfBathrooms"
			:validation-rules="{ isInteger }"
			validation="required | isInteger | min:1"
			:validation-messages="{
				isInteger: `Number of bathrooms must be an integer.`,
			}"
			help="A bathroom is any room that contains a bath or shower"
			data-field="NumberOfBathrooms"
		/>
		<FormKit
			id="numOfWCs"
			type="govInputInt"
			label="Number of WCs"
			name="numOfWCs"
			:validation-rules="{ isInteger }"
			validation="required | isInteger"
			:validation-messages="{
				isInteger: `Number of WCs must be an integer.`,
			}"
			help="A WC is any space containing one or more flush toilets or urinals but not a bath or shower"
			data-field="NumberOfSanitaryAccommodations"
		/>
		<FormKit
			id="numOfHabitableRooms"
			type="govInputInt"
			label="Number of habitable rooms"
			name="numOfHabitableRooms"
			:validation-rules="{ isInteger }"
			validation="required | isInteger"
			:validation-messages="{
				isInteger: `Number of habitable rooms must be an integer.`,
			}"
			help="A habitable room is any that is not used solely as a kitchen, bathroom, utility room, cellar or WC"
			data-field="NumberOfHabitableRooms"
		/>
		<FormKit
			id="numOfRoomsWithTappingPoints"
			type="govInputInt"
			label="Total number of rooms with tapping points"
			name="numOfRoomsWithTappingPoints"
			:validation-rules="{ isInteger }"
			validation="required | isInteger"
			:validation-messages="{
				isInteger: `Number of rooms with tapping points must be an integer.`,
			}"
			help="This could be a room with any tapping point. For example a sink, bath or shower"
			data-field="NumberOfTappedRooms"
		/>
		<GovLLMWarning />
		<div class="govuk-button-group">
			<FormKit type="govButton" label="Save and mark as complete" test-id="saveAndComplete" :ignore="true" />
			<GovButton :href="getUrl('dwellingDetails')" secondary>Save progress</GovButton>
		</div>
	</FormKit>
</template>
