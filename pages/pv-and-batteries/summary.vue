<script setup lang="ts">
import type { SummarySection } from "~/common.types";
import { getTabItems, getUrl } from "#imports";

const title = "PV and electric batteries summary";
const store = useEcaasStore();

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

const electricBattery = store.pvAndBatteries.electricBattery.data;
const batterySummary: SummarySection = {
	id: "electricBattery",
	label: "Electric battery",
	data: electricBattery.map((battery) => {
		const displayBatteries = Object.entries(battery).map(([key, value]) => [displayCamelToSentenceCase(key), value]);
		return Object.fromEntries(displayBatteries);
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
		<SummaryTab :summary="pvSummary" :selected="tabProps.currentTab === 0">
			<template #empty>
				<h2 class="govuk-heading-m">No PV systems added</h2>
				<NuxtLink class="govuk-link" :to="getUrl('pvAndBatteries')">
					Add PV systems
				</NuxtLink>
			</template>
		</SummaryTab>
	</GovTabs>
	<GovTabs v-slot="tabProps" :items="getTabItems([batterySummary])">
		<SummaryTab :summary="batterySummary" :selected="tabProps.currentTab === 0">
			<template #empty>
				<h2 class="govuk-heading-m">No electric battery added</h2>
				<NuxtLink class="govuk-link" :to="getUrl('pvAndBatteries')">
					Add electric battery
				</NuxtLink>
			</template>
		</SummaryTab>
	</GovTabs>
	<NuxtLink to="/" class="govuk-button">Return to task list</NuxtLink>
</template>