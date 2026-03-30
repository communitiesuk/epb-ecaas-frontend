<script setup lang="ts">
import { type HeatSourceData, uniqueName } from "#imports";
import type { PageId } from "~/data/pages/pages";
const route = useRoute();
const store = useEcaasStore();

type HeatPumpSectionPage = "space-heating" | "domestic-hot-water";

const { model } = defineProps<{
	model: Extract<HeatSourceData, { "typeOfHeatSource": "heatPump" }>;
	index: number;
	boilers: [string, string][];
	addBoilerPageId: PageId;
	page: HeatPumpSectionPage;
}>();

const heatSources = getCombinedHeatSources(store);
</script>

<template>
	<FormKit
		id="name"
		:value="model.name"
		type="govInputText"
		label="Name"
		help="Provide a name for this element so that it can be identified later"
		name="name"
		:validation-rules="{ uniqueName: uniqueName(heatSources, { id: model.id }) }"
		validation="required | uniqueName"
		:validation-messages="{
			uniqueName: 'An element with this name in domestic hot water or space heating already exists. Please enter a unique name.'
		}" />
	<FieldsSelectPcdbProduct
		help="Select the heat pump type from the PCDB using the button below"
		:selected-product-reference="model.productReference"
		:selected-product-type="'heatPump' /* this might need to be updated to pass through either which of DHW or SH, or just the list of different products */"
		:page-url="route.fullPath"
		:page-index="index" />
</template>