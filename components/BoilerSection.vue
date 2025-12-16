<script setup lang="ts">
import type { AdjacentSpaceType, BoilerType, BoilerTypeDisplay, HeatSourceData } from "#imports";
import { uniqueName } from "#imports";
import type { BoilerLocationDisplay } from "~/utils/display";
const route = useRoute();
const store = useEcaasStore();
const { getStoreIndex } = useForm();

defineProps<{
	model: Extract<HeatSourceData, { "typeOfHeatSource": "boiler" }>;
}>();

const heatSourceStoreData = store.spaceHeatingNew.heatSource.data;
const index = getStoreIndex(heatSourceStoreData);

const boilerTypeOptions = {
	"combiBoiler": "Combi boiler",
	"regularBoiler": "Regular boiler",
} as const satisfies Record<BoilerType, BoilerTypeDisplay>;

const locationOfBoilerOptions = {
	"heatedSpace": "Heated space",
	"unheatedSpace": "Unheated space",
} as const satisfies Record<AdjacentSpaceType, BoilerLocationDisplay>;

</script>

<template>	
	<FormKit
		id="typeOfBoiler"
		type="govRadios"
		label="Type of boiler"
		:options="boilerTypeOptions"
		name="typeOfBoiler"
		validation="required"
	/>
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
		}"
	/>
	<FormKit
		id="selectBoiler"
		type="govPcdbProduct"
		label="Select a boiler"
		name="productReference"
		validation="required"
		help="Select the boiler type from the PCDB using the button below."
		:selected-product-reference="model.productReference"
		:selected-product-type="boilerTypeOptions[model.typeOfBoiler]"
		:page-url="route.fullPath"
		:page-index="index"
	/>
	<FormKit
		id="locationOfBoiler"
		type="govRadios"
		label="Location of boiler"
		:options="locationOfBoilerOptions"
		name="locationOfBoiler"
		validation="required"
	/>
</template>