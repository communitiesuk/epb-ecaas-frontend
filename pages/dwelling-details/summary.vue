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
const appliancesData = store.dwellingDetails.appliances.data;

const generalDetailsSummary: SummarySection = {
	id: "generalDetails",
	label: "General details",
	data: {
		"Type of dwelling": displayCamelToSentenceCase(show(generalDetailsData.typeOfDwelling)),
		...(generalDetailsData.typeOfDwelling === "flat" ? { "Storey of flat": dim(generalDetailsData.storeyOfFlat) } : {}),
		"Number of storeys in building": dim(generalDetailsData.storeysInDwelling),
		"Building length": dim(generalDetailsData.buildingLength, "metres"),
		"Building width": dim(generalDetailsData.buildingWidth, "metres"),
		"Number of bedrooms": show(generalDetailsData.numOfBedrooms),
		"Number of utility rooms": show(generalDetailsData.numOfUtilityRooms),
		"Number of bathrooms": show(generalDetailsData.numOfBathrooms),
		"Number of WCs": show(generalDetailsData.numOfWCs),
		"Number of habitable rooms": show(generalDetailsData.numOfHabitableRooms),
		"Total number of rooms with tapping points": show(generalDetailsData.numOfRoomsWithTappingPoints),
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

const appliancesSummary: SummarySection = {
	id: "appliances",
	label: "Appliances",
	data: {
		"Appliances": displayApplianceType(appliancesData.applianceType),
	},
	editUrl: getUrl("appliances"),
};
</script>

<template>
	<!-- <NuxtLayout name="one-column"> -->
	<Head>
		<Title>{{ title }}</Title>
	</Head>
	<h1 class="govuk-heading-l">{{ title }}</h1>
	<GovTabs v-slot="tabProps" :items="getTabItems([generalDetailsSummary])">
		<SummaryTab :summary="generalDetailsSummary" :selected="tabProps.currentTab === 0"/>
	</GovTabs>
	<GovTabs v-slot="tabProps" :items="getTabItems([externalFactorsSummary])">
		<SummaryTab :summary="externalFactorsSummary" :selected="tabProps.currentTab === 0"/>
	</GovTabs>
	<GovTabs v-slot="tabProps" :items="getTabItems([shadingSummary])">
		<SummaryTab :summary="shadingSummary" :selected="tabProps.currentTab === 0">
			<template #empty>
				<h2 class="govuk-heading-m">No shading added</h2>
				<NuxtLink class="govuk-link" :to="getUrl('shadingCreate')">
					Add shading
				</NuxtLink>
			</template>
		</SummaryTab>
	</GovTabs>
	<GovTabs v-slot="tabProps" :items="getTabItems([appliancesSummary])">
		<SummaryTab :summary="appliancesSummary" :selected="tabProps.currentTab === 0"/>
	</GovTabs>
	<GovButton href="/">Return to overview</GovButton>
	<!-- </NuxtLayout> -->
</template>
