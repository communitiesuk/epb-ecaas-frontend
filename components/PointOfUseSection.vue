<script setup lang="ts">
import { uniqueName } from "#imports";

const store = useEcaasStore();

defineProps<{
	model: Extract<DomesticHotWaterHeatSourceData, { "typeOfHeatSource": "pointOfUse" }>;
	index: number;
}>();

const heatSources = getCombinedHeatSources(store);

</script>

<template>
	<FormKit
		id="name"
		type="govInputText"
		label="Name"
		help="Provide a name for this element so that it can be identified later"
		name="name"
		:validation-rules="{ uniqueName: uniqueName(heatSources, { id: model.id }) }"
		validation="required | uniqueName"
		:validation-messages="{
			uniqueName: 'An element with this name in domestic hot water or space heating already exists. Please enter a unique name.'
		}" />
	<FieldsEnergySupplies
		id="energySupply"
		name="energySupply"
		label="Energy supply"
		help="Select the relevant energy supply that has been added previously" />
</template>