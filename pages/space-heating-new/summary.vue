<script setup lang="ts">
import type { SummarySection } from "~/common.types";
import { getTabItems, getUrl } from "#imports";
const store = useEcaasStore();
const title = "Space heating NEW summary";

const spaceHeatingUrl = "/space-heating-new";

const heatSources = store.spaceHeatingNew.heatSource.data;
const heatSourceSummary: SummarySection = {
	id: "heatSource",
	label: "Heat sources",
	data:
		heatSources.map((heatSource) => {
			return {
				Name: show(heatSource.data.name),
				"Type of heat source": displayHeatSourceType(heatSource.data.typeOfHeatSource),
			};
		}) || [],
	editUrl: spaceHeatingUrl,
};

const heatingControls = store.spaceHeatingNew.heatingControls.data;
const heatingControlsSummary: SummarySection = {
	id: "heatingControla",
	label: "Heating controls",
	data:
		heatingControls.map( ({ data: x } ) => {
			return {
				"Type of heating control": displayCamelToSentenceCase(show(x.heatingControlType)),
			};
		}) || [],
	editUrl: spaceHeatingUrl,
};

</script>
<template>
	<Head>
		<Title>{{ title }}</Title>
	</Head>
	<h1 class="govuk-heading-l">{{ title }}</h1>
	<GovTabs v-slot="tabProps" :items="getTabItems([heatSourceSummary])">
		<SummaryTab :summary="heatSourceSummary" :selected="tabProps.currentTab === 0">
			<template #empty>
				<h2 class="govuk-heading-m">No heat sources added</h2>
				<NuxtLink class="govuk-link" :to="getUrl('heatSourceCreate')"> 
					Add heat source
				</NuxtLink>
			</template>
		</SummaryTab>
	</GovTabs>
	<GovTabs v-slot="tabProps" :items="getTabItems([heatingControlsSummary])">
		<SummaryTab :summary="heatingControlsSummary" :selected="tabProps.currentTab === 0">
			<template #empty>
				<h2 class="govuk-heading-m">No heating controls added</h2>
				<NuxtLink class="govuk-link" :to="getUrl('heatingControls')"> 
					Add heating controls
				</NuxtLink>
			</template>
		</SummaryTab>
	</GovTabs>
	<GovButton href="/">Return to overview</GovButton>
</template>
