<script setup lang="ts">

import type { SummarySection } from "~/common.types";
import { getTabItems, getUrl } from "#imports";
const store = useEcaasStore();
const title = "Cooling summary";

const coolingUrl = "/cooling";

const airConditionings = store.cooling.airConditioning.data;
const airConditioningSummary: SummarySection = {
	id: "airConditioning",
	label: "Air conditioning systems",
	data: airConditionings.map((airConditioning) => {
		return {
			"Name": show(airConditioning.data.name),
			"Cooling capacity": dim(airConditioning.data.coolingCapacity, "kilowatt"),
			"Seasonal energy efficiency ratio": show(airConditioning.data.seasonalEnergyEfficiencyRatio),
			"Convection fraction": show(airConditioning.data.convectionFraction),
		};
	}) || [],
	editUrl: coolingUrl,
};

const coolingSummary: SummarySection[] = [
	airConditioningSummary,
];

</script>

<template>
	<Head>
		<Title>{{ title }}</Title>
	</Head>
	<h1 class="govuk-heading-l">{{ title }}</h1>
	<GovTabs v-slot="tabProps" :items="getTabItems(coolingSummary)">
		<SummaryTab :summary="airConditioningSummary" :selected="tabProps.currentItem?.id === 'airConditioning'">
			<template #empty>
				<h2 class="govuk-heading-m">No air conditioning systems added</h2>
				<NuxtLink class="govuk-link" :to="getUrl('airConditioningCreate')">
					Add air conditioning system
				</NuxtLink>
			</template>
		</SummaryTab>
	</GovTabs>

	<GovButton href="/">Return to overview</GovButton>
</template>
