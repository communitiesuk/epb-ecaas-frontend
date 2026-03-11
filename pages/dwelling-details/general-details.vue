<script setup lang="ts">
import type { SchemaBuildType, SchemaFuelType, SchemaFuelTypeExtended } from "~/schema/aliases";
import { isInteger } from "~/utils/validation";
import { getUrl, type DomesticHotWaterHeatSourceData, type EcaasForm, type GeneralDetailsData, type HeatSourceData } from "#imports";


const title = "General details";
const store = useEcaasStore();
const { autoSaveForm } = useForm();
const fuelTypeOptions = {
	"mains_gas": "Mains gas",
	"LPG_bulk": "LPG (Liquid petroleum gas) - bulk",
	"LPG_bottled": "LPG (Liquid petroleum gas) - bottled",
	"LPG_condition_11F": "LPG - 11F",
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
					storeysInBuilding: fields.typeOfDwelling === "flat" ? fields.storeysInBuilding : undefined,
					buildingLength: fields.buildingLength,
					buildingWidth: fields.buildingWidth,
					numOfBedrooms: fields.numOfBedrooms,
					numOfUtilityRooms: fields.numOfUtilityRooms,
					numOfBathrooms: fields.numOfBathrooms,
					numOfWCs: fields.numOfWCs,
					numOfHabitableRooms: fields.numOfHabitableRooms,
					numOfRoomsWithTappingPoints: fields.numOfRoomsWithTappingPoints,
					numOfWetRooms: fields.numOfWetRooms,
					fuelType: fields.fuelType,
				},
				complete: true,
			},
		},
	});

	navigateTo("/dwelling-details");
};

function removeRefsToFuelType(heatSources: EcaasForm<Extract<HeatSourceData, { "typeOfHeatSource": "heatNetwork" | "heatBattery" }> | DomesticHotWaterHeatSourceData | SmartHotWaterTankData>[], removedFuelType: SchemaFuelTypeExtended) {
	for (const item of heatSources) {
		if ("energySupply" in item.data)
			if (item.data.energySupply === removedFuelType) {
				item.data.energySupply = undefined;
				item.complete = false;
			}
	}
}

watch(() => model.value.fuelType, (newFuelTypes, oldFuelTypes) => {
	if (newFuelTypes === oldFuelTypes || oldFuelTypes === undefined) return;
	if (newFuelTypes.length > oldFuelTypes.length) return;

	const removedFuel = oldFuelTypes.find(fuel => !newFuelTypes.includes(fuel));
	const spaceHeatingHeatSources = store.spaceHeating.heatSource.data.filter(({ data: x }) => x.typeOfHeatSource === "heatNetwork" || x.typeOfHeatSource === "heatBattery") as EcaasForm<Extract<HeatSourceData, { "typeOfHeatSource": "heatNetwork" | "heatBattery" }>>[];
	const dhwHeatSources = store.domesticHotWater.heatSources.data.filter(({ data: x }) => x.isExistingHeatSource === false && (x.typeOfHeatSource === "heatNetwork" || x.typeOfHeatSource === "heatBattery" || x.typeOfHeatSource === "pointOfUse"));
	const dhwWaterStorage = store.domesticHotWater.waterStorage.data.filter(({ data: x }) => x.typeOfWaterStorage === "smartHotWaterTank") as EcaasForm<SmartHotWaterTankData>[];

	if (removedFuel) {
		removeRefsToFuelType(spaceHeatingHeatSources, removedFuel);
		removeRefsToFuelType(dhwHeatSources, removedFuel);
		removeRefsToFuelType(dhwWaterStorage, removedFuel);
	}
});

watch(() => model.value.typeOfDwelling, (newType, oldType) => {
	if (newType === oldType || oldType === undefined) return;
	if (oldType === "flat" && newType === "house") {
		const { dwellingSpaceInternalDoor } = store.dwellingFabric.dwellingSpaceDoors;
		for (const door of dwellingSpaceInternalDoor.data) {
			if ("isTheFrontDoor" in door.data) {
				door.data.isTheFrontDoor = undefined;
			}
			if ("orientation" in door.data) {
				door.data.orientation = undefined;
			}
		}
	}
});

autoSaveForm<GeneralDetailsData>(model, (state, newData) => {
	state.dwellingDetails.generalSpecifications = newData;
});

const areSelectedOptionsValid = (node: FormKitNode) => {
	
	const parent = node.at("$parent");

	if (parent && parent.value) {
		const formValue = parent.value as GeneralDetailsData;
		const { fuelType } = formValue;
		if (fuelType.includes("elecOnly") && (fuelType.includes("mains_gas") || fuelType.includes("LPG_bulk") || fuelType.includes("LPG_bottled")) || fuelType.includes("LPG_condition_11F")) {
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
	<FormKit
		v-model="model"
		type="form"
		:actions="false"
		:incomplete-message="false"
		@submit="saveForm"
		@submit-invalid="handleInvalidSubmit">
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
				isInteger: `Storey of flat must be a round number.`,
			}"
			help="If the flat is over multiple storeys, enter the storey of the lowest habitable area"
			data-field="General.storey_of_dwelling"
		/>
		<FormKit
			id="storeysInDwelling"
			type="govInputInt"
			label="Number of storeys in dwelling"
			name="storeysInDwelling"
			:validation-rules="{ isInteger }"
			validation="required | isInteger | min:1 | max:250"
			:validation-messages="{
				isInteger: `Number of storeys in dwelling must be an integer.`,
			}"
			data-field="General.storeys_in_dwelling"
		/>
		<FormKit
			v-if="model.typeOfDwelling === 'flat'"
			id="storeysInBuilding"
			type="govInputInt"
			label="Number of storeys in building"
			name="storeysInBuilding"
			:validation-rules="{ isInteger }"
			validation="required | isInteger | min:1"
			:validation-messages="{
				isInteger: `Storeys in building must be a round number.`,
			}"
			help="Enter the number of storeys in the part of the building that the dwelling is in"
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
			data-field="BuildingLength">
			<GovDetails summary-text="Help with this input">
				<table class="govuk-table">
					<thead class="govuk-table__head">
						<tr>
							<th scope="col" class="govuk-table__header">
								Shape of dwelling
							</th>
							<th scope="col" class="govuk-table__header">
								Measuring length
							</th>
						</tr>
					</thead>
					<tbody class="govuk-table__body">
						<tr class="govuk-table__row">
							<th scope="row" class="govuk-table__header">
								Compact shaped dwelling (with no branching sections)
							</th>
							<td class="govuk-table__cell">
								The length is equal to the length of the smallest rectangle wholly containing the dwelling footprint.
							</td>
						</tr>
						<tr class="govuk-table__row">
							<th scope="row" class="govuk-table__header">
								Rectangular dwelling
							</th>
							<td class="govuk-table__cell">
								The length is the distance between the two shortest walls, parallel to the longest wall.
							</td>
						</tr>
						<tr class="govuk-table__row">
							<th scope="row" class="govuk-table__header">
								L-shaped or other branching dwelling
							</th>
							<td class="govuk-table__cell">
								The length starts and ends in the centre of the shortest wall and follows the L-shape of the dwellings. The length of other branching shapes should be measured in the same way, following the general shape of the building.
							</td>
						</tr>
					</tbody>
				</table>
			</GovDetails>
		</FormKit>
		<FormKit
			id="buildingWidth"
			type="govInputWithSuffix"
			label="Building width"
			suffix-text="m"
			name="buildingWidth"
			validation="required | number"
			help="Enter the maximum horizontal distance perpendicular to the building length"
			data-field="BuildingWidth">
			<GovDetails summary-text="Help with this input">
				<table class="govuk-table">
					<thead class="govuk-table__head">
						<tr>
							<th scope="col" class="govuk-table__header">
								Shape of dwelling
							</th>
							<th scope="col" class="govuk-table__header">
								Measuring width
							</th>
						</tr>
					</thead>
					<tbody class="govuk-table__body">
						<tr class="govuk-table__row">
							<th scope="row" class="govuk-table__header">
								Compact shaped dwelling (with no branching sections)
							</th>
							<td class="govuk-table__cell">
								The width is equal to the width of the smallest rectangle wholly containing the dwelling footprint.
							</td>
						</tr>
						<tr class="govuk-table__row">
							<th scope="row" class="govuk-table__header">
								Rectangular dwelling
							</th>
							<td class="govuk-table__cell">
								The width is the maximum horizontal distance perpendicular to the building length.
							</td>
						</tr>
						<tr class="govuk-table__row">
							<th scope="row" class="govuk-table__header">
								L-shaped or other branching dwelling
							</th>
							<td class="govuk-table__cell">
								The width of each branch is measured as the shorted distance between two walls. The building width is the longest of these branch widths.
							</td>
						</tr>
					</tbody>
				</table>
			</GovDetails>
		</FormKit>
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
			help="Enter the number of rooms in the dwelling excluding the primary living area and any wet rooms or utility rooms"
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
			help="Enter the number of wet rooms that are not kitchens, bathrooms, or WCs"
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
			help="Enter the number of rooms containing a bath or shower"
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
			help="Enter the number of rooms containing one or more flush toilets or urinals but not a bath or shower"
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
			help="Enter the number of rooms that are not used solely as a kitchen, bathroom, utility room, cellar or WC"
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
			help="Enter the total number of rooms with at least one hot water tapping point that is fed from the hot water distribution system. This excludes electric showers and point of use water heaters."
			data-field="NumberOfTappedRooms"
		/>
		<FormKit
			id="numOfWetRooms"
			type="govInputInt"
			label="Total number of wet rooms"
			name="numOfWetRooms"
			:validation-rules="{ isInteger }"
			validation="required | isInteger"
			:validation-messages="{
				isInteger: `Number of wet rooms must be an integer.`,
			}"
			help="Enter the total number of rooms used for domestic activities that produce significant amounts of airborne moisture. For example a kitchen, utility room, bathroom or WC."
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
		<FormKit
			id="isPartGCompliant"
			type="govBoolean"
			label="Is the dwelling Part G compliant?"
			name="isPartGCompliant"
			validation="required"
			data-field="PartGcompliance"
		/>
		<FormKit
			id="partOActiveCoolingRequired"
			type="govBoolean"
			label="Is active cooling required to make the dwelling Part O compliant?"
			name="partOActiveCoolingRequired"
			validation="required"
			data-field="PartO_active_cooling_required"
		/>
		<GovLLMWarning />
		<div class="govuk-button-group">
			<FormKit type="govButton" label="Save and mark as complete" test-id="saveAndComplete" :ignore="true" />
			<GovButton :href="getUrl('dwellingDetails')" secondary>Save progress</GovButton>
		</div>
	</FormKit>
</template>
