<script setup lang="ts">
import type { SummarySection } from '~/common.types';
import { getTabItems, getUrl } from '#imports';

definePageMeta({ layout: false });

const title = "Hot water outlets";
const store = useEcaasStore();

const hotWaterDistributionData = store.hotWaterOutlets.hotWaterDistribution.data;

const hotWaterDistributionSummary: SummarySection = {
	id: 'hotWaterDistribution',
	label: "Hot water distribution",
	data: hotWaterDistributionData.distributions?.map(d => {
		return {
			"Name": d.name,
			"Location": d.location,
			"Length": d.length,
			"Internal diameter": d.internalDiameter
		};
	}) || []
};

const summarySections: SummarySection[] = [
	hotWaterDistributionSummary
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
				<GovSummaryTab :summary="hotWaterDistributionSummary" :selected="tabProps.currentTab === 0">
					<template #empty>
						<h2 class="govuk-heading-m">No distributions added</h2>
						<NuxtLink class="govuk-link" :to="`${getUrl(hotWaterDistributionSummary.id)}/create`">
							Add distributions
						</NuxtLink>
					</template>
				</GovSummaryTab>
			</GovTabs>
			<NuxtLink to="/" class="govuk-button">Return to task list</NuxtLink>
		</NuxtLayout>
	</div>
</template>
