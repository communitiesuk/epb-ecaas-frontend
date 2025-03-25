<script setup lang="ts">
import type { SummarySection } from '~/common.types';
import { getTabItems, getUrl } from '#imports';

definePageMeta({ layout: false });

const title = "Domestic hot water";
const store = useEcaasStore();

const primaryPipeworkData = store.domesticHotWater.pipework.primaryPipework.data;

const primaryPipeworkSummary: SummarySection = {
	id: 'primaryPipework',
	label: "Primary pipework",
	data: primaryPipeworkData.map(d => {
		return {
			"Name": d.name,
			"Location": d.location,
			"Length": d.length,
			"Internal diameter": d.internalDiameter
		};
	}) || []
};

const secondaryPipeworkData = store.domesticHotWater.pipework.secondaryPipework.data;

const secondaryPipeworkSummary: SummarySection = {
	id: 'pipework',
	label: "Secondary pipework",
	data: secondaryPipeworkData.map(d => {
		return {
			"Name": d.name,
			"Location": d.location,
			"Length": d.length,
			"Internal diameter": d.internalDiameter
		};
	}) || []
};

const summarySections: SummarySection[] = [
	primaryPipeworkSummary,
	secondaryPipeworkSummary
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
				<GovSummaryTab :summary="primaryPipeworkSummary" :selected="tabProps.currentTab === 0">
					<template #empty>
						<h2 class="govuk-heading-m">No pipework added</h2>
						<NuxtLink class="govuk-link" :to="`${getUrl(primaryPipeworkSummary.id)}/create`">
							Add pipework
						</NuxtLink>
					</template>
				</GovSummaryTab>
				<GovSummaryTab :summary="secondaryPipeworkSummary" :selected="tabProps.currentTab === 1">
					<template #empty>
						<h2 class="govuk-heading-m">No pipework added</h2>
						<NuxtLink class="govuk-link" :to="`${getUrl(secondaryPipeworkSummary.id)}/create`">
							Add pipework
						</NuxtLink>
					</template>
				</GovSummaryTab>
			</GovTabs>
			<NuxtLink to="/" class="govuk-button">Return to task list</NuxtLink>
		</NuxtLayout>
	</div>
</template>
