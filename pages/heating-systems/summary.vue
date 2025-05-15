<script setup lang="ts">
import type { SummarySection } from "~/common.types";
import { getTabItems } from "#imports";
const store = useEcaasStore();
const title = "Heating system summary";

const energySupplySummary: SummarySection = {
	id: "energySupply",
	label: "Energy supply",
	data: {
		"Fuel type": store.heatingSystems.energySupply.data.fuelType,
		"Exported": store.heatingSystems.energySupply.data.exported,
		"CO2 per kWh": store.heatingSystems.energySupply.data.co2PerKwh,
		"CO2 per kWh (including out of scope)": store.heatingSystems.energySupply.data.co2PerKwhIncludingOutOfScope,
		"kWh per kWh delivered": store.heatingSystems.energySupply.data.kwhPerKwhDelivered,
	},
	editUrl: "",
};
</script>
<template>
	<Head>
		<Title>{{ title }}</Title>
	</Head>
	<h1 class="govuk-heading-l">{{ title }}</h1>
	<GovTabs v-slot="tabProps" :items="getTabItems([energySupplySummary])">
		<SummaryTab
			:summary="energySupplySummary"
			:selected="tabProps.currentTab === 0"
		/>
	</GovTabs>
</template>
