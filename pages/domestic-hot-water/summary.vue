<script setup lang="ts">
import type { SummarySection } from '~/common.types';
import { getTabItems, getUrl } from '#imports';

definePageMeta({ layout: false });

const title = "Domestic hot water";
const store = useEcaasStore();

const pipeworkData = store.domesticHotWater.pipework.data;

const pipeworkSummary: SummarySection = {
	id: 'pipework',
	label: "Pipework",
	data: pipeworkData.map(d => {
		return {
			"Name": d.name,
			"Location": d.location,
			"Length": d.length,
			"Internal diameter": d.internalDiameter
		};
	}) || []
};

const summarySections: SummarySection[] = [
	pipeworkSummary
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
				<GovSummaryTab :summary="pipeworkSummary" :selected="tabProps.currentTab === 0">
					<template #empty>
						<h2 class="govuk-heading-m">No pipework added</h2>
						<NuxtLink class="govuk-link" :to="`${getUrl(pipeworkSummary.id)}/create`">
							Add pipework
						</NuxtLink>
					</template>
				</GovSummaryTab>
			</GovTabs>
			<NuxtLink to="/" class="govuk-button">Return to task list</NuxtLink>
		</NuxtLayout>
	</div>
</template>
