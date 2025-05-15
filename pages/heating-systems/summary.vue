<script setup lang="ts">
import type { SummarySection } from "~/common.types";
import { getTabItems } from "#imports";

const title = "Heating system summary";

const energySupplySummary: SummarySection = {
	id: "energySupply",
	label: "Energy supply", 
	data: {},
	editUrl: ""
};
</script>
<template>
	<Head>
		<Title>{{ title }}</Title>
	</Head>
	<h1 class="govuk-heading-l">{{ title }}</h1>
	<GovTabs v-slot="tabProps" :items="getTabItems([energySupplySummary])">
		<GovSummaryTab :summary="energySupplySummary" :selected="tabProps.currentTab === 0" />
	</GovTabs>
</template>