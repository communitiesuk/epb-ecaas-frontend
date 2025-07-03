<script setup lang="ts">
import type { SummarySection } from "~/common.types";
import { getTabItems, getUrl } from "#imports";
const store = useEcaasStore();
const title = "PV and electric batteries summary";

const pvSystems = store.pvAndBatteries.pvSystems.data;
const pvSummary: SummarySection = {
	id: "pvSystems",
	label: "PV systems",
	data: pvSystems.map((pvSystem) => {
		const displayPvSystem = Object.entries(pvSystem).map(([key, value]) => {
			const displayKey = displayCamelToSentenceCase(key);
			const displayValue = typeof(value) === 'string' && value.includes("_") ? displaySnakeToSentenceCase(value) : value;
			return [displayKey, displayValue ];
		});
		return Object.fromEntries(displayPvSystem);
	}),
	editUrl: "/pv-and-batteries",
};

</script>
<template>
	<Head>
		<Title>{{ title }}</Title>
	</Head>
	<h1 class="govuk-heading-l">{{ title }}</h1>
	<GovTabs v-slot="tabProps" :items="getTabItems([pvSummary])">
		<TabPanel id="pvSystems" :selected="pvSummary.data.length === 0">
			<h2 class="govuk-heading-m">No PV systems added</h2>
			<NuxtLink class="govuk-link" :to="getUrl('pvAndBatteries')">
				Add PV systems
			</NuxtLink>
		</TabPanel>
		<SummaryTab
			:summary="pvSummary" :selected="tabProps.currentItem?.id === 'pvSystems'" />
	</GovTabs>
</template>