<script setup lang="ts">
import type { SummarySection } from '~/common.types';
import { getTabItems, getUrl } from '#imports';
import { BuildType } from '~/schema/api-schema.types';

definePageMeta({ layout: false });

const title = "Dwelling details summary";
const store = useEcaasStore();

const generalSpecificationsData = store.dwellingDetails.generalSpecifications.data;
const shadingData = store.dwellingDetails.shading.data;
const externalFactors = store.dwellingDetails.externalFactors.data;

const generalSpecificationsSummary: SummarySection = {
	id: 'generalSpecifications',
	label: "General specifications",
	data: {
		"Type of dwelling": generalSpecificationsData.typeOfDwelling,
		"Number of storeys in building": generalSpecificationsData.storeysInDwelling,
		"Storey of flat": generalSpecificationsData.typeOfDwelling === BuildType.flat ? generalSpecificationsData.storeyOfFlat : undefined,
		"Number of bedrooms": generalSpecificationsData.numOfBedrooms,
		"Part G compliance": displayBoolean(generalSpecificationsData.partGCompliance),
		"Cooling required": displayBoolean(generalSpecificationsData.coolingRequired),
	},
	editUrl: getUrl('generalSpecifications')!
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
			</GovTabs>
			<NuxtLink to="/" class="govuk-button">Return to task list</NuxtLink>
		</NuxtLayout>
	</div>
</template>
