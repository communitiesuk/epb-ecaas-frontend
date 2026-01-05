<script setup lang="ts">
import type { SchemaBuildType, SchemaFuelType } from "~/schema/aliases";
import { isInteger } from "~/utils/validation";
import { getUrl, type GeneralDetailsData } from "#imports";


const title = "General details";
const store = useEcaasStore();
const { autoSaveForm } = useForm();
const fuelTypeOptions = {
	"mains_gas": "Mains gas",
	"LPG_bulk": "LPG (Liquid petroleum gas) - bulk",
	"LPG_bottled": "LPG (Liquid petroleum gas) - bottled"
} as const satisfies Record<Exclude<SchemaFuelType, "electricity">, FuelTypeDisplay>;

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
					fuelType: fields.fuelType,
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

const areSelectedOptionsValid = (node: FormKitNode) => {
	
	const parent = node.at("$parent");

	if (parent && parent.value) {
		const formValue = parent.value as GeneralDetailsData;
		const { fuelType } = formValue;
		if(fuelType.includes("elecOnly") && (fuelType.includes("mains_gas") || fuelType.includes("LPG_bulk") || fuelType.includes("LPG_bottled")) ){
			return false;
		}
	}
	return true;
};

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
			help="If the flat is over multiple storeys, enter the storey of the lowest habitable area"
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
			help="This could be a room with any tapping point. For example a sink, bath or shower."
			data-field="NumberOfTappedRooms"
		/>
		<FormKit
			id="fuelType"
			type="govCheckboxesWithExclusive"
			name="fuelType"
			label="Energy sources"
			help="Electricity is assumed to be present in the dwellings. Select the other energy sources that will be present in the dwelling, if any."
			:options="fuelTypeOptions"
			:validation-rules="{ areSelectedOptionsValid }"
			validation="required | areSelectedOptionsValid"
			:validation-messages="{areSelectedOptionsValid: 'Select Mains gas, LPG (Liquid petroleum gas) or select Electricity is the only energy source'}"
			data-field="EnergySupply.*.fuel"
			:exclusive-options="{'elecOnly': 'Electricity is the only energy source'}"
		/>
		<GovLLMWarning />
		<div class="govuk-button-group">
			<FormKit type="govButton" label="Save and mark as complete" test-id="saveAndComplete" :ignore="true" />
			<GovButton :href="getUrl('dwellingDetails')" secondary>Save progress</GovButton>
		</div>
	</FormKit>
</template>
