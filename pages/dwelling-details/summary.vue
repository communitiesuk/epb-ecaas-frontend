<script setup lang="ts">
import type { SummarySection } from '~/common.types';
import { getTabItems, getUrl } from '#imports';

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
		"Part G compliance": displayBoolean(generalSpecificationsData.partGCompliance),
		"Cooling required": displayBoolean(generalSpecificationsData.coolingRequired),
	},
	editUrl: getUrl('generalSpecifications')!
};

const appliancesAndElectricitySummary: SummarySection = {
	id: 'appliances',
	label: "Appliances",
	data: {
		"Appliances": appliancesData.appliances?.map(displayApplianceKey)
	},
	editUrl: getUrl('appliances')!
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
	generalSpecificationsSummary,
	externalFactorsSummary,
	shadingSummary,
	appliancesAndElectricitySummary
];
</script>

<template>
	<div>
		<NuxtLayout name="one-column">
			<Head>
				<Title>{{ title }}</Title>
			</Head>
			<h1 class="govuk-heading-l">{{ title }}</h1>
			<GovTabs v-slot="tabProps" :items="getTabItems(summarySections)">
				<SummaryTab :summary="generalSpecificationsSummary" :selected="tabProps.currentTab === 0"/>
				<SummaryTab :summary="externalFactorsSummary" :selected="tabProps.currentTab === 1"/>
				<SummaryTab :summary="shadingSummary" :selected="tabProps.currentTab === 2">
					<template #empty>
						<h2 class="govuk-heading-m">No shading added</h2>
						<NuxtLink class="govuk-link" :to="getUrl('shadingCreate')">
							Add shading
						</NuxtLink>
					</template>
				</SummaryTab>
				<SummaryTab :summary="appliancesAndElectricitySummary" :selected="tabProps.currentTab === 3"/>
			</GovTabs>
			<NuxtLink to="/" class="govuk-button">Return to task list</NuxtLink>
		</NuxtLayout>
	</div>
</template>
