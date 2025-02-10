<script setup lang="ts">
import type { SummarySection } from '~/components/GovSummaryCard.vue';

definePageMeta({ layout: false });

const title = "Dwelling details summary";
const store = useEcaasStore();

const generalSpecificationsData = store.dwellingDetails.generalSpecifications.data;
const appliancesData = store.dwellingDetails.appliances.data;
const shadingData = store.dwellingDetails.shading.data;
const externalFactors = store.dwellingDetails.externalFactors.data;

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
	id: 'appliances',
	label: "Appliances",
	data: {
		"Appliances": appliancesData.appliances
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

const externalFactorsSummary: SummarySection = {
	id: 'externalFactors',
	label: 'External factors',
	data: {
		"Altitude": externalFactors.altitude,
		"Type of exposure": externalFactors.typeOfExposure,
		"Terrain type": externalFactors.terrainType,
		"Noise nuisance": externalFactors.noiseNuisance
	}
};

const summarySections: SummarySection[] = [
	generalSpecificationsSummary,
	appliancesAndElectricitySummary,
	shadingSummary,
	externalFactorsSummary
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
