<script setup lang="ts">
import { getUrl, type HeatSourceData, uniqueName } from "#imports";
import type { PageId } from "~/data/pages/pages";
import { celsius } from "~/utils/units/temperature";
import type { UnitValue } from "~/utils/units/types";
const route = useRoute();
const store = useEcaasStore();

const { model } = defineProps<{
	model: Extract<HeatSourceData, { "typeOfHeatSource": "heatPump" }>;
	index: number;
	boilers: [string, string][];
	addBoilerPageId: PageId;
	page: HeatSourceSectionPage;
}>();

const heatSources = getCombinedHeatSources(store);

const heatNetworkOptions = computed(() => {
	const heatNetworks = heatSources.filter(source => {
		return (source.data as HeatSourceData).typeOfHeatSource === "heatNetwork";
	});

	return Object.fromEntries(heatNetworks.map(network => {
		const networkData = network.data as Extract<HeatSourceData, { typeOfHeatSource: "heatNetwork" }>;
		return [
			networkData.id,
			{
				label: networkData.name,
				value: networkData.id,
			},
		];
	}));
});

const defaultAssociatedHeatNetworkId = computed(() => {
	const optionIds = Object.keys(heatNetworkOptions.value);
	return optionIds.length === 1 ? optionIds[0] : undefined;
});

const hasHeatNetworkOptions = computed(() => Object.keys(heatNetworkOptions.value).length > 0);

const greaterThanZero = (node: FormKitNode) => {
	const value = node.value as UnitValue;
	return value.amount > 0;
};
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
	<FormKit 
		id="isConnectedToHeatNetwork"
		type="govBoolean"
		:name="'isConnectedToHeatNetwork'"
		:label="'Is this heat pump connected to a heat network?'"
		:value="model.isConnectedToHeatNetwork"
	/>
	<FormKit
		v-if="model.isConnectedToHeatNetwork"
		id="associatedHeatNetwork"
		type="govRadios"
		label="Associated heat network"
		help="Select the heat network that this heat pump is connected to"
		:options="heatNetworkOptions"
		name="associatedHeatNetworkId"
		:value="model.associatedHeatNetworkId ?? defaultAssociatedHeatNetworkId"
	>		<div v-if="!hasHeatNetworkOptions">
		<p class="govuk-error-message">No heat networks added.</p>
		<NuxtLink :to="getUrl('spaceHeating')" class="govuk-link gov-radios-add-link">
			Click here to add a heat network
		</NuxtLink>
	</div>
	</FormKit>
	<FieldsEnergySupplies
		v-if="model.isConnectedToHeatNetwork === false"
		id="energySupply"
		name="energySupply"
		label="Energy supply"
		help="Select the relevant energy supply that has been added previously" />

	<FormKit
		id="maxFlowTemp"
		name="maxFlowTemp"
		label="Maximum flow temperature"
		:help="`Enter the highest flow temperature that the heat pump is allowed to operate at`"
		type="govInputWithUnit"
		:unit="celsius"
		:validation-rules="{ exclusiveRangeFromMin: greaterThanZero }"
		validation="required | exclusiveRangeFromMin:0"
		:validation-messages="{
			exclusiveRangeFromMin: `Maximum flow temperature must be greater than 0.`,
		}"
		:data-field="page == 'domestic hot water' ? 'HotWaterSource.*.HeatSource.*.temp_flow_limit_upper' :  'SpaceHeatSystem.*HeatSource.temp_flow_limit_upper'"
	/>
</template>