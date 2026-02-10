<script setup lang="ts">
import { uniqueName } from "#imports";

const store = useEcaasStore();

defineProps<{
	model: Extract<DomesticHotWaterHeatSourceData, { "typeOfHeatSource": "pointOfUse" }>;
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
	<FieldsEnergySupplies
		id="energySupply"
		name="energySupply"
		label="Energy supply"
		help="Select the relevant energy supply that has been added previously" />
	<FormKit
		id="heaterEfficiency"
		type="govInputInt"
		label="Heater efficiency"
		help="Enter the the efficiency of the heater as a decimal between 0 and 1"
		name="heaterEfficiency"
		validation="required | number | min:0 | max:1"
	/>
</template>