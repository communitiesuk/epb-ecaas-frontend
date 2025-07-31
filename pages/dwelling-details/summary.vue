<script setup lang="ts">
import type { SummarySection } from '~/common.types';
import { getTabItems, getUrl } from '#imports';
import { BuildType } from '~/schema/api-schema.types';

const title = "Dwelling details summary";
const store = useEcaasStore();

const generalDetailsData = store.dwellingDetails.generalSpecifications.data;
const shadingData = store.dwellingDetails.shading.data;
const externalFactors = store.dwellingDetails.externalFactors.data;

const generalDetailsSummary: SummarySection = {
	id: 'generalDetails',
	label: "General details",
	data: {
		"Type of dwelling": generalDetailsData.typeOfDwelling,
		"Number of storeys in building": generalDetailsData.storeysInDwelling,
		"Storey of flat": generalDetailsData.typeOfDwelling === BuildType.flat ? generalDetailsData.storeyOfFlat : undefined,
		"Number of bedrooms": generalDetailsData.numOfBedrooms,
		"Cooling required": displayBoolean(generalDetailsData.coolingRequired),
	},
	editUrl: getUrl('generalDetails')!
};

const shadingSummary: SummarySection = {
	id: 'shading',
	label: "Shading",
	data: shadingData.map(s => {
		return {
			"Name": s.name,
			"Shading start angle": s.startAngle,
			"Shading end angle": s.endAngle,
			"Shading type": s.objectType,
			"Height": s.height,
			"Distance": s.distance
		};
	}) || [],
	editUrl: getUrl('shading')!
};

const externalFactorsSummary: SummarySection = {
	id: 'externalFactors',
	label: 'External factors',
	data: {
		"Altitude": externalFactors.altitude,
		"Type of exposure": externalFactors.typeOfExposure,
		"Terrain type": externalFactors.terrainType,
		"Noise nuisance": displayBoolean(externalFactors.noiseNuisance)
	},
	editUrl: getUrl('externalFactors')!
};

const summarySections: SummarySection[] = [
	generalDetailsSummary,
	externalFactorsSummary,
	shadingSummary
];
</script>

<template>
	<!-- <NuxtLayout name="one-column"> -->
	<Head>
		<Title>{{ title }}</Title>
	</Head>
	<h1 class="govuk-heading-l">{{ title }}</h1>
	<GovTabs v-slot="tabProps" :items="getTabItems(summarySections)">
		<SummaryTab :summary="generalDetailsSummary" :selected="tabProps.currentTab === 0"/>
		<SummaryTab :summary="externalFactorsSummary" :selected="tabProps.currentTab === 1"/>
		<SummaryTab :summary="shadingSummary" :selected="tabProps.currentTab === 2">
			<template #empty>
				<h2 class="govuk-heading-m">No shading added</h2>
				<NuxtLink class="govuk-link" :to="getUrl('shadingCreate')">
					Add shading
				</NuxtLink>
			</template>
		</SummaryTab>
	</GovTabs>
	<GovButton href="/">Return to overview</GovButton>
	<!-- </NuxtLayout> -->
</template>
