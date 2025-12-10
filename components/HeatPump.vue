<script setup lang="ts">
import { type HeatSourceData, uniqueName } from "#imports";
import { heatPumpTypes } from "../utils/display";
const route = useRoute();
const store = useEcaasStore();
const { getStoreIndex } = useForm();

const props = defineProps<{
	model: Extract<HeatSourceData, { "typeOfHeatSource": "heatPump" }>;
}>();

const heatSourceStoreData = store.spaceHeatingNew.heatSource.data;
const index = getStoreIndex(heatSourceStoreData);
</script>

<template>	
	<FormKit
		id="name"
		type="govInputText"
		label="Name"
		help="Provide a name for this heat pump so that it can be identified later"
		name="name"
		:validation-rules="{ uniqueName: uniqueName(heatSourceStoreData, { index }) }"
		validation="required | uniqueName"
		:validation-messages="{
			uniqueName: 'An element with this name already exists. Please enter a unique name.'
		}"
	/>
	<FormKit
		id="typeOfHeatPump"
		type="govRadios"
		label="Type of heat pump"
		:options="heatPumpTypes"
		name="typeOfHeatPump"
		validation="required"
	/>
	<FormKit
		v-if="model?.typeOfHeatPump !== undefined"
		id="selectHeatPump"
		:key="props.model.typeOfHeatPump"
		type="govPcdbProduct"
		label="Select a heat pump"
		name="productReference"
		validation="required"
		help="Select the air source heat pump type from the PCDB using the button below."
		:selected-product-reference="model.productReference"
		:selected-product-type="heatPumpTypes[props.model.typeOfHeatPump]"
		:page-url="route.fullPath"
		:page-index="index"
	/>
</template>