<script setup lang="ts">
import { getUrl, typeOfHeatSource, uniqueName } from "#imports";
import { watt } from "~/utils/units/power";
import type { AnyPcdbProduct } from "~/pcdb/pcdb.types";
import { useHeatNetworks } from "~/composables/heatNetworks";

const route = useRoute();
const store = useEcaasStore();

defineProps<{
	model: Extract<HeatSourceData | DomesticHotWaterHeatSourceData, { "typeOfHeatSource": "heatInterfaceUnit" }>;
	index: number;
	page: "domestic hot water" | "space heating";
	onProductLoaded?: (product: AnyPcdbProduct) => void;
}>();

const heatSources = getCombinedHeatSources(store);

const { heatNetworkOptions, hasHeatNetworkOptions, defaultAssociatedHeatNetworkId } = useHeatNetworks();

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
		id="selectHeatInterfaceUnit"
		label="Select a heat interface unit"
		help="Select the heat interface unit type from the PCDB using the button below"
		:selected-product-reference="model.productReference"
		:selected-product-type="typeOfHeatSource.heatInterfaceUnit"
		:page-url="route.fullPath"
		:page-index="index"
		@product-loaded="onProductLoaded"
	/>
	<FormKit
		id="associatedHeatNetwork"
		type="govRadios"
		label="Associated heat network"
		help="Select the heat network that this heat pump is connected to"
		:options="heatNetworkOptions"
		name="associatedHeatNetworkId"
		:value="model.associatedHeatNetworkId ?? defaultAssociatedHeatNetworkId"
	>
		<div v-if="!hasHeatNetworkOptions">
			<p class="govuk-error-message">No heat networks added.</p>
			<NuxtLink :to="`${getUrl('heatSourceCreate')}?typeOfHeatSource=heatNetwork`" class="govuk-link gov-radios-add-link">
				Click here to add a heat network
			</NuxtLink>
		</div>
	</FormKit>
	<FieldsMaxFlowTemp 
		:model="model" 
		:page="page"
		help="Enter the highest flow temperature the HIU is allowed to operate at"
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