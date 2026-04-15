<script setup lang="ts">
import { heatNetworkTypes, uniqueName } from "#imports";
import type { PageId } from "~/data/pages/pages";

const route = useRoute();
const store = useEcaasStore();

defineProps<{
	model: Extract<HeatSourceData, { "typeOfHeatSource": "heatNetwork" }>;
	index: number;
	section: PageId;
}>();

const heatSources = getCombinedHeatSources(store);

const emit = defineEmits(["update-heat-network-model"]);

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
	
	
	<FieldsSelectPcdbProduct
		id="selectHeatNetwork"
		name="productReference"
		label="Select a product"
		help="Select a heat network product from the PCDB using the button below"
		:selected-product-reference="model.productReference"
		:selected-product-type="model.typeOfHeatSource"
		:page-index="index"
		:page-url="route.fullPath"
	/>
	<FormKit
		id="typeOfHeatNetwork"
		type="govRadios"
		label="Type of heat network"
		:options="heatNetworkTypes"
		name="typeOfHeatNetwork"
		validation="required"
		@click="emit('update-heat-network-model', 'typeOfHeatNetwork')" />
	<GovInset>
		<p>
			If you have a heat interface unit (HIU) or booster heat pump as well as the heat network, enter it seperately.
		</p>

	</GovInset>
		
</template> 