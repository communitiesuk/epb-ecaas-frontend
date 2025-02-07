<script setup lang="ts">
import type { SummarySection } from '~/components/GovSummaryCard.vue';

definePageMeta({ layout: false });

const title = "Dwelling details summary";
const store = useEcaasStore();

const generalSpecificationsData = store.dwellingDetails.generalSpecifications.data;
const appliancesAndElectricityData = store.dwellingDetails.appliancesAndElectricity.data;
const shadingData = store.dwellingDetails.shading.data;

const generalSpecificationsSummary: SummarySection = {
	id: 'generalSpecifications',
	label: "General specifications",
	data: {
		"Type of dwelling": generalSpecificationsData.typeOfDwelling,
		"Number of storeys in building": generalSpecificationsData.storeysInDwelling,
		"Storey of flat": generalSpecificationsData.storeyOfFlat,
		"Number of bedrooms": generalSpecificationsData.numOfBedrooms,
		"Latitude": generalSpecificationsData.latitude,
		"Longitude": generalSpecificationsData.longitude,
		"Part G compliance": generalSpecificationsData.partGCompliance,
		"Cooling required": generalSpecificationsData.coolingRequired,
		"Heating control type": generalSpecificationsData.heatingControlType
	}
};

const appliancesAndElectricitySummary: SummarySection = {
	id: 'appliancesAndElectricity',
	label: "Appliances and electricity",
	data: {
		"Fridge/freezer energy rating": appliancesAndElectricityData.fridgeFreezerEnergyRating,
		"Dishwasher energy rating": appliancesAndElectricityData.dishwasherEnergyRating,
		"Oven/cooker energy rating": appliancesAndElectricityData.ovenCookerEnergyRating,
		"Washing machine energy rating": appliancesAndElectricityData.washingMachineEnergyRating,
		"Tumble dryer energy rating": appliancesAndElectricityData.tumbleDryerEnergyRating,
		"Electric vehicle charger": appliancesAndElectricityData.electricVehicleCharger,
		"Electricity grid connection": appliancesAndElectricityData.electricityGridConnection,
		"Electricity tariff": appliancesAndElectricityData.electricityTariff
	}
};

const shadingSummary: SummarySection = {
	id: 'shading',
	label: "Shading",
	data: shadingData.shadingObjects?.map(s => {
		return {
			"Name": s.name,
			"Shading direction": s.direction,
			"Shading type": s.objectType,
			"Height": s.height,
			"Distance": s.distance
		};
	}) || []
};

const summarySections: SummarySection[] = [
	generalSpecificationsSummary,
	appliancesAndElectricitySummary,
	shadingSummary
];
</script>

<template>
	<div>
		<NuxtLayout name="one-column">
			<Head>
				<Title>{{ title }}</Title>
			</Head>
			<h1 class="govuk-heading-l">{{ title }}</h1>
			<GovSummaryCard :summary-sections="summarySections" />
			<NuxtLink to="/" class="govuk-button">Return to task list</NuxtLink>
		</NuxtLayout>
	</div>
</template>
