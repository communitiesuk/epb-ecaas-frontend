<script setup lang="ts">
import { heatBatteryTypes, uniqueName } from "#imports";

const route = useRoute();
const store = useEcaasStore();

defineProps<{
	model: Extract<HeatSourceData, { "typeOfHeatSource": "heatBattery" }>;
	index: number;
}>();

const heatSources = getCombinedHeatSources(store);

const emit = defineEmits(["update-heat-battery-model"]);
</script>

<template>
	<FormKit
		id="typeOfHeatBattery"
		type="govRadios"
		label="Type of heat battery"
		:options="heatBatteryTypes"
		name="typeOfHeatBattery"
		validation="required"
		@click="emit('update-heat-battery-model', 'typeOfHeatBattery')" />
	<div v-show="model.typeOfHeatBattery">
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
		<FormKit
			id="selectHeatBattery"
			type="govPcdbProduct"
			label="Select a heat battery"
			name="productReference"
			validation="required"
			help="Select the heat battery type from the PCDB using the button below."
			:selected-product-reference="model.productReference"
			:selected-product-type="model.typeOfHeatBattery"
			:page-url="route.fullPath"
			:page-index="index" />
		<FormKit
			id="numberOfUnits"
			type="govInputInt"
			name="numberOfUnits"
			label="Number of units"
			validation="required | isInteger | min:1"
			:validation-messages="{
				isInteger: `Number of units must be an integer.`,
			}" />
		<FieldsEnergySupplies
			id="energySupply"
			name="energySupply"
			label="Energy supply"
			help="Select the relevant energy supply that has been added previously" />
	</div>
</template>