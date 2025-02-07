<script setup lang="ts">
import type { SummarySection } from '~/components/GovSummaryCard.vue';

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
			"Internal diameter": d.internalDiameter,
			"External diameter": d.externalDiameter,
			"Insulation thickness": d.insulationThickness,
			"Insulation thermal conductivity": d.insulationThermalConductivity,
			"Reflective insulation": d.surfaceReflectivity,
			"Pipe contents": d.pipeContents
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
			<GovSummaryCard :summary-sections="summarySections" />
			<NuxtLink to="/" class="govuk-button">Return to task list</NuxtLink>
		</NuxtLayout>
	</div>
</template>
