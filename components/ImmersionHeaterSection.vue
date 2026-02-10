<script setup lang="ts">
import type { DomesticHotWaterHeatSourceData } from "#imports";
import { uniqueName } from "#imports";

const store = useEcaasStore();

defineProps<{
	model: Extract<DomesticHotWaterHeatSourceData, { "typeOfHeatSource": "immersionHeater" }>;
	index: number;
}>();

const heatSourceStoreData = store.domesticHotWater.heatSources.data;

</script>

<template>
	<FormKit
		id="name"
		type="govInputText"
		label="Name"
		help="Provide a name for this element so that it can be identified later"
		name="name"
		:validation-rules="{ uniqueName: uniqueName(heatSourceStoreData, { index }) }"
		validation="required | uniqueName"
		:validation-messages="{
			uniqueName: 'An element with this name already exists. Please enter a unique name.'
		}" />
	<FormKit
		id="power"
		type="govInputWithSuffix"
		label="Power"
		help="Enter the rated power of the immersion heater"
		name="power"
		validation="required | number"
		suffix-text="kW"
	/>
</template>