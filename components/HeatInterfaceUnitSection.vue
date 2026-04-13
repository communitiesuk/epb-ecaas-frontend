<script setup lang="ts">
import { typeOfHeatSource, uniqueName } from "#imports";
import { watt } from "~/utils/units/power";

const route = useRoute();
const store = useEcaasStore();

defineProps<{
	model: Extract<HeatSourceData, { "typeOfHeatSource": "heatInterfaceUnit" }>;
	index: number;
	page: "domestic hot water" | "space heating";
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
	<FormKit
		id="selectHeatInterfaceUnit"
		type="govPcdbProduct"
		label="Select a heat interface unit"
		name="productReference"
		validation="required"
		help="Select the heat interface unit type from the PCDB using the button below."
		:selected-product-reference="model.productReference"
		:selected-product-type="typeOfHeatSource.heatInterfaceUnit"
		:page-url="route.fullPath"
		:page-index="index" 
	/>
	<FieldsMaxFlowTemp 
		:model="model" 
		:page="page"
		help="Enter the highest flow temperature the HUI is allowed to operate at for space heating."
	/>
	<FormKit
		id="associatedHeatNetwork"
		type="govRadios"
		label="Is this heat interface unit associated with a heat network?"
		:options="{}"
		name="associatedHeatNetwork"
	/>
	<FormKit
		id="buildingLevelLosses"
		type="govInputWithUnit"
		label="Building level losses"
		help="Enter the heat loss that occurs in the pipework within the thermal envelope of a building, specifically apartment blocks, up to the dwelling boundary"
		name="buildingLevelLosses"
		:unit="watt"
	/>
</template>