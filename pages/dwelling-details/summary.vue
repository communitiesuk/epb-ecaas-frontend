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
		"Type of dwelling": generalDetailsData.typeOfDwelling ? displayCamelToSentenceCase(generalDetailsData.typeOfDwelling) : undefined,
		"Number of storeys in building": generalDetailsData.storeysInDwelling,
		"Storey of flat": generalDetailsData.typeOfDwelling === "flat" ? generalDetailsData.storeyOfFlat : undefined,
		"Number of bedrooms": generalDetailsData.numOfBedrooms,
		"Cooling required": displayBoolean(generalDetailsData.coolingRequired),
	},
	editUrl: getUrl("generalSpecifications"),
};

const shadingSummary: SummarySection = {
	id: "shading",
	label: "Shading",
	data: shadingData.map(s => {
		return {
			"Name": s.data.name,
			"Shading start angle": `${s.data.startAngle} ${degrees.suffix}`,
			"Shading end angle": `${s.data.endAngle} ${degrees.suffix}`,
			"Shading type": s.data.objectType ? displayCamelToSentenceCase(s.data.objectType) : undefined,
			"Height": `${s.data.height} ${metre.suffix}`,
			"Distance": `${s.data.distance} ${metre.suffix}`,
		};
	}) || [],
	editUrl: getUrl("shading"),
};

const externalFactorsSummary: SummarySection = {
	id: "externalFactors",
	label: "External factors",
	data: {
		"Altitude": externalFactors.altitude ? `${externalFactors.altitude} ${metre.suffix}` : undefined,
		"Type of exposure": externalFactors.typeOfExposure,
		"Terrain type": externalFactors.terrainType ? displayCamelToSentenceCase(externalFactors.terrainType) : undefined,
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
