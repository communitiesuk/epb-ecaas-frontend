<script setup lang="ts">
import type { SummarySection } from "~/common.types";
import { getTabItems, getUrl } from "#imports";

const title = "Domestic hot water";
const store = useEcaasStore();

const mixedShowerData = store.domesticHotWater.hotWaterOutlets.mixedShower.data;
const mixedShowerSummary: SummarySection = {
	id: "mixedShower",
	label: "Mixer showers",
	data: mixedShowerData.map(d => { 
		return {
			"Name": show(d.data.name),
			"Flow rate": dim(d.data.flowRate, "litres per hour"),
		};
	}),
	editUrl: getUrl("hotWaterOutlets"),
};

const electricShowerData = store.domesticHotWater.hotWaterOutlets.electricShower.data;
const electricShowerSummary: SummarySection = {
	id: "electricShower",
	label: "Electric showers",
	data: electricShowerData.map(d => {   
		return {
			"Name": show(d.data.name),
			"Rated power": dim(d.data.ratedPower, "kilowatt"),
		};
	}),
	editUrl: getUrl("hotWaterOutlets"),
};

const bathData = store.domesticHotWater.hotWaterOutlets.bath.data;
const bathSummary: SummarySection = {
	id: "bath",
	label: "Baths",
	data: bathData.map(d => {
		return {
			"Name": show(d.data.name),
			"Size": dim(d.data.size, "litres"),
		};
	}),
	editUrl: getUrl("hotWaterOutlets"),
};

const otherOutletsData = store.domesticHotWater.hotWaterOutlets.otherOutlets.data;
const otherOutletsSummary: SummarySection = {
	id: "otherOutlets",
	label: "Other",
	data: otherOutletsData.map(d => {
		return {
			"Name": show(d.data.name),
			"Flow rate": dim(d.data.flowRate, "litres per minute"),
		};
	}),
	editUrl: getUrl("hotWaterOutlets"),
};

const hotWaterOutletsSummarySections: SummarySection[] = [
	mixedShowerSummary,
	electricShowerSummary,
	bathSummary,
	otherOutletsSummary,
];

const pipeworkData = store.domesticHotWaterNew.pipework.data;
const pipeworkSummary: SummarySection = {
	id: "pipework",
	label: "Pipework",
	data: pipeworkData.map(d => {
		return {
			"Name": show(d.data.name),
			"Location": displayCamelToSentenceCase(show(d.data.location)),
			"Pipe contents": displayCamelToSentenceCase(show(d.data.pipeContents)),
			"Internal diameter": dim(d.data.internalDiameter, "millimetres"),
			"External diameter": dim(d.data.externalDiameter, "millimetres"),
			"Length": dim(d.data.length, "metres"),
			"Insulation thickness": dim(d.data.insulationThickness, "millimetres"),
			"Thermal conductivity": dim(d.data.thermalConductivity, "watts per metre kelvin") ,
			"Surface reflectivity": displayReflectivity(d.data.surfaceReflectivity),
		};
	}) || [],
	editUrl: getUrl("domesticHotWaterNew"),
};

const pipeworkSummarySections: SummarySection[] = [
	pipeworkSummary,
];

</script>

<template>
	<Head>
		<Title>{{ title }}</Title>
	</Head>
	<h1 class="govuk-heading-l">{{ title }}</h1>

	<GovTabs v-slot="tabProps" :items="getTabItems(hotWaterOutletsSummarySections)">
		<SummaryTab :summary="mixedShowerSummary" :selected="tabProps.currentTab === 0">
			<template #empty>
				<h2 class="govuk-heading-m">No mixer shower added</h2>
				<NuxtLink class="govuk-link" :to="getUrl('mixedShowerCreate')">
					Add mixer shower
				</NuxtLink>
			</template>
		</SummaryTab>
		<SummaryTab :summary="electricShowerSummary" :selected="tabProps.currentTab === 1">
			<template #empty>
				<h2 class="govuk-heading-m">No electric shower added</h2>
				<NuxtLink class="govuk-link" :to="getUrl('electricShowerCreate')">
					Add electric shower
				</NuxtLink>
			</template>
		</SummaryTab>
		<SummaryTab :summary="bathSummary" :selected="tabProps.currentTab === 2">
			<template #empty>
				<h2 class="govuk-heading-m">No bath added</h2>
				<NuxtLink class="govuk-link" :to="getUrl('bathCreate')">
					Add bath
				</NuxtLink>
			</template>
		</SummaryTab>
		<SummaryTab :summary="otherOutletsSummary" :selected="tabProps.currentTab === 3">
			<template #empty>
				<h2 class="govuk-heading-m">No outlet added</h2>
				<NuxtLink class="govuk-link" :to="getUrl('otherOutletsCreate')">
					Add outlet
				</NuxtLink>
			</template>
		</SummaryTab>
	</GovTabs>
	<GovTabs v-slot="tabProps" :items="getTabItems(pipeworkSummarySections)">
		<SummaryTab :summary="pipeworkSummary" :selected="tabProps.currentTab === 0">
			<template #empty>
				<h2 class="govuk-heading-m">No pipework added</h2>
				<NuxtLink class="govuk-link" :to="getUrl('pipeworkNewCreate')">
					Add pipework
				</NuxtLink>
			</template>
		</SummaryTab>
	</GovTabs>
	<GovButton href="/">Return to overview</GovButton>
</template>
