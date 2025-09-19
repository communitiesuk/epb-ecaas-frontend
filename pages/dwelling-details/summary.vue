<script setup lang="ts">
import type { SummarySection } from "~/common.types";
import { getTabItems, getUrl } from "#imports";
import { degrees } from "~/utils/units/angle";
import { metre } from "~/utils/units/length";

const title = "Dwelling details summary";
const store = useEcaasStore();

const generalDetailsData = store.dwellingDetails.generalSpecifications.data;
const shadingData = store.dwellingDetails.shading.data;
const externalFactors = store.dwellingDetails.externalFactors.data;

const generalDetailsSummary: SummarySection = {
	id: "generalDetails",
	label: "General details",
	data: {
		"Type of dwelling": displayCamelToSentenceCase(show(generalDetailsData.typeOfDwelling)),
		"Number of storeys in building": show(generalDetailsData.storeysInDwelling),
		"Storey of flat": generalDetailsData.typeOfDwelling === "flat" ? show(generalDetailsData.storeyOfFlat) : undefined,
		"Number of bedrooms": show(generalDetailsData.numOfBedrooms),
		"Cooling required": displayBoolean(generalDetailsData.coolingRequired),
	},
	editUrl: getUrl("generalSpecifications"),
};

const shadingSummary: SummarySection = {
	id: "shading",
	label: "Shading",
	data: shadingData.map(s => {
		return {
			"Name": show(s.data.name),
			"Shading start angle": dim(s.data.startAngle, degrees.name),
			"Shading end angle": dim(s.data.endAngle, degrees.name),
			"Shading type": displayCamelToSentenceCase(show(s.data.objectType)),
			"Height": dim(s.data.height, metre.name),
			"Distance": dim(s.data.distance, metre.name),
		};
	}) || [],
	editUrl: getUrl("shading"),
};

const externalFactorsSummary: SummarySection = {
	id: "externalFactors",
	label: "External factors",
	data: {
		"Altitude": dim(externalFactors.altitude, metre.name),
		"Type of exposure": show(externalFactors.typeOfExposure),
		"Terrain type": displayCamelToSentenceCase(show(externalFactors.terrainType)),
		"Noise nuisance": displayBoolean(externalFactors.noiseNuisance),
	},
	editUrl: getUrl("externalFactors"),
};

const summarySections: SummarySection[] = [
	generalDetailsSummary,
	externalFactorsSummary,
	shadingSummary,
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
